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
import { Arg, Args, Ctx, FieldResolver, ID, Query, Resolver, Root as GQLRoot } from 'type-graphql';
import { Root, RootPageQL, RootQL, RootStatusQL } from './root.js';
import { RootsParameters } from './root.parameters.js';
import { TrackQL } from '../track/track.js';
import { FolderQL } from '../folder/folder.js';
import { AlbumQL } from '../album/album.js';
import { SeriesQL } from '../series/series.js';
import { ArtistQL } from '../artist/artist.js';
let RootResolver = class RootResolver {
    async root(id, { orm }) {
        return await orm.Root.oneOrFailByID(id);
    }
    async roots({ page, filter, order, list, seed }, { orm, user }) {
        if (list) {
            return await orm.Root.findListFilter(list, seed, filter, order, page, user);
        }
        return await orm.Root.searchFilter(filter, order, page, user);
    }
    async status(root, { engine }) {
        return engine.io.getRootStatus(root.id);
    }
    async tracks(root) {
        return root.tracks.getItems();
    }
    async folders(root) {
        return root.folders.getItems();
    }
    async albums(root) {
        return root.albums.getItems();
    }
    async series(root) {
        return root.series.getItems();
    }
    async artists(root) {
        return root.artists.getItems();
    }
};
__decorate([
    Query(() => RootQL, { description: 'Get a Root by Id' }),
    __param(0, Arg('id', () => ID)),
    __param(1, Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], RootResolver.prototype, "root", null);
__decorate([
    Query(() => RootPageQL, { description: 'Search Roots' }),
    __param(0, Args()),
    __param(1, Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [RootsParameters, Object]),
    __metadata("design:returntype", Promise)
], RootResolver.prototype, "roots", null);
__decorate([
    FieldResolver(() => RootStatusQL),
    __param(0, GQLRoot()),
    __param(1, Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Root, Object]),
    __metadata("design:returntype", Promise)
], RootResolver.prototype, "status", null);
__decorate([
    FieldResolver(() => [TrackQL]),
    __param(0, GQLRoot()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Root]),
    __metadata("design:returntype", Promise)
], RootResolver.prototype, "tracks", null);
__decorate([
    FieldResolver(() => [FolderQL]),
    __param(0, GQLRoot()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Root]),
    __metadata("design:returntype", Promise)
], RootResolver.prototype, "folders", null);
__decorate([
    FieldResolver(() => [AlbumQL]),
    __param(0, GQLRoot()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Root]),
    __metadata("design:returntype", Promise)
], RootResolver.prototype, "albums", null);
__decorate([
    FieldResolver(() => [SeriesQL]),
    __param(0, GQLRoot()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Root]),
    __metadata("design:returntype", Promise)
], RootResolver.prototype, "series", null);
__decorate([
    FieldResolver(() => [ArtistQL]),
    __param(0, GQLRoot()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Root]),
    __metadata("design:returntype", Promise)
], RootResolver.prototype, "artists", null);
RootResolver = __decorate([
    Resolver(RootQL)
], RootResolver);
export { RootResolver };
let RootStatusResolver = class RootStatusResolver {
    lastScan(status) {
        return new Date(status.lastScan);
    }
};
__decorate([
    FieldResolver(() => RootStatusQL),
    __param(0, GQLRoot()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Date)
], RootStatusResolver.prototype, "lastScan", null);
RootStatusResolver = __decorate([
    Resolver(RootStatusQL)
], RootStatusResolver);
export { RootStatusResolver };
//# sourceMappingURL=root.resolver.js.map