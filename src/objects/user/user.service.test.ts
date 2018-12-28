import {assert, expect, should, use} from 'chai';
import {after, before, beforeEach, describe, it} from 'mocha';
import {testService} from '../base/base.service.spec';
import {UserService} from './user.service';
import tmp, {SynchrounousResult} from 'tmp';
import path from 'path';
import {mockUser, mockUser2} from './user.mock';
import {Md5} from 'md5-typescript';
import {mockImage} from '../../modules/image/image.module.spec';
import fse from 'fs-extra';

function salt(length: number): string {
	let s = '';
	const randomchar = () => {
		const n = Math.floor(Math.random() * 62);
		if (n < 10) {
			return n; // 1-10
		}
		if (n < 36) {
			return String.fromCharCode(n + 55); // A-Z
		}
		return String.fromCharCode(n + 61); // a-z
	};
	while (s.length < length) {
		s += randomchar();
	}
	return s;
}

describe('UserService', () => {
	let userService: UserService;
	let dir: SynchrounousResult;
	testService(
		(storeTest, imageModuleTest) => {
			dir = tmp.dirSync();
			userService = new UserService(dir.name, storeTest.store.userStore, storeTest.store.stateStore, storeTest.store.playlistStore, storeTest.store.bookmarkStore, storeTest.store.playQueueStore, imageModuleTest.imageModule);
		},
		() => {
			let userID: string;
			const mock = mockUser();

			it('should not create invalid user', async function() {
				const notRight = mockUser2();
				notRight.name = ' ';
				notRight.pass = 'something';
				await userService.create(notRight).should.eventually.be.rejectedWith(Error);
				notRight.name = 'mock';
				notRight.pass = ' ';
				await userService.create(notRight).should.eventually.be.rejectedWith(Error);
			});

			it('should add the user', async function() {
				userID = await userService.create(mock);
				mock.id = userID;
			});
			it('should find and compare the created user by ID', async function() {
				const user = await userService.getByID(userID);
				should().exist(user);
				expect(user).to.deep.equal(mock);
			});
			it('should find and compare the created user by name', async function() {
				const user = await userService.getByName(mock.name);
				should().exist(user);
				expect(user).to.deep.equal(mock);
			});
			it('should not allow add an same name user', async function() {
				await userService.create(mock).should.eventually.be.rejectedWith(Error);
			});
			it('should auth the user by password', async function() {
				const user = await userService.auth(mock.name, mock.pass);
				should().exist(user);
				expect(user).to.deep.equal(mock);
			});
			it('should not auth the user with the wrong password', async function() {
				await userService.auth(mock.name, mock.pass + '_wrong').should.eventually.be.rejectedWith(Error);
				await userService.auth(' ', mock.pass).should.eventually.be.rejectedWith(Error);
				await userService.auth(mock.name, '').should.eventually.be.rejectedWith(Error);
				await userService.auth('non-existing', 'something').should.eventually.be.rejectedWith(Error);
			});
			it('should auth the user by token', async function() {
				const s = salt(6);
				const token = Md5.init(mock.pass + s);
				const user = await userService.authToken(mock.name, token, s);
				should().exist(user);
				expect(user).to.deep.equal(mock);
			});
			it('should not auth the user with the wrong token', async function() {
				await userService.authToken(mock.name, 'wrong', 'wrong').should.eventually.be.rejectedWith(Error);
				await userService.authToken(' ', 'wrong', 'wrong').should.eventually.be.rejectedWith(Error);
				await userService.authToken(mock.name, '', 'wrong').should.eventually.be.rejectedWith(Error);
				await userService.authToken(mock.name, 'wrong', '').should.eventually.be.rejectedWith(Error);
				await userService.authToken('non-existing', 'wrong', 'wrong').should.eventually.be.rejectedWith(Error);
			});

			it('should use the cache', async function() {
				userService.clearCache();
				let user = await userService.getByName(mock.name);
				let u = await userService.getByName(mock.name);
				expect(u === user).to.be.equal(true);
				userService.clearCache();
				user = await userService.getByID(mock.id);
				u = await userService.getByID(mock.id);
				expect(u === user).to.be.equal(true);
			});
			it('should update the created user', async function() {
				const oldname = mock.name;
				mock.name = oldname + '_renamed';
				await userService.update(mock);
				const user = await userService.getByID(userID);
				should().exist(user);
				expect(user).to.deep.equal(mock);
				mock.name = oldname;
				delete mock.avatar;
				await userService.update(mock);
				const user2 = await userService.getByID(userID);
				expect(user2).to.deep.equal(mock);
			});
			it('should return no image if not set', async function() {
				mock.avatar = undefined;
				await userService.update(mock);
				const res = await userService.getUserImage(mock);
				should().not.exist(res);
			});
			it('should return an avatar image', async function() {
				mock.avatar = 'testget-' + mock.id + '.png';
				const image = await mockImage('png');
				const filename = path.resolve(userService.userAvatarPath, mock.avatar);
				await fse.writeFile(filename, image.buffer);
				await userService.update(mock);
				const res = await userService.getUserImage(mock);
				should().exist(res);
				await fse.remove(filename);
			});
			it('should set the avatar image', async function() {
				mock.avatar = undefined;
				await userService.update(mock);
				const image = await mockImage('png');
				const filename = path.resolve(userService.userAvatarPath, 'testset-' + mock.id + '.png');
				await fse.writeFile(filename, image.buffer);
				await userService.setUserImage(mock, filename);
				await fse.remove(filename);
				const res = await userService.getUserImage(mock);
				should().exist(res);
			});
			it('should remove the user', async function() {
				await userService.remove(mock);
				const user = await userService.getByID(userID);
				should().not.exist(user);
			});
		},
		async () => {
			dir.removeCallback();
		}
	);
});
