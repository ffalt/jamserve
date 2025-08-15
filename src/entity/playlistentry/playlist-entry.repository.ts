import { BaseRepository } from '../base/base.repository.js';
import { DBObjectType, PlaylistEntryOrderFields } from '../../types/enums.js';
import { PlaylistEntry } from './playlist-entry.js';
import { PlaylistEntryFilterParameters, PlaylistEntryOrderParameters } from './playlist-entry.parameters.js';
import { User } from '../user/user.js';
import { QHelper } from '../../modules/orm/index.js';
import { OrderHelper } from '../base/base.js';
import { FindOptions, OrderItem } from 'sequelize';

export class PlaylistEntryRepository extends BaseRepository<PlaylistEntry, PlaylistEntryFilterParameters, PlaylistEntryOrderParameters> {
	objType = DBObjectType.playlistentry;

	buildOrder(order?: PlaylistEntryOrderParameters): Array<OrderItem> {
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

	async buildFilter(filter?: PlaylistEntryFilterParameters, __?: User): Promise<FindOptions<PlaylistEntry>> {
		if (!filter) {
			return {};
		}
		return QHelper.buildQuery<PlaylistEntry>([
			{ playlist: QHelper.inOrEqual(filter.playlistIDs) }
		]);
	}
}
