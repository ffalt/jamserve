import {BaseRepository} from '../base/base.repository';
import {DBObjectType} from '../../types/enums';
import {Playlist} from './playlist';
import {User} from '../user/user';
import {PlaylistFilterArgs, PlaylistOrderArgs} from './playlist.args';
import {FindOptions, OrderItem, QHelper} from '../../modules/orm';

// @Repository(Playlist)
export class PlaylistRepository extends BaseRepository<Playlist, PlaylistFilterArgs, PlaylistOrderArgs> {
	objType = DBObjectType.playlist;
	indexProperty = 'name';

	buildOrder(order?: PlaylistOrderArgs): Array<OrderItem> {
		return this.buildDefaultOrder(order);
	}

	async buildFilter(filter?: PlaylistFilterArgs, user?: User): Promise<FindOptions<Playlist>> {
		return filter ? QHelper.buildQuery<Playlist>(
			[
				{id: filter.ids},
				{name: QHelper.like(filter.query, this.em.dialect)},
				{name: QHelper.eq(filter.name)},
				{comment: QHelper.eq(filter.comment)},
				{createdAt: QHelper.gte(filter.since)},
				{user: QHelper.inOrEqual(filter.userIDs)},
				QHelper.or([
					{isPublic: true},
					{user: user?.id}
				])
			]
		) : {};
	}
}
