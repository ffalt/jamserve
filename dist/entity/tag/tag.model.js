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
exports.MediaBase = exports.MediaTag = exports.MediaInfo = exports.MediaIDTagRaw = exports.MediaTagRaw = void 0;
const decorators_1 = require("../../modules/rest/decorators");
const base_model_1 = require("../base/base.model");
const example_consts_1 = require("../../modules/engine/rest/example.consts");
const enums_1 = require("../../types/enums");
let MediaTagRaw = class MediaTagRaw {
};
__decorate([
    decorators_1.ObjField({ nullable: true, description: 'Tag Version' }),
    __metadata("design:type", Number)
], MediaTagRaw.prototype, "version", void 0);
__decorate([
    decorators_1.ObjField(() => Object, { nullable: true, description: 'Tag Frames' }),
    __metadata("design:type", Object)
], MediaTagRaw.prototype, "frames", void 0);
MediaTagRaw = __decorate([
    decorators_1.ResultType({ description: 'Media Raw Tag' })
], MediaTagRaw);
exports.MediaTagRaw = MediaTagRaw;
let MediaIDTagRaw = class MediaIDTagRaw extends MediaTagRaw {
};
__decorate([
    decorators_1.ObjField({ description: 'Media File ID (Track/Episode)', isID: true }),
    __metadata("design:type", String)
], MediaIDTagRaw.prototype, "id", void 0);
MediaIDTagRaw = __decorate([
    decorators_1.ResultType({ description: 'Media Raw Tag' })
], MediaIDTagRaw);
exports.MediaIDTagRaw = MediaIDTagRaw;
let MediaInfo = class MediaInfo {
};
__decorate([
    decorators_1.ObjField({ description: 'Bit Rate', example: 320000 }),
    __metadata("design:type", Number)
], MediaInfo.prototype, "bitRate", void 0);
__decorate([
    decorators_1.ObjField({ nullable: true, description: 'Media Format', example: 'flac' }),
    __metadata("design:type", String)
], MediaInfo.prototype, "format", void 0);
__decorate([
    decorators_1.ObjField({ nullable: true, description: 'Media Channels', example: 2 }),
    __metadata("design:type", Number)
], MediaInfo.prototype, "channels", void 0);
__decorate([
    decorators_1.ObjField({ nullable: true, description: 'Sample Rate (Hz)', example: 44100 }),
    __metadata("design:type", Number)
], MediaInfo.prototype, "sampleRate", void 0);
__decorate([
    decorators_1.ObjField({ nullable: true, description: 'File Size', example: 31321516 }),
    __metadata("design:type", Number)
], MediaInfo.prototype, "size", void 0);
MediaInfo = __decorate([
    decorators_1.ResultType({ description: 'Media Audio Info' })
], MediaInfo);
exports.MediaInfo = MediaInfo;
let MediaTag = class MediaTag {
};
__decorate([
    decorators_1.ObjField({ nullable: true, description: 'Title', example: 'Goodbye Sober Day' }),
    __metadata("design:type", String)
], MediaTag.prototype, "title", void 0);
__decorate([
    decorators_1.ObjField({ nullable: true, description: 'Album Name', example: 'California' }),
    __metadata("design:type", String)
], MediaTag.prototype, "album", void 0);
__decorate([
    decorators_1.ObjField({ nullable: true, description: 'Artist Name', example: 'Mr. Bungle' }),
    __metadata("design:type", String)
], MediaTag.prototype, "artist", void 0);
__decorate([
    decorators_1.ObjField(() => [String], { nullable: true, description: 'Genres', example: ['Experimental Rock'] }),
    __metadata("design:type", Array)
], MediaTag.prototype, "genres", void 0);
__decorate([
    decorators_1.ObjField({ nullable: true, description: 'Year', example: 1999 }),
    __metadata("design:type", Number)
], MediaTag.prototype, "year", void 0);
__decorate([
    decorators_1.ObjField({ nullable: true, description: 'Track Nr', example: 10 }),
    __metadata("design:type", Number)
], MediaTag.prototype, "trackNr", void 0);
__decorate([
    decorators_1.ObjField({ nullable: true, description: 'Disc Nr', example: 1 }),
    __metadata("design:type", Number)
], MediaTag.prototype, "disc", void 0);
__decorate([
    decorators_1.ObjField({ nullable: true, description: 'Total Nr. of Disc', example: 1 }),
    __metadata("design:type", Number)
], MediaTag.prototype, "discTotal", void 0);
__decorate([
    decorators_1.ObjField({ nullable: true, description: 'MusicBrainz Track Id', example: example_consts_1.examples.mbTrackID }),
    __metadata("design:type", String)
], MediaTag.prototype, "mbTrackID", void 0);
__decorate([
    decorators_1.ObjField({ nullable: true, description: 'MusicBrainz Recording Id', example: example_consts_1.examples.mbRecordingID }),
    __metadata("design:type", String)
], MediaTag.prototype, "mbRecordingID", void 0);
__decorate([
    decorators_1.ObjField({ nullable: true, description: 'MusicBrainz Release Track Id', example: example_consts_1.examples.mbRecordingTrackID }),
    __metadata("design:type", String)
], MediaTag.prototype, "mbReleaseTrackID", void 0);
__decorate([
    decorators_1.ObjField({ nullable: true, description: 'MusicBrainz Release Group Id', example: example_consts_1.examples.mbReleaseGroupID }),
    __metadata("design:type", String)
], MediaTag.prototype, "mbReleaseGroupID", void 0);
__decorate([
    decorators_1.ObjField({ nullable: true, description: 'MusicBrainz Release Id', example: example_consts_1.examples.mbReleaseID }),
    __metadata("design:type", String)
], MediaTag.prototype, "mbReleaseID", void 0);
__decorate([
    decorators_1.ObjField({ nullable: true, description: 'MusicBrainz Artist Id', example: example_consts_1.examples.mbArtistID }),
    __metadata("design:type", String)
], MediaTag.prototype, "mbArtistID", void 0);
__decorate([
    decorators_1.ObjField({ nullable: true, description: 'MusicBrainz Album Artist Id', example: example_consts_1.examples.mbArtistID }),
    __metadata("design:type", String)
], MediaTag.prototype, "mbAlbumArtistID", void 0);
MediaTag = __decorate([
    decorators_1.ResultType({ description: 'Media Tag Data' })
], MediaTag);
exports.MediaTag = MediaTag;
let MediaBase = class MediaBase extends base_model_1.Base {
};
__decorate([
    decorators_1.ObjField(() => enums_1.JamObjectType, { description: 'Media Base Object Type', example: enums_1.JamObjectType.track }),
    __metadata("design:type", String)
], MediaBase.prototype, "objType", void 0);
__decorate([
    decorators_1.ObjField({ description: 'Duration of Track', min: 0, example: 12345 }),
    __metadata("design:type", Number)
], MediaBase.prototype, "duration", void 0);
__decorate([
    decorators_1.ObjField(() => MediaTag, { nullable: true, description: 'Tag Meta Information' }),
    __metadata("design:type", MediaTag)
], MediaBase.prototype, "tag", void 0);
__decorate([
    decorators_1.ObjField(() => MediaTagRaw, { nullable: true, description: 'Tag Raw Frames' }),
    __metadata("design:type", MediaTagRaw)
], MediaBase.prototype, "tagRaw", void 0);
__decorate([
    decorators_1.ObjField(() => MediaInfo, { nullable: true, description: 'Media Information' }),
    __metadata("design:type", MediaInfo)
], MediaBase.prototype, "media", void 0);
__decorate([
    decorators_1.ObjField({ description: 'Artist Id', nullable: true, isID: true }),
    __metadata("design:type", String)
], MediaBase.prototype, "artistID", void 0);
__decorate([
    decorators_1.ObjField({ description: 'Album Artist Id', nullable: true, isID: true }),
    __metadata("design:type", String)
], MediaBase.prototype, "albumArtistID", void 0);
__decorate([
    decorators_1.ObjField({ description: 'Album Id', nullable: true, isID: true }),
    __metadata("design:type", String)
], MediaBase.prototype, "albumID", void 0);
__decorate([
    decorators_1.ObjField({ description: 'Series Id', nullable: true, isID: true }),
    __metadata("design:type", String)
], MediaBase.prototype, "seriesID", void 0);
MediaBase = __decorate([
    decorators_1.ResultType({ description: 'Media Base' })
], MediaBase);
exports.MediaBase = MediaBase;
//# sourceMappingURL=tag.model.js.map