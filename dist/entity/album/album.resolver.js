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
import { DBObjectType } from '../../types/enums.js';
import { Arg, Args, Ctx, FieldResolver, ID, Int, Query, Resolver, Root as GQLRoot } from 'type-graphql';
import { StateQL } from '../state/state.js';
import { Album, AlbumIndexQL, AlbumPageQL, AlbumQL } from './album.js';
import { ArtistQL } from '../artist/artist.js';
import { TrackQL } from '../track/track.js';
import { RootQL } from '../root/root.js';
import { FolderQL } from '../folder/folder.js';
import { SeriesQL } from '../series/series.js';
import { AlbumIndexArgsQL, AlbumsArgsQL } from './album.args.js';
import { GenreQL } from '../genre/genre.js';
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
    async genres(album) {
        return album.genres.getItems();
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
        return await orm.State.findOrCreate(album.id, DBObjectType.album, user.id);
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
    Query(() => AlbumQL, { description: 'Get an Album by Id' }),
    __param(0, Arg('id', () => ID)),
    __param(1, Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AlbumResolver.prototype, "album", null);
__decorate([
    Query(() => AlbumPageQL, { description: 'Search albums' }),
    __param(0, Args()),
    __param(1, Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [AlbumsArgsQL, Object]),
    __metadata("design:returntype", Promise)
], AlbumResolver.prototype, "albums", null);
__decorate([
    Query(() => AlbumIndexQL, { description: 'Get the Navigation Index for Albums' }),
    __param(0, Args()),
    __param(1, Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [AlbumIndexArgsQL, Object]),
    __metadata("design:returntype", Promise)
], AlbumResolver.prototype, "albumIndex", null);
__decorate([
    FieldResolver(() => ArtistQL),
    __param(0, GQLRoot()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Album]),
    __metadata("design:returntype", Promise)
], AlbumResolver.prototype, "artist", null);
__decorate([
    FieldResolver(() => [TrackQL]),
    __param(0, GQLRoot()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Album]),
    __metadata("design:returntype", Promise)
], AlbumResolver.prototype, "tracks", null);
__decorate([
    FieldResolver(() => [GenreQL]),
    __param(0, GQLRoot()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Album]),
    __metadata("design:returntype", Promise)
], AlbumResolver.prototype, "genres", null);
__decorate([
    FieldResolver(() => [RootQL]),
    __param(0, GQLRoot()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Album]),
    __metadata("design:returntype", Promise)
], AlbumResolver.prototype, "roots", null);
__decorate([
    FieldResolver(() => [FolderQL]),
    __param(0, GQLRoot()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Album]),
    __metadata("design:returntype", Promise)
], AlbumResolver.prototype, "folders", null);
__decorate([
    FieldResolver(() => SeriesQL, { nullable: true }),
    __param(0, GQLRoot()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Album]),
    __metadata("design:returntype", Promise)
], AlbumResolver.prototype, "series", null);
__decorate([
    FieldResolver(() => StateQL),
    __param(0, GQLRoot()),
    __param(1, Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Album, Object]),
    __metadata("design:returntype", Promise)
], AlbumResolver.prototype, "state", null);
__decorate([
    FieldResolver(() => Int),
    __param(0, GQLRoot()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Album]),
    __metadata("design:returntype", Promise)
], AlbumResolver.prototype, "foldersCount", null);
__decorate([
    FieldResolver(() => Int),
    __param(0, GQLRoot()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Album]),
    __metadata("design:returntype", Promise)
], AlbumResolver.prototype, "tracksCount", null);
__decorate([
    FieldResolver(() => Int),
    __param(0, GQLRoot()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Album]),
    __metadata("design:returntype", Promise)
], AlbumResolver.prototype, "rootsCount", null);
AlbumResolver = __decorate([
    Resolver(AlbumQL)
], AlbumResolver);
export { AlbumResolver };
//# sourceMappingURL=album.resolver.js.map