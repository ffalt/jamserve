import { User } from './user.js';
import { Orm } from '../../modules/engine/services/orm.service.js';
import { bcryptComparePassword, bcryptPassword } from '../../utils/bcrypt.js';
import { SessionMode, UserRole } from '../../types/enums.js';
import { JWTPayload } from '../../utils/jwt.js';
import { Inject, InRequestScope } from 'typescript-ioc';
import path from 'path';
import fse from 'fs-extra';
import { ConfigService } from '../../modules/engine/services/config.service.js';
import { fileDeleteIfExists } from '../../utils/fs-utils.js';
import { ImageModule } from '../../modules/image/image.module.js';
import commonPassword from 'common-password-checker';
import { UserMutateArgs } from './user.args.js';
import { randomString } from '../../utils/random.js';
import { InvalidParamError, UnauthError } from '../../modules/deco/express/express-error.js';
import { ApiBinaryResult } from '../../modules/deco/express/express-responder.js';
import { hashMD5 } from '../../utils/md5.js';
import { SubsonicApiError, SubsonicFormatter } from '../../modules/subsonic/formatter.js';

@InRequestScope
export class UserService {
	@Inject
	private readonly configService!: ConfigService;

	@Inject
	private readonly imageModule!: ImageModule;

	private readonly userAvatarPath: string;

	constructor() {
		this.userAvatarPath = this.configService.getDataPath(['images']);
	}

	async findByName(orm: Orm, name: string): Promise<User | undefined> {
		if (!name || name.trim().length === 0) {
			return Promise.reject(UnauthError('Invalid Username'));
		}
		return await orm.User.findOne({ where: { name } });
	}

	async findByID(orm: Orm, id: string): Promise<User | undefined> {
		const user = await orm.User.findOneByID(id);
		return user || undefined;
	}

	async auth(orm: Orm, name: string, pass: string): Promise<User> {
		if (!pass?.length) {
			return Promise.reject(InvalidParamError('password', 'Invalid Password'));
		}
		const user = await this.findByName(orm, name);
		if (!user) {
			return Promise.reject(InvalidParamError('username', 'Invalid Username'));
		}
		if (!(await bcryptComparePassword(pass, user.hash))) {
			return Promise.reject(InvalidParamError('password', 'Invalid Password'));
		}
		return user;
	}

	public async authJWT(orm: Orm, jwtPayload: JWTPayload): Promise<User | undefined> {
		if (!jwtPayload?.id) {
			return Promise.reject(InvalidParamError('token', 'Invalid token'));
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
		return;
	}

	async generateAvatar(user: User, seed?: string): Promise<void> {
		const filename = this.avatarImageFilename(user);
		await fileDeleteIfExists(filename);
		await this.imageModule.generateAvatar(seed || user.name, filename);
		await this.imageModule.clearImageCacheByIDs([user.id]);
	}

	async setUserImage(user: User, filename: string): Promise<void> {
		const destName = this.avatarImageFilename(user);
		await this.imageModule.createAvatar(filename, destName);
		await fileDeleteIfExists(filename);
		await this.imageModule.clearImageCacheByIDs([user.id]);
	}

	async validatePassword(password: string): Promise<void> {
		if (!password?.trim().length) {
			return Promise.reject(InvalidParamError('Invalid Password'));
		}
		if (password.length < 4) {
			return Promise.reject(InvalidParamError('Password is too short'));
		}
		if (commonPassword(password)) {
			return Promise.reject(Error('Your password is found in the most frequently used password list and too easy to guess'));
		}
	}

	async setUserPassword(orm: Orm, user: User, pass: string): Promise<void> {
		await this.validatePassword(pass);
		user.hash = await bcryptPassword(pass);
		await orm.User.persistAndFlush(user);
	}

	async setUserEmail(orm: Orm, user: User, email: string): Promise<void> {
		if (!email?.trim().length) {
			return Promise.reject(InvalidParamError('email', 'Invalid Email'));
		}
		user.email = email;
		await orm.User.persistAndFlush(user);
	}

	async remove(orm: Orm, user: User): Promise<void> {
		await orm.User.removeAndFlush(user);
		await this.imageModule.clearImageCacheByIDs([user.id]);
		await fileDeleteIfExists(this.avatarImageFilename(user));
	}

	public async createUser(
		orm: Orm, name: string, email: string, pass: string,
		roleAdmin: boolean, roleStream: boolean, roleUpload: boolean, rolePodcast: boolean): Promise<User> {
		const hashAndSalt = await bcryptPassword(pass);
		const user: User = orm.User.create({ name, hash: hashAndSalt, email, roleAdmin, roleStream, roleUpload, rolePodcast });
		await orm.User.persistAndFlush(user);
		return user;
	}

	public async create(orm: Orm, args: UserMutateArgs): Promise<User> {
		if (!args?.name.trim().length) {
			return Promise.reject(InvalidParamError('name', 'Invalid Username'));
		}
		const existingUser = await orm.User.findOne({ where: { name: args.name } });
		if (existingUser) {
			return Promise.reject(InvalidParamError('name', 'Username already exists'));
		}
		const pass = randomString(32);
		return await this.createUser(orm, args.name,
			args.email || '', pass, !!args.roleAdmin, !!args.roleStream, !!args.roleUpload, !!args.rolePodcast);
	}

	public async update(orm: Orm, user: User, args: UserMutateArgs): Promise<User> {
		if (!args?.name.trim().length) {
			return Promise.reject(InvalidParamError('name', 'Invalid Username'));
		}
		const existingUser = await orm.User.findOne({ where: { name: args.name } });
		if (existingUser && existingUser.id !== user.id) {
			return Promise.reject(InvalidParamError('name', 'Username already exists'));
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

	public async authSubsonicPassword(orm: Orm, name: string, pass: string): Promise<User> {
		if (!pass?.length) {
			return Promise.reject(new SubsonicApiError(SubsonicFormatter.ERRORS.PARAM_MISSING));
		}
		const user = await orm.User.findOne({ where: { name } });
		if (!user) {
			return Promise.reject(new SubsonicApiError(SubsonicFormatter.ERRORS.LOGIN_FAILED));
		}
		const session = await orm.Session.findOne({ where: { user: user.id, mode: SessionMode.subsonic } });
		if (!session) {
			return Promise.reject(new SubsonicApiError(SubsonicFormatter.ERRORS.LOGIN_FAILED));
		}
		if (pass !== session.jwth) {
			return Promise.reject(new SubsonicApiError(SubsonicFormatter.ERRORS.LOGIN_FAILED));
		}
		return user;
	}

	public async authSubsonicToken(orm: Orm, name: string, token: string, salt: string): Promise<User> {
		if (!name?.trim().length) {
			return Promise.reject(new SubsonicApiError(SubsonicFormatter.ERRORS.PARAM_MISSING));
		}
		if (!token?.length) {
			return Promise.reject(new SubsonicApiError(SubsonicFormatter.ERRORS.PARAM_MISSING));
		}
		const user = await orm.User.findOne({ where: { name } });
		if (!user) {
			return Promise.reject(new SubsonicApiError(SubsonicFormatter.ERRORS.LOGIN_FAILED));
		}
		const session = await orm.Session.findOne({ where: { user: user.id, mode: SessionMode.subsonic } });
		if (!session) {
			return Promise.reject(new SubsonicApiError(SubsonicFormatter.ERRORS.LOGIN_FAILED));
		}
		const t = hashMD5(session.jwth + salt);
		if (token !== t) {
			return Promise.reject(new SubsonicApiError(SubsonicFormatter.ERRORS.LOGIN_FAILED));
		}
		return user;
	}
}
