import { BaseRepository } from '../base/base.repository.js';
import { DBObjectType } from '../../types/enums.js';
import { Radio } from './radio.js';
import { User } from '../user/user.js';
import { RadioFilterParameters, RadioOrderParameters } from './radio.parameters.js';
import { QHelper } from '../../modules/orm/index.js';
import { FindOptions, OrderItem } from 'sequelize';

export class RadioRepository extends BaseRepository<Radio, RadioFilterParameters, RadioOrderParameters> {
	objType = DBObjectType.radio;
	indexProperty = 'name';

	buildOrder(order?: RadioOrderParameters): Array<OrderItem> {
		return this.buildDefaultOrder(order);
	}

	async buildFilter(filter?: RadioFilterParameters, _?: User): Promise<FindOptions<Radio>> {
		return filter ?
			QHelper.buildQuery<Radio>(
				[
					{ id: filter.ids },
					{ name: QHelper.like(filter.query, this.em.dialect) },
					{ name: QHelper.eq(filter.name) },
					{ url: QHelper.eq(filter.url) },
					{ homepage: QHelper.eq(filter.homepage) },
					{ disabled: QHelper.eq(filter.disabled) },
					{ createdAt: QHelper.gte(filter.since) }
				]
			) :
			{};
	}
}
