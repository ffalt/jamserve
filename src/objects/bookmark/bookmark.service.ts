import {DBObjectType} from '../../db/db.types';
import {BookmarkStore, SearchQueryBookmark} from './bookmark.store';
import {Bookmark} from './bookmark.model';
import {BaseStoreService} from '../base/base.service';

export class BookmarkService extends BaseStoreService<Bookmark, SearchQueryBookmark> {

	constructor(public bookmarkStore: BookmarkStore) {
		super(bookmarkStore);
	}

	async getAll(userID: string): Promise<Array<Bookmark>> {
		return await this.bookmarkStore.search({userID});
	}

	async get(trackID: string, userID: string): Promise<Bookmark | undefined> {
		return await this.bookmarkStore.searchOne({userID, destID: trackID});
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

	async remove(trackID: string, userID: string): Promise<void> {
		await this.bookmarkStore.removeByQuery({destID: trackID, userID});
	}

}
