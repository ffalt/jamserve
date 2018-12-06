import {expect, should, use} from 'chai';
import {after, before, beforeEach, describe, it} from 'mocha';
import {BookmarkStore, SearchQueryBookmark} from './bookmark.store';
import {Bookmark} from './bookmark.model';
import {shouldBehaveLikeADBObjectStore} from '../base/base.store.spec';
import {TestDBs} from '../../db/db.test';
import {mockBookmark, mockBookmark2} from './bookmark.mock';

describe('BookmarkStore', () => {

	const testDBs = new TestDBs();

	for (const testDB of testDBs.dbs) {
		describe(testDB.name, () => {
			let bookmarkStore: BookmarkStore;

			before(function(done) {
				this.timeout(40000);
				testDB.setup().then(() => {
					bookmarkStore = new BookmarkStore(testDB.database);
					done();
				}).catch(e => {
					throw e;
				});
			});

			after(async () => {
				await testDB.cleanup();
			});

			beforeEach(function() {
				this.store = bookmarkStore;
				this.generateMockObjects = () => {
					return [mockBookmark(), mockBookmark2()];
				};
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

			shouldBehaveLikeADBObjectStore();
		});

	}
});
