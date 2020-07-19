import {QueryOrder, Repository} from 'mikro-orm';
import {BaseRepository} from '../base/base.repository';
import {DBObjectType} from '../../types/enums';
import {PlayQueueEntry} from './playqueue-entry';
import {QueryOrderMap} from 'mikro-orm/dist/query';
import {User} from '../user/user';
import {QBFilterQuery} from 'mikro-orm/dist/typings';

@Repository(PlayQueueEntry)
export class PlayQueueEntryRepository extends BaseRepository<PlayQueueEntry, any, any> {
	objType = DBObjectType.playqueueentry;

	applyOrderByEntry(result: QueryOrderMap, direction: QueryOrder, order?: any): void {
		//currently none
	}

	async buildFilter(filter?: any, user?: User): Promise<QBFilterQuery<PlayQueueEntry>> {
		//currently none
		return {};
	}
}
