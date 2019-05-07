import {JamRequest} from '../../api/jam/api';
import {Jam} from '../../model/jam-rest-data';
import {JamParameters} from '../../model/jam-rest-params';
import {formatStats} from './stats.format';
import {StatsService} from './stats.service';

export class StatsController {

	constructor(private statsService: StatsService) {

	}

	async get(req: JamRequest<JamParameters.Stats>): Promise<Jam.Stats> {
		const stats = await this.statsService.getStats(req.query.rootID);
		return formatStats(stats);
	}

}
