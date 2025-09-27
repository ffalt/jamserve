var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { InRequestScope } from 'typescript-ioc';
let BaseTransformService = class BaseTransformService {
    async index(result, mapItem) {
        return {
            lastModified: Date.now(),
            groups: await Promise.all(result.groups.map(async (group) => {
                return {
                    name: group.name,
                    items: await Promise.all(group.items.map(async (item) => {
                        return await mapItem(item);
                    }))
                };
            }))
        };
    }
    async stateBase(_orm, o) {
        return {
            played: o.played,
            lastPlayed: o.lastPlayed ? o.lastPlayed.valueOf() : undefined,
            faved: o.faved ? o.faved.valueOf() : undefined,
            rated: o.rated
        };
    }
    async state(orm, id, type, userID) {
        const state = await orm.State.findOrCreate(id, type, userID);
        return this.stateBase(orm, state);
    }
    async trackMedia(o, fileSize) {
        return {
            bitRate: o?.mediaBitRate,
            format: o?.mediaFormat,
            channels: o?.mediaChannels,
            sampleRate: o?.mediaSampleRate,
            size: fileSize
        };
    }
    async mediaTag(_orm, o) {
        if (!o) {
            return {};
        }
        return {
            title: o.title,
            album: o.album,
            artist: o.artist,
            genres: o.genres,
            year: o.year,
            trackNr: o.trackNr,
            disc: o.disc,
            discTotal: o.discTotal,
            mbTrackID: o.mbTrackID,
            mbRecordingID: o.mbRecordingID,
            mbReleaseTrackID: o.mbReleaseTrackID,
            mbReleaseGroupID: o.mbReleaseGroupID,
            mbReleaseID: o.mbReleaseID,
            mbArtistID: o.mbArtistID,
            mbAlbumArtistID: o.mbAlbumArtistID
        };
    }
};
BaseTransformService = __decorate([
    InRequestScope
], BaseTransformService);
export { BaseTransformService };
//# sourceMappingURL=base.transform.js.map