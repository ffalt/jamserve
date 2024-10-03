import { BaseRepository } from '../base/base.repository.js';
import { DBObjectType } from '../../types/enums.js';
import { Playlist } from './playlist.js';
import { User } from '../user/user.js';
import { PlaylistFilterArgs, PlaylistOrderArgs } from './playlist.args.js';
import { FindOptions, OrderItem, QHelper } from '../../modules/orm/index.js';

// @Repository(Playlist)
export class PlaylistRepository extends BaseRepository<Playlist, PlaylistFilterArgs, PlaylistOrderArgs> {
	objType = DBObjectType.playlist;
	indexProperty = 'name';

	buildOrder(order?: PlaylistOrderArgs): Array<OrderItem> {
		return this.buildDefaultOrder(order);
	}

	async buildFilter(filter?: PlaylistFilterArgs, user?: User): Promise<FindOptions<Playlist>> {
		return filter ?
			QHelper.buildQuery<Playlist>(
				[
					{ id: filter.ids },
					{ name: QHelper.like(filter.query, this.em.dialect) },
					{ name: QHelper.eq(filter.name) },
					{ comment: QHelper.eq(filter.comment) },
					{ createdAt: QHelper.gte(filter.since) },
					{ user: QHelper.inOrEqual(filter.userIDs) },
					QHelper.or([
						{ isPublic: true },
						{ user: user?.id }
					])
				]
			) :
				{};
	}
}
