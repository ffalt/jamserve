import {Track} from '../track/track';
import {Playlist} from './playlist';
import {Inject, Singleton} from 'typescript-ioc';
import {OrmService} from '../../modules/engine/services/orm.service';
import {PlaylistMutateArgs} from './playlist.args';
import {User} from '../user/user';
import {DBObjectType} from '../../types/enums';
import {NotFoundError} from '../../modules/rest/builder/express-error';
import {Episode} from '../episode/episode';
import {Base} from '../base/base';

@Singleton
export class PlaylistService {
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

	async create(args: PlaylistMutateArgs, user: User): Promise<Playlist> {
		const playlist: Playlist = this.orm.Playlist.create({
			name: args.name,
			comment: args.comment,
			isPublic: args.isPublic,
			user,
			changed: Date.now(),
			duration: 0
		});
		const ids = args.mediaIDs || [];
		let position = 1;
		let duration = 0;
		for (const id of ids) {
			const media = await this.orm.findInStreamTypes(id);
			if (!media) {
				return Promise.reject(NotFoundError());
			}
			duration += this.getDuration(media);
			const entry = this.orm.PlaylistEntry.create({
				position, playlist,
				track: media.objType === DBObjectType.track ? media.obj as Track : undefined,
				episode: media.objType === DBObjectType.episode ? media.obj as Episode : undefined
			});
			this.orm.PlaylistEntry.persistLater(entry);
			position++;
		}
		playlist.duration = duration;
		this.orm.Playlist.persistLater(playlist);
		await this.orm.orm.em.flush();
		return playlist;
	}

	async update(args: PlaylistMutateArgs, playlist: Playlist): Promise<void> {
		const ids = args.mediaIDs || [];
		const mediaList = [];
		for (const id of ids) {
			const media = await this.orm.findInStreamTypes(id);
			if (!media) {
				return Promise.reject(NotFoundError());
			}
			mediaList.push(media);
		}
		playlist.name = (args.name !== undefined) ? args.name : playlist.name;
		playlist.isPublic = (args.isPublic !== undefined) ? args.isPublic : playlist.isPublic;
		playlist.comment = (args.comment !== undefined) ? args.comment : playlist.comment;
		await this.orm.Playlist.populate(playlist, 'entries');
		const oldEntries = playlist.entries.getItems().sort((a, b) => b.position - a.position);
		let duration = 0;
		let position = 1;
		for (const media of mediaList) {
			let entry = oldEntries.pop();
			if (!entry) {
				entry = this.orm.PlaylistEntry.create({playlist, position});
			}
			entry.position = position;
			entry.track = media.objType === DBObjectType.track ? media.obj as Track : undefined;
			entry.episode = media.objType === DBObjectType.episode ? media.obj as Episode : undefined;
			duration += this.getDuration(media);
			position++;
			this.orm.PlaylistEntry.persistLater(entry);
		}
		playlist.duration = duration;
		for (const o of oldEntries) {
			this.orm.PlaylistEntry.removeLater(o);
		}
		this.orm.PlaylistEntry.persistLater(playlist);
		await this.orm.orm.em.flush();
	}

	async remove(playlist: Playlist): Promise<void> {
		await this.orm.Playlist.removeAndFlush(playlist);
	}
}
