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
exports.PlaylistResolver = void 0;
const type_graphql_1 = require("type-graphql");
const state_1 = require("../state/state");
const enums_1 = require("../../types/enums");
const playlist_1 = require("./playlist");
const playlist_entry_1 = require("../playlistentry/playlist-entry");
const playlist_args_1 = require("./playlist.args");
let PlaylistResolver = class PlaylistResolver {
    async playlist(id, { orm, user }) {
        return await orm.Playlist.oneOrFail({ where: { id, user: user.id, isPublic: true } });
    }
    async playlists({ page, filter, order, list }, { orm, user }) {
        if (list) {
            return await orm.Playlist.findListFilter(list, filter, order, page, user);
        }
        return await orm.Playlist.searchFilter(filter, order, page, user);
    }
    async playlistIndex({ filter }, { orm, user }) {
        return await orm.Playlist.indexFilter(filter, user);
    }
    async entries(playlist) {
        return playlist.entries.getItems();
    }
    async entriesCount(playlist) {
        return playlist.entries.count();
    }
    userID(playlist) {
        return playlist.user.idOrFail();
    }
    async userName(playlist) {
        return (await playlist.user.getOrFail()).name;
    }
    async state(playlist, { orm, user }) {
        return await orm.State.findOrCreate(playlist.id, enums_1.DBObjectType.playlist, user.id);
    }
};
__decorate([
    type_graphql_1.Query(() => playlist_1.PlaylistQL, { description: 'Get a Playlist by Id' }),
    __param(0, type_graphql_1.Arg('id', () => type_graphql_1.ID)), __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PlaylistResolver.prototype, "playlist", null);
__decorate([
    type_graphql_1.Query(() => playlist_1.PlaylistPageQL, { description: 'Search Playlists' }),
    __param(0, type_graphql_1.Args()), __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [playlist_args_1.PlaylistsArgs, Object]),
    __metadata("design:returntype", Promise)
], PlaylistResolver.prototype, "playlists", null);
__decorate([
    type_graphql_1.Query(() => playlist_1.PlaylistIndexQL, { description: 'Get the Navigation Index for Playlists' }),
    __param(0, type_graphql_1.Args()), __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [playlist_args_1.PlaylistIndexArgs, Object]),
    __metadata("design:returntype", Promise)
], PlaylistResolver.prototype, "playlistIndex", null);
__decorate([
    type_graphql_1.FieldResolver(() => [playlist_entry_1.PlaylistEntryQL]),
    __param(0, type_graphql_1.Root()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [playlist_1.Playlist]),
    __metadata("design:returntype", Promise)
], PlaylistResolver.prototype, "entries", null);
__decorate([
    type_graphql_1.FieldResolver(() => type_graphql_1.Int),
    __param(0, type_graphql_1.Root()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [playlist_1.Playlist]),
    __metadata("design:returntype", Promise)
], PlaylistResolver.prototype, "entriesCount", null);
__decorate([
    type_graphql_1.FieldResolver(() => type_graphql_1.ID),
    __param(0, type_graphql_1.Root()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [playlist_1.Playlist]),
    __metadata("design:returntype", String)
], PlaylistResolver.prototype, "userID", null);
__decorate([
    type_graphql_1.FieldResolver(() => String),
    __param(0, type_graphql_1.Root()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [playlist_1.Playlist]),
    __metadata("design:returntype", Promise)
], PlaylistResolver.prototype, "userName", null);
__decorate([
    type_graphql_1.FieldResolver(() => state_1.StateQL),
    __param(0, type_graphql_1.Root()), __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [playlist_1.Playlist, Object]),
    __metadata("design:returntype", Promise)
], PlaylistResolver.prototype, "state", null);
PlaylistResolver = __decorate([
    type_graphql_1.Resolver(playlist_1.PlaylistQL)
], PlaylistResolver);
exports.PlaylistResolver = PlaylistResolver;
//# sourceMappingURL=playlist.resolver.js.map