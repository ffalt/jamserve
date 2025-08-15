import { Artist, ArtistIndex, ArtistPage } from './artist.model.js';
import { UserRole } from '../../types/enums.js';
import { ExtendedInfoResult } from '../metadata/metadata.model.js';
import { TrackPage } from '../track/track.model.js';
import { AlbumPage } from '../album/album.model.js';
import { SeriesPage } from '../series/series.model.js';
import { AlbumOrderParameters, IncludesAlbumParameters } from '../album/album.parameters.js';
import { IncludesSeriesParameters, SeriesFilterParameters, SeriesOrderParameters } from '../series/series.parameters.js';
import { IncludesTrackParameters, TrackOrderParameters } from '../track/track.parameters.js';
import { ArtistFilterParameters, ArtistOrderParameters, IncludesArtistParameters, IncludesArtistChildrenParameters } from './artist.parameters.js';
import { ListParameters, PageParameters } from '../base/base.parameters.js';
import { Context } from '../../modules/engine/rest/context.js';
import { Controller } from '../../modules/rest/decorators/controller.js';
import { Get } from '../../modules/rest/decorators/get.js';
import { QueryParameter } from '../../modules/rest/decorators/query-parameter.js';
import { QueryParameters } from '../../modules/rest/decorators/query-parameters.js';
import { RestContext } from '../../modules/rest/decorators/rest-context.js';

@Controller('/artist', { tags: ['Artist'], roles: [UserRole.stream] })
export class ArtistController {
	@Get('/id',
		() => Artist,
		{ description: 'Get an Artist by Id', summary: 'Get Artist' }
	)
	async id(
		@QueryParameter('id', { description: 'Artist Id', isID: true }) id: string,
		@QueryParameters() artistParameters: IncludesArtistParameters,
		@QueryParameters() artistChildrenParameters: IncludesArtistChildrenParameters,
		@QueryParameters() trackParameters: IncludesTrackParameters,
		@QueryParameters() albumParameters: IncludesAlbumParameters,
		@QueryParameters() seriesParameters: IncludesSeriesParameters,
		@RestContext() { orm, engine, user }: Context
	): Promise<Artist> {
		return engine.transform.artist(
			orm, await orm.Artist.oneOrFailByID(id),
			artistParameters, artistChildrenParameters, trackParameters, albumParameters, seriesParameters, user
		);
	}

	@Get(
		'/index',
		() => ArtistIndex,
		{ description: 'Get the Navigation Index for Albums', summary: 'Get Index' }
	)
	async index(
		@QueryParameters() filter: ArtistFilterParameters,
		@RestContext() { orm, engine, user }: Context
	): Promise<ArtistIndex> {
		const result = await orm.Artist.indexFilter(filter, user, engine.settings.settings.index.ignoreArticles);
		return await engine.transform.Artist.artistIndex(orm, result);
	}

	@Get(
		'/search',
		() => ArtistPage,
		{ description: 'Search Artists' }
	)
	async search(
		@QueryParameters() page: PageParameters,
		@QueryParameters() artistParameters: IncludesArtistParameters,
		@QueryParameters() artistChildrenParameters: IncludesArtistChildrenParameters,
		@QueryParameters() trackParameters: IncludesTrackParameters,
		@QueryParameters() albumParameters: IncludesAlbumParameters,
		@QueryParameters() seriesParameters: IncludesSeriesParameters,
		@QueryParameters() filter: ArtistFilterParameters,
		@QueryParameters() order: ArtistOrderParameters,
		@QueryParameters() list: ListParameters,
		@RestContext() { orm, engine, user }: Context
	): Promise<ArtistPage> {
		if (list.list) {
			return await orm.Artist.findListTransformFilter(list.list, list.seed, filter, [order], page, user,
				o => engine.transform.artist(orm, o, artistParameters, artistChildrenParameters, trackParameters, albumParameters, seriesParameters, user)
			);
		}
		return await orm.Artist.searchTransformFilter(
			filter, [order], page, user,
			o => engine.transform.artist(orm, o, artistParameters, artistChildrenParameters, trackParameters, albumParameters, seriesParameters, user)
		);
	}

