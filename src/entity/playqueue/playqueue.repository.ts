import {FindOptions, OrderItem} from '../../modules/orm';
import {BaseRepository} from '../base/base.repository';
import {DBObjectType} from '../../types/enums';
import {PlayQueue} from './playqueue';
import {User} from '../user/user';
import {DefaultOrderArgs} from '../base/base.args';

export class PlayQueueRepository extends BaseRepository<PlayQueue, any, any> {
	objType = DBObjectType.playqueue;

	buildOrder(_?: DefaultOrderArgs): Array<OrderItem> {
		return [];
	}

	async buildFilter(_?: any, __?: User): Promise<FindOptions<PlayQueue>> {
		return {};
	}

}
