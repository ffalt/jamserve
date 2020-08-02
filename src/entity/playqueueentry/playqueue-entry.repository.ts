import {FindOptions, OrderItem} from '../../modules/orm';
import {BaseRepository} from '../base/base.repository';
import {DBObjectType, PlayQueueEntryOrderFields} from '../../types/enums';
import {PlayQueueEntry} from './playqueue-entry';
import {User} from '../user/user';
import {PlayQueueEntryOrderArgs} from './playqueue-entry.args';
import {OrderHelper} from '../base/base';

export class PlayQueueEntryRepository extends BaseRepository<PlayQueueEntry, any, any> {
	objType = DBObjectType.playqueueentry;

	buildOrder(order?: PlayQueueEntryOrderArgs): Array<OrderItem> {
		const direction = OrderHelper.direction(order);
		switch (order?.orderBy) {
			case PlayQueueEntryOrderFields.created:
				return [['createdAt', direction]];
			case PlayQueueEntryOrderFields.updated:
				return [['updatedAt', direction]];
			case PlayQueueEntryOrderFields.default:
			case PlayQueueEntryOrderFields.position:
				return [['position', direction]];
		}
		return [];
	}

	async buildFilter(filter?: any, user?: User): Promise<FindOptions<PlayQueueEntry>> {
		return {};
	}
}
