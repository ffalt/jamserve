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
exports.WikidataLookupArgs = exports.WikidataSummaryArgs = exports.WikipediaSummaryArgs = exports.CoverArtArchiveImageArgs = exports.CoverArtArchiveLookupArgs = exports.AcousticBrainzLookupArgs = exports.MusicBrainzSearchArgs = exports.MusicBrainzLookupArgs = exports.AcoustidLookupArgs = exports.LyricsOVHSearchArgs = exports.LastFMLookupArgs = void 0;
const enums_1 = require("../../types/enums");
const decorators_1 = require("../../modules/rest/decorators");
const example_consts_1 = require("../../modules/engine/rest/example.consts");
let LastFMLookupArgs = class LastFMLookupArgs {
};
__decorate([
    decorators_1.ObjField({ description: 'MusicBrainz ID', example: example_consts_1.examples.mbReleaseID }),
    __metadata("design:type", String)
], LastFMLookupArgs.prototype, "mbID", void 0);
__decorate([
    decorators_1.ObjField(() => enums_1.LastFMLookupType, { description: 'lookup by lastfm type', example: enums_1.LastFMLookupType.album }),
    __metadata("design:type", String)
], LastFMLookupArgs.prototype, "type", void 0);
LastFMLookupArgs = __decorate([
    decorators_1.ObjParamsType()
], LastFMLookupArgs);
exports.LastFMLookupArgs = LastFMLookupArgs;
let LyricsOVHSearchArgs = class LyricsOVHSearchArgs {
};
__decorate([
    decorators_1.ObjField({ description: 'Song Title', example: 'Jerry Was a Race Car Driver' }),
    __metadata("design:type", String)
], LyricsOVHSearchArgs.prototype, "title", void 0);
__decorate([
    decorators_1.ObjField({ description: 'Song Artist', example: 'Primus' }),
    __metadata("design:type", String)
], LyricsOVHSearchArgs.prototype, "artist", void 0);
LyricsOVHSearchArgs = __decorate([
    decorators_1.ObjParamsType()
], LyricsOVHSearchArgs);
exports.LyricsOVHSearchArgs = LyricsOVHSearchArgs;
let AcoustidLookupArgs = class AcoustidLookupArgs {
};
__decorate([
    decorators_1.ObjField({ description: 'Track ID', example: example_consts_1.examples.mbTrackID }),
    __metadata("design:type", String)
], AcoustidLookupArgs.prototype, "trackID", void 0);
__decorate([
    decorators_1.ObjField({ nullable: true, description: 'Lookup Includes (comma-separated AcoustId includes)', defaultValue: 'recordings,releases,releasegroups,tracks,compress,usermeta,sources' }),
    __metadata("design:type", String)
], AcoustidLookupArgs.prototype, "inc", void 0);
AcoustidLookupArgs = __decorate([
    decorators_1.ObjParamsType()
], AcoustidLookupArgs);
exports.AcoustidLookupArgs = AcoustidLookupArgs;
let MusicBrainzLookupArgs = class MusicBrainzLookupArgs {
};
__decorate([
    decorators_1.ObjField({ description: 'MusicBrainz ID', example: example_consts_1.examples.mbReleaseID }),
    __metadata("design:type", String)
], MusicBrainzLookupArgs.prototype, "mbID", void 0);
__decorate([
    decorators_1.ObjField(() => enums_1.MusicBrainzLookupType, { description: 'MusicBrainz Lookup Type', example: enums_1.MusicBrainzLookupType.release }),
    __metadata("design:type", String)
], MusicBrainzLookupArgs.prototype, "type", void 0);
__decorate([
    decorators_1.ObjField({ nullable: true, description: 'Lookup Includes (comma-separated MusicBrainz includes https://musicbrainz.org/doc/Development/XML_Web_Service/Version_2#Lookups )' }),
    __metadata("design:type", String)
], MusicBrainzLookupArgs.prototype, "inc", void 0);
MusicBrainzLookupArgs = __decorate([
    decorators_1.ObjParamsType()
], MusicBrainzLookupArgs);
exports.MusicBrainzLookupArgs = MusicBrainzLookupArgs;
let MusicBrainzSearchArgs = class MusicBrainzSearchArgs {
};
__decorate([
    decorators_1.ObjField(() => enums_1.MusicBrainzSearchType, { description: 'MusicBrainz Search Type', example: enums_1.MusicBrainzSearchType.artist }),
    __metadata("design:type", String)
], MusicBrainzSearchArgs.prototype, "type", void 0);
__decorate([
    decorators_1.ObjField({ nullable: true, description: 'Search by Recording Name' }),
    __metadata("design:type", String)
], MusicBrainzSearchArgs.prototype, "recording", void 0);
__decorate([
    decorators_1.ObjField({ nullable: true, description: 'Search by Releasegroup Name' }),
    __metadata("design:type", String)
], MusicBrainzSearchArgs.prototype, "releasegroup", void 0);
__decorate([
    decorators_1.ObjField({ nullable: true, description: 'Search by Release Name' }),
    __metadata("design:type", String)
], MusicBrainzSearchArgs.prototype, "release", void 0);
__decorate([
    decorators_1.ObjField({ nullable: true, description: 'Search by Artist Name' }),
    __metadata("design:type", String)
], MusicBrainzSearchArgs.prototype, "artist", void 0);
__decorate([
    decorators_1.ObjField({ nullable: true, description: 'Search by Number of Release Tracks', min: 0 }),
    __metadata("design:type", Number)
], MusicBrainzSearchArgs.prototype, "tracks", void 0);
MusicBrainzSearchArgs = __decorate([
    decorators_1.ObjParamsType()
], MusicBrainzSearchArgs);
exports.MusicBrainzSearchArgs = MusicBrainzSearchArgs;
let AcousticBrainzLookupArgs = class AcousticBrainzLookupArgs {
};
__decorate([
    decorators_1.ObjField({ description: 'MusicBrainz ID', example: example_consts_1.examples.mbReleaseID }),
    __metadata("design:type", String)
], AcousticBrainzLookupArgs.prototype, "mbID", void 0);
__decorate([
    decorators_1.ObjField({ nullable: true, description: 'Page parameter if more than one acousticbrainz info is available', min: 0 }),
    __metadata("design:type", Number)
], AcousticBrainzLookupArgs.prototype, "nr", void 0);
AcousticBrainzLookupArgs = __decorate([
    decorators_1.ObjParamsType()
], AcousticBrainzLookupArgs);
exports.AcousticBrainzLookupArgs = AcousticBrainzLookupArgs;
let CoverArtArchiveLookupArgs = class CoverArtArchiveLookupArgs {
};
__decorate([
    decorators_1.ObjField({ description: 'MusicBrainz ID', example: example_consts_1.examples.mbReleaseID }),
    __metadata("design:type", String)
], CoverArtArchiveLookupArgs.prototype, "mbID", void 0);
__decorate([
    decorators_1.ObjField(() => enums_1.CoverArtArchiveLookupType, { description: 'Lookup by CoverArtArchive MusicBrainz Type', example: enums_1.CoverArtArchiveLookupType.release }),
    __metadata("design:type", String)
], CoverArtArchiveLookupArgs.prototype, "type", void 0);
CoverArtArchiveLookupArgs = __decorate([
    decorators_1.ObjParamsType()
], CoverArtArchiveLookupArgs);
exports.CoverArtArchiveLookupArgs = CoverArtArchiveLookupArgs;
let CoverArtArchiveImageArgs = class CoverArtArchiveImageArgs {
};
__decorate([
    decorators_1.ObjField({ description: 'Coverart URL' }),
    __metadata("design:type", String)
], CoverArtArchiveImageArgs.prototype, "url", void 0);
CoverArtArchiveImageArgs = __decorate([
    decorators_1.ObjParamsType()
], CoverArtArchiveImageArgs);
exports.CoverArtArchiveImageArgs = CoverArtArchiveImageArgs;
let WikipediaSummaryArgs = class WikipediaSummaryArgs {
};
__decorate([
    decorators_1.ObjField({ description: 'MusicBrainz ID', example: 'Primus' }),
    __metadata("design:type", String)
], WikipediaSummaryArgs.prototype, "title", void 0);
__decorate([
    decorators_1.ObjField({ nullable: true, description: 'Wikipedia Language', example: 'en', defaultValue: 'en' }),
    __metadata("design:type", String)
], WikipediaSummaryArgs.prototype, "lang", void 0);
WikipediaSummaryArgs = __decorate([
    decorators_1.ObjParamsType()
], WikipediaSummaryArgs);
exports.WikipediaSummaryArgs = WikipediaSummaryArgs;
let WikidataSummaryArgs = class WikidataSummaryArgs {
};
__decorate([
    decorators_1.ObjField({ description: 'WikiData ID' }),
    __metadata("design:type", String)
], WikidataSummaryArgs.prototype, "wikiDataID", void 0);
__decorate([
    decorators_1.ObjField({ nullable: true, description: 'Wikipedia Language', example: 'en', defaultValue: 'en' }),
    __metadata("design:type", String)
], WikidataSummaryArgs.prototype, "lang", void 0);
WikidataSummaryArgs = __decorate([
    decorators_1.ObjParamsType()
], WikidataSummaryArgs);
exports.WikidataSummaryArgs = WikidataSummaryArgs;
let WikidataLookupArgs = class WikidataLookupArgs {
};
__decorate([
    decorators_1.ObjField({ description: 'WikiData ID' }),
    __metadata("design:type", String)
], WikidataLookupArgs.prototype, "wikiDataID", void 0);
WikidataLookupArgs = __decorate([
    decorators_1.ObjParamsType()
], WikidataLookupArgs);
exports.WikidataLookupArgs = WikidataLookupArgs;
//# sourceMappingURL=metadata.args.js.map