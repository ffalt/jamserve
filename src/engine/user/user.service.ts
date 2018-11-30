import {fileDeleteIfExists} from '../../utils/fs-utils';
import path from 'path';
import {Store} from '../store';
import {Config} from '../../config';
import {ImageService} from '../image/image.service';
import {User} from './user.model';
import {hexDecode} from '../../utils/hex';
import {Md5} from 'md5-typescript';

export class UserService {
	private cached: {
		[id: string]: User;
	} = {};
	private readonly imagesPath: string;

	constructor(private config: Config, private store: Store, private imageService: ImageService) {
		this.imagesPath = config.getDataPath(['images']);
	}

	clearCache() {
		this.cached = {};
	}

	async get(name: string): Promise<User | undefined> {
		return await this.store.userStore.searchOne({'name': name || ''});
	}

	async setUserImage(user: User, filename: string): Promise<void> {
		const destFileName = 'avatar-' + user.id + '.png';
		const destName = path.join(this.imagesPath, destFileName);
		await fileDeleteIfExists(destName);
		await this.imageService.createAvatar(filename, destName);
		await this.imageService.clearImageCacheByID(user.id);
		user.avatar = destFileName;
		user.avatarLastChanged = Date.now();
		await this.updateUser(user);
	}

	async deleteUser(user: User): Promise<void> {
		delete this.cached[user.id];
		await this.store.stateStore.removeByQuery({userID: user.id});
		await this.store.playlistStore.removeByQuery({userID: user.id});
		await this.store.bookmarkStore.removeByQuery({userID: user.id});
		await this.store.playQueueStore.removeByQuery({userID: user.id});
		await this.imageService.clearImageCacheByID(user.id);
		await this.store.userStore.remove(user.id);
		// TODO: remove user chat msg on user.delete
		if (user.avatar) {
			await fileDeleteIfExists(path.join(this.imagesPath, user.avatar));
		}
	}

	async createUser(user: User): Promise<string> {
		if (!user.name || user.name.trim().length === 0) {
			return Promise.reject(Error('Invalid Username'));
		}
		const existingUser = await this.get(user.name);
		if (existingUser) {
			return Promise.reject(Error('Username already exists'));
		}
		if (user.pass.indexOf('enc:') === 0) {
			user.pass = hexDecode(user.pass);
		}
		return this.store.userStore.add(user);
	}

	async getUser(id: string): Promise<User | undefined> {
		let user: User | undefined = this.cached[id];
		if (user) {
			return user;
		}
		user = await this.store.userStore.byId(id);
		if (user) {
			this.cached[id] = user;
		}
		return user;
	}

	async auth(name: string, pass: string): Promise<User> {
		if ((!name) || (!name.length)) {
			return Promise.reject(Error('Invalid Username'));
		}
		if ((!pass) || (!pass.length)) {
			return Promise.reject(Error('Invalid Password'));
		}
		const user = await this.get(name);
		if (!user) {
			return Promise.reject(Error('Invalid Username'));
		}
		if (pass.indexOf('enc:') === 0) {
			pass = hexDecode(pass.slice(4)).trim();
		}
		if (pass !== user.pass) {
			return Promise.reject(Error('Invalid Password'));
		}
		return user;
	}

	async authToken(name: string, token: string, salt: string): Promise<User> {
		if ((!name) || (!name.length)) {
			return Promise.reject(Error('Invalid Username'));
		}
		if ((!token) || (!token.length)) {
			return Promise.reject(Error('Invalid Token'));
		}
		const user = await this.get(name);
		if (!user) {
			return Promise.reject(Error('Invalid Username'));
		}
		const t = Md5.init(user.pass + salt);
		if (token !== t) {
			return Promise.reject(Error('Invalid Token'));
		}
		return user;
	}

	async updateUser(user: User): Promise<void> {
		if (user.pass.indexOf('enc:') === 0) {
			user.pass = hexDecode(user.pass);
		}
		await this.store.userStore.replace(user);
		delete this.cached[user.id];
	}
}
