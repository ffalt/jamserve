import {Controller, Ctx, Get, QueryParams} from '../../modules/rest/decorators';
import {Stats} from './stats.model';
import {StatsFilter} from './stats.filter';
import {InRequestScope, Inject} from 'typescript-ioc';
import {UserRole} from '../../types/enums';
import {Context} from '../../modules/engine/rest/context';
import {StatsService} from './stats.service';

@InRequestScope
@Controller('/stats', {tags: ['Various'], roles: [UserRole.stream]})
export class StatsController {
	@Inject
	private statsService!: StatsService;

	@Get(() => Stats, {description: 'Get count Stats for Folders/Tracks/Albums/...', summary: 'Get Stats'})
	async get(
		@QueryParams() filter: StatsFilter,
		@Ctx() {orm}: Context
	): Promise<Stats> {
		return await this.statsService.getStats(orm, filter?.rootID);
	}

}
