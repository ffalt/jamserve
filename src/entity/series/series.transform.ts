import { Inject, InRequestScope } from 'typescript-ioc';
import { BaseTransformService } from '../base/base.transform.js';
import { Orm } from '../../modules/engine/services/orm.service.js';
import { Series as ORMSeries } from './series.js';
import { IncludesSeriesArgs } from './series.args.js';
import { User } from '../user/user.js';
import { SeriesBase, SeriesIndex } from './series.model.js';
import { DBObjectType } from '../../types/enums.js';
import { IndexResult, IndexResultGroup } from '../base/base.js';
import { MetaDataService } from '../metadata/metadata.service.js';

@InRequestScope
export class SeriesTransformService extends BaseTransformService {
	@Inject
	public metaData!: MetaDataService;

	async seriesBases(orm: Orm, list: Array<ORMSeries>, seriesArgs: IncludesSeriesArgs, user: User): Promise<Array<SeriesBase>> {
		return await Promise.all(list.map(t => this.seriesBase(orm, t, seriesArgs, user)));
	}

	async seriesBase(orm: Orm, o: ORMSeries, seriesArgs: IncludesSeriesArgs, user: User): Promise<SeriesBase> {
		const artist = await o.artist.getOrFail();
		return {
			id: o.id,
			name: o.name,
			created: o.createdAt.valueOf(),
			artist: artist.name,
			artistID: artist.id,
			albumTypes: o.albumTypes,
			albumCount: seriesArgs.seriesIncAlbumCount ? await o.albums.count() : undefined,
			trackCount: seriesArgs.seriesIncTrackCount ? await o.tracks.count() : undefined,
			trackIDs: seriesArgs.seriesIncTrackIDs ? await o.tracks.getIDs() : undefined,
			albumIDs: seriesArgs.seriesIncAlbumIDs ? await o.albums.getIDs() : undefined,
			info: seriesArgs.seriesIncInfo ? await this.metaData.extInfo.bySeries(orm, o) : undefined,
			state: seriesArgs.seriesIncState ? await this.state(orm, o.id, DBObjectType.series, user.id) : undefined
		};
	}

	async seriesIndex(orm: Orm, result: IndexResult<IndexResultGroup<ORMSeries>>): Promise<SeriesIndex> {
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
