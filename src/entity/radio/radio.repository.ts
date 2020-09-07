import {BaseRepository} from '../base/base.repository';
import {DBObjectType} from '../../types/enums';
import {Radio} from './radio';
import {User} from '../user/user';
import {RadioFilterArgs, RadioOrderArgs} from './radio.args';
import {FindOptions, OrderItem, QHelper} from '../../modules/orm';

// @Repository(Radio)
export class RadioRepository extends BaseRepository<Radio, RadioFilterArgs, RadioOrderArgs> {
	objType = DBObjectType.radio;
	indexProperty = 'name';

	buildOrder(order?: RadioOrderArgs): Array<OrderItem> {
		return this.buildDefaultOrder(order);
	}

	async buildFilter(filter?: RadioFilterArgs, _?: User): Promise<FindOptions<Radio>> {
		return filter ? QHelper.buildQuery<Radio>(
			[
				{id: filter.ids},
				{name: QHelper.ilike(filter.query)},
				{name: QHelper.eq(filter.name)},
				{url: QHelper.eq(filter.url)},
				{homepage: QHelper.eq(filter.homepage)},
				{disabled: QHelper.eq(filter.disabled)},
				{createdAt: QHelper.gte(filter.since)}
			]
		) : {};
	}
}
