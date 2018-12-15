import {assert, expect, should, use} from 'chai';
import {after, before, beforeEach, describe, it} from 'mocha';
import {testService} from '../base/base.service.spec';
import {UserService} from './user.service';
import tmp, {SynchrounousResult} from 'tmp';

describe('UserService', () => {
	let userService: UserService;
	let dir: SynchrounousResult;
	testService(
		(storeTest, imageModuleTest) => {
			dir = tmp.dirSync();
			userService = new UserService(dir.name, storeTest.store.userStore, storeTest.store.stateStore, storeTest.store.playlistStore, storeTest.store.bookmarkStore, storeTest.store.playQueueStore, imageModuleTest.imageModule);
		},
		() => {
			it('create a user', async () => {
			});
		},
		async () => {
			dir.removeCallback();
		}
	);
});
