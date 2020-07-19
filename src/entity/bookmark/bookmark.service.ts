import {Inject, Singleton} from 'typescript-ioc';
import {OrmService} from '../../modules/engine/services/orm.service';
import {Bookmark} from './bookmark';
import {NotFoundError} from '../../modules/rest/builder/express-error';
import {DBObjectType} from '../../types/enums';
import {Track} from '../track/track';
import {Episode} from '../episode/episode';
import {User} from '../user/user';

@Singleton
export class BookmarkService {
	@Inject
	orm!: OrmService;

	async create(destID: string, user: User, position: number, comment: string | undefined): Promise<Bookmark> {
		let bookmark = await this.orm.Bookmark.oneOrFail(
			{
				user: user.id,
				position: {$eq: position},
				$or: [
					{episode: destID},
					{track: destID}
				]
			}
		);
		if (!bookmark) {
			const result = await this.orm.findInStreamTypes(destID);
			if (!result) {
				return Promise.reject(NotFoundError());
			}
			bookmark = this.orm.Bookmark.create({
				track: result.objType === DBObjectType.track ? result.obj as Track : undefined,
				episode: result.objType === DBObjectType.episode ? result.obj as Episode : undefined,
				user,
				position,
				comment
			});
		} else {
			bookmark.comment = comment;
		}
		await this.orm.orm.em.persistAndFlush(bookmark);
		return bookmark;
	}

	async remove(id: string, userID: string): Promise<void> {
		await this.orm.Bookmark.remove({id, user: {id: userID}}, true);
	}

	async removeByDest(destID: string, userID: string): Promise<void> {
		await this.orm.Bookmark.remove({
			user: {id: userID},
			$or: [
				{episode: destID},
				{track: destID}
			]
		}, true);
	}

}
