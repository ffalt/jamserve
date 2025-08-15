import { Root, RootPage, RootUpdateStatus } from './root.model.js';
import { UserRole } from '../../types/enums.js';
import { IncludesRootParameters, RootFilterParameters, RootMutateParameters, RootOrderParameters, RootRefreshParameters } from './root.parameters.js';
import { AdminChangeQueueInfo } from '../admin/admin.js';
import { PageParameters } from '../base/base.parameters.js';
import { Context } from '../../modules/engine/rest/context.js';
import { Controller } from '../../modules/rest/decorators/controller.js';
import { Get } from '../../modules/rest/decorators/get.js';
import { QueryParameter } from '../../modules/rest/decorators/query-parameter.js';
import { QueryParameters } from '../../modules/rest/decorators/query-parameters.js';
import { RestContext } from '../../modules/rest/decorators/rest-context.js';
import { BodyParameters } from '../../modules/rest/decorators/body-parameters.js';
import { BodyParameter } from '../../modules/rest/decorators/body-parameter.js';
import { Post } from '../../modules/rest/decorators/post.js';

@Controller('/root', { tags: ['Root'], roles: [UserRole.stream] })
export class RootController {
	@Get('/id',
		() => Root,
		{ description: 'Get a Root by Id', summary: 'Get Root' }
	)
	async id(
		@QueryParameter('id', { description: 'Root Id', isID: true }) id: string,
		@QueryParameters() parameters: IncludesRootParameters,
		@RestContext() { orm, engine, user }: Context
	): Promise<Root> {
		return engine.transform.Root.root(
			orm, await orm.Root.oneOrFailByID(id),
			parameters, user
		);
	}

	@Get(
		'/search',
		() => RootPage,
		{ description: 'Search Roots' }
	)
	async search(
		@QueryParameters() page: PageParameters,
		@QueryParameters() parameters: IncludesRootParameters,
		@QueryParameters() filter: RootFilterParameters,
		@QueryParameters() order: RootOrderParameters,
		@RestContext() { orm, engine, user }: Context
	): Promise<RootPage> {
		return await orm.Root.searchTransformFilter(
			filter, [order], page, user,
			o => engine.transform.Root.root(orm, o, parameters, user)
		);
	}

	@Get(
		'/status',
		() => RootUpdateStatus,
		{ description: 'Get root status by id' }
	)
	async status(
		@QueryParameter('id', { description: 'Root Id', isID: true }) id: string,
		@RestContext() { orm, engine }: Context
	): Promise<RootUpdateStatus> {
		return engine.transform.Root.rootStatus(await orm.Root.oneOrFailByID(id));
	}

	@Post(
		'/create',
		() => AdminChangeQueueInfo,
		{ description: 'Create a root', roles: [UserRole.admin] }
	)
	async create(
		@BodyParameters() { name, path, strategy }: RootMutateParameters,
		@RestContext() { engine }: Context
	): Promise<AdminChangeQueueInfo> {
		return await engine.io.root.create(name, path, strategy);
	}

	@Post(
		'/update',
		() => AdminChangeQueueInfo,
		{ description: 'Update a root', roles: [UserRole.admin] }
	)
	async update(
		@BodyParameter('id', { description: 'Root Id', isID: true }) id: string,
		@BodyParameters() { name, path, strategy }: RootMutateParameters,
		@RestContext() { engine }: Context
	): Promise<AdminChangeQueueInfo> {
		return await engine.io.root.update(id, name, path, strategy);
	}

	@Post(
		'/remove',
		() => AdminChangeQueueInfo,
		{ description: 'Remove a root', roles: [UserRole.admin] }
	)
	async remove(
		@BodyParameter('id', { description: 'Root Id', isID: true }) id: string,
		@RestContext() { engine }: Context
	): Promise<AdminChangeQueueInfo> {
		return await engine.io.root.delete(id);
	}

	@Post(
		'/refresh',
		() => AdminChangeQueueInfo,
		{ description: 'Check & update a root folder for file system changes', roles: [UserRole.admin] }
	)
	async refresh(
		@BodyParameters() { id }: RootRefreshParameters,
		@RestContext() { orm, engine }: Context
	): Promise<AdminChangeQueueInfo> {
		if (id) {
			return await engine.io.root.refresh(id);
		}
		const result = await engine.io.root.refreshAll(orm);
		return result.at(-1) ?? { id: '' };
	}

	@Post(
		'/refreshMeta',
		() => AdminChangeQueueInfo,
		{ description: 'Rebuild all metadata (Artists/Albums/...) for a root folder', roles: [UserRole.admin] }
	)
	async refreshMeta(
		@BodyParameters() { id }: RootRefreshParameters,
		@RestContext() { orm, engine }: Context
	): Promise<AdminChangeQueueInfo> {
		if (id) {
			return await engine.io.root.refreshMeta(id);
		}
		const result = await engine.io.root.refreshAll(orm);
		return result.at(-1) ?? { id: '' };
	}
}
