import {expect, should} from 'chai';
import {after, before, beforeEach, describe, it} from 'mocha';
import {testService} from '../base/base.service.spec';
import {PodcastService} from './podcast.service';
import {EpisodeService} from '../episode/episode.service';
import tmp from 'tmp';
import nock from 'nock';
import {PodcastStatus} from '../../model/jam-types';
import {mockPodcastXML} from './podcast.mock';
import {StateService} from '../state/state.service';

describe('PodcastService', () => {
	let podcastService: PodcastService;
	let episodeService: EpisodeService;
	let dir: tmp.DirResult;
	testService({mockData: false},
		async (store, imageModuleTest, audioModule) => {
			dir = tmp.dirSync();
			const stateService = new StateService(store.stateStore);
			episodeService = new EpisodeService(dir.name, store.episodeStore, stateService, audioModule);
			podcastService = new PodcastService(store.podcastStore, episodeService, stateService);
		},
		() => {
			it('should create a podcast', async () => {
				const podcast = await podcastService.create('http://invaliddomain.invaliddomain.invaliddomain/feed1');
				expect(podcast.status).to.equal(PodcastStatus.new);
				should().exist(podcast);
				await podcastService.remove(podcast);
			});
			it('should fail refreshing a podcast', async () => {
				const podcast = await podcastService.create('http://invaliddomain.invaliddomain.invaliddomain/feed2');
				const scope = nock('http://invaliddomain.invaliddomain.invaliddomain')
					.get('/feed2').reply(404);
				await podcastService.refresh(podcast);
				expect(scope.isDone()).to.equal(true, 'no request has been made');
				const p = await podcastService.podcastStore.byId(podcast.id);
				should().exist(p);
				if (p) {
					expect(p.status).to.equal(PodcastStatus.error);
				}
				await podcastService.remove(podcast);
			});
			it('should fail parsing a podcast', async () => {
				const podcast = await podcastService.create('http://invaliddomain.invaliddomain.invaliddomain/feed3');
				const scope = nock('http://invaliddomain.invaliddomain.invaliddomain')
					.get('/feed3').reply(200, '');
				await podcastService.refresh(podcast);
				expect(scope.isDone()).to.equal(true, 'no request has been made');
				const p = await podcastService.podcastStore.byId(podcast.id);
				should().exist(p);
				if (p) {
					expect(p.status).to.equal(PodcastStatus.error);
				}
				await podcastService.remove(podcast);
			});
			it('should refresh a podcast and add episodes', async () => {
				const podcast = await podcastService.create('http://invaliddomain.invaliddomain.invaliddomain/feed4');
				const mock = mockPodcastXML();
				const scope = nock('http://invaliddomain.invaliddomain.invaliddomain')
					.get('/feed4').reply(200, mock.feed);
				await podcastService.refresh(podcast);
				expect(scope.isDone()).to.equal(true, 'no request has been made');
				const p = await podcastService.podcastStore.byId(podcast.id);
				should().exist(p);
				if (p) {
					expect(p.status).to.equal(PodcastStatus.completed, p.errorMessage);
					const count = await episodeService.episodeStore.searchCount({podcastID: podcast.id});
					expect(count).to.equal(mock.nrOfItems);
				}
				await podcastService.remove(podcast);
			});
			it('should refresh a podcast with nothing new', async () => {
				const podcast = await podcastService.create('http://invaliddomain.invaliddomain.invaliddomain/feed5');
				const mock = mockPodcastXML();
				const scope = nock('http://invaliddomain.invaliddomain.invaliddomain')
					.get('/feed5').reply(200, mock.feed);
				await podcastService.refreshPodcasts();
				expect(scope.isDone()).to.equal(true, 'no request has been made');
				const p = await podcastService.podcastStore.byId(podcast.id);
				should().exist(p);
				if (p) {
					expect(p.status).to.equal(PodcastStatus.completed, p.errorMessage);
					const count = await episodeService.episodeStore.searchCount({podcastID: podcast.id});
					expect(count).to.equal(mock.nrOfItems);
				}
				await podcastService.remove(podcast);
			});
			it('should report downloading while refreshing', async () => {
				const podcast = await podcastService.create('http://invaliddomain.invaliddomain.invaliddomain/feed6');
				const mock = mockPodcastXML();
				const scope = nock('http://invaliddomain.invaliddomain.invaliddomain')
					.get('/feed6').delayConnection(1000).reply(200, mock.feed);
				podcastService.refresh(podcast);
				expect(podcastService.isDownloading(podcast.id)).to.equal(true);

				function wait(cb: () => void) {
					if (podcastService.isDownloading(podcast.id)) {
						setTimeout(() => {
							wait(cb);
						}, 100);
					} else {
						expect(scope.isDone()).to.equal(true, 'no request has been made');
						podcastService.remove(podcast).then(cb);
					}
				}

				return new Promise((resolve, reject) => {
					wait(() => resolve());
				});
			}).timeout(2000);
			it('should block refreshing a podcast while refreshing already running', async () => {
				const podcast = await podcastService.create('http://invaliddomain.invaliddomain.invaliddomain/feed7');
				const mock = mockPodcastXML();
				const scope = nock('http://invaliddomain.invaliddomain.invaliddomain')
					.get('/feed7').delayConnection(1000).reply(200, mock.feed);
				podcastService.refresh(podcast);
				await podcastService.refresh(podcast);
				expect(scope.isDone()).to.equal(true, 'no request has been made');
				expect(podcastService.isDownloading(podcast.id)).to.equal(false);
				await podcastService.remove(podcast);
			}).timeout(2000);
			it('should throw a storage error', async () => {
				const podcast = await podcastService.create('http://invaliddomain.invaliddomain.invaliddomain/feed8');
				const mock = mockPodcastXML();
				const scope = nock('http://invaliddomain.invaliddomain.invaliddomain')
					.get('/feed8').reply(200, mock.feed);
				const org = podcastService.podcastStore.replace;
				podcastService.podcastStore.replace = async (p) => {
					return Promise.reject(Error('test error'));
				};
				await podcastService.refresh(podcast).should.eventually.be.rejectedWith(Error);
				podcastService.podcastStore.replace = org;
				expect(scope.isDone()).to.equal(true, 'no request has been made');
				await podcastService.remove(podcast);
			}).timeout(2000);
		},
		async () => {
			dir.removeCallback();
		}
	);
});
