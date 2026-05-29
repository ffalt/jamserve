import { Args, Authorized, Ctx, Query, Resolver } from 'type-graphql';
import { LandscapeData } from './landscape.model.js';
import { LandscapeParametersQL } from './landscape.parameters.js';
import { Context } from '../../modules/server/middlewares/apollo.context.js';
import { UserRole } from '../../types/enums.js';

@Resolver(LandscapeData)
export class LandscapeResolver {
	@Authorized(UserRole.stream)
	@Query(() => LandscapeData, { description: 'Get Music Collection Landscape Data for visualization' })
	async landscape(@Args() parameters: LandscapeParametersQL, @Ctx() { engine, orm }: Context): Promise<LandscapeData> {
		return engine.landscape.getLandscape(orm, parameters);
	}
}
