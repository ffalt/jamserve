import { User, UserPage } from './user.model.js';
import { User as ORMUser } from './user.js';
import { Orm } from '../../modules/engine/services/orm.service.js';
import { UserRole } from '../../types/enums.js';
import { IncludesUserArgs, UserEmailUpdateArgs, UserFilterArgs, UserGenerateImageArgs, UserMutateArgs, UserOrderArgs, UserPasswordUpdateArgs } from './user.args.js';
import { randomString } from '../../utils/random.js';
import { PageArgs } from '../base/base.args.js';
import { Context } from '../../modules/engine/rest/context.js';
import { EngineService } from '../../modules/engine/services/engine.service.js';
import {Controller} from '../../modules/rest/decorators/Controller.js';
import {Get} from '../../modules/rest/decorators/Get.js';
import {QueryParam} from '../../modules/rest/decorators/QueryParam.js';
import {QueryParams} from '../../modules/rest/decorators/QueryParams.js';
import {Ctx} from '../../modules/rest/decorators/Ctx.js';
import {Post} from '../../modules/rest/decorators/Post.js';
import {BodyParams} from '../../modules/rest/decorators/BodyParams.js';
import {BodyParam} from '../../modules/rest/decorators/BodyParam.js';
import {InvalidParamError, UnauthError} from '../../modules/deco/express/express-error.js';
import {UploadFile} from '../../modules/deco/definitions/upload-file.js';
import {Upload} from '../../modules/rest/decorators/Upload.js';

@Controller('/user', { tags: ['User'] })
export class UserController {
	@Get('/id',
		() => User,
		{ description: 'Get an User by Id', roles: [UserRole.admin], summary: 'Get User' }
	)
	async id(
		@QueryParam('id', { description: 'User Id', isID: true }) id: string,
		@QueryParams() userArgs: IncludesUserArgs,
		@Ctx() { orm, engine, user }: Context
	): Promise<User> {
		return engine.transform.User.user(orm, await orm.User.oneOrFailByID(id), userArgs, user);
	}

	@Get(
		'/search',
		() => UserPage,
		{ description: 'Search Users', roles: [UserRole.admin] }
	)
	async search(
		@QueryParams() page: PageArgs,
		@QueryParams() userArgs: IncludesUserArgs,
		@QueryParams() filter: UserFilterArgs,
		@QueryParams() order: UserOrderArgs,
		@Ctx() { orm, engine, user }: Context
	): Promise<UserPage> {
		return await orm.User.searchTransformFilter(
			filter, [order], page, user,
			o => engine.transform.User.user(orm, o, userArgs, user)
		);
	}

	@Post(
		'/create',
		() => User,
		{ description: 'Create an User', roles: [UserRole.admin], summary: 'Create User' }
	)
	async create(
		@BodyParams() args: UserMutateArgs,
		@Ctx() { orm, engine, user }: Context
	): Promise<User> {
		await UserController.validatePassword(orm, engine, args.password, user);
		return engine.transform.User.user(orm, await engine.user.create(orm, args), {}, user);
	}

	@Post(
		'/update',
		() => User,
		{ description: 'Update an User', roles: [UserRole.admin], summary: 'Update User' }
	)
	async update(
		@BodyParam('id', { description: 'User Id', isID: true }) id: string,
		@BodyParams() args: UserMutateArgs,
		@Ctx() { orm, engine, user }: Context
	): Promise<User> {
		await UserController.validatePassword(orm, engine, args.password, user);
		const u = id === user.id ? user : await orm.User.oneOrFailByID(id);
		if (user.id === id) {
			if (!args.roleAdmin) {
				throw InvalidParamError('roleAdmin', `You can't de-admin yourself`);
			}
			if (!args.roleStream) {
				throw InvalidParamError('roleStream', `You can't remove api access for yourself`);
			}
		}
		return engine.transform.User.user(orm, await engine.user.update(orm, u, args), {}, user);
	}

	@Post(
		'/remove',
		{ description: 'Remove an User', roles: [UserRole.admin], summary: 'Remove User' }
	)
	async remove(
		@BodyParam('id', { description: 'User Id', isID: true }) id: string,
		@Ctx() { orm, engine, user }: Context
	): Promise<void> {
		if (user.id === id) {
			throw InvalidParamError('id', `You can't remove yourself`);
		}
		const u = await orm.User.oneOrFailByID(id);
		await engine.user.remove(orm, u);
	}

	@Post(
		'/password/update',
		{ description: 'Set an User Password', roles: [UserRole.stream], summary: 'Change Password' }
	)
	async changePassword(
		@BodyParam('id', { description: 'User Id', isID: true }) id: string,
		@BodyParams() args: UserPasswordUpdateArgs,
		@Ctx() { orm, engine, user }: Context
	): Promise<void> {
		const u = await this.checkUserAccess(orm, engine, id, args.password, user);
		return engine.user.setUserPassword(orm, u, args.newPassword);
	}

	@Post(
		'/email/update',
		{ description: 'Set an User Email Address', roles: [UserRole.stream], summary: 'Change Email' }
	)
	async changeEmail(
		@BodyParam('id', { description: 'User Id', isID: true }) id: string,
		@BodyParams() args: UserEmailUpdateArgs,
		@Ctx() { orm, engine, user }: Context
	): Promise<void> {
		const u = await this.checkUserAccess(orm, engine, id, args.password, user);
		return engine.user.setUserEmail(orm, u, args.email);
	}

	@Post(
		'/image/random',
		{ description: 'Generate a random User Image', roles: [UserRole.stream], summary: 'Set Random Image' }
	)
	async generateUserImage(
		@BodyParam('id', { description: 'User Id', isID: true }) id: string,
		@BodyParams() args: UserGenerateImageArgs,
		@Ctx() { orm, engine, user }: Context
	): Promise<void> {
		const u = await UserController.validateUserOrAdmin(orm, id, user);
		await engine.user.generateAvatar(u, args.seed || randomString(42));
	}

	@Post(
		'/image/upload',
		{ description: 'Upload an User Image', roles: [UserRole.stream], summary: 'Upload Image' }
	)
	async uploadUserImage(
		@BodyParam('id', { description: 'User Id', isID: true }) id: string,
		@Upload('image') file: UploadFile,
		@Ctx() { orm, engine, user }: Context
	): Promise<void> {
		const u = await UserController.validateUserOrAdmin(orm, id, user);
		return engine.user.setUserImage(u, file.name);
	}

	private static async validatePassword(orm: Orm, engine: EngineService, password: string, user: ORMUser): Promise<void> {
		const result = await engine.user.auth(orm, user.name, password);
		if (!result) {
			return Promise.reject(UnauthError());
		}
	}

	private async checkUserAccess(orm: Orm, engine: EngineService, userID: string, password: string, user: ORMUser): Promise<ORMUser> {
		await UserController.validatePassword(orm, engine, password, user);
		if (userID === user.id || user.roleAdmin) {
			return userID === user.id ? user : await orm.User.oneOrFailByID(userID);
		}
		return Promise.reject(UnauthError());
	}

	private static async validateUserOrAdmin(orm: Orm, id: string, user: ORMUser): Promise<ORMUser> {
		if (id === user.id) {
			return user;
		}
		if (!user.roleAdmin) {
			throw UnauthError();
		}
		return await orm.User.oneOrFailByID(id);
	}
}
