import {StatsService} from './stats.service';
import {Controller, Get, QueryParams} from '../../modules/rest/decorators';
import {Stats} from './stats.model';
import {StatsFilter} from './stats.filter';
import {Inject} from 'typescript-ioc';
import {UserRole} from '../../types/enums';

@Controller('/stats', {tags: ['Various'], roles: [UserRole.stream]})
export class StatsController {
	@Inject
	private statsService!: StatsService;

	@Get(() => Stats, {description: 'Get count Stats for Folders/Tracks/Albums/...', summary: 'Get Stats'})
	async get(@QueryParams() filter: StatsFilter): Promise<Stats> {
		return await this.statsService.getStats(filter?.rootID);
	}

}
