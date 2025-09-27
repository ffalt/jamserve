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
import { Series, SeriesIndex, SeriesPage } from './series.model.js';
import { UserRole } from '../../types/enums.js';
import { ExtendedInfoResult } from '../metadata/metadata.model.js';
import { TrackPage } from '../track/track.model.js';
import { AlbumPage } from '../album/album.model.js';
import { AlbumOrderParameters, IncludesAlbumParameters } from '../album/album.parameters.js';
import { IncludesSeriesParameters, IncludesSeriesChildrenParameters, SeriesFilterParameters, SeriesOrderParameters } from './series.parameters.js';
import { IncludesTrackParameters, TrackOrderParameters } from '../track/track.parameters.js';
import { ListParameters, PageParameters } from '../base/base.parameters.js';
import { Controller } from '../../modules/rest/decorators/controller.js';
import { Get } from '../../modules/rest/decorators/get.js';
import { QueryParameter } from '../../modules/rest/decorators/query-parameter.js';
import { QueryParameters } from '../../modules/rest/decorators/query-parameters.js';
import { RestContext } from '../../modules/rest/decorators/rest-context.js';
let SeriesController = class SeriesController {
    async id(id, seriesParameters, seriesChildrenParameters, albumParameters, trackParameters, { orm, engine, user }) {
        return engine.transform.series(orm, await orm.Series.oneOrFailByID(id), seriesParameters, seriesChildrenParameters, albumParameters, trackParameters, user);
    }
    async index(filter, { orm, engine, user }) {
        const result = await orm.Series.indexFilter(filter, user);
        return engine.transform.Series.seriesIndex(orm, result);
    }
    async search(page, seriesParameters, seriesChildrenParameters, albumParameters, trackParameters, filter, order, list, { orm, engine, user }) {
        if (list.list) {
            return await orm.Series.findListTransformFilter(list.list, list.seed, filter, [order], page, user, o => engine.transform.series(orm, o, seriesParameters, seriesChildrenParameters, albumParameters, trackParameters, user));
        }
        return await orm.Series.searchTransformFilter(filter, [order], page, user, o => engine.transform.series(orm, o, seriesParameters, seriesChildrenParameters, albumParameters, trackParameters, user));
    }
    async info(id, { orm, engine }) {
        const series = await orm.Series.oneOrFailByID(id);
        return { info: await engine.metadata.extInfo.bySeries(orm, series) };
    }
    async albums(page, albumParameters, filter, order, { orm, engine, user }) {
        const seriesIDs = await orm.Series.findIDsFilter(filter, user);
        return await orm.Album.searchTransformFilter({ seriesIDs }, [order], page, user, o => engine.transform.Album.albumBase(orm, o, albumParameters, user));
    }
    async tracks(page, trackParameters, filter, order, { orm, engine, user }) {
        const seriesIDs = await orm.Series.findIDsFilter(filter, user);
        return await orm.Track.searchTransformFilter({ seriesIDs }, [order], page, user, o => engine.transform.Track.trackBase(orm, o, trackParameters, user));
    }
};
__decorate([
    Get('/id', () => Series, { description: 'Get a Series by Id', summary: 'Get Series' }),
    __param(0, QueryParameter('id', { description: 'Series Id', isID: true })),
    __param(1, QueryParameters()),
    __param(2, QueryParameters()),
    __param(3, QueryParameters()),
    __param(4, QueryParameters()),
    __param(5, RestContext()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, IncludesSeriesParameters,
        IncludesSeriesChildrenParameters,
        IncludesAlbumParameters,
        IncludesTrackParameters, Object]),
    __metadata("design:returntype", Promise)
], SeriesController.prototype, "id", null);
__decorate([
    Get('/index', () => SeriesIndex, { description: 'Get the Navigation Index for Series', summary: 'Get Index' }),
    __param(0, QueryParameters()),
    __param(1, RestContext()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [SeriesFilterParameters, Object]),
    __metadata("design:returntype", Promise)
], SeriesController.prototype, "index", null);
__decorate([
    Get('/search', () => SeriesPage, { description: 'Search Series' }),
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
        IncludesSeriesParameters,
        IncludesSeriesChildrenParameters,
        IncludesAlbumParameters,
        IncludesTrackParameters,
        SeriesFilterParameters,
        SeriesOrderParameters,
        ListParameters, Object]),
    __metadata("design:returntype", Promise)
], SeriesController.prototype, "search", null);
__decorate([
    Get('/info', () => ExtendedInfoResult, { description: 'Get Meta Data Info of a Series by Id (External Service)', summary: 'Get Info' }),
    __param(0, QueryParameter('id', { description: 'Series Id', isID: true })),
    __param(1, RestContext()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], SeriesController.prototype, "info", null);
__decorate([
    Get('/albums', () => AlbumPage, { description: 'Get Albums of Series', summary: 'Get Albums' }),
    __param(0, QueryParameters()),
    __param(1, QueryParameters()),
    __param(2, QueryParameters()),
    __param(3, QueryParameters()),
    __param(4, RestContext()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [PageParameters,
        IncludesAlbumParameters,
        SeriesFilterParameters,
        AlbumOrderParameters, Object]),
    __metadata("design:returntype", Promise)
], SeriesController.prototype, "albums", null);
__decorate([
    Get('/tracks', () => TrackPage, { description: 'Get Tracks of Series', summary: 'Get Tracks' }),
    __param(0, QueryParameters()),
    __param(1, QueryParameters()),
    __param(2, QueryParameters()),
    __param(3, QueryParameters()),
    __param(4, RestContext()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [PageParameters,
        IncludesTrackParameters,
        SeriesFilterParameters,
        TrackOrderParameters, Object]),
    __metadata("design:returntype", Promise)
], SeriesController.prototype, "tracks", null);
SeriesController = __decorate([
    Controller('/series', { tags: ['Series'], roles: [UserRole.stream] })
], SeriesController);
export { SeriesController };
//# sourceMappingURL=series.controller.js.map