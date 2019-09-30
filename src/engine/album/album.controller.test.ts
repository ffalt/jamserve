import {JamApi} from '../../api/jam/api';
import {Errors} from '../../api/jam/error';
import {Jam} from '../../model/jam-rest-data';
import {testBaseListController} from '../base/dbobject-list.controller.spec';
import {mockTrack} from '../track/track.mock';
import {Track} from '../track/track.model';
import {User} from '../user/user.model';
import {AlbumController} from './album.controller';
import {Album} from './album.model';

describe('AlbumController', () => {
	let controller: AlbumController;
	let api: JamApi;
	let user: User;
	testBaseListController({
		typeName: 'Jam.Album',
		skipBaseTests: false
	}, async (jamApi, jamUser) => {
		controller = jamApi.albumController;
		user = jamUser;
		api = jamApi;
		return controller;
	}, () => {
		describe('.similarTracks', () => {
			it('should handle invalid parameters', async () => {
				await expect(controller.similarTracks({query: {id: 'invalid'}, user})).rejects.toThrow(Errors.itemNotFound);
				await expect(controller.similarTracks({query: {} as any, user})).rejects.toThrow(Errors.invalidParameter);
			});
			it('should handle error if lastfm is not available', async () => {
				const album = await controller.albumService.albumStore.random();
				if (!album) {
					throw new Error('Invalid Test Setup');
				}
				const org = api.metadataController.metadataService.similarTracks.byAlbum;
				api.metadataController.metadataService.similarTracks.byAlbum = async (a: Album): Promise<Array<Track>> => {
					return Promise.reject(Error('not available'));
				};
				const list = await controller.similarTracks({query: {id: album.id}, user});
				api.metadataController.metadataService.similarTracks.byAlbum = org;
				expect(list).toBeTruthy();
				expect(list.items.length).toBe(0);
			});
			it('should handle empty metadata data', async () => {
				const album = await controller.albumService.albumStore.random();
				if (!album) {
					throw new Error('Invalid Test Setup');
				}
				const org = api.metadataController.metadataService.similarTracks.byAlbum;
				api.metadataController.metadataService.similarTracks.byAlbum = async (a: Album): Promise<Array<Track>> => {
					return [];
				};
				const list = await controller.similarTracks({query: {id: album.id}, user});
				api.metadataController.metadataService.similarTracks.byAlbum = org;
				expect(list).toBeTruthy();
				expect(list.items.length).toBe(0);
			});
			it('should return similar tracks', async () => {
				const album = await controller.albumService.albumStore.random();
				if (!album) {
					throw new Error('Invalid Test Setup');
				}
				const org = api.metadataController.metadataService.similarTracks.byAlbum;
				api.metadataController.metadataService.similarTracks.byAlbum = async (a: Album): Promise<Array<Track>> => {
					return [mockTrack()];
				};
				const list = await controller.similarTracks({query: {id: album.id}, user});
				api.metadataController.metadataService.similarTracks.byAlbum = org;
				expect(list).toBeTruthy();
				expect(list.items.length).toBe(1);
			});
		});
		describe('.tracks', () => {
			it('should handle invalid parameters', async () => {
				await expect(controller.tracks({query: {ids: ['invalid']}, user})).resolves.toEqual({items: []});
				await expect(controller.tracks({query: {} as any, user})).rejects.toThrow(Errors.invalidParameter);
			});
			it('should return tracks', async () => {
				const album = await controller.albumService.albumStore.random();
				if (!album || album.trackIDs.length === 0) {
					throw new Error('Invalid Test Setup');
				}
				const list = await controller.tracks({query: {ids: [album.id]}, user});
				expect(list).toBeTruthy();
				expect(list.items.length).toBe(album.trackIDs.length);
			});
		});
		describe('.index', () => {
			it('should return an index with all albums', async () => {
				const index = await controller.index({query: {}, user});
				expect(index).toBeTruthy();
				let count = 0;
				for (const group of index.groups) {
					count += group.entries.length;
				}
				expect(count).toBe(await controller.albumService.albumStore.count());
			});
			it('should return an empty index', async () => {
				const index = await controller.index({query: {id: 'invalid'}, user});
				expect(index).toBeTruthy();
				expect(index.groups.length).toBe(0);
			});
		});
		describe('.id', () => {
			it('should return sub items', async () => {
				const albums = await controller.albumService.albumStore.all();
				if (albums.length === 0) {
					throw new Error('Invalid Test Setup');
				}
				for (const album of albums) {
					const result = await controller.id({query: {id: album.id, albumState: true, albumTrackIDs: true, albumTracks: true}, user});
					expect(result).toBeTruthy();
					expect(result.trackIDs).toEqual(album.trackIDs);
					expect((result as any).tracks.length).toBe(album.trackIDs.length);
				}
			});
			it('should return album info in sub-object', async () => {
				const album = await controller.albumService.albumStore.random();
				if (!album) {
					throw new Error('Invalid Test Setup');
				}
				const org = api.metadataController.metadataService.extInfo.byAlbum;
				const extended: Jam.ExtendedInfo = {
					description: 'dummy',
					source: 'dummy',
					license: 'dummy',
					url: 'dummy',
					licenseUrl: 'dummy'
				};
				api.metadataController.metadataService.extInfo.byAlbum = async (a: Album): Promise<Jam.ExtendedInfo | undefined> => {
					return extended;
				};
				const result = await controller.id({query: {id: album.id, albumInfo: true}, user});
				api.metadataController.metadataService.extInfo.byAlbum = org;
				expect(result).toBeTruthy();
				expect(result.info).toEqual(extended);
			});
			it('should handle metadata not available for  album info in sub-object', async () => {
				const album = await controller.albumService.albumStore.random();
				if (!album) {
					throw new Error('Invalid Test Setup');
				}
				const org = api.metadataController.metadataService.extInfo.byAlbum;
				api.metadataController.metadataService.extInfo.byAlbum = async (a: Album): Promise<Jam.ExtendedInfo | undefined> => {
					return Promise.reject(Error('Dummy'));
				};
				const result = await controller.id({query: {id: album.id, albumInfo: true}, user});
				api.metadataController.metadataService.extInfo.byAlbum = org;
				expect(result).toBeTruthy();
				expect(result.info).toBeUndefined();
			});
		});
		describe('.info', () => {
			it('should return album info', async () => {
				const album = await controller.albumService.albumStore.random();
				if (!album) {
					throw new Error('Invalid Test Setup');
				}
				const org = api.metadataController.metadataService.extInfo.byAlbum;
				const extended: Jam.ExtendedInfo = {
					description: 'dummy',
					source: 'dummy',
					license: 'dummy',
					url: 'dummy',
					licenseUrl: 'dummy'
				};
				api.metadataController.metadataService.extInfo.byAlbum = async (a: Album): Promise<Jam.ExtendedInfo | undefined> => {
					return extended;
				};
				const result = await controller.info({query: {id: album.id}, user});
				api.metadataController.metadataService.extInfo.byAlbum = org;
				expect(result).toBeTruthy();
				expect(result.info).toEqual(extended);
			});
		});
	});
});
