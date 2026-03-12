import { EngineService } from '../src/modules/engine/services/engine.service.js';
import tmp from 'tmp';
import fse from 'fs-extra';
import { bindMockConfig, DBConfigs, testContainer } from './mock/mock.config.js';
import { waitEngineStart } from './mock/mock.engine.js';
import { initTest } from './init.js';
import { MockFeed1 } from './mock/mock.rss-feed.js';
import { Podcast } from '../src/entity/podcast/podcast.js';
import { mockNock, mockNockURL } from './mock/mock.nock.js';
import { Orm } from '../src/modules/engine/services/orm.service.js';
import { PodcastStatus, DBObjectType, ListType } from '../src/types/enums.js';
import nock from 'nock';
import { Op } from 'sequelize';
import { StateHelper } from '../src/entity/state/state.helper.js';
import { hashMD5 } from '../src/utils/md5.js';
import { User } from '../src/entity/user/user.js';
import { randomString } from '../src/utils/random.js';
import { describe, beforeEach, afterEach, expect, it } from '@jest/globals';

initTest();

/**
 * Generate a cryptographically secure random salt string for testing.
 * Uses randomString utility instead of Math.random() to ensure proper entropy.
 */
function salt(length: number): string {
	return randomString(length);
}

describe.each(DBConfigs)('Services with %o', db => {
	let engine: EngineService;
	let orm: Orm;
	let dir: tmp.DirResult;
	let user: User;

	beforeEach(async () => {
		nock.cleanAll();

		dir = tmp.dirSync();
		bindMockConfig(dir.name, db);

		engine = testContainer.get(EngineService);
		await engine.init();
		await engine.orm.drop();
		await engine.start();
		await waitEngineStart(engine);
		orm = engine.orm.fork();
		user = await orm.User.oneOrFail({ where: { name: 'admin' } });
	});

	afterEach(async () => {
		await engine.stop();
		await fse.remove(dir.name);
	});

	describe('userService', () => {
		it('should auth the user by token', async () => {
			const session = await engine.session.createSubsonic(user.id);
			const s = salt(6);
			const token = hashMD5(`${session?.jwth}${s}`);
			const result = await engine.user.authSubsonicToken(orm, user.name, token, s);
			expect(result).toBeDefined();
			expect(result.id).toEqual(user.id);
		});
		it('should not auth the user with the wrong token', async () => {
			await expect(engine.user.authSubsonicToken(orm, user.name, 'wrong', 'wrong')).rejects.toMatchObject({ code: 40 });
			await expect(engine.user.authSubsonicToken(orm, ' ', 'wrong', 'wrong')).rejects.toMatchObject({ code: 10 });
			await expect(engine.user.authSubsonicToken(orm, user.name, '', 'wrong')).rejects.toMatchObject({ code: 10 });
			await expect(engine.user.authSubsonicToken(orm, user.name, 'wrong', '')).rejects.toMatchObject({ code: 40 });
			await expect(engine.user.authSubsonicToken(orm, 'non-existing', 'wrong', 'wrong')).rejects.toMatchObject({ code: 40 });
		});
	});

	describe('podcastService', () => {
		let podcast: Podcast;

		beforeEach(async () => {
			podcast = await engine.podcast.create(orm, mockNockURL('podcast.xml'));
		});

		it('should fail to refresh a podcast', async () => {
			await engine.podcast.refresh(orm, podcast);
			expect(podcast.errorMessage).toEqual(expect.stringMatching(/Nock: Disallowed net connec/));
		});

		it('should try to refresh a podcast', async () => {
			const scope = mockNock().get('/podcast.xml').reply(404);
			await engine.podcast.refresh(orm, podcast);
			expect(scope.isDone()).toBe(true); //  'No request has been made'
			expect(podcast.errorMessage).toEqual(expect.stringMatching(/Bad status code 404/));
		});

		it('should handle an invalid feed', async () => {
			const feed = '';
			const scope = mockNock()
				.get('/podcast.xml').reply(200, feed, { 'Content-Type': '' });
			await engine.podcast.refresh(orm, podcast);
			expect(podcast.status).toBe(PodcastStatus.error);
			expect(scope.isDone()).toBe(true); //  'No request has been made'
		});

		it('should refresh a podcast', async () => {
			const scope = mockNock()
				.get('/podcast.xml').reply(200, MockFeed1.xml, { 'Content-Type': 'application/xml; charset=utf-8' });
			await engine.podcast.refresh(orm, podcast);
			expect(scope.isDone()).toBe(true); //  'No request has been made'
			expect(podcast).toEqual(expect.objectContaining(MockFeed1.expected.podcast));
			expect(await podcast.episodes.count()).toBe(1);
			const items = await podcast.episodes.getItems();
			expect(items.at(0)).toEqual(expect.objectContaining(MockFeed1.expected.episode1));
		});

		it('should update a podcast', async () => {
			let scope = mockNock()
				.get('/podcast.xml').reply(200, MockFeed1.xml, { 'Content-Type': 'application/xml; charset=utf-8' });
			await engine.podcast.refresh(orm, podcast);
			expect(scope.isDone()).toBe(true); //  'No request has been made'
			scope = mockNock()
				.get('/podcast.xml').reply(200, MockFeed1.xml_update, { 'Content-Type': 'application/xml; charset=utf-8' });
			await engine.podcast.refresh(orm, podcast);
			expect(scope.isDone()).toBe(true); //  'No request has been made'

			expect(podcast).toEqual(expect.objectContaining(MockFeed1.expected.podcast));
			expect(await podcast.episodes.count()).toBe(2);
			const items = await podcast.episodes.getItems();
			expect(items.find(item => item.guid === MockFeed1.expected.episode1.guid)).toEqual(expect.objectContaining(MockFeed1.expected.episode1));
			expect(items.find(item => item.guid === MockFeed1.expected.episode2.guid)).toEqual(expect.objectContaining(MockFeed1.expected.episode2));
		});
	});

	describe('state/list avghighest', () => {
		it('should aggregate average rating in DB and ignore unrated entries', async () => {
			const genreA = orm.Genre.create({ name: 'Genre A' });
			const genreB = orm.Genre.create({ name: 'Genre B' });
			const genreC = orm.Genre.create({ name: 'Genre C' });
			const missingGenreID = orm.Genre.create({ name: 'Missing Genre ID' }).id;
			const unratedGenreID = orm.Genre.create({ name: 'Ignored Unrated ID' }).id;
			await orm.Genre.persistAndFlush([genreA, genreB, genreC]);

			const user2 = await engine.user.createUser(orm, 'avg-user', 'avg@localhost', 'test', false, true, false, false);
			const helper = new StateHelper(orm.em);
			await helper.rate(genreA.id, DBObjectType.genre, user, 5);
			await helper.rate(genreA.id, DBObjectType.genre, user2, 3);
			await helper.rate(genreB.id, DBObjectType.genre, user, 4);
			await helper.rate(genreB.id, DBObjectType.genre, user2, 4);
			await helper.rate(genreC.id, DBObjectType.genre, user, 5);
			await helper.rate(missingGenreID, DBObjectType.genre, user, 5);
			await helper.rate(unratedGenreID, DBObjectType.genre, user, 0);

			const ids = await helper.getAvgHighestDestIDs(DBObjectType.genre);
			expect(ids.slice(0, 2).sort()).toEqual([genreC.id, missingGenreID].sort());
			expect(ids.slice(2).sort()).toEqual([genreA.id, genreB.id].sort());
			expect(ids).not.toContain(unratedGenreID);
		});

		it('should apply avghighest ordering before filtering and pagination', async () => {
			const genreA = orm.Genre.create({ name: 'Avg Genre A' });
			const genreB = orm.Genre.create({ name: 'Avg Genre B' });
			const genreC = orm.Genre.create({ name: 'Avg Genre C' });
			const missingGenreID = orm.Genre.create({ name: 'Missing Genre ID List' }).id;
			await orm.Genre.persistAndFlush([genreA, genreB, genreC]);

			const user2 = await engine.user.createUser(orm, 'avg-list-user', 'avg-list@localhost', 'test', false, true, false, false);
			const helper = new StateHelper(orm.em);
			await helper.rate(genreA.id, DBObjectType.genre, user, 5);
			await helper.rate(genreA.id, DBObjectType.genre, user2, 3);
			await helper.rate(genreB.id, DBObjectType.genre, user, 5);
			await helper.rate(genreB.id, DBObjectType.genre, user2, 5);
			await helper.rate(genreC.id, DBObjectType.genre, user, 3);
			await helper.rate(missingGenreID, DBObjectType.genre, user, 5);

			const result = await orm.Genre.findList(ListType.avghighest, undefined, {
				where: { name: { [Op.in]: ['Avg Genre A', 'Avg Genre C'] } },
				offset: 0,
				limit: 1
			}, user.id);

			expect(result.total).toBe(2);
			expect(result.items.map(item => item.id)).toEqual([genreA.id]);
		});
	});
});
