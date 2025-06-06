var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { CoverArtArchiveLookupType, LastFMLookupType, MusicBrainzLookupType, MusicBrainzSearchType } from '../../types/enums.js';
import { examples } from '../../modules/engine/rest/example.consts.js';
import { ObjParamsType } from '../../modules/rest/decorators/ObjParamsType.js';
import { ObjField } from '../../modules/rest/decorators/ObjField.js';
let LastFMLookupArgs = class LastFMLookupArgs {
};
__decorate([
    ObjField({ description: 'MusicBrainz ID', example: examples.mbReleaseID }),
    __metadata("design:type", String)
], LastFMLookupArgs.prototype, "mbID", void 0);
__decorate([
    ObjField(() => LastFMLookupType, { description: 'lookup by lastfm type', example: LastFMLookupType.album }),
    __metadata("design:type", String)
], LastFMLookupArgs.prototype, "type", void 0);
LastFMLookupArgs = __decorate([
    ObjParamsType()
], LastFMLookupArgs);
export { LastFMLookupArgs };
let LyricsOVHSearchArgs = class LyricsOVHSearchArgs {
};
__decorate([
    ObjField({ description: 'Song Title', example: 'Jerry Was a Race Car Driver' }),
    __metadata("design:type", String)
], LyricsOVHSearchArgs.prototype, "title", void 0);
__decorate([
    ObjField({ description: 'Song Artist', example: 'Primus' }),
    __metadata("design:type", String)
], LyricsOVHSearchArgs.prototype, "artist", void 0);
LyricsOVHSearchArgs = __decorate([
    ObjParamsType()
], LyricsOVHSearchArgs);
export { LyricsOVHSearchArgs };
let LrclibSearchArgs = class LrclibSearchArgs {
};
__decorate([
    ObjField({ description: 'Song Title', example: 'Jerry Was a Race Car Driver' }),
    __metadata("design:type", String)
], LrclibSearchArgs.prototype, "title", void 0);
__decorate([
    ObjField({ description: 'Song Artist', example: 'Primus' }),
    __metadata("design:type", String)
], LrclibSearchArgs.prototype, "artist", void 0);
__decorate([
    ObjField({ description: 'Song Album', example: 'Sailing the Seas of Cheese' }),
    __metadata("design:type", String)
], LrclibSearchArgs.prototype, "album", void 0);
__decorate([
    ObjField({ description: 'Song Duration in seconds', example: 191 }),
    __metadata("design:type", Number)
], LrclibSearchArgs.prototype, "duration", void 0);
LrclibSearchArgs = __decorate([
    ObjParamsType()
], LrclibSearchArgs);
export { LrclibSearchArgs };
let AcoustidLookupArgs = class AcoustidLookupArgs {
};
__decorate([
    ObjField({ description: 'Track ID', example: examples.mbTrackID }),
    __metadata("design:type", String)
], AcoustidLookupArgs.prototype, "trackID", void 0);
__decorate([
    ObjField({ nullable: true, description: 'Lookup Includes (comma-separated AcoustId includes)', defaultValue: 'recordings,releases,releasegroups,tracks,compress,usermeta,sources' }),
    __metadata("design:type", String)
], AcoustidLookupArgs.prototype, "inc", void 0);
AcoustidLookupArgs = __decorate([
    ObjParamsType()
], AcoustidLookupArgs);
export { AcoustidLookupArgs };
let MusicBrainzLookupArgs = class MusicBrainzLookupArgs {
};
__decorate([
    ObjField({ description: 'MusicBrainz ID', example: examples.mbReleaseID }),
    __metadata("design:type", String)
], MusicBrainzLookupArgs.prototype, "mbID", void 0);
__decorate([
    ObjField(() => MusicBrainzLookupType, { description: 'MusicBrainz Lookup Type', example: MusicBrainzLookupType.release }),
    __metadata("design:type", String)
], MusicBrainzLookupArgs.prototype, "type", void 0);
__decorate([
    ObjField({ nullable: true, description: 'Lookup Includes (comma-separated MusicBrainz includes https://musicbrainz.org/doc/Development/XML_Web_Service/Version_2#Lookups )' }),
    __metadata("design:type", String)
], MusicBrainzLookupArgs.prototype, "inc", void 0);
MusicBrainzLookupArgs = __decorate([
    ObjParamsType()
], MusicBrainzLookupArgs);
export { MusicBrainzLookupArgs };
let MusicBrainzSearchArgs = class MusicBrainzSearchArgs {
};
__decorate([
    ObjField(() => MusicBrainzSearchType, { description: 'MusicBrainz Search Type', example: MusicBrainzSearchType.artist }),
    __metadata("design:type", String)
], MusicBrainzSearchArgs.prototype, "type", void 0);
__decorate([
    ObjField({ nullable: true, description: 'Search by Recording Name' }),
    __metadata("design:type", String)
], MusicBrainzSearchArgs.prototype, "recording", void 0);
__decorate([
    ObjField({ nullable: true, description: 'Search by Releasegroup Name' }),
    __metadata("design:type", String)
], MusicBrainzSearchArgs.prototype, "releasegroup", void 0);
__decorate([
    ObjField({ nullable: true, description: 'Search by Release Name' }),
    __metadata("design:type", String)
], MusicBrainzSearchArgs.prototype, "release", void 0);
__decorate([
    ObjField({ nullable: true, description: 'Search by Artist Name' }),
    __metadata("design:type", String)
], MusicBrainzSearchArgs.prototype, "artist", void 0);
__decorate([
    ObjField({ nullable: true, description: 'Search by Number of Release Tracks', min: 0 }),
    __metadata("design:type", Number)
], MusicBrainzSearchArgs.prototype, "tracks", void 0);
MusicBrainzSearchArgs = __decorate([
    ObjParamsType()
], MusicBrainzSearchArgs);
export { MusicBrainzSearchArgs };
let AcousticBrainzLookupArgs = class AcousticBrainzLookupArgs {
};
__decorate([
    ObjField({ description: 'MusicBrainz ID', example: examples.mbReleaseID }),
    __metadata("design:type", String)
], AcousticBrainzLookupArgs.prototype, "mbID", void 0);
__decorate([
    ObjField({ nullable: true, description: 'Page parameter if more than one acousticbrainz info is available', min: 0 }),
    __metadata("design:type", Number)
], AcousticBrainzLookupArgs.prototype, "nr", void 0);
AcousticBrainzLookupArgs = __decorate([
    ObjParamsType()
], AcousticBrainzLookupArgs);
export { AcousticBrainzLookupArgs };
let CoverArtArchiveLookupArgs = class CoverArtArchiveLookupArgs {
};
__decorate([
    ObjField({ description: 'MusicBrainz ID', example: examples.mbReleaseID }),
    __metadata("design:type", String)
], CoverArtArchiveLookupArgs.prototype, "mbID", void 0);
__decorate([
    ObjField(() => CoverArtArchiveLookupType, { description: 'Lookup by CoverArtArchive MusicBrainz Type', example: CoverArtArchiveLookupType.release }),
    __metadata("design:type", String)
], CoverArtArchiveLookupArgs.prototype, "type", void 0);
CoverArtArchiveLookupArgs = __decorate([
    ObjParamsType()
], CoverArtArchiveLookupArgs);
export { CoverArtArchiveLookupArgs };
let CoverArtArchiveImageArgs = class CoverArtArchiveImageArgs {
};
__decorate([
    ObjField({ description: 'Coverart URL' }),
    __metadata("design:type", String)
], CoverArtArchiveImageArgs.prototype, "url", void 0);
CoverArtArchiveImageArgs = __decorate([
    ObjParamsType()
], CoverArtArchiveImageArgs);
export { CoverArtArchiveImageArgs };
let WikipediaSummaryArgs = class WikipediaSummaryArgs {
};
__decorate([
    ObjField({ description: 'MusicBrainz ID', example: 'Primus' }),
    __metadata("design:type", String)
], WikipediaSummaryArgs.prototype, "title", void 0);
__decorate([
    ObjField({ nullable: true, description: 'Wikipedia Language', example: 'en', defaultValue: 'en' }),
    __metadata("design:type", String)
], WikipediaSummaryArgs.prototype, "lang", void 0);
WikipediaSummaryArgs = __decorate([
    ObjParamsType()
], WikipediaSummaryArgs);
export { WikipediaSummaryArgs };
let WikidataSummaryArgs = class WikidataSummaryArgs {
};
__decorate([
    ObjField({ description: 'WikiData ID' }),
    __metadata("design:type", String)
], WikidataSummaryArgs.prototype, "wikiDataID", void 0);
__decorate([
    ObjField({ nullable: true, description: 'Wikipedia Language', example: 'en', defaultValue: 'en' }),
    __metadata("design:type", String)
], WikidataSummaryArgs.prototype, "lang", void 0);
WikidataSummaryArgs = __decorate([
    ObjParamsType()
], WikidataSummaryArgs);
export { WikidataSummaryArgs };
let WikidataLookupArgs = class WikidataLookupArgs {
};
__decorate([
    ObjField({ description: 'WikiData ID' }),
    __metadata("design:type", String)
], WikidataLookupArgs.prototype, "wikiDataID", void 0);
WikidataLookupArgs = __decorate([
    ObjParamsType()
], WikidataLookupArgs);
export { WikidataLookupArgs };
//# sourceMappingURL=metadata.args.js.map