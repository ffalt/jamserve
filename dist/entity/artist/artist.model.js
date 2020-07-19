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
exports.ArtistIndex = exports.ArtistIndexGroup = exports.ArtistIndexEntry = exports.ArtistPage = exports.Artist = exports.ArtistBase = void 0;
const base_model_1 = require("../base/base.model");
const enums_1 = require("../../types/enums");
const track_model_1 = require("../track/track.model");
const series_model_1 = require("../series/series.model");
const album_model_1 = require("../album/album.model");
const metadata_model_1 = require("../metadata/metadata.model");
const decorators_1 = require("../../modules/rest/decorators");
const example_consts_1 = require("../../modules/engine/rest/example.consts");
let ArtistBase = class ArtistBase extends base_model_1.Base {
};
__decorate([
    decorators_1.ObjField(() => [enums_1.AlbumType], { description: 'List of Album Type', example: [enums_1.AlbumType.album, enums_1.AlbumType.compilation] }),
    __metadata("design:type", Array)
], ArtistBase.prototype, "albumTypes", void 0);
__decorate([
    decorators_1.ObjField(() => [String], { nullable: true, description: 'List of Genres', example: example_consts_1.examples.genres }),
    __metadata("design:type", Array)
], ArtistBase.prototype, "genres", void 0);
__decorate([
    decorators_1.ObjField({ nullable: true, description: 'MusicBrainz Artist Id', example: example_consts_1.examples.mbArtistID }),
    __metadata("design:type", String)
], ArtistBase.prototype, "mbArtistID", void 0);
__decorate([
    decorators_1.ObjField({ nullable: true, description: 'Number of Albums', min: 0, example: 5 }),
    __metadata("design:type", Number)
], ArtistBase.prototype, "albumCount", void 0);
__decorate([
    decorators_1.ObjField(() => [String], { nullable: true, description: 'List of Album Ids', isID: true }),
    __metadata("design:type", Array)
], ArtistBase.prototype, "albumIDs", void 0);
__decorate([
    decorators_1.ObjField({ nullable: true, description: 'Number of Series', min: 0, example: 5 }),
    __metadata("design:type", Number)
], ArtistBase.prototype, "seriesCount", void 0);
__decorate([
    decorators_1.ObjField(() => [String], { nullable: true, description: 'List of Series Ids', isID: true }),
    __metadata("design:type", Array)
], ArtistBase.prototype, "seriesIDs", void 0);
__decorate([
    decorators_1.ObjField({ nullable: true, description: 'Number of Tracks', min: 0, example: 5 }),
    __metadata("design:type", Number)
], ArtistBase.prototype, "trackCount", void 0);
__decorate([
    decorators_1.ObjField(() => [String], { nullable: true, description: 'List of Track Ids', isID: true }),
    __metadata("design:type", Array)
], ArtistBase.prototype, "trackIDs", void 0);
__decorate([
    decorators_1.ObjField(() => metadata_model_1.ExtendedInfo, { nullable: true, description: 'Metadata for the Artist (via External Service)' }),
    __metadata("design:type", metadata_model_1.ExtendedInfo)
], ArtistBase.prototype, "info", void 0);
ArtistBase = __decorate([
    decorators_1.ResultType({ description: 'Artist' })
], ArtistBase);
exports.ArtistBase = ArtistBase;
let Artist = class Artist extends ArtistBase {
};
__decorate([
    decorators_1.ObjField(() => ArtistBase, { nullable: true, description: 'List of similar Artists (via External Service)' }),
    __metadata("design:type", Array)
], Artist.prototype, "similar", void 0);
__decorate([
    decorators_1.ObjField(() => series_model_1.SeriesBase, { nullable: true, description: 'List of Series' }),
    __metadata("design:type", Array)
], Artist.prototype, "series", void 0);
__decorate([
    decorators_1.ObjField(() => album_model_1.AlbumBase, { nullable: true, description: 'List of Albums' }),
    __metadata("design:type", Array)
], Artist.prototype, "albums", void 0);
__decorate([
    decorators_1.ObjField(() => track_model_1.TrackBase, { nullable: true, description: 'List of Tracks' }),
    __metadata("design:type", Array)
], Artist.prototype, "tracks", void 0);
Artist = __decorate([
    decorators_1.ResultType({ description: 'Artist with Albums,...' })
], Artist);
exports.Artist = Artist;
let ArtistPage = class ArtistPage extends base_model_1.Page {
};
__decorate([
    decorators_1.ObjField(() => Artist, { description: 'List of Artists' }),
    __metadata("design:type", Array)
], ArtistPage.prototype, "items", void 0);
ArtistPage = __decorate([
    decorators_1.ResultType({ description: 'Artist Page' })
], ArtistPage);
exports.ArtistPage = ArtistPage;
let ArtistIndexEntry = class ArtistIndexEntry {
};
__decorate([
    decorators_1.ObjField({ description: 'ID', isID: true }),
    __metadata("design:type", String)
], ArtistIndexEntry.prototype, "id", void 0);
__decorate([
    decorators_1.ObjField({ description: 'Name', example: 'Mars Volta' }),
    __metadata("design:type", String)
], ArtistIndexEntry.prototype, "name", void 0);
__decorate([
    decorators_1.ObjField({ description: 'Album Count', min: 0, example: 5 }),
    __metadata("design:type", Number)
], ArtistIndexEntry.prototype, "albumCount", void 0);
__decorate([
    decorators_1.ObjField({ description: 'Track Count', min: 0, example: 55 }),
    __metadata("design:type", Number)
], ArtistIndexEntry.prototype, "trackCount", void 0);
ArtistIndexEntry = __decorate([
    decorators_1.ResultType({ description: 'Artist Index Entry' })
], ArtistIndexEntry);
exports.ArtistIndexEntry = ArtistIndexEntry;
let ArtistIndexGroup = class ArtistIndexGroup {
};
__decorate([
    decorators_1.ObjField({ description: 'Artist Group Name', example: 'P' }),
    __metadata("design:type", String)
], ArtistIndexGroup.prototype, "name", void 0);
__decorate([
    decorators_1.ObjField(() => [ArtistIndexEntry]),
    __metadata("design:type", Array)
], ArtistIndexGroup.prototype, "items", void 0);
ArtistIndexGroup = __decorate([
    decorators_1.ResultType({ description: 'Artist Index Group' })
], ArtistIndexGroup);
exports.ArtistIndexGroup = ArtistIndexGroup;
let ArtistIndex = class ArtistIndex {
};
__decorate([
    decorators_1.ObjField({ description: 'Last Change Timestamp' }),
    __metadata("design:type", Number)
], ArtistIndex.prototype, "lastModified", void 0);
__decorate([
    decorators_1.ObjField(() => [ArtistIndexGroup], { description: 'Artist Index Groups' }),
    __metadata("design:type", Array)
], ArtistIndex.prototype, "groups", void 0);
ArtistIndex = __decorate([
    decorators_1.ResultType({ description: 'Artist Index' })
], ArtistIndex);
exports.ArtistIndex = ArtistIndex;
//# sourceMappingURL=artist.model.js.map