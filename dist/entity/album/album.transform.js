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
import { GenreTransformService } from '../genre/genre.transform.js';
let AlbumTransformService = class AlbumTransformService extends BaseTransformService {
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
            series: series?.name,
            seriesID: series?.id,
            seriesNr: o.seriesNr,
            state: albumArgs.albumIncState ? await this.state(orm, o.id, DBObjectType.album, user.id) : undefined,
            trackCount: albumArgs.albumIncTrackCount ? await o.tracks.count() : undefined,
            trackIDs: albumArgs.albumIncTrackIDs ? await o.tracks.getIDs() : undefined,
            info: albumArgs.albumIncInfo ? await this.metaData.extInfo.byAlbum(orm, o) : undefined
        };
    }
    async albumIndex(orm, result) {
        return this.index(result, async (item) => {
            const artist = await item.artist.get();
            return {
                id: item.id,
                name: item.name,
                artist: artist?.name || '[INVALID ARTIST]',
                artistID: artist?.id || (await item.artist.id()) || 'INVALID_ARTIST_ID',
                trackCount: await item.tracks.count()
            };
        });
    }
};
__decorate([
    Inject,
    __metadata("design:type", MetaDataService)
], AlbumTransformService.prototype, "metaData", void 0);
__decorate([
    Inject,
    __metadata("design:type", GenreTransformService)
], AlbumTransformService.prototype, "Genre", void 0);
AlbumTransformService = __decorate([
    InRequestScope
], AlbumTransformService);
export { AlbumTransformService };
//# sourceMappingURL=album.transform.js.map