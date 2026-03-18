import { jest } from '@jest/globals';
import { AlbumController } from '../../../src/entity/album/album.controller.js';
import { TrackOrderFields } from '../../../src/types/enums.js';
import { AlbumFilterParameters, AlbumOrderParameters, IncludesAlbumChildrenParameters, IncludesAlbumParameters } from '../../../src/entity/album/album.parameters.js';
import { IncludesTrackParameters, TrackOrderParameters } from '../../../src/entity/track/track.parameters.js';
import { IncludesArtistParameters } from '../../../src/entity/artist/artist.parameters.js';
import { ListParameters, PageParameters } from '../../../src/entity/base/base.parameters.js';
import type { Context } from '../../../src/modules/engine/rest/context.js';
import { mockAlbum, mockAlbumDTO, mockAlbumIndex, mockInfo, mockTrackDTO, mockTrackPage, mockUser } from '../shared/mock-data.js';

const mockAlbumPage = { items: [mockAlbumDTO], total: 1, offset: 0, take: 20 };

function makeContext() {
	const orm = {
		Album: {
			oneOrFailByID: jest.fn().mockResolvedValue(mockAlbum as never),
			indexFilter: jest.fn().mockResolvedValue(mockAlbumIndex as never),
			findListTransformFilter: jest.fn().mockResolvedValue(mockAlbumPage as never),
			searchTransformFilter: jest.fn().mockResolvedValue(mockAlbumPage as never),
			findIDsFilter: jest.fn().mockResolvedValue(['album-1'] as never)
		},
		Track: {
			searchTransformFilter: jest.fn().mockResolvedValue(mockTrackPage as never)
		}
	};
	const engine = {
		transform: {
			album: jest.fn().mockResolvedValue(mockAlbumDTO as never),
			Album: {
				albumIndex: jest.fn().mockResolvedValue(mockAlbumIndex as never)
			},
			Track: {
				trackBase: jest.fn().mockResolvedValue(mockTrackDTO as never),
				trackBases: jest.fn().mockResolvedValue([mockTrackDTO] as never)
			}
		},
		metadata: {
			extInfo: {
				byAlbum: jest.fn().mockResolvedValue(mockInfo as never)
			},
			similarTracks: {
				byAlbum: jest.fn().mockResolvedValue({ items: [mockTrackDTO], total: 1, offset: 0, take: 20 } as never)
			}
		}
	};
	const context = { orm, engine, user: mockUser } as unknown as Context;
	return { orm, engine, ctx: context };
}

const controller = new AlbumController();
const emptyAlbumParameters: IncludesAlbumParameters = {};
const emptyChildParameters: IncludesAlbumChildrenParameters = {};
const emptyTrackParameters: IncludesTrackParameters = {};
const emptyArtistParameters: IncludesArtistParameters = {};
const emptyPage: PageParameters = {};
const emptyFilter: AlbumFilterParameters = {};
const emptyOrder: AlbumOrderParameters = {};

describe('AlbumController.id', () => {
	test('fetches album by id and transforms it', async () => {
		const { orm, engine, ctx } = makeContext();

		const result = await controller.id('album-1', emptyAlbumParameters, emptyChildParameters, emptyTrackParameters, emptyArtistParameters, ctx);

		expect(orm.Album.oneOrFailByID).toHaveBeenCalledWith('album-1');
		expect(engine.transform.album).toHaveBeenCalledWith(
			orm, mockAlbum, emptyAlbumParameters, emptyChildParameters, emptyTrackParameters, emptyArtistParameters, mockUser
		);
		expect(result).toBe(mockAlbumDTO);
	});

	test('passes include parameters through to transform', async () => {
		const { orm, engine, ctx } = makeContext();
		const albumParameters: IncludesAlbumParameters = { albumIncState: true, albumIncTrackCount: true };
		const artistParameters: IncludesArtistParameters = {};

		await controller.id('album-1', albumParameters, emptyChildParameters, emptyTrackParameters, artistParameters, ctx);

		expect(engine.transform.album).toHaveBeenCalledWith(
			orm, mockAlbum, albumParameters, emptyChildParameters, emptyTrackParameters, artistParameters, mockUser
		);
	});
});

