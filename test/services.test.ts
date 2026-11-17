import { EngineService } from '../src/modules/engine/services/engine.service.js';
import tmp from 'tmp';
import fse from 'fs-extra';
import { bindMockConfig, DBConfigs, getTestContainer } from './mock/mock.config.js';
import { waitEngineStart } from './mock/mock.engine.js';
import { MockFeed1 } from './mock/mock.rss-feed.js';
import { Podcast } from '../src/entity/podcast/podcast.js';
import { mockNock, mockNockURL } from './mock/mock.nock.js';
import { Orm } from '../src/modules/engine/services/orm.service.js';
import { PodcastStatus, DBObjectType, ListType, SessionMode } from '../src/types/enums.js';
import nock from 'nock';
import { Op } from 'sequelize';
import { StateHelper } from '../src/entity/state/state.helper.js';
import { hashMD5 } from '../src/utils/md5.js';
import { User } from '../src/entity/user/user.js';
import { randomString } from '../src/utils/random.js';
import { describe, beforeEach, afterEach, expect, it } from '@jest/globals';
import { Cookie } from 'express-session';
import { SessionData } from '../src/types/express.js';

/*
Generate a cryptographically secure random salt string for testing.
Uses randomString utility instead of Math.random() to ensure proper entropy.
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

		engine = getTestContainer().get(EngineService);
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
			expect(ids.slice(0, 2).sort((a, b) => a.localeCompare(b))).toEqual([genreC.id, missingGenreID].sort((a, b) => a.localeCompare(b)));
			expect(ids.slice(2).sort((a, b) => a.localeCompare(b))).toEqual([genreA.id, genreB.id].sort((a, b) => a.localeCompare(b)));
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

	describe('sessionService', () => {
		function makeCookie(expires: Date): Cookie {
			return { expires, originalMaxAge: expires.valueOf() - Date.now(), path: '/', httpOnly: true } as unknown as Cookie;
		}

		function makeSessionData(sessionID: string, expiresInMs: number, jwth?: string): SessionData {
			return {
				sessionID,
				client: 'test client',
				userAgent: 'test agent',
				jwth,
				passport: { user: user.id },
				cookie: makeCookie(new Date(Date.now() + expiresInMs))
			};
		}

		async function createSession(sessionID: string, expires?: Date): Promise<void> {
			const session = orm.Session.create({ sessionID, client: 'test client', agent: 'test agent', cookie: '{}', mode: SessionMode.browser });
			session.expires = expires;
			await session.user.set(user);
			await orm.Session.persistAndFlush(session);
		}

		it('should remove expired sessions and keep the valid ones', async () => {
			await createSession('expired-session', new Date(Date.now() - 1000));
			await createSession('valid-session', new Date(Date.now() + 100_000));

			await engine.session.clearExpired();

			const sessions = await engine.session.byUserID(user.id);
			expect(sessions.map(session => session.sessionID)).toEqual(['valid-session']);
		});

		it('should keep sessions without an expiry date', async () => {
			await createSession('expired-session', new Date(Date.now() - 1000));
			await engine.session.createSubsonic(user.id);

			await engine.session.clearExpired();

			const sessions = await engine.session.byUserID(user.id);
			expect(sessions.map(session => session.mode)).toEqual([SessionMode.subsonic]);
		});

		it('should remove an expired session when it is requested', async () => {
			await createSession('expired-session', new Date(Date.now() - 1000));

			expect(await engine.session.getSession('expired-session')).toBeUndefined();
			expect(await engine.session.count()).toBe(0);
		});

		it('should remove the expired sessions of the user when a session is created', async () => {
			await createSession('expired-session', new Date(Date.now() - 1000));

			await engine.session.set('new-session', makeSessionData('new-session', 100_000));

			const sessions = await engine.session.byUserID(user.id);
			expect(sessions.map(session => session.sessionID)).toEqual(['new-session']);
		});

		it('should expire a jwt session with the jwt max age instead of the cookie max age', async () => {
			await engine.session.set('jwt-session', makeSessionData('jwt-session', 10 * engine.config.env.jwt.maxAge, 'jwt-hash'));

			const session = await engine.session.getSession('jwt-session');
			expect(session?.mode).toBe(SessionMode.jwt);
			expect(session?.expires?.valueOf()).toBeGreaterThan(Date.now());
			expect(session?.expires?.valueOf()).toBeLessThanOrEqual(Date.now() + engine.config.env.jwt.maxAge);
		});

		it('should keep the expiry of a jwt session when it is stored again', async () => {
			await engine.session.set('jwt-session', makeSessionData('jwt-session', 100_000, 'jwt-hash'));
			const expires = (await engine.session.getSession('jwt-session'))?.expires;

			await engine.session.set('jwt-session', makeSessionData('jwt-session', 100_000, 'jwt-hash'));

			expect((await engine.session.getSession('jwt-session'))?.expires?.valueOf()).toBe(expires?.valueOf());
		});
	});
});
