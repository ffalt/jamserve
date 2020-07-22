import {User, UserPage} from './user.model';
import {User as ORMUser} from './user';
import {Orm} from '../../modules/engine/services/orm.service';
import {InRequestScope, Inject} from 'typescript-ioc';
import {TransformService} from '../../modules/engine/services/transform.service';
import {BodyParam, BodyParams, Controller, Ctx, Get, InvalidParamError, Post, QueryParam, QueryParams, UnauthError, Upload, UploadFile} from '../../modules/rest';
import {UserRole} from '../../types/enums';
import {IncludesUserArgs, UserEmailUpdateArgs, UserFilterArgs, UserGenerateImageArgs, UserMutateArgs, UserOrderArgs, UserPasswordUpdateArgs} from './user.args';
import {UserService} from './user.service';
import {randomString} from '../../utils/random';
import {PageArgs} from '../base/base.args';
import {Context} from '../../modules/engine/rest/context';

@InRequestScope
@Controller('/user', {tags: ['User']})
export class UserController {
	@Inject
	private transform!: TransformService;
	@Inject
	private userService!: UserService;

	@Get('/id',
		() => User,
		{description: 'Get an User by Id', roles: [UserRole.admin], summary: 'Get User'}
	)
	async id(
		@QueryParam('id', {description: 'User Id', isID: true}) id: string,
		@QueryParams() userArgs: IncludesUserArgs,
		@Ctx() {orm, user}: Context
	): Promise<User> {
		return this.transform.user(
			orm, await orm.User.oneOrFailByID(id),
			userArgs, user
		);
	}

	@Get(
		'/search',
		() => UserPage,
		{description: 'Search Users', roles: [UserRole.admin]}
	)
	async search(
		@QueryParams() page: PageArgs,
		@QueryParams() userArgs: IncludesUserArgs,
		@QueryParams() filter: UserFilterArgs,
		@QueryParams() order: UserOrderArgs,
		@Ctx() {orm, user}: Context
	): Promise<UserPage> {
		return await orm.User.searchTransformFilter(
			filter, [order], page, user,
			o => this.transform.user(orm, o, userArgs, user)
		);
	}

	@Post(
		'/create',
		() => User,
		{description: 'Create an User', roles: [UserRole.admin], summary: 'Create User'}
	)
	async create(
		@BodyParams() args: UserMutateArgs,
		@Ctx() {orm, user}: Context
	): Promise<User> {
		await this.validatePassword(orm, args.password, user);
		return this.transform.user(orm, await this.userService.create(orm, args), {}, user);
	}

	@Post(
		'/update',
		() => User,
		{description: 'Update an User', roles: [UserRole.admin], summary: 'Update User'}
	)
	async update(
		@BodyParam('id', {description: 'User Id', isID: true}) id: string,
		@BodyParams() args: UserMutateArgs,
		@Ctx() {orm, user}: Context
	): Promise<User> {
		await this.validatePassword(orm, args.password, user);
		const u = id === user.id ? user : await orm.User.oneOrFailByID(id);
		if (user.id === id) {
			if (!args.roleAdmin) {
				throw InvalidParamError('roleAdmin', `You can't de-admin yourself`);
			}
			if (!args.roleStream) {
				throw InvalidParamError('roleStream', `You can't remove api access for yourself`);
			}
		}
		return this.transform.user(orm, await this.userService.update(orm, u, args), {}, user);
	}

	@Post(
		'/remove',
		{description: 'Remove an User', roles: [UserRole.admin], summary: 'Remove User'}
	)
	async remove(
		@BodyParam('id', {description: 'User Id', isID: true}) id: string,
		@Ctx() {orm, user}: Context
	): Promise<void> {
		if (user.id === id) {
			throw InvalidParamError('id', `You can't remove yourself`);
		}
		const u = await orm.User.oneOrFailByID(id);
		await this.userService.remove(orm, u);
	}

	@Post(
		'/password/update',
		{description: 'Set an User Password', roles: [UserRole.stream], summary: 'Change Password'}
	)
	async changePassword(
		@BodyParam('id', {description: 'User Id', isID: true}) id: string,
		@BodyParams() args: UserPasswordUpdateArgs,
		@Ctx() {orm, user}: Context
	): Promise<void> {
		const u = await this.checkUserAccess(orm, id, args.password, user);
		return this.userService.setUserPassword(orm, u, args.newPassword);
	}

	@Post(
		'/email/update',
		{description: 'Set an User Email Address', roles: [UserRole.stream], summary: 'Change Email'}
	)
	async changeEmail(
		@BodyParam('id', {description: 'User Id', isID: true}) id: string,
		@BodyParams() args: UserEmailUpdateArgs,
		@Ctx() {orm, user}: Context
	): Promise<void> {
		const u = await this.checkUserAccess(orm, id, args.password, user);
		return this.userService.setUserEmail(orm, u, args.email);
	}

	@Post(
		'/image/random',
		{description: 'Generate a random User Image', roles: [UserRole.stream], summary: 'Set Random Image'}
	)
	async generateUserImage(
		@BodyParam('id', {description: 'User Id', isID: true}) id: string,
		@BodyParams() args: UserGenerateImageArgs,
		@Ctx() {orm, user}: Context
	): Promise<void> {
		const u = await this.validateUserOrAdmin(orm, id, user);
		await this.userService.generateAvatar(u, args.seed || randomString(42));
	}

	@Post(
		'/image/upload',
		{description: 'Upload an User Image', roles: [UserRole.stream], summary: 'Upload Image'}
	)
	async uploadUserImage(
		@BodyParam('id', {description: 'User Id', isID: true}) id: string,
		@Upload('image') file: UploadFile,
		@Ctx() {orm, user}: Context
	): Promise<void> {
		const u = await this.validateUserOrAdmin(orm, id, user);
		return this.userService.setUserImage(u, file.name, file.type);
	}

	private async validatePassword(orm: Orm, password: string, user: ORMUser): Promise<void> {
		const result = await this.userService.auth(orm, user.name, password);
		if (!result) {
			return Promise.reject(UnauthError());
		}
	}

	private async checkUserAccess(orm: Orm, userID: string, password: string, user: ORMUser): Promise<ORMUser> {
		await this.validatePassword(orm, password, user);
		if (userID === user.id || user.roleAdmin) {
			return userID === user.id ? user : await orm.User.oneOrFailByID(userID);
		}
		return Promise.reject(UnauthError());
	}

	private async validateUserOrAdmin(orm: Orm, id: string, user: ORMUser): Promise<ORMUser> {
		if (id === user.id) {
			return user;
		}
		if (!user.roleAdmin) {
			throw UnauthError();
		}
		return await orm.User.oneOrFailByID(id);
	}
}
