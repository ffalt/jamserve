import {Args, Ctx, Query, Resolver} from 'type-graphql';
import {Session, SessionPageQL, SessionQL} from './session';
import {Context} from '../../modules/server/middlewares/apollo.context';
import {JAMAPI_VERSION} from '../../modules/engine/rest/version';
import {SessionsArgs} from './session.args';

@Resolver(SessionQL)
export class SessionResolver {

	@Query(() => String, {description: 'Get the API Version'})
	async version(): Promise<string> {
		return JAMAPI_VERSION;
	}

	@Query(() => SessionQL, {description: 'Check the Login State'})
	async session(@Ctx() {orm, user}: Context): Promise<Session> {
		return await orm.Session.oneOrFail({where: {user: user.id}});
	}

	@Query(() => SessionPageQL, {description: 'Get a list of all sessions of the current user'})
	async sessions(@Args() {page, filter, order}: SessionsArgs, @Ctx() {orm, user}: Context): Promise<SessionPageQL> {
		return await orm.Session.searchFilter(filter, order, page, user);
	}
}
