import { Args, Ctx, Query, Resolver } from 'type-graphql';
import { StatsQL } from './stats.js';
import { Context } from '../../modules/server/middlewares/apollo.context.js';
import { StatsParameters } from './stats.parameters.js';

@Resolver(StatsQL)
export class StatsResolver {
	@Query(() => StatsQL)
	async stats(@Args() parameters: StatsParameters, @Ctx() { engine, orm }: Context): Promise<StatsQL> {
		return await engine.stats.getStats(orm, parameters.rootID);
	}
}
