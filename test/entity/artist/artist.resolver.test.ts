import { jest } from '@jest/globals';
import { ArtistResolver } from '../../../src/entity/artist/artist.resolver.js';
import { DBObjectType } from '../../../src/types/enums.js';
import type { Context } from '../../../src/modules/server/middlewares/apollo.context.js';
import { makeArtist } from '../shared/make-artist.js';
import { mockFolders, mockGenres, mockRoots, mockState, mockTracks, mockUser } from '../shared/mock-data.js';

const mockAlbumTracks = [{ id: 'track-3' }];
const mockAlbums = [{ id: 'album-1' }];
const mockSeries = [{ id: 'series-1' }];

function makeContext() {
	const orm = {
		Artist: {
			oneOrFailByID: jest.fn().mockResolvedValue({ id: 'artist-1' } as never),
			findListFilter: jest.fn().mockResolvedValue({ items: [], total: 0 } as never),
			searchFilter: jest.fn().mockResolvedValue({ items: [], total: 0 } as never),
			indexFilter: jest.fn().mockResolvedValue({ groups: [] } as never)
		},
		State: {
			findOrCreate: jest.fn().mockResolvedValue(mockState as never)
		}
	};
	const engine = {
		settings: {
			settings: { index: { ignoreArticles: true } }
		}
	};
	const context = { orm, engine, user: mockUser } as unknown as Context;
	return { orm, engine, ctx: context };
}

const resolver = new ArtistResolver();

describe('ArtistResolver.artist (Query)', () => {
	test('returns artist fetched by id', async () => {
		const { orm, ctx } = makeContext();

		const result = await resolver.artist('artist-1', ctx);

		expect(orm.Artist.oneOrFailByID).toHaveBeenCalledWith('artist-1');
		expect(result).toEqual({ id: 'artist-1' });
	});

	test('passes different id to oneOrFailByID', async () => {
		const { orm, ctx } = makeContext();

		await resolver.artist('artist-99', ctx);

		expect(orm.Artist.oneOrFailByID).toHaveBeenCalledWith('artist-99');
	});
});

describe('ArtistResolver.artists (Query)', () => {
	test('uses searchFilter when no list type provided', async () => {
		const { orm, ctx } = makeContext();
		const arguments_ = { filter: {}, page: {}, order: [], list: undefined, seed: undefined } as never;

		const result = await resolver.artists(arguments_, ctx);

		expect(orm.Artist.searchFilter).toHaveBeenCalledWith({}, [], {}, mockUser);
		expect(orm.Artist.findListFilter).not.toHaveBeenCalled();
		expect(result).toEqual({ items: [], total: 0 });
	});

	test('uses findListFilter when list type is provided', async () => {
		const { orm, ctx } = makeContext();
		const arguments_ = { filter: {}, page: {}, order: [], list: 'random' as never, seed: 'abc' } as never;

		const result = await resolver.artists(arguments_, ctx);

		expect(orm.Artist.findListFilter).toHaveBeenCalledWith('random', 'abc', {}, [], {}, mockUser);
		expect(orm.Artist.searchFilter).not.toHaveBeenCalled();
		expect(result).toEqual({ items: [], total: 0 });
	});

	test('passes filter, order and page to searchFilter', async () => {
		const { orm, ctx } = makeContext();
		const filter = { name: 'Pink Floyd' };
		const order = [{ orderBy: 'name' }];
		const page = { take: 10, skip: 0 };
		const arguments_ = { filter, page, order, list: undefined, seed: undefined } as never;

		await resolver.artists(arguments_, ctx);

		expect(orm.Artist.searchFilter).toHaveBeenCalledWith(filter, order, page, mockUser);
	});
});

describe('ArtistResolver.artistIndex (Query)', () => {
	test('calls indexFilter with ignoreArticles and returns result', async () => {
		const { orm, engine, ctx } = makeContext();
		const filter = { name: 'P' };
		const arguments_ = { filter } as never;

		const result = await resolver.artistIndex(arguments_, ctx);

		expect(orm.Artist.indexFilter).toHaveBeenCalledWith(filter, mockUser, engine.settings.settings.index.ignoreArticles);
		expect(result).toEqual({ groups: [] });
	});

	test('works with empty filter', async () => {
		const { orm, ctx } = makeContext();

		await resolver.artistIndex({ filter: {} } as never, ctx);

		expect(orm.Artist.indexFilter).toHaveBeenCalledWith({}, mockUser, true);
	});
});

describe('ArtistResolver.state (FieldResolver)', () => {
	test('calls findOrCreate with artist id, artist type, and user id', async () => {
		const artist = makeArtist();
		const { orm, ctx } = makeContext();

		const result = await resolver.state(artist as never, ctx);

		expect(orm.State.findOrCreate).toHaveBeenCalledWith('artist-1', DBObjectType.artist, 'user-1');
		expect(result).toBe(mockState);
	});

	test('uses the id from the root artist', async () => {
		const artist = makeArtist({ id: 'artist-42' });
		const { orm, ctx } = makeContext();

		await resolver.state(artist as never, ctx);

		expect(orm.State.findOrCreate).toHaveBeenCalledWith('artist-42', DBObjectType.artist, 'user-1');
	});
});

