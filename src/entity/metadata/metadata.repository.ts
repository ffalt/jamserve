import {FindOptions, OrderItem} from '../../modules/orm';
import {BaseRepository} from '../base/base.repository';
import {DBObjectType} from '../../types/enums';
import {MetaData} from './metadata';
import {User} from '../user/user';
import {DefaultOrderArgs} from '../base/base.args';

export class MetaDataRepository extends BaseRepository<MetaData, void, DefaultOrderArgs> {
	objType = DBObjectType.metadata;

	buildOrder(_?: DefaultOrderArgs): Array<OrderItem> {
		return [];
	}

	async buildFilter(_?: void, __?: User): Promise<FindOptions<MetaData>> {
		return {};
	}

}
