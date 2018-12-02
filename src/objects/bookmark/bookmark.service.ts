import {DBObjectType} from '../../types';
import {BookmarkStore} from './bookmark.store';
import {Track} from '../track/track.model';
import {User} from '../user/user.model';
import {Bookmark} from './bookmark.model';

export class BookmarkService {

	constructor(private bookmarkStore: BookmarkStore) {

	}

	async getAll(userID: string): Promise<Array<Bookmark>> {
		return await this.bookmarkStore.search({userID});
	}

	async get(trackID: string, userID: string): Promise<Array<Bookmark>> {
		return await this.bookmarkStore.search({userID, destID: trackID});
	}

	async create(destID: string, userID: string, position: number, comment: string | undefined): Promise<Bookmark> {
		let bookmark = await this.bookmarkStore.searchOne({destID, userID});
		if (!bookmark) {
			bookmark = {
				id: '',
				type: DBObjectType.bookmark,
				destID,
				userID,
				position,
				comment,
				created: Date.now(),
				changed: Date.now()
			};
			bookmark.id = await this.bookmarkStore.add(bookmark);
		} else {
			bookmark.comment = comment;
			bookmark.position = position;
			bookmark.changed = Date.now();
			await this.bookmarkStore.replace(bookmark);
		}
		return bookmark;
	}

	async remove(trackID: string, user: User): Promise<void> {
		const bookmark = await this.bookmarkStore.searchOne({destID: trackID, userID: user.id});
		if (bookmark) {
			await this.bookmarkStore.remove(bookmark.id);
		}
	}
}
