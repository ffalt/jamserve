import { BaseRepository } from '../base/base.repository.js';
import { DBObjectType } from '../../types/enums.js';
import { Root } from './root.js';
import { DefaultOrderParameters } from '../base/base.parameters.js';
import { User } from '../user/user.js';
import { RootFilterParameters, RootOrderParameters } from './root.parameters.js';
import { QHelper } from '../../modules/orm/index.js';
import { FindOptions, OrderItem } from 'sequelize';

export class RootRepository extends BaseRepository<Root, RootFilterParameters, RootOrderParameters> {
	objType = DBObjectType.root;
	indexProperty = 'name';

	buildOrder(order?: DefaultOrderParameters): Array<OrderItem> {
		return this.buildDefaultOrder(order);
	}

	async buildFilter(filter?: RootFilterParameters, _?: User): Promise<FindOptions<Root>> {
		if (!filter) {
			return {};
		}
		const result = QHelper.buildQuery<Root>(
			[
				{ id: filter.ids },
				{ name: QHelper.like(filter.query, this.em.dialect) },
				{ name: QHelper.eq(filter.name) },
				{ createdAt: QHelper.gte(filter.since) },
				{ strategy: QHelper.inOrEqual(filter.strategies) }
			]
		);
		result.include = QHelper.includeQueries([
			{ tracks: [{ id: QHelper.inOrEqual(filter.trackIDs) }] },
			{ folders: [{ id: QHelper.inOrEqual(filter.folderIDs) }] },
			{ albums: [{ id: QHelper.inOrEqual(filter.albumIDs) }] },
			{ artists: [{ id: QHelper.inOrEqual(filter.artistIDs) }] },
			{ series: [{ id: QHelper.inOrEqual(filter.seriesIDs) }] }
		]);
		return result;
	}
}
