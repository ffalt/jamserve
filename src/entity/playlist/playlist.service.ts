import { Track } from '../track/track.js';
import { Playlist } from './playlist.js';
import { InRequestScope } from 'typescript-ioc';
import { Orm } from '../../modules/engine/services/orm.service.js';
import { PlaylistMutateParameters } from './playlist.parameters.js';
import { User } from '../user/user.js';
import { DBObjectType } from '../../types/enums.js';
import { Episode } from '../episode/episode.js';
import { Base } from '../base/base.js';
import { notFoundError } from '../../modules/deco/express/express-error.js';

@InRequestScope
export class PlaylistService {
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

	async create(orm: Orm, parameters: PlaylistMutateParameters, user: User): Promise<Playlist> {
		const playlist: Playlist = orm.Playlist.create({
			name: parameters.name,
			comment: parameters.comment,
			isPublic: parameters.isPublic,
			changed: Date.now(),
			duration: 0
		});
		await playlist.user.set(user);
		await orm.Playlist.persistAndFlush(playlist);
		const ids = parameters.mediaIDs ?? [];
		if (ids.length === 0) {
			return playlist;
		}
		let position = 1;
		let duration = 0;
		for (const id of ids) {
			const media = await orm.findInStreamTypes(id);
			if (!media) {
				return Promise.reject(notFoundError());
			}
			duration += await PlaylistService.getDuration(media);
			const entry = orm.PlaylistEntry.create({ position });
			await entry.playlist.set(playlist);
			await entry.track.set(media.objType === DBObjectType.track ? media.obj as Track : undefined);
			await entry.episode.set(media.objType === DBObjectType.episode ? media.obj as Episode : undefined);
			orm.PlaylistEntry.persistLater(entry);
			position++;
		}
		await orm.PlaylistEntry.flush();
		playlist.duration = duration;
		await orm.Playlist.persistAndFlush(playlist);
		return playlist;
	}

	private async updateEntries(orm: Orm, ids: Array<string>, _parameters: PlaylistMutateParameters, playlist: Playlist): Promise<number> {
		const mediaList = await orm.findListInStreamTypes(ids);
		const entries = await playlist.entries.getItems();
		const oldEntries = entries.sort((a, b) => b.position - a.position);
		let duration = 0;
		let position = 1;
		for (const media of mediaList) {
			let entry = oldEntries.pop();
			entry ??= orm.PlaylistEntry.create({ position });
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

	async update(orm: Orm, parameters: PlaylistMutateParameters, playlist: Playlist): Promise<void> {
		playlist.name = parameters.name ?? playlist.name;
		playlist.isPublic = parameters.isPublic ?? playlist.isPublic;
		playlist.comment = parameters.comment ?? playlist.comment;
		playlist.duration = await this.updateEntries(orm, parameters.mediaIDs ?? [], parameters, playlist);
		orm.Playlist.persistLater(playlist);
		await orm.em.flush();
	}

	async remove(orm: Orm, playlist: Playlist): Promise<void> {
		await orm.Playlist.removeAndFlush(playlist);
	}
}
