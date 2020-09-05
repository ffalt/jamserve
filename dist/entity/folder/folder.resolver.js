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
exports.FolderResolver = void 0;
const enums_1 = require("../../types/enums");
const type_graphql_1 = require("type-graphql");
const state_1 = require("../state/state");
const folder_1 = require("./folder");
const series_1 = require("../series/series");
const artist_1 = require("../artist/artist");
const album_1 = require("../album/album");
const track_1 = require("../track/track");
const artwork_1 = require("../artwork/artwork");
const folder_args_1 = require("./folder.args");
let FolderResolver = class FolderResolver {
    async folder(id, { orm }) {
        return await orm.Folder.oneOrFailByID(id);
    }
    async folders({ page, filter, order, list }, { orm, user }) {
        if (list) {
            return await orm.Folder.findListFilter(list, filter, order, page, user);
        }
        return await orm.Folder.searchFilter(filter, order, page, user);
    }
    async folderIndex({ filter }, { orm, user }) {
        return await orm.Folder.indexFilter(filter, user);
    }
    async children(folder) {
        return folder.children.getItems();
    }
    async childrenCount(folder) {
        return folder.children.count();
    }
    async series(folder) {
        return folder.series.getItems();
    }
    async seriesCount(folder) {
        return folder.series.count();
    }
    async artists(folder) {
        return folder.artists.getItems();
    }
    async artistsCount(folder) {
        return folder.artists.count();
    }
    async albums(folder) {
        return folder.albums.getItems();
    }
    async albumsCount(folder) {
        return folder.albums.count();
    }
    async tracks(folder) {
        return folder.tracks.getItems();
    }
    async tracksCount(folder) {
        return folder.tracks.count();
    }
    async artworks(folder) {
        return folder.artworks.getItems();
    }
    async artworksCount(folder) {
        return folder.artworks.count();
    }
    async state(folder, { orm, user }) {
        return await orm.State.findOrCreate(folder.id, enums_1.DBObjectType.folder, user.id);
    }
    statCreated(timestamp) {
        return new Date(timestamp);
    }
    statModified(timestamp) {
        return new Date(timestamp);
    }
};
__decorate([
    type_graphql_1.Query(() => folder_1.FolderQL, { description: 'Get a Folder by Id' }),
    __param(0, type_graphql_1.Arg('id', () => type_graphql_1.ID)), __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], FolderResolver.prototype, "folder", null);
__decorate([
    type_graphql_1.Query(() => folder_1.FolderPageQL, { description: 'Search Folders' }),
    __param(0, type_graphql_1.Args()), __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [folder_args_1.FoldersArgsQL, Object]),
    __metadata("design:returntype", Promise)
], FolderResolver.prototype, "folders", null);
__decorate([
    type_graphql_1.Query(() => folder_1.FolderIndexQL, { description: 'Get the Navigation Index for Folders' }),
    __param(0, type_graphql_1.Args()), __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [folder_args_1.FolderIndexArgs, Object]),
    __metadata("design:returntype", Promise)
], FolderResolver.prototype, "folderIndex", null);
__decorate([
    type_graphql_1.FieldResolver(() => [folder_1.FolderQL]),
    __param(0, type_graphql_1.Root()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [folder_1.Folder]),
    __metadata("design:returntype", Promise)
], FolderResolver.prototype, "children", null);
__decorate([
    type_graphql_1.FieldResolver(() => type_graphql_1.Int),
    __param(0, type_graphql_1.Root()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [folder_1.Folder]),
    __metadata("design:returntype", Promise)
], FolderResolver.prototype, "childrenCount", null);
__decorate([
    type_graphql_1.FieldResolver(() => [series_1.SeriesQL], { nullable: true }),
    __param(0, type_graphql_1.Root()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [folder_1.Folder]),
    __metadata("design:returntype", Promise)
], FolderResolver.prototype, "series", null);
__decorate([
    type_graphql_1.FieldResolver(() => type_graphql_1.Int),
    __param(0, type_graphql_1.Root()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [folder_1.Folder]),
    __metadata("design:returntype", Promise)
], FolderResolver.prototype, "seriesCount", null);
__decorate([
    type_graphql_1.FieldResolver(() => [artist_1.ArtistQL], { nullable: true }),
    __param(0, type_graphql_1.Root()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [folder_1.Folder]),
    __metadata("design:returntype", Promise)
], FolderResolver.prototype, "artists", null);
__decorate([
    type_graphql_1.FieldResolver(() => type_graphql_1.Int),
    __param(0, type_graphql_1.Root()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [folder_1.Folder]),
    __metadata("design:returntype", Promise)
], FolderResolver.prototype, "artistsCount", null);
__decorate([
    type_graphql_1.FieldResolver(() => [album_1.AlbumQL], { nullable: true }),
    __param(0, type_graphql_1.Root()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [folder_1.Folder]),
    __metadata("design:returntype", Promise)
], FolderResolver.prototype, "albums", null);
__decorate([
    type_graphql_1.FieldResolver(() => type_graphql_1.Int),
    __param(0, type_graphql_1.Root()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [folder_1.Folder]),
    __metadata("design:returntype", Promise)
], FolderResolver.prototype, "albumsCount", null);
__decorate([
    type_graphql_1.FieldResolver(() => [track_1.TrackQL], { nullable: true }),
    __param(0, type_graphql_1.Root()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [folder_1.Folder]),
    __metadata("design:returntype", Promise)
], FolderResolver.prototype, "tracks", null);
__decorate([
    type_graphql_1.FieldResolver(() => type_graphql_1.Int),
    __param(0, type_graphql_1.Root()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [folder_1.Folder]),
    __metadata("design:returntype", Promise)
], FolderResolver.prototype, "tracksCount", null);
__decorate([
    type_graphql_1.FieldResolver(() => [artwork_1.ArtworkQL], { nullable: true }),
    __param(0, type_graphql_1.Root()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [folder_1.Folder]),
    __metadata("design:returntype", Promise)
], FolderResolver.prototype, "artworks", null);
__decorate([
    type_graphql_1.FieldResolver(() => type_graphql_1.Int),
    __param(0, type_graphql_1.Root()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [folder_1.Folder]),
    __metadata("design:returntype", Promise)
], FolderResolver.prototype, "artworksCount", null);
__decorate([
    type_graphql_1.FieldResolver(() => state_1.StateQL),
    __param(0, type_graphql_1.Root()), __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [folder_1.Folder, Object]),
    __metadata("design:returntype", Promise)
], FolderResolver.prototype, "state", null);
__decorate([
    type_graphql_1.FieldResolver(() => Date),
    __param(0, type_graphql_1.Root()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Date)
], FolderResolver.prototype, "statCreated", null);
__decorate([
    type_graphql_1.FieldResolver(() => Date),
    __param(0, type_graphql_1.Root()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Date)
], FolderResolver.prototype, "statModified", null);
FolderResolver = __decorate([
    type_graphql_1.Resolver(folder_1.FolderQL)
], FolderResolver);
exports.FolderResolver = FolderResolver;
//# sourceMappingURL=folder.resolver.js.map