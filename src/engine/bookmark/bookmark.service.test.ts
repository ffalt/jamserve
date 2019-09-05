import {BookmarkService} from './bookmark.service';
import {testService} from '../base/base.service.spec';

describe('BookmarkService', () => {
	let bookmarkService: BookmarkService;
	testService({mockData: false},
		async (store, imageModuleTest) => {
			bookmarkService = new BookmarkService(store.bookmarkStore);
		},
		() => {
			it('create a bookmark', async () => {
				const bookmark = await bookmarkService.create('trackID1', 'userID1', 5, 'a comment');
				expect(bookmark).toBeTruthy();
			});

			it('overwrite a bookmark', async () => {
				const bookmark = await bookmarkService.create('trackID1', 'userID1', 15, 'a comment');
				expect(bookmark).toBeTruthy();
				const result = await bookmarkService.get('trackID1', 'userID1');
				expect(result).toBeTruthy();
				if (!result) {
					return;
				}
				expect(result.position).toBe(15);
				expect(await bookmarkService.bookmarkStore.searchCount({destID: 'trackID1', userID: 'userID1'})).toBe(1);
			});
			it('create another bookmark', async () => {
				const bookmark = await bookmarkService.create('trackID2', 'userID1', 1, 'a comment');
				expect(bookmark).toBeTruthy();
			});
			it('get all bookmarks for a user', async () => {
				const bookmarks = await bookmarkService.getAll('userID1');
				expect(bookmarks.length).toBe(2);
				await bookmarkService.remove('trackID2', 'userID1');
			});
			it('remove a bookmark', async () => {
				await bookmarkService.remove('trackID1', 'userID1');
				const result = await bookmarkService.get('trackID1', 'userID1');
				expect(result).toBeUndefined();
			});
		}
	);
});
