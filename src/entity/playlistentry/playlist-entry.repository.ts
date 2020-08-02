import {BaseRepository} from '../base/base.repository';
import {DBObjectType, PlaylistEntryOrderFields} from '../../types/enums';
import {PlaylistEntry} from './playlist-entry';
import {PlaylistEntryOrderArgs} from './playlist-entry.args';
import {User} from '../user/user';
import {FindOptions, OrderItem} from '../../modules/orm';
import {OrderHelper} from '../base/base';

export class PlaylistEntryRepository extends BaseRepository<PlaylistEntry, any, PlaylistEntryOrderArgs> {
	objType = DBObjectType.playlistentry;

	buildOrder(order?: PlaylistEntryOrderArgs): Array<OrderItem> {
		const direction = OrderHelper.direction(order);
		switch (order?.orderBy) {
			case PlaylistEntryOrderFields.created:
				return [['createdAt', direction]];
			case PlaylistEntryOrderFields.updated:
				return [['updatedAt', direction]];
			case PlaylistEntryOrderFields.default:
			case PlaylistEntryOrderFields.position:
				return [['position', direction]];
		}
		return [];
	}

	async buildFilter(_?: any, __?: User): Promise<FindOptions<PlaylistEntry>> {
		return {};
	}

}
