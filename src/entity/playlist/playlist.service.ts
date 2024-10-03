import { Track } from '../track/track.js';
import { Playlist } from './playlist.js';
import { InRequestScope } from 'typescript-ioc';
import { Orm } from '../../modules/engine/services/orm.service.js';
import { PlaylistMutateArgs } from './playlist.args.js';
import { User } from '../user/user.js';
import { DBObjectType } from '../../types/enums.js';
import { Episode } from '../episode/episode.js';
import { Base } from '../base/base.js';
import {NotFoundError} from '../../modules/deco/express/express-error.js';

@InRequestScope
export class PlaylistService {
	private static async getDuration(media: { obj: Base; objType: DBObjectType }): Promise<number> {
		switch (media.objType) {
			case DBObjectType.episode: {
				const episodeTag = await (media.obj as Episode).tag.get();
				return (episodeTag?.mediaDuration || 0);
			}
			case DBObjectType.track: {
				const trackTag = await (media.obj as Track).tag.get();
				return (trackTag?.mediaDuration || 0);
			}
		}
		return 0;
	}

	async create(orm: Orm, args: PlaylistMutateArgs, user: User): Promise<Playlist> {
		const playlist: Playlist = orm.Playlist.create({
			name: args.name,
			comment: args.comment,
			isPublic: args.isPublic,
			changed: Date.now(),
			duration: 0
		});
		await playlist.user.set(user);
		const ids = args.mediaIDs || [];
		let position = 1;
		let duration = 0;
		for (const id of ids) {
			const media = await orm.findInStreamTypes(id);
			if (!media) {
				return Promise.reject(NotFoundError());
			}
			duration += await PlaylistService.getDuration(media);
			const entry = orm.PlaylistEntry.create({ position });
			await entry.playlist.set(playlist);
			await entry.track.set(media.objType === DBObjectType.track ? media.obj as Track : undefined);
			await entry.episode.set(media.objType === DBObjectType.episode ? media.obj as Episode : undefined);
			orm.PlaylistEntry.persistLater(entry);
			position++;
		}
		playlist.duration = duration;
		await orm.Playlist.persistAndFlush(playlist);
		return playlist;
	}

	private async updateEntries(orm: Orm, ids: Array<string>, args: PlaylistMutateArgs, playlist: Playlist): Promise<number> {
		const mediaList = await orm.findListInStreamTypes(ids);
		const oldEntries = (await playlist.entries.getItems()).sort((a, b) => b.position - a.position);
		let duration = 0;
		let position = 1;
		for (const media of mediaList) {
			let entry = oldEntries.pop();
			if (!entry) {
				entry = orm.PlaylistEntry.create({ position });
			}
			entry.position = position;
			await entry.playlist.set(playlist);
			await entry.track.set(media.objType === DBObjectType.track ? media.obj as Track : undefined);
			await entry.episode.set(media.objType === DBObjectType.episode ? media.obj as Episode : undefined);
			duration += await PlaylistService.getDuration(media);
			position++;
			orm.PlaylistEntry.persistLater(entry);
		}
		orm.PlaylistEntry.removeListLater(oldEntries);
		return duration;
	}

	async update(orm: Orm, args: PlaylistMutateArgs, playlist: Playlist): Promise<void> {
		playlist.name = (args.name !== undefined) ? args.name : playlist.name;
		playlist.isPublic = (args.isPublic !== undefined) ? args.isPublic : playlist.isPublic;
		playlist.comment = (args.comment !== undefined) ? args.comment : playlist.comment;
		playlist.duration = await this.updateEntries(orm, args.mediaIDs || [], args, playlist);
		orm.Playlist.persistLater(playlist);
		await orm.em.flush();
	}

	async remove(orm: Orm, playlist: Playlist): Promise<void> {
		await orm.Playlist.removeAndFlush(playlist);
	}
}
