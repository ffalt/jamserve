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
exports.RootStatusResolver = exports.RootResolver = void 0;
const type_graphql_1 = require("type-graphql");
const root_1 = require("./root");
const root_args_1 = require("./root.args");
const track_1 = require("../track/track");
const folder_1 = require("../folder/folder");
const album_1 = require("../album/album");
const series_1 = require("../series/series");
const artist_1 = require("../artist/artist");
let RootResolver = class RootResolver {
    async root(id, { orm }) {
        return await orm.Root.oneOrFail(id);
    }
    async roots({ page, filter, order, list }, { orm, user }) {
        if (list) {
            return await orm.Root.findListFilter(list, filter, order, page, user);
        }
        return await orm.Root.searchFilter(filter, order, page, user);
    }
    async status(root, { engine }) {
        return engine.ioService.getRootStatus(root.id);
    }
    async tracks(root, { orm }) {
        await orm.Root.populate(root, 'tracks');
        return root.tracks.getItems();
    }
    async folders(root, { orm }) {
        await orm.Root.populate(root, 'folders');
        return root.folders.getItems();
    }
    async albums(root, { orm }) {
        await orm.Root.populate(root, 'albums');
        return root.albums.getItems();
    }
    async series(root, { orm }) {
        await orm.Root.populate(root, 'series');
        return root.series.getItems();
    }
    async artists(root, { orm }) {
        await orm.Root.populate(root, 'artists');
        return root.artists.getItems();
    }
};
__decorate([
    type_graphql_1.Query(() => root_1.RootQL, { description: 'Get a Root by Id' }),
    __param(0, type_graphql_1.Arg('id', () => type_graphql_1.ID)), __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], RootResolver.prototype, "root", null);
__decorate([
    type_graphql_1.Query(() => root_1.RootPageQL, { description: 'Search Roots' }),
    __param(0, type_graphql_1.Args()), __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [root_args_1.RootsArgs, Object]),
    __metadata("design:returntype", Promise)
], RootResolver.prototype, "roots", null);
__decorate([
    type_graphql_1.FieldResolver(() => root_1.RootStatusQL),
    __param(0, type_graphql_1.Root()), __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [root_1.Root, Object]),
    __metadata("design:returntype", Promise)
], RootResolver.prototype, "status", null);
__decorate([
    type_graphql_1.FieldResolver(() => [track_1.TrackQL]),
    __param(0, type_graphql_1.Root()), __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [root_1.Root, Object]),
    __metadata("design:returntype", Promise)
], RootResolver.prototype, "tracks", null);
__decorate([
    type_graphql_1.FieldResolver(() => [folder_1.FolderQL]),
    __param(0, type_graphql_1.Root()), __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [root_1.Root, Object]),
    __metadata("design:returntype", Promise)
], RootResolver.prototype, "folders", null);
__decorate([
    type_graphql_1.FieldResolver(() => [album_1.AlbumQL]),
    __param(0, type_graphql_1.Root()), __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [root_1.Root, Object]),
    __metadata("design:returntype", Promise)
], RootResolver.prototype, "albums", null);
__decorate([
    type_graphql_1.FieldResolver(() => [series_1.SeriesQL]),
    __param(0, type_graphql_1.Root()), __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [root_1.Root, Object]),
    __metadata("design:returntype", Promise)
], RootResolver.prototype, "series", null);
__decorate([
    type_graphql_1.FieldResolver(() => [artist_1.ArtistQL]),
    __param(0, type_graphql_1.Root()), __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [root_1.Root, Object]),
    __metadata("design:returntype", Promise)
], RootResolver.prototype, "artists", null);
RootResolver = __decorate([
    type_graphql_1.Resolver(root_1.RootQL)
], RootResolver);
exports.RootResolver = RootResolver;
let RootStatusResolver = class RootStatusResolver {
    lastScan(status) {
        return new Date(status.lastScan);
    }
};
__decorate([
    type_graphql_1.FieldResolver(() => root_1.RootStatusQL),
    __param(0, type_graphql_1.Root()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Date)
], RootStatusResolver.prototype, "lastScan", null);
RootStatusResolver = __decorate([
    type_graphql_1.Resolver(root_1.RootStatusQL)
], RootStatusResolver);
exports.RootStatusResolver = RootStatusResolver;
//# sourceMappingURL=root.resolver.js.map