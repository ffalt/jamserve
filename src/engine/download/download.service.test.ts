import {assert, expect, should, use} from 'chai';
import {after, before, beforeEach, describe, it} from 'mocha';
import {testService} from '../base/base.service.spec';
import {mockEpisode} from '../episode/episode.mock';
import {mockFolder} from '../folder/folder.mock';
import {mockPlaylist} from '../playlist/playlist.mock';
import {Store} from '../store/store';
import {mockUser} from '../user/user.mock';
import {DownloadService} from './download.service';

describe('DownloadService', () => {
	let downloadService: DownloadService;
	let store: Store;
	testService({mockData: true},
		async (storeTest) => {
			store = storeTest;
			downloadService = new DownloadService(store.trackStore, store.episodeStore);
		},
		() => {
			const user = mockUser();
			user.id = 'downloadUserID1';
			it('should download a track', async () => {
				const track = await store.trackStore.random();
				if (!track) {
					return Promise.reject('Invalid Test Setup');
				}
				const res = await downloadService.getObjDownload(track, undefined, user);
				should().exist(res);
				should().exist(res.pipe);
			});
			it('should download a folder', async () => {
				const folder = await store.folderStore.random();
				if (!folder) {
					return Promise.reject('Invalid Test Setup');
				}
				const res = await downloadService.getObjDownload(folder, undefined, user);
				should().exist(res);
				should().exist(res.pipe);
			});
			it('should download an episode', async () => {
				const episode = mockEpisode();
				episode.id = 'downloadEpisodeID1';
				episode.path = '/invalid.invalid.invalid';
				const res = await downloadService.getObjDownload(episode, undefined, user);
				should().exist(res);
				should().exist(res.pipe);
			});
			it('should not download an unavailable episode', async () => {
				const episode = mockEpisode();
				episode.id = 'downloadEpisodeID1';
				episode.path = undefined;
				await downloadService.getObjDownload(episode, undefined, user).should.eventually.be.rejectedWith(Error);
			});
			it('should download an artist', async () => {
				const artist = await store.artistStore.random();
				if (!artist) {
					return Promise.reject('Invalid Test Setup');
				}
				const res = await downloadService.getObjDownload(artist, undefined, user);
				should().exist(res);
				should().exist(res.pipe);
			});
			it('should download an album', async () => {
				const album = await store.albumStore.random();
				if (!album) {
					return Promise.reject('Invalid Test Setup');
				}
				const res = await downloadService.getObjDownload(album, undefined, user);
				should().exist(res);
				should().exist(res.pipe);
			});
			it('should download a playlist', async () => {
				const playlist = mockPlaylist();
				playlist.id = 'downloadPlaylistID1';
				playlist.isPublic = true;
				playlist.userID = user.id;
				const track = await store.trackStore.random();
				if (!track) {
					return Promise.reject('Invalid Test Setup');
				}
				playlist.trackIDs = [track.id];
				let res = await downloadService.getObjDownload(playlist, undefined, user);
				should().exist(res);
				should().exist(res.pipe);
				playlist.userID = 'someOtherUserID1';
				res = await downloadService.getObjDownload(playlist, undefined, user);
				should().exist(res);
				should().exist(res.pipe);
			});
			it('should not download a non public playlist', async () => {
				const playlist = mockPlaylist();
				playlist.id = 'downloadPlaylistID1';
				playlist.isPublic = false;
				playlist.userID = 'someOtherUserID1';
				await downloadService.getObjDownload(playlist, undefined, user).should.eventually.be.rejectedWith(Error);
			});
			it('should not allow an unknown download format', async () => {
				const folder = mockFolder();
				folder.id = 'downloadFolderID1';
				await downloadService.getObjDownload(folder, 'invalid', user).should.eventually.be.rejectedWith(Error);
			});

			it('should download as tar', async () => {
				const folder = mockFolder();
				folder.id = 'downloadFolderID1';
				const res = await downloadService.getObjDownload(folder, undefined, user);
				should().exist(res);
				should().exist(res.pipe);
			});
			it('should not download a car', async () => {
				await downloadService.getObjDownload(user, undefined, user).should.eventually.be.rejectedWith(Error);
			});
		}
	);
});
