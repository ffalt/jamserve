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
import { Root as GQLRoot, Arg, Args, Ctx, FieldResolver, ID, Int, Query, Resolver } from 'type-graphql';
import { Genre, GenreIndexQL, GenrePageQL, GenreQL } from './genre';
import { GenreIndexArgsQL, GenresArgsQL } from './genre.args';
import { AlbumPageQL } from '../album/album';
import { TrackPageQL } from '../track/track';
import { ArtistPageQL } from '../artist/artist';
import { TrackPageArgsQL } from '../track/track.args';
import { AlbumPageArgsQL } from '../album/album.args';
import { ArtistPageArgsQL } from '../artist/artist.args';
let GenreResolver = class GenreResolver {
    async genre(id, { orm }) {
        return await orm.Genre.oneOrFailByID(id);
    }
    async genres({ filter, page, order, list, seed }, { user, orm }) {
        if (list) {
            return await orm.Genre.findListFilter(list, seed, filter, order, page, user);
        }
        return await orm.Genre.searchFilter(filter, order, page, user);
    }
    async genreIndex({ filter }, { orm }) {
        return await orm.Genre.indexFilter(filter);
    }
    async albumCount(genre) {
        return genre.albums.count();
    }
    async artistCount(genre) {
        return genre.artists.count();
    }
    async folderCount(genre) {
        return genre.folders.count();
    }
    async trackCount(genre) {
        return genre.tracks.count();
    }
    async tracks(genre, { orm, user }, { filter, order, page }) {
        return orm.Track.searchFilter({ ...filter, genreIDs: [genre.id] }, order, page, user);
    }
    async albums(genre, { orm, user }, { filter, order, page }) {
        return orm.Album.searchFilter({ ...filter, genreIDs: [genre.id] }, order, page, user);
    }
    async artists(genre, { orm, user }, { filter, order, page }) {
        return orm.Artist.searchFilter({ ...filter, genreIDs: [genre.id] }, order, page, user);
    }
};
__decorate([
    Query(() => GenreQL, { description: 'Get an Genre by Id' }),
    __param(0, Arg('id', () => ID)),
    __param(1, Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], GenreResolver.prototype, "genre", null);
__decorate([
    Query(() => GenrePageQL, { description: 'Search Genres' }),
    __param(0, Args()),
    __param(1, Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [GenresArgsQL, Object]),
    __metadata("design:returntype", Promise)
], GenreResolver.prototype, "genres", null);
__decorate([
    Query(() => GenreIndexQL, { description: 'Get the Navigation Index for Genres' }),
    __param(0, Args()),
    __param(1, Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [GenreIndexArgsQL, Object]),
    __metadata("design:returntype", Promise)
], GenreResolver.prototype, "genreIndex", null);
__decorate([
    FieldResolver(() => Int),
    __param(0, GQLRoot()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Genre]),
    __metadata("design:returntype", Promise)
], GenreResolver.prototype, "albumCount", null);
__decorate([
    FieldResolver(() => Int),
    __param(0, GQLRoot()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Genre]),
    __metadata("design:returntype", Promise)
], GenreResolver.prototype, "artistCount", null);
__decorate([
    FieldResolver(() => Int),
    __param(0, GQLRoot()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Genre]),
    __metadata("design:returntype", Promise)
], GenreResolver.prototype, "folderCount", null);
__decorate([
    FieldResolver(() => Int),
    __param(0, GQLRoot()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Genre]),
    __metadata("design:returntype", Promise)
], GenreResolver.prototype, "trackCount", null);
__decorate([
    FieldResolver(() => TrackPageQL),
    __param(0, GQLRoot()),
    __param(1, Ctx()),
    __param(2, Args()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Genre, Object, TrackPageArgsQL]),
    __metadata("design:returntype", Promise)
], GenreResolver.prototype, "tracks", null);
__decorate([
    FieldResolver(() => AlbumPageQL),
    __param(0, GQLRoot()),
    __param(1, Ctx()),
    __param(2, Args()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Genre, Object, AlbumPageArgsQL]),
    __metadata("design:returntype", Promise)
], GenreResolver.prototype, "albums", null);
__decorate([
    FieldResolver(() => ArtistPageQL),
    __param(0, GQLRoot()),
    __param(1, Ctx()),
    __param(2, Args()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Genre, Object, ArtistPageArgsQL]),
    __metadata("design:returntype", Promise)
], GenreResolver.prototype, "artists", null);
GenreResolver = __decorate([
    Resolver(GenreQL)
], GenreResolver);
export { GenreResolver };
//# sourceMappingURL=genre.resolver.js.map