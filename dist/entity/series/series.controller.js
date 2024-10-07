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
import { AlbumOrderArgs, IncludesAlbumArgs } from '../album/album.args.js';
import { IncludesSeriesArgs, IncludesSeriesChildrenArgs, SeriesFilterArgs, SeriesOrderArgs } from './series.args.js';
import { IncludesTrackArgs, TrackOrderArgs } from '../track/track.args.js';
import { ListArgs, PageArgs } from '../base/base.args.js';
import { Controller } from '../../modules/rest/decorators/Controller.js';
import { Get } from '../../modules/rest/decorators/Get.js';
import { QueryParam } from '../../modules/rest/decorators/QueryParam.js';
import { QueryParams } from '../../modules/rest/decorators/QueryParams.js';
import { Ctx } from '../../modules/rest/decorators/Ctx.js';
let SeriesController = class SeriesController {
    async id(id, seriesArgs, seriesChildrenArgs, albumArgs, trackArgs, { orm, engine, user }) {
        return engine.transform.series(orm, await orm.Series.oneOrFailByID(id), seriesArgs, seriesChildrenArgs, albumArgs, trackArgs, user);
    }
    async index(filter, { orm, engine, user }) {
        const result = await orm.Series.indexFilter(filter, user);
        return engine.transform.Series.seriesIndex(orm, result);
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
        return await orm.Album.searchTransformFilter({ seriesIDs }, [order], page, user, o => engine.transform.Album.albumBase(orm, o, albumArgs, user));
    }
    async tracks(page, trackArgs, filter, order, { orm, engine, user }) {
        const seriesIDs = await orm.Series.findIDsFilter(filter, user);
        return await orm.Track.searchTransformFilter({ seriesIDs }, [order], page, user, o => engine.transform.Track.trackBase(orm, o, trackArgs, user));
    }
};
__decorate([
    Get('/id', () => Series, { description: 'Get a Series by Id', summary: 'Get Series' }),
    __param(0, QueryParam('id', { description: 'Series Id', isID: true })),
    __param(1, QueryParams()),
    __param(2, QueryParams()),
    __param(3, QueryParams()),
    __param(4, QueryParams()),
    __param(5, Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, IncludesSeriesArgs,
        IncludesSeriesChildrenArgs,
        IncludesAlbumArgs,
        IncludesTrackArgs, Object]),
    __metadata("design:returntype", Promise)
], SeriesController.prototype, "id", null);
__decorate([
    Get('/index', () => SeriesIndex, { description: 'Get the Navigation Index for Series', summary: 'Get Index' }),
    __param(0, QueryParams()),
    __param(1, Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [SeriesFilterArgs, Object]),
    __metadata("design:returntype", Promise)
], SeriesController.prototype, "index", null);
__decorate([
    Get('/search', () => SeriesPage, { description: 'Search Series' }),
    __param(0, QueryParams()),
    __param(1, QueryParams()),
    __param(2, QueryParams()),
    __param(3, QueryParams()),
    __param(4, QueryParams()),
    __param(5, QueryParams()),
    __param(6, QueryParams()),
    __param(7, QueryParams()),
    __param(8, Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [PageArgs,
        IncludesSeriesArgs,
        IncludesSeriesChildrenArgs,
        IncludesAlbumArgs,
        IncludesTrackArgs,
        SeriesFilterArgs,
        SeriesOrderArgs,
        ListArgs, Object]),
    __metadata("design:returntype", Promise)
], SeriesController.prototype, "search", null);
__decorate([
    Get('/info', () => ExtendedInfoResult, { description: 'Get Meta Data Info of a Series by Id (External Service)', summary: 'Get Info' }),
    __param(0, QueryParam('id', { description: 'Series Id', isID: true })),
    __param(1, Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], SeriesController.prototype, "info", null);
__decorate([
    Get('/albums', () => AlbumPage, { description: 'Get Albums of Series', summary: 'Get Albums' }),
    __param(0, QueryParams()),
    __param(1, QueryParams()),
    __param(2, QueryParams()),
    __param(3, QueryParams()),
    __param(4, Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [PageArgs,
        IncludesAlbumArgs,
        SeriesFilterArgs,
        AlbumOrderArgs, Object]),
    __metadata("design:returntype", Promise)
], SeriesController.prototype, "albums", null);
__decorate([
    Get('/tracks', () => TrackPage, { description: 'Get Tracks of Series', summary: 'Get Tracks' }),
    __param(0, QueryParams()),
    __param(1, QueryParams()),
    __param(2, QueryParams()),
    __param(3, QueryParams()),
    __param(4, Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [PageArgs,
        IncludesTrackArgs,
        SeriesFilterArgs,
        TrackOrderArgs, Object]),
    __metadata("design:returntype", Promise)
], SeriesController.prototype, "tracks", null);
SeriesController = __decorate([
    Controller('/series', { tags: ['Series'], roles: [UserRole.stream] })
], SeriesController);
export { SeriesController };
//# sourceMappingURL=series.controller.js.map