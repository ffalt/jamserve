import { jest } from '@jest/globals';
// album.model must load before artist.model to avoid circular-dependency initialization error
import '../../../src/entity/album/album.model.js';
import { ArtistController } from '../../../src/entity/artist/artist.controller.js';
import { ArtistFilterParameters, ArtistOrderParameters, IncludesArtistChildrenParameters, IncludesArtistParameters } from '../../../src/entity/artist/artist.parameters.js';
import { IncludesAlbumParameters } from '../../../src/entity/album/album.parameters.js';
import { IncludesSeriesParameters, SeriesFilterParameters, SeriesOrderParameters } from '../../../src/entity/series/series.parameters.js';
import { IncludesTrackParameters, TrackOrderParameters } from '../../../src/entity/track/track.parameters.js';
import { ListParameters, PageParameters } from '../../../src/entity/base/base.parameters.js';
import type { Context } from '../../../src/modules/engine/rest/context.js';
import { mockAlbumPage, mockArtist, mockArtistDTO, mockArtistIndex, mockArtistPage, mockInfo, mockSeriesPage, mockTrackDTO, mockTrackPage, mockUser } from '../shared/mock-data.js';

function makeContext() {
	const orm = {
		Artist: {
			oneOrFailByID: jest.fn().mockResolvedValue(mockArtist as never),
			indexFilter: jest.fn().mockResolvedValue(mockArtistIndex as never),
			findListTransformFilter: jest.fn().mockResolvedValue(mockArtistPage as never),
			searchTransformFilter: jest.fn().mockResolvedValue(mockArtistPage as never),
			findIDsFilter: jest.fn().mockResolvedValue(['artist-1'] as never)
		},
		Track: {
			searchTransformFilter: jest.fn().mockResolvedValue(mockTrackPage as never)
		},
		Album: {
			searchTransformFilter: jest.fn().mockResolvedValue(mockAlbumPage as never)
		},
		Series: {
			searchTransformFilter: jest.fn().mockResolvedValue(mockSeriesPage as never)
		}
	};
	const engine = {
		settings: {
			settings: { index: { ignoreArticles: true } }
		},
		transform: {
			artist: jest.fn().mockResolvedValue(mockArtistDTO as never),
			Artist: {
				artistIndex: jest.fn().mockResolvedValue(mockArtistIndex as never),
				artistBases: jest.fn().mockResolvedValue([mockArtistDTO] as never)
			},
			Track: {
				trackBase: jest.fn().mockResolvedValue(mockTrackDTO as never),
				trackBases: jest.fn().mockResolvedValue([mockTrackDTO] as never)
			},
			Album: {
				albumBase: jest.fn().mockResolvedValue({ id: 'album-1' } as never)
			},
			Series: {
				seriesBase: jest.fn().mockResolvedValue({ id: 'series-1' } as never)
			}
		},
		metadata: {
			extInfo: {
				byArtist: jest.fn().mockResolvedValue(mockInfo as never)
			},
			similarArtists: {
				byArtist: jest.fn().mockResolvedValue({ items: [mockArtistDTO], total: 1, offset: 0, take: 20 } as never)
			},
			similarTracks: {
				byArtist: jest.fn().mockResolvedValue({ items: [mockTrackDTO], total: 1, offset: 0, take: 20 } as never)
			}
		}
	};
	const context = { orm, engine, user: mockUser } as unknown as Context;
	return { orm, engine, ctx: context };
}

const controller = new ArtistController();
const emptyArtistParameters: IncludesArtistParameters = {};
const emptyChildParameters: IncludesArtistChildrenParameters = {};
const emptyTrackParameters: IncludesTrackParameters = {};
const emptyAlbumParameters: IncludesAlbumParameters = {};
const emptySeriesParameters: IncludesSeriesParameters = {};
const emptyPage: PageParameters = {};
const emptyFilter: ArtistFilterParameters = {};
const emptyOrder: ArtistOrderParameters = {};

