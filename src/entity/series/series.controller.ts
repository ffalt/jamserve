import { Series, SeriesIndex, SeriesPage } from './series.model.js';
import { UserRole } from '../../types/enums.js';
import { ExtendedInfoResult } from '../metadata/metadata.model.js';
import { TrackPage } from '../track/track.model.js';
import { AlbumPage } from '../album/album.model.js';
import { AlbumOrderArgs, IncludesAlbumArgs } from '../album/album.args.js';
import { IncludesSeriesArgs, IncludesSeriesChildrenArgs, SeriesFilterArgs, SeriesOrderArgs } from './series.args.js';
import { IncludesTrackArgs, TrackOrderArgs } from '../track/track.args.js';
import { ListArgs, PageArgs } from '../base/base.args.js';
import { Context } from '../../modules/engine/rest/context.js';
import {Controller} from '../../modules/rest/decorators/Controller.js';
import {Get} from '../../modules/rest/decorators/Get.js';
import {QueryParam} from '../../modules/rest/decorators/QueryParam.js';
import {QueryParams} from '../../modules/rest/decorators/QueryParams.js';
import {Ctx} from '../../modules/rest/decorators/Ctx.js';

@Controller('/series', { tags: ['Series'], roles: [UserRole.stream] })
export class SeriesController {
	@Get(
		'/id',
		() => Series,
		{ description: 'Get a Series by Id', summary: 'Get Series' }
	)
	async id(
		@QueryParam('id', { description: 'Series Id', isID: true }) id: string,
		@QueryParams() seriesArgs: IncludesSeriesArgs,
		@QueryParams() seriesChildrenArgs: IncludesSeriesChildrenArgs,
		@QueryParams() albumArgs: IncludesAlbumArgs,
		@QueryParams() trackArgs: IncludesTrackArgs,
		@Ctx() { orm, engine, user }: Context
	): Promise<Series> {
		return engine.transform.series(
			orm, await orm.Series.oneOrFailByID(id),
			seriesArgs, seriesChildrenArgs, albumArgs, trackArgs, user
		);
	}

	@Get(
		'/index',
		() => SeriesIndex,
		{ description: 'Get the Navigation Index for Series', summary: 'Get Index' }
	)
	async index(@QueryParams() filter: SeriesFilterArgs, @Ctx() { orm, engine, user }: Context): Promise<SeriesIndex> {
		const result = await orm.Series.indexFilter(filter, user);
		return engine.transform.Series.seriesIndex(orm, result);
	}

	@Get(
		'/search',
		() => SeriesPage,
		{ description: 'Search Series' }
	)
	async search(
		@QueryParams() page: PageArgs,
		@QueryParams() seriesArgs: IncludesSeriesArgs,
		@QueryParams() seriesChildrenArgs: IncludesSeriesChildrenArgs,
		@QueryParams() albumArgs: IncludesAlbumArgs,
		@QueryParams() trackArgs: IncludesTrackArgs,
		@QueryParams() filter: SeriesFilterArgs,
		@QueryParams() order: SeriesOrderArgs,
		@QueryParams() list: ListArgs,
		@Ctx() { orm, engine, user }: Context
	): Promise<SeriesPage> {
		if (list.list) {
			return await orm.Series.findListTransformFilter(list.list, list.seed, filter, [order], page, user,
				o => engine.transform.series(orm, o, seriesArgs, seriesChildrenArgs, albumArgs, trackArgs, user)
			);
		}
		return await orm.Series.searchTransformFilter(
			filter, [order], page, user,
			o => engine.transform.series(orm, o, seriesArgs, seriesChildrenArgs, albumArgs, trackArgs, user)
		);
	}

	@Get(
		'/info',
		() => ExtendedInfoResult,
		{ description: 'Get Meta Data Info of a Series by Id (External Service)', summary: 'Get Info' }
	)
	async info(
		@QueryParam('id', { description: 'Series Id', isID: true }) id: string,
		@Ctx() { orm, engine }: Context
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
		@QueryParams() page: PageArgs,
		@QueryParams() albumArgs: IncludesAlbumArgs,
		@QueryParams() filter: SeriesFilterArgs,
		@QueryParams() order: AlbumOrderArgs,
		@Ctx() { orm, engine, user }: Context
	): Promise<AlbumPage> {
		const seriesIDs = await orm.Series.findIDsFilter(filter, user);
		return await orm.Album.searchTransformFilter(
			{ seriesIDs }, [order], page, user,
			o => engine.transform.Album.albumBase(orm, o, albumArgs, user)
		);
	}

	@Get(
		'/tracks',
		() => TrackPage,
		{ description: 'Get Tracks of Series', summary: 'Get Tracks' }
	)
	async tracks(
		@QueryParams() page: PageArgs,
		@QueryParams() trackArgs: IncludesTrackArgs,
		@QueryParams() filter: SeriesFilterArgs,
		@QueryParams() order: TrackOrderArgs,
		@Ctx() { orm, engine, user }: Context
	): Promise<TrackPage> {
		const seriesIDs = await orm.Series.findIDsFilter(filter, user);
		return await orm.Track.searchTransformFilter(
			{ seriesIDs }, [order], page, user,
			o => engine.transform.Track.trackBase(orm, o, trackArgs, user)
		);
	}
}
