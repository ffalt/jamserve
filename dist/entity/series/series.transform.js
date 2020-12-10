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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SeriesTransformService = void 0;
const typescript_ioc_1 = require("typescript-ioc");
const base_transform_1 = require("../base/base.transform");
const enums_1 = require("../../types/enums");
const metadata_service_1 = require("../metadata/metadata.service");
let SeriesTransformService = class SeriesTransformService extends base_transform_1.BaseTransformService {
    async seriesBases(orm, list, seriesArgs, user) {
        return await Promise.all(list.map(t => this.seriesBase(orm, t, seriesArgs, user)));
    }
    async seriesBase(orm, o, seriesArgs, user) {
        const artist = await o.artist.getOrFail();
        return {
            id: o.id,
            name: o.name,
            created: o.createdAt.valueOf(),
            artist: artist.name,
            artistID: artist.id,
            albumTypes: o.albumTypes,
            albumCount: seriesArgs.seriesIncAlbumCount ? await o.albums.count() : undefined,
            trackCount: seriesArgs.seriesIncTrackCount ? await o.tracks.count() : undefined,
            trackIDs: seriesArgs.seriesIncTrackIDs ? (await o.tracks.getItems()).map(t => t.id) : undefined,
            albumIDs: seriesArgs.seriesIncAlbumIDs ? (await o.albums.getItems()).map(a => a.id) : undefined,
            info: seriesArgs.seriesIncInfo ? await this.metaData.extInfo.bySeries(orm, o) : undefined,
            state: seriesArgs.seriesIncState ? await this.state(orm, o.id, enums_1.DBObjectType.series, user.id) : undefined
        };
    }
    async seriesIndex(orm, result) {
        return this.index(result, async (item) => {
            return {
                id: item.id,
                name: item.name,
                albumCount: await item.albums.count(),
                trackCount: await item.tracks.count()
            };
        });
    }
};
__decorate([
    typescript_ioc_1.Inject,
    __metadata("design:type", metadata_service_1.MetaDataService)
], SeriesTransformService.prototype, "metaData", void 0);
SeriesTransformService = __decorate([
    typescript_ioc_1.InRequestScope
], SeriesTransformService);
exports.SeriesTransformService = SeriesTransformService;
//# sourceMappingURL=series.transform.js.map