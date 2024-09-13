var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { ListType, UserRole } from '../../types/enums';
import { Arg, Args, Authorized, Ctx, FieldResolver, ID, ObjectType, Query, Resolver, Root as GQLRoot } from 'type-graphql';
import { User, UserFavoritesQL, UserIndexQL, UserPageQL, UserQL } from './user';
import { UserService } from './user.service';
import { UserIndexArgs, UsersArgs } from './user.args';
import { SessionPageQL } from '../session/session';
import { BookmarkPageQL } from '../bookmark/bookmark';
import { PlayQueueQL } from '../playqueue/playqueue';
import { PlaylistPageQL } from '../playlist/playlist';
import { PlaylistPageArgsQL } from '../playlist/playlist.args';
import { BookmarksPageArgsQL } from '../bookmark/bookmark.args';
import { SessionsPageArgsQL } from '../session/session.args';
import { AlbumPageQL } from '../album/album';
import { AlbumPageArgsQL } from '../album/album.args';
import { ArtistPageQL } from '../artist/artist';
import { ArtistPageArgsQL } from '../artist/artist.args';
import { SeriesPageQL } from '../series/series';
import { SeriesPageArgsQL } from '../series/series.args';
import { PodcastPageQL } from '../podcast/podcast';
import { PodcastPageArgsQL } from '../podcast/podcast.args';
import { EpisodePageQL } from '../episode/episode';
import { EpisodePageArgsQL } from '../episode/episode.args';
import { TrackPageQL } from '../track/track';
import { TrackPageArgsQL } from '../track/track.args';
import { FolderPageQL } from '../folder/folder';
import { FolderPageArgsQL } from '../folder/folder.args';
import { ArtworkPageArgsQL } from '../artwork/artwork.args';
import { UserStatsQL } from '../stats/stats';
let UserFavorites = class UserFavorites {
};
UserFavorites = __decorate([
    ObjectType()
], UserFavorites);
export { UserFavorites };
let UserFavoritesResolver = class UserFavoritesResolver {
    async albums(owner, { orm }, { filter, order, page }) {
        return orm.Album.findListFilter(ListType.faved, undefined, filter, order, page, owner.user);
    }
    async artists(owner, { orm }, { filter, order, page }) {
        return orm.Artist.findListFilter(ListType.faved, undefined, filter, order, page, owner.user);
    }
    async series(owner, { orm }, { filter, order, page }) {
        return orm.Series.findListFilter(ListType.faved, undefined, filter, order, page, owner.user);
    }
    async podcasts(owner, { orm }, { filter, order, page }) {
        return orm.Podcast.findListFilter(ListType.faved, undefined, filter, order, page, owner.user);
    }
    async episodes(owner, { orm }, { filter, order, page }) {
        return orm.Episode.findListFilter(ListType.faved, undefined, filter, order, page, owner.user);
    }
    async tracks(owner, { orm }, { filter, order, page }) {
        return orm.Track.findListFilter(ListType.faved, undefined, filter, order, page, owner.user);
    }
    async folders(owner, { orm }, { filter, order, page }) {
        return orm.Folder.findListFilter(ListType.faved, undefined, filter, order, page, owner.user);
    }
    async playlists(owner, { orm }, { filter, order, page }) {
        return orm.Playlist.findListFilter(ListType.faved, undefined, filter, order, page, owner.user);
    }
    async artworks(owner, { orm }, { filter, order, page }) {
        return orm.Artwork.findListFilter(ListType.faved, undefined, filter, order, page, owner.user);
    }
};
__decorate([
    FieldResolver(() => AlbumPageQL),
    __param(0, GQLRoot()),
    __param(1, Ctx()),
    __param(2, Args()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [UserFavorites, Object, AlbumPageArgsQL]),
    __metadata("design:returntype", Promise)
], UserFavoritesResolver.prototype, "albums", null);
__decorate([
    FieldResolver(() => ArtistPageQL),
    __param(0, GQLRoot()),
    __param(1, Ctx()),
    __param(2, Args()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [UserFavorites, Object, ArtistPageArgsQL]),
    __metadata("design:returntype", Promise)
], UserFavoritesResolver.prototype, "artists", null);
__decorate([
    FieldResolver(() => SeriesPageQL),
    __param(0, GQLRoot()),
    __param(1, Ctx()),
    __param(2, Args()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [UserFavorites, Object, SeriesPageArgsQL]),
    __metadata("design:returntype", Promise)
], UserFavoritesResolver.prototype, "series", null);
__decorate([
    FieldResolver(() => PodcastPageQL),
    __param(0, GQLRoot()),
    __param(1, Ctx()),
    __param(2, Args()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [UserFavorites, Object, PodcastPageArgsQL]),
    __metadata("design:returntype", Promise)
], UserFavoritesResolver.prototype, "podcasts", null);
__decorate([
    FieldResolver(() => EpisodePageQL),
    __param(0, GQLRoot()),
    __param(1, Ctx()),
    __param(2, Args()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [UserFavorites, Object, EpisodePageArgsQL]),
    __metadata("design:returntype", Promise)
], UserFavoritesResolver.prototype, "episodes", null);
__decorate([
    FieldResolver(() => TrackPageQL),
    __param(0, GQLRoot()),
    __param(1, Ctx()),
    __param(2, Args()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [UserFavorites, Object, TrackPageArgsQL]),
    __metadata("design:returntype", Promise)
], UserFavoritesResolver.prototype, "tracks", null);
__decorate([
    FieldResolver(() => FolderPageQL),
    __param(0, GQLRoot()),
    __param(1, Ctx()),
    __param(2, Args()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [UserFavorites, Object, FolderPageArgsQL]),
    __metadata("design:returntype", Promise)
], UserFavoritesResolver.prototype, "folders", null);
__decorate([
    FieldResolver(() => PlaylistPageQL),
    __param(0, GQLRoot()),
    __param(1, Ctx()),
    __param(2, Args()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [UserFavorites, Object, PlaylistPageArgsQL]),
    __metadata("design:returntype", Promise)
], UserFavoritesResolver.prototype, "playlists", null);
__decorate([
    FieldResolver(() => ArtistPageQL),
    __param(0, GQLRoot()),
    __param(1, Ctx()),
    __param(2, Args()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [UserFavorites, Object, ArtworkPageArgsQL]),
    __metadata("design:returntype", Promise)
], UserFavoritesResolver.prototype, "artworks", null);
UserFavoritesResolver = __decorate([
    Resolver(UserFavoritesQL)
], UserFavoritesResolver);
export { UserFavoritesResolver };
let UserResolver = class UserResolver {
    currentUser({ user }) {
        return user;
    }
    async user(id, { orm }) {
        return await orm.User.oneOrFailByID(id);
    }
    async users({ page, filter, order }, { orm, user }) {
        return await orm.User.searchFilter(filter, order, page, user);
    }
    async userIndex({ filter }, { orm, user }) {
        return await orm.User.indexFilter(filter, user);
    }
    roles(user) {
        return UserService.listfyRoles(user);
    }
    async stats(user, { orm, engine }) {
        return engine.stats.getUserStats(orm, user);
    }
    async playlists(owner, { orm }, { filter, order, page }) {
        return orm.Playlist.searchFilter({ ...filter, userIDs: [owner.id] }, order, page, owner);
    }
    async bookmarks(owner, { orm }, { filter, order, page }) {
        return orm.Bookmark.searchFilter({ ...filter, userIDs: [owner.id] }, order, page, owner);
    }
    async sessions(owner, { orm }, { filter, order, page }) {
        return orm.Session.searchFilter({ ...filter, userIDs: [owner.id] }, order, page, owner);
    }
    async playQueue(user) {
        return user.playQueue.get();
    }
    async favorites(user) {
        const result = new UserFavorites();
        result.user = user;
        return result;
    }
};
__decorate([
    Query(() => UserQL),
    __param(0, Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", User)
], UserResolver.prototype, "currentUser", null);
__decorate([
    Authorized(UserRole.admin),
    Query(() => UserQL),
    __param(0, Arg('id', () => ID)),
    __param(1, Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "user", null);
__decorate([
    Authorized(UserRole.admin),
    Query(() => UserPageQL),
    __param(0, Args()),
    __param(1, Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [UsersArgs, Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "users", null);
__decorate([
    Authorized(UserRole.admin),
    Query(() => UserIndexQL),
    __param(0, Args()),
    __param(1, Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [UserIndexArgs, Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "userIndex", null);
__decorate([
    FieldResolver(() => [UserRole]),
    __param(0, GQLRoot()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [User]),
    __metadata("design:returntype", Array)
], UserResolver.prototype, "roles", null);
__decorate([
    FieldResolver(() => UserStatsQL),
    __param(0, GQLRoot()),
    __param(1, Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [User, Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "stats", null);
__decorate([
    FieldResolver(() => PlaylistPageQL),
    __param(0, GQLRoot()),
    __param(1, Ctx()),
    __param(2, Args()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [User, Object, PlaylistPageArgsQL]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "playlists", null);
__decorate([
    FieldResolver(() => BookmarkPageQL),
    __param(0, GQLRoot()),
    __param(1, Ctx()),
    __param(2, Args()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [User, Object, BookmarksPageArgsQL]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "bookmarks", null);
__decorate([
    FieldResolver(() => SessionPageQL),
    __param(0, GQLRoot()),
    __param(1, Ctx()),
    __param(2, Args()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [User, Object, SessionsPageArgsQL]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "sessions", null);
__decorate([
    FieldResolver(() => PlayQueueQL, { nullable: true }),
    __param(0, GQLRoot()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [User]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "playQueue", null);
__decorate([
    FieldResolver(() => UserFavoritesQL),
    __param(0, GQLRoot()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [User]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "favorites", null);
UserResolver = __decorate([
    Resolver(UserQL)
], UserResolver);
export { UserResolver };
//# sourceMappingURL=user.resolver.js.map