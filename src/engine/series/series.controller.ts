import {JamRequest} from '../../api/jam/api';
import {DBObjectType} from '../../db/db.types';
import {Jam} from '../../model/jam-rest-data';
import {JamParameters} from '../../model/jam-rest-params';
import {paginate} from '../../utils/paginate';
import {AlbumController} from '../album/album.controller';
import {Album} from '../album/album.model';
import {BaseListController} from '../base/dbobject-list.controller';
import {ListResult} from '../base/list-result';
import {DownloadService} from '../download/download.service';
import {ImageService} from '../image/image.service';
import {formatSeriesIndex} from '../index/index.format';
import {IndexService} from '../index/index.service';
import {MetaDataService} from '../metadata/metadata.service';
import {formatState} from '../state/state.format';
import {StateService} from '../state/state.service';
import {TrackController} from '../track/track.controller';
import {User} from '../user/user.model';
import {formatSeries} from './series.format';
import {Series} from './series.model';
import {SeriesService} from './series.service';
import {SearchQuerySeries} from './series.store';

export class SeriesController extends BaseListController<JamParameters.Series,
	JamParameters.Serieses,
	JamParameters.IncludesSeries,
	SearchQuerySeries,
	JamParameters.SeriesSearch,
	Series,
	Jam.Series,
	JamParameters.SeriesList> {

	constructor(
		public seriesService: SeriesService,
		private trackController: TrackController,
		private albumController: AlbumController,
		private metaDataService: MetaDataService,
		private indexService: IndexService,
		protected stateService: StateService,
		protected imageService: ImageService,
		protected downloadService: DownloadService
	) {
		super(seriesService, stateService, imageService, downloadService);
	}

	async prepare(series: Series, includes: JamParameters.IncludesSeries, user: User): Promise<Jam.Series> {
		const result = formatSeries(series, includes);
		if (includes.seriesState) {
			const state = await this.stateService.findOrCreate(series.id, user.id, DBObjectType.series);
			result.state = formatState(state);
		}
		if (includes.seriesInfo) {
			result.info = await this.metaDataService.extInfo.bySeries(series);
		}
		if (includes.seriesTracks) {
			result.tracks = await this.trackController.prepareListByIDs(series.trackIDs, includes, user, SeriesService.sortSeriesTracks);
		}
		if (includes.seriesAlbums) {
			result.albums = await this.albumController.prepareListByIDs(series.albumIDs, includes, user, SeriesService.sortSeriesAlbums);
		}
		return result;
	}

	async translateQuery(query: JamParameters.SeriesSearch, user: User): Promise<SearchQuerySeries> {
		return {
			query: query.query,
			id: query.id,
			ids: query.ids,
			name: query.name,
			rootID: query.rootID,
			rootIDs: query.rootIDs,
			albumID: query.albumID,
			albumType: query.albumType,
			albumTypes: query.albumTypes,
			newerThan: query.newerThan,
			offset: query.offset,
			amount: query.amount,
			sorts: query.sortField ? [{field: query.sortField, descending: !!query.sortDescending}] : undefined
		};
	}

	async index(req: JamRequest<JamParameters.SeriesSearchQuery>): Promise<Jam.SeriesIndex> {
		return formatSeriesIndex(await this.indexService.getSeriesIndex(await this.translateQuery(req.query, req.user)));
	}

	async albums(req: JamRequest<JamParameters.ArtistAlbums>): Promise<ListResult<Jam.Album>> {
		const series = await this.byIDs(req.query.ids);
		let albumIDs: Array<string> = [];
		series.forEach(item => {
			albumIDs = albumIDs.concat(item.albumIDs);
		});
		const list = paginate(albumIDs, req.query.amount, req.query.offset);
		return {
			total: list.total,
			amount: list.amount,
			offset: list.offset,
			items: await this.albumController.prepareListByIDs(list.items, req.query, req.user, SeriesService.sortSeriesAlbums)
		};
	}

	async tracks(req: JamRequest<JamParameters.SeriesTracks>): Promise<ListResult<Jam.Track>> {
		const series = await this.byIDs(req.query.ids);
		let trackIDs: Array<string> = [];
		series.forEach(item => {
			trackIDs = trackIDs.concat(item.trackIDs);
		});
		const list = paginate(trackIDs, req.query.amount, req.query.offset);
		return {
			total: list.total,
			amount: list.amount,
			offset: list.offset,
			items: await this.trackController.prepareListByIDs(list.items, req.query, req.user, SeriesService.sortSeriesTracks)
		};
	}

	async info(req: JamRequest<JamParameters.ID>): Promise<Jam.Info> {
		const series = await this.byID(req.query.id);
		return {info: await this.metaDataService.extInfo.bySeries(series)};
	}

}
