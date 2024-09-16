import {Artist, ArtistIndex, ArtistPage} from './artist.model.js';
import {Controller, Ctx, Get, QueryParam, QueryParams} from '../../modules/rest/index.js';
import {UserRole} from '../../types/enums.js';
import {ExtendedInfoResult} from '../metadata/metadata.model.js';
import {TrackPage} from '../track/track.model.js';
import {AlbumPage} from '../album/album.model.js';
import {SeriesPage} from '../series/series.model.js';
import {AlbumOrderArgs, IncludesAlbumArgs} from '../album/album.args.js';
import {IncludesSeriesArgs, SeriesFilterArgs, SeriesOrderArgs} from '../series/series.args.js';
import {IncludesTrackArgs, TrackOrderArgs} from '../track/track.args.js';
import {ArtistFilterArgs, ArtistOrderArgs, IncludesArtistArgs, IncludesArtistChildrenArgs} from './artist.args.js';
import {ListArgs, PageArgs} from '../base/base.args.js';
import {Context} from '../../modules/engine/rest/context.js';

@Controller('/artist', {tags: ['Artist'], roles: [UserRole.stream]})
export class ArtistController {
	@Get('/id',
		() => Artist,
		{description: 'Get an Artist by Id', summary: 'Get Artist'}
	)
	async id(
		@QueryParam('id', {description: 'Artist Id', isID: true}) id: string,
		@QueryParams() artistArgs: IncludesArtistArgs,
		@QueryParams() artistChildrenArgs: IncludesArtistChildrenArgs,
		@QueryParams() trackArgs: IncludesTrackArgs,
		@QueryParams() albumArgs: IncludesAlbumArgs,
		@QueryParams() seriesArgs: IncludesSeriesArgs,
		@Ctx() {orm, engine, user}: Context
	): Promise<Artist> {
		return engine.transform.artist(
			orm, await orm.Artist.oneOrFailByID(id),
			artistArgs, artistChildrenArgs, trackArgs, albumArgs, seriesArgs, user
		);
	}

	@Get(
		'/index',
		() => ArtistIndex,
		{description: 'Get the Navigation Index for Albums', summary: 'Get Index'}
	)
	async index(
		@QueryParams() filter: ArtistFilterArgs,
		@Ctx() {orm, engine, user}: Context
	): Promise<ArtistIndex> {
		const result = await orm.Artist.indexFilter(filter, user, engine.settings.settings.index.ignoreArticles);
		return await engine.transform.Artist.artistIndex(orm, result);
	}

	@Get(
		'/search',
		() => ArtistPage,
		{description: 'Search Artists'}
	)
	async search(
		@QueryParams() page: PageArgs,
		@QueryParams() artistArgs: IncludesArtistArgs,
		@QueryParams() artistChildrenArgs: IncludesArtistChildrenArgs,
		@QueryParams() trackArgs: IncludesTrackArgs,
		@QueryParams() albumArgs: IncludesAlbumArgs,
		@QueryParams() seriesArgs: IncludesSeriesArgs,
		@QueryParams() filter: ArtistFilterArgs,
		@QueryParams() order: ArtistOrderArgs,
		@QueryParams() list: ListArgs,
		@Ctx() {orm, engine, user}: Context
	): Promise<ArtistPage> {
		if (list.list) {
			return await orm.Artist.findListTransformFilter(list.list, list.seed, filter, [order], page, user,
				o => engine.transform.artist(orm, o, artistArgs, artistChildrenArgs, trackArgs, albumArgs, seriesArgs, user)
			);
		}
		return await orm.Artist.searchTransformFilter(
			filter, [order], page, user,
			o => engine.transform.artist(orm, o, artistArgs, artistChildrenArgs, trackArgs, albumArgs, seriesArgs, user)
		);
	}

