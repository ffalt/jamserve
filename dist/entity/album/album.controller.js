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
const user_1 = require("../user/user");
const rest_1 = require("../../modules/rest");
const enums_1 = require("../../types/enums");
const base_controller_1 = require("../base/base.controller");
const metadata_model_1 = require("../metadata/metadata.model");
const track_model_1 = require("../track/track.model");
const album_args_1 = require("./album.args");
const track_args_1 = require("../track/track.args");
const artist_args_1 = require("../artist/artist.args");
const base_args_1 = require("../base/base.args");
let AlbumController = class AlbumController extends base_controller_1.BaseController {
    async id(id, albumArgs, albumChildrenArgs, trackArgs, artistArgs, user) {
        return this.transform.album(await this.orm.Album.oneOrFail(id), albumArgs, albumChildrenArgs, trackArgs, artistArgs, user);
    }
    async index(filter) {
        return await this.transform.albumIndex(await this.orm.Album.indexFilter(filter));
    }
    async search(page, albumArgs, albumChildrenArgs, trackArgs, artistArgs, filter, order, list, user) {
        if (list.list) {
            return await this.orm.Album.findListTransformFilter(list.list, filter, [order], page, user, o => this.transform.album(o, albumArgs, albumChildrenArgs, trackArgs, artistArgs, user));
        }
        return await this.orm.Album.searchTransformFilter(filter, [order], page, user, o => this.transform.album(o, albumArgs, albumChildrenArgs, trackArgs, artistArgs, user));
    }
    async info(id) {
        const album = await this.orm.Album.oneOrFail(id);
        return { info: await this.metadata.extInfo.byAlbum(album) };
    }
    async tracks(page, trackArgs, filter, order, user) {
        const albumIDs = await this.orm.Album.findIDsFilter(filter, user);
        return await this.orm.Track.searchTransformFilter({ albumIDs }, [order], page, user, o => this.transform.trackBase(o, trackArgs, user));
    }
    async similarTracks(id, page, trackArgs, user) {
        const album = await this.orm.Album.oneOrFail(id);
        const result = await this.metadata.similarTracks.byAlbum(album, page);
        return { ...result, items: await Promise.all(result.items.map(o => this.transform.trackBase(o, trackArgs, user))) };
    }
};
__decorate([
    rest_1.Get('/id', () => album_model_1.Album, { description: 'Get an Album by Id', summary: 'Get Album' }),
    __param(0, rest_1.QueryParam('id', { description: 'Album Id', isID: true })),
    __param(1, rest_1.QueryParams()),
    __param(2, rest_1.QueryParams()),
    __param(3, rest_1.QueryParams()),
    __param(4, rest_1.QueryParams()),
    __param(5, rest_1.CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, album_args_1.IncludesAlbumArgs,
        album_args_1.IncludesAlbumChildrenArgs,
        track_args_1.IncludesTrackArgs,
        artist_args_1.IncludesArtistArgs,
        user_1.User]),
    __metadata("design:returntype", Promise)
], AlbumController.prototype, "id", null);
__decorate([
    rest_1.Get('/index', () => album_model_1.AlbumIndex, { description: 'Get the Navigation Index for Albums', summary: 'Get Index' }),
    __param(0, rest_1.QueryParams()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [album_args_1.AlbumFilterArgs]),
    __metadata("design:returntype", Promise)
], AlbumController.prototype, "index", null);
__decorate([
    rest_1.Get('/search', () => album_model_1.AlbumPage, { description: 'Search albums' }),
    __param(0, rest_1.QueryParams()),
    __param(1, rest_1.QueryParams()),
    __param(2, rest_1.QueryParams()),
    __param(3, rest_1.QueryParams()),
    __param(4, rest_1.QueryParams()),
    __param(5, rest_1.QueryParams()),
    __param(6, rest_1.QueryParams()),
    __param(7, rest_1.QueryParams()),
    __param(8, rest_1.CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [base_args_1.PageArgs,
        album_args_1.IncludesAlbumArgs,
        album_args_1.IncludesAlbumChildrenArgs,
        track_args_1.IncludesTrackArgs,
        artist_args_1.IncludesArtistArgs,
        album_args_1.AlbumFilterArgs,
        album_args_1.AlbumOrderArgs,
        base_args_1.ListArgs,
        user_1.User]),
    __metadata("design:returntype", Promise)
], AlbumController.prototype, "search", null);
__decorate([
    rest_1.Get('/info', () => metadata_model_1.ExtendedInfoResult, { description: 'Get Meta Data Info of an Album by Id (External Service)', summary: 'Get Info' }),
    __param(0, rest_1.QueryParam('id', { description: 'Album Id', isID: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AlbumController.prototype, "info", null);
__decorate([
    rest_1.Get('/tracks', () => track_model_1.TrackPage, { description: 'Get Tracks of Albums', summary: 'Get Tracks' }),
    __param(0, rest_1.QueryParams()),
    __param(1, rest_1.QueryParams()),
    __param(2, rest_1.QueryParams()),
    __param(3, rest_1.QueryParams()),
    __param(4, rest_1.CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [base_args_1.PageArgs,
        track_args_1.IncludesTrackArgs,
        album_args_1.AlbumFilterArgs,
        track_args_1.TrackOrderArgs,
        user_1.User]),
    __metadata("design:returntype", Promise)
], AlbumController.prototype, "tracks", null);
__decorate([
    rest_1.Get('/similar/tracks', () => track_model_1.TrackPage, { description: ' Get similar Tracks of an Album by Id (External Service)', summary: 'Get similar Tracks' }),
    __param(0, rest_1.QueryParam('id', { description: 'Album Id', isID: true })),
    __param(1, rest_1.QueryParams()),
    __param(2, rest_1.QueryParams()),
    __param(3, rest_1.CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, base_args_1.PageArgs,
        track_args_1.IncludesTrackArgs,
        user_1.User]),
    __metadata("design:returntype", Promise)
], AlbumController.prototype, "similarTracks", null);
AlbumController = __decorate([
    rest_1.Controller('/album', { tags: ['Album'], roles: [enums_1.UserRole.stream] })
], AlbumController);
exports.AlbumController = AlbumController;
//# sourceMappingURL=album.controller.js.map