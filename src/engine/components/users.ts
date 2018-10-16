import {JamServe} from '../../model/jamserve';
import {fileDeleteIfExists} from '../../utils/fs-utils';
import path from 'path';
import {Store} from '../../store/store';
import {Images} from '../../io/images';
import {Config} from '../../config';

export class Users {
	cached: {
		[id: string]: JamServe.User;
	} = {};
	store: Store;
	images: Images;
	imagesPath: string;

	constructor(config: Config, store: Store, images: Images) {
		this.store = store;
		this.images = images;
		this.imagesPath = config.getDataPath(['images']);
	}

	clearCache() {
		this.cached = {};
	}

	async setUserImage(user: JamServe.User, filename: string): Promise<void> {
		const destFileName = 'avatar-' + user.id + '.png';
		const destName = path.join(this.imagesPath, destFileName);
		await fileDeleteIfExists(destName);
		await this.images.createAvatar(filename, destName);
		await this.images.clearImageCacheByID(user.id);
		user.avatar = destFileName;
		user.avatarLastChanged = Date.now();
		await this.store.user.replace(user);
	}

	async deleteUser(user: JamServe.User): Promise<void> {
		delete this.cached[user.id];
		await this.store.state.removeByQuery({userID: user.id});
		await this.store.playlist.removeByQuery({userID: user.id});
		await this.store.bookmark.removeByQuery({userID: user.id});
		await this.store.playqueue.removeByQuery({userID: user.id});
		await this.images.clearImageCacheByID(user.id);
		await this.store.user.remove(user.id);
		// TODO: remove user chat msg on user.delete
		// this.cachedata.chat = this.cachedata.chat.filter(c => c.username === user.name);
		if (user.avatar) {
			await fileDeleteIfExists(path.join(this.imagesPath, user.avatar));
		}
	}

	async createUser(user: JamServe.User): Promise<string> {
		if (!user.name || user.name.trim().length === 0) {
			return Promise.reject(Error('Invalid Username'));
		}
		const existingUser = await this.store.user.get(user.name);
		if (existingUser) {
			return Promise.reject(Error('Username already exists'));
		}
		return this.store.user.add(user);
	}

	async getUser(id: string): Promise<JamServe.User | undefined> {
		let user: JamServe.User | undefined = this.cached[id];
		if (user) {
			return user;
		}
		user = await this.store.user.byId(id);
		if (user) {
			this.cached[id] = user;
		}
		return user;
	}

	async auth(name: string, pass: string): Promise<JamServe.User> {
		return this.store.user.auth(name, pass);
	}

	async authToken(name: string, token: string, salt: string): Promise<JamServe.User> {
		return this.store.user.authToken(name, token, salt);
	}

	async updateUser(user: JamServe.User): Promise<void> {
		await this.store.user.replace(user);
		delete this.cached[user.id];
	}
}
