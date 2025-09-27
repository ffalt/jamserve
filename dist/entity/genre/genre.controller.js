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
import { Genre, GenreIndex, GenrePage } from './genre.model.js';
import { TrackOrderFields, UserRole } from '../../types/enums.js';
import { ListParameters, PageParameters } from '../base/base.parameters.js';
import { GenreFilterParameters, GenreOrderParameters, IncludesGenreParameters } from './genre.parameters.js';
import { TrackPage } from '../track/track.model.js';
import { IncludesTrackParameters, TrackOrderParameters } from '../track/track.parameters.js';
import { AlbumOrderParameters, IncludesAlbumParameters } from '../album/album.parameters.js';
import { AlbumPage } from '../album/album.model.js';
import { ArtistOrderParameters, IncludesArtistParameters } from '../artist/artist.parameters.js';
import { ArtistPage } from '../artist/artist.model.js';
import { Controller } from '../../modules/rest/decorators/controller.js';
import { Get } from '../../modules/rest/decorators/get.js';
import { QueryParameter } from '../../modules/rest/decorators/query-parameter.js';
import { QueryParameters } from '../../modules/rest/decorators/query-parameters.js';
import { RestContext } from '../../modules/rest/decorators/rest-context.js';
let GenreController = class GenreController {
    async id(id, parameters, { orm, engine, user }) {
        return engine.transform.Genre.genre(orm, await orm.Genre.oneOrFailByID(id), parameters, user);
    }
    async search(page, parameters, filter, list, order, { orm, engine, user }) {
        if (list.list) {
            return await orm.Genre.findListTransformFilter(list.list, list.seed, filter, [order], page, user, o => engine.transform.Genre.genre(orm, o, parameters, user));
        }
        return await orm.Genre.searchTransformFilter(filter, [order], page, user, o => engine.transform.Genre.genre(orm, o, parameters, user));
    }
    async index(filter, { orm, engine }) {
        return await engine.transform.Genre.genreIndex(orm, await orm.Genre.indexFilter(filter));
    }
    async tracks(page, trackParameters, filter, order, { orm, engine, user }) {
        const genreIDs = await orm.Genre.findIDsFilter(filter, user);
        const orders = [{ orderBy: order.orderBy ?? TrackOrderFields.default, orderDesc: order.orderDesc ?? false }];
        return await orm.Track.searchTransformFilter({ genreIDs }, orders, page, user, o => engine.transform.Track.trackBase(orm, o, trackParameters, user));
    }
    async albums(page, albumParameters, filter, order, { orm, engine, user }) {
        const genreIDs = await orm.Genre.findIDsFilter(filter, user);
        return await orm.Album.searchTransformFilter({ genreIDs }, [order], page, user, o => engine.transform.Album.albumBase(orm, o, albumParameters, user));
    }
    async artists(page, artistParameters, filter, order, { orm, engine, user }) {
        const genreIDs = await orm.Genre.findIDsFilter(filter, user);
        return await orm.Artist.searchTransformFilter({ genreIDs }, [order], page, user, o => engine.transform.Artist.artistBase(orm, o, artistParameters, user));
    }
};
__decorate([
    Get('/id', () => Genre, { description: 'Get a Genre by Id', summary: 'Get Genre' }),
    __param(0, QueryParameter('id', { description: 'Genre Id', isID: true })),
    __param(1, QueryParameters()),
    __param(2, RestContext()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, IncludesGenreParameters, Object]),
    __metadata("design:returntype", Promise)
], GenreController.prototype, "id", null);
__decorate([
    Get('/search', () => GenrePage, { description: 'Search Genres' }),
    __param(0, QueryParameters()),
    __param(1, QueryParameters()),
    __param(2, QueryParameters()),
    __param(3, QueryParameters()),
    __param(4, QueryParameters()),
    __param(5, RestContext()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [PageParameters,
        IncludesGenreParameters,
        GenreFilterParameters,
        ListParameters,
        GenreOrderParameters, Object]),
    __metadata("design:returntype", Promise)
], GenreController.prototype, "search", null);
__decorate([
    Get('/index', () => GenreIndex, { description: 'Get the Navigation Index for Genres', summary: 'Get Genre Index' }),
    __param(0, QueryParameters()),
    __param(1, RestContext()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [GenreFilterParameters, Object]),
    __metadata("design:returntype", Promise)
], GenreController.prototype, "index", null);
__decorate([
    Get('/tracks', () => TrackPage, { description: 'Get Tracks of Genres', summary: 'Get Tracks' }),
    __param(0, QueryParameters()),
    __param(1, QueryParameters()),
    __param(2, QueryParameters()),
    __param(3, QueryParameters()),
    __param(4, RestContext()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [PageParameters,
        IncludesTrackParameters,
        GenreFilterParameters,
        TrackOrderParameters, Object]),
    __metadata("design:returntype", Promise)
], GenreController.prototype, "tracks", null);
__decorate([
    Get('/albums', () => AlbumPage, { description: 'Get Albums of Genres', summary: 'Get Albums' }),
    __param(0, QueryParameters()),
    __param(1, QueryParameters()),
    __param(2, QueryParameters()),
    __param(3, QueryParameters()),
    __param(4, RestContext()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [PageParameters,
        IncludesAlbumParameters,
        GenreFilterParameters,
        AlbumOrderParameters, Object]),
    __metadata("design:returntype", Promise)
], GenreController.prototype, "albums", null);
__decorate([
    Get('/artists', () => ArtistPage, { description: 'Get Artists of Genres', summary: 'Get Artists' }),
    __param(0, QueryParameters()),
    __param(1, QueryParameters()),
    __param(2, QueryParameters()),
    __param(3, QueryParameters()),
    __param(4, RestContext()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [PageParameters,
        IncludesArtistParameters,
        GenreFilterParameters,
        ArtistOrderParameters, Object]),
    __metadata("design:returntype", Promise)
], GenreController.prototype, "artists", null);
GenreController = __decorate([
    Controller('/genre', { tags: ['Genres'], roles: [UserRole.stream] })
], GenreController);
export { GenreController };
//# sourceMappingURL=genre.controller.js.map