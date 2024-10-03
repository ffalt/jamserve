import { InRequestScope } from 'typescript-ioc';
import { BaseTransformService } from '../base/base.transform.js';
import { Orm } from '../../modules/engine/services/orm.service.js';
import { PlayQueue as ORMPlayQueue } from './playqueue.js';
import { IncludesPlayQueueArgs } from './playqueue.args.js';
import { User } from '../user/user.js';
import { PlayQueueBase } from './playqueue.model.js';

@InRequestScope
export class PlayQueueTransformService extends BaseTransformService {
	async playQueueBase(orm: Orm, o: ORMPlayQueue, playQueueArgs: IncludesPlayQueueArgs, user: User): Promise<PlayQueueBase> {
		const u = o.user.id() === user.id ? user : await o.user.getOrFail();
		return {
			changed: o.updatedAt.valueOf(),
			changedBy: o.changedBy,
			created: o.createdAt.valueOf(),
			currentIndex: o.current,
			mediaPosition: o.position,
			userID: u.id,
			userName: u.name,
			entriesCount: await o.entries.count(),
			entriesIDs: playQueueArgs.playQueueEntriesIDs ? (await o.entries.getItems()).map(t => (t.track.id()) || (t.episode.id())) as Array<string> : undefined
		};
	}
}
