import {FindOptions, OrderItem} from '../../modules/orm/index.js';
import {BaseRepository} from '../base/base.repository.js';
import {DBObjectType} from '../../types/enums.js';
import {PlayQueue} from './playqueue.js';
import {User} from '../user/user.js';
import {DefaultOrderArgs} from '../base/base.args.js';

export class PlayQueueRepository extends BaseRepository<PlayQueue, void, DefaultOrderArgs> {
	objType = DBObjectType.playqueue;

	buildOrder(_?: DefaultOrderArgs): Array<OrderItem> {
		return [];
	}

	async buildFilter(_?: void, __?: User): Promise<FindOptions<PlayQueue>> {
		return {};
	}

}
