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
exports.AlbumResolver = void 0;
const enums_1 = require("../../types/enums");
const type_graphql_1 = require("type-graphql");
const state_1 = require("../state/state");
const album_1 = require("./album");
const artist_1 = require("../artist/artist");
const track_1 = require("../track/track");
const root_1 = require("../root/root");
const folder_1 = require("../folder/folder");
const series_1 = require("../series/series");
const album_args_1 = require("./album.args");
let AlbumResolver = class AlbumResolver {
    async album(id, { orm }) {
        return await orm.Album.oneOrFailByID(id);
    }
    async albums({ filter, page, order, list, seed }, { orm, user }) {
        if (list) {
            return await orm.Album.findListFilter(list, seed, filter, order, page, user);
        }
        return await orm.Album.searchFilter(filter, order, page, user);
    }
    async albumIndex({ filter }, { orm }) {
        return await orm.Album.indexFilter(filter);
    }
    async artist(album) {
        return album.artist.getOrFail();
    }
    async tracks(album) {
        return album.tracks.getItems();
    }
    async roots(album) {
        return album.roots.getItems();
    }
    async folders(album) {
        return album.folders.getItems();
    }
    async series(album) {
        return album.series.get();
    }
    async state(album, { orm, user }) {
        return await orm.State.findOrCreate(album.id, enums_1.DBObjectType.album, user.id);
    }
    async foldersCount(album) {
        return album.folders.count();
    }
    async tracksCount(album) {
        return album.tracks.count();
    }
    async rootsCount(album) {
        return album.roots.count();
    }
};
__decorate([
    type_graphql_1.Query(() => album_1.AlbumQL, { description: 'Get an Album by Id' }),
    __param(0, type_graphql_1.Arg('id', () => type_graphql_1.ID)), __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AlbumResolver.prototype, "album", null);
__decorate([
    type_graphql_1.Query(() => album_1.AlbumPageQL, { description: 'Search albums' }),
    __param(0, type_graphql_1.Args()), __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [album_args_1.AlbumsArgsQL, Object]),
    __metadata("design:returntype", Promise)
], AlbumResolver.prototype, "albums", null);
__decorate([
    type_graphql_1.Query(() => album_1.AlbumIndexQL, { description: 'Get the Navigation Index for Albums' }),
    __param(0, type_graphql_1.Args()), __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [album_args_1.AlbumIndexArgsQL, Object]),
    __metadata("design:returntype", Promise)
], AlbumResolver.prototype, "albumIndex", null);
__decorate([
    type_graphql_1.FieldResolver(() => artist_1.ArtistQL),
    __param(0, type_graphql_1.Root()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [album_1.Album]),
    __metadata("design:returntype", Promise)
], AlbumResolver.prototype, "artist", null);
__decorate([
    type_graphql_1.FieldResolver(() => [track_1.TrackQL]),
    __param(0, type_graphql_1.Root()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [album_1.Album]),
    __metadata("design:returntype", Promise)
], AlbumResolver.prototype, "tracks", null);
__decorate([
    type_graphql_1.FieldResolver(() => [root_1.RootQL]),
    __param(0, type_graphql_1.Root()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [album_1.Album]),
    __metadata("design:returntype", Promise)
], AlbumResolver.prototype, "roots", null);
__decorate([
    type_graphql_1.FieldResolver(() => [folder_1.FolderQL]),
    __param(0, type_graphql_1.Root()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [album_1.Album]),
    __metadata("design:returntype", Promise)
], AlbumResolver.prototype, "folders", null);
__decorate([
    type_graphql_1.FieldResolver(() => series_1.SeriesQL, { nullable: true }),
    __param(0, type_graphql_1.Root()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [album_1.Album]),
    __metadata("design:returntype", Promise)
], AlbumResolver.prototype, "series", null);
__decorate([
    type_graphql_1.FieldResolver(() => state_1.StateQL),
    __param(0, type_graphql_1.Root()), __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [album_1.Album, Object]),
    __metadata("design:returntype", Promise)
], AlbumResolver.prototype, "state", null);
__decorate([
    type_graphql_1.FieldResolver(() => type_graphql_1.Int),
    __param(0, type_graphql_1.Root()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [album_1.Album]),
    __metadata("design:returntype", Promise)
], AlbumResolver.prototype, "foldersCount", null);
__decorate([
    type_graphql_1.FieldResolver(() => type_graphql_1.Int),
    __param(0, type_graphql_1.Root()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [album_1.Album]),
    __metadata("design:returntype", Promise)
], AlbumResolver.prototype, "tracksCount", null);
__decorate([
    type_graphql_1.FieldResolver(() => type_graphql_1.Int),
    __param(0, type_graphql_1.Root()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [album_1.Album]),
    __metadata("design:returntype", Promise)
], AlbumResolver.prototype, "rootsCount", null);
AlbumResolver = __decorate([
    type_graphql_1.Resolver(album_1.AlbumQL)
], AlbumResolver);
exports.AlbumResolver = AlbumResolver;
//# sourceMappingURL=album.resolver.js.map