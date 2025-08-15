import { BaseRepository } from '../base/base.repository.js';
import { DBObjectType, PlayQueueEntryOrderFields } from '../../types/enums.js';
import { PlayQueueEntry } from './playqueue-entry.js';
import { User } from '../user/user.js';
import { PlayQueueEntryOrderParameters } from './playqueue-entry.parameters.js';
import { OrderHelper } from '../base/base.js';
import { FindOptions, OrderItem } from 'sequelize';

export class PlayQueueEntryRepository extends BaseRepository<PlayQueueEntry, void, PlayQueueEntryOrderParameters> {
	objType = DBObjectType.playqueueentry;

	buildOrder(order?: PlayQueueEntryOrderParameters): Array<OrderItem> {
		const direction = OrderHelper.direction(order);
		switch (order?.orderBy) {
			case PlayQueueEntryOrderFields.created: {
				return [['createdAt', direction]];
			}
			case PlayQueueEntryOrderFields.updated: {
				return [['updatedAt', direction]];
			}
			case PlayQueueEntryOrderFields.default:
			case PlayQueueEntryOrderFields.position: {
				return [['position', direction]];
			}
		}
		return [];
	}

	async buildFilter(_?: unknown, __?: User): Promise<FindOptions<PlayQueueEntry>> {
		return {};
	}
}
