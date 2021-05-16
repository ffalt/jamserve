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
exports.GenreController = void 0;
const genre_model_1 = require("./genre.model");
const decorators_1 = require("../../modules/rest/decorators");
const enums_1 = require("../../types/enums");
const base_args_1 = require("../base/base.args");
const genre_args_1 = require("./genre.args");
const track_model_1 = require("../track/track.model");
const track_args_1 = require("../track/track.args");
const album_args_1 = require("../album/album.args");
const album_model_1 = require("../album/album.model");
const artist_args_1 = require("../artist/artist.args");
const artist_model_1 = require("../artist/artist.model");
let GenreController = class GenreController {
    async id(id, genreArgs, { orm, engine, user }) {
        return engine.transform.Genre.genre(orm, await orm.Genre.oneOrFailByID(id), genreArgs, user);
    }
    async search(page, genreArgs, filter, list, order, { orm, engine, user }) {
        if (list.list) {
            return await orm.Genre.findListTransformFilter(list.list, list.seed, filter, [order], page, user, o => engine.transform.Genre.genre(orm, o, genreArgs, user));
        }
        return await orm.Genre.searchTransformFilter(filter, [order], page, user, o => engine.transform.Genre.genre(orm, o, genreArgs, user));
    }
    async index(filter, { orm, engine }) {
        return await engine.transform.Genre.genreIndex(orm, await orm.Genre.indexFilter(filter));
    }
    async tracks(page, trackArgs, filter, order, { orm, engine, user }) {
        const genreIDs = await orm.Genre.findIDsFilter(filter, user);
        const orders = [{ orderBy: order?.orderBy ? order.orderBy : enums_1.TrackOrderFields.default, orderDesc: order?.orderDesc || false }];
        return await orm.Track.searchTransformFilter({ genreIDs }, orders, page, user, o => engine.transform.Track.trackBase(orm, o, trackArgs, user));
    }
    async albums(page, albumArgs, filter, order, { orm, engine, user }) {
        const genreIDs = await orm.Genre.findIDsFilter(filter, user);
        return await orm.Album.searchTransformFilter({ genreIDs }, [order], page, user, o => engine.transform.Album.albumBase(orm, o, albumArgs, user));
    }
    async artists(page, artistArgs, filter, order, { orm, engine, user }) {
        const genreIDs = await orm.Genre.findIDsFilter(filter, user);
        return await orm.Artist.searchTransformFilter({ genreIDs }, [order], page, user, o => engine.transform.Artist.artistBase(orm, o, artistArgs, user));
    }
};
__decorate([
    decorators_1.Get('/id', () => genre_model_1.Genre, { description: 'Get a Genre by Id', summary: 'Get Genre' }),
    __param(0, decorators_1.QueryParam('id', { description: 'Genre Id', isID: true })),
    __param(1, decorators_1.QueryParams()),
    __param(2, decorators_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, genre_args_1.IncludesGenreArgs, Object]),
    __metadata("design:returntype", Promise)
], GenreController.prototype, "id", null);
__decorate([
    decorators_1.Get('/search', () => genre_model_1.GenrePage, { description: 'Search Genres' }),
    __param(0, decorators_1.QueryParams()),
    __param(1, decorators_1.QueryParams()),
    __param(2, decorators_1.QueryParams()),
    __param(3, decorators_1.QueryParams()),
    __param(4, decorators_1.QueryParams()),
    __param(5, decorators_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [base_args_1.PageArgs,
        genre_args_1.IncludesGenreArgs,
        genre_args_1.GenreFilterArgs,
        base_args_1.ListArgs,
        genre_args_1.GenreOrderArgs, Object]),
    __metadata("design:returntype", Promise)
], GenreController.prototype, "search", null);
__decorate([
    decorators_1.Get('/index', () => genre_model_1.GenreIndex, { description: 'Get the Navigation Index for Genres', summary: 'Get Genre Index' }),
    __param(0, decorators_1.QueryParams()),
    __param(1, decorators_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [genre_args_1.GenreFilterArgs, Object]),
    __metadata("design:returntype", Promise)
], GenreController.prototype, "index", null);
__decorate([
    decorators_1.Get('/tracks', () => track_model_1.TrackPage, { description: 'Get Tracks of Genres', summary: 'Get Tracks' }),
    __param(0, decorators_1.QueryParams()),
    __param(1, decorators_1.QueryParams()),
    __param(2, decorators_1.QueryParams()),
    __param(3, decorators_1.QueryParams()),
    __param(4, decorators_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [base_args_1.PageArgs,
        track_args_1.IncludesTrackArgs,
        genre_args_1.GenreFilterArgs,
        track_args_1.TrackOrderArgs, Object]),
    __metadata("design:returntype", Promise)
], GenreController.prototype, "tracks", null);
__decorate([
    decorators_1.Get('/albums', () => album_model_1.AlbumPage, { description: 'Get Albums of Genres', summary: 'Get Albums' }),
    __param(0, decorators_1.QueryParams()),
    __param(1, decorators_1.QueryParams()),
    __param(2, decorators_1.QueryParams()),
    __param(3, decorators_1.QueryParams()),
    __param(4, decorators_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [base_args_1.PageArgs,
        album_args_1.IncludesAlbumArgs,
        genre_args_1.GenreFilterArgs,
        album_args_1.AlbumOrderArgs, Object]),
    __metadata("design:returntype", Promise)
], GenreController.prototype, "albums", null);
__decorate([
    decorators_1.Get('/artists', () => artist_model_1.ArtistPage, { description: 'Get Artists of Genres', summary: 'Get Artists' }),
    __param(0, decorators_1.QueryParams()),
    __param(1, decorators_1.QueryParams()),
    __param(2, decorators_1.QueryParams()),
    __param(3, decorators_1.QueryParams()),
    __param(4, decorators_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [base_args_1.PageArgs,
        artist_args_1.IncludesArtistArgs,
        genre_args_1.GenreFilterArgs,
        artist_args_1.ArtistOrderArgs, Object]),
    __metadata("design:returntype", Promise)
], GenreController.prototype, "artists", null);
GenreController = __decorate([
    decorators_1.Controller('/genre', { tags: ['Genres'], roles: [enums_1.UserRole.stream] })
], GenreController);
exports.GenreController = GenreController;
//# sourceMappingURL=genre.controller.js.map