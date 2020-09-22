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
exports.AlbumIndex = exports.AlbumIndexGroup = exports.AlbumIndexEntry = exports.AlbumPage = exports.Album = exports.AlbumBase = void 0;
const base_model_1 = require("../base/base.model");
const enums_1 = require("../../types/enums");
const track_model_1 = require("../track/track.model");
const metadata_model_1 = require("../metadata/metadata.model");
const decorators_1 = require("../../modules/rest/decorators");
const example_consts_1 = require("../../modules/engine/rest/example.consts");
const artist_model_1 = require("../artist/artist.model");
const genre_model_1 = require("../genre/genre.model");
let AlbumBase = class AlbumBase extends base_model_1.Base {
};
__decorate([
    decorators_1.ObjField(() => enums_1.AlbumType, { description: 'Album Type', example: enums_1.AlbumType.compilation }),
    __metadata("design:type", String)
], AlbumBase.prototype, "albumType", void 0);
__decorate([
    decorators_1.ObjField({ description: 'Album Play Duration', example: 12345 }),
    __metadata("design:type", Number)
], AlbumBase.prototype, "duration", void 0);
__decorate([
    decorators_1.ObjField({ description: 'Album Artist Id', isID: true }),
    __metadata("design:type", String)
], AlbumBase.prototype, "artistID", void 0);
__decorate([
    decorators_1.ObjField({ description: 'Album Artist', example: 'Pink Floyd' }),
    __metadata("design:type", String)
], AlbumBase.prototype, "artistName", void 0);
__decorate([
    decorators_1.ObjField({ nullable: true, description: 'Number of Tracks', min: 0, example: 5 }),
    __metadata("design:type", Number)
], AlbumBase.prototype, "trackCount", void 0);
__decorate([
    decorators_1.ObjField(() => [String], { nullable: true, description: 'List of Track Ids', isID: true }),
    __metadata("design:type", Array)
], AlbumBase.prototype, "trackIDs", void 0);
__decorate([
    decorators_1.ObjField(() => [genre_model_1.GenreBase], { nullable: true, description: 'Genres' }),
    __metadata("design:type", Array)
], AlbumBase.prototype, "genres", void 0);
__decorate([
    decorators_1.ObjField({ nullable: true, description: 'Album Release Year', example: example_consts_1.examples.year }),
    __metadata("design:type", Number)
], AlbumBase.prototype, "year", void 0);
__decorate([
    decorators_1.ObjField({ nullable: true, description: 'MusicBrainz Artist Id', example: example_consts_1.examples.mbArtistID }),
    __metadata("design:type", String)
], AlbumBase.prototype, "mbArtistID", void 0);
__decorate([
    decorators_1.ObjField({ nullable: true, description: 'MusicBrainz Release Id', example: example_consts_1.examples.mbReleaseID }),
    __metadata("design:type", String)
], AlbumBase.prototype, "mbReleaseID", void 0);
__decorate([
    decorators_1.ObjField({ nullable: true, description: 'Series Name', example: 'A Series of Unfortunate Events' }),
    __metadata("design:type", String)
], AlbumBase.prototype, "series", void 0);
__decorate([
    decorators_1.ObjField({ nullable: true, description: 'Series Id', isID: true }),
    __metadata("design:type", String)
], AlbumBase.prototype, "seriesID", void 0);
__decorate([
    decorators_1.ObjField({ nullable: true, description: 'Series Nr', example: '001' }),
    __metadata("design:type", String)
], AlbumBase.prototype, "seriesNr", void 0);
__decorate([
    decorators_1.ObjField(() => metadata_model_1.ExtendedInfo, { nullable: true, description: 'Metadata for the Album (via External Service)' }),
    __metadata("design:type", metadata_model_1.ExtendedInfo)
], AlbumBase.prototype, "info", void 0);
AlbumBase = __decorate([
    decorators_1.ResultType({ description: 'Album' })
], AlbumBase);
exports.AlbumBase = AlbumBase;
let Album = class Album extends AlbumBase {
};
__decorate([
    decorators_1.ObjField(() => [track_model_1.TrackBase], { nullable: true, description: 'List of Tracks' }),
    __metadata("design:type", Array)
], Album.prototype, "tracks", void 0);
__decorate([
    decorators_1.ObjField(() => artist_model_1.ArtistBase, { nullable: true, description: 'Album Artist' }),
    __metadata("design:type", artist_model_1.ArtistBase)
], Album.prototype, "artist", void 0);
Album = __decorate([
    decorators_1.ResultType({ description: 'Album with tracks' })
], Album);
exports.Album = Album;
let AlbumPage = class AlbumPage extends base_model_1.Page {
};
__decorate([
    decorators_1.ObjField(() => Album, { description: 'List of Albums' }),
    __metadata("design:type", Array)
], AlbumPage.prototype, "items", void 0);
AlbumPage = __decorate([
    decorators_1.ResultType({ description: 'Album Page' })
], AlbumPage);
exports.AlbumPage = AlbumPage;
let AlbumIndexEntry = class AlbumIndexEntry {
};
__decorate([
    decorators_1.ObjField({ description: 'ID', isID: true }),
    __metadata("design:type", String)
], AlbumIndexEntry.prototype, "id", void 0);
__decorate([
    decorators_1.ObjField({ description: 'Name', example: 'Awesome' }),
    __metadata("design:type", String)
], AlbumIndexEntry.prototype, "name", void 0);
__decorate([
    decorators_1.ObjField({ description: 'Artist', example: 'Primus' }),
    __metadata("design:type", String)
], AlbumIndexEntry.prototype, "artist", void 0);
__decorate([
    decorators_1.ObjField({ description: 'Artist Id', isID: true }),
    __metadata("design:type", String)
], AlbumIndexEntry.prototype, "artistID", void 0);
__decorate([
    decorators_1.ObjField({ description: 'Track Count', min: 0, example: 5 }),
    __metadata("design:type", Number)
], AlbumIndexEntry.prototype, "trackCount", void 0);
AlbumIndexEntry = __decorate([
    decorators_1.ResultType({ description: 'Album Index Entry' })
], AlbumIndexEntry);
exports.AlbumIndexEntry = AlbumIndexEntry;
let AlbumIndexGroup = class AlbumIndexGroup {
};
__decorate([
    decorators_1.ObjField({ description: 'Index Group Name', example: 'P' }),
    __metadata("design:type", String)
], AlbumIndexGroup.prototype, "name", void 0);
__decorate([
    decorators_1.ObjField(() => [AlbumIndexEntry]),
    __metadata("design:type", Array)
], AlbumIndexGroup.prototype, "items", void 0);
AlbumIndexGroup = __decorate([
    decorators_1.ResultType({ description: 'Album Index Group' })
], AlbumIndexGroup);
exports.AlbumIndexGroup = AlbumIndexGroup;
let AlbumIndex = class AlbumIndex {
};
__decorate([
    decorators_1.ObjField({ description: 'Last Change Timestamp' }),
    __metadata("design:type", Number)
], AlbumIndex.prototype, "lastModified", void 0);
__decorate([
    decorators_1.ObjField(() => [AlbumIndexGroup], { description: 'Album Index Groups' }),
    __metadata("design:type", Array)
], AlbumIndex.prototype, "groups", void 0);
AlbumIndex = __decorate([
    decorators_1.ResultType({ description: 'Album Index' })
], AlbumIndex);
exports.AlbumIndex = AlbumIndex;
//# sourceMappingURL=album.model.js.map