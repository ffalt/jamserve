import {BaseRepository} from '../base/base.repository';
import {Tag} from './tag';
import {DBObjectType} from '../../types/enums';
import {User} from '../user/user';
import {FindOptions, OrderItem} from '../../modules/orm';

export class TagRepository extends BaseRepository<Tag, any, any> {
	objType = DBObjectType.tag;

	buildOrder(_?: any): Array<OrderItem> {
		return [];
	}

	async buildFilter(_?: any, __?: User): Promise<FindOptions<Tag>> {
		return {};
	}

}