describe('ArtistController.id', () => {
	test('fetches artist by id and transforms it', async () => {
		const { orm, engine, ctx } = makeContext();

		const result = await controller.id('artist-1', emptyArtistParameters, emptyChildParameters, emptyTrackParameters, emptyAlbumParameters, emptySeriesParameters, ctx);

		expect(orm.Artist.oneOrFailByID).toHaveBeenCalledWith('artist-1');
		expect(engine.transform.artist).toHaveBeenCalledWith(
			orm, mockArtist, emptyArtistParameters, emptyChildParameters, emptyTrackParameters, emptyAlbumParameters, emptySeriesParameters, mockUser
		);
		expect(result).toBe(mockArtistDTO);
	});

	test('passes include parameters through to transform', async () => {
		const { orm, engine, ctx } = makeContext();
		const artistParameters: IncludesArtistParameters = { artistIncState: true, artistIncTrackCount: true };

		await controller.id('artist-1', artistParameters, emptyChildParameters, emptyTrackParameters, emptyAlbumParameters, emptySeriesParameters, ctx);

		expect(engine.transform.artist).toHaveBeenCalledWith(
			orm, mockArtist, artistParameters, emptyChildParameters, emptyTrackParameters, emptyAlbumParameters, emptySeriesParameters, mockUser
		);
	});
});

describe('ArtistController.index', () => {
	test('fetches index filter with ignoreArticles and transforms to artist index', async () => {
		const { orm, engine, ctx } = makeContext();
		const filter: ArtistFilterParameters = { name: 'Pink' };

		const result = await controller.index(filter, ctx);

		expect(orm.Artist.indexFilter).toHaveBeenCalledWith(filter, mockUser, true);
		expect(engine.transform.Artist.artistIndex).toHaveBeenCalledWith(orm, mockArtistIndex);
		expect(result).toBe(mockArtistIndex);
	});

	test('works with empty filter', async () => {
		const { orm, ctx } = makeContext();

		await controller.index(emptyFilter, ctx);

		expect(orm.Artist.indexFilter).toHaveBeenCalledWith(emptyFilter, mockUser, true);
	});
});

describe('ArtistController.search', () => {
	test('uses searchTransformFilter when no list type provided', async () => {
		const { orm, ctx } = makeContext();
		const list: ListParameters = {};

		const result = await controller.search(
			emptyPage, emptyArtistParameters, emptyChildParameters, emptyTrackParameters, emptyAlbumParameters, emptySeriesParameters,
			emptyFilter, emptyOrder, list, ctx
		);

		expect(orm.Artist.searchTransformFilter).toHaveBeenCalledWith(
			emptyFilter, [emptyOrder], emptyPage, mockUser, expect.any(Function)
		);
		expect(orm.Artist.findListTransformFilter).not.toHaveBeenCalled();
		expect(result).toBe(mockArtistPage);
	});

	test('uses findListTransformFilter when list type is provided', async () => {
		const { orm, ctx } = makeContext();
		const list: ListParameters = { list: 'random' as never, seed: 'abc' };

		const result = await controller.search(
			emptyPage, emptyArtistParameters, emptyChildParameters, emptyTrackParameters, emptyAlbumParameters, emptySeriesParameters,
			emptyFilter, emptyOrder, list, ctx
		);

		expect(orm.Artist.findListTransformFilter).toHaveBeenCalledWith(
			'random', 'abc', emptyFilter, [emptyOrder], emptyPage, mockUser, expect.any(Function)
		);
		expect(orm.Artist.searchTransformFilter).not.toHaveBeenCalled();
		expect(result).toBe(mockArtistPage);
	});

	test('transform callback in search mode calls engine.transform.artist', async () => {
		const { orm, engine, ctx } = makeContext();
		const artistParameters: IncludesArtistParameters = { artistIncState: true };

		await controller.search(
			emptyPage, artistParameters, emptyChildParameters, emptyTrackParameters, emptyAlbumParameters, emptySeriesParameters,
			emptyFilter, emptyOrder, {}, ctx
		);

		const callback = orm.Artist.searchTransformFilter.mock.calls[0][4] as (o: unknown) => Promise<unknown>;
		await callback(mockArtist);
		expect(engine.transform.artist).toHaveBeenCalledWith(
			orm, mockArtist, artistParameters, emptyChildParameters, emptyTrackParameters, emptyAlbumParameters, emptySeriesParameters, mockUser
		);
	});

	test('transform callback in list mode calls engine.transform.artist', async () => {
		const { orm, engine, ctx } = makeContext();
		const list: ListParameters = { list: 'random' as never };

		await controller.search(
			emptyPage, emptyArtistParameters, emptyChildParameters, emptyTrackParameters, emptyAlbumParameters, emptySeriesParameters,
			emptyFilter, emptyOrder, list, ctx
		);

		const callback = orm.Artist.findListTransformFilter.mock.calls[0][6] as (o: unknown) => Promise<unknown>;
		await callback(mockArtist);
		expect(engine.transform.artist).toHaveBeenCalledWith(
			orm, mockArtist, emptyArtistParameters, emptyChildParameters, emptyTrackParameters, emptyAlbumParameters, emptySeriesParameters, mockUser
		);
	});
});

