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
const rest_1 = require("../../modules/rest");
const enums_1 = require("../../types/enums");
const metadata_model_1 = require("../metadata/metadata.model");
const track_model_1 = require("../track/track.model");
const album_model_1 = require("../album/album.model");
const series_model_1 = require("../series/series.model");
const album_args_1 = require("../album/album.args");
const series_args_1 = require("../series/series.args");
const track_args_1 = require("../track/track.args");
const artist_args_1 = require("./artist.args");
const base_args_1 = require("../base/base.args");
let ArtistController = class ArtistController {
    async id(id, artistArgs, artistChildrenArgs, trackArgs, albumArgs, seriesArgs, { orm, engine, user }) {
        return engine.transform.artist(orm, await orm.Artist.oneOrFailByID(id), artistArgs, artistChildrenArgs, trackArgs, albumArgs, seriesArgs, user);
    }
    async index(filter, { orm, engine, user }) {
        const result = await orm.Artist.indexFilter(filter, user, engine.settings.settings.index.ignoreArticles);
        return await engine.transform.artistIndex(orm, result);
    }
    async search(page, artistArgs, artistChildrenArgs, trackArgs, albumArgs, seriesArgs, filter, order, list, { orm, engine, user }) {
        if (list.list) {
            return await orm.Artist.findListTransformFilter(list.list, list.seed, filter, [order], page, user, o => engine.transform.artist(orm, o, artistArgs, artistChildrenArgs, trackArgs, albumArgs, seriesArgs, user));
        }
        return await orm.Artist.searchTransformFilter(filter, [order], page, user, o => engine.transform.artist(orm, o, artistArgs, artistChildrenArgs, trackArgs, albumArgs, seriesArgs, user));
    }
    async info(id, { orm, engine }) {
        const artist = await orm.Artist.oneOrFailByID(id);
        return { info: await engine.metadata.extInfo.byArtist(orm, artist) };
    }
    async similar(id, page, artistArgs, { orm, engine, user }) {
        const artist = await orm.Artist.oneOrFailByID(id);
        const result = await engine.metadata.similarArtists.byArtist(orm, artist, page);
        return { ...result, items: await Promise.all(result.items.map(o => engine.transform.artistBase(orm, o, artistArgs, user))) };
    }
    async similarTracks(id, page, trackArgs, { orm, engine, user }) {
        const artist = await orm.Artist.oneOrFailByID(id);
        const result = await engine.metadata.similarTracks.byArtist(orm, artist, page);
        return { ...result, items: await Promise.all(result.items.map(o => engine.transform.trackBase(orm, o, trackArgs, user))) };
    }
    async tracks(page, trackArgs, filter, order, { orm, engine, user }) {
        const artistIDs = await orm.Artist.findIDsFilter(filter, user);
        return await orm.Track.searchTransformFilter({ artistIDs }, [order], page, user, o => engine.transform.trackBase(orm, o, trackArgs, user));
    }
    async albums(page, albumArgs, filter, order, { orm, engine, user }) {
        const artistIDs = await orm.Artist.findIDsFilter(filter, user);
        return await orm.Album.searchTransformFilter({ artistIDs }, [order], page, user, o => engine.transform.albumBase(orm, o, albumArgs, user));
    }
    async series(page, seriesArgs, filter, order, { orm, engine, user }) {
        const artistIDs = await orm.Artist.findIDsFilter(filter, user);
        return await orm.Series.searchTransformFilter({ artistIDs }, [order], page, user, o => engine.transform.seriesBase(orm, o, seriesArgs, user));
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
    __param(6, rest_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, artist_args_1.IncludesArtistArgs,
        artist_args_1.IncludesArtistChildrenArgs,
        track_args_1.IncludesTrackArgs,
        album_args_1.IncludesAlbumArgs,
        series_args_1.IncludesSeriesArgs, Object]),
    __metadata("design:returntype", Promise)
], ArtistController.prototype, "id", null);
__decorate([
    rest_1.Get('/index', () => artist_model_1.ArtistIndex, { description: 'Get the Navigation Index for Albums', summary: 'Get Index' }),
    __param(0, rest_1.QueryParams()),
    __param(1, rest_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [artist_args_1.ArtistFilterArgs, Object]),
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
    __param(9, rest_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [base_args_1.PageArgs,
        artist_args_1.IncludesArtistArgs,
        artist_args_1.IncludesArtistChildrenArgs,
        track_args_1.IncludesTrackArgs,
        album_args_1.IncludesAlbumArgs,
        series_args_1.IncludesSeriesArgs,
        artist_args_1.ArtistFilterArgs,
        artist_args_1.ArtistOrderArgs,
        base_args_1.ListArgs, Object]),
    __metadata("design:returntype", Promise)
], ArtistController.prototype, "search", null);
__decorate([
    rest_1.Get('/info', () => metadata_model_1.ExtendedInfoResult, { description: 'Get Meta Data Info of an Artist by Id (External Service)', summary: 'Get Info' }),
    __param(0, rest_1.QueryParam('id', { description: 'Artist Id', isID: true })),
    __param(1, rest_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ArtistController.prototype, "info", null);
__decorate([
    rest_1.Get('/similar', () => artist_model_1.ArtistPage, { description: 'Get similar Artists of an Artist by Id (External Service)', summary: 'Get similar Artists' }),
    __param(0, rest_1.QueryParam('id', { description: 'Artist Id', isID: true })),
    __param(1, rest_1.QueryParams()),
    __param(2, rest_1.QueryParams()),
    __param(3, rest_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, base_args_1.PageArgs,
        artist_args_1.IncludesArtistArgs, Object]),
    __metadata("design:returntype", Promise)
], ArtistController.prototype, "similar", null);
__decorate([
    rest_1.Get('/similar/tracks', () => track_model_1.TrackPage, { description: 'Get similar Tracks of an Artist by Id (External Service)', summary: 'Get similar Tracks' }),
    __param(0, rest_1.QueryParam('id', { description: 'Artist Id', isID: true })),
    __param(1, rest_1.QueryParams()),
    __param(2, rest_1.QueryParams()),
    __param(3, rest_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, base_args_1.PageArgs,
        track_args_1.IncludesTrackArgs, Object]),
    __metadata("design:returntype", Promise)
], ArtistController.prototype, "similarTracks", null);
__decorate([
    rest_1.Get('/tracks', () => track_model_1.TrackPage, { description: 'Get Tracks of Artists', summary: 'Get Tracks' }),
    __param(0, rest_1.QueryParams()),
    __param(1, rest_1.QueryParams()),
    __param(2, rest_1.QueryParams()),
    __param(3, rest_1.QueryParams()),
    __param(4, rest_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [base_args_1.PageArgs,
        track_args_1.IncludesTrackArgs,
        artist_args_1.ArtistFilterArgs,
        track_args_1.TrackOrderArgs, Object]),
    __metadata("design:returntype", Promise)
], ArtistController.prototype, "tracks", null);
__decorate([
    rest_1.Get('/albums', () => album_model_1.AlbumPage, { description: 'Get Albums of Artists', summary: 'Get Albums' }),
    __param(0, rest_1.QueryParams()),
    __param(1, rest_1.QueryParams()),
    __param(2, rest_1.QueryParams()),
    __param(3, rest_1.QueryParams()),
    __param(4, rest_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [base_args_1.PageArgs,
        album_args_1.IncludesAlbumArgs,
        artist_args_1.ArtistFilterArgs,
        album_args_1.AlbumOrderArgs, Object]),
    __metadata("design:returntype", Promise)
], ArtistController.prototype, "albums", null);
__decorate([
    rest_1.Get('/series', () => series_model_1.SeriesPage, { description: 'Get Series of Artists', summary: 'Get Series' }),
    __param(0, rest_1.QueryParams()),
    __param(1, rest_1.QueryParams()),
    __param(2, rest_1.QueryParams()),
    __param(3, rest_1.QueryParams()),
    __param(4, rest_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [base_args_1.PageArgs,
        series_args_1.IncludesSeriesArgs,
        series_args_1.SeriesFilterArgs,
        series_args_1.SeriesOrderArgs, Object]),
    __metadata("design:returntype", Promise)
], ArtistController.prototype, "series", null);
ArtistController = __decorate([
    rest_1.Controller('/artist', { tags: ['Artist'], roles: [enums_1.UserRole.stream] })
], ArtistController);
exports.ArtistController = ArtistController;
//# sourceMappingURL=artist.controller.js.map