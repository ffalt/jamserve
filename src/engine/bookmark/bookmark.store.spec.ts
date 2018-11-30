import {expect, should, use} from 'chai';
import {after, before, beforeEach, describe, it} from 'mocha';
import {BookmarkStore, SearchQueryBookmark} from './bookmark.store';
import {TestNeDB} from '../../db/nedb/db-nedb.test';
import {Bookmark} from './Bookmark.model';
import {DBObjectType} from '../../types';
import {shouldBehaveLikeADBObjectStore} from '../base/base.store.spec';

function mockBookmark(): Bookmark {
	return {
		id: '',
		type: DBObjectType.bookmark,
		destID: 'trackID1',
		userID: 'userID1',
		comment: 'a comment',
		created: 1543495268,
		changed: 1543495269,
		position: 1234
	};
}

describe('BookmarkStore', () => {

	const testDB = new TestNeDB();
	let bookmarkStore: BookmarkStore;

	before(async () => {
		await testDB.setup();
		bookmarkStore = new BookmarkStore(testDB.database);
	});

	after(async () => {
		await testDB.cleanup();
	});

	beforeEach(function() {
		this.store = bookmarkStore;
		this.obj = mockBookmark();
		this.generateMatchingQueries = (mock: Bookmark) => {
			const matches: Array<SearchQueryBookmark> = [
				{userID: mock.userID, destID: mock.destID},
				{userID: mock.userID},
				{destID: mock.destID},
				{destIDs: [mock.destID]}
			];
			return matches;
		};
	});

	describe('DBObject Store', () => {
		shouldBehaveLikeADBObjectStore();
	});

});

