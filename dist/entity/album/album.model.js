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
import { ExtendedInfo } from '../metadata/metadata.model.js';
import { examples } from '../../modules/engine/rest/example.consts.js';
import { ArtistBase } from '../artist/artist.model.js';
import { GenreBase } from '../genre/genre.model.js';
import { ObjectField } from '../../modules/rest/decorators/object-field.js';
import { ResultType } from '../../modules/rest/decorators/result-type.js';
let AlbumBase = class AlbumBase extends Base {
};
__decorate([
    ObjectField(() => AlbumType, { description: 'Album Type', example: AlbumType.compilation }),
    __metadata("design:type", String)
], AlbumBase.prototype, "albumType", void 0);
__decorate([
    ObjectField({ description: 'Album Play Duration', example: 12345 }),
    __metadata("design:type", Number)
], AlbumBase.prototype, "duration", void 0);
__decorate([
    ObjectField({ description: 'Album Artist Id', isID: true }),
    __metadata("design:type", String)
], AlbumBase.prototype, "artistID", void 0);
__decorate([
    ObjectField({ description: 'Album Artist', example: 'Pink Floyd' }),
    __metadata("design:type", String)
], AlbumBase.prototype, "artistName", void 0);
__decorate([
    ObjectField({ nullable: true, description: 'Number of Tracks', min: 0, example: 5 }),
    __metadata("design:type", Number)
], AlbumBase.prototype, "trackCount", void 0);
__decorate([
    ObjectField(() => [String], { nullable: true, description: 'List of Track Ids', isID: true }),
    __metadata("design:type", Array)
], AlbumBase.prototype, "trackIDs", void 0);
__decorate([
    ObjectField(() => [GenreBase], { nullable: true, description: 'Genres' }),
    __metadata("design:type", Array)
], AlbumBase.prototype, "genres", void 0);
__decorate([
    ObjectField({ nullable: true, description: 'Album Release Year', example: examples.year }),
    __metadata("design:type", Number)
], AlbumBase.prototype, "year", void 0);
__decorate([
    ObjectField({ nullable: true, description: 'MusicBrainz Artist Id', example: examples.mbArtistID }),
    __metadata("design:type", String)
], AlbumBase.prototype, "mbArtistID", void 0);
__decorate([
    ObjectField({ nullable: true, description: 'MusicBrainz Release Id', example: examples.mbReleaseID }),
    __metadata("design:type", String)
], AlbumBase.prototype, "mbReleaseID", void 0);
__decorate([
    ObjectField({ nullable: true, description: 'Series Name', example: 'A Series of Unfortunate Events' }),
    __metadata("design:type", String)
], AlbumBase.prototype, "series", void 0);
__decorate([
    ObjectField({ nullable: true, description: 'Series Id', isID: true }),
    __metadata("design:type", String)
], AlbumBase.prototype, "seriesID", void 0);
__decorate([
    ObjectField({ nullable: true, description: 'Series Nr', example: '001' }),
    __metadata("design:type", String)
], AlbumBase.prototype, "seriesNr", void 0);
__decorate([
    ObjectField(() => ExtendedInfo, { nullable: true, description: 'Metadata for the Album (via External Service)' }),
    __metadata("design:type", ExtendedInfo)
], AlbumBase.prototype, "info", void 0);
AlbumBase = __decorate([
    ResultType({ description: 'Album' })
], AlbumBase);
export { AlbumBase };
let Album = class Album extends AlbumBase {
};
__decorate([
    ObjectField(() => [TrackBase], { nullable: true, description: 'List of Tracks' }),
    __metadata("design:type", Array)
], Album.prototype, "tracks", void 0);
__decorate([
    ObjectField(() => ArtistBase, { nullable: true, description: 'Album Artist' }),
    __metadata("design:type", ArtistBase)
], Album.prototype, "artist", void 0);
Album = __decorate([
    ResultType({ description: 'Album with tracks' })
], Album);
export { Album };
let AlbumPage = class AlbumPage extends Page {
};
__decorate([
    ObjectField(() => Album, { description: 'List of Albums' }),
    __metadata("design:type", Array)
], AlbumPage.prototype, "items", void 0);
AlbumPage = __decorate([
    ResultType({ description: 'Album Page' })
], AlbumPage);
export { AlbumPage };
let AlbumIndexEntry = class AlbumIndexEntry {
};
__decorate([
    ObjectField({ description: 'ID', isID: true }),
    __metadata("design:type", String)
], AlbumIndexEntry.prototype, "id", void 0);
__decorate([
    ObjectField({ description: 'Name', example: 'Awesome' }),
    __metadata("design:type", String)
], AlbumIndexEntry.prototype, "name", void 0);
__decorate([
    ObjectField({ description: 'Artist', example: 'Primus' }),
    __metadata("design:type", String)
], AlbumIndexEntry.prototype, "artist", void 0);
__decorate([
    ObjectField({ description: 'Artist Id', isID: true }),
    __metadata("design:type", String)
], AlbumIndexEntry.prototype, "artistID", void 0);
__decorate([
    ObjectField({ description: 'Track Count', min: 0, example: 5 }),
    __metadata("design:type", Number)
], AlbumIndexEntry.prototype, "trackCount", void 0);
AlbumIndexEntry = __decorate([
    ResultType({ description: 'Album Index Entry' })
], AlbumIndexEntry);
export { AlbumIndexEntry };
let AlbumIndexGroup = class AlbumIndexGroup {
};
__decorate([
    ObjectField({ description: 'Index Group Name', example: 'P' }),
    __metadata("design:type", String)
], AlbumIndexGroup.prototype, "name", void 0);
__decorate([
    ObjectField(() => [AlbumIndexEntry]),
    __metadata("design:type", Array)
], AlbumIndexGroup.prototype, "items", void 0);
AlbumIndexGroup = __decorate([
    ResultType({ description: 'Album Index Group' })
], AlbumIndexGroup);
export { AlbumIndexGroup };
let AlbumIndex = class AlbumIndex {
};
__decorate([
    ObjectField({ description: 'Last Change Timestamp' }),
    __metadata("design:type", Number)
], AlbumIndex.prototype, "lastModified", void 0);
__decorate([
    ObjectField(() => [AlbumIndexGroup], { description: 'Album Index Groups' }),
    __metadata("design:type", Array)
], AlbumIndex.prototype, "groups", void 0);
AlbumIndex = __decorate([
    ResultType({ description: 'Album Index' })
], AlbumIndex);
export { AlbumIndex };
//# sourceMappingURL=album.model.js.map