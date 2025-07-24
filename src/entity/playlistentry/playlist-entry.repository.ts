import { BaseRepository } from '../base/base.repository.js';
import { DBObjectType, PlaylistEntryOrderFields } from '../../types/enums.js';
import { PlaylistEntry } from './playlist-entry.js';
import { PlaylistEntryFilterArgs, PlaylistEntryOrderArgs } from './playlist-entry.args.js';
import { User } from '../user/user.js';
import { FindOptions, OrderItem, QHelper } from '../../modules/orm/index.js';
import { OrderHelper } from '../base/base.js';

export class PlaylistEntryRepository extends BaseRepository<PlaylistEntry, PlaylistEntryFilterArgs, PlaylistEntryOrderArgs> {
	objType = DBObjectType.playlistentry;

	buildOrder(order?: PlaylistEntryOrderArgs): Array<OrderItem> {
		const direction = OrderHelper.direction(order);
		switch (order?.orderBy) {
			case PlaylistEntryOrderFields.created: {
				return [['createdAt', direction]];
			}
			case PlaylistEntryOrderFields.updated: {
				return [['updatedAt', direction]];
			}
			case PlaylistEntryOrderFields.default:
			case PlaylistEntryOrderFields.position: {
				return [['position', direction]];
			}
		}
		return [];
	}

	async buildFilter(filter?: PlaylistEntryFilterArgs, __?: User): Promise<FindOptions<PlaylistEntry>> {
		if (!filter) {
			return {};
		}
		return QHelper.buildQuery<PlaylistEntry>([
			{ playlist: QHelper.inOrEqual(filter.playlistIDs) }
		]);
	}
}
