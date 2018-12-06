import {expect, should, use, assert} from 'chai';
import {after, before, beforeEach, describe, it} from 'mocha';
import {TestDBs} from '../../db/db.test';
import {Store} from '../../engine/store/store';
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import {BookmarkService} from './bookmark.service';

before(() => {
	chai.should();
	chai.use(chaiAsPromised);
});

describe('BookmarkService', () => {

	const testDBs = new TestDBs();

	for (const testDB of testDBs.dbs) {
		describe(testDB.name, () => {
			let bookmarkService: BookmarkService;

			before(function(done) {
				this.timeout(40000);
				testDB.setup().then(() => {
					const store = new Store(testDB.database);
					bookmarkService = new BookmarkService(store.bookmarkStore);
					done();
				}).catch(e => {
					throw e;
				});
			});

			after(async () => {
				await testDB.cleanup();
			});

			beforeEach(function() {
			});


			it('create a bookmark', async () => {
				const bookmark = await bookmarkService.create('trackID1', 'userID1', 5, 'a comment');
				should().exist(bookmark);
			});

			it('overwrite a bookmark', async () => {
				const bookmark = await bookmarkService.create('trackID1', 'userID1', 15, 'a comment');
				should().exist(bookmark);
				const result = await bookmarkService.get('trackID1', 'userID1');
				should().exist(result);
				if (!result) {
					return;
				}
				expect(result.position).to.equal(15);
				expect(await bookmarkService.bookmarkStore.searchCount({destID: 'trackID1', userID: 'userID1'})).to.equal(1);
			});
			it('remove a bookmark', async () => {
				await bookmarkService.remove('trackID1', 'userID1');
				const result = await bookmarkService.get('trackID1', 'userID1');
				should().not.exist(result);
			});
		});
	}

});