	@Get(
		'/info',
		() => ExtendedInfoResult,
		{ description: 'Get Meta Data Info of an Artist by Id (External Service)', summary: 'Get Info' }
	)
	async info(
		@QueryParameter('id', { description: 'Artist Id', isID: true }) id: string,
		@RestContext() { orm, engine }: Context
	): Promise<ExtendedInfoResult> {
		const artist = await orm.Artist.oneOrFailByID(id);
		return { info: await engine.metadata.extInfo.byArtist(orm, artist) };
	}

	@Get(
		'/similar',
		() => ArtistPage,
		{ description: 'Get similar Artists of an Artist by Id (External Service)', summary: 'Get similar Artists' }
	)
	async similar(
		@QueryParameter('id', { description: 'Artist Id', isID: true }) id: string,
		@QueryParameters() page: PageParameters,
		@QueryParameters() artistParameters: IncludesArtistParameters,
		@RestContext() { orm, engine, user }: Context
	): Promise<ArtistPage> {
		const artist = await orm.Artist.oneOrFailByID(id);
		const result = await engine.metadata.similarArtists.byArtist(orm, artist, page);
		return { ...result, items: await engine.transform.Artist.artistBases(orm, result.items, artistParameters, user) };
	}

	@Get(
		'/similar/tracks',
		() => TrackPage,
		{ description: 'Get similar Tracks of an Artist by Id (External Service)', summary: 'Get similar Tracks' }
	)
	async similarTracks(
		@QueryParameter('id', { description: 'Artist Id', isID: true }) id: string,
		@QueryParameters() page: PageParameters,
		@QueryParameters() trackParameters: IncludesTrackParameters,
		@RestContext() { orm, engine, user }: Context
	): Promise<TrackPage> {
		const artist = await orm.Artist.oneOrFailByID(id);
		const result = await engine.metadata.similarTracks.byArtist(orm, artist, page);
		return { ...result, items: await engine.transform.Track.trackBases(orm, result.items, trackParameters, user) };
	}

	@Get(
		'/tracks',
		() => TrackPage,
		{ description: 'Get Tracks of Artists', summary: 'Get Tracks' }
	)
	async tracks(
		@QueryParameters() page: PageParameters,
		@QueryParameters() trackParameters: IncludesTrackParameters,
		@QueryParameters() filter: ArtistFilterParameters,
		@QueryParameters() order: TrackOrderParameters,
		@RestContext() { orm, engine, user }: Context
	): Promise<TrackPage> {
		const artistIDs = await orm.Artist.findIDsFilter(filter, user);
		return await orm.Track.searchTransformFilter(
			{ artistIDs }, [order], page, user,
			o => engine.transform.Track.trackBase(orm, o, trackParameters, user)
		);
	}

	@Get(
		'/albums',
		() => AlbumPage,
		{ description: 'Get Albums of Artists', summary: 'Get Albums' }
	)
	async albums(
		@QueryParameters() page: PageParameters,
		@QueryParameters() albumParameters: IncludesAlbumParameters,
		@QueryParameters() filter: ArtistFilterParameters,
		@QueryParameters() order: AlbumOrderParameters,
		@RestContext() { orm, engine, user }: Context
	): Promise<AlbumPage> {
		const artistIDs = await orm.Artist.findIDsFilter(filter, user);
		return await orm.Album.searchTransformFilter(
			{ artistIDs }, [order], page, user,
			o => engine.transform.Album.albumBase(orm, o, albumParameters, user)
		);
	}

	@Get(
		'/series',
		() => SeriesPage,
		{ description: 'Get Series of Artists', summary: 'Get Series' }
	)
	async series(
		@QueryParameters() page: PageParameters,
		@QueryParameters() seriesParameters: IncludesSeriesParameters,
		@QueryParameters() filter: SeriesFilterParameters,
		@QueryParameters() order: SeriesOrderParameters,
		@RestContext() { orm, engine, user }: Context
	): Promise<SeriesPage> {
		const artistIDs = await orm.Artist.findIDsFilter(filter, user);
		return await orm.Series.searchTransformFilter(
			{ artistIDs }, [order], page, user,
			o => engine.transform.Series.seriesBase(orm, o, seriesParameters, user)
		);
	}
}
