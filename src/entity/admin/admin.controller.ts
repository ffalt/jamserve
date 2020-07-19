import {BodyParams, Controller, Get, Post, QueryParam} from '../../modules/rest';
import {UserRole} from '../../types/enums';
import {AdminChangeQueueInfo, AdminSettings} from './admin';
import {Inject} from 'typescript-ioc';
import {SettingsService} from '../settings/settings.service';
import {IoService} from '../../modules/engine/services/io.service';
import {AdminSettingsArgs} from './admin.args';

@Controller('/admin', {tags: ['Administration'], roles: [UserRole.admin]})
export class AdminController {
	@Inject
	private settingsService!: SettingsService;
	@Inject
	private ioService!: IoService;

	@Get(
		'/settings/get',
		() => AdminSettings,
		{description: 'Get the Server Admin Settings', summary: 'Get Settings'}
	)
	async settings(): Promise<AdminSettings> {
		return this.settingsService.get();
	}

	@Get(
		'/queue/id',
		() => AdminChangeQueueInfo,
		{description: 'Get Queue Information for Admin Change Tasks', summary: 'Get Queue Info'}
	)
	async queueId(@QueryParam('id', {description: 'Queue Task Id', isID: true}) id: string): Promise<AdminChangeQueueInfo> {
		return this.ioService.getAdminChangeQueueInfoStatus(id);
	}

	@Post(
		'/settings/update',
		{description: 'Update the Server Admin Settings', summary: 'Set Settings'}
	)
	async settingsUpdate(@BodyParams() args: AdminSettingsArgs): Promise<void> {
		await this.settingsService.updateSettings(args);
	}

}
