import { BaseRepository } from '../base/base.repository.js';
import { DBObjectType } from '../../types/enums.js';
import { Series } from './series.js';
import { User } from '../user/user.js';
import { SeriesFilterParameters, SeriesOrderParameters } from './series.parameters.js';
import { QHelper } from '../../modules/orm/index.js';
import { FindOptions, OrderItem } from 'sequelize';

export class SeriesRepository extends BaseRepository<Series, SeriesFilterParameters, SeriesOrderParameters> {
	objType = DBObjectType.series;
	indexProperty = 'name';

	buildOrder(order?: SeriesOrderParameters): Array<OrderItem> {
		return this.buildDefaultOrder(order);
	}

	async buildFilter(filter?: SeriesFilterParameters, _?: User): Promise<FindOptions<Series>> {
		if (!filter) {
			return {};
		}
		const result = QHelper.buildQuery<Series>(
			[
				{ id: filter.ids },
				{ name: QHelper.like(filter.query, this.em.dialect) },
				{ name: QHelper.eq(filter.name) },
				{ createdAt: QHelper.gte(filter.since) },
				{ artist: QHelper.inOrEqual(filter.artistIDs) },
				...QHelper.inStringArray('albumTypes', filter.albumTypes)
			]
		);
		result.include = QHelper.includeQueries([
			{ tracks: [{ id: QHelper.inOrEqual(filter.trackIDs) }] },
			{ albums: [{ id: QHelper.inOrEqual(filter.albumIDs) }] },
			{ folders: [{ id: QHelper.inOrEqual(filter.folderIDs) }] },
			{ roots: [{ id: QHelper.inOrEqual(filter.rootIDs) }] },
			{ genres: [{ id: QHelper.inOrEqual(filter.genreIDs) }] }
		]);
		return result;
	}
}
