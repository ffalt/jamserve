import {UserRole} from '../../types/enums';
import {Arg, Args, Authorized, Ctx, FieldResolver, ID, Query, Resolver, Root as GQLRoot} from 'type-graphql';
import {User, UserIndexQL, UserPageQL, UserQL} from './user';
import {Context} from '../../modules/server/middlewares/apollo.context';
import {UserService} from './user.service';
import {UserIndexArgs, UsersArgs} from './user.args';
import {Session, SessionQL} from '../session/session';
import {Bookmark, BookmarkQL} from '../bookmark/bookmark';

@Resolver(UserQL)
export class UserResolver {
	@Authorized(UserRole.admin)
	@Query(() => UserQL)
	async user(@Arg('id', () => ID!) id: string, @Ctx() {orm}: Context): Promise<User> {
		return await orm.User.oneOrFailByID(id);
	}

	@Authorized(UserRole.admin)
	@Query(() => UserPageQL)
	async users(@Args() {page, filter, order}: UsersArgs, @Ctx() {orm, user}: Context): Promise<UserPageQL> {
		return await orm.User.searchFilter(filter, order, page, user);
	}

	@Authorized(UserRole.admin)
	@Query(() => UserIndexQL)
	async userIndex(@Args() {filter}: UserIndexArgs, @Ctx() {orm, user}: Context): Promise<UserIndexQL> {
		return await orm.User.indexFilter(filter, user);
	}

	@FieldResolver(() => [UserRole])
	roles(@GQLRoot() user: User): Array<UserRole> {
		return UserService.listfyRoles(user);
	}

	@FieldResolver(() => [SessionQL])
	async sessions(@GQLRoot() user: User): Promise<Array<Session>> {
		return user.sessions.getItems();
	}

	@FieldResolver(() => [BookmarkQL])
	async bookmarks(@GQLRoot() user: User): Promise<Array<Bookmark>> {
		return user.bookmarks.getItems();
	}

}
