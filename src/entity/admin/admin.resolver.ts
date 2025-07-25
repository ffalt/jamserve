import { UserRole } from '../../types/enums.js';
import { Arg, Authorized, Ctx, ID, Query, Resolver } from 'type-graphql';
import { Context } from '../../modules/server/middlewares/apollo.context.js';
import { AdminChangeQueueInfoQL, AdminSettings, AdminSettingsQL } from './admin.js';

// qlty-ignore: radarlint-js:typescript:S2094 ( Unexpected empty class.)
class AdminChangeQueueInfo {
}

@Resolver(AdminSettingsQL)
export class AdminResolver {
	@Authorized(UserRole.admin)
	@Query(() => AdminSettingsQL, { description: 'Get the Server Admin Settings' })
	async adminSettings(@Ctx() { engine }: Context): Promise<AdminSettings> {
		return engine.settings.get();
	}

	@Authorized(UserRole.admin)
	@Query(() => AdminChangeQueueInfoQL, { description: 'Get Queue Information for Admin Change Tasks' })
	async adminQueue(@Arg('id', () => ID!, { description: 'Queue Task Id' }) id: string, @Ctx() { engine }: Context): Promise<AdminChangeQueueInfo> {
		return engine.io.getAdminChangeQueueInfoStatus(id);
	}
}
