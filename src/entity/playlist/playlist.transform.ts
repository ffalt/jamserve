import { InRequestScope } from 'typescript-ioc';
import { BaseTransformService } from '../base/base.transform.js';
import { Orm } from '../../modules/engine/services/orm.service.js';
import { Playlist as ORMPlaylist } from './playlist.js';
import { IncludesPlaylistParameters } from './playlist.parameters.js';
import { User } from '../user/user.js';
import { PlaylistBase, PlaylistIndex } from './playlist.model.js';
import { DBObjectType } from '../../types/enums.js';
import { IndexResult, IndexResultGroup } from '../base/base.js';

@InRequestScope
export class PlaylistTransformService extends BaseTransformService {
	async playlistBase(orm: Orm, o: ORMPlaylist, playlistParameters: IncludesPlaylistParameters, user: User): Promise<PlaylistBase> {
		const u = await o.user.getOrFail();
		const entries = playlistParameters.playlistIncEntriesIDs || playlistParameters.playlistIncEntries ? await o.entries.getItems() : [];
		let entriesIDs: Array<string> | undefined = undefined;
		if (playlistParameters.playlistIncEntriesIDs) {
			entriesIDs = entries.map(t => (t.track.id()) ?? (t.episode.id())).filter(id => id !== undefined);
		}
		return {
			id: o.id,
			name: o.name,
			changed: o.updatedAt.valueOf(),
			duration: o.duration,
			created: o.createdAt.valueOf(),
			isPublic: o.isPublic,
			comment: o.comment,
			userID: u.id,
			userName: u.name,
			entriesCount: await o.entries.count(),
			entriesIDs,
			state: playlistParameters.playlistIncState ? await this.state(orm, o.id, DBObjectType.playlist, user.id) : undefined
		};
	}

	async playlistIndex(_orm: Orm, result: IndexResult<IndexResultGroup<ORMPlaylist>>): Promise<PlaylistIndex> {
		return this.index(result, async item => {
			return {
				id: item.id,
				name: item.name,
				entryCount: await item.entries.count()
			};
		});
	}
}
