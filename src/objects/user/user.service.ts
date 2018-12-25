import {fileDeleteIfExists} from '../../utils/fs-utils';
import path from 'path';
import {User} from './user.model';
import {Md5} from 'md5-typescript';
import {SearchQueryUser, UserStore} from './user.store';
import {StateStore} from '../state/state.store';
import {PlaylistStore} from '../playlist/playlist.store';
import {PlayQueueStore} from '../playqueue/playqueue.store';
import {BookmarkStore} from '../bookmark/bookmark.store';
import {IApiBinaryResult} from '../../typings';
import {ImageModule} from '../../modules/image/image.module';
import {BaseStoreService} from '../base/base.service';

export class UserService extends BaseStoreService<User, SearchQueryUser> {
	private cached: {
		[id: string]: User;
	} = {};

	constructor(public userAvatarPath: string, public userStore: UserStore, private stateStore: StateStore, private playlistStore: PlaylistStore, private bookmarkStore: BookmarkStore,
				private playQueueStore: PlayQueueStore, private imageModule: ImageModule) {
		super(userStore);
	}

	async getUserImage(user: User, size?: number, format?: string): Promise<IApiBinaryResult | undefined> {
		if (user.avatar) {
			return this.imageModule.get(user.id, path.join(this.userAvatarPath, user.avatar), size, format);
		}
	}

	async setUserImage(user: User, filename: string): Promise<void> {
		const destFileName = 'avatar-' + user.id + '.png';
		const destName = path.join(this.userAvatarPath, destFileName);
		await fileDeleteIfExists(destName);
		await this.imageModule.createAvatar(filename, destName);
		await this.imageModule.clearImageCacheByID(user.id);
		user.avatar = destFileName;
		user.avatarLastChanged = Date.now();
		await this.update(user);
	}

	async create(user: User): Promise<string> {
		if (!user.name || user.name.trim().length === 0) {
			return Promise.reject(Error('Invalid Username'));
		}
		if (!user.pass || user.pass.trim().length === 0) {
			return Promise.reject(Error('Invalid Password'));
		}
		const existingUser = await this.getByName(user.name);
		if (existingUser) {
			return Promise.reject(Error('Username already exists'));
		}
		return this.userStore.add(user);
	}

	async update(user: User): Promise<void> {
		await this.userStore.replace(user);
		delete this.cached[user.id];
	}

	async remove(user: User): Promise<void> {
		delete this.cached[user.id];
		await this.stateStore.removeByQuery({userID: user.id});
		await this.playlistStore.removeByQuery({userID: user.id});
		await this.bookmarkStore.removeByQuery({userID: user.id});
		await this.playQueueStore.removeByQuery({userID: user.id});
		await this.imageModule.clearImageCacheByID(user.id);
		await this.userStore.remove(user.id);
		// TODO: remove user chat msg on user.delete
		if (user.avatar) {
			await fileDeleteIfExists(path.join(this.userAvatarPath, user.avatar));
		}
	}

	async getByName(name: string): Promise<User | undefined> {
		if (!name || name.trim().length === 0) {
			return Promise.reject(Error('Invalid Username'));
		}
		const ids = Object.keys(this.cached);
		for (const id of ids) {
			if (this.cached[id].name === name) {
				return this.cached[id];
			}
		}
		const user = await this.userStore.searchOne({name});
		if (user) {
			this.cached[user.id] = user;
		}
		return user;
	}

	async getByID(id: string): Promise<User | undefined> {
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
		if ((!pass) || (!pass.length)) {
			return Promise.reject(Error('Invalid Password'));
		}
		const user = await this.getByName(name);
		if (!user) {
			return Promise.reject(Error('Invalid Username'));
		}
		if (pass !== user.pass) {
			return Promise.reject(Error('Invalid Password'));
		}
		return user;
	}

	async authToken(name: string, token: string, salt: string): Promise<User> {
		if (!name || name.trim().length === 0) {
			return Promise.reject(Error('Invalid Username'));
		}
		if ((!token) || (!token.length)) {
			return Promise.reject(Error('Invalid Token'));
		}
		const user = await this.getByName(name);
		if (!user) {
			return Promise.reject(Error('Invalid Username'));
		}
		const t = Md5.init(user.pass + salt);
		if (token !== t) {
			return Promise.reject(Error('Invalid Token'));
		}
		return user;
	}

	public clearCache() {
		this.cached = {};
	}
}
