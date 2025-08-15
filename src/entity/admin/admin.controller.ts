import { UserRole } from '../../types/enums.js';
import { AdminChangeQueueInfo, AdminSettings } from './admin.js';
import { AdminSettingsParameters } from './admin.parameters.js';
import { Context } from '../../modules/engine/rest/context.js';
import { Controller } from '../../modules/rest/decorators/controller.js';
import { Get } from '../../modules/rest/decorators/get.js';
import { RestContext } from '../../modules/rest/decorators/rest-context.js';
import { QueryParameter } from '../../modules/rest/decorators/query-parameter.js';
import { Post } from '../../modules/rest/decorators/post.js';
import { BodyParameters } from '../../modules/rest/decorators/body-parameters.js';

@Controller('/admin', { tags: ['Administration'], roles: [UserRole.admin] })
export class AdminController {
	@Get(
		'/settings/get',
		() => AdminSettings,
		{ description: 'Get the Server Admin Settings', summary: 'Get Settings' }
	)
	async settings(@RestContext() { engine }: Context): Promise<AdminSettings> {
		return engine.settings.get();
	}

	@Get(
		'/queue/id',
		() => AdminChangeQueueInfo,
		{ description: 'Get Queue Information for Admin Change Tasks', summary: 'Get Queue Info' }
	)
	async queueId(
		@QueryParameter('id', { description: 'Queue Task Id', isID: true }) id: string,
		@RestContext() { engine }: Context
	): Promise<AdminChangeQueueInfo> {
		return engine.io.getAdminChangeQueueInfoStatus(id);
	}

	@Post(
		'/settings/update',
		{ description: 'Update the Server Admin Settings', summary: 'Set Settings' }
	)
	async settingsUpdate(
		@BodyParameters() parameters: AdminSettingsParameters,
		@RestContext() { engine, orm }: Context
	): Promise<void> {
		await engine.settings.updateSettings(orm, parameters);
	}
}
