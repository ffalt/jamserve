import { jest } from '@jest/globals';
import { AlbumTransformService } from '../../../src/entity/album/album.transform.js';
import { AlbumType, DBObjectType } from '../../../src/types/enums.js';
import { IncludesAlbumParameters } from '../../../src/entity/album/album.parameters.js';
import { makeMockOrm } from '../shared/make-orm.js';
import { makeAlbum } from '../shared/make-album.js';
import { makeArtistReference, makeSeriesReference } from '../shared/mock-data.js';
import { makeTransformService } from '../shared/make-transform-service.js';

const mockOrm = makeMockOrm();

function makeService() {
	return makeTransformService(AlbumTransformService, 'byAlbum');
}

describe('AlbumTransformService.albumBase', () => {
	test('returns core album fields', async () => {
		const { service } = makeService();
		const album = makeAlbum() as never;
		const parameters: IncludesAlbumParameters = {};
		const user = { id: 'user-1' } as never;

		const result = await service.albumBase(mockOrm, album, parameters, user);

		expect(result.id).toBe('album-1');
		expect(result.name).toBe('Test Album');
		expect(result.albumType).toBe(AlbumType.album);
		expect(result.year).toBe(2020);
		expect(result.duration).toBe(3600);
		expect(result.mbArtistID).toBe('mb-artist-id');
		expect(result.mbReleaseID).toBe('mb-release-id');
		expect(result.seriesNr).toBe('001');
		expect(result.artistID).toBe('artist-1');
		expect(result.artistName).toBe('Test Artist');
	});

	test('sets created from createdAt timestamp', async () => {
		const { service } = makeService();
		const createdAt = new Date(1_700_000_000_000);
		const album = makeAlbum({ createdAt }) as never;
		const parameters: IncludesAlbumParameters = {};
		const user = { id: 'user-1' } as never;

		const result = await service.albumBase(mockOrm, album, parameters, user);

		expect(result.created).toBe(createdAt.valueOf());
	});

	test('series fields are undefined when album has no series', async () => {
		const { service } = makeService();
		const album = makeAlbum({ series: undefined }) as never;
		const parameters: IncludesAlbumParameters = {};
		const user = { id: 'user-1' } as never;

		const result = await service.albumBase(mockOrm, album, parameters, user);

		expect(result.series).toBeUndefined();
		expect(result.seriesID).toBeUndefined();
	});

	test('series fields are populated when album has series', async () => {
		const { service } = makeService();
		const series = makeSeriesReference('s-1', 'My Series');
		const album = makeAlbum({ series }) as never;
		const parameters: IncludesAlbumParameters = {};
		const user = { id: 'user-1' } as never;

		const result = await service.albumBase(mockOrm, album, parameters, user);

		expect(result.series).toBe('My Series');
		expect(result.seriesID).toBe('s-1');
	});

	test('state is undefined when albumIncState is false', async () => {
		const { service } = makeService();
		const album = makeAlbum() as never;
		const parameters: IncludesAlbumParameters = { albumIncState: false };
		const user = { id: 'user-1' } as never;

		const result = await service.albumBase(mockOrm, album, parameters, user);

		expect(result.state).toBeUndefined();
	});

	test('state is included when albumIncState is true', async () => {
		const { service } = makeService();
		const album = makeAlbum() as never;
		const parameters: IncludesAlbumParameters = { albumIncState: true };
		const user = { id: 'user-1' } as never;

		const result = await service.albumBase(mockOrm, album, parameters, user);

		expect(result.state).toBeDefined();
		expect((mockOrm as never as { State: { findOrCreate: ReturnType<typeof jest.fn> } }).State.findOrCreate)
			.toHaveBeenCalledWith('album-1', DBObjectType.album, 'user-1');
	});

	test('trackCount is undefined when albumIncTrackCount is false', async () => {
		const { service } = makeService();
		const album = makeAlbum() as never;
		const parameters: IncludesAlbumParameters = { albumIncTrackCount: false };
		const user = { id: 'user-1' } as never;

		const result = await service.albumBase(mockOrm, album, parameters, user);

		expect(result.trackCount).toBeUndefined();
	});

	test('trackCount is included when albumIncTrackCount is true', async () => {
		const { service } = makeService();
		const album = makeAlbum({ trackCount: 2 }) as never;
		const parameters: IncludesAlbumParameters = { albumIncTrackCount: true };
		const user = { id: 'user-1' } as never;

		const result = await service.albumBase(mockOrm, album, parameters, user);

		expect(result.trackCount).toBe(2);
	});

	test('trackIDs is undefined when albumIncTrackIDs is false', async () => {
		const { service } = makeService();
		const album = makeAlbum() as never;
		const parameters: IncludesAlbumParameters = { albumIncTrackIDs: false };
		const user = { id: 'user-1' } as never;

		const result = await service.albumBase(mockOrm, album, parameters, user);

		expect(result.trackIDs).toBeUndefined();
	});

	test('trackIDs is included when albumIncTrackIDs is true', async () => {
		const { service } = makeService();
		const album = makeAlbum({ trackIds: ['t1', 't2'] }) as never;
		const parameters: IncludesAlbumParameters = { albumIncTrackIDs: true };
		const user = { id: 'user-1' } as never;

		const result = await service.albumBase(mockOrm, album, parameters, user);

		expect(result.trackIDs).toEqual(['t1', 't2']);
	});

	test('info is undefined when albumIncInfo is false', async () => {
		const { service } = makeService();
		const album = makeAlbum() as never;
		const parameters: IncludesAlbumParameters = { albumIncInfo: false };
		const user = { id: 'user-1' } as never;

		const result = await service.albumBase(mockOrm, album, parameters, user);

		expect(result.info).toBeUndefined();
	});

	test('info is fetched when albumIncInfo is true', async () => {
		const { service, metaData } = makeService();
		const album = makeAlbum() as never;
		const parameters: IncludesAlbumParameters = { albumIncInfo: true };
		const user = { id: 'user-1' } as never;

		const result = await service.albumBase(mockOrm, album, parameters, user);

		expect(metaData.extInfo['byAlbum']).toHaveBeenCalledWith(mockOrm, album);
		expect(result.info).toBeDefined();
	});

	test('genres is undefined when albumIncGenres is false', async () => {
		const { service } = makeService();
		const album = makeAlbum() as never;
		const parameters: IncludesAlbumParameters = { albumIncGenres: false };
		const user = { id: 'user-1' } as never;

		const result = await service.albumBase(mockOrm, album, parameters, user);

		expect(result.genres).toBeUndefined();
	});

	test('genres are fetched when albumIncGenres is true', async () => {
		const mockGenre = { id: 'g-1', name: 'Rock' };
		const { service, Genre } = makeService();
		Genre.genreBases.mockResolvedValue([mockGenre] as never);
		const album = makeAlbum({ genres: [mockGenre] }) as never;
		const parameters: IncludesAlbumParameters = { albumIncGenres: true };
		const user = { id: 'user-1' } as never;

		const result = await service.albumBase(mockOrm, album, parameters, user);

		expect(Genre.genreBases).toHaveBeenCalled();
		expect(result.genres).toEqual([mockGenre]);
	});
});

