import {ListType, UserRole} from '../../types/enums.js';
import {Arg, Args, Authorized, Ctx, FieldResolver, ID, ObjectType, Query, Resolver, Root as GQLRoot} from 'type-graphql';
import {User, UserFavoritesQL, UserIndexQL, UserPageQL, UserQL} from './user.js';
import {Context} from '../../modules/server/middlewares/apollo.context.js';
import {UserService} from './user.service.js';
import {UserIndexArgs, UsersArgs} from './user.args.js';
import {SessionPageQL} from '../session/session.js';
import {BookmarkPageQL} from '../bookmark/bookmark.js';
import {PlayQueue, PlayQueueQL} from '../playqueue/playqueue.js';
import {PlaylistPageQL} from '../playlist/playlist.js';
import {PlaylistPageArgsQL} from '../playlist/playlist.args.js';
import {BookmarksPageArgsQL} from '../bookmark/bookmark.args.js';
import {SessionsPageArgsQL} from '../session/session.args.js';
import {AlbumPageQL} from '../album/album.js';
import {AlbumPageArgsQL} from '../album/album.args.js';
import {ArtistPageQL} from '../artist/artist.js';
import {ArtistPageArgsQL} from '../artist/artist.args.js';
import {SeriesPageQL} from '../series/series.js';
import {SeriesPageArgsQL} from '../series/series.args.js';
import {PodcastPageQL} from '../podcast/podcast.js';
import {PodcastPageArgsQL} from '../podcast/podcast.args.js';
import {EpisodePageQL} from '../episode/episode.js';
import {EpisodePageArgsQL} from '../episode/episode.args.js';
import {TrackPageQL} from '../track/track.js';
import {TrackPageArgsQL} from '../track/track.args.js';
import {FolderPageQL} from '../folder/folder.js';
import {FolderPageArgsQL} from '../folder/folder.args.js';
import {ArtworkPageQL} from '../artwork/artwork.js';
import {ArtworkPageArgsQL} from '../artwork/artwork.args.js';
import {UserStats} from '../stats/stats.model.js';
import {UserStatsQL} from '../stats/stats.js';

@ObjectType()
export class UserFavorites {
	user!: User;
}

@Resolver(UserFavoritesQL)
export class UserFavoritesResolver {

	@FieldResolver(() => AlbumPageQL)
	async albums(@GQLRoot() owner: UserFavorites, @Ctx() {orm}: Context, @Args() {filter, order, page}: AlbumPageArgsQL): Promise<AlbumPageQL> {
		return orm.Album.findListFilter(ListType.faved, undefined, filter, order, page, owner.user);
	}

	@FieldResolver(() => ArtistPageQL)
	async artists(@GQLRoot() owner: UserFavorites, @Ctx() {orm}: Context, @Args() {filter, order, page}: ArtistPageArgsQL): Promise<ArtistPageQL> {
		return orm.Artist.findListFilter(ListType.faved, undefined, filter, order, page, owner.user);
	}

	@FieldResolver(() => SeriesPageQL)
	async series(@GQLRoot() owner: UserFavorites, @Ctx() {orm}: Context, @Args() {filter, order, page}: SeriesPageArgsQL): Promise<SeriesPageQL> {
		return orm.Series.findListFilter(ListType.faved, undefined, filter, order, page, owner.user);
	}

	@FieldResolver(() => PodcastPageQL)
	async podcasts(@GQLRoot() owner: UserFavorites, @Ctx() {orm}: Context, @Args() {filter, order, page}: PodcastPageArgsQL): Promise<PodcastPageQL> {
		return orm.Podcast.findListFilter(ListType.faved, undefined, filter, order, page, owner.user);
	}

	@FieldResolver(() => EpisodePageQL)
	async episodes(@GQLRoot() owner: UserFavorites, @Ctx() {orm}: Context, @Args() {filter, order, page}: EpisodePageArgsQL): Promise<EpisodePageQL> {
		return orm.Episode.findListFilter(ListType.faved, undefined, filter, order, page, owner.user);
	}

	@FieldResolver(() => TrackPageQL)
	async tracks(@GQLRoot() owner: UserFavorites, @Ctx() {orm}: Context, @Args() {filter, order, page}: TrackPageArgsQL): Promise<TrackPageQL> {
		return orm.Track.findListFilter(ListType.faved, undefined, filter, order, page, owner.user);
	}

	@FieldResolver(() => FolderPageQL)
	async folders(@GQLRoot() owner: UserFavorites, @Ctx() {orm}: Context, @Args() {filter, order, page}: FolderPageArgsQL): Promise<FolderPageQL> {
		return orm.Folder.findListFilter(ListType.faved, undefined, filter, order, page, owner.user);
	}

	@FieldResolver(() => PlaylistPageQL)
	async playlists(@GQLRoot() owner: UserFavorites, @Ctx() {orm}: Context, @Args() {filter, order, page}: PlaylistPageArgsQL): Promise<PlaylistPageQL> {
		return orm.Playlist.findListFilter(ListType.faved, undefined, filter, order, page, owner.user);
	}

	@FieldResolver(() => ArtistPageQL)
	async artworks(@GQLRoot() owner: UserFavorites, @Ctx() {orm}: Context, @Args() {filter, order, page}: ArtworkPageArgsQL): Promise<ArtworkPageQL> {
		return orm.Artwork.findListFilter(ListType.faved, undefined, filter, order, page, owner.user);
	}

}

@Resolver(UserQL)
export class UserResolver {
	@Query(() => UserQL)
	currentUser(@Ctx() {user}: Context): User {
		return user;
	}

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

	@FieldResolver(() => UserStatsQL)
	async stats(@GQLRoot() user: User, @Ctx() {orm, engine}: Context): Promise<UserStats> {
		return engine.stats.getUserStats(orm, user);
	}

	@FieldResolver(() => PlaylistPageQL)
	async playlists(@GQLRoot() owner: User, @Ctx() {orm}: Context, @Args() {filter, order, page}: PlaylistPageArgsQL): Promise<PlaylistPageQL> {
		return orm.Playlist.searchFilter({...filter, userIDs: [owner.id]}, order, page, owner);
	}

	@FieldResolver(() => BookmarkPageQL)
	async bookmarks(@GQLRoot() owner: User, @Ctx() {orm}: Context, @Args() {filter, order, page}: BookmarksPageArgsQL): Promise<BookmarkPageQL> {
		return orm.Bookmark.searchFilter({...filter, userIDs: [owner.id]}, order, page, owner);
	}

	@FieldResolver(() => SessionPageQL)
	async sessions(@GQLRoot() owner: User, @Ctx() {orm}: Context, @Args() {filter, order, page}: SessionsPageArgsQL): Promise<SessionPageQL> {
		return orm.Session.searchFilter({...filter, userIDs: [owner.id]}, order, page, owner);
	}

	@FieldResolver(() => PlayQueueQL, {nullable: true})
	async playQueue(@GQLRoot() user: User): Promise<PlayQueue | undefined> {
		return user.playQueue.get();
	}

	@FieldResolver(() => UserFavoritesQL)
	async favorites(@GQLRoot() user: User): Promise<UserFavorites> {
		const result = new UserFavorites();
		result.user = user;
		return result;
	}

}
