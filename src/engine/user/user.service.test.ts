import fse from 'fs-extra';
import {Md5} from 'md5-typescript';
import path from 'path';
import tmp from 'tmp';
import {mockImage} from '../../modules/image/image.module.spec';
import {testService} from '../base/base.service.spec';
import {mockUser, mockUser2, mockUserPass} from './user.mock';
import {UserService} from './user.service';

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
	let dir: tmp.DirResult;
	testService({mockData: false},
		async (store, imageModuleTest) => {
			dir = tmp.dirSync();
			userService = new UserService(dir.name, store.userStore, store.stateStore, store.playlistStore, store.bookmarkStore, store.playQueueStore, imageModuleTest.imageModule);
		},
		() => {
			let userID: string;
			const mock = mockUser();

			it('should not create invalid user', async () => {
				const notRight = mockUser2();
				notRight.name = ' ';
				await expect(userService.create(notRight)).rejects.toThrow('Invalid Username');
			});

			it('should add the user', async () => {
				userID = await userService.create(mock);
				mock.id = userID;
			});
			it('should find and compare the created user by ID', async () => {
				const user = await userService.getByID(userID);
				expect(user).toBeTruthy();
				expect(user).toEqual(mock);
			});
			it('should find and compare the created user by name', async () => {
				const user = await userService.getByName(mock.name);
				expect(user).toBeTruthy();
				expect(user).toEqual(mock);
			});
			it('should not allow add an same name user', async () => {
				await expect(userService.create(mock)).rejects.toThrow('Username already exists');
			});
			it('should auth the user by password', async () => {
				const user = await userService.auth(mock.name, mockUserPass);
				expect(user).toBeTruthy();
				expect(user).toEqual(mock);
			});
			it('should not auth the user with the wrong password', async () => {
				await expect(userService.auth(mock.name, mockUserPass + '_wrong')).rejects.toThrow('Invalid Password');
				await expect(userService.auth(' ', mockUserPass)).rejects.toThrow('Invalid Username');
				await expect(userService.auth(mock.name, '')).rejects.toThrow('Invalid Password');
				await expect(userService.auth('non-existing', 'something')).rejects.toThrow('Invalid Username');
			});
			it('should auth the user by token', async () => {
				const s = salt(6);
				const token = Md5.init(mock.subsonic_pass + s);
				const user = await userService.authToken(mock.name, token, s);
				expect(user).toBeTruthy();
				expect(user).toEqual(mock);
			});
			it('should not auth the user with the wrong token', async () => {
				await expect(userService.authToken(mock.name, 'wrong', 'wrong')).rejects.toThrow('Invalid Token');
				await expect(userService.authToken(' ', 'wrong', 'wrong')).rejects.toThrow('Invalid Username');
				await expect(userService.authToken(mock.name, '', 'wrong')).rejects.toThrow('Invalid Token');
				await expect(userService.authToken(mock.name, 'wrong', '')).rejects.toThrow('Invalid Token');
				await expect(userService.authToken('non-existing', 'wrong', 'wrong')).rejects.toThrow('Invalid Username');
			});

			it('should use the cache', async () => {
				userService.clearCache();
				let user = await userService.getByName(mock.name);
				let u = await userService.getByName(mock.name);
				expect(u === user).toBe(true);
				userService.clearCache();
				user = await userService.getByID(mock.id);
				u = await userService.getByID(mock.id);
				expect(u === user).toBe(true);
			});
			it('should update the created user', async () => {
				const oldname = mock.name;
				mock.name = oldname + '_renamed';
				await userService.update(mock);
				const user = await userService.getByID(userID);
				expect(user).toBeTruthy();
				expect(user).toEqual(mock);
				mock.name = oldname;
				delete mock.avatar;
				await userService.update(mock);
				const user2 = await userService.getByID(userID);
				expect(user2).toEqual(mock);
			});
			it('should return a generated avatar image, even if not set', async () => {
				mock.avatar = undefined;
				await userService.update(mock);
				const result = await userService.getUserImage(mock);
				expect(result).toBeTruthy();
			});
			it('should return an avatar image', async () => {
				mock.avatar = 'testget-' + mock.id + '.png';
				const image = await mockImage('png');
				const filename = path.resolve(userService.userAvatarPath, mock.avatar);
				await fse.writeFile(filename, image.buffer);
				await userService.update(mock);
				const result = await userService.getUserImage(mock);
				expect(result).toBeTruthy();
				await fse.remove(filename);
			});
			it('should set the avatar image', async () => {
				mock.avatar = undefined;
				await userService.update(mock);
				const image = await mockImage('png');
				const filename = path.resolve(userService.userAvatarPath, 'testset-' + mock.id + '.png');
				await fse.writeFile(filename, image.buffer);
				await userService.setUserImage(mock, filename);
				await fse.remove(filename);
				const result = await userService.getUserImage(mock);
				expect(result).toBeTruthy();
			});
			it('should remove the user', async () => {
				await userService.remove(mock);
				const user = await userService.getByID(userID);
				expect(user).toBeFalsy();
			});
		},
		async () => {
			dir.removeCallback();
		}
	);
});
