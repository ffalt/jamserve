import {FindOptions, OrderItem} from '../../modules/orm/index.js';
import {BaseRepository} from '../base/base.repository.js';
import {DBObjectType} from '../../types/enums.js';
import {MetaData} from './metadata.js';
import {User} from '../user/user.js';
import {DefaultOrderArgs} from '../base/base.args.js';

export class MetaDataRepository extends BaseRepository<MetaData, void, DefaultOrderArgs> {
	objType = DBObjectType.metadata;

	buildOrder(_?: DefaultOrderArgs): Array<OrderItem> {
		return [];
	}

	async buildFilter(_?: void, __?: User): Promise<FindOptions<MetaData>> {
		return {};
	}

}
