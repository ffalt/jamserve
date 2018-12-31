import {assert, expect, should, use} from 'chai';
import {after, before, beforeEach, describe, it} from 'mocha';
import {NowPlayingService} from './nowplaying.service';
import {testService} from '../../objects/base/base.service.spec';
import {StateService} from '../../objects/state/state.service';
import {mockEpisode} from '../../objects/episode/episode.mock';
import {mockUser} from '../../objects/user/user.mock';
import {DBObjectType} from '../../model/jam-types';
import {mockTrack} from '../../objects/track/track.mock';

describe('NowPlayingService', () => {
	let nowPlayingService: NowPlayingService;
	let stateService: StateService;
	const user = mockUser();
	user.id = 'nowPlayingUserID1';
	testService({mockData: false},
		(store, imageModuleTest) => {
			stateService = new StateService(store.stateStore);
			nowPlayingService = new NowPlayingService(stateService);
		},
		() => {
			it('should return an empty list', async () => {
				const playing = await nowPlayingService.getNowPlaying();
				expect(playing.length).to.equal(0);
				const count = await stateService.stateStore.searchCount({userID: user.id});
				expect(count).to.equal(0);
			});
			it('should handle a playing episode', async () => {
				const episode = mockEpisode();
				episode.id = 'nowPlayingEpisodeID1';
				await nowPlayingService.reportEpisode(episode, user);
				await nowPlayingService.reportEpisode(episode, user);
				const playing = await nowPlayingService.getNowPlaying();
				expect(playing.length).to.equal(1);
				const ep = playing[0];
				expect(ep.obj.id).to.equal(episode.id);
				let count = await stateService.stateStore.searchCount({userID: user.id, type: DBObjectType.podcast, isPlayed: true});
				expect(count).to.equal(1);
				count = await stateService.stateStore.searchCount({userID: user.id, type: DBObjectType.episode, isPlayed: true});
				expect(count).to.equal(1);
				nowPlayingService.clear();
			});
			it('should handle a playing track', async () => {
				const track = mockTrack();
				track.id = 'nowPlayingTrackID1';
				await nowPlayingService.reportTrack(track, user);
				await nowPlayingService.reportTrack(track, user);
				const playing = await nowPlayingService.getNowPlaying();
				expect(playing.length).to.equal(1);
				const ep = playing[0];
				expect(ep.obj.id).to.equal(track.id);
				let count = await stateService.stateStore.searchCount({userID: user.id, type: DBObjectType.track, isPlayed: true});
				expect(count).to.equal(1);
				count = await stateService.stateStore.searchCount({userID: user.id, type: DBObjectType.folder, isPlayed: true});
				expect(count).to.equal(1);
				count = await stateService.stateStore.searchCount({userID: user.id, type: DBObjectType.album, isPlayed: true});
				expect(count).to.equal(1);
				count = await stateService.stateStore.searchCount({userID: user.id, type: DBObjectType.artist, isPlayed: true});
				expect(count).to.equal(1);
				nowPlayingService.clear();
			});

		}
	);
});
