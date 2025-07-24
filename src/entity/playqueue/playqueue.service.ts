import { Track } from '../track/track.js';
import { InRequestScope } from 'typescript-ioc';
import { Orm } from '../../modules/engine/services/orm.service.js';
import { User } from '../user/user.js';
import { DBObjectType } from '../../types/enums.js';
import { Episode } from '../episode/episode.js';
import { Base } from '../base/base.js';
import { PlayQueueSetArgs } from './playqueue.args.js';
import { PlayQueue } from './playqueue.js';
import { notFoundError } from '../../modules/deco/express/express-error.js';

@InRequestScope
export class PlayQueueService {
	private static async getDuration(media: { obj: Base; objType: DBObjectType }): Promise<number> {
		switch (media.objType) {
			case DBObjectType.episode: {
				const episodeTag = await (media.obj as Episode).tag.get();
				return (episodeTag?.mediaDuration ?? 0);
			}
			case DBObjectType.track: {
				const trackTag = await (media.obj as Track).tag.get();
				return (trackTag?.mediaDuration ?? 0);
			}
		}
		return 0;
	}

	async get(orm: Orm, user: User): Promise<PlayQueue> {
		let queue = await orm.PlayQueue.findOne({ where: { user: user.id } });
		if (!queue) {
			queue = orm.PlayQueue.create({});
			await queue.user.set(user);
		}
		return queue;
	}

	async set(orm: Orm, args: PlayQueueSetArgs, user: User, client: string): Promise<void> {
		let queue = await orm.PlayQueue.findOne({ where: { user: user.id } });
		if (!queue) {
			queue = orm.PlayQueue.create({});
			await queue.user.set(user);
		}
		queue.changedBy = client;
		const ids = args.mediaIDs || [];
		const mediaList = [];
		for (const id of ids) {
			const media = await orm.findInStreamTypes(id);
			if (!media) {
				return Promise.reject(notFoundError());
			}
			mediaList.push(media);
		}
		const entries = await queue.entries.getItems();
		const oldEntries = entries.sort((a, b) => b.position - a.position);
		let duration = 0;
		let position = 1;
		for (const media of mediaList) {
			let entry = oldEntries.pop();
			if (!entry) {
				entry = orm.PlayQueueEntry.create({ playlist: queue, position });
			}
			entry.position = position;
			await entry.track.set(media.objType === DBObjectType.track ? media.obj as Track : undefined);
			await entry.episode.set(media.objType === DBObjectType.episode ? media.obj as Episode : undefined);
			duration += await PlayQueueService.getDuration(media);
			position++;
			orm.PlayQueueEntry.persistLater(entry);
		}
		queue.duration = duration;
		for (const o of oldEntries) {
			orm.PlayQueueEntry.removeLater(o);
		}
		orm.PlayQueue.persistLater(queue);
		await orm.em.flush();
	}

	async clear(orm: Orm, user: User): Promise<void> {
		await orm.PlayQueue.removeByQueryAndFlush({ where: { user: user.id } });
	}
}
