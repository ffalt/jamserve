var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Base, Page } from '../base/base.model.js';
import { AlbumType } from '../../types/enums.js';
import { TrackBase } from '../track/track.model.js';
import { SeriesBase } from '../series/series.model.js';
import { AlbumBase } from '../album/album.model.js';
import { ExtendedInfo } from '../metadata/metadata.model.js';
import { examples } from '../../modules/engine/rest/example.consts.js';
import { GenreBase } from '../genre/genre.model.js';
import { ResultType } from '../../modules/rest/decorators/ResultType.js';
import { ObjField } from '../../modules/rest/decorators/ObjField.js';
let ArtistBase = class ArtistBase extends Base {
};
__decorate([
    ObjField(() => [AlbumType], { description: 'List of Album Type', example: [AlbumType.album, AlbumType.compilation] }),
    __metadata("design:type", Array)
], ArtistBase.prototype, "albumTypes", void 0);
__decorate([
    ObjField(() => [GenreBase], { nullable: true, description: 'Genres' }),
    __metadata("design:type", Array)
], ArtistBase.prototype, "genres", void 0);
__decorate([
    ObjField({ nullable: true, description: 'MusicBrainz Artist Id', example: examples.mbArtistID }),
    __metadata("design:type", String)
], ArtistBase.prototype, "mbArtistID", void 0);
__decorate([
    ObjField({ nullable: true, description: 'Number of Albums', min: 0, example: 5 }),
    __metadata("design:type", Number)
], ArtistBase.prototype, "albumCount", void 0);
__decorate([
    ObjField(() => [String], { nullable: true, description: 'List of Album Ids', isID: true }),
    __metadata("design:type", Array)
], ArtistBase.prototype, "albumIDs", void 0);
__decorate([
    ObjField({ nullable: true, description: 'Number of Series', min: 0, example: 5 }),
    __metadata("design:type", Number)
], ArtistBase.prototype, "seriesCount", void 0);
__decorate([
    ObjField(() => [String], { nullable: true, description: 'List of Series Ids', isID: true }),
    __metadata("design:type", Array)
], ArtistBase.prototype, "seriesIDs", void 0);
__decorate([
    ObjField({ nullable: true, description: 'Number of Tracks', min: 0, example: 5 }),
    __metadata("design:type", Number)
], ArtistBase.prototype, "trackCount", void 0);
__decorate([
    ObjField(() => [String], { nullable: true, description: 'List of Track Ids', isID: true }),
    __metadata("design:type", Array)
], ArtistBase.prototype, "trackIDs", void 0);
__decorate([
    ObjField(() => ExtendedInfo, { nullable: true, description: 'Metadata for the Artist (via External Service)' }),
    __metadata("design:type", ExtendedInfo)
], ArtistBase.prototype, "info", void 0);
ArtistBase = __decorate([
    ResultType({ description: 'Artist' })
], ArtistBase);
export { ArtistBase };
let Artist = class Artist extends ArtistBase {
};
__decorate([
    ObjField(() => ArtistBase, { nullable: true, description: 'List of similar Artists (via External Service)' }),
    __metadata("design:type", Array)
], Artist.prototype, "similar", void 0);
__decorate([
    ObjField(() => SeriesBase, { nullable: true, description: 'List of Series' }),
    __metadata("design:type", Array)
], Artist.prototype, "series", void 0);
__decorate([
    ObjField(() => AlbumBase, { nullable: true, description: 'List of Albums' }),
    __metadata("design:type", Array)
], Artist.prototype, "albums", void 0);
__decorate([
    ObjField(() => TrackBase, { nullable: true, description: 'List of Tracks' }),
    __metadata("design:type", Array)
], Artist.prototype, "tracks", void 0);
Artist = __decorate([
    ResultType({ description: 'Artist with Albums,...' })
], Artist);
export { Artist };
let ArtistPage = class ArtistPage extends Page {
};
__decorate([
    ObjField(() => Artist, { description: 'List of Artists' }),
    __metadata("design:type", Array)
], ArtistPage.prototype, "items", void 0);
ArtistPage = __decorate([
    ResultType({ description: 'Artist Page' })
], ArtistPage);
export { ArtistPage };
let ArtistIndexEntry = class ArtistIndexEntry {
};
__decorate([
    ObjField({ description: 'ID', isID: true }),
    __metadata("design:type", String)
], ArtistIndexEntry.prototype, "id", void 0);
__decorate([
    ObjField({ description: 'Name', example: 'Mars Volta' }),
    __metadata("design:type", String)
], ArtistIndexEntry.prototype, "name", void 0);
__decorate([
    ObjField({ description: 'Album Count', min: 0, example: 5 }),
    __metadata("design:type", Number)
], ArtistIndexEntry.prototype, "albumCount", void 0);
__decorate([
    ObjField({ description: 'Track Count', min: 0, example: 55 }),
    __metadata("design:type", Number)
], ArtistIndexEntry.prototype, "trackCount", void 0);
ArtistIndexEntry = __decorate([
    ResultType({ description: 'Artist Index Entry' })
], ArtistIndexEntry);
export { ArtistIndexEntry };
let ArtistIndexGroup = class ArtistIndexGroup {
};
__decorate([
    ObjField({ description: 'Artist Group Name', example: 'P' }),
    __metadata("design:type", String)
], ArtistIndexGroup.prototype, "name", void 0);
__decorate([
    ObjField(() => [ArtistIndexEntry]),
    __metadata("design:type", Array)
], ArtistIndexGroup.prototype, "items", void 0);
ArtistIndexGroup = __decorate([
    ResultType({ description: 'Artist Index Group' })
], ArtistIndexGroup);
export { ArtistIndexGroup };
let ArtistIndex = class ArtistIndex {
};
__decorate([
    ObjField({ description: 'Last Change Timestamp' }),
    __metadata("design:type", Number)
], ArtistIndex.prototype, "lastModified", void 0);
__decorate([
    ObjField(() => [ArtistIndexGroup], { description: 'Artist Index Groups' }),
    __metadata("design:type", Array)
], ArtistIndex.prototype, "groups", void 0);
ArtistIndex = __decorate([
    ResultType({ description: 'Artist Index' })
], ArtistIndex);
export { ArtistIndex };
//# sourceMappingURL=artist.model.js.map