import { SubsonicToken, User, UserPage } from './user.model.js';
import { User as ORMUser } from './user.js';
import { Orm } from '../../modules/engine/services/orm.service.js';
import { UserRole } from '../../types/enums.js';
import { IncludesUserParameters, UserEmailUpdateParameters, UserFilterParameters, UserGenerateImageParameters, UserSubsonicTokenGenerateParameters, UserMutateParameters, UserOrderParameters, UserPasswordUpdateParameters } from './user.parameters.js';
import { randomString } from '../../utils/random.js';
import { PageParameters } from '../base/base.parameters.js';
import { Context } from '../../modules/engine/rest/context.js';
import { EngineService } from '../../modules/engine/services/engine.service.js';
import { Controller } from '../../modules/rest/decorators/controller.js';
import { Get } from '../../modules/rest/decorators/get.js';
import { QueryParameter } from '../../modules/rest/decorators/query-parameter.js';
import { QueryParameters } from '../../modules/rest/decorators/query-parameters.js';
import { RestContext } from '../../modules/rest/decorators/rest-context.js';
import { Post } from '../../modules/rest/decorators/post.js';
import { BodyParameters } from '../../modules/rest/decorators/body-parameters.js';
import { BodyParameter } from '../../modules/rest/decorators/body-parameter.js';
import { invalidParameterError, notFoundError, unauthError } from '../../modules/deco/express/express-error.js';
import { UploadFile } from '../../modules/deco/definitions/upload-file.js';
import { Upload } from '../../modules/rest/decorators/upload.js';

@Controller('/user', { tags: ['User'] })
export class UserController {
	@Get('/id',
		() => User,
		{ description: 'Get an User by Id', roles: [UserRole.admin], summary: 'Get User' }
	)
	async id(
		@QueryParameter('id', { description: 'User Id', isID: true }) id: string,
		@QueryParameters() parameters: IncludesUserParameters,
		@RestContext() { orm, engine, user }: Context
	): Promise<User> {
		return engine.transform.User.user(orm, await orm.User.oneOrFailByID(id), parameters, user);
	}

	@Get(
		'/search',
		() => UserPage,
		{ description: 'Search Users', roles: [UserRole.admin] }
	)
	async search(
		@QueryParameters() page: PageParameters,
		@QueryParameters() parameters: IncludesUserParameters,
		@QueryParameters() filter: UserFilterParameters,
		@QueryParameters() order: UserOrderParameters,
		@RestContext() { orm, engine, user }: Context
	): Promise<UserPage> {
		return await orm.User.searchTransformFilter(
			filter, [order], page, user,
			o => engine.transform.User.user(orm, o, parameters, user)
		);
	}

	@Post(
		'/create',
		() => User,
		{ description: 'Create an User', roles: [UserRole.admin], summary: 'Create User' }
	)
	async create(
		@BodyParameters() parameters: UserMutateParameters,
		@RestContext() { orm, engine, user }: Context
	): Promise<User> {
		await UserController.validatePassword(orm, engine, parameters.password, user);
		return engine.transform.User.user(orm, await engine.user.create(orm, parameters), {}, user);
	}

	@Post(
		'/update',
		() => User,
		{ description: 'Update an User', roles: [UserRole.admin], summary: 'Update User' }
	)
	async update(
		@BodyParameter('id', { description: 'User Id', isID: true }) id: string,
		@BodyParameters() parameters: UserMutateParameters,
		@RestContext() { orm, engine, user }: Context
	): Promise<User> {
		await UserController.validatePassword(orm, engine, parameters.password, user);
		const u = id === user.id ? user : await orm.User.oneOrFailByID(id);
		if (user.id === id) {
			if (!parameters.roleAdmin) {
				throw invalidParameterError('roleAdmin', `You can't de-admin yourself`);
			}
			if (!parameters.roleStream) {
				throw invalidParameterError('roleStream', `You can't remove api access for yourself`);
			}
		}
		return engine.transform.User.user(orm, await engine.user.update(orm, u, parameters), {}, user);
	}

