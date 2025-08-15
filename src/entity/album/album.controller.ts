import { Album, AlbumIndex, AlbumPage } from './album.model.js';
import { TrackOrderFields, UserRole } from '../../types/enums.js';
import { ExtendedInfoResult } from '../metadata/metadata.model.js';
import { TrackPage } from '../track/track.model.js';
import { AlbumFilterParameters, AlbumOrderParameters, IncludesAlbumParameters, IncludesAlbumChildrenParameters } from './album.parameters.js';
import { IncludesTrackParameters, TrackOrderParameters } from '../track/track.parameters.js';
import { IncludesArtistParameters } from '../artist/artist.parameters.js';
import { ListParameters, PageParameters } from '../base/base.parameters.js';
import { Context } from '../../modules/engine/rest/context.js';
import { Controller } from '../../modules/rest/decorators/controller.js';
import { Get } from '../../modules/rest/decorators/get.js';
import { QueryParameter } from '../../modules/rest/decorators/query-parameter.js';
import { QueryParameters } from '../../modules/rest/decorators/query-parameters.js';
import { RestContext } from '../../modules/rest/decorators/rest-context.js';

@Controller('/album', { tags: ['Album'], roles: [UserRole.stream] })
export class AlbumController {
	@Get(
		'/id',
		() => Album,
		{ description: 'Get an Album by Id', summary: 'Get Album' }
	)
	async id(
		@QueryParameter('id', { description: 'Album Id', isID: true }) id: string,
		@QueryParameters() albumParameters: IncludesAlbumParameters,
		@QueryParameters() albumChildrenParameters: IncludesAlbumChildrenParameters,
		@QueryParameters() trackParameters: IncludesTrackParameters,
		@QueryParameters() artistParameters: IncludesArtistParameters,
		@RestContext() { orm, engine, user }: Context
	): Promise<Album> {
		return engine.transform.album(
			orm, await orm.Album.oneOrFailByID(id),
			albumParameters, albumChildrenParameters, trackParameters, artistParameters, user
		);
	}

	@Get(
		'/index',
		() => AlbumIndex,
		{ description: 'Get the Navigation Index for Albums', summary: 'Get Index' }
	)
	async index(
		@QueryParameters() filter: AlbumFilterParameters,
		@RestContext() { orm, engine }: Context
	): Promise<AlbumIndex> {
		return await engine.transform.Album.albumIndex(orm, await orm.Album.indexFilter(filter));
	}

	@Get(
		'/search',
		() => AlbumPage,
		{ description: 'Search Albums' }
	)
	async search(
		@QueryParameters() page: PageParameters,
		@QueryParameters() albumParameters: IncludesAlbumParameters,
		@QueryParameters() albumChildrenParameters: IncludesAlbumChildrenParameters,
		@QueryParameters() trackParameters: IncludesTrackParameters,
		@QueryParameters() artistParameters: IncludesArtistParameters,
		@QueryParameters() filter: AlbumFilterParameters,
		@QueryParameters() order: AlbumOrderParameters,
		@QueryParameters() list: ListParameters,
		@RestContext() { orm, engine, user }: Context
	): Promise<AlbumPage> {
		if (list.list) {
			return await orm.Album.findListTransformFilter(list.list, list.seed, filter, [order], page, user,
				o => engine.transform.album(orm, o, albumParameters, albumChildrenParameters, trackParameters, artistParameters, user)
			);
		}
		return await orm.Album.searchTransformFilter(
			filter, [order], page, user,
			o => engine.transform.album(orm, o, albumParameters, albumChildrenParameters, trackParameters, artistParameters, user)
		);
	}

	@Get(
		'/info',
		() => ExtendedInfoResult,
		{ description: 'Get Meta Data Info of an Album by Id (External Service)', summary: 'Get Info' }
	)
	async info(
		@QueryParameter('id', { description: 'Album Id', isID: true }) id: string,
		@RestContext() { orm, engine }: Context
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
		@QueryParameters() page: PageParameters,
		@QueryParameters() trackParameters: IncludesTrackParameters,
		@QueryParameters() filter: AlbumFilterParameters,
		@QueryParameters() order: TrackOrderParameters,
		@RestContext() { orm, engine, user }: Context
	): Promise<TrackPage> {
		const albumIDs = await orm.Album.findIDsFilter(filter, user);
		const orders = [{ orderBy: order.orderBy ?? TrackOrderFields.default, orderDesc: order.orderDesc ?? false }];
		return await orm.Track.searchTransformFilter(
			{ albumIDs }, orders, page, user,
			o => engine.transform.Track.trackBase(orm, o, trackParameters, user)
		);
	}

	@Get(
		'/similar/tracks',
		() => TrackPage,
		{ description: ' Get similar Tracks of an Album by Id (External Service)', summary: 'Get similar Tracks' }
	)
	async similarTracks(
		@QueryParameter('id', { description: 'Album Id', isID: true }) id: string,
		@QueryParameters() page: PageParameters,
		@QueryParameters() trackParameters: IncludesTrackParameters,
		@RestContext() { orm, engine, user }: Context
	): Promise<TrackPage> {
		const album = await orm.Album.oneOrFailByID(id);
		const result = await engine.metadata.similarTracks.byAlbum(orm, album, page);
		return { ...result, items: await engine.transform.Track.trackBases(orm, result.items, trackParameters, user) };
	}
}