describe('ArtistController.info', () => {
	test('fetches artist by id and returns external info', async () => {
		const { orm, engine, ctx } = makeContext();

		const result = await controller.info('artist-1', ctx);

		expect(orm.Artist.oneOrFailByID).toHaveBeenCalledWith('artist-1');
		expect(engine.metadata.extInfo.byArtist).toHaveBeenCalledWith(orm, mockArtist);
		expect(result).toEqual({ info: mockInfo });
	});

	test('returns info wrapped in ExtendedInfoResult shape', async () => {
		const { ctx } = makeContext();

		const result = await controller.info('artist-1', ctx);

		expect(result).toHaveProperty('info');
		expect(result.info).toBe(mockInfo);
	});
});

describe('ArtistController.similar', () => {
	test('fetches artist, gets similar artists and transforms them', async () => {
		const { orm, engine, ctx } = makeContext();

		const result = await controller.similar('artist-1', emptyPage, emptyArtistParameters, ctx);

		expect(orm.Artist.oneOrFailByID).toHaveBeenCalledWith('artist-1');
		expect(engine.metadata.similarArtists.byArtist).toHaveBeenCalledWith(orm, mockArtist, emptyPage);
		expect(engine.transform.Artist.artistBases).toHaveBeenCalledWith(
			orm, [mockArtistDTO], emptyArtistParameters, mockUser
		);
		expect(result.items).toEqual([mockArtistDTO]);
	});

	test('merges pagination from similar artists result', async () => {
		const { engine, ctx } = makeContext();
		const similarResult = { items: [], total: 42, offset: 10, take: 5 };
		(engine.metadata.similarArtists.byArtist as ReturnType<typeof jest.fn>).mockResolvedValue(similarResult as never);
		(engine.transform.Artist.artistBases as ReturnType<typeof jest.fn>).mockResolvedValue([] as never);

		const result = await controller.similar('artist-1', {}, emptyArtistParameters, ctx);

		expect(result.total).toBe(42);
	});

	test('passes artistParameters to artistBases transform', async () => {
		const { engine, ctx } = makeContext();
		const artistParameters: IncludesArtistParameters = { artistIncState: true };

		await controller.similar('artist-1', {}, artistParameters, ctx);

		expect(engine.transform.Artist.artistBases).toHaveBeenCalledWith(expect.anything(), expect.anything(), artistParameters, mockUser);
	});
});

describe('ArtistController.similarTracks', () => {
	test('fetches artist, gets similar tracks and transforms them', async () => {
		const { orm, engine, ctx } = makeContext();

		const result = await controller.similarTracks('artist-1', emptyPage, emptyTrackParameters, ctx);

		expect(orm.Artist.oneOrFailByID).toHaveBeenCalledWith('artist-1');
		expect(engine.metadata.similarTracks.byArtist).toHaveBeenCalledWith(orm, mockArtist, emptyPage);
		expect(engine.transform.Track.trackBases).toHaveBeenCalledWith(
			orm, [mockTrackDTO], emptyTrackParameters, mockUser
		);
		expect(result.items).toEqual([mockTrackDTO]);
	});

	test('merges pagination from similar tracks result', async () => {
		const { engine, ctx } = makeContext();
		const similarResult = { items: [], total: 7, offset: 0, take: 10 };
		(engine.metadata.similarTracks.byArtist as ReturnType<typeof jest.fn>).mockResolvedValue(similarResult as never);
		(engine.transform.Track.trackBases as ReturnType<typeof jest.fn>).mockResolvedValue([] as never);

		const result = await controller.similarTracks('artist-1', {}, emptyTrackParameters, ctx);

		expect(result.total).toBe(7);
	});

	test('passes trackParameters to trackBases transform', async () => {
		const { engine, ctx } = makeContext();
		const trackParameters: IncludesTrackParameters = { trackIncTag: true };

		await controller.similarTracks('artist-1', {}, trackParameters, ctx);

		expect(engine.transform.Track.trackBases).toHaveBeenCalledWith(expect.anything(), expect.anything(), trackParameters, mockUser);
	});
});

