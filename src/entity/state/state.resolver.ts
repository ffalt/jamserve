import {Arg, Ctx, ID, Int, Mutation, Query, Resolver} from 'type-graphql';
import {Context} from '../../modules/server/middlewares/apollo.context';
import {State, StateQL} from './state';
import {NotFoundError} from '../../modules/rest/builder';

@Resolver(StateQL)
export class StateResolver {

	@Query(() => StateQL, {description: `Get User State (fav/rate/etc) for Base Objects`})
	async state(
		@Arg('id', () => ID!, {description: 'Object Id'}) id: string,
		@Ctx() {engine, user}: Context
	): Promise<State> {
		const result = await engine.stateService.findInStateTypes(id);
		if (!result) {
			return Promise.reject(NotFoundError());
		}
		return await engine.orm.State.findOrCreate(result.obj.id, result.objType, user.id);
	}

	@Mutation(() => StateQL)
	async fav(
		@Arg('id', () => ID!) id: string,
		@Arg('remove', () => Boolean, {nullable: true}) remove: boolean | undefined,
		@Ctx() {engine, user}: Context
	): Promise<State> {
		return await engine.stateService.fav(id, remove, user);
	}

	@Mutation(() => StateQL)
	async rate(
		@Arg('id', () => ID!) id: string,
		@Arg('rating', () => Int) rating: number,
		@Ctx() {engine, user}: Context): Promise<State> {
		return await engine.stateService.rate(id, rating, user);
	}
}

