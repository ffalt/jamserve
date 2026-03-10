import { injectable } from 'inversify';
import { BaseTransformService } from '../base/base.transform.js';
import { Orm } from '../../modules/engine/services/orm.service.js';
import { Bookmark as ORMBookmark } from './bookmark.js';
import { BookmarkBase } from './bookmark.model.js';

@injectable()
export class BookmarkTransformService extends BaseTransformService {
	async bookmarkBase(_orm: Orm, o: ORMBookmark): Promise<BookmarkBase> {
		return {
			id: o.id,
			trackID: o.track.id(),
			episodeID: o.episode.id(),
			position: o.position,
			comment: o.comment,
			created: o.createdAt.valueOf(),
			changed: o.updatedAt.valueOf()
		};
	}
}
