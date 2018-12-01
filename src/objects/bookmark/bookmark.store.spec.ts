import {expect, should, use} from 'chai';
import {after, before, beforeEach, describe, it} from 'mocha';
import {BookmarkStore, SearchQueryBookmark} from './bookmark.store';
import {TestNeDB} from '../../db/nedb/db-nedb.test';
import {Bookmark} from './bookmark.model';
import {DBObjectType} from '../../types';
import {shouldBehaveLikeADBObjectStore} from '../base/base.store.spec';
import {TestDBs} from '../../db/db.test';
import {AlbumStore, SearchQueryAlbum} from '../album/album.store';
import {Album} from '../album/album.model';

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

function mockBookmark2(): Bookmark {
	return {
		id: '',
		type: DBObjectType.bookmark,
		destID: 'trackID2',
		userID: 'userID2',
		comment: 'second comment',
		created: 1443495268,
		changed: 1443495269,
		position: 4321
	};
}

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
