import {FindOptions, OrderItem} from '../../modules/orm';
import {BaseRepository} from '../base/base.repository';
import {DBObjectType} from '../../types/enums';
import {PlayQueueEntry} from './playqueue-entry';
import {User} from '../user/user';

export class PlayQueueEntryRepository extends BaseRepository<PlayQueueEntry, any, any> {
	objType = DBObjectType.playqueueentry;

	buildOrder(order?: any): Array<OrderItem> {
		//currently none
		return [];
	}

	async buildFilter(filter?: any, user?: User): Promise<FindOptions<PlayQueueEntry>> {
		//currently none
		return {};
	}
}