describe('ArtistController.tracks', () => {
	test('finds artist ids from filter then searches tracks', async () => {
		const { orm, ctx } = makeContext();

		const result = await controller.tracks(emptyPage, emptyTrackParameters, emptyFilter, {}, ctx);

		expect(orm.Artist.findIDsFilter).toHaveBeenCalledWith(emptyFilter, mockUser);
		expect(orm.Track.searchTransformFilter).toHaveBeenCalledWith(
			{ artistIDs: ['artist-1'] },
			[{}],
			emptyPage,
			mockUser,
			expect.any(Function)
		);
		expect(result).toBe(mockTrackPage);
	});

	test('track transform callback calls engine.transform.Track.trackBase', async () => {
		const { orm, engine, ctx } = makeContext();

		await controller.tracks(emptyPage, emptyTrackParameters, emptyFilter, {}, ctx);

		const callback = orm.Track.searchTransformFilter.mock.calls[0][4] as (o: unknown) => Promise<unknown>;
		const mockTrack = { id: 'track-x' };
		await callback(mockTrack);
		expect(engine.transform.Track.trackBase).toHaveBeenCalledWith(orm, mockTrack, emptyTrackParameters, mockUser);
	});

	test('passes order to track search', async () => {
		const { orm, ctx } = makeContext();
		const order: TrackOrderParameters = { orderBy: 'title' as never, orderDesc: true };

		await controller.tracks(emptyPage, emptyTrackParameters, emptyFilter, order, ctx);

		const callArguments = orm.Track.searchTransformFilter.mock.calls[0];
		expect(callArguments[1]).toEqual([order]);
	});
});

describe('ArtistController.albums', () => {
	test('finds artist ids from filter then searches albums', async () => {
		const { orm, ctx } = makeContext();

		const result = await controller.albums(emptyPage, emptyAlbumParameters, emptyFilter, {}, ctx);

		expect(orm.Artist.findIDsFilter).toHaveBeenCalledWith(emptyFilter, mockUser);
		expect(orm.Album.searchTransformFilter).toHaveBeenCalledWith(
			{ artistIDs: ['artist-1'] },
			[{}],
			emptyPage,
			mockUser,
			expect.any(Function)
		);
		expect(result).toBe(mockAlbumPage);
	});

	test('album transform callback calls engine.transform.Album.albumBase', async () => {
		const { orm, engine, ctx } = makeContext();

		await controller.albums(emptyPage, emptyAlbumParameters, emptyFilter, {}, ctx);

		const callback = orm.Album.searchTransformFilter.mock.calls[0][4] as (o: unknown) => Promise<unknown>;
		const mockAlbum = { id: 'album-x' };
		await callback(mockAlbum);
		expect(engine.transform.Album.albumBase).toHaveBeenCalledWith(orm, mockAlbum, emptyAlbumParameters, mockUser);
	});
});

describe('ArtistController.series', () => {
	test('finds artist ids from filter then searches series', async () => {
		const { orm, ctx } = makeContext();
		const seriesFilter: SeriesFilterParameters = {};
		const seriesOrder: SeriesOrderParameters = {};

		const result = await controller.series(emptyPage, emptySeriesParameters, seriesFilter, seriesOrder, ctx);

		expect(orm.Artist.findIDsFilter).toHaveBeenCalledWith(seriesFilter, mockUser);
		expect(orm.Series.searchTransformFilter).toHaveBeenCalledWith(
			{ artistIDs: ['artist-1'] },
			[seriesOrder],
			emptyPage,
			mockUser,
			expect.any(Function)
		);
		expect(result).toBe(mockSeriesPage);
	});

	test('series transform callback calls engine.transform.Series.seriesBase', async () => {
		const { orm, engine, ctx } = makeContext();

		await controller.series(emptyPage, emptySeriesParameters, {}, {}, ctx);

		const callback = orm.Series.searchTransformFilter.mock.calls[0][4] as (o: unknown) => Promise<unknown>;
		const mockSeries = { id: 'series-x' };
		await callback(mockSeries);
		expect(engine.transform.Series.seriesBase).toHaveBeenCalledWith(orm, mockSeries, emptySeriesParameters, mockUser);
	});
});
