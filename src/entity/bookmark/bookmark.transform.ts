import {InRequestScope} from 'typescript-ioc';
import {BaseTransformService} from '../base/base.transform.js';
import {Orm} from '../../modules/engine/services/orm.service.js';
import {Bookmark as ORMBookmark} from './bookmark.js';
import {BookmarkBase} from './bookmark.model.js';

@InRequestScope
export class BookmarkTransformService extends BaseTransformService {

	async bookmarkBase(orm: Orm, o: ORMBookmark): Promise<BookmarkBase> {
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
