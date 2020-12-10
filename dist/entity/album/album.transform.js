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
exports.AlbumTransformService = void 0;
const typescript_ioc_1 = require("typescript-ioc");
const base_transform_1 = require("../base/base.transform");
const enums_1 = require("../../types/enums");
const metadata_service_1 = require("../metadata/metadata.service");
const genre_transform_1 = require("../genre/genre.transform");
let AlbumTransformService = class AlbumTransformService extends base_transform_1.BaseTransformService {
    async albumBases(orm, list, albumArgs, user) {
        return await Promise.all(list.map(t => this.albumBase(orm, t, albumArgs, user)));
    }
    async albumBase(orm, o, albumArgs, user) {
        const artist = await o.artist.getOrFail();
        const series = await o.series.get();
        return {
            id: o.id,
            name: o.name,
            created: o.createdAt.valueOf(),
            genres: albumArgs.albumIncGenres ? await this.Genre.genreBases(orm, await o.genres.getItems(), {}, user) : undefined,
            year: o.year,
            mbArtistID: o.mbArtistID,
            mbReleaseID: o.mbReleaseID,
            albumType: o.albumType,
            duration: o.duration,
            artistID: artist.id,
            artistName: artist.name,
            series: series === null || series === void 0 ? void 0 : series.name,
            seriesID: series === null || series === void 0 ? void 0 : series.id,
            seriesNr: o.seriesNr,
            state: albumArgs.albumIncState ? await this.state(orm, o.id, enums_1.DBObjectType.album, user.id) : undefined,
            trackCount: albumArgs.albumIncTrackCount ? await o.tracks.count() : undefined,
            trackIDs: albumArgs.albumIncTrackIDs ? (await o.tracks.getItems()).map(t => t.id) : undefined,
            info: albumArgs.albumIncInfo ? await this.metaData.extInfo.byAlbum(orm, o) : undefined
        };
    }
    async albumIndex(orm, result) {
        return this.index(result, async (item) => {
            const artist = await item.artist.getOrFail();
            return {
                id: item.id,
                name: item.name,
                artist: artist.name,
                artistID: artist.id,
                trackCount: await item.tracks.count()
            };
        });
    }
};
__decorate([
    typescript_ioc_1.Inject,
    __metadata("design:type", metadata_service_1.MetaDataService)
], AlbumTransformService.prototype, "metaData", void 0);
__decorate([
    typescript_ioc_1.Inject,
    __metadata("design:type", genre_transform_1.GenreTransformService)
], AlbumTransformService.prototype, "Genre", void 0);
AlbumTransformService = __decorate([
    typescript_ioc_1.InRequestScope
], AlbumTransformService);
exports.AlbumTransformService = AlbumTransformService;
//# sourceMappingURL=album.transform.js.map