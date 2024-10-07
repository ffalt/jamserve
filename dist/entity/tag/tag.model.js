var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Base } from '../base/base.model.js';
import { examples } from '../../modules/engine/rest/example.consts.js';
import { JamObjectType } from '../../types/enums.js';
import { GenreBase } from '../genre/genre.model.js';
import { ObjField } from '../../modules/rest/decorators/ObjField.js';
import { ResultType } from '../../modules/rest/decorators/ResultType.js';
let MediaTagRaw = class MediaTagRaw {
};
__decorate([
    ObjField({ nullable: true, description: 'Tag Version' }),
    __metadata("design:type", Number)
], MediaTagRaw.prototype, "version", void 0);
__decorate([
    ObjField(() => Object, { nullable: true, description: 'Tag Frames' }),
    __metadata("design:type", Object)
], MediaTagRaw.prototype, "frames", void 0);
MediaTagRaw = __decorate([
    ResultType({ description: 'Media Raw Tag' })
], MediaTagRaw);
export { MediaTagRaw };
let MediaIDTagRaw = class MediaIDTagRaw extends MediaTagRaw {
};
__decorate([
    ObjField({ description: 'Media File ID (Track/Episode)', isID: true }),
    __metadata("design:type", String)
], MediaIDTagRaw.prototype, "id", void 0);
MediaIDTagRaw = __decorate([
    ResultType({ description: 'Media Raw Tag' })
], MediaIDTagRaw);
export { MediaIDTagRaw };
let MediaInfo = class MediaInfo {
};
__decorate([
    ObjField({ description: 'Bit Rate', example: 320000 }),
    __metadata("design:type", Number)
], MediaInfo.prototype, "bitRate", void 0);
__decorate([
    ObjField({ nullable: true, description: 'Media Format', example: 'flac' }),
    __metadata("design:type", String)
], MediaInfo.prototype, "format", void 0);
__decorate([
    ObjField({ nullable: true, description: 'Media Channels', example: 2 }),
    __metadata("design:type", Number)
], MediaInfo.prototype, "channels", void 0);
__decorate([
    ObjField({ nullable: true, description: 'Sample Rate (Hz)', example: 44100 }),
    __metadata("design:type", Number)
], MediaInfo.prototype, "sampleRate", void 0);
__decorate([
    ObjField({ nullable: true, description: 'Bit Depth', example: 16 }),
    __metadata("design:type", Number)
], MediaInfo.prototype, "bitDepth", void 0);
__decorate([
    ObjField({ nullable: true, description: 'File Size', example: 31321516 }),
    __metadata("design:type", Number)
], MediaInfo.prototype, "size", void 0);
MediaInfo = __decorate([
    ResultType({ description: 'Media Audio Info' })
], MediaInfo);
export { MediaInfo };
let MediaTag = class MediaTag {
};
__decorate([
    ObjField({ nullable: true, description: 'Title', example: 'Goodbye Sober Day' }),
    __metadata("design:type", String)
], MediaTag.prototype, "title", void 0);
__decorate([
    ObjField({ nullable: true, description: 'Album Name', example: 'California' }),
    __metadata("design:type", String)
], MediaTag.prototype, "album", void 0);
__decorate([
    ObjField({ nullable: true, description: 'Artist Name', example: 'Mr. Bungle' }),
    __metadata("design:type", String)
], MediaTag.prototype, "artist", void 0);
__decorate([
    ObjField(() => [String], { nullable: true, description: 'Genres', example: examples.genres }),
    __metadata("design:type", Array)
], MediaTag.prototype, "genres", void 0);
__decorate([
    ObjField({ nullable: true, description: 'Year', example: 1999 }),
    __metadata("design:type", Number)
], MediaTag.prototype, "year", void 0);
__decorate([
    ObjField({ nullable: true, description: 'Track Nr', example: 10 }),
    __metadata("design:type", Number)
], MediaTag.prototype, "trackNr", void 0);
__decorate([
    ObjField({ nullable: true, description: 'Disc Nr', example: 1 }),
    __metadata("design:type", Number)
], MediaTag.prototype, "disc", void 0);
__decorate([
    ObjField({ nullable: true, description: 'Total Nr. of Disc', example: 1 }),
    __metadata("design:type", Number)
], MediaTag.prototype, "discTotal", void 0);
__decorate([
    ObjField({ nullable: true, description: 'MusicBrainz Track Id', example: examples.mbTrackID }),
    __metadata("design:type", String)
], MediaTag.prototype, "mbTrackID", void 0);
__decorate([
    ObjField({ nullable: true, description: 'MusicBrainz Recording Id', example: examples.mbRecordingID }),
    __metadata("design:type", String)
], MediaTag.prototype, "mbRecordingID", void 0);
__decorate([
    ObjField({ nullable: true, description: 'MusicBrainz Release Track Id', example: examples.mbRecordingTrackID }),
    __metadata("design:type", String)
], MediaTag.prototype, "mbReleaseTrackID", void 0);
__decorate([
    ObjField({ nullable: true, description: 'MusicBrainz Release Group Id', example: examples.mbReleaseGroupID }),
    __metadata("design:type", String)
], MediaTag.prototype, "mbReleaseGroupID", void 0);
__decorate([
    ObjField({ nullable: true, description: 'MusicBrainz Release Id', example: examples.mbReleaseID }),
    __metadata("design:type", String)
], MediaTag.prototype, "mbReleaseID", void 0);
__decorate([
    ObjField({ nullable: true, description: 'MusicBrainz Artist Id', example: examples.mbArtistID }),
    __metadata("design:type", String)
], MediaTag.prototype, "mbArtistID", void 0);
__decorate([
    ObjField({ nullable: true, description: 'MusicBrainz Album Artist Id', example: examples.mbArtistID }),
    __metadata("design:type", String)
], MediaTag.prototype, "mbAlbumArtistID", void 0);
MediaTag = __decorate([
    ResultType({ description: 'Media Tag Data' })
], MediaTag);
export { MediaTag };
let MediaBase = class MediaBase extends Base {
};
__decorate([
    ObjField(() => JamObjectType, { description: 'Media Base Object Type', example: JamObjectType.track }),
    __metadata("design:type", String)
], MediaBase.prototype, "objType", void 0);
__decorate([
    ObjField({ description: 'Duration of Track', min: 0, example: 12345 }),
    __metadata("design:type", Number)
], MediaBase.prototype, "duration", void 0);
__decorate([
    ObjField(() => MediaTag, { nullable: true, description: 'Tag Meta Information' }),
    __metadata("design:type", MediaTag)
], MediaBase.prototype, "tag", void 0);
__decorate([
    ObjField(() => MediaTagRaw, { nullable: true, description: 'Tag Raw Frames' }),
    __metadata("design:type", MediaTagRaw)
], MediaBase.prototype, "tagRaw", void 0);
__decorate([
    ObjField(() => MediaInfo, { nullable: true, description: 'Media Information' }),
    __metadata("design:type", MediaInfo)
], MediaBase.prototype, "media", void 0);
__decorate([
    ObjField({ nullable: true, description: 'Artist Id', isID: true }),
    __metadata("design:type", String)
], MediaBase.prototype, "artistID", void 0);
__decorate([
    ObjField({ nullable: true, description: 'Album Artist Id', isID: true }),
    __metadata("design:type", String)
], MediaBase.prototype, "albumArtistID", void 0);
__decorate([
    ObjField({ nullable: true, description: 'Album Id', isID: true }),
    __metadata("design:type", String)
], MediaBase.prototype, "albumID", void 0);
__decorate([
    ObjField({ nullable: true, description: 'Series Id', isID: true }),
    __metadata("design:type", String)
], MediaBase.prototype, "seriesID", void 0);
__decorate([
    ObjField(() => [GenreBase], { nullable: true, description: 'Genres' }),
    __metadata("design:type", Array)
], MediaBase.prototype, "genres", void 0);
MediaBase = __decorate([
    ResultType({ description: 'Media Base' })
], MediaBase);
export { MediaBase };
//# sourceMappingURL=tag.model.js.map