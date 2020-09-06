import {Controller, Ctx, Get, QueryParams} from '../../modules/rest/decorators';
import {Stats, UserStats} from './stats.model';
import {StatsFilter} from './stats.filter';
import {UserRole} from '../../types/enums';
import {Context} from '../../modules/engine/rest/context';

@Controller('/stats', {tags: ['Various'], roles: [UserRole.stream]})
export class StatsController {
	@Get(() => Stats, {description: 'Get count Stats for Folders/Tracks/Albums/...', summary: 'Get Stats'})
	async get(@QueryParams() filter: StatsFilter, @Ctx() {orm, engine}: Context): Promise<Stats> {
		return await engine.stats.getStats(orm, filter?.rootID);
	}

	@Get('/user', () => UserStats,
		{description: 'Get count Stats for the current User: Playlists/Favorites/Played', summary: 'Get USER STATS'})
	async user(@Ctx() {orm, engine, user}: Context
	): Promise<UserStats> {
		return engine.stats.getUserStats(orm, user);
	}

}
