import fse from 'fs-extra';
import path from 'path';
import tmp from 'tmp';
import {ImageModule} from '../../modules/image/image.module';
import {mockImage} from '../../modules/image/image.module.spec';
import {hashMD5} from '../../utils/hash';
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
	let imageModule: ImageModule;
	let dir: tmp.DirResult;
	testService({mockData: false},
		async (store, imageModuleTest) => {
			dir = tmp.dirSync();
			imageModule = imageModuleTest.imageModule;
			userService = new UserService(dir.name, store.userStore, store.stateStore, store.playlistStore, store.bookmarkStore, store.playQueueStore, store.sessionStore, imageModuleTest.imageModule);
		},
		() => {
			let userID: string;
			let mock = mockUser();

			beforeAll(async () => {
				mock = mockUser();
				userID = await userService.create(mock);
				mock.id = userID;
			});

			afterAll(async () => {
				userService.clearCache();
				await userService.userStore.clear();
			});

			it('should not create invalid user', async () => {
				const notRight = mockUser2();
				notRight.name = ' ';
				await expect(userService.create(notRight)).rejects.toThrow('Invalid Username');
			});

			it('should create the user', async () => {
				expect(userID).toBeTruthy();
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
				await expect(userService.auth(mock.name, `${mockUserPass}_wrong`)).rejects.toThrow('Invalid Password');
				await expect(userService.auth(' ', mockUserPass)).rejects.toThrow('Invalid Username');
				await expect(userService.auth(mock.name, '')).rejects.toThrow('Invalid Password');
				await expect(userService.auth('non-existing', 'something')).rejects.toThrow('Invalid Username');
			});
			it('should auth the user by token', async () => {
				const s = salt(6);
				const token = hashMD5(mock.subsonic_pass + s);
				const user = await userService.authSubsonicToken(mock.name, token, s);
				expect(user).toBeTruthy();
				expect(user).toEqual(mock);
			});
			it('should not auth the user with the wrong token', async () => {
				await expect(userService.authSubsonicToken(mock.name, 'wrong', 'wrong')).rejects.toThrow('Invalid Token');
				await expect(userService.authSubsonicToken(' ', 'wrong', 'wrong')).rejects.toThrow('Invalid Username');
				await expect(userService.authSubsonicToken(mock.name, '', 'wrong')).rejects.toThrow('Invalid Token');
				await expect(userService.authSubsonicToken(mock.name, 'wrong', '')).rejects.toThrow('Invalid Token');
				await expect(userService.authSubsonicToken('non-existing', 'wrong', 'wrong')).rejects.toThrow('Invalid Username');
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
				mock.name = `${oldname}_renamed`;
				await userService.update(mock);
				const user = await userService.getByID(userID);
				expect(user).toBeTruthy();
				expect(user).toEqual(mock);
				mock.name = oldname;
				await userService.update(mock);
				const user2 = await userService.getByID(userID);
				expect(user2).toEqual(mock);
			});
			it('should return a generated avatar image', async () => {
				const result = await userService.getUserImage(mock);
				expect(result).toBeTruthy();
			});
			it('should return an avatar image', async () => {
				const image = await mockImage('png');
				const filename = path.resolve(userService.userAvatarPath, `${mock.id}.png`);
				await fse.writeFile(filename, image.buffer);
				const result = await userService.getUserImage(mock);
				expect(result).toBeTruthy();
				await fse.remove(filename);
			});
			it('should set the avatar image', async () => {
				const image = await mockImage('png');
				const filename = path.resolve(userService.userAvatarPath, `testset-${mock.id}.png`);
				await fse.writeFile(filename, image.buffer);
				await userService.setUserImage(mock, filename);
				expect(await fse.pathExists(filename)).toBe(false);
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
