import {Arg, Args, Ctx, FieldResolver, ID, Query, Resolver} from 'type-graphql';
import {Bookmark, BookmarkPageQL, BookmarkQL} from './bookmark';
import {Context} from '../../modules/server/middlewares/apollo.context';
import {Track, TrackQL} from '../track/track';
import {Root as GQLRoot} from 'type-graphql/dist/decorators/Root';
import {Episode, EpisodeQL} from '../episode/episode';
import {BookmarksArgs} from './bookmark.args';

@Resolver(BookmarkQL)
export class BookmarkResolver {
	@Query(() => BookmarkQL, {description: 'Get a Bookmark by Id'})
	async bookmark(@Arg('id', () => ID!) id: string, @Ctx() {orm, user}: Context): Promise<Bookmark> {
		return await orm.Bookmark.oneOrFail({id: id, user: user.id})
	}

	@Query(() => BookmarkPageQL, {description: 'Search Bookmarks'})
	async bookmarks(@Args() {filter, page, order}: BookmarksArgs, @Ctx() {orm, user}: Context): Promise<BookmarkPageQL> {
		return await orm.Bookmark.searchFilter(filter, order, page, user);
	}

	@FieldResolver(() => TrackQL, {nullable: true})
	async track(@GQLRoot() bookmark: Bookmark, @Ctx() {orm}: Context): Promise<Track | undefined> {
		await orm.Bookmark.populate(bookmark, 'track');
		return bookmark.track;
	}

	@FieldResolver(() => EpisodeQL, {nullable: true})
	async episode(@GQLRoot() bookmark: Bookmark, @Ctx() {orm}: Context): Promise<Episode | undefined> {
		await orm.Bookmark.populate(bookmark, 'episode');
		return bookmark.episode;
	}

}
