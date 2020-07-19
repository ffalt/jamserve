import {QueryOrder, Repository} from 'mikro-orm';
import {BaseRepository} from '../base/base.repository';
import {DBObjectType} from '../../types/enums';
import {Series} from './series';
import {QBFilterQuery} from 'mikro-orm/dist/typings';
import {QHelper} from '../base/base';
import {QueryOrderMap} from 'mikro-orm/dist/query';
import {User} from '../user/user';
import {SeriesFilterArgs, SeriesOrderArgs} from './series.args';

@Repository(Series)
export class SeriesRepository extends BaseRepository<Series, SeriesFilterArgs, SeriesOrderArgs> {
	objType = DBObjectType.series;
	indexProperty = 'name';

	applyOrderByEntry(result: QueryOrderMap, direction: QueryOrder, order?: SeriesOrderArgs): void {
		this.applyDefaultOrderByEntry(result,direction,order?.orderBy);
	}

	async buildFilter(filter: SeriesFilterArgs, user?: User): Promise<QBFilterQuery<Series>> {
		return filter ? QHelper.buildQuery<Series>(
			[
				{id: filter.ids},
				{name: QHelper.like(filter.query)},
				{name: QHelper.eq(filter.name)},
				{createdAt: QHelper.gte(filter.since)},
				{tracks: QHelper.foreignKeys(filter.trackIDs)},
				{albums: QHelper.foreignKeys(filter.albumIDs)},
				{artist: QHelper.foreignKey(filter.artistIDs)},
				{roots: QHelper.foreignKeys(filter.rootIDs)},
				{folders: QHelper.foreignKeys(filter.folderIDs)},
				...QHelper.inStringArray('albumTypes', filter.albumTypes)
			]
		) : {};
	}

}
