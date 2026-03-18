import { jest } from '@jest/globals';
import { AlbumResolver } from '../../../src/entity/album/album.resolver.js';
import { DBObjectType } from '../../../src/types/enums.js';
import type { Context } from '../../../src/modules/server/middlewares/apollo.context.js';
import { mockFolders, mockGenres, mockRoots, mockSeries, mockState, mockTracks, mockUser } from '../shared/mock-data.js';
import { makeAlbum } from '../shared/make-album.js';

const mockArtist = { id: 'artist-1', name: 'Pink Floyd' };

function makeContext() {
	const orm = {
		Album: {
			oneOrFailByID: jest.fn().mockResolvedValue({ id: 'album-1' } as never),
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

const resolver = new AlbumResolver();

describe('AlbumResolver.album (Query)', () => {
	test('returns album fetched by id', async () => {
		const { orm, ctx } = makeContext();

		const result = await resolver.album('album-1', ctx);

		expect(orm.Album.oneOrFailByID).toHaveBeenCalledWith('album-1');
		expect(result).toEqual({ id: 'album-1' });
	});

	test('passes different id to oneOrFailByID', async () => {
		const { orm, ctx } = makeContext();

		await resolver.album('album-99', ctx);

		expect(orm.Album.oneOrFailByID).toHaveBeenCalledWith('album-99');
	});
});

describe('AlbumResolver.albums (Query)', () => {
	test('uses searchFilter when no list type provided', async () => {
		const { orm, ctx } = makeContext();
		const arguments_ = { filter: {}, page: {}, order: [], list: undefined, seed: undefined } as never;

		const result = await resolver.albums(arguments_, ctx);

		expect(orm.Album.searchFilter).toHaveBeenCalledWith({}, [], {}, mockUser);
		expect(orm.Album.findListFilter).not.toHaveBeenCalled();
		expect(result).toEqual({ items: [], total: 0 });
	});

	test('uses findListFilter when list type is provided', async () => {
		const { orm, ctx } = makeContext();
		const arguments_ = { filter: {}, page: {}, order: [], list: 'random' as never, seed: 'abc' } as never;

		const result = await resolver.albums(arguments_, ctx);

		expect(orm.Album.findListFilter).toHaveBeenCalledWith('random', 'abc', {}, [], {}, mockUser);
		expect(orm.Album.searchFilter).not.toHaveBeenCalled();
		expect(result).toEqual({ items: [], total: 0 });
	});

	test('passes filter, order and page to searchFilter', async () => {
		const { orm, ctx } = makeContext();
		const filter = { name: 'Dark Side' };
		const order = [{ orderBy: 'name' }];
		const page = { take: 10, skip: 0 };
		const arguments_ = { filter, page, order, list: undefined, seed: undefined } as never;

		await resolver.albums(arguments_, ctx);

		expect(orm.Album.searchFilter).toHaveBeenCalledWith(filter, order, page, mockUser);
	});
});

describe('AlbumResolver.albumIndex (Query)', () => {
	test('calls indexFilter and returns result', async () => {
		const { orm, ctx } = makeContext();
		const filter = { name: 'P' };
		const arguments_ = { filter } as never;

		const result = await resolver.albumIndex(arguments_, ctx);

		expect(orm.Album.indexFilter).toHaveBeenCalledWith(filter);
		expect(result).toEqual({ groups: [] });
	});

	test('works with empty filter', async () => {
		const { orm, ctx } = makeContext();

		await resolver.albumIndex({ filter: {} } as never, ctx);

		expect(orm.Album.indexFilter).toHaveBeenCalledWith({});
	});
});

describe('AlbumResolver.artist (FieldResolver)', () => {
	test('returns artist from album reference', async () => {
		const album = makeAlbum({ artist: mockArtist });

		const result = await resolver.artist(album as never);

		expect(album.artist.getOrFail).toHaveBeenCalled();
		expect(result).toBe(mockArtist);
	});
});

describe('AlbumResolver.tracks (FieldResolver)', () => {
	test('returns all tracks of the album', async () => {
		const album = makeAlbum({ tracks: mockTracks });

		const result = await resolver.tracks(album as never);

		expect(album.tracks.getItems).toHaveBeenCalled();
		expect(result).toBe(mockTracks);
	});

	test('returns empty array when album has no tracks', async () => {
		const album = makeAlbum({ tracks: [] });

		const result = await resolver.tracks(album as never);

		expect(result).toEqual([]);
	});
});

describe('AlbumResolver.genres (FieldResolver)', () => {
	test('returns all genres of the album', async () => {
		const album = makeAlbum({ genres: mockGenres });

		const result = await resolver.genres(album as never);

		expect(album.genres.getItems).toHaveBeenCalled();
		expect(result).toBe(mockGenres);
	});

	test('returns empty array when album has no genres', async () => {
		const album = makeAlbum({ genres: [] });

		const result = await resolver.genres(album as never);

		expect(result).toEqual([]);
	});
});

describe('AlbumResolver.roots (FieldResolver)', () => {
	test('returns all roots of the album', async () => {
		const album = makeAlbum({ roots: mockRoots });

		const result = await resolver.roots(album as never);

		expect(album.roots.getItems).toHaveBeenCalled();
		expect(result).toBe(mockRoots);
	});
});

describe('AlbumResolver.folders (FieldResolver)', () => {
	test('returns all folders of the album', async () => {
		const album = makeAlbum({ folders: mockFolders });

		const result = await resolver.folders(album as never);

		expect(album.folders.getItems).toHaveBeenCalled();
		expect(result).toBe(mockFolders);
	});
});

describe('AlbumResolver.series (FieldResolver)', () => {
	test('returns series when album belongs to a series', async () => {
		const album = makeAlbum({ series: mockSeries });

		const result = await resolver.series(album as never);

		expect(album.series.get).toHaveBeenCalled();
		expect(result).toBe(mockSeries);
	});

	test('returns undefined when album has no series', async () => {
		const album = makeAlbum({ series: undefined });

		const result = await resolver.series(album as never);

		expect(result).toBeUndefined();
	});
});

describe('AlbumResolver.state (FieldResolver)', () => {
	test('calls findOrCreate with album id, album type, and user id', async () => {
		const album = makeAlbum();
		const { orm, ctx } = makeContext();

		const result = await resolver.state(album as never, ctx);

		expect(orm.State.findOrCreate).toHaveBeenCalledWith('album-1', DBObjectType.album, 'user-1');
		expect(result).toBe(mockState);
	});

	test('uses the id from the root album', async () => {
		const album = makeAlbum({ id: 'album-42' });
		const { orm, ctx } = makeContext();

		await resolver.state(album as never, ctx);

		expect(orm.State.findOrCreate).toHaveBeenCalledWith('album-42', DBObjectType.album, 'user-1');
	});
});

describe('AlbumResolver.foldersCount (FieldResolver)', () => {
	test('returns folder count from collection', async () => {
		const album = makeAlbum({ folders: mockFolders });

		const result = await resolver.foldersCount(album as never);

		expect(album.folders.count).toHaveBeenCalled();
		expect(result).toBe(mockFolders.length);
	});

	test('returns zero when album has no folders', async () => {
		const album = makeAlbum({ folders: [] });

		const result = await resolver.foldersCount(album as never);

		expect(result).toBe(0);
	});
});

describe('AlbumResolver.tracksCount (FieldResolver)', () => {
	test('returns track count from collection', async () => {
		const album = makeAlbum({ tracks: mockTracks });

		const result = await resolver.tracksCount(album as never);

		expect(album.tracks.count).toHaveBeenCalled();
		expect(result).toBe(mockTracks.length);
	});

	test('returns zero when album has no tracks', async () => {
		const album = makeAlbum({ tracks: [] });

		const result = await resolver.tracksCount(album as never);

		expect(result).toBe(0);
	});
});

describe('AlbumResolver.rootsCount (FieldResolver)', () => {
	test('returns roots count from collection', async () => {
		const album = makeAlbum({ roots: mockRoots });

		const result = await resolver.rootsCount(album as never);

		expect(album.roots.count).toHaveBeenCalled();
		expect(result).toBe(mockRoots.length);
	});

	test('returns zero when album has no roots', async () => {
		const album = makeAlbum({ roots: [] });

		const result = await resolver.rootsCount(album as never);

		expect(result).toBe(0);
	});
});
