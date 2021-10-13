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
import { DBObjectType } from '../../types/enums';
import { Arg, Args, Ctx, FieldResolver, ID, Int, Query, Resolver, Root as GQLRoot } from 'type-graphql';
import { StateQL } from '../state/state';
import { Folder, FolderIndexQL, FolderPageQL, FolderQL } from './folder';
import { SeriesQL } from '../series/series';
import { ArtistQL } from '../artist/artist';
import { AlbumQL } from '../album/album';
import { TrackQL } from '../track/track';
import { ArtworkQL } from '../artwork/artwork';
import { FolderIndexArgs, FoldersArgsQL } from './folder.args';
import { GenreQL } from '../genre/genre';
let FolderResolver = class FolderResolver {
    async folder(id, { orm }) {
        return await orm.Folder.oneOrFailByID(id);
    }
    async folders({ page, filter, order, list, seed }, { orm, user }) {
        if (list) {
            return await orm.Folder.findListFilter(list, seed, filter, order, page, user);
        }
        return await orm.Folder.searchFilter(filter, order, page, user);
    }
    async folderIndex({ filter }, { orm, user }) {
        return await orm.Folder.indexFilter(filter, user);
    }
    async children(folder) {
        return folder.children.getItems();
    }
    async genres(folder) {
        return folder.genres.getItems();
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
    async genresCount(folder) {
        return folder.genres.count();
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
        return await orm.State.findOrCreate(folder.id, DBObjectType.folder, user.id);
    }
    statCreated(timestamp) {
        return new Date(timestamp);
    }
    statModified(timestamp) {
        return new Date(timestamp);
    }
    title(folder) {
        return folder.title || folder.name;
    }
};
__decorate([
    Query(() => FolderQL, { description: 'Get a Folder by Id' }),
    __param(0, Arg('id', () => ID)),
    __param(1, Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], FolderResolver.prototype, "folder", null);
__decorate([
    Query(() => FolderPageQL, { description: 'Search Folders' }),
    __param(0, Args()),
    __param(1, Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [FoldersArgsQL, Object]),
    __metadata("design:returntype", Promise)
], FolderResolver.prototype, "folders", null);
__decorate([
    Query(() => FolderIndexQL, { description: 'Get the Navigation Index for Folders' }),
    __param(0, Args()),
    __param(1, Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [FolderIndexArgs, Object]),
    __metadata("design:returntype", Promise)
], FolderResolver.prototype, "folderIndex", null);
__decorate([
    FieldResolver(() => [FolderQL]),
    __param(0, GQLRoot()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Folder]),
    __metadata("design:returntype", Promise)
], FolderResolver.prototype, "children", null);
__decorate([
    FieldResolver(() => [GenreQL]),
    __param(0, GQLRoot()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Folder]),
    __metadata("design:returntype", Promise)
], FolderResolver.prototype, "genres", null);
__decorate([
    FieldResolver(() => Int),
    __param(0, GQLRoot()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Folder]),
    __metadata("design:returntype", Promise)
], FolderResolver.prototype, "childrenCount", null);
__decorate([
    FieldResolver(() => [SeriesQL], { nullable: true }),
    __param(0, GQLRoot()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Folder]),
    __metadata("design:returntype", Promise)
], FolderResolver.prototype, "series", null);
__decorate([
    FieldResolver(() => Int),
    __param(0, GQLRoot()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Folder]),
    __metadata("design:returntype", Promise)
], FolderResolver.prototype, "seriesCount", null);
__decorate([
    FieldResolver(() => [ArtistQL], { nullable: true }),
    __param(0, GQLRoot()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Folder]),
    __metadata("design:returntype", Promise)
], FolderResolver.prototype, "artists", null);
__decorate([
    FieldResolver(() => Int),
    __param(0, GQLRoot()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Folder]),
    __metadata("design:returntype", Promise)
], FolderResolver.prototype, "artistsCount", null);
__decorate([
    FieldResolver(() => [AlbumQL], { nullable: true }),
    __param(0, GQLRoot()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Folder]),
    __metadata("design:returntype", Promise)
], FolderResolver.prototype, "albums", null);
__decorate([
    FieldResolver(() => Int),
    __param(0, GQLRoot()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Folder]),
    __metadata("design:returntype", Promise)
], FolderResolver.prototype, "albumsCount", null);
__decorate([
    FieldResolver(() => Int),
    __param(0, GQLRoot()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Folder]),
    __metadata("design:returntype", Promise)
], FolderResolver.prototype, "genresCount", null);
__decorate([
    FieldResolver(() => [TrackQL], { nullable: true }),
    __param(0, GQLRoot()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Folder]),
    __metadata("design:returntype", Promise)
], FolderResolver.prototype, "tracks", null);
__decorate([
    FieldResolver(() => Int),
    __param(0, GQLRoot()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Folder]),
    __metadata("design:returntype", Promise)
], FolderResolver.prototype, "tracksCount", null);
__decorate([
    FieldResolver(() => [ArtworkQL], { nullable: true }),
    __param(0, GQLRoot()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Folder]),
    __metadata("design:returntype", Promise)
], FolderResolver.prototype, "artworks", null);
__decorate([
    FieldResolver(() => Int),
    __param(0, GQLRoot()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Folder]),
    __metadata("design:returntype", Promise)
], FolderResolver.prototype, "artworksCount", null);
__decorate([
    FieldResolver(() => StateQL),
    __param(0, GQLRoot()),
    __param(1, Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Folder, Object]),
    __metadata("design:returntype", Promise)
], FolderResolver.prototype, "state", null);
__decorate([
    FieldResolver(() => Date),
    __param(0, GQLRoot()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Date)
], FolderResolver.prototype, "statCreated", null);
__decorate([
    FieldResolver(() => Date),
    __param(0, GQLRoot()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Date)
], FolderResolver.prototype, "statModified", null);
__decorate([
    FieldResolver(() => String),
    __param(0, GQLRoot()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Folder]),
    __metadata("design:returntype", String)
], FolderResolver.prototype, "title", null);
FolderResolver = __decorate([
    Resolver(FolderQL)
], FolderResolver);
export { FolderResolver };
//# sourceMappingURL=folder.resolver.js.map