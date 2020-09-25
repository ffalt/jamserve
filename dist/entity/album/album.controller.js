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
exports.AlbumController = void 0;
const album_model_1 = require("./album.model");
const rest_1 = require("../../modules/rest");
const enums_1 = require("../../types/enums");
const metadata_model_1 = require("../metadata/metadata.model");
const track_model_1 = require("../track/track.model");
const album_args_1 = require("./album.args");
const track_args_1 = require("../track/track.args");
const artist_args_1 = require("../artist/artist.args");
const base_args_1 = require("../base/base.args");
let AlbumController = class AlbumController {
    async id(id, albumArgs, albumChildrenArgs, trackArgs, artistArgs, { orm, engine, user }) {
        return engine.transform.album(orm, await orm.Album.oneOrFailByID(id), albumArgs, albumChildrenArgs, trackArgs, artistArgs, user);
    }
    async index(filter, { orm, engine }) {
        return await engine.transform.albumIndex(orm, await orm.Album.indexFilter(filter));
    }
    async search(page, albumArgs, albumChildrenArgs, trackArgs, artistArgs, filter, order, list, { orm, engine, user }) {
        if (list.list) {
            return await orm.Album.findListTransformFilter(list.list, list.seed, filter, [order], page, user, o => engine.transform.album(orm, o, albumArgs, albumChildrenArgs, trackArgs, artistArgs, user));
        }
        return await orm.Album.searchTransformFilter(filter, [order], page, user, o => engine.transform.album(orm, o, albumArgs, albumChildrenArgs, trackArgs, artistArgs, user));
    }
    async info(id, { orm, engine }) {
        const album = await orm.Album.oneOrFailByID(id);
        return { info: await engine.metadata.extInfo.byAlbum(orm, album) };
    }
    async tracks(page, trackArgs, filter, order, { orm, engine, user }) {
        const albumIDs = await orm.Album.findIDsFilter(filter, user);
        const orders = [{ orderBy: (order === null || order === void 0 ? void 0 : order.orderBy) ? order.orderBy : enums_1.TrackOrderFields.default, orderDesc: (order === null || order === void 0 ? void 0 : order.orderDesc) || false }];
        return await orm.Track.searchTransformFilter({ albumIDs }, orders, page, user, o => engine.transform.trackBase(orm, o, trackArgs, user));
    }
    async similarTracks(id, page, trackArgs, { orm, engine, user }) {
        const album = await orm.Album.oneOrFailByID(id);
        const result = await engine.metadata.similarTracks.byAlbum(orm, album, page);
        return { ...result, items: await Promise.all(result.items.map(o => engine.transform.trackBase(orm, o, trackArgs, user))) };
    }
};
__decorate([
    rest_1.Get('/id', () => album_model_1.Album, { description: 'Get an Album by Id', summary: 'Get Album' }),
    __param(0, rest_1.QueryParam('id', { description: 'Album Id', isID: true })),
    __param(1, rest_1.QueryParams()),
    __param(2, rest_1.QueryParams()),
    __param(3, rest_1.QueryParams()),
    __param(4, rest_1.QueryParams()),
    __param(5, rest_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, album_args_1.IncludesAlbumArgs,
        album_args_1.IncludesAlbumChildrenArgs,
        track_args_1.IncludesTrackArgs,
        artist_args_1.IncludesArtistArgs, Object]),
    __metadata("design:returntype", Promise)
], AlbumController.prototype, "id", null);
__decorate([
    rest_1.Get('/index', () => album_model_1.AlbumIndex, { description: 'Get the Navigation Index for Albums', summary: 'Get Index' }),
    __param(0, rest_1.QueryParams()),
    __param(1, rest_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [album_args_1.AlbumFilterArgs, Object]),
    __metadata("design:returntype", Promise)
], AlbumController.prototype, "index", null);
__decorate([
    rest_1.Get('/search', () => album_model_1.AlbumPage, { description: 'Search Albums' }),
    __param(0, rest_1.QueryParams()),
    __param(1, rest_1.QueryParams()),
    __param(2, rest_1.QueryParams()),
    __param(3, rest_1.QueryParams()),
    __param(4, rest_1.QueryParams()),
    __param(5, rest_1.QueryParams()),
    __param(6, rest_1.QueryParams()),
    __param(7, rest_1.QueryParams()),
    __param(8, rest_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [base_args_1.PageArgs,
        album_args_1.IncludesAlbumArgs,
        album_args_1.IncludesAlbumChildrenArgs,
        track_args_1.IncludesTrackArgs,
        artist_args_1.IncludesArtistArgs,
        album_args_1.AlbumFilterArgs,
        album_args_1.AlbumOrderArgs,
        base_args_1.ListArgs, Object]),
    __metadata("design:returntype", Promise)
], AlbumController.prototype, "search", null);
__decorate([
    rest_1.Get('/info', () => metadata_model_1.ExtendedInfoResult, { description: 'Get Meta Data Info of an Album by Id (External Service)', summary: 'Get Info' }),
    __param(0, rest_1.QueryParam('id', { description: 'Album Id', isID: true })),
    __param(1, rest_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AlbumController.prototype, "info", null);
__decorate([
    rest_1.Get('/tracks', () => track_model_1.TrackPage, { description: 'Get Tracks of Albums', summary: 'Get Tracks' }),
    __param(0, rest_1.QueryParams()),
    __param(1, rest_1.QueryParams()),
    __param(2, rest_1.QueryParams()),
    __param(3, rest_1.QueryParams()),
    __param(4, rest_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [base_args_1.PageArgs,
        track_args_1.IncludesTrackArgs,
        album_args_1.AlbumFilterArgs,
        track_args_1.TrackOrderArgs, Object]),
    __metadata("design:returntype", Promise)
], AlbumController.prototype, "tracks", null);
__decorate([
    rest_1.Get('/similar/tracks', () => track_model_1.TrackPage, { description: ' Get similar Tracks of an Album by Id (External Service)', summary: 'Get similar Tracks' }),
    __param(0, rest_1.QueryParam('id', { description: 'Album Id', isID: true })),
    __param(1, rest_1.QueryParams()),
    __param(2, rest_1.QueryParams()),
    __param(3, rest_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, base_args_1.PageArgs,
        track_args_1.IncludesTrackArgs, Object]),
    __metadata("design:returntype", Promise)
], AlbumController.prototype, "similarTracks", null);
AlbumController = __decorate([
    rest_1.Controller('/album', { tags: ['Album'], roles: [enums_1.UserRole.stream] })
], AlbumController);
exports.AlbumController = AlbumController;
//# sourceMappingURL=album.controller.js.map