describe('AlbumController.index', () => {
	test('fetches index filter and transforms to album index', async () => {
		const { orm, engine, ctx } = makeContext();
		const filter: AlbumFilterParameters = { name: 'Dark' };

		const result = await controller.index(filter, ctx);

		expect(orm.Album.indexFilter).toHaveBeenCalledWith(filter);
		expect(engine.transform.Album.albumIndex).toHaveBeenCalledWith(orm, mockAlbumIndex);
		expect(result).toBe(mockAlbumIndex);
	});

	test('works with empty filter', async () => {
		const { orm, ctx } = makeContext();

		await controller.index(emptyFilter, ctx);

		expect(orm.Album.indexFilter).toHaveBeenCalledWith(emptyFilter);
	});
});

describe('AlbumController.search', () => {
	test('uses searchTransformFilter when no list type provided', async () => {
		const { orm, ctx } = makeContext();
		const list: ListParameters = {};

		const result = await controller.search(
			emptyPage, emptyAlbumParameters, emptyChildParameters, emptyTrackParameters, emptyArtistParameters,
			emptyFilter, emptyOrder, list, ctx
		);

		expect(orm.Album.searchTransformFilter).toHaveBeenCalledWith(
			emptyFilter, [emptyOrder], emptyPage, mockUser, expect.any(Function)
		);
		expect(orm.Album.findListTransformFilter).not.toHaveBeenCalled();
		expect(result).toBe(mockAlbumPage);
	});

	test('uses findListTransformFilter when list type is provided', async () => {
		const { orm, ctx } = makeContext();
		const list: ListParameters = { list: 'random' as never, seed: 'abc' };

		const result = await controller.search(
			emptyPage, emptyAlbumParameters, emptyChildParameters, emptyTrackParameters, emptyArtistParameters,
			emptyFilter, emptyOrder, list, ctx
		);

		expect(orm.Album.findListTransformFilter).toHaveBeenCalledWith(
			'random', 'abc', emptyFilter, [emptyOrder], emptyPage, mockUser, expect.any(Function)
		);
		expect(orm.Album.searchTransformFilter).not.toHaveBeenCalled();
		expect(result).toBe(mockAlbumPage);
	});

	test('transform callback in search mode calls engine.transform.album', async () => {
		const { orm, engine, ctx } = makeContext();
		const albumParameters: IncludesAlbumParameters = { albumIncState: true };

		await controller.search(
			emptyPage, albumParameters, emptyChildParameters, emptyTrackParameters, emptyArtistParameters,
			emptyFilter, emptyOrder, {}, ctx
		);

		const callback = orm.Album.searchTransformFilter.mock.calls[0][4] as (o: unknown) => Promise<unknown>;
		await callback(mockAlbum);
		expect(engine.transform.album).toHaveBeenCalledWith(
			orm, mockAlbum, albumParameters, emptyChildParameters, emptyTrackParameters, emptyArtistParameters, mockUser
		);
	});

	test('transform callback in list mode calls engine.transform.album', async () => {
		const { orm, engine, ctx } = makeContext();
		const list: ListParameters = { list: 'random' as never };

		await controller.search(
			emptyPage, emptyAlbumParameters, emptyChildParameters, emptyTrackParameters, emptyArtistParameters,
			emptyFilter, emptyOrder, list, ctx
		);

		const callback = orm.Album.findListTransformFilter.mock.calls[0][6] as (o: unknown) => Promise<unknown>;
		await callback(mockAlbum);
		expect(engine.transform.album).toHaveBeenCalledWith(
			orm, mockAlbum, emptyAlbumParameters, emptyChildParameters, emptyTrackParameters, emptyArtistParameters, mockUser
		);
	});
});

describe('AlbumController.info', () => {
	test('fetches album by id and returns external info', async () => {
		const { orm, engine, ctx } = makeContext();

		const result = await controller.info('album-1', ctx);

		expect(orm.Album.oneOrFailByID).toHaveBeenCalledWith('album-1');
		expect(engine.metadata.extInfo.byAlbum).toHaveBeenCalledWith(orm, mockAlbum);
		expect(result).toEqual({ info: mockInfo });
	});

	test('returns info wrapped in ExtendedInfoResult shape', async () => {
		const { ctx } = makeContext();

		const result = await controller.info('album-2', ctx);

		expect(result).toHaveProperty('info');
		expect(result.info).toBe(mockInfo);
	});
});

