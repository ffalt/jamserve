import {FindOptions, OrderItem} from '../../modules/orm';
import {BaseRepository} from '../base/base.repository';
import {DBObjectType} from '../../types/enums';
import {MetaData} from './metadata';
import {User} from '../user/user';
import {DefaultOrderArgs} from '../base/base.args';

export class MetaDataRepository extends BaseRepository<MetaData, any, any> {
	objType = DBObjectType.metadata;

	buildOrder(_?: DefaultOrderArgs): Array<OrderItem> {
		return [];
	}

	async buildFilter(_?: any, __?: User): Promise<FindOptions<MetaData>> {
		return {};
	}

}
