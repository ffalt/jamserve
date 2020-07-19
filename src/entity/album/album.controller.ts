import {Album, AlbumIndex, AlbumPage} from './album.model';
import {User} from '../user/user';
import {Controller, CurrentUser, Get, QueryParam, QueryParams} from '../../modules/rest';
import {UserRole} from '../../types/enums';
import {BaseController} from '../base/base.controller';
import {ExtendedInfoResult} from '../metadata/metadata.model';
import {TrackPage} from '../track/track.model';
import {AlbumFilterArgs, AlbumOrderArgs, IncludesAlbumArgs, IncludesAlbumChildrenArgs} from './album.args';
import {IncludesTrackArgs, TrackOrderArgs} from '../track/track.args';
import {IncludesArtistArgs} from '../artist/artist.args';
import {ListArgs, PageArgs} from '../base/base.args';

@Controller('/album', {tags: ['Album'], roles: [UserRole.stream]})
export class AlbumController extends BaseController {
	@Get(
		'/id',
		() => Album,
		{description: 'Get an Album by Id', summary: 'Get Album'}
	)
	async id(
		@QueryParam('id', {description: 'Album Id', isID: true}) id: string,
		@QueryParams() albumArgs: IncludesAlbumArgs,
		@QueryParams() albumChildrenArgs: IncludesAlbumChildrenArgs,
		@QueryParams() trackArgs: IncludesTrackArgs,
		@QueryParams() artistArgs: IncludesArtistArgs,
		@CurrentUser() user: User
	): Promise<Album> {
		return this.transform.album(
			await this.orm.Album.oneOrFail(id),
			albumArgs, albumChildrenArgs, trackArgs, artistArgs, user
		);
	}

	@Get(
		'/index',
		() => AlbumIndex,
		{description: 'Get the Navigation Index for Albums', summary: 'Get Index'}
	)
	async index(@QueryParams() filter: AlbumFilterArgs): Promise<AlbumIndex> {
		return await this.transform.albumIndex(await this.orm.Album.indexFilter(filter));
	}

	@Get(
		'/search',
		() => AlbumPage,
		{description: 'Search albums'}
	)
	async search(
		@QueryParams() page: PageArgs,
		@QueryParams() albumArgs: IncludesAlbumArgs,
		@QueryParams() albumChildrenArgs: IncludesAlbumChildrenArgs,
		@QueryParams() trackArgs: IncludesTrackArgs,
		@QueryParams() artistArgs: IncludesArtistArgs,
		@QueryParams() filter: AlbumFilterArgs,
		@QueryParams() order: AlbumOrderArgs,
		@QueryParams() list: ListArgs,
		@CurrentUser() user: User
	): Promise<AlbumPage> {
		if (list.list) {
			return await this.orm.Album.findListTransformFilter(list.list, filter, [order], page, user,
				o => this.transform.album(o, albumArgs, albumChildrenArgs, trackArgs, artistArgs, user)
			)
		}
		return await this.orm.Album.searchTransformFilter(
			filter, [order], page, user,
			o => this.transform.album(o, albumArgs, albumChildrenArgs, trackArgs, artistArgs, user)
		);
	}

	@Get(
		'/info',
		() => ExtendedInfoResult,
		{description: 'Get Meta Data Info of an Album by Id (External Service)', summary: 'Get Info'}
	)
	async info(@QueryParam('id', {description: 'Album Id', isID: true}) id: string): Promise<ExtendedInfoResult> {
		const album = await this.orm.Album.oneOrFail(id);
		return {info: await this.metadata.extInfo.byAlbum(album)};
	}

	@Get(
		'/tracks',
		() => TrackPage,
		{description: 'Get Tracks of Albums', summary: 'Get Tracks'}
	)
	async tracks(
		@QueryParams() page: PageArgs,
		@QueryParams() trackArgs: IncludesTrackArgs,
		@QueryParams() filter: AlbumFilterArgs,
		@QueryParams() order: TrackOrderArgs,
		@CurrentUser() user: User
	): Promise<TrackPage> {
		const albumIDs = await this.orm.Album.findIDsFilter(filter, user);
		return await this.orm.Track.searchTransformFilter(
			{albumIDs}, [order], page, user,
			o => this.transform.trackBase(o, trackArgs, user)
		);
	}

	@Get(
		'/similar/tracks',
		() => TrackPage,
		{description: ' Get similar Tracks of an Album by Id (External Service)', summary: 'Get similar Tracks'}
	)
	async similarTracks(
		@QueryParam('id', {description: 'Album Id', isID: true}) id: string,
		@QueryParams() page: PageArgs,
		@QueryParams() trackArgs: IncludesTrackArgs,
		@CurrentUser() user: User
	): Promise<TrackPage> {
		const album = await this.orm.Album.oneOrFail(id);
		const result = await this.metadata.similarTracks.byAlbum(album, page);
		return {...result, items: await Promise.all(result.items.map(o => this.transform.trackBase(o, trackArgs, user)))}
	}

}
