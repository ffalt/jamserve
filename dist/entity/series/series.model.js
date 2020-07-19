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
exports.SeriesIndex = exports.SeriesIndexGroup = exports.SeriesIndexEntry = exports.SeriesPage = exports.Series = exports.SeriesBase = void 0;
const base_model_1 = require("../base/base.model");
const enums_1 = require("../../types/enums");
const track_model_1 = require("../track/track.model");
const album_model_1 = require("../album/album.model");
const metadata_model_1 = require("../metadata/metadata.model");
const decorators_1 = require("../../modules/rest/decorators");
let SeriesBase = class SeriesBase extends base_model_1.Base {
};
__decorate([
    decorators_1.ObjField({ description: 'Series Artist Name', example: 'Lemony Snicket' }),
    __metadata("design:type", String)
], SeriesBase.prototype, "artist", void 0);
__decorate([
    decorators_1.ObjField({ description: 'Series Artist Id', isID: true }),
    __metadata("design:type", String)
], SeriesBase.prototype, "artistID", void 0);
__decorate([
    decorators_1.ObjField({ nullable: true, description: 'Album Count', min: 0, example: 5 }),
    __metadata("design:type", Number)
], SeriesBase.prototype, "albumCount", void 0);
__decorate([
    decorators_1.ObjField({ nullable: true, description: 'Track Count', min: 0, example: 55 }),
    __metadata("design:type", Number)
], SeriesBase.prototype, "trackCount", void 0);
__decorate([
    decorators_1.ObjField(() => [enums_1.AlbumType], { description: 'Album Types', example: [enums_1.AlbumType.series] }),
    __metadata("design:type", Array)
], SeriesBase.prototype, "albumTypes", void 0);
__decorate([
    decorators_1.ObjField(() => [String], { nullable: true, description: 'Track Ids', isID: true }),
    __metadata("design:type", Array)
], SeriesBase.prototype, "trackIDs", void 0);
__decorate([
    decorators_1.ObjField(() => [String], { nullable: true, description: 'Album Ids', isID: true }),
    __metadata("design:type", Array)
], SeriesBase.prototype, "albumIDs", void 0);
__decorate([
    decorators_1.ObjField(() => metadata_model_1.ExtendedInfo, { nullable: true, description: 'Metadata for the Series (via External Service)' }),
    __metadata("design:type", metadata_model_1.ExtendedInfo)
], SeriesBase.prototype, "info", void 0);
SeriesBase = __decorate([
    decorators_1.ResultType({ description: 'Series' })
], SeriesBase);
exports.SeriesBase = SeriesBase;
let Series = class Series extends SeriesBase {
};
__decorate([
    decorators_1.ObjField(() => track_model_1.TrackBase, { nullable: true, description: 'List of Tracks' }),
    __metadata("design:type", Array)
], Series.prototype, "tracks", void 0);
__decorate([
    decorators_1.ObjField(() => album_model_1.AlbumBase, { nullable: true, description: 'List of Albums' }),
    __metadata("design:type", Array)
], Series.prototype, "albums", void 0);
Series = __decorate([
    decorators_1.ResultType({ description: 'Series with Albums & Tracks' })
], Series);
exports.Series = Series;
let SeriesPage = class SeriesPage extends base_model_1.Page {
};
__decorate([
    decorators_1.ObjField(() => Series, { description: 'List of Series' }),
    __metadata("design:type", Array)
], SeriesPage.prototype, "items", void 0);
SeriesPage = __decorate([
    decorators_1.ResultType({ description: 'Series Page' })
], SeriesPage);
exports.SeriesPage = SeriesPage;
let SeriesIndexEntry = class SeriesIndexEntry {
};
__decorate([
    decorators_1.ObjField({ description: 'ID', isID: true }),
    __metadata("design:type", String)
], SeriesIndexEntry.prototype, "id", void 0);
__decorate([
    decorators_1.ObjField({ description: 'Name', example: 'A Series of Unfortunate Events' }),
    __metadata("design:type", String)
], SeriesIndexEntry.prototype, "name", void 0);
__decorate([
    decorators_1.ObjField({ description: 'Album Count', min: 0, example: 5 }),
    __metadata("design:type", Number)
], SeriesIndexEntry.prototype, "albumCount", void 0);
__decorate([
    decorators_1.ObjField({ description: 'Track Count', min: 0, example: 55 }),
    __metadata("design:type", Number)
], SeriesIndexEntry.prototype, "trackCount", void 0);
SeriesIndexEntry = __decorate([
    decorators_1.ResultType({ description: 'Series Index Entry' })
], SeriesIndexEntry);
exports.SeriesIndexEntry = SeriesIndexEntry;
let SeriesIndexGroup = class SeriesIndexGroup {
};
__decorate([
    decorators_1.ObjField({ description: 'Series Group Name', example: 'A' }),
    __metadata("design:type", String)
], SeriesIndexGroup.prototype, "name", void 0);
__decorate([
    decorators_1.ObjField(() => [SeriesIndexEntry]),
    __metadata("design:type", Array)
], SeriesIndexGroup.prototype, "items", void 0);
SeriesIndexGroup = __decorate([
    decorators_1.ResultType({ description: 'Series Index Group' })
], SeriesIndexGroup);
exports.SeriesIndexGroup = SeriesIndexGroup;
let SeriesIndex = class SeriesIndex {
};
__decorate([
    decorators_1.ObjField({ description: 'Last Change Timestamp' }),
    __metadata("design:type", Number)
], SeriesIndex.prototype, "lastModified", void 0);
__decorate([
    decorators_1.ObjField(() => [SeriesIndexGroup], { description: 'Series Index Groups' }),
    __metadata("design:type", Array)
], SeriesIndex.prototype, "groups", void 0);
SeriesIndex = __decorate([
    decorators_1.ResultType({ description: 'Series Index' })
], SeriesIndex);
exports.SeriesIndex = SeriesIndex;
//# sourceMappingURL=series.model.js.map