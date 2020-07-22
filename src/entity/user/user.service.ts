import {User} from './user';
import {Orm} from '../../modules/engine/services/orm.service';
import {hashAndSaltSHA512, hashSaltSHA512} from '../../utils/hash';
import {UserRole} from '../../types/enums';
import {JWTPayload} from '../../utils/jwt';
import {Inject, InRequestScope} from 'typescript-ioc';
import path from 'path';
import fse from 'fs-extra';
import {ApiBinaryResult} from '../../modules/rest/builder/express-responder';
import {ConfigService} from '../../modules/engine/services/config.service';
import {fileDeleteIfExists} from '../../utils/fs-utils';
import {ImageModule} from '../../modules/image/image.module';
import commonPassword from 'common-password-checker';
import {UserMutateArgs} from './user.args';
import {randomString} from '../../utils/random';

@InRequestScope
export class UserService {
	@Inject
	private configService!: ConfigService;
	@Inject
	private imageModule!: ImageModule;
	private readonly userAvatarPath: string;

	constructor() {
		this.userAvatarPath = this.configService.getDataPath(['images']);
	}

	async findByName(orm: Orm, name: string): Promise<User | undefined> {
		if (!name || name.trim().length === 0) {
			return Promise.reject(Error('Invalid Username'));
		}
		return await orm.User.findOne({where: {name}});
	}

	async findByID(orm: Orm, id: string): Promise<User | undefined> {
		const user = await orm.User.findOneByID(id);
		return user || undefined;
	}

	async auth(orm: Orm, name: string, pass: string): Promise<User> {
		if ((!pass) || (!pass.length)) {
			return Promise.reject(Error('Invalid Password'));
		}
		const user = await this.findByName(orm, name);
		if (!user) {
			return Promise.reject(Error('Invalid Username'));
		}
		const hash = hashSaltSHA512(pass, user.salt);
		if (hash !== user.hash) {
			return Promise.reject(Error('Invalid Password'));
		}
		return user;
	}

	public async authJWT(orm: Orm, jwtPayload: JWTPayload): Promise<User | undefined> {
		if (!jwtPayload || !jwtPayload.id) {
			return Promise.reject(Error('Invalid token'));
		}
		return await orm.User.findOneByID(jwtPayload.id);
	}

	static listfyRoles(user: User): Array<UserRole> {
		const result: Array<UserRole> = [];
		if (user.roleAdmin) {
			result.push(UserRole.admin);
		}
		if (user.roleStream) {
			result.push(UserRole.stream);
		}
		if (user.rolePodcast) {
			result.push(UserRole.podcast);
		}
		if (user.roleUpload) {
			result.push(UserRole.upload);
		}
		return result;
	}

	private avatarImageFilename(user: User): string {
		return path.join(this.userAvatarPath, `avatar-${user.id}.png`);
	}

	async getImage(orm: Orm, user: User, size?: number, format?: string): Promise<ApiBinaryResult | undefined> {
		const filename = this.avatarImageFilename(user);
		let exists = await fse.pathExists(filename);
		if (!exists) {
			await this.generateAvatar(user);
			exists = await fse.pathExists(filename);
		}
		if (exists) {
			return this.imageModule.get(user.id, filename, size, format);
		}
	}

	async generateAvatar(user: User, seed?: string): Promise<void> {
		const filename = this.avatarImageFilename(user);
		await fileDeleteIfExists(filename);
		await this.imageModule.generateAvatar(seed || user.name, filename);
		await this.imageModule.clearImageCacheByIDs([user.id]);
	}

	async setUserImage(user: User, filename: string, mimetype?: string): Promise<void> {
		const destName = this.avatarImageFilename(user);
		await this.imageModule.createAvatar(filename, destName);
		await fileDeleteIfExists(filename);
		await this.imageModule.clearImageCacheByIDs([user.id]);
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

	async setUserPassword(orm: Orm, user: User, pass: string): Promise<void> {
		await this.testPassword(pass);
		const pw = hashAndSaltSHA512(pass);
		user.salt = pw.salt;
		user.hash = pw.hash;
		await orm.User.persistAndFlush(user);
	}

	async setUserEmail(orm: Orm, user: User, email: string): Promise<void> {
		if ((!email) || (!email.trim().length)) {
			return Promise.reject(Error('Invalid Email'));
		}
		user.email = email;
		await orm.User.persistAndFlush(user);
	}

	async remove(orm: Orm, user: User): Promise<void> {
		/*
			await this.stateStore.removeByQuery({userID: user.id});
		await this.playlistStore.removeByQuery({userID: user.id});
		await this.bookmarkStore.removeByQuery({userID: user.id});
		await this.playQueueStore.removeByQuery({userID: user.id});
		await this.sessionStore.removeByQuery({userID: user.id});
		await this.userStore.remove(user.id);
		 */
		await orm.User.removeAndFlush(user);
		await this.imageModule.clearImageCacheByIDs([user.id]);
		await fileDeleteIfExists(this.avatarImageFilename(user));
	}

	public async createUser(orm: Orm,
							name: string,
							email: string,
							pass: string,
							roleAdmin: boolean,
							roleStream: boolean,
							roleUpload: boolean,
							rolePodcast: boolean
	): Promise<User> {
		const pw = hashAndSaltSHA512(pass);
		const user: User = orm.User.create({name: name || '', salt: pw.salt, hash: pw.hash, email, roleAdmin, roleStream, roleUpload, rolePodcast});
		await orm.User.persistAndFlush(user);
		return user;
	}

	public async create(orm: Orm, args: UserMutateArgs): Promise<User> {
		if (!args.name || args.name.trim().length === 0) {
			return Promise.reject(Error('Invalid Username'));
		}
		const existingUser = await orm.User.findOne({where: {name: args.name}});
		if (existingUser) {
			return Promise.reject(Error('Username already exists'));
		}
		const pass = randomString(16);
		return await this.createUser(orm, args.name,
			args.email || '', pass, !!args.roleAdmin, !!args.roleStream, !!args.roleUpload, !!args.rolePodcast);
	}

	public async update(orm: Orm, user: User, args: UserMutateArgs): Promise<User> {
		if (!args.name || args.name.trim().length === 0) {
			return Promise.reject(Error('Invalid Username'));
		}
		const existingUser = await orm.User.findOne({where: {name: args.name}});
		if (existingUser && existingUser.id !== user.id) {
			return Promise.reject(Error('Username already exists'));
		}
		user.name = args.name;
		user.email = args.email || user.email;
		user.roleAdmin = !!args.roleAdmin;
		user.rolePodcast = !!args.rolePodcast;
		user.roleStream = !!args.roleStream;
		user.roleUpload = !!args.roleUpload;
		await orm.User.persistAndFlush(user);
		return user;
	}
}
