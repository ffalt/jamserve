import {Root, RootPage, RootUpdateStatus} from './root.model';
import {BodyParam, BodyParams, Controller, Ctx, Get, Post, QueryParam, QueryParams} from '../../modules/rest';
import {UserRole} from '../../types/enums';
import {BaseController} from '../base/base.controller';
import {IncludesRootArgs, RootFilterArgs, RootMutateArgs, RootOrderArgs, RootRefreshArgs} from './root.args';
import {AdminChangeQueueInfo} from '../admin/admin';
import {InRequestScope, Inject} from 'typescript-ioc';
import {IoService} from '../../modules/engine/services/io.service';
import {PageArgs} from '../base/base.args';
import {Context} from '../../modules/engine/rest/context';

@InRequestScope
@Controller('/root', {tags: ['Root'], roles: [UserRole.stream]})
export class RootController extends BaseController {
	@Inject
	ioService!: IoService;

	@Get('/id',
		() => Root,
		{description: 'Get a Root by Id', summary: 'Get Root'}
	)
	async id(
		@QueryParam('id', {description: 'Root Id', isID: true}) id: string,
		@QueryParams() rootArgs: IncludesRootArgs,
		@Ctx() {orm, user}: Context
	): Promise<Root> {
		return this.transform.root(
			orm, await orm.Root.oneOrFailByID(id),
			rootArgs, user
		);
	}

	@Get(
		'/search',
		() => RootPage,
		{description: 'Search Roots'}
	)
	async search(
		@QueryParams() page: PageArgs,
		@QueryParams() rootArgs: IncludesRootArgs,
		@QueryParams() filter: RootFilterArgs,
		@QueryParams() order: RootOrderArgs,
		@Ctx() {orm, user}: Context
	): Promise<RootPage> {
		return await orm.Root.searchTransformFilter(
			filter, [order], page, user,
			o => this.transform.root(orm, o, rootArgs, user)
		);
	}

	@Get(
		'/status',
		() => RootUpdateStatus,
		{description: 'Get root status by id'}
	)
	async status(
		@QueryParam('id', {description: 'Root Id', isID: true}) id: string,
		@Ctx() {orm, user}: Context
	): Promise<RootUpdateStatus> {
		return this.transform.rootStatus(await orm.Root.oneOrFailByID(id));
	}

	@Post(
		'/create',
		() => AdminChangeQueueInfo,
		{description: 'Create a root', roles: [UserRole.admin]}
	)
	async create(
		@BodyParams() args: RootMutateArgs,
		@Ctx() {orm, user}: Context
	): Promise<AdminChangeQueueInfo> {
		return await this.ioService.createRoot(args.name, args.path, args.strategy);
	}

	@Post(
		'/update',
		() => AdminChangeQueueInfo,
		{description: 'Update a root', roles: [UserRole.admin]}
	)
	async update(
		@BodyParam('id', {description: 'Root Id', isID: true}) id: string,
		@BodyParams() args: RootMutateArgs,
		@Ctx() {orm, user}: Context
	): Promise<AdminChangeQueueInfo> {
		return await this.ioService.updateRoot(id, args.name, args.path, args.strategy);
	}

	@Post(
		'/remove',
		() => AdminChangeQueueInfo,
		{description: 'Remove a root', roles: [UserRole.admin]}
	)
	async remove(
		@BodyParam('id', {description: 'Root Id', isID: true}) id: string,
		@Ctx() {orm, user}: Context
	): Promise<AdminChangeQueueInfo> {
		return await this.ioService.removeRoot(id);
	}

	@Post(
		'/refresh',
		() => AdminChangeQueueInfo,
		{description: 'Check podcast feeds for new episodes', roles: [UserRole.admin]}
	)
	async refresh(
		@BodyParams() args: RootRefreshArgs,
		@Ctx() {orm}: Context
	): Promise<AdminChangeQueueInfo> {
		if (args.id) {
			return await this.ioService.refreshRoot(args.id);
		} else {
			const result = await this.ioService.refresh(orm);
			return result[result.length - 1];
		}
	}

}
