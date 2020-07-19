import {EngineService} from '../modules/engine/services/engine.service';
import tmp from 'tmp';
import fse from 'fs-extra';
import 'jest-expect-message';
import {bindMockConfig} from './mock/mock.config';
import {waitEngineStart} from './mock/mock.engine';
import {MockRoot} from './mock/mock.root';
import {initTest} from './init';
import {MockFeed1} from './mock/mock.rss-feed';
import {Podcast} from '../entity/podcast/podcast';
import {mockNock, mockNockURL} from './mock/mock.nock';

initTest();

describe('Services', () => {
	let engine: EngineService;
	let dir: tmp.DirResult;

	beforeEach(async () => {
		dir = tmp.dirSync();
		bindMockConfig(dir.name);

		engine = new EngineService();
		await engine.start();
		await waitEngineStart(engine);
	});

	afterEach(async () => {
		await engine.stop();
		await fse.remove(dir.name);
		// dir.removeCallback();
	});

	describe('podcastService', () => {
		let podcast: Podcast;

		beforeEach(async () => {
			podcast = await engine.podcastService.create(mockNockURL('podcast.xml'));
		});

		it('should fail to refresh a podcast', async () => {
			await engine.podcastService.refresh(podcast);
			expect(podcast.errorMessage).toEqual(expect.stringMatching(/NetConnectNotAllowedError/));
		});

		it('should try to refresh a podcast', async () => {
			const scope = mockNock()
				.get('/podcast.xml').reply(404);
			await engine.podcastService.refresh(podcast);
			expect(scope.isDone(), 'No request has been made').toBe(true);
			expect(podcast.errorMessage).toEqual(expect.stringMatching(/Bad status code 404/));
		});

		it('should handle an invalid feed', async () => {
			const feed = '';
			const scope = mockNock()
				.get('/podcast.xml').reply(200, feed, {'Content-Type': ''});
			await engine.podcastService.refresh(podcast);
			expect(scope.isDone(), 'No request has been made').toBe(true);
		});

		it('should refresh a podcast', async () => {
			const scope = mockNock()
				.get('/podcast.xml').reply(200, MockFeed1.xml, {'Content-Type': 'application/xml; charset=utf-8'});
			await engine.podcastService.refresh(podcast);
			expect(scope.isDone(), 'No request has been made').toBe(true);
			expect(podcast).toEqual(expect.objectContaining(MockFeed1.expected.podcast));
			expect(podcast.episodes.length).toBe(1);
			const items = podcast.episodes.getItems();
			expect(items[0]).toEqual(expect.objectContaining(MockFeed1.expected.episode1));
		});

		it('should update a podcast', async () => {
			let scope = mockNock()
				.get('/podcast.xml').reply(200, MockFeed1.xml, {'Content-Type': 'application/xml; charset=utf-8'});
			await engine.podcastService.refresh(podcast);
			expect(scope.isDone(), 'No request has been made').toBe(true);
			scope = mockNock()
				.get('/podcast.xml').reply(200, MockFeed1.xml_update, {'Content-Type': 'application/xml; charset=utf-8'});
			await engine.podcastService.refresh(podcast);
			expect(scope.isDone(), 'No request has been made').toBe(true);

			expect(podcast).toEqual(expect.objectContaining(MockFeed1.expected.podcast));
			expect(podcast.episodes.length).toBe(2);
			const items = podcast.episodes.getItems();
			expect(items.find(i => i.guid === MockFeed1.expected.episode1.guid)).toEqual(expect.objectContaining(MockFeed1.expected.episode1));
			expect(items.find(i => i.guid === MockFeed1.expected.episode2.guid)).toEqual(expect.objectContaining(MockFeed1.expected.episode2));
		});

	});

});
