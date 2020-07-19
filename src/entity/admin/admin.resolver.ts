import {UserRole} from '../../types/enums';
import {Arg, Authorized, Ctx, ID, Query, Resolver} from 'type-graphql';
import {Context} from '../../modules/server/middlewares/apollo.context';
import {AdminChangeQueueInfoQL, AdminSettings, AdminSettingsQL} from './admin';

class AdminChangeQueueInfo {
}

@Resolver(AdminSettingsQL)
export class AdminResolver {

	@Authorized(UserRole.admin)
	@Query(() => AdminSettingsQL, {description: 'Get the Server Admin Settings'})
	async adminSettings(@Ctx() {engine}: Context): Promise<AdminSettings> {
		return engine.settingsService.get();
	}

	@Authorized(UserRole.admin)
	@Query(() => AdminChangeQueueInfoQL, {description: 'Get Queue Information for Admin Change Tasks'})
	async adminQueue(@Arg('id', () => ID!, {description: 'Queue Task Id'}) id: string, @Ctx() {engine}: Context): Promise<AdminChangeQueueInfo> {
		return engine.ioService.getAdminChangeQueueInfoStatus(id);
	}
}
