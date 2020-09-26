import {InRequestScope} from 'typescript-ioc';
import {BaseTransformService} from '../base/base.transform';
import {Orm} from '../../modules/engine/services/orm.service';
import {Playlist as ORMPlaylist} from './playlist';
import {IncludesPlaylistArgs} from './playlist.args';
import {User} from '../user/user';
import {PlaylistBase, PlaylistIndex} from './playlist.model';
import {DBObjectType} from '../../types/enums';
import {IndexResult, IndexResultGroup} from '../base/base';

@InRequestScope
export class PlaylistTransformService extends BaseTransformService {

	async playlistBase(orm: Orm, o: ORMPlaylist, playlistArgs: IncludesPlaylistArgs, user: User): Promise<PlaylistBase> {
		const u = await o.user.getOrFail();
		const entries = playlistArgs.playlistIncEntriesIDs || playlistArgs.playlistIncEntries ? await o.entries.getItems() : [];
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
			entriesIDs: playlistArgs.playlistIncEntriesIDs ? entries.map(t => (t.track.id()) || (t.episode.id())) as Array<string> : undefined,
			state: playlistArgs.playlistIncState ? await this.state(orm, o.id, DBObjectType.playlist, user.id) : undefined
		};
	}

	async playlistIndex(orm: Orm, result: IndexResult<IndexResultGroup<ORMPlaylist>>): Promise<PlaylistIndex> {
		return this.index(result, async (item) => {
			return {
				id: item.id,
				name: item.name,
				entryCount: await item.entries.count()
			};
		});
	}

}
