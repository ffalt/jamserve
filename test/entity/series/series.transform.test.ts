import { jest } from '@jest/globals';
import { SeriesTransformService } from '../../../src/entity/series/series.transform.js';
import { AlbumType, DBObjectType } from '../../../src/types/enums.js';
import { IncludesSeriesParameters } from '../../../src/entity/series/series.parameters.js';
import { makeMockOrm } from '../shared/make-orm.js';
import { makeSeries } from '../shared/make-series.js';
import { makeTransformService } from '../shared/make-transform-service.js';

const mockOrm = makeMockOrm();

function makeService() {
	return makeTransformService(SeriesTransformService, 'bySeries');
}

describe('SeriesTransformService.seriesBase', () => {
	test('returns core series fields', async () => {
		const { service } = makeService();
		const series = makeSeries({ albumTypes: [AlbumType.album, AlbumType.compilation] }) as never;
		const parameters: IncludesSeriesParameters = {};
		const user = { id: 'user-1' } as never;

		const result = await service.seriesBase(mockOrm, series, parameters, user);

		expect(result.id).toBe('series-1');
		expect(result.name).toBe('Test Series');
		expect(result.artist).toBe('Test Artist');
		expect(result.artistID).toBe('artist-1');
		expect(result.albumTypes).toEqual([AlbumType.album, AlbumType.compilation]);
	});

	test('sets created from createdAt timestamp', async () => {
		const { service } = makeService();
		const createdAt = new Date(1_700_000_000_000);
		const series = makeSeries({ createdAt }) as never;
		const parameters: IncludesSeriesParameters = {};
		const user = { id: 'user-1' } as never;

		const result = await service.seriesBase(mockOrm, series, parameters, user);

		expect(result.created).toBe(createdAt.valueOf());
	});

	test('albumCount is undefined when seriesIncAlbumCount is false', async () => {
		const { service } = makeService();
		const series = makeSeries() as never;
		const parameters: IncludesSeriesParameters = { seriesIncAlbumCount: false };
		const user = { id: 'user-1' } as never;

		const result = await service.seriesBase(mockOrm, series, parameters, user);

		expect(result.albumCount).toBeUndefined();
	});

	test('albumCount is included when seriesIncAlbumCount is true', async () => {
		const { service } = makeService();
		const series = makeSeries({ albumCount: 4 }) as never;
		const parameters: IncludesSeriesParameters = { seriesIncAlbumCount: true };
		const user = { id: 'user-1' } as never;

		const result = await service.seriesBase(mockOrm, series, parameters, user);

		expect(result.albumCount).toBe(4);
	});

	test('trackCount is undefined when seriesIncTrackCount is false', async () => {
		const { service } = makeService();
		const series = makeSeries() as never;
		const parameters: IncludesSeriesParameters = { seriesIncTrackCount: false };
		const user = { id: 'user-1' } as never;

		const result = await service.seriesBase(mockOrm, series, parameters, user);

		expect(result.trackCount).toBeUndefined();
	});

	test('trackCount is included when seriesIncTrackCount is true', async () => {
		const { service } = makeService();
		const series = makeSeries({ trackCount: 12 }) as never;
		const parameters: IncludesSeriesParameters = { seriesIncTrackCount: true };
		const user = { id: 'user-1' } as never;

		const result = await service.seriesBase(mockOrm, series, parameters, user);

		expect(result.trackCount).toBe(12);
	});

	test('trackIDs is undefined when seriesIncTrackIDs is false', async () => {
		const { service } = makeService();
		const series = makeSeries() as never;
		const parameters: IncludesSeriesParameters = { seriesIncTrackIDs: false };
		const user = { id: 'user-1' } as never;

		const result = await service.seriesBase(mockOrm, series, parameters, user);

		expect(result.trackIDs).toBeUndefined();
	});

	test('trackIDs is included when seriesIncTrackIDs is true', async () => {
		const { service } = makeService();
		const series = makeSeries({ trackIds: ['t1', 't2', 't3'] }) as never;
		const parameters: IncludesSeriesParameters = { seriesIncTrackIDs: true };
		const user = { id: 'user-1' } as never;

		const result = await service.seriesBase(mockOrm, series, parameters, user);

		expect(result.trackIDs).toEqual(['t1', 't2', 't3']);
	});

	test('albumIDs is undefined when seriesIncAlbumIDs is false', async () => {
		const { service } = makeService();
		const series = makeSeries() as never;
		const parameters: IncludesSeriesParameters = { seriesIncAlbumIDs: false };
		const user = { id: 'user-1' } as never;

		const result = await service.seriesBase(mockOrm, series, parameters, user);

		expect(result.albumIDs).toBeUndefined();
	});

	test('albumIDs is included when seriesIncAlbumIDs is true', async () => {
		const { service } = makeService();
		const series = makeSeries({ albumIds: ['a1', 'a2'] }) as never;
		const parameters: IncludesSeriesParameters = { seriesIncAlbumIDs: true };
		const user = { id: 'user-1' } as never;

		const result = await service.seriesBase(mockOrm, series, parameters, user);

		expect(result.albumIDs).toEqual(['a1', 'a2']);
	});

	test('state is undefined when seriesIncState is false', async () => {
		const { service } = makeService();
		const series = makeSeries() as never;
		const parameters: IncludesSeriesParameters = { seriesIncState: false };
		const user = { id: 'user-1' } as never;

		const result = await service.seriesBase(mockOrm, series, parameters, user);

		expect(result.state).toBeUndefined();
	});

	test('state is included when seriesIncState is true', async () => {
		const { service } = makeService();
		const series = makeSeries() as never;
		const parameters: IncludesSeriesParameters = { seriesIncState: true };
		const user = { id: 'user-1' } as never;

		const result = await service.seriesBase(mockOrm, series, parameters, user);

		expect(result.state).toBeDefined();
		expect((mockOrm as never as { State: { findOrCreate: ReturnType<typeof jest.fn> } }).State.findOrCreate)
			.toHaveBeenCalledWith('series-1', DBObjectType.series, 'user-1');
	});

	test('info is undefined when seriesIncInfo is false', async () => {
		const { service } = makeService();
		const series = makeSeries() as never;
		const parameters: IncludesSeriesParameters = { seriesIncInfo: false };
		const user = { id: 'user-1' } as never;

		const result = await service.seriesBase(mockOrm, series, parameters, user);

		expect(result.info).toBeUndefined();
	});

	test('info is fetched when seriesIncInfo is true', async () => {
		const { service, metaData } = makeService();
		const series = makeSeries() as never;
		const parameters: IncludesSeriesParameters = { seriesIncInfo: true };
		const user = { id: 'user-1' } as never;

		const result = await service.seriesBase(mockOrm, series, parameters, user);

		expect(metaData.extInfo['bySeries']).toHaveBeenCalledWith(mockOrm, series);
		expect(result.info).toBeDefined();
	});
});

