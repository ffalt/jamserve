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
exports.TrackTransformService = void 0;
const typescript_ioc_1 = require("typescript-ioc");
const enums_1 = require("../../types/enums");
const base_transform_1 = require("../base/base.transform");
const track_service_1 = require("./track.service");
const genre_transform_1 = require("../genre/genre.transform");
let TrackTransformService = class TrackTransformService extends base_transform_1.BaseTransformService {
    async trackBases(orm, list, trackArgs, user) {
        return await Promise.all(list.map(t => this.trackBase(orm, t, trackArgs, user)));
    }
    async trackBase(orm, o, trackArgs, user) {
        var _a;
        const tag = await o.tag.get();
        return {
            id: o.id,
            name: o.fileName || o.name,
            objType: enums_1.JamObjectType.track,
            created: o.createdAt.valueOf(),
            duration: (_a = tag === null || tag === void 0 ? void 0 : tag.mediaDuration) !== null && _a !== void 0 ? _a : 0,
            parentID: o.folder.idOrFail(),
            artistID: o.artist.id(),
            albumArtistID: o.albumArtist.id(),
            albumID: o.album.id(),
            seriesID: o.series.id(),
            genres: trackArgs.trackIncGenres ? await this.Genre.genreBases(orm, await o.genres.getItems(), {}, user) : undefined,
            tag: trackArgs.trackIncTag ? await this.mediaTag(orm, tag) : undefined,
            media: trackArgs.trackIncMedia ? await this.trackMedia(tag, o.fileSize) : undefined,
            tagRaw: trackArgs.trackIncRawTag ? await this.trackService.getRawTag(o) : undefined,
            state: trackArgs.trackIncState ? await this.state(orm, o.id, enums_1.DBObjectType.track, user.id) : undefined
        };
    }
};
__decorate([
    typescript_ioc_1.Inject,
    __metadata("design:type", track_service_1.TrackService)
], TrackTransformService.prototype, "trackService", void 0);
__decorate([
    typescript_ioc_1.Inject,
    __metadata("design:type", genre_transform_1.GenreTransformService)
], TrackTransformService.prototype, "Genre", void 0);
TrackTransformService = __decorate([
    typescript_ioc_1.InRequestScope
], TrackTransformService);
exports.TrackTransformService = TrackTransformService;
//# sourceMappingURL=track.transform.js.map