import { Album, AlbumIndex, AlbumPage } from './album.model.js';
import { TrackOrderFields, UserRole } from '../../types/enums.js';
import { ExtendedInfoResult } from '../metadata/metadata.model.js';
import { TrackPage } from '../track/track.model.js';
import { AlbumFilterArgs, AlbumOrderArgs, IncludesAlbumArgs, IncludesAlbumChildrenArgs } from './album.args.js';
import { IncludesTrackArgs, TrackOrderArgs } from '../track/track.args.js';
import { IncludesArtistArgs } from '../artist/artist.args.js';
import { ListArgs, PageArgs } from '../base/base.args.js';
import { Context } from '../../modules/engine/rest/context.js';
import { Controller } from '../../modules/rest/decorators/Controller.js';
import { Get } from '../../modules/rest/decorators/Get.js';
import { QueryParam } from '../../modules/rest/decorators/QueryParam.js';
import { QueryParams } from '../../modules/rest/decorators/QueryParams.js';
import { Ctx } from '../../modules/rest/decorators/Ctx.js';

@Controller('/album', { tags: ['Album'], roles: [UserRole.stream] })
export class AlbumController {
	@Get(
		'/id',
		() => Album,
		{ description: 'Get an Album by Id', summary: 'Get Album' }
	)
	async id(
		@QueryParam('id', { description: 'Album Id', isID: true }) id: string,
		@QueryParams() albumArgs: IncludesAlbumArgs,
		@QueryParams() albumChildrenArgs: IncludesAlbumChildrenArgs,
		@QueryParams() trackArgs: IncludesTrackArgs,
		@QueryParams() artistArgs: IncludesArtistArgs,
		@Ctx() { orm, engine, user }: Context
	): Promise<Album> {
		return engine.transform.album(
			orm, await orm.Album.oneOrFailByID(id),
			albumArgs, albumChildrenArgs, trackArgs, artistArgs, user
		);
	}

	@Get(
		'/index',
		() => AlbumIndex,
		{ description: 'Get the Navigation Index for Albums', summary: 'Get Index' }
	)
	async index(
		@QueryParams() filter: AlbumFilterArgs,
		@Ctx() { orm, engine }: Context
	): Promise<AlbumIndex> {
		return await engine.transform.Album.albumIndex(orm, await orm.Album.indexFilter(filter));
	}

	@Get(
		'/search',
		() => AlbumPage,
		{ description: 'Search Albums' }
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
		@Ctx() { orm, engine, user }: Context
	): Promise<AlbumPage> {
		if (list.list) {
			return await orm.Album.findListTransformFilter(list.list, list.seed, filter, [order], page, user,
				o => engine.transform.album(orm, o, albumArgs, albumChildrenArgs, trackArgs, artistArgs, user)
			);
		}
		return await orm.Album.searchTransformFilter(
			filter, [order], page, user,
			o => engine.transform.album(orm, o, albumArgs, albumChildrenArgs, trackArgs, artistArgs, user)
		);
	}

	@Get(
		'/info',
		() => ExtendedInfoResult,
		{ description: 'Get Meta Data Info of an Album by Id (External Service)', summary: 'Get Info' }
	)
	async info(
		@QueryParam('id', { description: 'Album Id', isID: true }) id: string,
		@Ctx() { orm, engine }: Context
	): Promise<ExtendedInfoResult> {
		const album = await orm.Album.oneOrFailByID(id);
		return { info: await engine.metadata.extInfo.byAlbum(orm, album) };
	}

	@Get(
		'/tracks',
		() => TrackPage,
		{ description: 'Get Tracks of Albums', summary: 'Get Tracks' }
	)
	async tracks(
		@QueryParams() page: PageArgs,
		@QueryParams() trackArgs: IncludesTrackArgs,
		@QueryParams() filter: AlbumFilterArgs,
		@QueryParams() order: TrackOrderArgs,
		@Ctx() { orm, engine, user }: Context
	): Promise<TrackPage> {
		const albumIDs = await orm.Album.findIDsFilter(filter, user);
		const orders = [{ orderBy: order?.orderBy ?? TrackOrderFields.default, orderDesc: order?.orderDesc || false }];
		return await orm.Track.searchTransformFilter(
			{ albumIDs }, orders, page, user,
			o => engine.transform.Track.trackBase(orm, o, trackArgs, user)
		);
	}

	@Get(
		'/similar/tracks',
		() => TrackPage,
		{ description: ' Get similar Tracks of an Album by Id (External Service)', summary: 'Get similar Tracks' }
	)
	async similarTracks(
		@QueryParam('id', { description: 'Album Id', isID: true }) id: string,
		@QueryParams() page: PageArgs,
		@QueryParams() trackArgs: IncludesTrackArgs,
		@Ctx() { orm, engine, user }: Context
	): Promise<TrackPage> {
		const album = await orm.Album.oneOrFailByID(id);
		const result = await engine.metadata.similarTracks.byAlbum(orm, album, page);
		return { ...result, items: await engine.transform.Track.trackBases(orm, result.items, trackArgs, user) };
	}
}
