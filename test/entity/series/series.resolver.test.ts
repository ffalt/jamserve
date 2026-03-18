import { jest } from '@jest/globals';
import { SeriesResolver } from '../../../src/entity/series/series.resolver.js';
import { DBObjectType } from '../../../src/types/enums.js';
import type { Context } from '../../../src/modules/server/middlewares/apollo.context.js';
import { mockState, mockTracks, mockGenres, mockRoots, mockFolders } from '../shared/mock-data.js';
import { makeSeries } from '../shared/make-series.js';

const mockUser = { id: 'user-1', roleAdmin: false };
const mockAlbums = [{ id: 'album-1' }, { id: 'album-2' }];

function makeContext() {
	const orm = {
		Series: {
			oneOrFailByID: jest.fn().mockResolvedValue({ id: 'series-1' } as never),
			findListFilter: jest.fn().mockResolvedValue({ items: [], total: 0 } as never),
			searchFilter: jest.fn().mockResolvedValue({ items: [], total: 0 } as never),
			indexFilter: jest.fn().mockResolvedValue({ groups: [] } as never)
		},
		State: {
			findOrCreate: jest.fn().mockResolvedValue(mockState as never)
		}
	};
	const context = { orm, user: mockUser } as unknown as Context;
	return { orm, ctx: context };
}

const resolver = new SeriesResolver();

describe('SeriesResolver.series (Query)', () => {
	test('returns series fetched by id', async () => {
		const { orm, ctx } = makeContext();

		const result = await resolver.series('series-1', ctx);

		expect(orm.Series.oneOrFailByID).toHaveBeenCalledWith('series-1');
		expect(result).toEqual({ id: 'series-1' });
	});

	test('passes different id to oneOrFailByID', async () => {
		const { orm, ctx } = makeContext();

		await resolver.series('series-42', ctx);

		expect(orm.Series.oneOrFailByID).toHaveBeenCalledWith('series-42');
	});
});

describe('SeriesResolver.serieses (Query)', () => {
	test('uses searchFilter when no list type provided', async () => {
		const { orm, ctx } = makeContext();
		const arguments_ = { filter: {}, page: {}, order: [], list: undefined, seed: undefined } as never;

		const result = await resolver.serieses(arguments_, ctx);

		expect(orm.Series.searchFilter).toHaveBeenCalledWith({}, [], {}, mockUser);
		expect(orm.Series.findListFilter).not.toHaveBeenCalled();
		expect(result).toEqual({ items: [], total: 0 });
	});

	test('uses findListFilter when list type is provided', async () => {
		const { orm, ctx } = makeContext();
		const arguments_ = { filter: {}, page: {}, order: [], list: 'random' as never, seed: 'abc' } as never;

		const result = await resolver.serieses(arguments_, ctx);

		expect(orm.Series.findListFilter).toHaveBeenCalledWith('random', 'abc', {}, [], {}, mockUser);
		expect(orm.Series.searchFilter).not.toHaveBeenCalled();
		expect(result).toEqual({ items: [], total: 0 });
	});

	test('passes filter, order and page to searchFilter', async () => {
		const { orm, ctx } = makeContext();
		const filter = { name: 'Dark Tower' };
		const order = [{ orderBy: 'name' }];
		const page = { take: 10, skip: 0 };
		const arguments_ = { filter, page, order, list: undefined, seed: undefined } as never;

		await resolver.serieses(arguments_, ctx);

		expect(orm.Series.searchFilter).toHaveBeenCalledWith(filter, order, page, mockUser);
	});
});

describe('SeriesResolver.seriesIndex (Query)', () => {
	test('calls indexFilter and returns result', async () => {
		const { orm, ctx } = makeContext();
		const filter = { name: 'D' };
		const arguments_ = { filter } as never;

		const result = await resolver.seriesIndex(arguments_, ctx);

		expect(orm.Series.indexFilter).toHaveBeenCalledWith(filter, mockUser);
		expect(result).toEqual({ groups: [] });
	});

	test('works with empty filter', async () => {
		const { orm, ctx } = makeContext();

		await resolver.seriesIndex({ filter: {} } as never, ctx);

		expect(orm.Series.indexFilter).toHaveBeenCalledWith({}, mockUser);
	});
});

