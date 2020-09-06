import {ListType, UserRole} from '../../types/enums';
import {Arg, Args, Authorized, Ctx, FieldResolver, ID, ObjectType, Query, Resolver, Root as GQLRoot} from 'type-graphql';
import {User, UserFavoritesQL, UserIndexQL, UserPageQL, UserQL} from './user';
import {Context} from '../../modules/server/middlewares/apollo.context';
import {UserService} from './user.service';
import {UserIndexArgs, UsersArgs} from './user.args';
import {SessionPageQL} from '../session/session';
import {BookmarkPageQL} from '../bookmark/bookmark';
import {PlayQueue, PlayQueueQL} from '../playqueue/playqueue';
import {PlaylistPageQL} from '../playlist/playlist';
import {PlaylistPageArgsQL} from '../playlist/playlist.args';
import {BookmarksPageArgsQL} from '../bookmark/bookmark.args';
import {SessionsPageArgsQL} from '../session/session.args';
import {AlbumPageQL} from '../album/album';
import {AlbumPageArgsQL} from '../album/album.args';
import {ArtistPageQL} from '../artist/artist';
import {ArtistPageArgsQL} from '../artist/artist.args';
import {SeriesPageQL} from '../series/series';
import {SeriesPageArgsQL} from '../series/series.args';
import {PodcastPageQL} from '../podcast/podcast';
import {PodcastPageArgsQL} from '../podcast/podcast.args';
import {EpisodePageQL} from '../episode/episode';
import {EpisodePageArgsQL} from '../episode/episode.args';
import {TrackPageQL} from '../track/track';
import {TrackPageArgsQL} from '../track/track.args';
import {FolderPageQL} from '../folder/folder';
import {FolderPageArgsQL} from '../folder/folder.args';
import {ArtworkPageQL} from '../artwork/artwork';
import {ArtworkPageArgsQL} from '../artwork/artwork.args';
import {UserStats} from '../stats/stats.model';
import {UserStatsQL} from '../stats/stats';

@ObjectType()
export class UserFavorites {
	user!: User;
}

@Resolver(UserFavoritesQL)
export class UserFavoritesResolver {

	@FieldResolver(() => PlaylistPageQL)
	async albums(@GQLRoot() owner: UserFavorites, @Ctx() {orm}: Context, @Args() {filter, order, page}: AlbumPageArgsQL): Promise<AlbumPageQL> {
		return orm.Album.findListFilter(ListType.faved, filter, order, page, owner.user);
	}

	@FieldResolver(() => PlaylistPageQL)
	async artists(@GQLRoot() owner: UserFavorites, @Ctx() {orm}: Context, @Args() {filter, order, page}: ArtistPageArgsQL): Promise<ArtistPageQL> {
		return orm.Artist.findListFilter(ListType.faved, filter, order, page, owner.user);
	}

	@FieldResolver(() => PlaylistPageQL)
	async series(@GQLRoot() owner: UserFavorites, @Ctx() {orm}: Context, @Args() {filter, order, page}: SeriesPageArgsQL): Promise<SeriesPageQL> {
		return orm.Series.findListFilter(ListType.faved, filter, order, page, owner.user);
	}

	@FieldResolver(() => PodcastPageQL)
	async podcasts(@GQLRoot() owner: UserFavorites, @Ctx() {orm}: Context, @Args() {filter, order, page}: PodcastPageArgsQL): Promise<PodcastPageQL> {
		return orm.Podcast.findListFilter(ListType.faved, filter, order, page, owner.user);
	}

	@FieldResolver(() => EpisodePageQL)
	async episodes(@GQLRoot() owner: UserFavorites, @Ctx() {orm}: Context, @Args() {filter, order, page}: EpisodePageArgsQL): Promise<EpisodePageQL> {
		return orm.Episode.findListFilter(ListType.faved, filter, order, page, owner.user);
	}

	@FieldResolver(() => EpisodePageQL)
	async tracks(@GQLRoot() owner: UserFavorites, @Ctx() {orm}: Context, @Args() {filter, order, page}: TrackPageArgsQL): Promise<TrackPageQL> {
		return orm.Track.findListFilter(ListType.faved, filter, order, page, owner.user);
	}

	@FieldResolver(() => EpisodePageQL)
	async folders(@GQLRoot() owner: UserFavorites, @Ctx() {orm}: Context, @Args() {filter, order, page}: FolderPageArgsQL): Promise<FolderPageQL> {
		return orm.Folder.findListFilter(ListType.faved, filter, order, page, owner.user);
	}

	@FieldResolver(() => EpisodePageQL)
	async playlists(@GQLRoot() owner: UserFavorites, @Ctx() {orm}: Context, @Args() {filter, order, page}: PlaylistPageArgsQL): Promise<PlaylistPageQL> {
		return orm.Playlist.findListFilter(ListType.faved, filter, order, page, owner.user);
	}

	@FieldResolver(() => EpisodePageQL)
	async artworks(@GQLRoot() owner: UserFavorites, @Ctx() {orm}: Context, @Args() {filter, order, page}: ArtworkPageArgsQL): Promise<ArtworkPageQL> {
		return orm.Artwork.findListFilter(ListType.faved, filter, order, page, owner.user);
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
	async playlists(@GQLRoot() owner: User, @Ctx() {orm, user}: Context, @Args() {filter, order, page}: PlaylistPageArgsQL): Promise<PlaylistPageQL> {
		return orm.Playlist.searchFilter({...filter, userIDs: [owner.id]}, order, page, owner);
	}

	@FieldResolver(() => BookmarkPageQL)
	async bookmarks(@GQLRoot() owner: User, @Ctx() {orm, user}: Context, @Args() {filter, order, page}: BookmarksPageArgsQL): Promise<BookmarkPageQL> {
		return orm.Bookmark.searchFilter({...filter, userIDs: [owner.id]}, order, page, owner);
	}

	@FieldResolver(() => SessionPageQL)
	async sessions(@GQLRoot() owner: User, @Ctx() {orm, user}: Context, @Args() {filter, order, page}: SessionsPageArgsQL): Promise<SessionPageQL> {
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
