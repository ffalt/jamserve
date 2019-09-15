import nock from 'nock';
import tmp from 'tmp';

import {PodcastStatus} from '../../model/jam-types';
import {testService} from '../base/base.service.spec';
import {EpisodeService} from '../episode/episode.service';
import {StateService} from '../state/state.service';
import {mockPodcastXML} from './podcast.mock';
import {PodcastService} from './podcast.service';

describe('PodcastService', () => {
	let podcastService: PodcastService;
	let episodeService: EpisodeService;
	let dir: tmp.DirResult;
	testService({mockData: false},
		async (store, imageModuleTest, audioModule) => {
			dir = tmp.dirSync();
			const stateService = new StateService(store.stateStore);
			episodeService = new EpisodeService(dir.name, store.episodeStore, stateService, audioModule, imageModuleTest.imageModule);
			podcastService = new PodcastService(dir.name, store.podcastStore, episodeService, imageModuleTest.imageModule, stateService);
		},
		() => {
			it('should create a podcast', async () => {
				const podcast = await podcastService.create('http://invaliddomain.invaliddomain.invaliddomain/feed1');
				expect(podcast.status).toBe(PodcastStatus.new);
				expect(podcast).toBeTruthy();
				await podcastService.remove(podcast);
			});
			it('should fail refreshing a podcast', async () => {
				const podcast = await podcastService.create('http://invaliddomain.invaliddomain.invaliddomain/feed2');
				const scope = nock('http://invaliddomain.invaliddomain.invaliddomain')
					.get('/feed2').reply(404);
				await podcastService.refresh(podcast);
				expect(scope.isDone()).toBe(true); // 'no request has been made');
				const p = await podcastService.podcastStore.byId(podcast.id);
				expect(p).toBeTruthy();
				if (p) {
					expect(p.status).toBe(PodcastStatus.error);
				}
				await podcastService.remove(podcast);
			});
			it('should fail parsing a podcast', async () => {
				const podcast = await podcastService.create('http://invaliddomain.invaliddomain.invaliddomain/feed3');
				const scope = nock('http://invaliddomain.invaliddomain.invaliddomain')
					.get('/feed3').reply(200, '');
				await podcastService.refresh(podcast);
				expect(scope.isDone()).toBe(true); // 'no request has been made');
				const p = await podcastService.podcastStore.byId(podcast.id);
				expect(p).toBeTruthy();
				if (p) {
					expect(p.status).toBe(PodcastStatus.error);
				}
				await podcastService.remove(podcast);
			});
			it('should refresh a podcast and add episodes', async () => {
				const podcast = await podcastService.create('http://invaliddomain.invaliddomain.invaliddomain/feed4');
				const mock = mockPodcastXML();
				const scope = nock('http://invaliddomain.invaliddomain.invaliddomain')
					.get('/feed4').reply(200, mock.feed);
				await podcastService.refresh(podcast);
				expect(scope.isDone()).toBe(true); // 'no request has been made');
				const p = await podcastService.podcastStore.byId(podcast.id);
				expect(p).toBeTruthy();
				if (p) {
					expect(p.status).toBe(PodcastStatus.completed); // , p.errorMessage);
					const count = await episodeService.episodeStore.searchCount({podcastID: podcast.id});
					expect(count).toBe(mock.nrOfItems);
				}
				await podcastService.remove(podcast);
			});
			it('should refresh a podcast with nothing new', async () => {
				const podcast = await podcastService.create('http://invaliddomain.invaliddomain.invaliddomain/feed5');
				const mock = mockPodcastXML();
				const scope = nock('http://invaliddomain.invaliddomain.invaliddomain')
					.get('/feed5').reply(200, mock.feed);
				await podcastService.refreshPodcasts();
				expect(scope.isDone()).toBe(true); // 'no request has been made');
				const p = await podcastService.podcastStore.byId(podcast.id);
				expect(p).toBeTruthy();
				if (p) {
					expect(p.status).toBe(PodcastStatus.completed); // p.errorMessage);
					const count = await episodeService.episodeStore.searchCount({podcastID: podcast.id});
					expect(count).toBe(mock.nrOfItems);
				}
				await podcastService.remove(podcast);
			});
			it('should report downloading while refreshing', async () => {
				const podcast = await podcastService.create('http://invaliddomain.invaliddomain.invaliddomain/feed6');
				const mock = mockPodcastXML();
				const scope = nock('http://invaliddomain.invaliddomain.invaliddomain')
					.get('/feed6').delayConnection(1000).reply(200, mock.feed);
				podcastService.refresh(podcast);
				expect(podcastService.isDownloading(podcast.id)).toBe(true);

				function wait(cb: () => void): void {
					if (podcastService.isDownloading(podcast.id)) {
						setTimeout(() => {
							wait(cb);
						}, 100);
					} else {
						expect(scope.isDone()).toBe(true); // , 'no request has been made');
						podcastService.remove(podcast).then(cb);
					}
				}

				return new Promise((resolve, reject) => {
					wait(() => resolve());
				});
			});
			it('should block refreshing a podcast while refreshing already running', async () => {
				const podcast = await podcastService.create('http://invaliddomain.invaliddomain.invaliddomain/feed7');
				const mock = mockPodcastXML();
				const scope = nock('http://invaliddomain.invaliddomain.invaliddomain')
					.get('/feed7').delayConnection(1000).reply(200, mock.feed);
				podcastService.refresh(podcast);
				await podcastService.refresh(podcast);
				expect(scope.isDone()).toBe(true); // , 'no request has been made');
				expect(podcastService.isDownloading(podcast.id)).toBe(false);
				await podcastService.remove(podcast);
			});
			it('should throw a storage error', async () => {
				const podcast = await podcastService.create('http://invaliddomain.invaliddomain.invaliddomain/feed8');
				const mock = mockPodcastXML();
				const scope = nock('http://invaliddomain.invaliddomain.invaliddomain')
					.get('/feed8').reply(200, mock.feed);
				const org = podcastService.podcastStore.replace;
				podcastService.podcastStore.replace = async (p) => {
					return Promise.reject(Error('test error'));
				};
				await expect(podcastService.refresh(podcast)).rejects.toThrow('error');
				podcastService.podcastStore.replace = org;
				expect(scope.isDone()).toBe(true); //  'no request has been made');
				await podcastService.remove(podcast);
			});
		},
		async () => {
			dir.removeCallback();
		}
	);
});
