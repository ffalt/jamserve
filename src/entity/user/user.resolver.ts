import { ListType, UserRole } from '../../types/enums.js';
import { Arg, Args, Authorized, Ctx, FieldResolver, ID, ObjectType, Query, Resolver, Root as GQLRoot } from 'type-graphql';
import { User, UserFavoritesQL, UserIndexQL, UserPageQL, UserQL } from './user.js';
import { Context } from '../../modules/server/middlewares/apollo.context.js';
import { UserService } from './user.service.js';
import { UserIndexParameters, UsersParameters } from './user.parameters.js';
import { SessionPageQL } from '../session/session.js';
import { BookmarkPageQL } from '../bookmark/bookmark.js';
import { PlayQueue, PlayQueueQL } from '../playqueue/playqueue.js';
import { PlaylistPageQL } from '../playlist/playlist.js';
import { PlaylistPageParametersQL } from '../playlist/playlist.parameters.js';
import { BookmarksPageParametersQL } from '../bookmark/bookmark.parameters.js';
import { SessionsPageParametersQL } from '../session/session.parameters.js';
import { AlbumPageQL } from '../album/album.js';
import { AlbumPageParametersQL } from '../album/album.parameters.js';
import { ArtistPageQL } from '../artist/artist.js';
import { ArtistPageParametersQL } from '../artist/artist.parameters.js';
import { SeriesPageQL } from '../series/series.js';
import { SeriesPageParametersQL } from '../series/series.parameters.js';
import { PodcastPageQL } from '../podcast/podcast.js';
import { PodcastPageParametersQL } from '../podcast/podcast.parameters.js';
import { EpisodePageQL } from '../episode/episode.js';
import { EpisodePageParametersQL } from '../episode/episode.parameters.js';
import { TrackPageQL } from '../track/track.js';
import { TrackPageParametersQL } from '../track/track.parameters.js';
import { FolderPageQL } from '../folder/folder.js';
import { FolderPageParametersQL } from '../folder/folder.parameters.js';
import { ArtworkPageQL } from '../artwork/artwork.js';
import { ArtworkPageParametersQL } from '../artwork/artwork.parameters.js';
import { UserStats } from '../stats/stats.model.js';
import { UserStatsQL } from '../stats/stats.js';

@ObjectType()
export class UserFavorites {
	user!: User;
}

@Resolver(UserFavoritesQL)
export class UserFavoritesResolver {
	@FieldResolver(() => AlbumPageQL)
	async albums(@GQLRoot() owner: UserFavorites, @Ctx() { orm }: Context, @Args() { filter, order, page }: AlbumPageParametersQL): Promise<AlbumPageQL> {
		return orm.Album.findListFilter(ListType.faved, undefined, filter, order, page, owner.user);
	}

	@FieldResolver(() => ArtistPageQL)
	async artists(@GQLRoot() owner: UserFavorites, @Ctx() { orm }: Context, @Args() { filter, order, page }: ArtistPageParametersQL): Promise<ArtistPageQL> {
		return orm.Artist.findListFilter(ListType.faved, undefined, filter, order, page, owner.user);
	}

	@FieldResolver(() => SeriesPageQL)
	async series(@GQLRoot() owner: UserFavorites, @Ctx() { orm }: Context, @Args() { filter, order, page }: SeriesPageParametersQL): Promise<SeriesPageQL> {
		return orm.Series.findListFilter(ListType.faved, undefined, filter, order, page, owner.user);
	}

	@FieldResolver(() => PodcastPageQL)
	async podcasts(@GQLRoot() owner: UserFavorites, @Ctx() { orm }: Context, @Args() { filter, order, page }: PodcastPageParametersQL): Promise<PodcastPageQL> {
		return orm.Podcast.findListFilter(ListType.faved, undefined, filter, order, page, owner.user);
	}

	@FieldResolver(() => EpisodePageQL)
	async episodes(@GQLRoot() owner: UserFavorites, @Ctx() { orm }: Context, @Args() { filter, order, page }: EpisodePageParametersQL): Promise<EpisodePageQL> {
		return orm.Episode.findListFilter(ListType.faved, undefined, filter, order, page, owner.user);
	}

