import { Inject, InRequestScope } from 'typescript-ioc';
import { BaseTransformService } from '../base/base.transform.js';
import { Orm } from '../../modules/engine/services/orm.service.js';
import { Series as ORMSeries } from './series.js';
import { IncludesSeriesParameters } from './series.parameters.js';
import { User } from '../user/user.js';
import { SeriesBase, SeriesIndex } from './series.model.js';
import { DBObjectType } from '../../types/enums.js';
import { IndexResult, IndexResultGroup } from '../base/base.js';
import { MetaDataService } from '../metadata/metadata.service.js';

@InRequestScope
export class SeriesTransformService extends BaseTransformService {
	@Inject
	public metaData!: MetaDataService;

	async seriesBases(orm: Orm, list: Array<ORMSeries>, seriesParameters: IncludesSeriesParameters, user: User): Promise<Array<SeriesBase>> {
		return await Promise.all(list.map(t => this.seriesBase(orm, t, seriesParameters, user)));
	}

	async seriesBase(orm: Orm, o: ORMSeries, seriesParameters: IncludesSeriesParameters, user: User): Promise<SeriesBase> {
		const artist = await o.artist.getOrFail();
		return {
			id: o.id,
			name: o.name,
			created: o.createdAt.valueOf(),
			artist: artist.name,
			artistID: artist.id,
			albumTypes: o.albumTypes,
			albumCount: seriesParameters.seriesIncAlbumCount ? await o.albums.count() : undefined,
			trackCount: seriesParameters.seriesIncTrackCount ? await o.tracks.count() : undefined,
			trackIDs: seriesParameters.seriesIncTrackIDs ? await o.tracks.getIDs() : undefined,
			albumIDs: seriesParameters.seriesIncAlbumIDs ? await o.albums.getIDs() : undefined,
			info: seriesParameters.seriesIncInfo ? await this.metaData.extInfo.bySeries(orm, o) : undefined,
			state: seriesParameters.seriesIncState ? await this.state(orm, o.id, DBObjectType.series, user.id) : undefined
		};
	}

	async seriesIndex(_orm: Orm, result: IndexResult<IndexResultGroup<ORMSeries>>): Promise<SeriesIndex> {
		return this.index(result, async item => {
			return {
				id: item.id,
				name: item.name,
				albumCount: await item.albums.count(),
				trackCount: await item.tracks.count()
			};
		});
	}
}
