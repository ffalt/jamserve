import {testService} from '../base/base.service.spec';
import {BookmarkService} from './bookmark.service';

describe('BookmarkService', () => {
	let bookmarkService: BookmarkService;
	testService({mockData: false},
		async store => {
			bookmarkService = new BookmarkService(store.bookmarkStore);
		},
		() => {
			describe('.create', () => {
				it('should create a bookmark', async () => {
					const bookmark = await bookmarkService.create('trackID1', 'userID1', 5, 'a comment');
					expect(bookmark).toBeDefined();
				});
				it('should overwrite a bookmark', async () => {
					const bookmark = await bookmarkService.create('trackID1', 'userID1', 15, 'a comment');
					expect(bookmark).toBeDefined();
					const update = await bookmarkService.create('trackID1', 'userID1', 15, 'a update comment');
					expect(update).toBeDefined();
					expect(update.id).toBe(bookmark.id);
				});
			});
			describe('.byUser', () => {
				it('should get all bookmarks for a user', async () => {
					await bookmarkService.create('trackID2', 'userID2', 5, 'a comment');
					await bookmarkService.create('trackID2', 'userID2', 15, 'a comment');
					await bookmarkService.create('trackID3', 'userID2', 15, 'a comment');
					const bookmarks = await bookmarkService.byUser('userID2');
					expect(bookmarks.items.length).toBe(3);
				});
			});
			describe('.remove', () => {
				it('should remove a bookmark', async () => {
					const bookmark = await bookmarkService.create('trackID1', 'userID1', 15, 'a comment');
					expect(bookmark).toBeDefined();
					await bookmarkService.remove(bookmark.id, 'userID1');
					const result = await bookmarkService.bookmarkStore.byId(bookmark.id);
					expect(result).toBeUndefined();
				});
			});
			describe('.removeByTrack', () => {
				it('should remove a bookmark', async () => {
					const bookmark = await bookmarkService.create('trackID1', 'userID1', 15, 'a comment');
					expect(bookmark).toBeDefined();
					await bookmarkService.removeByTrack('trackID1', 'userID1');
					const result = await bookmarkService.byTrack('trackID1', 'userID1');
					expect(result.items.length).toBe(0);
				});
			});
		}
	);
});
