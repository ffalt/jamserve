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
import { Genre, GenreIndex, GenrePage } from './genre.model';
import { Controller, Ctx, Get, QueryParam, QueryParams } from '../../modules/rest/decorators';
import { TrackOrderFields, UserRole } from '../../types/enums';
import { ListArgs, PageArgs } from '../base/base.args';
import { GenreFilterArgs, GenreOrderArgs, IncludesGenreArgs } from './genre.args';
import { TrackPage } from '../track/track.model';
import { IncludesTrackArgs, TrackOrderArgs } from '../track/track.args';
import { AlbumOrderArgs, IncludesAlbumArgs } from '../album/album.args';
import { AlbumPage } from '../album/album.model';
import { ArtistOrderArgs, IncludesArtistArgs } from '../artist/artist.args';
import { ArtistPage } from '../artist/artist.model';
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
        const orders = [{ orderBy: order?.orderBy ? order.orderBy : TrackOrderFields.default, orderDesc: order?.orderDesc || false }];
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
    Get('/id', () => Genre, { description: 'Get a Genre by Id', summary: 'Get Genre' }),
    __param(0, QueryParam('id', { description: 'Genre Id', isID: true })),
    __param(1, QueryParams()),
    __param(2, Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, IncludesGenreArgs, Object]),
    __metadata("design:returntype", Promise)
], GenreController.prototype, "id", null);
__decorate([
    Get('/search', () => GenrePage, { description: 'Search Genres' }),
    __param(0, QueryParams()),
    __param(1, QueryParams()),
    __param(2, QueryParams()),
    __param(3, QueryParams()),
    __param(4, QueryParams()),
    __param(5, Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [PageArgs,
        IncludesGenreArgs,
        GenreFilterArgs,
        ListArgs,
        GenreOrderArgs, Object]),
    __metadata("design:returntype", Promise)
], GenreController.prototype, "search", null);
__decorate([
    Get('/index', () => GenreIndex, { description: 'Get the Navigation Index for Genres', summary: 'Get Genre Index' }),
    __param(0, QueryParams()),
    __param(1, Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [GenreFilterArgs, Object]),
    __metadata("design:returntype", Promise)
], GenreController.prototype, "index", null);
__decorate([
    Get('/tracks', () => TrackPage, { description: 'Get Tracks of Genres', summary: 'Get Tracks' }),
    __param(0, QueryParams()),
    __param(1, QueryParams()),
    __param(2, QueryParams()),
    __param(3, QueryParams()),
    __param(4, Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [PageArgs,
        IncludesTrackArgs,
        GenreFilterArgs,
        TrackOrderArgs, Object]),
    __metadata("design:returntype", Promise)
], GenreController.prototype, "tracks", null);
__decorate([
    Get('/albums', () => AlbumPage, { description: 'Get Albums of Genres', summary: 'Get Albums' }),
    __param(0, QueryParams()),
    __param(1, QueryParams()),
    __param(2, QueryParams()),
    __param(3, QueryParams()),
    __param(4, Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [PageArgs,
        IncludesAlbumArgs,
        GenreFilterArgs,
        AlbumOrderArgs, Object]),
    __metadata("design:returntype", Promise)
], GenreController.prototype, "albums", null);
__decorate([
    Get('/artists', () => ArtistPage, { description: 'Get Artists of Genres', summary: 'Get Artists' }),
    __param(0, QueryParams()),
    __param(1, QueryParams()),
    __param(2, QueryParams()),
    __param(3, QueryParams()),
    __param(4, Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [PageArgs,
        IncludesArtistArgs,
        GenreFilterArgs,
        ArtistOrderArgs, Object]),
    __metadata("design:returntype", Promise)
], GenreController.prototype, "artists", null);
GenreController = __decorate([
    Controller('/genre', { tags: ['Genres'], roles: [UserRole.stream] })
], GenreController);
export { GenreController };
//# sourceMappingURL=genre.controller.js.map