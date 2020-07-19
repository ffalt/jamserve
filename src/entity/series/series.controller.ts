import {Series, SeriesIndex, SeriesPage} from './series.model';
import {User} from '../user/user';
import {Controller, CurrentUser, Get, QueryParam, QueryParams} from '../../modules/rest';
import {UserRole} from '../../types/enums';
import {BaseController} from '../base/base.controller';
import {ExtendedInfoResult} from '../metadata/metadata.model';
import {TrackPage} from '../track/track.model';
import {AlbumPage} from '../album/album.model';
import {AlbumOrderArgs, IncludesAlbumArgs} from '../album/album.args';
import {IncludesSeriesArgs, IncludesSeriesChildrenArgs, SeriesFilterArgs, SeriesOrderArgs} from './series.args';
import {IncludesTrackArgs, TrackOrderArgs} from '../track/track.args';
import {ListArgs, PageArgs} from '../base/base.args';

@Controller('/series', {tags: ['Series'], roles: [UserRole.stream]})
export class SeriesController extends BaseController {
	@Get(
		'/id',
		() => Series,
		{description: 'Get a Series by Id', summary: 'Get Series'}
	)
	async id(
		@QueryParam('id', {description: 'Series Id', isID: true}) id: string,
		@QueryParams() seriesArgs: IncludesSeriesArgs,
		@QueryParams() seriesChildrenArgs: IncludesSeriesChildrenArgs,
		@QueryParams() albumArgs: IncludesAlbumArgs,
		@QueryParams() trackArgs: IncludesTrackArgs,
		@CurrentUser() user: User
	): Promise<Series> {
		return this.transform.series(
			await this.orm.Series.oneOrFail(id),
			seriesArgs, seriesChildrenArgs, albumArgs, trackArgs, user
		);
	}

	@Get(
		'/index',
		() => SeriesIndex,
		{description: 'Get the Navigation Index for Series', summary: 'Get Index'}
	)
	async index(@QueryParams() filter: SeriesFilterArgs, @CurrentUser() user: User): Promise<SeriesIndex> {
		const result = await this.orm.Series.indexFilter(filter, user);
		return this.transform.transformSeriesIndex(result);
	}

	@Get(
		'/search',
		() => SeriesPage,
		{description: 'Search Series'}
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
		@CurrentUser() user: User
	): Promise<SeriesPage> {
		if (list.list) {
			return await this.orm.Series.findListTransformFilter(list.list, filter, [order], page, user,
				o => this.transform.series(o, seriesArgs, seriesChildrenArgs, albumArgs, trackArgs, user)
			);
		}
		return await this.orm.Series.searchTransformFilter(
			filter, [order], page, user,
			o => this.transform.series(o, seriesArgs, seriesChildrenArgs, albumArgs, trackArgs, user)
		);
	}

	@Get(
		'/info',
		() => ExtendedInfoResult,
		{description: 'Get Meta Data Info of a Series by Id (External Service)', summary: 'Get Info'}
	)
	async info(@QueryParam('id', {description: 'Series Id', isID: true}) id: string): Promise<ExtendedInfoResult> {
		const series = await this.orm.Series.oneOrFail(id);
		return {info: await this.metadata.extInfo.bySeries(series)};
	}

	@Get(
		'/albums',
		() => AlbumPage,
		{description: 'Get Albums of Series', summary: 'Get Albums'}
	)
	async albums(
		@QueryParams() page: PageArgs,
		@QueryParams() albumArgs: IncludesAlbumArgs,
		@QueryParams() filter: SeriesFilterArgs,
		@QueryParams() order: AlbumOrderArgs,
		@CurrentUser() user: User
	): Promise<AlbumPage> {
		const seriesIDs = await this.orm.Series.findIDsFilter(filter, user);
		return await this.orm.Album.searchTransformFilter(
			{seriesIDs}, [order], page, user,
			o => this.transform.albumBase(o, albumArgs, user)
		);
	}

	@Get(
		'/tracks',
		() => TrackPage,
		{description: 'Get Tracks of Series', summary: 'Get Tracks'}
	)
	async tracks(
		@QueryParams() page: PageArgs,
		@QueryParams() trackArgs: IncludesTrackArgs,
		@QueryParams() filter: SeriesFilterArgs,
		@QueryParams() order: TrackOrderArgs,
		@CurrentUser() user: User
	): Promise<TrackPage> {
		const seriesIDs = await this.orm.Series.findIDsFilter(filter, user);
		return await this.orm.Track.searchTransformFilter(
			{seriesIDs}, [order], page, user,
			o => this.transform.trackBase(o, trackArgs, user)
		);
	}
}
