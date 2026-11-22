var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { MediaBase } from '../tag/tag.model.js';
import { TrackHealthHint } from '../health/health.model.js';
import { Page } from '../base/base.model.js';
import { ResultType } from '../../modules/rest/decorators/result-type.js';
import { ObjectField } from '../../modules/rest/decorators/object-field.js';
let TrackBase = class TrackBase extends MediaBase {
};
__decorate([
    ObjectField({ description: 'Parent Folder Id', isID: true }),
    __metadata("design:type", String)
], TrackBase.prototype, "parentID", void 0);
TrackBase = __decorate([
    ResultType({ description: 'Track Base' })
], TrackBase);
export { TrackBase };
let Track = class Track extends TrackBase {
};
Track = __decorate([
    ResultType({ description: 'Track' })
], Track);
export { Track };
let TrackPage = class TrackPage extends Page {
};
__decorate([
    ObjectField(() => Track, { description: 'List of Tracks' }),
    __metadata("design:type", Array)
], TrackPage.prototype, "items", void 0);
TrackPage = __decorate([
    ResultType({ description: 'Tracks Page' })
], TrackPage);
export { TrackPage };
let TrackHealth = class TrackHealth {
};
__decorate([
    ObjectField(() => TrackBase, { description: 'Track' }),
    __metadata("design:type", TrackBase)
], TrackHealth.prototype, "track", void 0);
__decorate([
    ObjectField(() => [TrackHealthHint], { description: 'List of Health Hints' }),
    __metadata("design:type", Array)
], TrackHealth.prototype, "health", void 0);
TrackHealth = __decorate([
    ResultType({ description: 'Track Health' })
], TrackHealth);
export { TrackHealth };
let TrackLyricsLine = class TrackLyricsLine {
};
__decorate([
    ObjectField({ description: 'Start of the Line in Milliseconds', example: 100 }),
    __metadata("design:type", Number)
], TrackLyricsLine.prototype, "timestamp", void 0);
__decorate([
    ObjectField({ description: 'Text of the Line', example: 'I got a letter from the government' }),
    __metadata("design:type", String)
], TrackLyricsLine.prototype, "text", void 0);
TrackLyricsLine = __decorate([
    ResultType({ description: 'Track Lyrics Line (parsed from Synced Lyrics)' })
], TrackLyricsLine);
export { TrackLyricsLine };
let TrackLyrics = class TrackLyrics {
};
__decorate([
    ObjectField({
        nullable: true,
        description: 'Lyrics',
        example: 'I got a letter from the government\nThe other day\nI opened and read it\nIt said they were suckers\n They wanted me for their army or whatever\n Picture me given’ a damn, I said never.'
    }),
    __metadata("design:type", String)
], TrackLyrics.prototype, "lyrics", void 0);
__decorate([
    ObjectField({
        nullable: true,
        description: 'Synced Lyrics',
        example: '[00:00.10]I got a letter from the government\n[00:02.30]The other day\n[00:04.50]I opened and read it\n[00:06.20]It said they were suckers\n[00:08.10] They wanted me for their army or whatever\n[00:10.40] Picture me given’ a damn, I said never.'
    }),
    __metadata("design:type", String)
], TrackLyrics.prototype, "syncedLyrics", void 0);
__decorate([
    ObjectField(() => [TrackLyricsLine], { nullable: true, description: 'Parsed Synced Lyrics' }),
    __metadata("design:type", Array)
], TrackLyrics.prototype, "syncedLines", void 0);
__decorate([
    ObjectField({ nullable: true, description: 'Language of the the lyrics' }),
    __metadata("design:type", String)
], TrackLyrics.prototype, "language", void 0);
__decorate([
    ObjectField({ nullable: true, description: 'Audio Tag, Lyrics File or External Service' }),
    __metadata("design:type", String)
], TrackLyrics.prototype, "source", void 0);
TrackLyrics = __decorate([
    ResultType({ description: 'Track Lyrics (via External Service, Lyrics File or Audio Tag)' })
], TrackLyrics);
export { TrackLyrics };
let TrackLyricsSidecar = class TrackLyricsSidecar {
};
__decorate([
    ObjectField({ description: 'File Name of the Lyrics Sidecar', example: 'Artist - Song.lrc' }),
    __metadata("design:type", String)
], TrackLyricsSidecar.prototype, "name", void 0);
__decorate([
    ObjectField({ description: 'The Sidecar holds synced lyrics', example: true }),
    __metadata("design:type", Boolean)
], TrackLyricsSidecar.prototype, "synced", void 0);
__decorate([
    ObjectField({ nullable: true, description: 'Origin of the Lyrics, taken from the by tag of the file', example: 'https://lrclib.net/api/get/12345' }),
    __metadata("design:type", String)
], TrackLyricsSidecar.prototype, "source", void 0);
__decorate([
    ObjectField({ description: 'The Sidecar was written by Jam', example: true }),
    __metadata("design:type", Boolean)
], TrackLyricsSidecar.prototype, "writtenByJam", void 0);
TrackLyricsSidecar = __decorate([
    ResultType({ description: 'Lyrics Sidecar File of a Track' })
], TrackLyricsSidecar);
export { TrackLyricsSidecar };
let TrackLyricsSidecarList = class TrackLyricsSidecarList {
};
__decorate([
    ObjectField(() => [TrackLyricsSidecar], { description: 'List of Lyrics Sidecar Files found for the Track' }),
    __metadata("design:type", Array)
], TrackLyricsSidecarList.prototype, "entries", void 0);
TrackLyricsSidecarList = __decorate([
    ResultType({ description: 'Track Lyrics Sidecar List' })
], TrackLyricsSidecarList);
export { TrackLyricsSidecarList };
let TrackLyricsList = class TrackLyricsList {
};
__decorate([
    ObjectField(() => [TrackLyrics], { description: 'List of Lyrics found for the Track' }),
    __metadata("design:type", Array)
], TrackLyricsList.prototype, "entries", void 0);
TrackLyricsList = __decorate([
    ResultType({ description: 'Track Lyrics List' })
], TrackLyricsList);
export { TrackLyricsList };
//# sourceMappingURL=track.model.js.map