import { InRequestScope } from 'typescript-ioc';
import { Orm } from '../../modules/engine/services/orm.service.js';
import { Bookmark } from './bookmark.js';
import { DBObjectType } from '../../types/enums.js';
import { Track } from '../track/track.js';
import { Episode } from '../episode/episode.js';
import { User } from '../user/user.js';
import { Op } from 'sequelize';
import { notFoundError } from '../../modules/deco/express/express-error.js';

@InRequestScope
export class BookmarkService {
	async create(orm: Orm, destinationID: string, user: User, position: number, comment: string | undefined): Promise<Bookmark> {
		let bookmark = await orm.Bookmark.findOne({ where: { user: user.id, position: position, [Op.or]: [{ episode: destinationID }, { track: destinationID }] } });
		if (bookmark) {
			bookmark.comment = comment;
		} else {
			const result = await orm.findInStreamTypes(destinationID);
			if (!result) {
				return Promise.reject(notFoundError());
			}
			bookmark = orm.Bookmark.create({ position, comment });
			await bookmark.episode.set(result.objType === DBObjectType.episode ? result.obj as Episode : undefined);
			await bookmark.track.set(result.objType === DBObjectType.track ? result.obj as Track : undefined);
			await bookmark.user.set(user);
		}
		await orm.Bookmark.persistAndFlush(bookmark);
		return bookmark;
	}

	async remove(orm: Orm, bookmarkID: string, userID: string): Promise<void> {
		await orm.Bookmark.removeByQueryAndFlush({ where: { id: bookmarkID, user: userID } });
	}

	async removeByDest(orm: Orm, destinationID: string, userID: string): Promise<void> {
		await orm.Bookmark.removeByQueryAndFlush({
			where: {
				user: userID,
				[Op.or]: [
					{ episode: destinationID },
					{ track: destinationID }
				]
			}
		});
	}
}
