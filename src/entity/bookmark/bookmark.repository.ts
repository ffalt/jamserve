import { Bookmark } from './bookmark.js';
import { BaseRepository } from '../base/base.repository.js';
import { BookmarkOrderFields, DBObjectType } from '../../types/enums.js';
import { BookmarkFilterParameters, BookmarkOrderParameters } from './bookmark.parameters.js';
import { User } from '../user/user.js';
import { OrderHelper } from '../base/base.js';
import { QHelper } from '../../modules/orm/index.js';
import { FindOptions, OrderItem } from 'sequelize';

export class BookmarkRepository extends BaseRepository<Bookmark, BookmarkFilterParameters, BookmarkOrderParameters> {
	objType = DBObjectType.bookmark;

	buildOrder(order?: BookmarkOrderParameters): Array<OrderItem> {
		const direction = OrderHelper.direction(order);
		switch (order?.orderBy) {
			case BookmarkOrderFields.created: {
				return [['createdAt', direction]];
			}
			case BookmarkOrderFields.updated: {
				return [['updatedAt', direction]];
			}
			case BookmarkOrderFields.media: {
				return [
					['trackORM', 'path', direction],
					['episodeORM', 'path', direction]
				];
			}
			case BookmarkOrderFields.default:
			case BookmarkOrderFields.position: {
				return [['position', direction]];
			}
		}
		return [];
	}

	async buildFilter(filter?: BookmarkFilterParameters, user?: User): Promise<FindOptions<Bookmark>> {
		return QHelper.buildQuery<Bookmark>(filter ?
			[
				{ id: filter.ids },
				{ comment: QHelper.like(filter.query, this.em.dialect) },
				{ comment: QHelper.eq(filter.comment) },
				{ track: QHelper.inOrEqual(filter.trackIDs) },
				{ episode: QHelper.inOrEqual(filter.episodeIDs) },
				{ createdAt: QHelper.gte(filter.since) },
				{ user: QHelper.inOrEqual(filter.userIDs) },
				{ user: user?.roleAdmin ? undefined : user?.id }
			] :
			[{ user: user?.roleAdmin ? undefined : user?.id }]
		);
	}
}
