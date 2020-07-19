import {QueryOrder, Repository} from 'mikro-orm';
import {Bookmark} from './bookmark';
import {BaseRepository} from '../base/base.repository';
import {BookmarkOrderFields, DBObjectType} from '../../types/enums';
import {BookmarkFilterArgs, BookmarkOrderArgs} from './bookmark.args';
import {QueryOrderMap} from 'mikro-orm/dist/query';
import {User} from '../user/user';
import {QBFilterQuery} from 'mikro-orm/dist/typings';
import {QHelper} from '../base/base';

@Repository(Bookmark)
export class BookmarkRepository extends BaseRepository<Bookmark, BookmarkFilterArgs, BookmarkOrderArgs> {
	objType = DBObjectType.bookmark;

	applyOrderByEntry(result: QueryOrderMap, direction: QueryOrder, order?: BookmarkOrderArgs) {
		switch (order?.orderBy) {
			case BookmarkOrderFields.created:
				result.createdAt = direction;
				break;
			case BookmarkOrderFields.updated:
				result.updatedAt = direction;
				break;
			case BookmarkOrderFields.default:
			case BookmarkOrderFields.position:
				result.position = direction;
				break;
		}
	}

	async buildFilter(filter?: BookmarkFilterArgs, user?: User): Promise<QBFilterQuery<Bookmark>> {
		return filter ? QHelper.buildQuery<Bookmark>(
			[
				{id: filter.ids},
				{comment: QHelper.like(filter.query)},
				{comment: QHelper.eq(filter.comment)},
				{track: QHelper.foreignKey(filter.trackIDs)},
				{episode: QHelper.foreignKey(filter.episodeIDs)},
				{createdAt: QHelper.gte(filter.since)},
				{user: user?.id}
			]
		) : {user: user?.id};
	}


}
