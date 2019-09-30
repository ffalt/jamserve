import {testStore} from '../base/base.store.spec';
import {mockBookmark, mockBookmark2} from './bookmark.mock';
import {Bookmark} from './bookmark.model';
import {BookmarkStore, SearchQueryBookmark} from './bookmark.store';

describe('BookmarkStore', () => {
	let bookmarkStore: BookmarkStore;

	testStore(testDB => {
			bookmarkStore = new BookmarkStore(testDB.database);
			return bookmarkStore;
		}, () => {
			return [mockBookmark(), mockBookmark2()];
		}, (mock: Bookmark) => {
			const matches: Array<SearchQueryBookmark> = [
				{userID: mock.userID, destID: mock.destID},
				{userID: mock.userID},
				{destID: mock.destID},
				{destIDs: [mock.destID]}
			];
			return matches;
		},
		() => {
			// nope
		});
});
