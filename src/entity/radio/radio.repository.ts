import {QueryOrder, Repository} from 'mikro-orm';
import {BaseRepository} from '../base/base.repository';
import {DBObjectType} from '../../types/enums';
import {Radio} from './radio';
import {QueryOrderMap} from 'mikro-orm/dist/query';
import {User} from '../user/user';
import {QBFilterQuery} from 'mikro-orm/dist/typings';
import {RadioFilterArgs, RadioOrderArgs} from './radio.args';
import {QHelper} from '../base/base';

@Repository(Radio)
export class RadioRepository extends BaseRepository<Radio, RadioFilterArgs, RadioOrderArgs> {
	objType = DBObjectType.radio;
	indexProperty = 'name';

	public applyOrderByEntry(result: QueryOrderMap, direction: QueryOrder, order?: 	RadioOrderArgs): void {
	}

	async buildFilter(filter?: RadioFilterArgs, user?: User): Promise<QBFilterQuery<Radio>> {
		return filter ? QHelper.buildQuery<Radio>(
			[
				{id: filter.ids},
				{name: QHelper.like(filter.query)},
				{name: QHelper.eq(filter.name)},
				{url: QHelper.eq(filter.url)},
				{homepage: QHelper.eq(filter.homepage)},
				{disabled: QHelper.eq(filter.disabled)},
				{createdAt: QHelper.gte(filter.since)}
			]
		) : {};
	}
}
