import {expect, should, use, assert} from 'chai';
import {after, before, beforeEach, describe, it} from 'mocha';
import {BookmarkService} from './bookmark.service';
import {testService} from '../base/base.service.spec';

describe('BookmarkService', () => {
	let bookmarkService: BookmarkService;
	testService(
		(storeTest, imageModuleTest) => {
			bookmarkService = new BookmarkService(storeTest.store.bookmarkStore);
		},
		() => {
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
		}
	);
});
