import {BaseRepository} from '../base/base.repository';
import {Tag} from './tag';
import {DBObjectType} from '../../types/enums';
import {User} from '../user/user';
import {FindOptions, OrderItem, QHelper} from '../../modules/orm';

// @Repository(Tag)
export class TagRepository extends BaseRepository<Tag, any, any> {
	objType = DBObjectType.tag;

	buildOrder(order?: any): Array<OrderItem> {
		//currently none
		return [];
	}

	async buildFilter(filter?: any, user?: User): Promise<FindOptions<Tag>> {
		//currently none
		return {};
	}

}
