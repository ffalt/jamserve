"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserResolver = exports.UserFavoritesResolver = exports.UserFavorites = void 0;
const enums_1 = require("../../types/enums");
const type_graphql_1 = require("type-graphql");
const user_1 = require("./user");
const user_service_1 = require("./user.service");
const user_args_1 = require("./user.args");
const session_1 = require("../session/session");
const bookmark_1 = require("../bookmark/bookmark");
const playqueue_1 = require("../playqueue/playqueue");
const playlist_1 = require("../playlist/playlist");
const playlist_args_1 = require("../playlist/playlist.args");
const bookmark_args_1 = require("../bookmark/bookmark.args");
const session_args_1 = require("../session/session.args");
const album_args_1 = require("../album/album.args");
const artist_args_1 = require("../artist/artist.args");
const series_args_1 = require("../series/series.args");
const podcast_1 = require("../podcast/podcast");
const podcast_args_1 = require("../podcast/podcast.args");
const episode_1 = require("../episode/episode");
const episode_args_1 = require("../episode/episode.args");
const track_args_1 = require("../track/track.args");
const folder_args_1 = require("../folder/folder.args");
const artwork_args_1 = require("../artwork/artwork.args");
let UserFavorites = class UserFavorites {
};
UserFavorites = __decorate([
    type_graphql_1.ObjectType()
], UserFavorites);
exports.UserFavorites = UserFavorites;
let UserFavoritesResolver = class UserFavoritesResolver {
    async albums(owner, { orm }, { filter, order, page }) {
        return orm.Album.findListFilter(enums_1.ListType.faved, filter, order, page, owner.user);
    }
    async artists(owner, { orm }, { filter, order, page }) {
        return orm.Artist.findListFilter(enums_1.ListType.faved, filter, order, page, owner.user);
    }
    async series(owner, { orm }, { filter, order, page }) {
        return orm.Series.findListFilter(enums_1.ListType.faved, filter, order, page, owner.user);
    }
    async podcasts(owner, { orm }, { filter, order, page }) {
        return orm.Podcast.findListFilter(enums_1.ListType.faved, filter, order, page, owner.user);
    }
    async episodes(owner, { orm }, { filter, order, page }) {
        return orm.Episode.findListFilter(enums_1.ListType.faved, filter, order, page, owner.user);
    }
    async tracks(owner, { orm }, { filter, order, page }) {
        return orm.Track.findListFilter(enums_1.ListType.faved, filter, order, page, owner.user);
    }
    async folders(owner, { orm }, { filter, order, page }) {
        return orm.Folder.findListFilter(enums_1.ListType.faved, filter, order, page, owner.user);
    }
    async playlists(owner, { orm }, { filter, order, page }) {
        return orm.Playlist.findListFilter(enums_1.ListType.faved, filter, order, page, owner.user);
    }
    async artworks(owner, { orm }, { filter, order, page }) {
        return orm.Artwork.findListFilter(enums_1.ListType.faved, filter, order, page, owner.user);
    }
};
__decorate([
    type_graphql_1.FieldResolver(() => playlist_1.PlaylistPageQL),
    __param(0, type_graphql_1.Root()), __param(1, type_graphql_1.Ctx()), __param(2, type_graphql_1.Args()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [UserFavorites, Object, album_args_1.AlbumPageArgsQL]),
    __metadata("design:returntype", Promise)
], UserFavoritesResolver.prototype, "albums", null);
__decorate([
    type_graphql_1.FieldResolver(() => playlist_1.PlaylistPageQL),
    __param(0, type_graphql_1.Root()), __param(1, type_graphql_1.Ctx()), __param(2, type_graphql_1.Args()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [UserFavorites, Object, artist_args_1.ArtistPageArgsQL]),
    __metadata("design:returntype", Promise)
], UserFavoritesResolver.prototype, "artists", null);
__decorate([
    type_graphql_1.FieldResolver(() => playlist_1.PlaylistPageQL),
    __param(0, type_graphql_1.Root()), __param(1, type_graphql_1.Ctx()), __param(2, type_graphql_1.Args()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [UserFavorites, Object, series_args_1.SeriesPageArgsQL]),
    __metadata("design:returntype", Promise)
], UserFavoritesResolver.prototype, "series", null);
__decorate([
    type_graphql_1.FieldResolver(() => podcast_1.PodcastPageQL),
    __param(0, type_graphql_1.Root()), __param(1, type_graphql_1.Ctx()), __param(2, type_graphql_1.Args()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [UserFavorites, Object, podcast_args_1.PodcastPageArgsQL]),
    __metadata("design:returntype", Promise)
], UserFavoritesResolver.prototype, "podcasts", null);
__decorate([
    type_graphql_1.FieldResolver(() => episode_1.EpisodePageQL),
    __param(0, type_graphql_1.Root()), __param(1, type_graphql_1.Ctx()), __param(2, type_graphql_1.Args()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [UserFavorites, Object, episode_args_1.EpisodePageArgsQL]),
    __metadata("design:returntype", Promise)
], UserFavoritesResolver.prototype, "episodes", null);
__decorate([
    type_graphql_1.FieldResolver(() => episode_1.EpisodePageQL),
    __param(0, type_graphql_1.Root()), __param(1, type_graphql_1.Ctx()), __param(2, type_graphql_1.Args()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [UserFavorites, Object, track_args_1.TrackPageArgsQL]),
    __metadata("design:returntype", Promise)
], UserFavoritesResolver.prototype, "tracks", null);
__decorate([
    type_graphql_1.FieldResolver(() => episode_1.EpisodePageQL),
    __param(0, type_graphql_1.Root()), __param(1, type_graphql_1.Ctx()), __param(2, type_graphql_1.Args()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [UserFavorites, Object, folder_args_1.FolderPageArgsQL]),
    __metadata("design:returntype", Promise)
], UserFavoritesResolver.prototype, "folders", null);
__decorate([
    type_graphql_1.FieldResolver(() => episode_1.EpisodePageQL),
    __param(0, type_graphql_1.Root()), __param(1, type_graphql_1.Ctx()), __param(2, type_graphql_1.Args()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [UserFavorites, Object, playlist_args_1.PlaylistPageArgsQL]),
    __metadata("design:returntype", Promise)
], UserFavoritesResolver.prototype, "playlists", null);
__decorate([
    type_graphql_1.FieldResolver(() => episode_1.EpisodePageQL),
    __param(0, type_graphql_1.Root()), __param(1, type_graphql_1.Ctx()), __param(2, type_graphql_1.Args()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [UserFavorites, Object, artwork_args_1.ArtworkPageArgsQL]),
    __metadata("design:returntype", Promise)
], UserFavoritesResolver.prototype, "artworks", null);
UserFavoritesResolver = __decorate([
    type_graphql_1.Resolver(user_1.UserFavoritesQL)
], UserFavoritesResolver);
exports.UserFavoritesResolver = UserFavoritesResolver;
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
        return user_service_1.UserService.listfyRoles(user);
    }
    async playlists(owner, { orm, user }, { filter, order, page }) {
        return orm.Playlist.searchFilter({ ...filter, userIDs: [owner.id] }, order, page, owner);
    }
    async bookmarks(owner, { orm, user }, { filter, order, page }) {
        return orm.Bookmark.searchFilter({ ...filter, userIDs: [owner.id] }, order, page, owner);
    }
    async sessions(owner, { orm, user }, { filter, order, page }) {
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
    type_graphql_1.Query(() => user_1.UserQL),
    __param(0, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", user_1.User)
], UserResolver.prototype, "currentUser", null);
__decorate([
    type_graphql_1.Authorized(enums_1.UserRole.admin),
    type_graphql_1.Query(() => user_1.UserQL),
    __param(0, type_graphql_1.Arg('id', () => type_graphql_1.ID)), __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "user", null);
__decorate([
    type_graphql_1.Authorized(enums_1.UserRole.admin),
    type_graphql_1.Query(() => user_1.UserPageQL),
    __param(0, type_graphql_1.Args()), __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_args_1.UsersArgs, Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "users", null);
__decorate([
    type_graphql_1.Authorized(enums_1.UserRole.admin),
    type_graphql_1.Query(() => user_1.UserIndexQL),
    __param(0, type_graphql_1.Args()), __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_args_1.UserIndexArgs, Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "userIndex", null);
__decorate([
    type_graphql_1.FieldResolver(() => [enums_1.UserRole]),
    __param(0, type_graphql_1.Root()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_1.User]),
    __metadata("design:returntype", Array)
], UserResolver.prototype, "roles", null);
__decorate([
    type_graphql_1.FieldResolver(() => playlist_1.PlaylistPageQL),
    __param(0, type_graphql_1.Root()), __param(1, type_graphql_1.Ctx()), __param(2, type_graphql_1.Args()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_1.User, Object, playlist_args_1.PlaylistPageArgsQL]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "playlists", null);
__decorate([
    type_graphql_1.FieldResolver(() => bookmark_1.BookmarkPageQL),
    __param(0, type_graphql_1.Root()), __param(1, type_graphql_1.Ctx()), __param(2, type_graphql_1.Args()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_1.User, Object, bookmark_args_1.BookmarksPageArgsQL]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "bookmarks", null);
__decorate([
    type_graphql_1.FieldResolver(() => session_1.SessionPageQL),
    __param(0, type_graphql_1.Root()), __param(1, type_graphql_1.Ctx()), __param(2, type_graphql_1.Args()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_1.User, Object, session_args_1.SessionsPageArgsQL]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "sessions", null);
__decorate([
    type_graphql_1.FieldResolver(() => playqueue_1.PlayQueueQL, { nullable: true }),
    __param(0, type_graphql_1.Root()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_1.User]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "playQueue", null);
__decorate([
    type_graphql_1.FieldResolver(() => user_1.UserFavoritesQL),
    __param(0, type_graphql_1.Root()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_1.User]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "favorites", null);
UserResolver = __decorate([
    type_graphql_1.Resolver(user_1.UserQL)
], UserResolver);
exports.UserResolver = UserResolver;
//# sourceMappingURL=user.resolver.js.map