describe('AlbumController.tracks', () => {
	test('finds album ids from filter then searches tracks', async () => {
		const { orm, ctx } = makeContext();

		const result = await controller.tracks(emptyPage, emptyTrackParameters, emptyFilter, {}, ctx);

		expect(orm.Album.findIDsFilter).toHaveBeenCalledWith(emptyFilter, mockUser);
		expect(orm.Track.searchTransformFilter).toHaveBeenCalledWith(
			{ albumIDs: ['album-1'] },
			[{ orderBy: TrackOrderFields.default, orderDesc: false }],
			emptyPage,
			mockUser,
			expect.any(Function)
		);
		expect(result).toBe(mockTrackPage);
	});

	test('defaults orderBy to TrackOrderFields.default when not provided', async () => {
		const { orm, ctx } = makeContext();
		const order: TrackOrderParameters = {};

		await controller.tracks(emptyPage, emptyTrackParameters, emptyFilter, order, ctx);

		const callArguments = orm.Track.searchTransformFilter.mock.calls[0];
		expect(callArguments[1]).toEqual([{ orderBy: TrackOrderFields.default, orderDesc: false }]);
	});

	test('uses provided orderBy and orderDesc', async () => {
		const { orm, ctx } = makeContext();
		const order: TrackOrderParameters = { orderBy: TrackOrderFields.title, orderDesc: true };

		await controller.tracks(emptyPage, emptyTrackParameters, emptyFilter, order, ctx);

		const callArguments = orm.Track.searchTransformFilter.mock.calls[0];
		expect(callArguments[1]).toEqual([{ orderBy: TrackOrderFields.title, orderDesc: true }]);
	});

	test('track transform callback calls engine.transform.Track.trackBase', async () => {
		const { orm, engine, ctx } = makeContext();
		const trackParameters: IncludesTrackParameters = {};

		await controller.tracks(emptyPage, trackParameters, emptyFilter, {}, ctx);

		const callback = orm.Track.searchTransformFilter.mock.calls[0][4] as (o: unknown) => Promise<unknown>;
		const mockTrack = { id: 'track-x' };
		await callback(mockTrack);
		expect(engine.transform.Track.trackBase).toHaveBeenCalledWith(orm, mockTrack, trackParameters, mockUser);
	});
});

describe('AlbumController.similarTracks', () => {
	test('fetches album, gets similar tracks and transforms them', async () => {
		const { orm, engine, ctx } = makeContext();

		const result = await controller.similarTracks('album-1', emptyPage, emptyTrackParameters, ctx);

		expect(orm.Album.oneOrFailByID).toHaveBeenCalledWith('album-1');
		expect(engine.metadata.similarTracks.byAlbum).toHaveBeenCalledWith(orm, mockAlbum, emptyPage);
		expect(engine.transform.Track.trackBases).toHaveBeenCalledWith(
			orm, [mockTrackDTO], emptyTrackParameters, mockUser
		);
		expect(result.items).toEqual([mockTrackDTO]);
	});

	test('merges pagination from similar tracks result', async () => {
		const { engine, ctx } = makeContext();
		const similarResult = { items: [], total: 42, offset: 10, take: 5 };
		(engine.metadata.similarTracks.byAlbum as ReturnType<typeof jest.fn>).mockResolvedValue(similarResult as never);
		(engine.transform.Track.trackBases as ReturnType<typeof jest.fn>).mockResolvedValue([] as never);

		const result = await controller.similarTracks('album-1', {}, emptyTrackParameters, ctx);

		expect(result.total).toBe(42);
	});

	test('passes trackParameters to trackBases transform', async () => {
		const { engine, ctx } = makeContext();
		const trackParameters: IncludesTrackParameters = { trackIncTag: true };

		await controller.similarTracks('album-1', {}, trackParameters, ctx);

		expect(engine.transform.Track.trackBases).toHaveBeenCalledWith(expect.anything(), expect.anything(), trackParameters, mockUser);
	});
});
