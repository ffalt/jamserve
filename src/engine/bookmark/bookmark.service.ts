import {DBObjectType} from '../../db/db.types';
import {BaseStoreService} from '../base/base.service';
import {ListResult} from '../base/list-result';
import {Bookmark} from './bookmark.model';
import {BookmarkStore, SearchQueryBookmark} from './bookmark.store';

export class BookmarkService extends BaseStoreService<Bookmark, SearchQueryBookmark> {

	constructor(public bookmarkStore: BookmarkStore) {
		super(bookmarkStore);
	}

	async byUser(userID: string, amount?: number, offset?: number): Promise<ListResult<Bookmark>> {
		return this.bookmarkStore.search({userID, amount, offset});
	}

	async byTrack(destID: string, userID: string): Promise<ListResult<Bookmark>> {
		return this.bookmarkStore.search({userID, destID});
	}

	async create(destID: string, userID: string, position: number, comment: string | undefined): Promise<Bookmark> {
		let bookmark = await this.bookmarkStore.searchOne({destID, userID, position});
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
			bookmark.changed = Date.now();
			await this.bookmarkStore.replace(bookmark);
		}
		return bookmark;
	}

	async remove(id: string, userID: string): Promise<void> {
		await this.bookmarkStore.removeByQuery({id, userID});
	}

	async removeByTrack(destID: string, userID: string): Promise<void> {
		await this.bookmarkStore.removeByQuery({destID, userID});
	}

	async byID(id: string, userID: string): Promise<Bookmark | undefined> {
		return this.bookmarkStore.searchOne({id, userID});
	}

	async byIDs(ids: Array<string>, userID: string, amount?: number, offset?: number): Promise<ListResult<Bookmark>> {
		return this.bookmarkStore.search({ids, userID, amount, offset});
	}
}
