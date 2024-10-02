import { InRequestScope } from 'typescript-ioc';
import { Orm } from '../../modules/engine/services/orm.service.js';
import { Bookmark } from './bookmark.js';
import { NotFoundError } from '../../modules/rest/index.js';
import { DBObjectType } from '../../types/enums.js';
import { Track } from '../track/track.js';
import { Episode } from '../episode/episode.js';
import { User } from '../user/user.js';
import seq from 'sequelize';

@InRequestScope
export class BookmarkService {
	async create(orm: Orm, destID: string, user: User, position: number, comment: string | undefined): Promise<Bookmark> {
		let bookmark = await orm.Bookmark.findOne({ where: { user: user.id, position: position, [seq.Op.or]: [{ episode: { id: destID } }, { track: { id: destID } }] } });
		if (!bookmark) {
			const result = await orm.findInStreamTypes(destID);
			if (!result) {
				return Promise.reject(NotFoundError());
			}
			bookmark = orm.Bookmark.create({ position, comment });
			await bookmark.episode.set(result.objType === DBObjectType.episode ? result.obj as Episode : undefined);
			await bookmark.track.set(result.objType === DBObjectType.track ? result.obj as Track : undefined);
			await bookmark.user.set(user);
		} else {
			bookmark.comment = comment;
		}
		await orm.Bookmark.persistAndFlush(bookmark);
		return bookmark;
	}

	async remove(orm: Orm, id: string, userID: string): Promise<void> {
		await orm.Bookmark.removeByQueryAndFlush({ where: { id, user: userID } });
	}

	async removeByDest(orm: Orm, destID: string, userID: string): Promise<void> {
		await orm.Bookmark.removeByQueryAndFlush({
			where: {
				user: userID,
				[seq.Op.or]: [
					{ episode: destID },
					{ track: destID }
				]
			}
		});
	}
}
