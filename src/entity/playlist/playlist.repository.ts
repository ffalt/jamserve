import {QueryOrder, Repository} from 'mikro-orm';
import {BaseRepository} from '../base/base.repository';
import {DBObjectType} from '../../types/enums';
import {QBFilterQuery} from 'mikro-orm/dist/typings';
import {QHelper} from '../base/base';
import {Playlist} from './playlist';
import {QueryOrderMap} from 'mikro-orm/dist/query';
import {User} from '../user/user';
import {PlaylistFilterArgs, PlaylistOrderArgs} from './playlist.args';

@Repository(Playlist)
export class PlaylistRepository extends BaseRepository<Playlist, PlaylistFilterArgs, PlaylistOrderArgs> {
	objType = DBObjectType.playlist;
	indexProperty = 'name';

	applyOrderByEntry(result: QueryOrderMap, direction: QueryOrder, order?: PlaylistOrderArgs): void {
		this.applyDefaultOrderByEntry(result, direction, order?.orderBy);
	}

	async buildFilter(filter?: PlaylistFilterArgs, user?: User): Promise<QBFilterQuery<Playlist>> {
		return filter ? QHelper.buildQuery<Playlist>(
			[
				{id: filter.ids},
				{name: QHelper.like(filter.query)},
				{name: QHelper.eq(filter.name)},
				{comment: QHelper.eq(filter.comment)},
				{createdAt: QHelper.gte(filter.since)},
				{user: QHelper.foreignKey(filter.userIDs)},
				{
					$or: QHelper.buildBool([
						{isPublic: QHelper.eq(true)},
						{user: user?.id}
					])
				}
			]
		) : {};
	}
}
