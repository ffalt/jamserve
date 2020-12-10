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
exports.ArtistTransformService = void 0;
const typescript_ioc_1 = require("typescript-ioc");
const base_transform_1 = require("../base/base.transform");
const enums_1 = require("../../types/enums");
const metadata_service_1 = require("../metadata/metadata.service");
const genre_transform_1 = require("../genre/genre.transform");
let ArtistTransformService = class ArtistTransformService extends base_transform_1.BaseTransformService {
    async artistBases(orm, list, artistArgs, user) {
        return await Promise.all(list.map(t => this.artistBase(orm, t, artistArgs, user)));
    }
    async artistBase(orm, o, artistArgs, user) {
        return {
            id: o.id,
            name: o.name,
            created: o.createdAt.valueOf(),
            albumCount: artistArgs.artistIncAlbumCount ? await o.albums.count() : undefined,
            trackCount: artistArgs.artistIncTrackCount ? await o.tracks.count() : undefined,
            seriesCount: artistArgs.artistIncSeriesCount ? await o.series.count() : undefined,
            mbArtistID: o.mbArtistID,
            genres: artistArgs.artistIncGenres ? await this.Genre.genreBases(orm, await o.genres.getItems(), {}, user) : undefined,
            albumTypes: o.albumTypes,
            state: artistArgs.artistIncState ? await this.state(orm, o.id, enums_1.DBObjectType.artist, user.id) : undefined,
            trackIDs: artistArgs.artistIncTrackIDs ? (await o.tracks.getItems()).map(t => t.id) : undefined,
            albumIDs: artistArgs.artistIncAlbumIDs ? (await o.albums.getItems()).map(a => a.id) : undefined,
            seriesIDs: artistArgs.artistIncSeriesIDs ? (await o.series.getItems()).map(s => s.id) : undefined,
            info: artistArgs.artistIncInfo ? await this.metaData.extInfo.byArtist(orm, o) : undefined
        };
    }
    async artistIndex(orm, result) {
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
], ArtistTransformService.prototype, "metaData", void 0);
__decorate([
    typescript_ioc_1.Inject,
    __metadata("design:type", genre_transform_1.GenreTransformService)
], ArtistTransformService.prototype, "Genre", void 0);
ArtistTransformService = __decorate([
    typescript_ioc_1.InRequestScope
], ArtistTransformService);
exports.ArtistTransformService = ArtistTransformService;
//# sourceMappingURL=artist.transform.js.map