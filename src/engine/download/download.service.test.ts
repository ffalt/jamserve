import {assert, expect, should, use} from 'chai';
import {after, before, beforeEach, describe, it} from 'mocha';
import {testService} from '../../objects/base/base.service.spec';
import {DownloadService} from './download.service';
import {mockTrack} from '../../objects/track/track.mock';
import {mockUser} from '../../objects/user/user.mock';
import {mockFolder} from '../../objects/folder/folder.mock';
import {mockEpisode} from '../../objects/episode/episode.mock';
import {mockPlaylist} from '../../objects/playlist/playlist.mock';
import {mockArtist} from '../../objects/artist/artist.mock';
import {mockAlbum} from '../../objects/album/album.mock';

describe('DownloadService', () => {
	let downloadService: DownloadService;
	testService(
		(storeTest, imageModuleTest) => {
			downloadService = new DownloadService(storeTest.store.trackStore);
		},
		() => {
			const user = mockUser();
			user.id = 'downloadUserID1';
			it('should download a track', async () => {
				const track = mockTrack();
				track.id = 'downloadTrackID1';
				const res = await downloadService.getObjDownload(track, undefined, user);
				should().exist(res);
				should().exist(res.pipe);
			});
			it('should download a folder', async () => {
				const folder = mockFolder();
				folder.id = 'downloadFolderID1';
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
				const artist = mockArtist();
				artist.id = 'downloadArtistID1';
				const res = await downloadService.getObjDownload(artist, undefined, user);
				should().exist(res);
				should().exist(res.pipe);
			});
			it('should download an album', async () => {
				const album = mockAlbum();
				album.id = 'downloadAlbumID1';
				const res = await downloadService.getObjDownload(album, undefined, user);
				should().exist(res);
				should().exist(res.pipe);
			});
			it('should download a playlist', async () => {
				const playlist = mockPlaylist();
				playlist.id = 'downloadPlaylistID1';
				playlist.isPublic = true;
				playlist.userID = user.id;
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
