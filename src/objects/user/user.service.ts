import {fileDeleteIfExists} from '../../utils/fs-utils';
import path from 'path';
import {Store} from '../../engine/store';
import {Config} from '../../config';
import {ImageService} from '../../engine/image/image.service';
import {User} from './user.model';
import {hexDecode} from '../../utils/hex';
import {Md5} from 'md5-typescript';
import {UserStore} from './user.store';
import {StateStore} from '../state/state.store';
import {PlaylistStore} from '../playlist/playlist.store';
import {BookmarkStore} from '../bookmark/bookmark.store';
import {PlayQueueStore} from '../playqueue/playqueue.store';

export class UserService {
	private cached: {
		[id: string]: User;
	} = {};

	constructor(private userStore: UserStore, private stateStore: StateStore, private playlistStore: PlaylistStore, private bookmarkStore: BookmarkStore,
				private playQueueStore: PlayQueueStore, private imageService: ImageService) {
	}

	clearCache() {
		this.cached = {};
	}

	async get(name: string): Promise<User | undefined> {
		return await this.userStore.searchOne({'name': name || ''});
	}

	async setUserImage(user: User, filename: string): Promise<void> {
		const destFileName = 'avatar-' + user.id + '.png';
		const destName = path.join(this.imageService.userAvatarPath, destFileName);
		await fileDeleteIfExists(destName);
		await this.imageService.createAvatar(filename, destName);
		await this.imageService.clearImageCacheByID(user.id);
		user.avatar = destFileName;
		user.avatarLastChanged = Date.now();
		await this.updateUser(user);
	}

	async deleteUser(user: User): Promise<void> {
		delete this.cached[user.id];
		await this.stateStore.removeByQuery({userID: user.id});
		await this.playlistStore.removeByQuery({userID: user.id});
		await this.bookmarkStore.removeByQuery({userID: user.id});
		await this.playQueueStore.removeByQuery({userID: user.id});
		await this.imageService.clearImageCacheByID(user.id);
		await this.userStore.remove(user.id);
		// TODO: remove user chat msg on user.delete
		if (user.avatar) {
			await fileDeleteIfExists(path.join(this.imageService.userAvatarPath, user.avatar));
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
		return this.userStore.add(user);
	}

	async getUser(id: string): Promise<User | undefined> {
		let user: User | undefined = this.cached[id];
		if (user) {
			return user;
		}
		user = await this.userStore.byId(id);
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
		await this.userStore.replace(user);
		delete this.cached[user.id];
	}
}
