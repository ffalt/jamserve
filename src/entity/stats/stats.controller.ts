import {Controller, Ctx, Get, QueryParams} from '../../modules/rest/index.js';
import {Stats, UserStats} from './stats.model.js';
import {StatsFilter} from './stats.filter.js';
import {UserRole} from '../../types/enums.js';
import {Context} from '../../modules/engine/rest/context.js';

@Controller('/stats', {tags: ['Various'], roles: [UserRole.stream]})
export class StatsController {
	@Get(() => Stats, {description: 'Get count stats for Folders/Tracks/Albums/...', summary: 'Get Stats'})
	async get(@QueryParams() filter: StatsFilter, @Ctx() {orm, engine}: Context): Promise<Stats> {
		return await engine.stats.getStats(orm, filter?.rootID);
	}

	@Get('/user', () => UserStats,
		{description: 'Get count stats for the calling User: Playlists/Favorites/Played', summary: 'Get User Stats'})
	async user(@Ctx() {orm, engine, user}: Context
	): Promise<UserStats> {
		return engine.stats.getUserStats(orm, user);
	}

}
