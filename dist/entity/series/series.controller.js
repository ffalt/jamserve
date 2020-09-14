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
exports.SeriesController = void 0;
const series_model_1 = require("./series.model");
const rest_1 = require("../../modules/rest");
const enums_1 = require("../../types/enums");
const metadata_model_1 = require("../metadata/metadata.model");
const track_model_1 = require("../track/track.model");
const album_model_1 = require("../album/album.model");
const album_args_1 = require("../album/album.args");
const series_args_1 = require("./series.args");
const track_args_1 = require("../track/track.args");
const base_args_1 = require("../base/base.args");
let SeriesController = class SeriesController {
    async id(id, seriesArgs, seriesChildrenArgs, albumArgs, trackArgs, { orm, engine, user }) {
        return engine.transform.series(orm, await orm.Series.oneOrFailByID(id), seriesArgs, seriesChildrenArgs, albumArgs, trackArgs, user);
    }
    async index(filter, { orm, engine, user }) {
        const result = await orm.Series.indexFilter(filter, user);
        return engine.transform.transformSeriesIndex(orm, result);
    }
    async search(page, seriesArgs, seriesChildrenArgs, albumArgs, trackArgs, filter, order, list, { orm, engine, user }) {
        if (list.list) {
            return await orm.Series.findListTransformFilter(list.list, list.seed, filter, [order], page, user, o => engine.transform.series(orm, o, seriesArgs, seriesChildrenArgs, albumArgs, trackArgs, user));
        }
        return await orm.Series.searchTransformFilter(filter, [order], page, user, o => engine.transform.series(orm, o, seriesArgs, seriesChildrenArgs, albumArgs, trackArgs, user));
    }
    async info(id, { orm, engine }) {
        const series = await orm.Series.oneOrFailByID(id);
        return { info: await engine.metadata.extInfo.bySeries(orm, series) };
    }
    async albums(page, albumArgs, filter, order, { orm, engine, user }) {
        const seriesIDs = await orm.Series.findIDsFilter(filter, user);
        return await orm.Album.searchTransformFilter({ seriesIDs }, [order], page, user, o => engine.transform.albumBase(orm, o, albumArgs, user));
    }
    async tracks(page, trackArgs, filter, order, { orm, engine, user }) {
        const seriesIDs = await orm.Series.findIDsFilter(filter, user);
        return await orm.Track.searchTransformFilter({ seriesIDs }, [order], page, user, o => engine.transform.trackBase(orm, o, trackArgs, user));
    }
};
__decorate([
    rest_1.Get('/id', () => series_model_1.Series, { description: 'Get a Series by Id', summary: 'Get Series' }),
    __param(0, rest_1.QueryParam('id', { description: 'Series Id', isID: true })),
    __param(1, rest_1.QueryParams()),
    __param(2, rest_1.QueryParams()),
    __param(3, rest_1.QueryParams()),
    __param(4, rest_1.QueryParams()),
    __param(5, rest_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, series_args_1.IncludesSeriesArgs,
        series_args_1.IncludesSeriesChildrenArgs,
        album_args_1.IncludesAlbumArgs,
        track_args_1.IncludesTrackArgs, Object]),
    __metadata("design:returntype", Promise)
], SeriesController.prototype, "id", null);
__decorate([
    rest_1.Get('/index', () => series_model_1.SeriesIndex, { description: 'Get the Navigation Index for Series', summary: 'Get Index' }),
    __param(0, rest_1.QueryParams()), __param(1, rest_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [series_args_1.SeriesFilterArgs, Object]),
    __metadata("design:returntype", Promise)
], SeriesController.prototype, "index", null);
__decorate([
    rest_1.Get('/search', () => series_model_1.SeriesPage, { description: 'Search Series' }),
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
        series_args_1.IncludesSeriesArgs,
        series_args_1.IncludesSeriesChildrenArgs,
        album_args_1.IncludesAlbumArgs,
        track_args_1.IncludesTrackArgs,
        series_args_1.SeriesFilterArgs,
        series_args_1.SeriesOrderArgs,
        base_args_1.ListArgs, Object]),
    __metadata("design:returntype", Promise)
], SeriesController.prototype, "search", null);
__decorate([
    rest_1.Get('/info', () => metadata_model_1.ExtendedInfoResult, { description: 'Get Meta Data Info of a Series by Id (External Service)', summary: 'Get Info' }),
    __param(0, rest_1.QueryParam('id', { description: 'Series Id', isID: true })),
    __param(1, rest_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], SeriesController.prototype, "info", null);
__decorate([
    rest_1.Get('/albums', () => album_model_1.AlbumPage, { description: 'Get Albums of Series', summary: 'Get Albums' }),
    __param(0, rest_1.QueryParams()),
    __param(1, rest_1.QueryParams()),
    __param(2, rest_1.QueryParams()),
    __param(3, rest_1.QueryParams()),
    __param(4, rest_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [base_args_1.PageArgs,
        album_args_1.IncludesAlbumArgs,
        series_args_1.SeriesFilterArgs,
        album_args_1.AlbumOrderArgs, Object]),
    __metadata("design:returntype", Promise)
], SeriesController.prototype, "albums", null);
__decorate([
    rest_1.Get('/tracks', () => track_model_1.TrackPage, { description: 'Get Tracks of Series', summary: 'Get Tracks' }),
    __param(0, rest_1.QueryParams()),
    __param(1, rest_1.QueryParams()),
    __param(2, rest_1.QueryParams()),
    __param(3, rest_1.QueryParams()),
    __param(4, rest_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [base_args_1.PageArgs,
        track_args_1.IncludesTrackArgs,
        series_args_1.SeriesFilterArgs,
        track_args_1.TrackOrderArgs, Object]),
    __metadata("design:returntype", Promise)
], SeriesController.prototype, "tracks", null);
SeriesController = __decorate([
    rest_1.Controller('/series', { tags: ['Series'], roles: [enums_1.UserRole.stream] })
], SeriesController);
exports.SeriesController = SeriesController;
//# sourceMappingURL=series.controller.js.map