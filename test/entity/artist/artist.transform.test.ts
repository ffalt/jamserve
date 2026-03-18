import { ArtistTransformService } from '../../../src/entity/artist/artist.transform.js';
import { AlbumType, DBObjectType } from '../../../src/types/enums.js';
import { IncludesArtistParameters } from '../../../src/entity/artist/artist.parameters.js';
import { makeArtist } from '../shared/make-artist.js';
import { makeMockOrm } from '../shared/make-orm.js';
import { makeTransformService } from '../shared/make-transform-service.js';
import { jest } from '@jest/globals';

const mockOrm = makeMockOrm();

function makeService() {
	return makeTransformService(ArtistTransformService, 'byArtist');
}

describe('ArtistTransformService.artistBase', () => {
	test('returns core artist fields', async () => {
		const { service } = makeService();
		const artist = makeArtist({ mbArtistID: 'mb-artist-id' }) as never;
		const parameters: IncludesArtistParameters = {};
		const user = { id: 'user-1' } as never;

		const result = await service.artistBase(mockOrm, artist, parameters, user);

		expect(result.id).toBe('artist-1');
		expect(result.name).toBe('Test Artist');
		expect(result.mbArtistID).toBe('mb-artist-id');
		expect(result.albumTypes).toEqual([AlbumType.album]);
	});

	test('sets created from createdAt timestamp', async () => {
		const { service } = makeService();
		const createdAt = new Date(1_700_000_000_000);
		const artist = makeArtist({ createdAt }) as never;
		const parameters: IncludesArtistParameters = {};
		const user = { id: 'user-1' } as never;

		const result = await service.artistBase(mockOrm, artist, parameters, user);

		expect(result.created).toBe(createdAt.valueOf());
	});

	test('albumCount is undefined when artistIncAlbumCount is false', async () => {
		const { service } = makeService();
		const artist = makeArtist() as never;
		const parameters: IncludesArtistParameters = { artistIncAlbumCount: false };
		const user = { id: 'user-1' } as never;

		const result = await service.artistBase(mockOrm, artist, parameters, user);

		expect(result.albumCount).toBeUndefined();
	});

	test('albumCount is included when artistIncAlbumCount is true', async () => {
		const { service } = makeService();
		const artist = makeArtist({ albumCount: 3 }) as never;
		const parameters: IncludesArtistParameters = { artistIncAlbumCount: true };
		const user = { id: 'user-1' } as never;

		const result = await service.artistBase(mockOrm, artist, parameters, user);

		expect(result.albumCount).toBe(3);
	});

	test('trackCount is undefined when artistIncTrackCount is false', async () => {
		const { service } = makeService();
		const artist = makeArtist() as never;
		const parameters: IncludesArtistParameters = { artistIncTrackCount: false };
		const user = { id: 'user-1' } as never;

		const result = await service.artistBase(mockOrm, artist, parameters, user);

		expect(result.trackCount).toBeUndefined();
	});

	test('trackCount is included when artistIncTrackCount is true', async () => {
		const { service } = makeService();
		const artist = makeArtist({ trackCount: 5 }) as never;
		const parameters: IncludesArtistParameters = { artistIncTrackCount: true };
		const user = { id: 'user-1' } as never;

		const result = await service.artistBase(mockOrm, artist, parameters, user);

		expect(result.trackCount).toBe(5);
	});

	test('seriesCount is undefined when artistIncSeriesCount is false', async () => {
		const { service } = makeService();
		const artist = makeArtist() as never;
		const parameters: IncludesArtistParameters = { artistIncSeriesCount: false };
		const user = { id: 'user-1' } as never;

		const result = await service.artistBase(mockOrm, artist, parameters, user);

		expect(result.seriesCount).toBeUndefined();
	});

	test('seriesCount is included when artistIncSeriesCount is true', async () => {
		const { service } = makeService();
		const artist = makeArtist({ seriesCount: 2 }) as never;
		const parameters: IncludesArtistParameters = { artistIncSeriesCount: true };
		const user = { id: 'user-1' } as never;

		const result = await service.artistBase(mockOrm, artist, parameters, user);

		expect(result.seriesCount).toBe(2);
	});

	test('state is undefined when artistIncState is false', async () => {
		const { service } = makeService();
		const artist = makeArtist() as never;
		const parameters: IncludesArtistParameters = { artistIncState: false };
		const user = { id: 'user-1' } as never;

		const result = await service.artistBase(mockOrm, artist, parameters, user);

		expect(result.state).toBeUndefined();
	});

	test('state is included when artistIncState is true', async () => {
		const { service } = makeService();
		const artist = makeArtist() as never;
		const parameters: IncludesArtistParameters = { artistIncState: true };
		const user = { id: 'user-1' } as never;

		const result = await service.artistBase(mockOrm, artist, parameters, user);

		expect(result.state).toBeDefined();
		expect((mockOrm as never as { State: { findOrCreate: ReturnType<typeof jest.fn> } }).State.findOrCreate)
			.toHaveBeenCalledWith('artist-1', DBObjectType.artist, 'user-1');
	});

	test('trackIDs is undefined when artistIncTrackIDs is false', async () => {
		const { service } = makeService();
		const artist = makeArtist() as never;
		const parameters: IncludesArtistParameters = { artistIncTrackIDs: false };
		const user = { id: 'user-1' } as never;

		const result = await service.artistBase(mockOrm, artist, parameters, user);

		expect(result.trackIDs).toBeUndefined();
	});

	test('trackIDs is included when artistIncTrackIDs is true', async () => {
		const { service } = makeService();
		const artist = makeArtist({ trackIds: ['t1', 't2'] }) as never;
		const parameters: IncludesArtistParameters = { artistIncTrackIDs: true };
		const user = { id: 'user-1' } as never;

		const result = await service.artistBase(mockOrm, artist, parameters, user);

		expect(result.trackIDs).toEqual(['t1', 't2']);
	});

	test('albumIDs is undefined when artistIncAlbumIDs is false', async () => {
		const { service } = makeService();
		const artist = makeArtist() as never;
		const parameters: IncludesArtistParameters = { artistIncAlbumIDs: false };
		const user = { id: 'user-1' } as never;

		const result = await service.artistBase(mockOrm, artist, parameters, user);

		expect(result.albumIDs).toBeUndefined();
	});

	test('albumIDs is included when artistIncAlbumIDs is true', async () => {
		const { service } = makeService();
		const artist = makeArtist({ albumIds: ['a1', 'a2'] }) as never;
		const parameters: IncludesArtistParameters = { artistIncAlbumIDs: true };
		const user = { id: 'user-1' } as never;

		const result = await service.artistBase(mockOrm, artist, parameters, user);

		expect(result.albumIDs).toEqual(['a1', 'a2']);
	});

	test('seriesIDs is undefined when artistIncSeriesIDs is false', async () => {
		const { service } = makeService();
		const artist = makeArtist() as never;
		const parameters: IncludesArtistParameters = { artistIncSeriesIDs: false };
		const user = { id: 'user-1' } as never;

		const result = await service.artistBase(mockOrm, artist, parameters, user);

		expect(result.seriesIDs).toBeUndefined();
	});

	test('seriesIDs is included when artistIncSeriesIDs is true', async () => {
		const { service } = makeService();
		const artist = makeArtist({ seriesIds: ['s1'] }) as never;
		const parameters: IncludesArtistParameters = { artistIncSeriesIDs: true };
		const user = { id: 'user-1' } as never;

		const result = await service.artistBase(mockOrm, artist, parameters, user);

		expect(result.seriesIDs).toEqual(['s1']);
	});

	test('info is undefined when artistIncInfo is false', async () => {
		const { service } = makeService();
		const artist = makeArtist() as never;
		const parameters: IncludesArtistParameters = { artistIncInfo: false };
		const user = { id: 'user-1' } as never;

		const result = await service.artistBase(mockOrm, artist, parameters, user);

		expect(result.info).toBeUndefined();
	});

	test('info is fetched when artistIncInfo is true', async () => {
		const { service, metaData } = makeService();
		const artist = makeArtist() as never;
		const parameters: IncludesArtistParameters = { artistIncInfo: true };
		const user = { id: 'user-1' } as never;

		const result = await service.artistBase(mockOrm, artist, parameters, user);

		expect(metaData.extInfo['byArtist']).toHaveBeenCalledWith(mockOrm, artist);
		expect(result.info).toBeDefined();
	});

	test('genres is undefined when artistIncGenres is false', async () => {
		const { service } = makeService();
		const artist = makeArtist() as never;
		const parameters: IncludesArtistParameters = { artistIncGenres: false };
		const user = { id: 'user-1' } as never;

		const result = await service.artistBase(mockOrm, artist, parameters, user);

		expect(result.genres).toBeUndefined();
	});

	test('genres are fetched when artistIncGenres is true', async () => {
		const mockGenre = { id: 'g-1', name: 'Rock' };
		const { service, Genre } = makeService();
		Genre.genreBases.mockResolvedValue([mockGenre] as never);
		const artist = makeArtist({ genres: [mockGenre] }) as never;
		const parameters: IncludesArtistParameters = { artistIncGenres: true };
		const user = { id: 'user-1' } as never;

		const result = await service.artistBase(mockOrm, artist, parameters, user);

		expect(Genre.genreBases).toHaveBeenCalled();
		expect(result.genres).toEqual([mockGenre]);
	});
});

