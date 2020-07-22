import {Artist, ArtistIndex, ArtistPage} from './artist.model';
import {User} from '../user/user';
import {Controller, Ctx, CurrentUser, Get, QueryParam, QueryParams} from '../../modules/rest';
import {UserRole} from '../../types/enums';
import {BaseController} from '../base/base.controller';
import {ExtendedInfoResult} from '../metadata/metadata.model';
import {TrackPage} from '../track/track.model';
import {AlbumPage} from '../album/album.model';
import {SeriesPage} from '../series/series.model';
import {AlbumOrderArgs, IncludesAlbumArgs} from '../album/album.args';
import {IncludesSeriesArgs, SeriesFilterArgs, SeriesOrderArgs} from '../series/series.args';
import {IncludesTrackArgs, TrackOrderArgs} from '../track/track.args';
import {ArtistFilterArgs, ArtistOrderArgs, IncludesArtistArgs, IncludesArtistChildrenArgs} from './artist.args';
import {ListArgs, PageArgs} from '../base/base.args';
import {Context} from '../../modules/engine/rest/context';
import {InRequestScope} from 'typescript-ioc';

@InRequestScope
@Controller('/artist', {tags: ['Artist'], roles: [UserRole.stream]})
export class ArtistController extends BaseController {

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
		@Ctx() {orm, user}: Context
	): Promise<Artist> {
		return this.transform.artist(
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
		@Ctx() {orm}: Context
	): Promise<ArtistIndex> {
		const result = await orm.Artist.indexFilter(filter);
		return await this.transform.artistIndex(orm, result);
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
		@Ctx() {orm, user}: Context
	): Promise<ArtistPage> {
		if (list.list) {
			return await orm.Artist.findListTransformFilter(list.list, filter, [order], page, user,
				o => this.transform.artist(orm, o, artistArgs, artistChildrenArgs, trackArgs, albumArgs, seriesArgs, user)
			);
		}
		return await orm.Artist.searchTransformFilter(
			filter, [order], page, user,
			o => this.transform.artist(orm, o, artistArgs, artistChildrenArgs, trackArgs, albumArgs, seriesArgs, user)
		);
	}

	@Get(
		'/info',
		() => ExtendedInfoResult,
		{description: 'Get Meta Data Info of an Artist by Id (External Service)', summary: 'Get Info'}
	)
	async info(
		@QueryParam('id', {description: 'Artist Id', isID: true}) id: string,
		@Ctx() {orm, user}: Context
	): Promise<ExtendedInfoResult> {
		const artist = await orm.Artist.oneOrFailByID(id);
		return {info: await this.metadata.extInfo.byArtist(orm, artist)};
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
		@Ctx() {orm, user}: Context
	): Promise<ArtistPage> {
		const artist = await orm.Artist.oneOrFailByID(id);
		const result = await this.metadata.similarArtists.byArtist(orm, artist, page);
		return {...result, items: await Promise.all(result.items.map(o => this.transform.artistBase(orm, o, artistArgs, user)))};
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
		@Ctx() {orm, user}: Context
	): Promise<TrackPage> {
		const artist = await orm.Artist.oneOrFailByID(id);
		const result = await this.metadata.similarTracks.byArtist(orm, artist, page);
		return {...result, items: await Promise.all(result.items.map(o => this.transform.trackBase(orm, o, trackArgs, user)))};
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
		@Ctx() {orm, user}: Context
	): Promise<TrackPage> {
		const artistIDs = await orm.Artist.findIDsFilter(filter, user);
		return await orm.Track.searchTransformFilter(
			{artistIDs}, [order], page, user,
			o => this.transform.trackBase(orm, o, trackArgs, user)
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
		@Ctx() {orm, user}: Context
	): Promise<AlbumPage> {
		const artistIDs = await orm.Artist.findIDsFilter(filter, user);
		return await orm.Album.searchTransformFilter(
			{artistIDs}, [order], page, user,
			o => this.transform.albumBase(orm, o, albumArgs, user)
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
		@Ctx() {orm, user}: Context
	): Promise<SeriesPage> {
		const artistIDs = await orm.Artist.findIDsFilter(filter, user);
		return await orm.Series.searchTransformFilter(
			{artistIDs}, [order], page, user,
			o => this.transform.seriesBase(orm, o, seriesArgs, user)
		);
	}

}