describe('AlbumTransformService.albumBases', () => {
	test('maps an empty list to empty array', async () => {
		const { service } = makeService();
		const parameters: IncludesAlbumParameters = {};
		const user = { id: 'user-1' } as never;

		const result = await service.albumBases(mockOrm, [], parameters, user);

		expect(result).toEqual([]);
	});

	test('transforms each album in the list', async () => {
		const { service } = makeService();
		const album1 = makeAlbum({ id: 'a-1', name: 'Album 1' }) as never;
		const album2 = makeAlbum({ id: 'a-2', name: 'Album 2' }) as never;
		const parameters: IncludesAlbumParameters = {};
		const user = { id: 'user-1' } as never;

		const result = await service.albumBases(mockOrm, [album1, album2], parameters, user);

		expect(result).toHaveLength(2);
		expect(result[0].id).toBe('a-1');
		expect(result[1].id).toBe('a-2');
	});
});

describe('AlbumTransformService.albumIndex', () => {
	test('returns lastModified timestamp', async () => {
		const { service } = makeService();
		const indexResult = { groups: [] };
		const before = Date.now();
		const result = await service.albumIndex(mockOrm, indexResult as never);
		const after = Date.now();

		expect(result.lastModified).toBeGreaterThanOrEqual(before);
		expect(result.lastModified).toBeLessThanOrEqual(after);
	});

	test('returns empty groups for empty index', async () => {
		const { service } = makeService();
		const indexResult = { groups: [] };

		const result = await service.albumIndex(mockOrm, indexResult as never);

		expect(result.groups).toEqual([]);
	});

	test('maps groups with albums into index entries', async () => {
		const { service } = makeService();
		const artist = makeArtistReference('a-1', 'Pink Floyd');
		const albumItem = {
			...makeAlbum({ id: 'album-99', name: 'The Wall', artist }),
			artist: {
				get: jest.fn().mockResolvedValue(artist as never)
			}
		} as never;
		const indexResult = {
			groups: [{ name: 'T', items: [albumItem] }]
		};

		const result = await service.albumIndex(mockOrm, indexResult as never);

		expect(result.groups).toHaveLength(1);
		expect(result.groups[0].name).toBe('T');
		expect(result.groups[0].items).toHaveLength(1);
		const entry = result.groups[0].items[0];
		expect(entry.id).toBe('album-99');
		expect(entry.name).toBe('The Wall');
		expect(entry.artist).toBe('Pink Floyd');
		expect(entry.artistID).toBe('a-1');
	});

	test('uses fallback artist name when artist is undefined', async () => {
		const { service } = makeService();
		const albumItem = {
			...makeAlbum({ id: 'album-x', name: 'Orphan' }),
			artist: {
				get: jest.fn().mockResolvedValue(undefined as never),
				id: jest.fn().mockReturnValue(undefined)
			}
		} as never;
		const indexResult = { groups: [{ name: 'O', items: [albumItem] }] };

		const result = await service.albumIndex(mockOrm, indexResult as never);

		expect(result.groups[0].items[0].artist).toBe('[INVALID ARTIST]');
		expect(result.groups[0].items[0].artistID).toBe('INVALID_ARTIST_ID');
	});

	test('uses reference artist ID when artist is missing but reference has ID', async () => {
		const { service } = makeService();
		const albumItem = {
			...makeAlbum({ id: 'album-y', name: 'Partial' }),
			artist: {
				get: jest.fn().mockResolvedValue(undefined as never),
				id: jest.fn().mockReturnValue('ref-artist-id')
			}
		} as never;
		const indexResult = { groups: [{ name: 'P', items: [albumItem] }] };

		const result = await service.albumIndex(mockOrm, indexResult as never);

		expect(result.groups[0].items[0].artistID).toBe('ref-artist-id');
	});

	test('includes trackCount in index entry', async () => {
		const { service } = makeService();
		const artist = makeArtistReference();
		const albumItem = {
			...makeAlbum({ trackCount: 3, artist }),
			artist: {
				get: jest.fn().mockResolvedValue(artist as never)
			}
		} as never;
		const indexResult = { groups: [{ name: 'T', items: [albumItem] }] };

		const result = await service.albumIndex(mockOrm, indexResult as never);

		expect(result.groups[0].items[0].trackCount).toBe(3);
	});

	test('maps multiple groups correctly', async () => {
		const { service } = makeService();
		const artist = makeArtistReference();
		const album1 = {
			...makeAlbum({ id: 'a1', name: 'Alpha', artist }),
			artist: { get: jest.fn().mockResolvedValue(artist as never) }
		} as never;
		const album2 = {
			...makeAlbum({ id: 'b1', name: 'Beta', artist }),
			artist: { get: jest.fn().mockResolvedValue(artist as never) }
		} as never;
		const indexResult = {
			groups: [
				{ name: 'A', items: [album1] },
				{ name: 'B', items: [album2] }
			]
		};

		const result = await service.albumIndex(mockOrm, indexResult as never);

		expect(result.groups).toHaveLength(2);
		expect(result.groups[0].name).toBe('A');
		expect(result.groups[1].name).toBe('B');
	});
});
