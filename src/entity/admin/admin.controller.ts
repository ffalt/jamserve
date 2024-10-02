import { BodyParams, Controller, Ctx, Get, Post, QueryParam } from '../../modules/rest/index.js';
import { UserRole } from '../../types/enums.js';
import { AdminChangeQueueInfo, AdminSettings } from './admin.js';
import { AdminSettingsArgs } from './admin.args.js';
import { Context } from '../../modules/engine/rest/context.js';

@Controller('/admin', { tags: ['Administration'], roles: [UserRole.admin] })
export class AdminController {
	@Get(
		'/settings/get',
		() => AdminSettings,
		{ description: 'Get the Server Admin Settings', summary: 'Get Settings' }
	)
	async settings(@Ctx() { engine }: Context): Promise<AdminSettings> {
		return engine.settings.get();
	}

	@Get(
		'/queue/id',
		() => AdminChangeQueueInfo,
		{ description: 'Get Queue Information for Admin Change Tasks', summary: 'Get Queue Info' }
	)
	async queueId(
		@QueryParam('id', { description: 'Queue Task Id', isID: true }) id: string,
		@Ctx() { engine }: Context
	): Promise<AdminChangeQueueInfo> {
		return engine.io.getAdminChangeQueueInfoStatus(id);
	}

	@Post(
		'/settings/update',
		{ description: 'Update the Server Admin Settings', summary: 'Set Settings' }
	)
	async settingsUpdate(
		@BodyParams() args: AdminSettingsArgs,
		@Ctx() { engine, orm }: Context
	): Promise<void> {
		await engine.settings.updateSettings(orm, args);
	}
}
