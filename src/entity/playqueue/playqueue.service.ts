import {Track} from '../track/track';
import {Inject, Singleton} from 'typescript-ioc';
import {OrmService} from '../../modules/engine/services/orm.service';
import {User} from '../user/user';
import {DBObjectType} from '../../types/enums';
import {NotFoundError} from '../../modules/rest/builder/express-error';
import {Episode} from '../episode/episode';
import {Base} from '../base/base';
import {PlayQueueSetArgs} from './playqueue.args';
import {PlayQueue} from './playqueue';

@Singleton
export class PlayQueueService {
	@Inject
	orm!: OrmService;

	private getDuration(media: { obj: Base; objType: DBObjectType }): number {
		switch (media.objType) {
			case DBObjectType.episode:
				return ((media.obj as Episode).tag?.mediaDuration || 0)
			case DBObjectType.track:
				return ((media.obj as Track).tag?.mediaDuration || 0)
		}
		return 0;
	}

	async get(user: User): Promise<PlayQueue> {
		let queue = await this.orm.PlayQueue.findOne({user: user.id})
		if (!queue) {
			queue = this.orm.PlayQueue.create({user});
		}
		return queue;
	}

	async set(args: PlayQueueSetArgs, user: User, client: string): Promise<void> {
		let queue = await this.orm.PlayQueue.findOne({user: user.id})
		if (!queue) {
			queue = this.orm.PlayQueue.create({user});
		}
		queue.changedBy = client;
		const ids = args.mediaIDs || [];
		const mediaList = [];
		for (const id of ids) {
			const media = await this.orm.findInStreamTypes(id);
			if (!media) {
				return Promise.reject(NotFoundError());
			}
			mediaList.push(media);
		}
		const oldEntries = queue.entries.getItems().sort((a, b) => b.position - a.position);
		let duration = 0;
		let position = 1;
		for (const media of mediaList) {
			let entry = oldEntries.pop();
			if (!entry) {
				entry = this.orm.PlayQueueEntry.create({playlist: queue, position});
			}
			entry.position = position;
			entry.track = media.objType === DBObjectType.track ? media.obj as Track : undefined;
			entry.episode = media.objType === DBObjectType.episode ? media.obj as Episode : undefined;
			duration += this.getDuration(media);
			position++;
			this.orm.PlayQueueEntry.persistLater(entry);
		}
		queue.duration = duration;
		for (const o of oldEntries) {
			this.orm.PlayQueueEntry.removeLater(o);
		}
		this.orm.PlayQueue.persistLater(queue);
		await this.orm.orm.em.flush();
	}

	async clear(user: User): Promise<void> {
		await this.orm.PlayQueue.remove({user: user.id});
	}
}
