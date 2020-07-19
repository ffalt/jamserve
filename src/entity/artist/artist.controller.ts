import {Artist, ArtistIndex, ArtistPage} from './artist.model';
import {User} from '../user/user';
import {Controller, CurrentUser, Get, QueryParam, QueryParams} from '../../modules/rest';
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
		@CurrentUser() user: User
	): Promise<Artist> {
		return this.transform.artist(
			await this.orm.Artist.oneOrFail(id),
			artistArgs, artistChildrenArgs, trackArgs, albumArgs, seriesArgs, user
		);
	}

	@Get(
		'/index',
		() => ArtistIndex,
		{description: 'Get the Navigation Index for Albums', summary: 'Get Index'}
	)
	async index(@QueryParams() filter: ArtistFilterArgs): Promise<ArtistIndex> {
		const result = await this.orm.Artist.indexFilter(filter);
		return await this.transform.artistIndex(result);
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
		@CurrentUser() user: User
	): Promise<ArtistPage> {
		if (list.list) {
			return await this.orm.Artist.findListTransformFilter(list.list, filter, [order], page, user,
				o => this.transform.artist(o, artistArgs, artistChildrenArgs, trackArgs, albumArgs, seriesArgs, user)
			);
		}
		return await this.orm.Artist.searchTransformFilter(
			filter, [order], page, user,
			o => this.transform.artist(o, artistArgs, artistChildrenArgs, trackArgs, albumArgs, seriesArgs, user)
		);
	}

	@Get(
		'/info',
		() => ExtendedInfoResult,
		{description: 'Get Meta Data Info of an Artist by Id (External Service)', summary: 'Get Info'}
	)
	async info(@QueryParam('id', {description: 'Artist Id', isID: true}) id: string): Promise<ExtendedInfoResult> {
		const artist = await this.orm.Artist.oneOrFail(id);
		return {info: await this.metadata.extInfo.byArtist(artist)};
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
		@CurrentUser() user: User
	): Promise<ArtistPage> {
		const artist = await this.orm.Artist.oneOrFail(id);
		const result = await this.metadata.similarArtists.byArtist(artist, page);
		return {...result, items: await Promise.all(result.items.map(o => this.transform.artistBase(o, artistArgs, user)))};
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
		@CurrentUser() user: User
	): Promise<TrackPage> {
		const artist = await this.orm.Artist.oneOrFail(id);
		const result = await this.metadata.similarTracks.byArtist(artist, page);
		return {...result, items: await Promise.all(result.items.map(o => this.transform.trackBase(o, trackArgs, user)))};
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
		@CurrentUser() user: User
	): Promise<TrackPage> {
		const artistIDs = await this.orm.Artist.findIDsFilter(filter, user);
		return await this.orm.Track.searchTransformFilter(
			{artistIDs}, [order], page, user,
			o => this.transform.trackBase(o, trackArgs, user)
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
		@CurrentUser() user: User
	): Promise<AlbumPage> {
		const artistIDs = await this.orm.Artist.findIDsFilter(filter, user);
		return await this.orm.Album.searchTransformFilter(
			{artistIDs}, [order], page, user,
			o => this.transform.albumBase(o, albumArgs, user)
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
		@CurrentUser() user: User
	): Promise<SeriesPage> {
		const artistIDs = await this.orm.Artist.findIDsFilter(filter, user);
		return await this.orm.Series.searchTransformFilter(
			{artistIDs}, [order], page, user,
			o => this.transform.seriesBase(o, seriesArgs, user)
		);
	}

}
