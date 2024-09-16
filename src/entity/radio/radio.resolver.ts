import {Arg, Args, Ctx, FieldResolver, ID, Query, Resolver, Root as GQLRoot} from 'type-graphql';
import {State, StateQL} from '../state/state.js';
import {DBObjectType} from '../../types/enums.js';
import {Radio, RadioIndexQL, RadioPageQL, RadioQL} from './radio.js';
import {Context} from '../../modules/server/middlewares/apollo.context.js';
import {RadioIndexArgs, RadiosArgs} from './radio.args.js';

@Resolver(RadioQL)
export class RadioResolver {
	@Query(() => RadioQL, {description: 'Get a Radio by Id'})
	async radio(@Arg('id', () => ID!) id: string, @Ctx() {orm}: Context): Promise<Radio> {
		return await orm.Radio.oneOrFailByID(id);
	}

	@Query(() => RadioPageQL, {description: 'Search Radios'})
	async radios(@Args() {page, filter, order, list, seed}: RadiosArgs, @Ctx() {orm, user}: Context): Promise<RadioPageQL> {
		if (list) {
			return await orm.Radio.findListFilter(list, seed, filter, order, page, user);
		}
		return await orm.Radio.searchFilter(filter, order, page, user);
	}

	@Query(() => RadioIndexQL, {description: 'Get the Navigation Index for Radios'})
	async radioIndex(@Args() {filter}: RadioIndexArgs, @Ctx() {orm}: Context): Promise<RadioIndexQL> {
		return await orm.Radio.indexFilter(filter);
	}

	@FieldResolver(() => StateQL)
	async state(@GQLRoot() radio: Radio, @Ctx() {orm, user}: Context): Promise<State> {
		return await orm.State.findOrCreate(radio.id, DBObjectType.radio, user.id);
	}
}