	@FieldResolver(() => TrackPageQL)
	async tracks(@GQLRoot() owner: UserFavorites, @Ctx() { orm }: Context, @Args() { filter, order, page }: TrackPageParametersQL): Promise<TrackPageQL> {
		return orm.Track.findListFilter(ListType.faved, undefined, filter, order, page, owner.user);
	}

	@FieldResolver(() => FolderPageQL)
	async folders(@GQLRoot() owner: UserFavorites, @Ctx() { orm }: Context, @Args() { filter, order, page }: FolderPageParametersQL): Promise<FolderPageQL> {
		return orm.Folder.findListFilter(ListType.faved, undefined, filter, order, page, owner.user);
	}

	@FieldResolver(() => PlaylistPageQL)
	async playlists(@GQLRoot() owner: UserFavorites, @Ctx() { orm }: Context, @Args() { filter, order, page }: PlaylistPageParametersQL): Promise<PlaylistPageQL> {
		return orm.Playlist.findListFilter(ListType.faved, undefined, filter, order, page, owner.user);
	}

	@FieldResolver(() => ArtistPageQL)
	async artworks(@GQLRoot() owner: UserFavorites, @Ctx() { orm }: Context, @Args() { filter, order, page }: ArtworkPageParametersQL): Promise<ArtworkPageQL> {
		return orm.Artwork.findListFilter(ListType.faved, undefined, filter, order, page, owner.user);
	}
}

@Resolver(UserQL)
export class UserResolver {
	@Query(() => UserQL)
	currentUser(@Ctx() { user }: Context): User {
		return user;
	}

	@Authorized(UserRole.admin)
	@Query(() => UserQL)
	async user(@Arg('id', () => ID!) id: string, @Ctx() { orm }: Context): Promise<User> {
		return await orm.User.oneOrFailByID(id);
	}

	@Authorized(UserRole.admin)
	@Query(() => UserPageQL)
	async users(@Args() { page, filter, order }: UsersParameters, @Ctx() { orm, user }: Context): Promise<UserPageQL> {
		return await orm.User.searchFilter(filter, order, page, user);
	}

	@Authorized(UserRole.admin)
	@Query(() => UserIndexQL)
	async userIndex(@Args() { filter }: UserIndexParameters, @Ctx() { orm, user }: Context): Promise<UserIndexQL> {
		return await orm.User.indexFilter(filter, user);
	}

	@FieldResolver(() => [UserRole])
	roles(@GQLRoot() user: User): Array<UserRole> {
		return UserService.listfyRoles(user);
	}

	@FieldResolver(() => UserStatsQL)
	async stats(@GQLRoot() user: User, @Ctx() { orm, engine }: Context): Promise<UserStats> {
		return engine.stats.getUserStats(orm, user);
	}

	@FieldResolver(() => PlaylistPageQL)
	async playlists(@GQLRoot() owner: User, @Ctx() { orm }: Context, @Args() { filter, order, page }: PlaylistPageParametersQL): Promise<PlaylistPageQL> {
		return orm.Playlist.searchFilter({ ...filter, userIDs: [owner.id] }, order, page, owner);
	}

	@FieldResolver(() => BookmarkPageQL)
	async bookmarks(@GQLRoot() owner: User, @Ctx() { orm }: Context, @Args() { filter, order, page }: BookmarksPageParametersQL): Promise<BookmarkPageQL> {
		return orm.Bookmark.searchFilter({ ...filter, userIDs: [owner.id] }, order, page, owner);
	}

	@FieldResolver(() => SessionPageQL)
	async sessions(@GQLRoot() owner: User, @Ctx() { orm }: Context, @Args() { filter, order, page }: SessionsPageParametersQL): Promise<SessionPageQL> {
		return orm.Session.searchFilter({ ...filter, userIDs: [owner.id] }, order, page, owner);
	}

	@FieldResolver(() => PlayQueueQL, { nullable: true })
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
