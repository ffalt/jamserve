import { Stats, UserStats } from './stats.model.js';
import { StatsFilter } from './stats.filter.js';
import { UserRole } from '../../types/enums.js';
import { Context } from '../../modules/engine/rest/context.js';
import {Controller} from '../../modules/rest/decorators/Controller.js';
import {Get} from '../../modules/rest/decorators/Get.js';
import {QueryParams} from '../../modules/rest/decorators/QueryParams.js';
import {Ctx} from '../../modules/rest/decorators/Ctx.js';

@Controller('/stats', { tags: ['Various'], roles: [UserRole.stream] })
export class StatsController {
	@Get(() => Stats, { description: 'Get count stats for Folders/Tracks/Albums/...', summary: 'Get Stats' })
	async get(@QueryParams() filter: StatsFilter, @Ctx() { orm, engine }: Context): Promise<Stats> {
		return await engine.stats.getStats(orm, filter?.rootID);
	}

	@Get('/user', () => UserStats,
		{ description: 'Get count stats for the calling User: Playlists/Favorites/Played', summary: 'Get User Stats' })
	async user(@Ctx() { orm, engine, user }: Context
	): Promise<UserStats> {
		return engine.stats.getUserStats(orm, user);
	}
}
