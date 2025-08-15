import { Stats, UserStats } from './stats.model.js';
import { StatsFilter } from './stats.filter.js';
import { UserRole } from '../../types/enums.js';
import { Context } from '../../modules/engine/rest/context.js';
import { Controller } from '../../modules/rest/decorators/controller.js';
import { Get } from '../../modules/rest/decorators/get.js';
import { QueryParameters } from '../../modules/rest/decorators/query-parameters.js';
import { RestContext } from '../../modules/rest/decorators/rest-context.js';

@Controller('/stats', { tags: ['Various'], roles: [UserRole.stream] })
export class StatsController {
	@Get(() => Stats, { description: 'Get count stats for Folders/Tracks/Albums/...', summary: 'Get Stats' })
	async get(@QueryParameters() filter: StatsFilter, @RestContext() { orm, engine }: Context): Promise<Stats> {
		return await engine.stats.getStats(orm, filter.rootID);
	}

	@Get('/user', () => UserStats,
		{ description: 'Get count stats for the calling User: Playlists/Favorites/Played', summary: 'Get User Stats' })
	async user(@RestContext() { orm, engine, user }: Context
	): Promise<UserStats> {
		return engine.stats.getUserStats(orm, user);
	}
}
