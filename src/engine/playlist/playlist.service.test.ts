import {testService} from '../base/base.service.spec';
import {StateService} from '../state/state.service';
import {TrackStore} from '../track/track.store';
import {PlaylistService} from './playlist.service';

describe('PlaylistService', () => {
	let playlistService: PlaylistService;
	let trackStore: TrackStore;
	testService({mockData: false},
		async (store, imageModuleTest) => {
			trackStore = store.trackStore;
			const stateService = new StateService(store.stateStore);
			playlistService = new PlaylistService(store.playlistStore, store.trackStore, stateService);
		},
		() => {
			it('create an empty playlist', async () => {
				const playlist = await playlistService.create('playlist 1', 'a comment', false, 'userID1', []);
				expect(playlist).toBeTruthy();
			});
			it('modify a playlist', async () => {
				const trackIDs = await trackStore.allIds();
				let playlist = await playlistService.playlistStore.searchOne({userID: 'userID1'});
				expect(playlist).toBeTruthy();
				if (playlist) {
					playlist.trackIDs = trackIDs;
					await playlistService.update(playlist);
				}
				playlist = await playlistService.playlistStore.searchOne({userID: 'userID1'});
				expect(playlist).toBeTruthy();
				if (playlist) {
					expect(playlist.trackIDs.length).toBe(trackIDs.length);
					expect(playlist.duration).toBe(trackIDs.length);
				}
			});
			it('remove a playlist', async () => {
				let playlist = await playlistService.playlistStore.searchOne({userID: 'userID1'});
				expect(playlist).toBeTruthy();
				if (playlist) {
					await playlistService.remove(playlist);
				}
				playlist = await playlistService.playlistStore.searchOne({userID: 'userID1'});
				expect(playlist).toBeUndefined();
			});
		}
	);
});
