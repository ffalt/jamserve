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
import { Arg, Args, Ctx, FieldResolver, ID, Int, Query, Resolver, Root as GQLRoot } from 'type-graphql';
import { StateQL } from '../state/state.js';
import { DBObjectType } from '../../types/enums.js';
import { Playlist, PlaylistIndexQL, PlaylistPageQL, PlaylistQL } from './playlist.js';
import { PlaylistEntryQL } from '../playlistentry/playlist-entry.js';
import { PlaylistIndexArgs, PlaylistsArgs } from './playlist.args.js';
import { NotFoundError } from '../../modules/rest/index.js';
let PlaylistResolver = class PlaylistResolver {
    async playlist(id, { orm, user }) {
        const list = await orm.Playlist.oneOrFail({ where: { id } });
        if (!list.isPublic && user.id !== list.user.id()) {
            throw NotFoundError();
        }
        return list;
    }
    async playlists({ page, filter, order, list, seed }, { orm, user }) {
        if (list) {
            return await orm.Playlist.findListFilter(list, seed, filter, order, page, user);
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
        return await orm.State.findOrCreate(playlist.id, DBObjectType.playlist, user.id);
    }
};
__decorate([
    Query(() => PlaylistQL, { description: 'Get a Playlist by Id' }),
    __param(0, Arg('id', () => ID)),
    __param(1, Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PlaylistResolver.prototype, "playlist", null);
__decorate([
    Query(() => PlaylistPageQL, { description: 'Search Playlists' }),
    __param(0, Args()),
    __param(1, Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [PlaylistsArgs, Object]),
    __metadata("design:returntype", Promise)
], PlaylistResolver.prototype, "playlists", null);
__decorate([
    Query(() => PlaylistIndexQL, { description: 'Get the Navigation Index for Playlists' }),
    __param(0, Args()),
    __param(1, Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [PlaylistIndexArgs, Object]),
    __metadata("design:returntype", Promise)
], PlaylistResolver.prototype, "playlistIndex", null);
__decorate([
    FieldResolver(() => [PlaylistEntryQL]),
    __param(0, GQLRoot()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Playlist]),
    __metadata("design:returntype", Promise)
], PlaylistResolver.prototype, "entries", null);
__decorate([
    FieldResolver(() => Int),
    __param(0, GQLRoot()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Playlist]),
    __metadata("design:returntype", Promise)
], PlaylistResolver.prototype, "entriesCount", null);
__decorate([
    FieldResolver(() => ID),
    __param(0, GQLRoot()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Playlist]),
    __metadata("design:returntype", String)
], PlaylistResolver.prototype, "userID", null);
__decorate([
    FieldResolver(() => String),
    __param(0, GQLRoot()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Playlist]),
    __metadata("design:returntype", Promise)
], PlaylistResolver.prototype, "userName", null);
__decorate([
    FieldResolver(() => StateQL),
    __param(0, GQLRoot()),
    __param(1, Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Playlist, Object]),
    __metadata("design:returntype", Promise)
], PlaylistResolver.prototype, "state", null);
PlaylistResolver = __decorate([
    Resolver(PlaylistQL)
], PlaylistResolver);
export { PlaylistResolver };
//# sourceMappingURL=playlist.resolver.js.map