	@Post(
		'/remove',
		{ description: 'Remove an User', roles: [UserRole.admin], summary: 'Remove User' }
	)
	async remove(
		@BodyParameter('id', { description: 'User Id', isID: true }) id: string,
		@RestContext() { orm, engine, user }: Context
	): Promise<void> {
		if (user.id === id) {
			throw invalidParameterError('id', `You can't remove yourself`);
		}
		const u = await orm.User.oneOrFailByID(id);
		await engine.user.remove(orm, u);
	}

	@Post(
		'/password/update',
		{ description: 'Set an User Password', roles: [UserRole.stream], summary: 'Change Password' }
	)
	async changePassword(
		@BodyParameter('id', { description: 'User Id', isID: true }) id: string,
		@BodyParameters() parameters: UserPasswordUpdateParameters,
		@RestContext() { orm, engine, user }: Context
	): Promise<void> {
		const u = await this.checkUserAccess(orm, engine, id, parameters.password, user);
		return engine.user.setUserPassword(orm, u, parameters.newPassword);
	}

	@Post(
		'/email/update',
		{ description: 'Set an User Email Address', roles: [UserRole.stream], summary: 'Change Email' }
	)
	async changeEmail(
		@BodyParameter('id', { description: 'User Id', isID: true }) id: string,
		@BodyParameters() parameters: UserEmailUpdateParameters,
		@RestContext() { orm, engine, user }: Context
	): Promise<void> {
		const u = await this.checkUserAccess(orm, engine, id, parameters.password, user);
		return engine.user.setUserEmail(orm, u, parameters.email);
	}

	@Post(
		'/image/random',
		{ description: 'Generate a random User Image', roles: [UserRole.stream], summary: 'Set Random Image' }
	)
	async generateUserImage(
		@BodyParameter('id', { description: 'User Id', isID: true }) id: string,
		@BodyParameters() parameters: UserGenerateImageParameters,
		@RestContext() { orm, engine, user }: Context
	): Promise<void> {
		const u = await UserController.validateUserOrAdmin(orm, id, user);
		await engine.user.generateAvatar(u, parameters.seed ?? randomString(42));
	}

	@Post(
		'/image/upload',
		{ description: 'Upload an User Image', roles: [UserRole.stream], summary: 'Upload Image' }
	)
	async uploadUserImage(
		@BodyParameter('id', { description: 'User Id', isID: true }) id: string,
		@Upload('image') file: UploadFile,
		@RestContext() { orm, engine, user }: Context
	): Promise<void> {
		const u = await UserController.validateUserOrAdmin(orm, id, user);
		return engine.user.setUserImage(u, file.name);
	}

	@Post(
		'/subsonic/generate',
		() => SubsonicToken,
		{ description: 'Generate a subsonic client token', roles: [UserRole.stream], summary: 'Subsonic Token' }
	)
	async generateSubsonicToken(
		@BodyParameter('id', { description: 'User Id', isID: true }) id: string,
		@BodyParameters() parameters: UserSubsonicTokenGenerateParameters,
		@RestContext() { orm, engine, user }: Context
	): Promise<SubsonicToken> {
		const u = await this.checkUserAccess(orm, engine, id, parameters.password, user);
		const session = await engine.session.createSubsonic(u.id);
		if (!session) {
			return Promise.reject(notFoundError());
		}
		return { token: session.jwth };
	}

	private static async validatePassword(orm: Orm, engine: EngineService, password: string, user: ORMUser): Promise<void> {
		const result = await engine.user.auth(orm, user.name, password);
		if (!result) {
			return Promise.reject(unauthError());
		}
	}

	private async checkUserAccess(orm: Orm, engine: EngineService, userID: string, password: string, user: ORMUser): Promise<ORMUser> {
		await UserController.validatePassword(orm, engine, password, user);
		if (userID === user.id || user.roleAdmin) {
			return userID === user.id ? user : await orm.User.oneOrFailByID(userID);
		}
		return Promise.reject(unauthError());
	}

	private static async validateUserOrAdmin(orm: Orm, id: string, user: ORMUser): Promise<ORMUser> {
		if (id === user.id) {
			return user;
		}
		if (!user.roleAdmin) {
			throw unauthError();
		}
		return await orm.User.oneOrFailByID(id);
	}
}
