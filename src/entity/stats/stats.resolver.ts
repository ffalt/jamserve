import {Args, Ctx, Query, Resolver} from 'type-graphql';
import {StatsQL} from './stats.js';
import {Context} from '../../modules/server/middlewares/apollo.context.js';
import {StatsArgs} from './stats.args.js';

@Resolver(StatsQL)
export class StatsResolver {

	@Query(() => StatsQL)
	async stats(@Args() args: StatsArgs, @Ctx() {engine, orm}: Context): Promise<StatsQL> {
		return await engine.stats.getStats(orm, args?.rootID);
	}
}

