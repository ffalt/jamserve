import {QueryOrder, QueryOrderMap} from '../../modules/orm';
import {BaseRepository} from '../base/base.repository';
import {DBObjectType} from '../../types/enums';
import {PlayQueue} from './playqueue';
import {User} from '../user/user';
import {FindOptions, OrderItem, QHelper} from '../../modules/orm';

// @Repository(PlayQueue)
export class PlayQueueRepository extends BaseRepository<PlayQueue, any, any> {
	objType = DBObjectType.playqueue;

	buildOrder(order?: any): Array<OrderItem> {
		//currently none
		return [];
	}

	async buildFilter(filter?: any, user?: User): Promise<FindOptions<PlayQueue>> {
		//currently none
		return {};
	}

}
