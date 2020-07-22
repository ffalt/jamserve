import {Bookmark} from './bookmark';
import {BaseRepository} from '../base/base.repository';
import {BookmarkOrderFields, DBObjectType} from '../../types/enums';
import {BookmarkFilterArgs, BookmarkOrderArgs} from './bookmark.args';
import {User} from '../user/user';
import {OrderHelper} from '../base/base';
import {FindOptions, OrderItem, QHelper} from '../../modules/orm';

export class BookmarkRepository extends BaseRepository<Bookmark, BookmarkFilterArgs, BookmarkOrderArgs> {
	objType = DBObjectType.bookmark;

	buildOrder(order?: BookmarkOrderArgs): Array<OrderItem> {
		const direction = OrderHelper.direction(order);
		switch (order?.orderBy) {
			case BookmarkOrderFields.created:
				return [['createdAt', direction]];
			case BookmarkOrderFields.updated:
				return [['updatedAt', direction]];
			case BookmarkOrderFields.default:
			case BookmarkOrderFields.position:
				return [['position', direction]];
		}
		return [];
	}

	async buildFilter(filter?: BookmarkFilterArgs, user?: User): Promise<FindOptions<Bookmark>> {
		return QHelper.buildQuery<Bookmark>(filter ?
			[
				{id: filter.ids},
				{comment: QHelper.like(filter.query)},
				{comment: QHelper.eq(filter.comment)},
				{track: QHelper.inOrEqual(filter.trackIDs)},
				{episode: QHelper.inOrEqual(filter.episodeIDs)},
				{createdAt: QHelper.gte(filter.since)},
				{user: user?.roleAdmin ? undefined : user?.id}
			]
			: [{user: user?.roleAdmin ? undefined : user?.id}]
		)
	}


}
