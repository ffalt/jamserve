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
import { ObjectParametersType } from '../../modules/rest/decorators/object-parameters-type.js';
import { ObjectField } from '../../modules/rest/decorators/object-field.js';
let LastFMLookupParameters = class LastFMLookupParameters {
};
__decorate([
    ObjectField({ description: 'MusicBrainz ID', example: examples.mbReleaseID }),
    __metadata("design:type", String)
], LastFMLookupParameters.prototype, "mbID", void 0);
__decorate([
    ObjectField(() => LastFMLookupType, { description: 'lookup by lastfm type', example: LastFMLookupType.album }),
    __metadata("design:type", String)
], LastFMLookupParameters.prototype, "type", void 0);
LastFMLookupParameters = __decorate([
    ObjectParametersType()
], LastFMLookupParameters);
export { LastFMLookupParameters };
let LyricsOVHSearchParameters = class LyricsOVHSearchParameters {
};
__decorate([
    ObjectField({ description: 'Song Title', example: 'Jerry Was a Race Car Driver' }),
    __metadata("design:type", String)
], LyricsOVHSearchParameters.prototype, "title", void 0);
__decorate([
    ObjectField({ description: 'Song Artist', example: 'Primus' }),
    __metadata("design:type", String)
], LyricsOVHSearchParameters.prototype, "artist", void 0);
LyricsOVHSearchParameters = __decorate([
    ObjectParametersType()
], LyricsOVHSearchParameters);
export { LyricsOVHSearchParameters };
let LrclibSearchParameters = class LrclibSearchParameters {
};
__decorate([
    ObjectField({ description: 'Song Title', example: 'Jerry Was a Race Car Driver' }),
    __metadata("design:type", String)
], LrclibSearchParameters.prototype, "title", void 0);
__decorate([
    ObjectField({ description: 'Song Artist', example: 'Primus' }),
    __metadata("design:type", String)
], LrclibSearchParameters.prototype, "artist", void 0);
__decorate([
    ObjectField({ description: 'Song Album', example: 'Sailing the Seas of Cheese' }),
    __metadata("design:type", String)
], LrclibSearchParameters.prototype, "album", void 0);
__decorate([
    ObjectField({ description: 'Song Duration in seconds', example: 191 }),
    __metadata("design:type", Number)
], LrclibSearchParameters.prototype, "duration", void 0);
LrclibSearchParameters = __decorate([
    ObjectParametersType()
], LrclibSearchParameters);
export { LrclibSearchParameters };
let AcoustidLookupParameters = class AcoustidLookupParameters {
};
__decorate([
    ObjectField({ description: 'Track ID', example: examples.mbTrackID }),
    __metadata("design:type", String)
], AcoustidLookupParameters.prototype, "trackID", void 0);
__decorate([
    ObjectField({ nullable: true, description: 'Lookup Includes (comma-separated AcoustId includes)', defaultValue: 'recordings,releases,releasegroups,tracks,compress,usermeta,sources' }),
    __metadata("design:type", String)
], AcoustidLookupParameters.prototype, "inc", void 0);
AcoustidLookupParameters = __decorate([
    ObjectParametersType()
], AcoustidLookupParameters);
export { AcoustidLookupParameters };
let MusicBrainzLookupParameters = class MusicBrainzLookupParameters {
};
__decorate([
    ObjectField({ description: 'MusicBrainz ID', example: examples.mbReleaseID }),
    __metadata("design:type", String)
], MusicBrainzLookupParameters.prototype, "mbID", void 0);
__decorate([
    ObjectField(() => MusicBrainzLookupType, { description: 'MusicBrainz Lookup Type', example: MusicBrainzLookupType.release }),
    __metadata("design:type", String)
], MusicBrainzLookupParameters.prototype, "type", void 0);
__decorate([
    ObjectField({ nullable: true, description: 'Lookup Includes (comma-separated MusicBrainz includes https://musicbrainz.org/doc/Development/XML_Web_Service/Version_2#Lookups )' }),
    __metadata("design:type", String)
], MusicBrainzLookupParameters.prototype, "inc", void 0);
MusicBrainzLookupParameters = __decorate([
    ObjectParametersType()
], MusicBrainzLookupParameters);
export { MusicBrainzLookupParameters };
let MusicBrainzSearchParameters = class MusicBrainzSearchParameters {
};
__decorate([
    ObjectField(() => MusicBrainzSearchType, { description: 'MusicBrainz Search Type', example: MusicBrainzSearchType.artist }),
    __metadata("design:type", String)
], MusicBrainzSearchParameters.prototype, "type", void 0);
__decorate([
    ObjectField({ nullable: true, description: 'Search by Recording Name' }),
    __metadata("design:type", String)
], MusicBrainzSearchParameters.prototype, "recording", void 0);
__decorate([
    ObjectField({ nullable: true, description: 'Search by Releasegroup Name' }),
    __metadata("design:type", String)
], MusicBrainzSearchParameters.prototype, "releasegroup", void 0);
__decorate([
    ObjectField({ nullable: true, description: 'Search by Release Name' }),
    __metadata("design:type", String)
], MusicBrainzSearchParameters.prototype, "release", void 0);
__decorate([
    ObjectField({ nullable: true, description: 'Search by Artist Name' }),
    __metadata("design:type", String)
], MusicBrainzSearchParameters.prototype, "artist", void 0);
__decorate([
    ObjectField({ nullable: true, description: 'Search by Number of Release Tracks', min: 0 }),
    __metadata("design:type", Number)
], MusicBrainzSearchParameters.prototype, "tracks", void 0);
MusicBrainzSearchParameters = __decorate([
    ObjectParametersType()
], MusicBrainzSearchParameters);
export { MusicBrainzSearchParameters };
let AcousticBrainzLookupParameters = class AcousticBrainzLookupParameters {
};
__decorate([
    ObjectField({ description: 'MusicBrainz ID', example: examples.mbReleaseID }),
    __metadata("design:type", String)
], AcousticBrainzLookupParameters.prototype, "mbID", void 0);
__decorate([
    ObjectField({ nullable: true, description: 'Page parameter if more than one acousticbrainz info is available', min: 0 }),
    __metadata("design:type", Number)
], AcousticBrainzLookupParameters.prototype, "nr", void 0);
AcousticBrainzLookupParameters = __decorate([
    ObjectParametersType()
], AcousticBrainzLookupParameters);
export { AcousticBrainzLookupParameters };
let CoverArtArchiveLookupParameters = class CoverArtArchiveLookupParameters {
};
__decorate([
    ObjectField({ description: 'MusicBrainz ID', example: examples.mbReleaseID }),
    __metadata("design:type", String)
], CoverArtArchiveLookupParameters.prototype, "mbID", void 0);
__decorate([
    ObjectField(() => CoverArtArchiveLookupType, { description: 'Lookup by CoverArtArchive MusicBrainz Type', example: CoverArtArchiveLookupType.release }),
    __metadata("design:type", String)
], CoverArtArchiveLookupParameters.prototype, "type", void 0);
CoverArtArchiveLookupParameters = __decorate([
    ObjectParametersType()
], CoverArtArchiveLookupParameters);
export { CoverArtArchiveLookupParameters };
let CoverArtArchiveImageParameters = class CoverArtArchiveImageParameters {
};
__decorate([
    ObjectField({ description: 'Coverart URL' }),
    __metadata("design:type", String)
], CoverArtArchiveImageParameters.prototype, "url", void 0);
CoverArtArchiveImageParameters = __decorate([
    ObjectParametersType()
], CoverArtArchiveImageParameters);
export { CoverArtArchiveImageParameters };
let WikipediaSummaryParameters = class WikipediaSummaryParameters {
};
__decorate([
    ObjectField({ description: 'MusicBrainz ID', example: 'Primus' }),
    __metadata("design:type", String)
], WikipediaSummaryParameters.prototype, "title", void 0);
__decorate([
    ObjectField({ nullable: true, description: 'Wikipedia Language', example: 'en', defaultValue: 'en' }),
    __metadata("design:type", String)
], WikipediaSummaryParameters.prototype, "lang", void 0);
WikipediaSummaryParameters = __decorate([
    ObjectParametersType()
], WikipediaSummaryParameters);
export { WikipediaSummaryParameters };
let WikidataSummaryParameters = class WikidataSummaryParameters {
};
__decorate([
    ObjectField({ description: 'WikiData ID' }),
    __metadata("design:type", String)
], WikidataSummaryParameters.prototype, "wikiDataID", void 0);
__decorate([
    ObjectField({ nullable: true, description: 'Wikipedia Language', example: 'en', defaultValue: 'en' }),
    __metadata("design:type", String)
], WikidataSummaryParameters.prototype, "lang", void 0);
WikidataSummaryParameters = __decorate([
    ObjectParametersType()
], WikidataSummaryParameters);
export { WikidataSummaryParameters };
let WikidataLookupParameters = class WikidataLookupParameters {
};
__decorate([
    ObjectField({ description: 'WikiData ID' }),
    __metadata("design:type", String)
], WikidataLookupParameters.prototype, "wikiDataID", void 0);
WikidataLookupParameters = __decorate([
    ObjectParametersType()
], WikidataLookupParameters);
export { WikidataLookupParameters };
//# sourceMappingURL=metadata.parameters.js.map