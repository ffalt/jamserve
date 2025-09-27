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
import { DBObjectType, JamObjectType } from '../../types/enums.js';
import { BaseTransformService } from '../base/base.transform.js';
import { TrackService } from './track.service.js';
import { GenreTransformService } from '../genre/genre.transform.js';
let TrackTransformService = class TrackTransformService extends BaseTransformService {
    async trackBases(orm, list, trackParameters, user) {
        return await Promise.all(list.map(t => this.trackBase(orm, t, trackParameters, user)));
    }
    async trackBase(orm, o, trackParameters, user) {
        const tag = await o.tag.get();
        return {
            id: o.id,
            name: o.fileName || o.name,
            objType: JamObjectType.track,
            created: o.createdAt.valueOf(),
            duration: tag?.mediaDuration ?? 0,
            parentID: o.folder.idOrFail(),
            artistID: o.artist.id(),
            albumArtistID: o.albumArtist.id(),
            albumID: o.album.id(),
            seriesID: o.series.id(),
            genres: trackParameters.trackIncGenres ? await this.Genre.genreBases(orm, await o.genres.getItems(), {}, user) : undefined,
            tag: trackParameters.trackIncTag ? await this.mediaTag(orm, tag) : undefined,
            media: trackParameters.trackIncMedia ? await this.trackMedia(tag, o.fileSize) : undefined,
            tagRaw: trackParameters.trackIncRawTag ? await this.trackService.getRawTag(o) : undefined,
            state: trackParameters.trackIncState ? await this.state(orm, o.id, DBObjectType.track, user.id) : undefined
        };
    }
};
__decorate([
    Inject,
    __metadata("design:type", TrackService)
], TrackTransformService.prototype, "trackService", void 0);
__decorate([
    Inject,
    __metadata("design:type", GenreTransformService)
], TrackTransformService.prototype, "Genre", void 0);
TrackTransformService = __decorate([
    InRequestScope
], TrackTransformService);
export { TrackTransformService };
//# sourceMappingURL=track.transform.js.map