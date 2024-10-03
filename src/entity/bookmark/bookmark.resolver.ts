import { Root as GQLRoot, Arg, Args, Ctx, FieldResolver, ID, Query, Resolver } from 'type-graphql';
import { Bookmark, BookmarkPageQL, BookmarkQL } from './bookmark.js';
import { Context } from '../../modules/server/middlewares/apollo.context.js';
import { Track, TrackQL } from '../track/track.js';
import { Episode, EpisodeQL } from '../episode/episode.js';
import { BookmarksArgs } from './bookmark.args.js';

@Resolver(BookmarkQL)
export class BookmarkResolver {
	@Query(() => BookmarkQL, { description: 'Get a Bookmark by Id' })
	async bookmark(@Arg('id', () => ID!) id: string, @Ctx() { orm, user }: Context): Promise<Bookmark> {
		return await orm.Bookmark.oneOrFail(user.roleAdmin ? { where: { id: id } } : { where: { id: id, user: user.id } });
	}

	@Query(() => BookmarkPageQL, { description: 'Search Bookmarks' })
	async bookmarks(@Args() { filter, page, order }: BookmarksArgs, @Ctx() { orm, user }: Context): Promise<BookmarkPageQL> {
		return await orm.Bookmark.searchFilter(filter, order, page, user);
	}

	@FieldResolver(() => TrackQL, { nullable: true })
	async track(@GQLRoot() bookmark: Bookmark): Promise<Track | undefined> {
		return bookmark.track.get();
	}

	@FieldResolver(() => EpisodeQL, { nullable: true })
	async episode(@GQLRoot() bookmark: Bookmark): Promise<Episode | undefined> {
		return bookmark.episode.get();
	}
}
