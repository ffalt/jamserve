import {QueryOrder, Repository} from 'mikro-orm';
import {BaseRepository} from '../base/base.repository';
import {DBObjectType} from '../../types/enums';
import {PlayQueue} from './playqueue';
import {QueryOrderMap} from 'mikro-orm/dist/query';
import {User} from '../user/user';
import {QBFilterQuery} from 'mikro-orm/dist/typings';

@Repository(PlayQueue)
export class PlayQueueRepository extends BaseRepository<PlayQueue, any, any> {
	objType = DBObjectType.playqueue;

	applyOrderByEntry(result: QueryOrderMap, direction: QueryOrder, order?: any): void {
	}

	async buildFilter(filter?: any, user?: User): Promise<QBFilterQuery<PlayQueue>> {
		return {};
	}

}
