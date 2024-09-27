import {Genre, GenreIndex, GenrePage} from './genre.model.js';
import {TrackOrderFields, UserRole} from '../../types/enums.js';
import {ListArgs, PageArgs} from '../base/base.args.js';
import {GenreFilterArgs, GenreOrderArgs, IncludesGenreArgs} from './genre.args.js';
import {Context} from '../../modules/engine/rest/context.js';
import {TrackPage} from '../track/track.model.js';
import {IncludesTrackArgs, TrackOrderArgs} from '../track/track.args.js';
import {AlbumOrderArgs, IncludesAlbumArgs} from '../album/album.args.js';
import {AlbumPage} from '../album/album.model.js';
import {ArtistOrderArgs, IncludesArtistArgs} from '../artist/artist.args.js';
import {ArtistPage} from '../artist/artist.model.js';
import {Controller} from '../../modules/rest/decorators/Controller.js';
import {Get} from '../../modules/rest/decorators/Get.js';
import {QueryParam} from '../../modules/rest/decorators/QueryParam.js';
import {QueryParams} from '../../modules/rest/decorators/QueryParams.js';
import {Ctx} from '../../modules/rest/decorators/Ctx.js';

@Controller('/genre', {tags: ['Genres'], roles: [UserRole.stream]})
export class GenreController {

	@Get('/id',
		() => Genre,
		{description: 'Get a Genre by Id', summary: 'Get Genre'}
	)
	async id(
		@QueryParam('id', {description: 'Genre Id', isID: true}) id: string,
		@QueryParams() genreArgs: IncludesGenreArgs,
		@Ctx() {orm, engine, user}: Context
	): Promise<Genre> {
		return engine.transform.Genre.genre(orm, await orm.Genre.oneOrFailByID(id), genreArgs, user);
	}

	@Get('/search',
		() => GenrePage,
		{description: 'Search Genres'}
	)
	async search(
		@QueryParams() page: PageArgs,
		@QueryParams() genreArgs: IncludesGenreArgs,
		@QueryParams() filter: GenreFilterArgs,
		@QueryParams() list: ListArgs,
		@QueryParams() order: GenreOrderArgs,
		@Ctx() {orm, engine, user}: Context
	): Promise<GenrePage> {
		if (list.list) {
			return await orm.Genre.findListTransformFilter(list.list, list.seed, filter, [order], page, user,
				o => engine.transform.Genre.genre(orm, o, genreArgs, user)
			);
		}
		return await orm.Genre.searchTransformFilter(
			filter, [order], page, user,
			o => engine.transform.Genre.genre(orm, o, genreArgs, user)
		);
	}

	@Get(
		'/index',
		() => GenreIndex,
		{description: 'Get the Navigation Index for Genres', summary: 'Get Genre Index'}
	)
	async index(
		@QueryParams() filter: GenreFilterArgs,
		@Ctx() {orm, engine}: Context
	): Promise<GenreIndex> {
		return await engine.transform.Genre.genreIndex(orm, await orm.Genre.indexFilter(filter));
	}

	@Get(
		'/tracks',
		() => TrackPage,
		{description: 'Get Tracks of Genres', summary: 'Get Tracks'}
	)
	async tracks(
		@QueryParams() page: PageArgs,
		@QueryParams() trackArgs: IncludesTrackArgs,
		@QueryParams() filter: GenreFilterArgs,
		@QueryParams() order: TrackOrderArgs,
		@Ctx() {orm, engine, user}: Context
	): Promise<TrackPage> {
		const genreIDs = await orm.Genre.findIDsFilter(filter, user);
		const orders = [{orderBy: order?.orderBy ? order.orderBy : TrackOrderFields.default, orderDesc: order?.orderDesc || false}];
		return await orm.Track.searchTransformFilter(
			{genreIDs}, orders, page, user,
			o => engine.transform.Track.trackBase(orm, o, trackArgs, user)
		);
	}

	@Get(
		'/albums',
		() => AlbumPage,
		{description: 'Get Albums of Genres', summary: 'Get Albums'}
	)
	async albums(
		@QueryParams() page: PageArgs,
		@QueryParams() albumArgs: IncludesAlbumArgs,
		@QueryParams() filter: GenreFilterArgs,
		@QueryParams() order: AlbumOrderArgs,
		@Ctx() {orm, engine, user}: Context
	): Promise<AlbumPage> {
		const genreIDs = await orm.Genre.findIDsFilter(filter, user);
		return await orm.Album.searchTransformFilter(
			{genreIDs}, [order], page, user,
			o => engine.transform.Album.albumBase(orm, o, albumArgs, user)
		);
	}

	@Get(
		'/artists',
		() => ArtistPage,
		{description: 'Get Artists of Genres', summary: 'Get Artists'}
	)
	async artists(
		@QueryParams() page: PageArgs,
		@QueryParams() artistArgs: IncludesArtistArgs,
		@QueryParams() filter: GenreFilterArgs,
		@QueryParams() order: ArtistOrderArgs,
		@Ctx() {orm, engine, user}: Context
	): Promise<ArtistPage> {
		const genreIDs = await orm.Genre.findIDsFilter(filter, user);
		return await orm.Artist.searchTransformFilter(
			{genreIDs}, [order], page, user,
			o => engine.transform.Artist.artistBase(orm, o, artistArgs, user)
		);
	}

}