describe('ArtistResolver.tracks (FieldResolver)', () => {
	test('returns all tracks of the artist', async () => {
		const artist = makeArtist({ tracks: mockTracks });

		const result = await resolver.tracks(artist as never);

		expect(artist.tracks.getItems).toHaveBeenCalled();
		expect(result).toBe(mockTracks);
	});

	test('returns empty array when artist has no tracks', async () => {
		const artist = makeArtist({ tracks: [] });

		const result = await resolver.tracks(artist as never);

		expect(result).toEqual([]);
	});
});

describe('ArtistResolver.genres (FieldResolver)', () => {
	test('returns all genres of the artist', async () => {
		const artist = makeArtist({ genres: mockGenres });

		const result = await resolver.genres(artist as never);

		expect(artist.genres.getItems).toHaveBeenCalled();
		expect(result).toBe(mockGenres);
	});
});

describe('ArtistResolver.tracksCount (FieldResolver)', () => {
	test('returns track count from collection', async () => {
		const artist = makeArtist({ tracks: mockTracks });

		const result = await resolver.tracksCount(artist as never);

		expect(artist.tracks.count).toHaveBeenCalled();
		expect(result).toBe(mockTracks.length);
	});

	test('returns zero when artist has no tracks', async () => {
		const artist = makeArtist({ tracks: [] });

		const result = await resolver.tracksCount(artist as never);

		expect(result).toBe(0);
	});
});

describe('ArtistResolver.albumTracks (FieldResolver)', () => {
	test('returns all album tracks of the artist', async () => {
		const artist = makeArtist({ albumTracks: mockAlbumTracks });

		const result = await resolver.albumTracks(artist as never);

		expect(artist.albumTracks.getItems).toHaveBeenCalled();
		expect(result).toBe(mockAlbumTracks);
	});
});

describe('ArtistResolver.albumsTracksCount (FieldResolver)', () => {
	test('returns album tracks count from collection', async () => {
		const artist = makeArtist({ albumTracks: mockAlbumTracks });

		const result = await resolver.albumsTracksCount(artist as never);

		expect(artist.albumTracks.count).toHaveBeenCalled();
		expect(result).toBe(mockAlbumTracks.length);
	});
});

describe('ArtistResolver.albums (FieldResolver)', () => {
	test('returns all albums of the artist', async () => {
		const artist = makeArtist({ albums: mockAlbums });

		const result = await resolver.albums(artist as never);

		expect(artist.albums.getItems).toHaveBeenCalled();
		expect(result).toBe(mockAlbums);
	});
});

describe('ArtistResolver.albumsCount (FieldResolver)', () => {
	test('returns albums count from collection', async () => {
		const artist = makeArtist({ albums: mockAlbums });

		const result = await resolver.albumsCount(artist as never);

		expect(artist.albums.count).toHaveBeenCalled();
		expect(result).toBe(mockAlbums.length);
	});
});

describe('ArtistResolver.genresCount (FieldResolver)', () => {
	test('returns genres count from collection', async () => {
		const artist = makeArtist({ genres: mockGenres });

		const result = await resolver.genresCount(artist as never);

		expect(artist.genres.count).toHaveBeenCalled();
		expect(result).toBe(mockGenres.length);
	});
});

describe('ArtistResolver.roots (FieldResolver)', () => {
	test('returns all roots of the artist', async () => {
		const artist = makeArtist({ roots: mockRoots });

		const result = await resolver.roots(artist as never);

		expect(artist.roots.getItems).toHaveBeenCalled();
		expect(result).toBe(mockRoots);
	});
});

describe('ArtistResolver.rootsCount (FieldResolver)', () => {
	test('returns roots count from collection', async () => {
		const artist = makeArtist({ roots: mockRoots });

		const result = await resolver.rootsCount(artist as never);

		expect(artist.roots.count).toHaveBeenCalled();
		expect(result).toBe(mockRoots.length);
	});
});

describe('ArtistResolver.folders (FieldResolver)', () => {
	test('returns all folders of the artist', async () => {
		const artist = makeArtist({ folders: mockFolders });

		const result = await resolver.folders(artist as never);

		expect(artist.folders.getItems).toHaveBeenCalled();
		expect(result).toBe(mockFolders);
	});
});

describe('ArtistResolver.foldersCount (FieldResolver)', () => {
	test('returns folders count from collection', async () => {
		const artist = makeArtist({ folders: mockFolders });

		const result = await resolver.foldersCount(artist as never);

		expect(artist.folders.count).toHaveBeenCalled();
		expect(result).toBe(mockFolders.length);
	});
});

describe('ArtistResolver.series (FieldResolver)', () => {
	test('returns all series of the artist', async () => {
		const artist = makeArtist({ series: mockSeries });

		const result = await resolver.series(artist as never);

		expect(artist.series.getItems).toHaveBeenCalled();
		expect(result).toBe(mockSeries);
	});
});

describe('ArtistResolver.seriesCount (FieldResolver)', () => {
	test('returns series count from collection', async () => {
		const artist = makeArtist({ series: mockSeries });

		const result = await resolver.seriesCount(artist as never);

		expect(artist.series.count).toHaveBeenCalled();
		expect(result).toBe(mockSeries.length);
	});
});
