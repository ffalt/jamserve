import {Arg, Ctx, FieldResolver, ID, Int, Mutation, Query, Resolver} from 'type-graphql';
import {Context} from '../../modules/server/middlewares/apollo.context';
import {State, StateQL} from './state';
import {NotFoundError} from '../../modules/rest/builder';
import {dateOrUndefined} from '../base/base';
import {Root as GQLRoot} from 'type-graphql/dist/decorators/Root';

@Resolver(StateQL)
export class StateResolver {

	@Query(() => StateQL, {description: `Get User State (fav/rate/etc) for Base Objects`})
	async state(
		@Arg('id', () => ID!, {description: 'Object Id'}) id: string,
		@Ctx() {orm, user}: Context
	): Promise<State> {
		const result = await orm.findInStateTypes(id);
		if (!result) {
			return Promise.reject(NotFoundError());
		}
		return await orm.State.findOrCreate(result.obj.id, result.objType, user.id);
	}

	@Mutation(() => StateQL)
	async fav(
		@Arg('id', () => ID!) id: string,
		@Arg('remove', () => Boolean, {nullable: true}) remove: boolean | undefined,
		@Ctx() {engine, orm, user}: Context
	): Promise<State> {
		return await engine.state.fav(orm, id, remove, user);
	}

	@Mutation(() => StateQL)
	async rate(
		@Arg('id', () => ID!) id: string,
		@Arg('rating', () => Int) rating: number,
		@Ctx() {engine, orm, user}: Context): Promise<State> {
		return await engine.state.rate(orm, id, rating, user);
	}
}

