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
import { Album, AlbumIndex, AlbumPage } from './album.model.js';
import { TrackOrderFields, UserRole } from '../../types/enums.js';
import { ExtendedInfoResult } from '../metadata/metadata.model.js';
import { TrackPage } from '../track/track.model.js';
import { AlbumFilterParameters, AlbumOrderParameters, IncludesAlbumParameters, IncludesAlbumChildrenParameters } from './album.parameters.js';
import { IncludesTrackParameters, TrackOrderParameters } from '../track/track.parameters.js';
import { IncludesArtistParameters } from '../artist/artist.parameters.js';
import { ListParameters, PageParameters } from '../base/base.parameters.js';
import { Controller } from '../../modules/rest/decorators/controller.js';
import { Get } from '../../modules/rest/decorators/get.js';
import { QueryParameter } from '../../modules/rest/decorators/query-parameter.js';
import { QueryParameters } from '../../modules/rest/decorators/query-parameters.js';
import { RestContext } from '../../modules/rest/decorators/rest-context.js';
let AlbumController = class AlbumController {
    async id(id, albumParameters, albumChildrenParameters, trackParameters, artistParameters, { orm, engine, user }) {
        return engine.transform.album(orm, await orm.Album.oneOrFailByID(id), albumParameters, albumChildrenParameters, trackParameters, artistParameters, user);
    }
    async index(filter, { orm, engine }) {
        return await engine.transform.Album.albumIndex(orm, await orm.Album.indexFilter(filter));
    }
    async search(page, albumParameters, albumChildrenParameters, trackParameters, artistParameters, filter, order, list, { orm, engine, user }) {
        if (list.list) {
            return await orm.Album.findListTransformFilter(list.list, list.seed, filter, [order], page, user, o => engine.transform.album(orm, o, albumParameters, albumChildrenParameters, trackParameters, artistParameters, user));
        }
        return await orm.Album.searchTransformFilter(filter, [order], page, user, o => engine.transform.album(orm, o, albumParameters, albumChildrenParameters, trackParameters, artistParameters, user));
    }
    async info(id, { orm, engine }) {
        const album = await orm.Album.oneOrFailByID(id);
        return { info: await engine.metadata.extInfo.byAlbum(orm, album) };
    }
    async tracks(page, trackParameters, filter, order, { orm, engine, user }) {
        const albumIDs = await orm.Album.findIDsFilter(filter, user);
        const orders = [{ orderBy: order.orderBy ?? TrackOrderFields.default, orderDesc: order.orderDesc ?? false }];
        return await orm.Track.searchTransformFilter({ albumIDs }, orders, page, user, o => engine.transform.Track.trackBase(orm, o, trackParameters, user));
    }
    async similarTracks(id, page, trackParameters, { orm, engine, user }) {
        const album = await orm.Album.oneOrFailByID(id);
        const result = await engine.metadata.similarTracks.byAlbum(orm, album, page);
        return { ...result, items: await engine.transform.Track.trackBases(orm, result.items, trackParameters, user) };
    }
};
__decorate([
    Get('/id', () => Album, { description: 'Get an Album by Id', summary: 'Get Album' }),
    __param(0, QueryParameter('id', { description: 'Album Id', isID: true })),
    __param(1, QueryParameters()),
    __param(2, QueryParameters()),
    __param(3, QueryParameters()),
    __param(4, QueryParameters()),
    __param(5, RestContext()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, IncludesAlbumParameters,
        IncludesAlbumChildrenParameters,
        IncludesTrackParameters,
        IncludesArtistParameters, Object]),
    __metadata("design:returntype", Promise)
], AlbumController.prototype, "id", null);
__decorate([
    Get('/index', () => AlbumIndex, { description: 'Get the Navigation Index for Albums', summary: 'Get Index' }),
    __param(0, QueryParameters()),
    __param(1, RestContext()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [AlbumFilterParameters, Object]),
    __metadata("design:returntype", Promise)
], AlbumController.prototype, "index", null);
__decorate([
    Get('/search', () => AlbumPage, { description: 'Search Albums' }),
    __param(0, QueryParameters()),
    __param(1, QueryParameters()),
    __param(2, QueryParameters()),
    __param(3, QueryParameters()),
    __param(4, QueryParameters()),
    __param(5, QueryParameters()),
    __param(6, QueryParameters()),
    __param(7, QueryParameters()),
    __param(8, RestContext()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [PageParameters,
        IncludesAlbumParameters,
        IncludesAlbumChildrenParameters,
        IncludesTrackParameters,
        IncludesArtistParameters,
        AlbumFilterParameters,
        AlbumOrderParameters,
        ListParameters, Object]),
    __metadata("design:returntype", Promise)
], AlbumController.prototype, "search", null);
__decorate([
    Get('/info', () => ExtendedInfoResult, { description: 'Get Meta Data Info of an Album by Id (External Service)', summary: 'Get Info' }),
    __param(0, QueryParameter('id', { description: 'Album Id', isID: true })),
    __param(1, RestContext()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AlbumController.prototype, "info", null);
__decorate([
    Get('/tracks', () => TrackPage, { description: 'Get Tracks of Albums', summary: 'Get Tracks' }),
    __param(0, QueryParameters()),
    __param(1, QueryParameters()),
    __param(2, QueryParameters()),
    __param(3, QueryParameters()),
    __param(4, RestContext()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [PageParameters,
        IncludesTrackParameters,
        AlbumFilterParameters,
        TrackOrderParameters, Object]),
    __metadata("design:returntype", Promise)
], AlbumController.prototype, "tracks", null);
__decorate([
    Get('/similar/tracks', () => TrackPage, { description: ' Get similar Tracks of an Album by Id (External Service)', summary: 'Get similar Tracks' }),
    __param(0, QueryParameter('id', { description: 'Album Id', isID: true })),
    __param(1, QueryParameters()),
    __param(2, QueryParameters()),
    __param(3, RestContext()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, PageParameters,
        IncludesTrackParameters, Object]),
    __metadata("design:returntype", Promise)
], AlbumController.prototype, "similarTracks", null);
AlbumController = __decorate([
    Controller('/album', { tags: ['Album'], roles: [UserRole.stream] })
], AlbumController);
export { AlbumController };
//# sourceMappingURL=album.controller.js.map