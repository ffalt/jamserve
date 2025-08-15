import { BaseRepository } from '../base/base.repository.js';
import { DBObjectType } from '../../types/enums.js';
import { Playlist } from './playlist.js';
import { User } from '../user/user.js';
import { PlaylistFilterParameters, PlaylistOrderParameters } from './playlist.parameters.js';
import { QHelper } from '../../modules/orm/index.js';
import { FindOptions, OrderItem } from 'sequelize';

export class PlaylistRepository extends BaseRepository<Playlist, PlaylistFilterParameters, PlaylistOrderParameters> {
	objType = DBObjectType.playlist;
	indexProperty = 'name';

	buildOrder(order?: PlaylistOrderParameters): Array<OrderItem> {
		return this.buildDefaultOrder(order);
	}

	async buildFilter(filter?: PlaylistFilterParameters, user?: User): Promise<FindOptions<Playlist>> {
		return filter ?
			QHelper.buildQuery<Playlist>(
				[
					{ id: filter.ids },
					{ name: QHelper.like(filter.query, this.em.dialect) },
					{ name: QHelper.eq(filter.name) },
					{ comment: QHelper.eq(filter.comment) },
					{ createdAt: QHelper.gte(filter.since) },
					{ user: QHelper.inOrEqual(filter.userIDs) },
					QHelper.or<any>([
						{ isPublic: true },
						{ user: user?.id }
					])
				]
			) :
			{};
	}
}