describe('ArtistTransformService.artistBases', () => {
	test('maps an empty list to empty array', async () => {
		const { service } = makeService();
		const parameters: IncludesArtistParameters = {};
		const user = { id: 'user-1' } as never;

		const result = await service.artistBases(mockOrm, [], parameters, user);

		expect(result).toEqual([]);
	});

	test('transforms each artist in the list', async () => {
		const { service } = makeService();
		const artist1 = makeArtist({ id: 'a-1', name: 'Artist 1' }) as never;
		const artist2 = makeArtist({ id: 'a-2', name: 'Artist 2' }) as never;
		const parameters: IncludesArtistParameters = {};
		const user = { id: 'user-1' } as never;

		const result = await service.artistBases(mockOrm, [artist1, artist2], parameters, user);

		expect(result).toHaveLength(2);
		expect(result[0].id).toBe('a-1');
		expect(result[1].id).toBe('a-2');
	});
});

describe('ArtistTransformService.artistIndex', () => {
	test('returns lastModified timestamp', async () => {
		const { service } = makeService();
		const indexResult = { groups: [] };
		const before = Date.now();
		const result = await service.artistIndex(mockOrm, indexResult as never);
		const after = Date.now();

		expect(result.lastModified).toBeGreaterThanOrEqual(before);
		expect(result.lastModified).toBeLessThanOrEqual(after);
	});

	test('returns empty groups for empty index', async () => {
		const { service } = makeService();
		const indexResult = { groups: [] };

		const result = await service.artistIndex(mockOrm, indexResult as never);

		expect(result.groups).toEqual([]);
	});

	test('maps groups with artists into index entries', async () => {
		const { service } = makeService();
		const artistItem = {
			id: 'artist-99',
			name: 'Pink Floyd',
			albums: { count: jest.fn().mockResolvedValue(5 as never) },
			tracks: { count: jest.fn().mockResolvedValue(42 as never) }
		} as never;
		const indexResult = {
			groups: [{ name: 'P', items: [artistItem] }]
		};

		const result = await service.artistIndex(mockOrm, indexResult as never);

		expect(result.groups).toHaveLength(1);
		expect(result.groups[0].name).toBe('P');
		expect(result.groups[0].items).toHaveLength(1);
		const entry = result.groups[0].items[0];
		expect(entry.id).toBe('artist-99');
		expect(entry.name).toBe('Pink Floyd');
		expect(entry.albumCount).toBe(5);
		expect(entry.trackCount).toBe(42);
	});

	test('maps multiple groups correctly', async () => {
		const { service } = makeService();
		const makeIndexArtist = (id: string, name: string) => ({
			id,
			name,
			albums: { count: jest.fn().mockResolvedValue(0 as never) },
			tracks: { count: jest.fn().mockResolvedValue(0 as never) }
		});
		const indexResult = {
			groups: [
				{ name: 'A', items: [makeIndexArtist('a1', 'Alpha') as never] },
				{ name: 'B', items: [makeIndexArtist('b1', 'Beta') as never] }
			]
		};

		const result = await service.artistIndex(mockOrm, indexResult as never);

		expect(result.groups).toHaveLength(2);
		expect(result.groups[0].name).toBe('A');
		expect(result.groups[1].name).toBe('B');
	});
});
