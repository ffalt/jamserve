import {Track} from '../track/track';
import {Playlist} from './playlist';
import {InRequestScope} from 'typescript-ioc';
import {Orm} from '../../modules/engine/services/orm.service';
import {PlaylistMutateArgs} from './playlist.args';
import {User} from '../user/user';
import {DBObjectType} from '../../types/enums';
import {NotFoundError} from '../../modules/rest/builder/express-error';
import {Episode} from '../episode/episode';
import {Base} from '../base/base';

@InRequestScope
export class PlaylistService {

	private async getDuration(media: { obj: Base; objType: DBObjectType }): Promise<number> {
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
			duration += await this.getDuration(media);
			const entry = orm.PlaylistEntry.create({position});
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

	async update(orm: Orm, args: PlaylistMutateArgs, playlist: Playlist): Promise<void> {
		const ids = args.mediaIDs || [];
		const mediaList = [];
		for (const id of ids) {
			const media = await orm.findInStreamTypes(id);
			if (!media) {
				return Promise.reject(NotFoundError());
			}
			mediaList.push(media);
		}
		playlist.name = (args.name !== undefined) ? args.name : playlist.name;
		playlist.isPublic = (args.isPublic !== undefined) ? args.isPublic : playlist.isPublic;
		playlist.comment = (args.comment !== undefined) ? args.comment : playlist.comment;
		const oldEntries = (await playlist.entries.getItems()).sort((a, b) => b.position - a.position);
		let duration = 0;
		let position = 1;
		for (const media of mediaList) {
			let entry = oldEntries.pop();
			if (!entry) {
				entry = orm.PlaylistEntry.create({position});
			}
			entry.position = position;
			await entry.playlist.set(playlist);
			await entry.track.set(media.objType === DBObjectType.track ? media.obj as Track : undefined);
			await entry.episode.set(media.objType === DBObjectType.episode ? media.obj as Episode : undefined);
			duration += await this.getDuration(media);
			position++;
			orm.PlaylistEntry.persistLater(entry);
		}
		playlist.duration = duration;
		for (const o of oldEntries) {
			orm.PlaylistEntry.removeLater(o);
		}
		orm.Playlist.persistLater(playlist);
		await orm.em.flush();
	}

	async remove(orm: Orm, playlist: Playlist): Promise<void> {
		await orm.Playlist.removeAndFlush(playlist);
	}
}
