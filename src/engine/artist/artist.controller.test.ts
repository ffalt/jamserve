import {JamApi} from '../../api/jam/api';
import {Errors} from '../../api/jam/error';
import {Jam} from '../../model/jam-rest-data';
import {testBaseListController} from '../base/dbobject-list.controller.spec';
import {mockTrack} from '../track/track.mock';
import {Track} from '../track/track.model';
import {User} from '../user/user.model';
import {ArtistController} from './artist.controller';
import {mockArtist} from './artist.mock';
import {Artist} from './artist.model';

describe('ArtistController', () => {
	let controller: ArtistController;
	let user: User;
	let api: JamApi;
	testBaseListController({
		typeName: 'Jam.Artist'
	}, async (jamApi, jamUser) => {
		controller = jamApi.artistController;
		user = jamUser;
		api = jamApi;
		return controller;
	}, () => {
		describe('.similarTracks', () => {
			it('should handle invalid parameters', async () => {
				await expect(controller.similarTracks({query: {id: 'invalid'}, user})).rejects.toThrow(Errors.itemNotFound);
				await expect(controller.similarTracks({query: {} as any, user})).rejects.toThrow(Errors.invalidParameter);
			});
			it('should handle error if metadata is not available', async () => {
				const artist = await controller.artistService.artistStore.random();
				if (!artist) {
					throw new Error('Invalid Test Setup');
				}
				const org = api.metadataController.metadataService.similarTracks.byArtist;
				api.metadataController.metadataService.similarTracks.byArtist = async (a: Artist): Promise<Array<Track>> => {
					return Promise.reject(Error('not available'));
				};
				const list = await controller.similarTracks({query: {id: artist.id}, user});
				api.metadataController.metadataService.similarTracks.byArtist = org;
				expect(list).toBeTruthy();
				expect(list.items.length).toBe(0);
			});
			it('should handle empty metadata data', async () => {
				const artist = await controller.artistService.artistStore.random();
				if (!artist) {
					throw new Error('Invalid Test Setup');
				}
				const org = api.metadataController.metadataService.similarTracks.byArtist;
				api.metadataController.metadataService.similarTracks.byArtist = async (a: Artist): Promise<Array<Track>> => {
					return [];
				};
				const list = await controller.similarTracks({query: {id: artist.id}, user});
				api.metadataController.metadataService.similarTracks.byArtist = org;
				expect(list).toBeTruthy();
				expect(list.items.length).toBe(0);
			});
			it('should return similar tracks', async () => {
				const artist = await controller.artistService.artistStore.random();
				if (!artist) {
					throw new Error('Invalid Test Setup');
				}
				const org = api.metadataController.metadataService.similarTracks.byArtist;
				api.metadataController.metadataService.similarTracks.byArtist = async (a: Artist): Promise<Array<Track>> => {
					return [mockTrack()];
				};
				const list = await controller.similarTracks({query: {id: artist.id}, user});
				api.metadataController.metadataService.similarTracks.byArtist = org;
				expect(list).toBeTruthy();
				expect(list.items.length).toBe(1);
			});
		});
		describe('.tracks', () => {
			it('should handle invalid parameters', async () => {
				await expect(controller.tracks({query: {ids: ['invalid']}, user})).resolves.toEqual({total: 0, items: []});
				await expect(controller.tracks({query: {} as any, user})).rejects.toThrow(Errors.invalidParameter);
			});
			it('should return tracks', async () => {
				const artist = await controller.artistService.artistStore.random();
				if (!artist || artist.trackIDs.length === 0) {
					throw new Error('Invalid Test Setup');
				}
				const list = await controller.tracks({query: {ids: [artist.id]}, user});
				expect(list).toBeTruthy();
				expect(list.items.length).toBe(artist.trackIDs.length);
			});
		});
		describe('.index', () => {
			it('should return an index with all artists', async () => {
				const index = await controller.index({query: {}, user});
				expect(index).toBeTruthy();
				let count = 0;
				for (const group of index.groups) {
					count += group.entries.length;
				}
				expect(count).toBe(await controller.artistService.artistStore.count());
			});
			it('should return an empty index', async () => {
				const index = await controller.index({query: {id: 'invalid'}, user});
				expect(index).toBeTruthy();
				expect(index.groups.length).toBe(0);
			});
		});
		describe('.info', () => {
			it('should return artist info', async () => {
				const artist = await controller.artistService.artistStore.random();
				if (!artist) {
					throw new Error('Invalid Test Setup');
				}
				const org = api.metadataController.metadataService.extInfo.byArtist;
				const extended: Jam.ExtendedInfo = {
					description: 'dummy',
					source: 'dummy',
					license: 'dummy',
					url: 'dummy',
					licenseUrl: 'dummy'
				};
				api.metadataController.metadataService.extInfo.byArtist = async (a: Artist): Promise<Jam.ExtendedInfo | undefined> => {
					return extended;
				};
				const result = await controller.info({query: {id: artist.id}, user});
				api.metadataController.metadataService.extInfo.byArtist = org;
				expect(result).toBeTruthy();
				expect(result.info).toEqual(extended);
			});
		});
		describe('.similar', () => {
			it('should handle invalid parameters', async () => {
				await expect(controller.similar({query: {id: 'invalid'}, user})).rejects.toThrow(Errors.itemNotFound);
				await expect(controller.similar({query: {} as any, user})).rejects.toThrow(Errors.invalidParameter);
			});
			it('should handle error if metadata is not available', async () => {
				const artist = await controller.artistService.artistStore.random();
				if (!artist) {
					throw new Error('Invalid Test Setup');
				}
				const org = api.metadataController.metadataService.similarArtists.byArtist;
				api.metadataController.metadataService.similarArtists.byArtist = async (a: Artist): Promise<Array<Artist>> => {
					return Promise.reject(Error('not available'));
				};
				const list = await controller.similar({query: {id: artist.id}, user});
				api.metadataController.metadataService.similarArtists.byArtist = org;
				expect(list).toBeTruthy();
				expect(list.items.length).toBe(0);
			});
			it('should handle empty metadata data', async () => {
				const artist = await controller.artistService.artistStore.random();
				if (!artist) {
					throw new Error('Invalid Test Setup');
				}
				const org = api.metadataController.metadataService.similarArtists.byArtist;
				api.metadataController.metadataService.similarArtists.byArtist = async (a: Artist): Promise<Array<Artist>> => {
					return [];
				};
				const list = await controller.similar({query: {id: artist.id}, user});
				api.metadataController.metadataService.similarArtists.byArtist = org;
				expect(list).toBeTruthy();
				expect(list.items.length).toBe(0);
			});
			it('should return similar artists', async () => {
				const artist = await controller.artistService.artistStore.random();
				if (!artist) {
					throw new Error('Invalid Test Setup');
				}
				const org = api.metadataController.metadataService.similarArtists.byArtist;
				api.metadataController.metadataService.similarArtists.byArtist = async (a: Artist): Promise<Array<Artist>> => {
					return [mockArtist()];
				};
				const list = await controller.similar({query: {id: artist.id}, user});
				api.metadataController.metadataService.similarArtists.byArtist = org;
				expect(list).toBeTruthy();
				expect(list.items.length).toBe(1);
			});
		});
		describe('.id', () => {
			it('should return sub items', async () => {
				const artists = await controller.artistService.artistStore.all();
				if (artists.length === 0) {
					throw new Error('Invalid Test Setup');
				}
				for (const artist of artists) {
					const result = await controller.id({query: {id: artist.id, artistState: true, artistAlbumIDs: true, artistAlbums: true, artistTrackIDs: true, artistTracks: true}, user});
					expect(result).toBeTruthy();
					expect(result.trackIDs).toEqual(artist.trackIDs);
					expect(result.albumIDs).toEqual(artist.albumIDs);
					expect((result.tracks as any).length).toBe(artist.trackIDs.length);
					expect((result.albums as any).length).toBe(artist.albumIDs.length);
				}
			});
			it('should return artist info in sub-object', async () => {
				const artist = await controller.artistService.artistStore.random();
				if (!artist) {
					throw new Error('Invalid Test Setup');
				}
				const org = api.metadataController.metadataService.extInfo.byArtist;
				const extended: Jam.ExtendedInfo = {
					description: 'dummy',
					source: 'dummy',
					license: 'dummy',
					url: 'dummy',
					licenseUrl: 'dummy'
				};
				api.metadataController.metadataService.extInfo.byArtist = async (a: Artist): Promise<Jam.ExtendedInfo | undefined> => {
					return extended;
				};
				const result = await controller.id({query: {id: artist.id, artistInfo: true}, user});
				api.metadataController.metadataService.extInfo.byArtist = org;
				expect(result).toBeTruthy();
				expect(result.info).toEqual(extended);
			});
			it('should handle metadata not available for artist artist info in sub-object', async () => {
				const artist = await controller.artistService.artistStore.random();
				if (!artist) {
					throw new Error('Invalid Test Setup');
				}
				const org = api.metadataController.metadataService.extInfo.byArtist;
				api.metadataController.metadataService.extInfo.byArtist = async (a: Artist): Promise<Jam.ExtendedInfo | undefined> => {
					return Promise.reject(Error('Dummy'));
				};
				const result = await controller.id({query: {id: artist.id, artistInfo: true}, user});
				api.metadataController.metadataService.extInfo.byArtist = org;
				expect(result).toBeTruthy();
				expect(result.info).toBeUndefined();
			});
			it('should return artist similar in sub-object', async () => {
				const artist = await controller.artistService.artistStore.random();
				if (!artist) {
					throw new Error('Invalid Test Setup');
				}
				const org = api.metadataController.metadataService.similarArtists.byArtist;
				api.metadataController.metadataService.similarArtists.byArtist = async (a: Artist): Promise<Array<Artist>> => {
					return [mockArtist()];
				};
				const result = await controller.id({query: {id: artist.id, artistSimilar: true}, user});
				api.metadataController.metadataService.similarArtists.byArtist = org;
				expect(result).toBeTruthy();
				expect(result.similar).toBeTruthy();
				expect((result.similar || []).length).toBe(1);
			});
			it('should handle metadata not available for artist similar in sub-object', async () => {
				const artist = await controller.artistService.artistStore.random();
				if (!artist) {
					throw new Error('Invalid Test Setup');
				}
				const org = api.metadataController.metadataService.similarArtists.byArtist;
				api.metadataController.metadataService.similarArtists.byArtist = async (a: Artist): Promise<Array<Artist>> => {
					throw new Error('Dummy');
				};
				const result = await controller.id({query: {id: artist.id, artistSimilar: true}, user});
				api.metadataController.metadataService.similarArtists.byArtist = org;
				expect(result).toBeTruthy();
				expect(result.similar).toBeUndefined();
			});
		});
	});
});
