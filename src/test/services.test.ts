import {EngineService} from '../modules/engine/services/engine.service';
import tmp from 'tmp';
import fse from 'fs-extra';
import 'jest-expect-message';
import {bindMockConfig, DBConfigs} from './mock/mock.config';
import {waitEngineStart} from './mock/mock.engine';
import {initTest} from './init';
import {MockFeed1} from './mock/mock.rss-feed';
import {Podcast} from '../entity/podcast/podcast';
import {mockNock, mockNockURL} from './mock/mock.nock';
import {Orm} from '../modules/engine/services/orm.service';
import {Container, Snapshot} from 'typescript-ioc';
import {PodcastStatus} from '../types/enums';
import nock from 'nock';

initTest();

describe('Services', () => {

	for (const db of DBConfigs) {
		describe(db.dialect, () => {
			let engine: EngineService;
			let orm: Orm;
			let dir: tmp.DirResult;
			let snapshot: Snapshot;

			beforeEach(async () => {
				nock.cleanAll();

				snapshot = Container.snapshot();
				dir = tmp.dirSync();
				bindMockConfig(dir.name, db);

				engine = Container.get(EngineService);
				await engine.init();
				await engine.orm.drop();
				await engine.start();
				await waitEngineStart(engine);
				orm = engine.orm.fork();
			});

			afterEach(async () => {
				await engine.stop();
				await fse.remove(dir.name);
				// dir.removeCallback();
				snapshot.restore();
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
					const scope = mockNock()
						.get('/podcast.xml').reply(404);
					await engine.podcast.refresh(orm, podcast);
					expect(scope.isDone(), 'No request has been made').toBe(true);
					expect(podcast.errorMessage).toEqual(expect.stringMatching(/Bad status code 404/));
				});

				it('should handle an invalid feed', async () => {
					const feed = '';
					const scope = mockNock()
						.get('/podcast.xml').reply(200, feed, {'Content-Type': ''});
					await engine.podcast.refresh(orm, podcast);
					expect(podcast.status).toBe(PodcastStatus.error);
					expect(scope.isDone(), 'No request has been made').toBe(true);
				});

				it('should refresh a podcast', async () => {
					const scope = mockNock()
						.get('/podcast.xml').reply(200, MockFeed1.xml, {'Content-Type': 'application/xml; charset=utf-8'});
					await engine.podcast.refresh(orm, podcast);
					expect(scope.isDone(), 'No request has been made').toBe(true);
					expect(podcast).toEqual(expect.objectContaining(MockFeed1.expected.podcast));
					expect(await podcast.episodes.count()).toBe(1);
					const items = await podcast.episodes.getItems();
					expect(items[0]).toEqual(expect.objectContaining(MockFeed1.expected.episode1));
				});

				it('should update a podcast', async () => {
					let scope = mockNock()
						.get('/podcast.xml').reply(200, MockFeed1.xml, {'Content-Type': 'application/xml; charset=utf-8'});
					await engine.podcast.refresh(orm, podcast);
					expect(scope.isDone(), 'No request has been made').toBe(true);
					scope = mockNock()
						.get('/podcast.xml').reply(200, MockFeed1.xml_update, {'Content-Type': 'application/xml; charset=utf-8'});
					await engine.podcast.refresh(orm, podcast);
					expect(scope.isDone(), 'No request has been made').toBe(true);

					expect(podcast).toEqual(expect.objectContaining(MockFeed1.expected.podcast));
					expect(await podcast.episodes.count()).toBe(2);
					const items = await podcast.episodes.getItems();
					expect(items.find(i => i.guid === MockFeed1.expected.episode1.guid)).toEqual(expect.objectContaining(MockFeed1.expected.episode1));
					expect(items.find(i => i.guid === MockFeed1.expected.episode2.guid)).toEqual(expect.objectContaining(MockFeed1.expected.episode2));
				});

			});

		});
	}

});
