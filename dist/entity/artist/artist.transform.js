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
import { BaseTransformService } from '../base/base.transform';
import { DBObjectType } from '../../types/enums';
import { MetaDataService } from '../metadata/metadata.service';
import { GenreTransformService } from '../genre/genre.transform';
let ArtistTransformService = class ArtistTransformService extends BaseTransformService {
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
            state: artistArgs.artistIncState ? await this.state(orm, o.id, DBObjectType.artist, user.id) : undefined,
            trackIDs: artistArgs.artistIncTrackIDs ? await o.tracks.getIDs() : undefined,
            albumIDs: artistArgs.artistIncAlbumIDs ? await o.albums.getIDs() : undefined,
            seriesIDs: artistArgs.artistIncSeriesIDs ? await o.series.getIDs() : undefined,
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
    Inject,
    __metadata("design:type", MetaDataService)
], ArtistTransformService.prototype, "metaData", void 0);
__decorate([
    Inject,
    __metadata("design:type", GenreTransformService)
], ArtistTransformService.prototype, "Genre", void 0);
ArtistTransformService = __decorate([
    InRequestScope
], ArtistTransformService);
export { ArtistTransformService };
//# sourceMappingURL=artist.transform.js.map