	@Get(
		'/info',
		() => ExtendedInfoResult,
		{description: 'Get Meta Data Info of an Artist by Id (External Service)', summary: 'Get Info'}
	)
	async info(
		@QueryParam('id', {description: 'Artist Id', isID: true}) id: string,
		@Ctx() {orm, engine}: Context
	): Promise<ExtendedInfoResult> {
		const artist = await orm.Artist.oneOrFailByID(id);
		return {info: await engine.metadata.extInfo.byArtist(orm, artist)};
	}

	@Get(
		'/similar',
		() => ArtistPage,
		{description: 'Get similar Artists of an Artist by Id (External Service)', summary: 'Get similar Artists'}
	)
	async similar(
		@QueryParam('id', {description: 'Artist Id', isID: true}) id: string,
		@QueryParams() page: PageArgs,
		@QueryParams() artistArgs: IncludesArtistArgs,
		@Ctx() {orm, engine, user}: Context
	): Promise<ArtistPage> {
		const artist = await orm.Artist.oneOrFailByID(id);
		const result = await engine.metadata.similarArtists.byArtist(orm, artist, page);
		return {...result, items: await engine.transform.Artist.artistBases(orm, result.items, artistArgs, user)};
	}

	@Get(
		'/similar/tracks',
		() => TrackPage,
		{description: 'Get similar Tracks of an Artist by Id (External Service)', summary: 'Get similar Tracks'}
	)
	async similarTracks(
		@QueryParam('id', {description: 'Artist Id', isID: true}) id: string,
		@QueryParams() page: PageArgs,
		@QueryParams() trackArgs: IncludesTrackArgs,
		@Ctx() {orm, engine, user}: Context
	): Promise<TrackPage> {
		const artist = await orm.Artist.oneOrFailByID(id);
		const result = await engine.metadata.similarTracks.byArtist(orm, artist, page);
		return {...result, items: await engine.transform.Track.trackBases(orm, result.items, trackArgs, user)};
	}

	@Get(
		'/tracks',
		() => TrackPage,
		{description: 'Get Tracks of Artists', summary: 'Get Tracks'}
	)
	async tracks(
		@QueryParams() page: PageArgs,
		@QueryParams() trackArgs: IncludesTrackArgs,
		@QueryParams() filter: ArtistFilterArgs,
		@QueryParams() order: TrackOrderArgs,
		@Ctx() {orm, engine, user}: Context
	): Promise<TrackPage> {
		const artistIDs = await orm.Artist.findIDsFilter(filter, user);
		return await orm.Track.searchTransformFilter(
			{artistIDs}, [order], page, user,
			o => engine.transform.Track.trackBase(orm, o, trackArgs, user)
		);
	}

	@Get(
		'/albums',
		() => AlbumPage,
		{description: 'Get Albums of Artists', summary: 'Get Albums'}
	)
	async albums(
		@QueryParams() page: PageArgs,
		@QueryParams() albumArgs: IncludesAlbumArgs,
		@QueryParams() filter: ArtistFilterArgs,
		@QueryParams() order: AlbumOrderArgs,
		@Ctx() {orm, engine, user}: Context
	): Promise<AlbumPage> {
		const artistIDs = await orm.Artist.findIDsFilter(filter, user);
		return await orm.Album.searchTransformFilter(
			{artistIDs}, [order], page, user,
			o => engine.transform.Album.albumBase(orm, o, albumArgs, user)
		);
	}

	@Get(
		'/series',
		() => SeriesPage,
		{description: 'Get Series of Artists', summary: 'Get Series'}
	)
	async series(
		@QueryParams() page: PageArgs,
		@QueryParams() seriesArgs: IncludesSeriesArgs,
		@QueryParams() filter: SeriesFilterArgs,
		@QueryParams() order: SeriesOrderArgs,
		@Ctx() {orm, engine, user}: Context
	): Promise<SeriesPage> {
		const artistIDs = await orm.Artist.findIDsFilter(filter, user);
		return await orm.Series.searchTransformFilter(
			{artistIDs}, [order], page, user,
			o => engine.transform.Series.seriesBase(orm, o, seriesArgs, user)
		);
	}

}
