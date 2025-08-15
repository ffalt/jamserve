import { Genre, GenreIndex, GenrePage } from './genre.model.js';
import { TrackOrderFields, UserRole } from '../../types/enums.js';
import { ListParameters, PageParameters } from '../base/base.parameters.js';
import { GenreFilterParameters, GenreOrderParameters, IncludesGenreParameters } from './genre.parameters.js';
import { Context } from '../../modules/engine/rest/context.js';
import { TrackPage } from '../track/track.model.js';
import { IncludesTrackParameters, TrackOrderParameters } from '../track/track.parameters.js';
import { AlbumOrderParameters, IncludesAlbumParameters } from '../album/album.parameters.js';
import { AlbumPage } from '../album/album.model.js';
import { ArtistOrderParameters, IncludesArtistParameters } from '../artist/artist.parameters.js';
import { ArtistPage } from '../artist/artist.model.js';
import { Controller } from '../../modules/rest/decorators/controller.js';
import { Get } from '../../modules/rest/decorators/get.js';
import { QueryParameter } from '../../modules/rest/decorators/query-parameter.js';
import { QueryParameters } from '../../modules/rest/decorators/query-parameters.js';
import { RestContext } from '../../modules/rest/decorators/rest-context.js';

@Controller('/genre', { tags: ['Genres'], roles: [UserRole.stream] })
export class GenreController {
	@Get('/id',
		() => Genre,
		{ description: 'Get a Genre by Id', summary: 'Get Genre' }
	)
	async id(
		@QueryParameter('id', { description: 'Genre Id', isID: true }) id: string,
		@QueryParameters() parameters: IncludesGenreParameters,
		@RestContext() { orm, engine, user }: Context
	): Promise<Genre> {
		return engine.transform.Genre.genre(orm, await orm.Genre.oneOrFailByID(id), parameters, user);
	}

	@Get('/search',
		() => GenrePage,
		{ description: 'Search Genres' }
	)
	async search(
		@QueryParameters() page: PageParameters,
		@QueryParameters() parameters: IncludesGenreParameters,
		@QueryParameters() filter: GenreFilterParameters,
		@QueryParameters() list: ListParameters,
		@QueryParameters() order: GenreOrderParameters,
		@RestContext() { orm, engine, user }: Context
	): Promise<GenrePage> {
		if (list.list) {
			return await orm.Genre.findListTransformFilter(list.list, list.seed, filter, [order], page, user,
				o => engine.transform.Genre.genre(orm, o, parameters, user)
			);
		}
		return await orm.Genre.searchTransformFilter(
			filter, [order], page, user,
			o => engine.transform.Genre.genre(orm, o, parameters, user)
		);
	}

	@Get(
		'/index',
		() => GenreIndex,
		{ description: 'Get the Navigation Index for Genres', summary: 'Get Genre Index' }
	)
	async index(
		@QueryParameters() filter: GenreFilterParameters,
		@RestContext() { orm, engine }: Context
	): Promise<GenreIndex> {
		return await engine.transform.Genre.genreIndex(orm, await orm.Genre.indexFilter(filter));
	}

	@Get(
		'/tracks',
		() => TrackPage,
		{ description: 'Get Tracks of Genres', summary: 'Get Tracks' }
	)
	async tracks(
		@QueryParameters() page: PageParameters,
		@QueryParameters() trackParameters: IncludesTrackParameters,
		@QueryParameters() filter: GenreFilterParameters,
		@QueryParameters() order: TrackOrderParameters,
		@RestContext() { orm, engine, user }: Context
	): Promise<TrackPage> {
		const genreIDs = await orm.Genre.findIDsFilter(filter, user);
		const orders = [{ orderBy: order.orderBy ?? TrackOrderFields.default, orderDesc: order.orderDesc ?? false }];
		return await orm.Track.searchTransformFilter(
			{ genreIDs }, orders, page, user,
			o => engine.transform.Track.trackBase(orm, o, trackParameters, user)
		);
	}

	@Get(
		'/albums',
		() => AlbumPage,
		{ description: 'Get Albums of Genres', summary: 'Get Albums' }
	)
	async albums(
		@QueryParameters() page: PageParameters,
		@QueryParameters() albumParameters: IncludesAlbumParameters,
		@QueryParameters() filter: GenreFilterParameters,
		@QueryParameters() order: AlbumOrderParameters,
		@RestContext() { orm, engine, user }: Context
	): Promise<AlbumPage> {
		const genreIDs = await orm.Genre.findIDsFilter(filter, user);
		return await orm.Album.searchTransformFilter(
			{ genreIDs }, [order], page, user,
			o => engine.transform.Album.albumBase(orm, o, albumParameters, user)
		);
	}

	@Get(
		'/artists',
		() => ArtistPage,
		{ description: 'Get Artists of Genres', summary: 'Get Artists' }
	)
	async artists(
		@QueryParameters() page: PageParameters,
		@QueryParameters() artistParameters: IncludesArtistParameters,
		@QueryParameters() filter: GenreFilterParameters,
		@QueryParameters() order: ArtistOrderParameters,
		@RestContext() { orm, engine, user }: Context
	): Promise<ArtistPage> {
		const genreIDs = await orm.Genre.findIDsFilter(filter, user);
		return await orm.Artist.searchTransformFilter(
			{ genreIDs }, [order], page, user,
			o => engine.transform.Artist.artistBase(orm, o, artistParameters, user)
		);
	}
}
