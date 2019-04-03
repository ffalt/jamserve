import {expect, should} from 'chai';
import {after, before, beforeEach, describe, it} from 'mocha';
import {testService} from '../base/base.service.spec';
import {EpisodeService} from './episode.service';
import tmp from 'tmp';
import {mockEpisode, mockEpisode2} from './episode.mock';
import {PodcastStatus} from '../../model/jam-types';
import nock from 'nock';
import {writeMP3Track} from '../../modules/audio/audio.mock';
import {StateService} from '../state/state.service';

describe('EpisodeService', () => {
	let episodeService: EpisodeService;
	let dir: tmp.DirResult;
	testService({mockData: false},
		async (store, imageModuleTest, audioModule) => {
			dir = tmp.dirSync();
			const stateService = new StateService(store.stateStore);
			episodeService = new EpisodeService(dir.name, store.episodeStore, stateService, audioModule);
		},
		() => {
			it('should merge podcast episodes', async () => {
				await episodeService.mergeEpisodes('dummy', []); // do nothing
				const podcastID = 'podcastID1';
				const mock = mockEpisode();
				mock.podcastID = podcastID;
				await episodeService.mergeEpisodes(mock.podcastID, [mock]);
				let count = await episodeService.episodeStore.searchCount({podcastID});
				expect(count).to.equal(1);
				const mock_same = mockEpisode();
				mock_same.podcastID = podcastID;
				await episodeService.mergeEpisodes(mock.podcastID, [mock_same]);
				count = await episodeService.episodeStore.searchCount({podcastID});
				expect(count).to.equal(1);
				const mock2 = mockEpisode2();
				mock2.podcastID = podcastID;
				await episodeService.mergeEpisodes(mock.podcastID, [mock_same, mock2]);
				count = await episodeService.episodeStore.searchCount({podcastID});
				expect(count).to.equal(2);
				await episodeService.removeEpisodes(podcastID);
				count = await episodeService.episodeStore.searchCount({podcastID});
				expect(count).to.equal(0);
			});
			it('should fail to download an episode file with no urls', async () => {
				const podcastID = 'podcastID2';
				const mock = mockEpisode();
				mock.path = undefined;
				mock.podcastID = podcastID;
				mock.enclosures = [];
				await episodeService.mergeEpisodes(mock.podcastID, [mock]);
				await episodeService.downloadEpisode(mock);
				const episode = await episodeService.episodeStore.searchOne({podcastID});
				should().exist(episode);
				if (episode) {
					expect(episode.status).to.equal(PodcastStatus.error);
				}
				await episodeService.removeEpisodes(podcastID);
			});
			it('should fail to download an episode file with unknown format', async () => {
				const podcastID = 'podcastID2';
				const mock = mockEpisode();
				mock.path = undefined;
				mock.podcastID = podcastID;
				mock.enclosures = [{url: 'http://invaliddomain.invaliddomain.invaliddomain/episode1.unknownformat', type: 'dummy', length: 0}];
				await episodeService.mergeEpisodes(mock.podcastID, [mock]);
				await episodeService.downloadEpisode(mock);
				const episode = await episodeService.episodeStore.searchOne({podcastID});
				should().exist(episode);
				if (episode) {
					expect(episode.status).to.equal(PodcastStatus.error);
					await episodeService.deleteEpisode(episode); // should do nothing;
				}
				await episodeService.removeEpisodes(podcastID);
			});
			it('should fail to download an episode file', async () => {
				const podcastID = 'podcastID3';
				const mock = mockEpisode();
				mock.path = undefined;
				mock.podcastID = podcastID;
				mock.enclosures = [{url: 'http://invaliddomain.invaliddomain.invaliddomain/episode1.mp3', type: 'dummy', length: 0}];
				await episodeService.mergeEpisodes(mock.podcastID, [mock]);
				const scope = nock('http://invaliddomain.invaliddomain.invaliddomain')
					.get('/episode1.mp3').reply(404);
				await episodeService.downloadEpisode(mock);
				expect(scope.isDone()).to.equal(true, 'no request has been made');
				const episode = await episodeService.episodeStore.searchOne({podcastID});
				should().exist(episode);
				if (episode) {
					expect(episode.status).to.equal(PodcastStatus.error);
					await episodeService.deleteEpisode(episode); // should do nothing;
				}
				await episodeService.removeEpisodes(podcastID);
			});
			it('should download an episode file', async () => {
				const podcastID = 'podcastID4';
				const file = tmp.fileSync();
				await writeMP3Track(file.name, 'podcast', 'podcast artist', 1, 'podcast');
				const scope = nock('http://invaliddomain.invaliddomain.invaliddomain')
					.get('/episode1.mp3')
					.replyWithFile(200, file.name, {'Content-Type': 'audio/mp3'});
				const mock = mockEpisode();
				mock.path = undefined;
				mock.podcastID = podcastID;
				mock.enclosures = [{url: 'http://invaliddomain.invaliddomain.invaliddomain/episode1.mp3', type: 'dummy', length: 0}];
				await episodeService.mergeEpisodes(mock.podcastID, [mock]);
				await episodeService.downloadEpisode(mock);
				expect(scope.isDone()).to.equal(true, 'no request has been made');
				file.removeCallback();
				const episode = await episodeService.episodeStore.searchOne({podcastID});
				should().exist(episode);
				if (episode) {
					expect(episode.status).to.equal(PodcastStatus.completed);
					await episodeService.deleteEpisode(episode);
				}
				await episodeService.removeEpisodes(podcastID);
			});
			it('should report downloading while downloading', async () => {
				const podcastID = 'podcastID5';
				const file = tmp.fileSync();
				await writeMP3Track(file.name, 'podcast', 'podcast artist', 1, 'podcast');
				const scope = nock('http://invaliddomain.invaliddomain.invaliddomain')
					.get('/episode1.mp3')
					.delayConnection(1000)
					.replyWithFile(200, file.name, {'Content-Type': 'audio/mp3'});
				const mock = mockEpisode();
				mock.path = undefined;
				mock.podcastID = podcastID;
				mock.enclosures = [{url: 'http://invaliddomain.invaliddomain.invaliddomain/episode1.mp3', type: 'dummy', length: 0}];
				await episodeService.mergeEpisodes(mock.podcastID, [mock]);
				const episode = await episodeService.episodeStore.searchOne({podcastID});
				should().exist(episode);
				if (!episode) {
					return;
				}
				episodeService.downloadEpisode(episode);
				expect(episodeService.isDownloading(episode.id)).to.equal(true);
				const id = episode.id;

				function wait(cb: () => void) {
					if (episodeService.isDownloading(id)) {
						setTimeout(() => {
							wait(cb);
						}, 100);
					} else {
						expect(scope.isDone()).to.equal(true, 'no request has been made');
						file.removeCallback();
						episodeService.removeEpisodes(podcastID).then(cb);
					}
				}

				return new Promise((resolve, reject) => {
					wait(() => resolve());
				});
			}).timeout(2000);
			it('should block downloading a podcast while download already running', async () => {
				const podcastID = 'podcastID6';
				const file = tmp.fileSync();
				await writeMP3Track(file.name, 'podcast', 'podcast artist', 1, 'podcast');
				const scope = nock('http://invaliddomain.invaliddomain.invaliddomain')
					.get('/episode1.mp3')
					.delayConnection(1000)
					.replyWithFile(200, file.name, {'Content-Type': 'audio/mp3'});
				const mock = mockEpisode();
				mock.path = undefined;
				mock.podcastID = podcastID;
				mock.enclosures = [{url: 'http://invaliddomain.invaliddomain.invaliddomain/episode1.mp3', type: 'dummy', length: 0}];
				await episodeService.mergeEpisodes(mock.podcastID, [mock]);
				episodeService.downloadEpisode(mock);
				expect(episodeService.isDownloading(mock.id)).to.equal(true);
				await episodeService.downloadEpisode(mock);
				expect(episodeService.isDownloading(mock.id)).to.equal(false);
				expect(scope.isDone()).to.equal(true, 'no request has been made');
				file.removeCallback();
				await episodeService.removeEpisodes(podcastID);
			}).timeout(2000);
			it('should throw a storage error', async () => {
				const podcastID = 'podcastID7';
				const file = tmp.fileSync();
				await writeMP3Track(file.name, 'podcast', 'podcast artist', 1, 'podcast');
				const scope = nock('http://invaliddomain.invaliddomain.invaliddomain')
					.get('/episode1.mp3')
					.replyWithFile(200, file.name, {'Content-Type': 'audio/mp3'});
				const mock = mockEpisode();
				mock.path = undefined;
				mock.podcastID = podcastID;
				mock.enclosures = [{url: 'http://invaliddomain.invaliddomain.invaliddomain/episode1.mp3', type: 'dummy', length: 0}];
				await episodeService.mergeEpisodes(mock.podcastID, [mock]);
				const org = episodeService.episodeStore.replace;
				episodeService.episodeStore.replace = async (p) => {
					return Promise.reject(Error('test error'));
				};
				await episodeService.downloadEpisode(mock).should.eventually.be.rejectedWith(Error);
				episodeService.episodeStore.replace = org;
				expect(scope.isDone()).to.equal(true, 'no request has been made');
				file.removeCallback();
				await episodeService.removeEpisodes(podcastID);
			}).timeout(2000);
		},
		async () => {
			dir.removeCallback();
		}
	);
});
