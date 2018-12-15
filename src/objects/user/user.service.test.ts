// import {expect, should, use, assert} from 'chai';
// import {after, before, beforeEach, describe, it} from 'mocha';
// import {TestDBs} from '../../db/db.test';
// import {Store} from '../../engine/store/store';
// import chai from 'chai';
// import chaiAsPromised from 'chai-as-promised';
// import {UserService} from './user.service';
// import {ImageService} from '../../engine/image/image.service';
//
// before(() => {
// 	chai.should();
// 	chai.use(chaiAsPromised);
// });
//
// describe('BookmarkService', () => {
//
// 	const testDBs = new TestDBs();
//
// 	for (const testDB of testDBs.dbs) {
// 		describe(testDB.name, () => {
// 			let userService: UserService;
//
// 			before(function(done) {
// 				this.timeout(40000);
// 				testDB.setup().then(() => {
// 					const store = new Store(testDB.database);
// 					const imageService = new ImageService('imageCache', 'userAvatars', store.folderStore, store.trackStore);
// 					userService = new UserService(store.userStore, store.stateStore, store.playlistStore, store.bookmarkStore, store.playQueueStore, imageService);
// 					done();
// 				}).catch(e => {
// 					throw e;
// 				});
// 			});
//
// 			after(async () => {
// 				await testDB.cleanup();
// 			});
//
// 			beforeEach(function() {
// 			});
//
//
// 			it('create a bookmark', async () => {
// 				const bookmark = await userService.create('trackID1', 'userID1', 5, 'a comment');
// 				should().exist(bookmark);
// 			});
//
// 			it('overwrite a bookmark', async () => {
// 				const bookmark = await userService.create('trackID1', 'userID1', 15, 'a comment');
// 				should().exist(bookmark);
// 				const result = await userService.get('trackID1', 'userID1');
// 				should().exist(result);
// 				if (!result) {
// 					return;
// 				}
// 				expect(result.position).to.equal(15);
// 				expect(await userService.bookmarkStore.searchCount({destID: 'trackID1', userID: 'userID1'})).to.equal(1);
// 			});
// 			it('remove a bookmark', async () => {
// 				await userService.remove('trackID1', 'userID1');
// 				const result = await userService.get('trackID1', 'userID1');
// 				should().not.exist(result);
// 			});
// 		});
// 	}
//
// });
