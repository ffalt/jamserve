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
exports.ArtistController = void 0;
const artist_model_1 = require("./artist.model");
const user_1 = require("../user/user");
const rest_1 = require("../../modules/rest");
const enums_1 = require("../../types/enums");
const base_controller_1 = require("../base/base.controller");
const metadata_model_1 = require("../metadata/metadata.model");
const track_model_1 = require("../track/track.model");
const album_model_1 = require("../album/album.model");
const series_model_1 = require("../series/series.model");
const album_args_1 = require("../album/album.args");
const series_args_1 = require("../series/series.args");
const track_args_1 = require("../track/track.args");
const artist_args_1 = require("./artist.args");
const base_args_1 = require("../base/base.args");
let ArtistController = class ArtistController extends base_controller_1.BaseController {
    async id(id, artistArgs, artistChildrenArgs, trackArgs, albumArgs, seriesArgs, user) {
        return this.transform.artist(await this.orm.Artist.oneOrFail(id), artistArgs, artistChildrenArgs, trackArgs, albumArgs, seriesArgs, user);
    }
    async index(filter) {
        const result = await this.orm.Artist.indexFilter(filter);
        return await this.transform.artistIndex(result);
    }
    async search(page, artistArgs, artistChildrenArgs, trackArgs, albumArgs, seriesArgs, filter, order, list, user) {
        if (list.list) {
            return await this.orm.Artist.findListTransformFilter(list.list, filter, [order], page, user, o => this.transform.artist(o, artistArgs, artistChildrenArgs, trackArgs, albumArgs, seriesArgs, user));
        }
        return await this.orm.Artist.searchTransformFilter(filter, [order], page, user, o => this.transform.artist(o, artistArgs, artistChildrenArgs, trackArgs, albumArgs, seriesArgs, user));
    }
    async info(id) {
        const artist = await this.orm.Artist.oneOrFail(id);
        return { info: await this.metadata.extInfo.byArtist(artist) };
    }
    async similar(id, page, artistArgs, user) {
        const artist = await this.orm.Artist.oneOrFail(id);
        const result = await this.metadata.similarArtists.byArtist(artist, page);
        return { ...result, items: await Promise.all(result.items.map(o => this.transform.artistBase(o, artistArgs, user))) };
    }
    async similarTracks(id, page, trackArgs, user) {
        const artist = await this.orm.Artist.oneOrFail(id);
        const result = await this.metadata.similarTracks.byArtist(artist, page);
        return { ...result, items: await Promise.all(result.items.map(o => this.transform.trackBase(o, trackArgs, user))) };
    }
    async tracks(page, trackArgs, filter, order, user) {
        const artistIDs = await this.orm.Artist.findIDsFilter(filter, user);
        return await this.orm.Track.searchTransformFilter({ artistIDs }, [order], page, user, o => this.transform.trackBase(o, trackArgs, user));
    }
    async albums(page, albumArgs, filter, order, user) {
        const artistIDs = await this.orm.Artist.findIDsFilter(filter, user);
        return await this.orm.Album.searchTransformFilter({ artistIDs }, [order], page, user, o => this.transform.albumBase(o, albumArgs, user));
    }
    async series(page, seriesArgs, filter, order, user) {
        const artistIDs = await this.orm.Artist.findIDsFilter(filter, user);
        return await this.orm.Series.searchTransformFilter({ artistIDs }, [order], page, user, o => this.transform.seriesBase(o, seriesArgs, user));
    }
};
__decorate([
    rest_1.Get('/id', () => artist_model_1.Artist, { description: 'Get an Artist by Id', summary: 'Get Artist' }),
    __param(0, rest_1.QueryParam('id', { description: 'Artist Id', isID: true })),
    __param(1, rest_1.QueryParams()),
    __param(2, rest_1.QueryParams()),
    __param(3, rest_1.QueryParams()),
    __param(4, rest_1.QueryParams()),
    __param(5, rest_1.QueryParams()),
    __param(6, rest_1.CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, artist_args_1.IncludesArtistArgs,
        artist_args_1.IncludesArtistChildrenArgs,
        track_args_1.IncludesTrackArgs,
        album_args_1.IncludesAlbumArgs,
        series_args_1.IncludesSeriesArgs,
        user_1.User]),
    __metadata("design:returntype", Promise)
], ArtistController.prototype, "id", null);
__decorate([
    rest_1.Get('/index', () => artist_model_1.ArtistIndex, { description: 'Get the Navigation Index for Albums', summary: 'Get Index' }),
    __param(0, rest_1.QueryParams()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [artist_args_1.ArtistFilterArgs]),
    __metadata("design:returntype", Promise)
], ArtistController.prototype, "index", null);
__decorate([
    rest_1.Get('/search', () => artist_model_1.ArtistPage, { description: 'Search Artists' }),
    __param(0, rest_1.QueryParams()),
    __param(1, rest_1.QueryParams()),
    __param(2, rest_1.QueryParams()),
    __param(3, rest_1.QueryParams()),
    __param(4, rest_1.QueryParams()),
    __param(5, rest_1.QueryParams()),
    __param(6, rest_1.QueryParams()),
    __param(7, rest_1.QueryParams()),
    __param(8, rest_1.QueryParams()),
    __param(9, rest_1.CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [base_args_1.PageArgs,
        artist_args_1.IncludesArtistArgs,
        artist_args_1.IncludesArtistChildrenArgs,
        track_args_1.IncludesTrackArgs,
        album_args_1.IncludesAlbumArgs,
        series_args_1.IncludesSeriesArgs,
        artist_args_1.ArtistFilterArgs,
        artist_args_1.ArtistOrderArgs,
        base_args_1.ListArgs,
        user_1.User]),
    __metadata("design:returntype", Promise)
], ArtistController.prototype, "search", null);
__decorate([
    rest_1.Get('/info', () => metadata_model_1.ExtendedInfoResult, { description: 'Get Meta Data Info of an Artist by Id (External Service)', summary: 'Get Info' }),
    __param(0, rest_1.QueryParam('id', { description: 'Artist Id', isID: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ArtistController.prototype, "info", null);
__decorate([
    rest_1.Get('/similar', () => artist_model_1.ArtistPage, { description: 'Get similar Artists of an Artist by Id (External Service)', summary: 'Get similar Artists' }),
    __param(0, rest_1.QueryParam('id', { description: 'Artist Id', isID: true })),
    __param(1, rest_1.QueryParams()),
    __param(2, rest_1.QueryParams()),
    __param(3, rest_1.CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, base_args_1.PageArgs,
        artist_args_1.IncludesArtistArgs,
        user_1.User]),
    __metadata("design:returntype", Promise)
], ArtistController.prototype, "similar", null);
__decorate([
    rest_1.Get('/similar/tracks', () => track_model_1.TrackPage, { description: 'Get similar Tracks of an Artist by Id (External Service)', summary: 'Get similar Tracks' }),
    __param(0, rest_1.QueryParam('id', { description: 'Artist Id', isID: true })),
    __param(1, rest_1.QueryParams()),
    __param(2, rest_1.QueryParams()),
    __param(3, rest_1.CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, base_args_1.PageArgs,
        track_args_1.IncludesTrackArgs,
        user_1.User]),
    __metadata("design:returntype", Promise)
], ArtistController.prototype, "similarTracks", null);
__decorate([
    rest_1.Get('/tracks', () => track_model_1.TrackPage, { description: 'Get Tracks of Artists', summary: 'Get Tracks' }),
    __param(0, rest_1.QueryParams()),
    __param(1, rest_1.QueryParams()),
    __param(2, rest_1.QueryParams()),
    __param(3, rest_1.QueryParams()),
    __param(4, rest_1.CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [base_args_1.PageArgs,
        track_args_1.IncludesTrackArgs,
        artist_args_1.ArtistFilterArgs,
        track_args_1.TrackOrderArgs,
        user_1.User]),
    __metadata("design:returntype", Promise)
], ArtistController.prototype, "tracks", null);
__decorate([
    rest_1.Get('/albums', () => album_model_1.AlbumPage, { description: 'Get Albums of Artists', summary: 'Get Albums' }),
    __param(0, rest_1.QueryParams()),
    __param(1, rest_1.QueryParams()),
    __param(2, rest_1.QueryParams()),
    __param(3, rest_1.QueryParams()),
    __param(4, rest_1.CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [base_args_1.PageArgs,
        album_args_1.IncludesAlbumArgs,
        artist_args_1.ArtistFilterArgs,
        album_args_1.AlbumOrderArgs,
        user_1.User]),
    __metadata("design:returntype", Promise)
], ArtistController.prototype, "albums", null);
__decorate([
    rest_1.Get('/series', () => series_model_1.SeriesPage, { description: 'Get Series of Artists', summary: 'Get Series' }),
    __param(0, rest_1.QueryParams()),
    __param(1, rest_1.QueryParams()),
    __param(2, rest_1.QueryParams()),
    __param(3, rest_1.QueryParams()),
    __param(4, rest_1.CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [base_args_1.PageArgs,
        series_args_1.IncludesSeriesArgs,
        series_args_1.SeriesFilterArgs,
        series_args_1.SeriesOrderArgs,
        user_1.User]),
    __metadata("design:returntype", Promise)
], ArtistController.prototype, "series", null);
ArtistController = __decorate([
    rest_1.Controller('/artist', { tags: ['Artist'], roles: [enums_1.UserRole.stream] })
], ArtistController);
exports.ArtistController = ArtistController;
//# sourceMappingURL=artist.controller.js.map