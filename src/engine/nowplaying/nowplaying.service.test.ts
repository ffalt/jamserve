import {NowPlayingService} from './nowplaying.service';
import {testService} from '../base/base.service.spec';
import {StateService} from '../state/state.service';
import {mockEpisode} from '../episode/episode.mock';
import {mockUser} from '../user/user.mock';
import {DBObjectType} from '../../db/db.types';
import {mockTrack} from '../track/track.mock';

describe('NowPlayingService', () => {
	let nowPlayingService: NowPlayingService;
	let stateService: StateService;
	const user = mockUser();
	user.id = 'nowPlayingUserID1';
	testService({mockData: false},
		async (store, imageModuleTest) => {
			stateService = new StateService(store.stateStore);
			nowPlayingService = new NowPlayingService(stateService);
		},
		() => {
			it('should return an empty list', async () => {
				const playing = await nowPlayingService.getNowPlaying();
				expect(playing.length).toBe(0);
				const count = await stateService.stateStore.searchCount({userID: user.id});
				expect(count).toBe(0);
			});
			it('should handle a playing episode', async () => {
				const episode = mockEpisode();
				episode.id = 'nowPlayingEpisodeID1';
				await nowPlayingService.reportEpisode(episode, user);
				await nowPlayingService.reportEpisode(episode, user);
				const playing = await nowPlayingService.getNowPlaying();
				expect(playing.length).toBe(1);
				const ep = playing[0];
				expect(ep.obj.id).toBe(episode.id);
				let count = await stateService.stateStore.searchCount({userID: user.id, type: DBObjectType.podcast, isPlayed: true});
				expect(count).toBe(1);
				count = await stateService.stateStore.searchCount({userID: user.id, type: DBObjectType.episode, isPlayed: true});
				expect(count).toBe(1);
				nowPlayingService.clear();
			});
			it('should handle a playing track', async () => {
				const track = mockTrack();
				track.id = 'nowPlayingTrackID1';
				await nowPlayingService.reportTrack(track, user);
				await nowPlayingService.reportTrack(track, user);
				const playing = await nowPlayingService.getNowPlaying();
				expect(playing.length).toBe(1);
				const ep = playing[0];
				expect(ep.obj.id).toBe(track.id);
				let count = await stateService.stateStore.searchCount({userID: user.id, type: DBObjectType.track, isPlayed: true});
				expect(count).toBe(1);
				count = await stateService.stateStore.searchCount({userID: user.id, type: DBObjectType.folder, isPlayed: true});
				expect(count).toBe(1);
				count = await stateService.stateStore.searchCount({userID: user.id, type: DBObjectType.album, isPlayed: true});
				expect(count).toBe(1);
				count = await stateService.stateStore.searchCount({userID: user.id, type: DBObjectType.artist, isPlayed: true});
				expect(count).toBe(1);
				nowPlayingService.clear();
			});

		}
	);
});
