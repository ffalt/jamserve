import {BaseRepository} from '../base/base.repository';
import {DBObjectType} from '../../types/enums';
import {Series} from './series';
import {User} from '../user/user';
import {SeriesFilterArgs, SeriesOrderArgs} from './series.args';
import {FindOptions, OrderItem, QHelper} from '../../modules/orm';

// @Repository(Series)
export class SeriesRepository extends BaseRepository<Series, SeriesFilterArgs, SeriesOrderArgs> {
	objType = DBObjectType.series;
	indexProperty = 'name';

	buildOrder(order?: SeriesOrderArgs): Array<OrderItem> {
		return this.buildDefaultOrder(order);
	}

	async buildFilter(filter?: SeriesFilterArgs, _?: User): Promise<FindOptions<Series>> {
		if (!filter) {
			return {};
		}
		const result = QHelper.buildQuery<Series>(
			[
				{id: filter.ids},
				{name: QHelper.like(filter.query)},
				{name: QHelper.eq(filter.name)},
				{createdAt: QHelper.gte(filter.since)},
				{artist: QHelper.inOrEqual(filter.artistIDs)},
				...QHelper.inStringArray('albumTypes', filter.albumTypes)
			]
		);
		result.include = QHelper.includeQueries<Series>([
			{tracks: [{id: QHelper.inOrEqual(filter.trackIDs)}]},
			{albums: [{id: QHelper.inOrEqual(filter.albumIDs)}]},
			{folders: [{id: QHelper.inOrEqual(filter.folderIDs)}]},
			{roots: [{id: QHelper.inOrEqual(filter.rootIDs)}]},
		]);
		return result;

	}

}
