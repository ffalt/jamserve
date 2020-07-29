import {FindOptions, OrderItem} from '../../modules/orm';
import {BaseRepository} from '../base/base.repository';
import {DBObjectType} from '../../types/enums';
import {MetaData} from './metadata';
import {User} from '../user/user';

export class MetaDataRepository extends BaseRepository<MetaData, any, any> {
	objType = DBObjectType.metadata;

	buildOrder(order?: any): Array<OrderItem> {
		//currently none
		return [];
	}

	async buildFilter(filter?: any, user?: User): Promise<FindOptions<MetaData>> {
		//currently none
		return {};
	}

}
