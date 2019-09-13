import commonPassword from 'common-password-checker';
import {Md5} from 'md5-typescript';
import path from 'path';
import {ImageModule} from '../../modules/image/image.module';
import {ApiBinaryResult} from '../../typings';
import {fileDeleteIfExists} from '../../utils/fs-utils';
import {hashSalt, hashSaltPassword} from '../../utils/salthash';
import {BaseStoreService} from '../base/base.service';
import {BookmarkStore} from '../bookmark/bookmark.store';
import {PlaylistStore} from '../playlist/playlist.store';
import {PlayQueueStore} from '../playqueue/playqueue.store';
import {StateStore} from '../state/state.store';
import {User} from './user.model';
import {SearchQueryUser, UserStore} from './user.store';

export class UserService extends BaseStoreService<User, SearchQueryUser> {
	private cachedUsers = new Map<string, User>();

	constructor(
		public userAvatarPath: string, public userStore: UserStore,
		private stateStore: StateStore, private playlistStore: PlaylistStore,
		private bookmarkStore: BookmarkStore, private playQueueStore: PlayQueueStore,
		private imageModule: ImageModule
	) {
		super(userStore);
	}

	async getUserImage(user: User, size?: number, format?: string): Promise<ApiBinaryResult | undefined> {
		if (!user.avatar) {
			await this.generateAvatar(user);
		}
		if (user.avatar) {
			return this.imageModule.get(user.id, path.join(this.userAvatarPath, user.avatar), size, format);
		}
	}

	async generateAvatar(user: User): Promise<void> {
		const destFileName = `avatar-${user.id}.png`;
		const destName = path.join(this.userAvatarPath, destFileName);
		await fileDeleteIfExists(destName);
		await this.imageModule.clearImageCacheByID(user.id);
		await this.imageModule.generateAvatar(user.name, destName);
		user.avatar = destFileName;
		user.avatarLastChanged = Date.now();
		await this.update(user);
	}

	async setUserImage(user: User, filename: string, mimetype?: string): Promise<void> {
		const destFileName = `avatar-${user.id}.png`;
		const destName = path.join(this.userAvatarPath, destFileName);
		await fileDeleteIfExists(destName);
		await this.imageModule.createAvatar(filename, destName);
		await fileDeleteIfExists(filename);
		await this.imageModule.clearImageCacheByID(user.id);
		user.avatar = destFileName;
		user.avatarLastChanged = Date.now();
		await this.update(user);
	}

	async create(user: User): Promise<string> {
		if (!user.name || user.name.trim().length === 0) {
			return Promise.reject(Error('Invalid Username'));
		}
		const existingUser = await this.getByName(user.name);
		if (existingUser) {
			return Promise.reject(Error('Username already exists'));
		}
		return this.userStore.add(user);
	}

	async update(user: User): Promise<void> {
		await this.userStore.replace(user);
		this.cachedUsers.delete(user.id);
	}

	async remove(user: User): Promise<void> {
		this.cachedUsers.delete(user.id);
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
		for (const c of this.cachedUsers) {
			if (c[1].name === name) {
				return c[1];
			}
		}
		const user = await this.userStore.searchOne({name});
		if (user) {
			this.cachedUsers.set(user.id, user);
		}
		return user;
	}

	async getByID(id: string): Promise<User | undefined> {
		let user: User | undefined = this.cachedUsers.get(id);
		if (user) {
			return user;
		}
		user = await this.userStore.byId(id);
		if (user) {
			this.cachedUsers.set(id, user);
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
		const hash = hashSalt(pass, user.salt);
		if (hash !== user.hash) {
			return Promise.reject(Error('Invalid Password'));
		}
		return user;
	}

	async authSubsonic(name: string, pass: string): Promise<User> {
		if ((!pass) || (!pass.length)) {
			return Promise.reject(Error('Invalid Password'));
		}
		const user = await this.getByName(name);
		if (!user) {
			return Promise.reject(Error('Invalid Username'));
		}
		if (pass !== user.subsonic_pass) {
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
		const t = Md5.init(user.subsonic_pass + salt);
		if (token !== t) {
			return Promise.reject(Error('Invalid Token'));
		}
		return user;
	}

	public clearCache(): void {
		this.cachedUsers.clear();
	}

	async setUserPassword(user: User, pass: string): Promise<void> {
		await this.testPassword(pass);
		const pw = hashSaltPassword(pass);
		user.salt = pw.salt;
		user.hash = pw.hash;
		await this.userStore.replace(user);
		this.cachedUsers.delete(user.id);
	}

	async testPassword(password: string): Promise<void> {
		if ((!password) || (!password.trim().length)) {
			return Promise.reject(Error('Invalid Password'));
		}
		if (password.length < 4) {
			return Promise.reject(Error('Password is too short'));
		}
		if (commonPassword(password)) {
			return Promise.reject(Error('Your password is found in the most frequently used password list and too easy to guess'));
		}
	}

	async setUserEmail(user: User, email: string): Promise<void> {
		if ((!email) || (!email.trim().length)) {
			return Promise.reject(Error('Invalid Email'));
		}
		user.email = email;
		await this.userStore.replace(user);
		this.cachedUsers.delete(user.id);
	}
}
