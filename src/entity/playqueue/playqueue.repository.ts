import { BaseRepository } from '../base/base.repository.js';
import { DBObjectType } from '../../types/enums.js';
import { PlayQueue } from './playqueue.js';
import { User } from '../user/user.js';
import { DefaultOrderParameters } from '../base/base.parameters.js';
import { FindOptions, OrderItem } from 'sequelize';

export class PlayQueueRepository extends BaseRepository<PlayQueue, void, DefaultOrderParameters> {
	objType = DBObjectType.playqueue;

	buildOrder(_?: DefaultOrderParameters): Array<OrderItem> {
		return [];
	}

	async buildFilter(_?: unknown, __?: User): Promise<FindOptions<PlayQueue>> {
		return {};
	}
}
