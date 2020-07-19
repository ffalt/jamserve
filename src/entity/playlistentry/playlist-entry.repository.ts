import {QueryOrder, Repository} from 'mikro-orm';
import {BaseRepository} from '../base/base.repository';
import {DBObjectType, PlaylistEntryOrderFields} from '../../types/enums';
import {PlaylistEntry} from './playlist-entry';
import {QueryOrderMap} from 'mikro-orm/dist/query';
import {PlaylistEntryOrderArgs} from './playlist-entry.args';
import {User} from '../user/user';
import {QBFilterQuery} from 'mikro-orm/dist/typings';

@Repository(PlaylistEntry)
export class PlaylistEntryRepository extends BaseRepository<PlaylistEntry, any, PlaylistEntryOrderArgs> {
	objType = DBObjectType.playlistentry;

	applyOrderByEntry(result: QueryOrderMap, direction: QueryOrder, order?: PlaylistEntryOrderArgs): void {
		switch (order?.orderBy) {
			case PlaylistEntryOrderFields.created:
				result.createdAt = direction;
				break;
			case PlaylistEntryOrderFields.updated:
				result.updatedAt = direction;
				break;
			case PlaylistEntryOrderFields.default:
			case PlaylistEntryOrderFields.position:
				result.position = direction;
				break;
		}
	}

	async buildFilter(filter?: any, user?: User): Promise<QBFilterQuery<PlaylistEntry>> {
		return {};
	}

}
