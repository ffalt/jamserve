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
exports.GenreResolver = void 0;
const type_graphql_1 = require("type-graphql");
const genre_1 = require("./genre");
const genre_args_1 = require("./genre.args");
const Root_1 = require("type-graphql/dist/decorators/Root");
const album_1 = require("../album/album");
const track_1 = require("../track/track");
const artist_1 = require("../artist/artist");
const track_args_1 = require("../track/track.args");
const album_args_1 = require("../album/album.args");
const artist_args_1 = require("../artist/artist.args");
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
    type_graphql_1.Query(() => genre_1.GenreQL, { description: 'Get an Genre by Id' }),
    __param(0, type_graphql_1.Arg('id', () => type_graphql_1.ID)), __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], GenreResolver.prototype, "genre", null);
__decorate([
    type_graphql_1.Query(() => genre_1.GenrePageQL, { description: 'Search Genres' }),
    __param(0, type_graphql_1.Args()), __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [genre_args_1.GenresArgsQL, Object]),
    __metadata("design:returntype", Promise)
], GenreResolver.prototype, "genres", null);
__decorate([
    type_graphql_1.Query(() => genre_1.GenreIndexQL, { description: 'Get the Navigation Index for Genres' }),
    __param(0, type_graphql_1.Args()), __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [genre_args_1.GenreIndexArgsQL, Object]),
    __metadata("design:returntype", Promise)
], GenreResolver.prototype, "genreIndex", null);
__decorate([
    type_graphql_1.FieldResolver(() => type_graphql_1.Int),
    __param(0, Root_1.Root()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [genre_1.Genre]),
    __metadata("design:returntype", Promise)
], GenreResolver.prototype, "albumCount", null);
__decorate([
    type_graphql_1.FieldResolver(() => type_graphql_1.Int),
    __param(0, Root_1.Root()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [genre_1.Genre]),
    __metadata("design:returntype", Promise)
], GenreResolver.prototype, "artistCount", null);
__decorate([
    type_graphql_1.FieldResolver(() => type_graphql_1.Int),
    __param(0, Root_1.Root()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [genre_1.Genre]),
    __metadata("design:returntype", Promise)
], GenreResolver.prototype, "trackCount", null);
__decorate([
    type_graphql_1.FieldResolver(() => track_1.TrackPageQL),
    __param(0, Root_1.Root()), __param(1, type_graphql_1.Ctx()), __param(2, type_graphql_1.Args()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [genre_1.Genre, Object, track_args_1.TrackPageArgsQL]),
    __metadata("design:returntype", Promise)
], GenreResolver.prototype, "tracks", null);
__decorate([
    type_graphql_1.FieldResolver(() => album_1.AlbumPageQL),
    __param(0, Root_1.Root()), __param(1, type_graphql_1.Ctx()), __param(2, type_graphql_1.Args()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [genre_1.Genre, Object, album_args_1.AlbumPageArgsQL]),
    __metadata("design:returntype", Promise)
], GenreResolver.prototype, "albums", null);
__decorate([
    type_graphql_1.FieldResolver(() => artist_1.ArtistPageQL),
    __param(0, Root_1.Root()), __param(1, type_graphql_1.Ctx()), __param(2, type_graphql_1.Args()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [genre_1.Genre, Object, artist_args_1.ArtistPageArgsQL]),
    __metadata("design:returntype", Promise)
], GenreResolver.prototype, "artists", null);
GenreResolver = __decorate([
    type_graphql_1.Resolver(genre_1.GenreQL)
], GenreResolver);
exports.GenreResolver = GenreResolver;
//# sourceMappingURL=genre.resolver.js.map