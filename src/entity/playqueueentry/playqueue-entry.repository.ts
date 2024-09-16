import {FindOptions, OrderItem} from '../../modules/orm/index.js';
import {BaseRepository} from '../base/base.repository.js';
import {DBObjectType, PlayQueueEntryOrderFields} from '../../types/enums.js';
import {PlayQueueEntry} from './playqueue-entry.js';
import {User} from '../user/user.js';
import {PlayQueueEntryOrderArgs} from './playqueue-entry.args.js';
import {OrderHelper} from '../base/base.js';

export class PlayQueueEntryRepository extends BaseRepository<PlayQueueEntry, void, PlayQueueEntryOrderArgs> {
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

	async buildFilter(_?: void, __?: User): Promise<FindOptions<PlayQueueEntry>> {
		return {};
	}
}
