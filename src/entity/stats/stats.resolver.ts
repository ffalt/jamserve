import {Args, Ctx, Query, Resolver} from 'type-graphql';
import {StatsQL} from './stats';
import {Context} from '../../modules/server/middlewares/apollo.context';
import {StatsArgs} from './stats.args';

@Resolver(StatsQL)
export class StatsResolver {

	@Query(() => StatsQL)
	async stats(@Args() args: StatsArgs, @Ctx() {engine, orm}: Context): Promise<StatsQL> {
		return await engine.statsService.getStats(orm, args?.rootID);
	}
}