describe('SeriesResolver.roots (FieldResolver)', () => {
	test('returns all roots of the series', async () => {
		const series = makeSeries({ roots: mockRoots });

		const result = await resolver.roots(series as never);

		expect(series.roots.getItems).toHaveBeenCalled();
		expect(result).toBe(mockRoots);
	});
});

describe('SeriesResolver.rootsCount (FieldResolver)', () => {
	test('returns root count from collection', async () => {
		const series = makeSeries({ roots: mockRoots });

		const result = await resolver.rootsCount(series as never);

		expect(series.roots.count).toHaveBeenCalled();
		expect(result).toBe(mockRoots.length);
	});
});

describe('SeriesResolver.folders (FieldResolver)', () => {
	test('returns all folders of the series', async () => {
		const series = makeSeries({ folders: mockFolders });

		const result = await resolver.folders(series as never);

		expect(series.folders.getItems).toHaveBeenCalled();
		expect(result).toBe(mockFolders);
	});
});

describe('SeriesResolver.foldersCount (FieldResolver)', () => {
	test('returns folder count from collection', async () => {
		const series = makeSeries({ folders: mockFolders });

		const result = await resolver.foldersCount(series as never);

		expect(series.folders.count).toHaveBeenCalled();
		expect(result).toBe(mockFolders.length);
	});
});

describe('SeriesResolver.tracks (FieldResolver)', () => {
	test('returns all tracks of the series', async () => {
		const series = makeSeries({ tracks: mockTracks });

		const result = await resolver.tracks(series as never);

		expect(series.tracks.getItems).toHaveBeenCalled();
		expect(result).toBe(mockTracks);
	});
});

describe('SeriesResolver.tracksCount (FieldResolver)', () => {
	test('returns track count from collection', async () => {
		const series = makeSeries({ tracks: mockTracks });

		const result = await resolver.tracksCount(series as never);

		expect(series.tracks.count).toHaveBeenCalled();
		expect(result).toBe(mockTracks.length);
	});
});

describe('SeriesResolver.albums (FieldResolver)', () => {
	test('returns all albums of the series', async () => {
		const series = makeSeries({ albums: mockAlbums });

		const result = await resolver.albums(series as never);

		expect(series.albums.getItems).toHaveBeenCalled();
		expect(result).toBe(mockAlbums);
	});
});

describe('SeriesResolver.albumsCount (FieldResolver)', () => {
	test('returns album count from collection', async () => {
		const series = makeSeries({ albums: mockAlbums });

		const result = await resolver.albumsCount(series as never);

		expect(series.albums.count).toHaveBeenCalled();
		expect(result).toBe(mockAlbums.length);
	});
});

describe('SeriesResolver.genresCount (FieldResolver)', () => {
	test('returns genre count from collection', async () => {
		const series = makeSeries({ genres: mockGenres });

		const result = await resolver.genresCount(series as never);

		expect(series.genres.count).toHaveBeenCalled();
		expect(result).toBe(mockGenres.length);
	});
});

describe('SeriesResolver.artist (FieldResolver)', () => {
	test('returns artist from series reference', async () => {
		const artistObj = { id: 'artist-1', name: 'Test Artist' };
		const series = makeSeries({ artist: artistObj });

		const result = await resolver.artist(series as never);

		expect(series.artist.get).toHaveBeenCalled();
		expect(result).toBe(artistObj);
	});
});

describe('SeriesResolver.state (FieldResolver)', () => {
	test('calls findOrCreate with series id, series type, and user id', async () => {
		const series = makeSeries();
		const { orm, ctx } = makeContext();

		const result = await resolver.state(series as never, ctx);

		expect(orm.State.findOrCreate).toHaveBeenCalledWith('series-1', DBObjectType.series, 'user-1');
		expect(result).toBe(mockState);
	});

	test('uses the id from the root series', async () => {
		const series = makeSeries({ id: 'series-42' });
		const { orm, ctx } = makeContext();

		await resolver.state(series as never, ctx);

		expect(orm.State.findOrCreate).toHaveBeenCalledWith('series-42', DBObjectType.series, 'user-1');
	});
});
