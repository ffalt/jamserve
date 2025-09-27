var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Inject, InRequestScope } from 'typescript-ioc';
import { BaseTransformService } from '../base/base.transform.js';
import { DBObjectType } from '../../types/enums.js';
import { MetaDataService } from '../metadata/metadata.service.js';
let SeriesTransformService = class SeriesTransformService extends BaseTransformService {
    async seriesBases(orm, list, seriesParameters, user) {
        return await Promise.all(list.map(t => this.seriesBase(orm, t, seriesParameters, user)));
    }
    async seriesBase(orm, o, seriesParameters, user) {
        const artist = await o.artist.getOrFail();
        return {
            id: o.id,
            name: o.name,
            created: o.createdAt.valueOf(),
            artist: artist.name,
            artistID: artist.id,
            albumTypes: o.albumTypes,
            albumCount: seriesParameters.seriesIncAlbumCount ? await o.albums.count() : undefined,
            trackCount: seriesParameters.seriesIncTrackCount ? await o.tracks.count() : undefined,
            trackIDs: seriesParameters.seriesIncTrackIDs ? await o.tracks.getIDs() : undefined,
            albumIDs: seriesParameters.seriesIncAlbumIDs ? await o.albums.getIDs() : undefined,
            info: seriesParameters.seriesIncInfo ? await this.metaData.extInfo.bySeries(orm, o) : undefined,
            state: seriesParameters.seriesIncState ? await this.state(orm, o.id, DBObjectType.series, user.id) : undefined
        };
    }
    async seriesIndex(_orm, result) {
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
    Inject,
    __metadata("design:type", MetaDataService)
], SeriesTransformService.prototype, "metaData", void 0);
SeriesTransformService = __decorate([
    InRequestScope
], SeriesTransformService);
export { SeriesTransformService };
//# sourceMappingURL=series.transform.js.map