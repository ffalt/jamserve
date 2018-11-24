import {DBObjectType} from '../../types';
import {BookmarkStore} from './bookmark.store';
import {Track} from '../track/track.model';
import {User} from '../user/user.model';
import {Bookmark} from './bookmark.model';

export class BookmarkService {

	constructor(private bookmarkStore: BookmarkStore) {

	}

	async create(track: Track, user: User, position: number, comment: string | undefined): Promise<Bookmark> {
		let bookmark = await this.bookmarkStore.searchOne({destID: track.id, userID: user.id});
		if (!bookmark) {
			bookmark = {
				id: '',
				type: DBObjectType.bookmark,
				destID: track.id,
				userID: user.id,
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
