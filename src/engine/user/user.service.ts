import {fileDeleteIfExists} from '../../utils/fs-utils';
import path from 'path';
import {Store} from '../store';
import {Config} from '../../config';
import {ImageService} from '../image/image.service';
import {User} from './user.model';

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

	async setUserImage(user: User, filename: string): Promise<void> {
		const destFileName = 'avatar-' + user.id + '.png';
		const destName = path.join(this.imagesPath, destFileName);
		await fileDeleteIfExists(destName);
		await this.imageService.createAvatar(filename, destName);
		await this.imageService.clearImageCacheByID(user.id);
		user.avatar = destFileName;
		user.avatarLastChanged = Date.now();
		await this.store.userStore.replace(user);
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
		const existingUser = await this.store.userStore.get(user.name);
		if (existingUser) {
			return Promise.reject(Error('Username already exists'));
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
		return this.store.userStore.auth(name, pass);
	}

	async authToken(name: string, token: string, salt: string): Promise<User> {
		return this.store.userStore.authToken(name, token, salt);
	}

	async updateUser(user: User): Promise<void> {
		await this.store.userStore.replace(user);
		delete this.cached[user.id];
	}
}
