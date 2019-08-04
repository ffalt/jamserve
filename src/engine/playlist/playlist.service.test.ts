import {expect, should} from 'chai';
import {describe, it} from 'mocha';
import {testService} from '../base/base.service.spec';
import {PlaylistService} from './playlist.service';
import {TrackStore} from '../track/track.store';
import {StateService} from '../state/state.service';

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
				should().exist(playlist);
			});
			it('modify a playlist', async () => {
				const trackIDs = await trackStore.allIds();
				let playlist = await playlistService.playlistStore.searchOne({userID: 'userID1'});
				should().exist(playlist);
				if (playlist) {
					playlist.trackIDs = trackIDs;
					await playlistService.update(playlist);
				}
				playlist = await playlistService.playlistStore.searchOne({userID: 'userID1'});
				should().exist(playlist);
				if (playlist) {
					expect(playlist.trackIDs.length).to.be.equal(trackIDs.length);
					expect(playlist.duration).to.be.equal(trackIDs.length);
				}
			});
			it('remove a playlist', async () => {
				let playlist = await playlistService.playlistStore.searchOne({userID: 'userID1'});
				should().exist(playlist);
				if (playlist) {
					await playlistService.remove(playlist);
				}
				playlist = await playlistService.playlistStore.searchOne({userID: 'userID1'});
				should().not.exist(playlist);
			});
		}
	);
});
