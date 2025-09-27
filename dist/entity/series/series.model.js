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
import { AlbumBase } from '../album/album.model.js';
import { ExtendedInfo } from '../metadata/metadata.model.js';
import { ResultType } from '../../modules/rest/decorators/result-type.js';
import { ObjectField } from '../../modules/rest/decorators/object-field.js';
let SeriesBase = class SeriesBase extends Base {
};
__decorate([
    ObjectField({ description: 'Series Artist Name', example: 'Lemony Snicket' }),
    __metadata("design:type", String)
], SeriesBase.prototype, "artist", void 0);
__decorate([
    ObjectField({ description: 'Series Artist Id', isID: true }),
    __metadata("design:type", String)
], SeriesBase.prototype, "artistID", void 0);
__decorate([
    ObjectField({ nullable: true, description: 'Album Count', min: 0, example: 5 }),
    __metadata("design:type", Number)
], SeriesBase.prototype, "albumCount", void 0);
__decorate([
    ObjectField({ nullable: true, description: 'Track Count', min: 0, example: 55 }),
    __metadata("design:type", Number)
], SeriesBase.prototype, "trackCount", void 0);
__decorate([
    ObjectField(() => [AlbumType], { description: 'Album Types', example: [AlbumType.series] }),
    __metadata("design:type", Array)
], SeriesBase.prototype, "albumTypes", void 0);
__decorate([
    ObjectField(() => [String], { nullable: true, description: 'Track Ids', isID: true }),
    __metadata("design:type", Array)
], SeriesBase.prototype, "trackIDs", void 0);
__decorate([
    ObjectField(() => [String], { nullable: true, description: 'Album Ids', isID: true }),
    __metadata("design:type", Array)
], SeriesBase.prototype, "albumIDs", void 0);
__decorate([
    ObjectField(() => ExtendedInfo, { nullable: true, description: 'Metadata for the Series (via External Service)' }),
    __metadata("design:type", ExtendedInfo)
], SeriesBase.prototype, "info", void 0);
SeriesBase = __decorate([
    ResultType({ description: 'Series' })
], SeriesBase);
export { SeriesBase };
let Series = class Series extends SeriesBase {
};
__decorate([
    ObjectField(() => TrackBase, { nullable: true, description: 'List of Tracks' }),
    __metadata("design:type", Array)
], Series.prototype, "tracks", void 0);
__decorate([
    ObjectField(() => AlbumBase, { nullable: true, description: 'List of Albums' }),
    __metadata("design:type", Array)
], Series.prototype, "albums", void 0);
Series = __decorate([
    ResultType({ description: 'Series with Albums & Tracks' })
], Series);
export { Series };
let SeriesPage = class SeriesPage extends Page {
};
__decorate([
    ObjectField(() => Series, { description: 'List of Series' }),
    __metadata("design:type", Array)
], SeriesPage.prototype, "items", void 0);
SeriesPage = __decorate([
    ResultType({ description: 'Series Page' })
], SeriesPage);
export { SeriesPage };
let SeriesIndexEntry = class SeriesIndexEntry {
};
__decorate([
    ObjectField({ description: 'ID', isID: true }),
    __metadata("design:type", String)
], SeriesIndexEntry.prototype, "id", void 0);
__decorate([
    ObjectField({ description: 'Name', example: 'A Series of Unfortunate Events' }),
    __metadata("design:type", String)
], SeriesIndexEntry.prototype, "name", void 0);
__decorate([
    ObjectField({ description: 'Album Count', min: 0, example: 5 }),
    __metadata("design:type", Number)
], SeriesIndexEntry.prototype, "albumCount", void 0);
__decorate([
    ObjectField({ description: 'Track Count', min: 0, example: 55 }),
    __metadata("design:type", Number)
], SeriesIndexEntry.prototype, "trackCount", void 0);
SeriesIndexEntry = __decorate([
    ResultType({ description: 'Series Index Entry' })
], SeriesIndexEntry);
export { SeriesIndexEntry };
let SeriesIndexGroup = class SeriesIndexGroup {
};
__decorate([
    ObjectField({ description: 'Series Group Name', example: 'A' }),
    __metadata("design:type", String)
], SeriesIndexGroup.prototype, "name", void 0);
__decorate([
    ObjectField(() => [SeriesIndexEntry]),
    __metadata("design:type", Array)
], SeriesIndexGroup.prototype, "items", void 0);
SeriesIndexGroup = __decorate([
    ResultType({ description: 'Series Index Group' })
], SeriesIndexGroup);
export { SeriesIndexGroup };
let SeriesIndex = class SeriesIndex {
};
__decorate([
    ObjectField({ description: 'Last Change Timestamp' }),
    __metadata("design:type", Number)
], SeriesIndex.prototype, "lastModified", void 0);
__decorate([
    ObjectField(() => [SeriesIndexGroup], { description: 'Series Index Groups' }),
    __metadata("design:type", Array)
], SeriesIndex.prototype, "groups", void 0);
SeriesIndex = __decorate([
    ResultType({ description: 'Series Index' })
], SeriesIndex);
export { SeriesIndex };
//# sourceMappingURL=series.model.js.map