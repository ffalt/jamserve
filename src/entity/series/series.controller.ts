import { Series, SeriesIndex, SeriesPage } from './series.model.js';
import { UserRole } from '../../types/enums.js';
import { ExtendedInfoResult } from '../metadata/metadata.model.js';
import { TrackPage } from '../track/track.model.js';
import { AlbumPage } from '../album/album.model.js';
import { AlbumOrderParameters, IncludesAlbumParameters } from '../album/album.parameters.js';
import { IncludesSeriesParameters, IncludesSeriesChildrenParameters, SeriesFilterParameters, SeriesOrderParameters } from './series.parameters.js';
import { IncludesTrackParameters, TrackOrderParameters } from '../track/track.parameters.js';
import { ListParameters, PageParameters } from '../base/base.parameters.js';
import { Context } from '../../modules/engine/rest/context.js';
import { Controller } from '../../modules/rest/decorators/controller.js';
import { Get } from '../../modules/rest/decorators/get.js';
import { QueryParameter } from '../../modules/rest/decorators/query-parameter.js';
import { QueryParameters } from '../../modules/rest/decorators/query-parameters.js';
import { RestContext } from '../../modules/rest/decorators/rest-context.js';

@Controller('/series', { tags: ['Series'], roles: [UserRole.stream] })
export class SeriesController {
	@Get(
		'/id',
		() => Series,
		{ description: 'Get a Series by Id', summary: 'Get Series' }
	)
	async id(
		@QueryParameter('id', { description: 'Series Id', isID: true }) id: string,
		@QueryParameters() seriesParameters: IncludesSeriesParameters,
		@QueryParameters() seriesChildrenParameters: IncludesSeriesChildrenParameters,
		@QueryParameters() albumParameters: IncludesAlbumParameters,
		@QueryParameters() trackParameters: IncludesTrackParameters,
		@RestContext() { orm, engine, user }: Context
	): Promise<Series> {
		return engine.transform.series(
			orm, await orm.Series.oneOrFailByID(id),
			seriesParameters, seriesChildrenParameters, albumParameters, trackParameters, user
		);
	}

	@Get(
		'/index',
		() => SeriesIndex,
		{ description: 'Get the Navigation Index for Series', summary: 'Get Index' }
	)
	async index(@QueryParameters() filter: SeriesFilterParameters, @RestContext() { orm, engine, user }: Context): Promise<SeriesIndex> {
		const result = await orm.Series.indexFilter(filter, user);
		return engine.transform.Series.seriesIndex(orm, result);
	}

	@Get(
		'/search',
		() => SeriesPage,
		{ description: 'Search Series' }
	)
	async search(
		@QueryParameters() page: PageParameters,
		@QueryParameters() seriesParameters: IncludesSeriesParameters,
		@QueryParameters() seriesChildrenParameters: IncludesSeriesChildrenParameters,
		@QueryParameters() albumParameters: IncludesAlbumParameters,
		@QueryParameters() trackParameters: IncludesTrackParameters,
		@QueryParameters() filter: SeriesFilterParameters,
		@QueryParameters() order: SeriesOrderParameters,
		@QueryParameters() list: ListParameters,
		@RestContext() { orm, engine, user }: Context
	): Promise<SeriesPage> {
		if (list.list) {
			return await orm.Series.findListTransformFilter(list.list, list.seed, filter, [order], page, user,
				o => engine.transform.series(orm, o, seriesParameters, seriesChildrenParameters, albumParameters, trackParameters, user)
			);
		}
		return await orm.Series.searchTransformFilter(
			filter, [order], page, user,
			o => engine.transform.series(orm, o, seriesParameters, seriesChildrenParameters, albumParameters, trackParameters, user)
		);
	}

	@Get(
		'/info',
		() => ExtendedInfoResult,
		{ description: 'Get Meta Data Info of a Series by Id (External Service)', summary: 'Get Info' }
	)
	async info(
		@QueryParameter('id', { description: 'Series Id', isID: true }) id: string,
		@RestContext() { orm, engine }: Context
	): Promise<ExtendedInfoResult> {
		const series = await orm.Series.oneOrFailByID(id);
		return { info: await engine.metadata.extInfo.bySeries(orm, series) };
	}

	@Get(
		'/albums',
		() => AlbumPage,
		{ description: 'Get Albums of Series', summary: 'Get Albums' }
	)
	async albums(
		@QueryParameters() page: PageParameters,
		@QueryParameters() albumParameters: IncludesAlbumParameters,
		@QueryParameters() filter: SeriesFilterParameters,
		@QueryParameters() order: AlbumOrderParameters,
		@RestContext() { orm, engine, user }: Context
	): Promise<AlbumPage> {
		const seriesIDs = await orm.Series.findIDsFilter(filter, user);
		return await orm.Album.searchTransformFilter(
			{ seriesIDs }, [order], page, user,
			o => engine.transform.Album.albumBase(orm, o, albumParameters, user)
		);
	}

	@Get(
		'/tracks',
		() => TrackPage,
		{ description: 'Get Tracks of Series', summary: 'Get Tracks' }
	)
	async tracks(
		@QueryParameters() page: PageParameters,
		@QueryParameters() trackParameters: IncludesTrackParameters,
		@QueryParameters() filter: SeriesFilterParameters,
		@QueryParameters() order: TrackOrderParameters,
		@RestContext() { orm, engine, user }: Context
	): Promise<TrackPage> {
		const seriesIDs = await orm.Series.findIDsFilter(filter, user);
		return await orm.Track.searchTransformFilter(
			{ seriesIDs }, [order], page, user,
			o => engine.transform.Track.trackBase(orm, o, trackParameters, user)
		);
	}
}