describe('SeriesTransformService.seriesBases', () => {
	test('maps an empty list to empty array', async () => {
		const { service } = makeService();
		const parameters: IncludesSeriesParameters = {};
		const user = { id: 'user-1' } as never;

		const result = await service.seriesBases(mockOrm, [], parameters, user);

		expect(result).toEqual([]);
	});

	test('transforms each series in the list', async () => {
		const { service } = makeService();
		const series1 = makeSeries({ id: 's-1', name: 'Series 1' }) as never;
		const series2 = makeSeries({ id: 's-2', name: 'Series 2' }) as never;
		const parameters: IncludesSeriesParameters = {};
		const user = { id: 'user-1' } as never;

		const result = await service.seriesBases(mockOrm, [series1, series2], parameters, user);

		expect(result).toHaveLength(2);
		expect(result[0].id).toBe('s-1');
		expect(result[1].id).toBe('s-2');
	});
});

describe('SeriesTransformService.seriesIndex', () => {
	test('returns lastModified timestamp', async () => {
		const { service } = makeService();
		const indexResult = { groups: [] };
		const before = Date.now();
		const result = await service.seriesIndex(mockOrm, indexResult as never);
		const after = Date.now();

		expect(result.lastModified).toBeGreaterThanOrEqual(before);
		expect(result.lastModified).toBeLessThanOrEqual(after);
	});

	test('returns empty groups for empty index', async () => {
		const { service } = makeService();
		const indexResult = { groups: [] };

		const result = await service.seriesIndex(mockOrm, indexResult as never);

		expect(result.groups).toEqual([]);
	});

	test('maps groups with series into index entries', async () => {
		const { service } = makeService();
		const seriesItem = {
			id: 'series-99',
			name: 'The Dark Tower',
			albums: { count: jest.fn().mockResolvedValue(7 as never) },
			tracks: { count: jest.fn().mockResolvedValue(50 as never) }
		} as never;
		const indexResult = {
			groups: [{ name: 'T', items: [seriesItem] }]
		};

		const result = await service.seriesIndex(mockOrm, indexResult as never);

		expect(result.groups).toHaveLength(1);
		expect(result.groups[0].name).toBe('T');
		expect(result.groups[0].items).toHaveLength(1);
		const entry = result.groups[0].items[0];
		expect(entry.id).toBe('series-99');
		expect(entry.name).toBe('The Dark Tower');
		expect(entry.albumCount).toBe(7);
		expect(entry.trackCount).toBe(50);
	});

	test('maps multiple groups correctly', async () => {
		const { service } = makeService();
		const makeIndexSeries = (id: string, name: string) => ({
			id,
			name,
			albums: { count: jest.fn().mockResolvedValue(0 as never) },
			tracks: { count: jest.fn().mockResolvedValue(0 as never) }
		});
		const indexResult = {
			groups: [
				{ name: 'A', items: [makeIndexSeries('a1', 'Alpha') as never] },
				{ name: 'B', items: [makeIndexSeries('b1', 'Beta') as never] }
			]
		};

		const result = await service.seriesIndex(mockOrm, indexResult as never);

		expect(result.groups).toHaveLength(2);
		expect(result.groups[0].name).toBe('A');
		expect(result.groups[1].name).toBe('B');
	});
});
