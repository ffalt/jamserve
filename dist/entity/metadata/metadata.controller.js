var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { UserRole } from '../../types/enums.js';
import { MetaDataResult, MetaDataTrackLyricsResult } from './metadata.model.js';
import { AcousticBrainzLookupParameters, AcoustidLookupParameters, CoverArtArchiveImageParameters, CoverArtArchiveLookupParameters, LastFMLookupParameters, LyricsOVHSearchParameters, LrclibSearchParameters, MusicBrainzLookupParameters, MusicBrainzSearchParameters, WikidataLookupParameters, WikidataSummaryParameters, WikipediaSummaryParameters } from './metadata.parameters.js';
import { ApiImageTypes } from '../../types/consts.js';
import { Controller } from '../../modules/rest/decorators/controller.js';
import { Get } from '../../modules/rest/decorators/get.js';
import { QueryParameters } from '../../modules/rest/decorators/query-parameters.js';
import { RestContext } from '../../modules/rest/decorators/rest-context.js';
let MetaDataController = class MetaDataController {
    async lastfmLookup(parameters, { orm, engine }) {
        return { data: await engine.metadata.lastFMLookup(orm, parameters.type, parameters.mbID) };
    }
    async lyricsovhSearch(parameters, { orm, engine }) {
        return { data: await engine.metadata.lyricsOVH(orm, parameters.artist, parameters.title) };
    }
    async lcrlibSearch(parameters, { orm, engine }) {
        return { data: await engine.metadata.lrclibGet(orm, parameters.artist, parameters.title, parameters.album, parameters.duration) };
    }
    async acoustidLookup({ trackID, inc }, { orm, engine }) {
        const track = await orm.Track.oneOrFailByID(trackID);
        return { data: await engine.metadata.acoustidLookupTrack(track, inc) };
    }
    async musicbrainzLookup(parameters, { orm, engine }) {
        return { data: await engine.metadata.musicbrainzLookup(orm, parameters.type, parameters.mbID, parameters.inc) };
    }
    async musicbrainzSearch(parameters, { orm, engine }) {
        return { data: await engine.metadata.musicbrainzSearch(orm, parameters.type, { ...parameters, type: undefined }) };
    }
    async acousticbrainzLookup({ mbID, nr }, { orm, engine }) {
        return { data: await engine.metadata.acousticbrainzLookup(orm, mbID, nr) };
    }
    async coverartarchiveLookup({ type, mbID }, { orm, engine }) {
        return { data: await engine.metadata.coverartarchiveLookup(orm, type, mbID) };
    }
    async coverartarchiveImage({ url }, { engine }) {
        return engine.metadata.coverartarchiveImage(url);
    }
    async wikipediaSummarySearch({ title, lang }, { orm, engine }) {
        return { data: await engine.metadata.wikipediaSummary(orm, title, lang) };
    }
    async wikidataSummarySearch({ wikiDataID, lang }, { orm, engine }) {
        return { data: await engine.metadata.wikidataSummary(orm, wikiDataID, lang) };
    }
    async wikidataLookup({ wikiDataID }, { orm, engine }) {
        return { data: await engine.metadata.wikidataLookup(orm, wikiDataID) };
    }
};
__decorate([
    Get('/lastfm/lookup', () => MetaDataResult, { description: 'Lookup LastFM data', summary: 'Lookup LastFM' }),
    __param(0, QueryParameters()),
    __param(1, RestContext()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [LastFMLookupParameters, Object]),
    __metadata("design:returntype", Promise)
], MetaDataController.prototype, "lastfmLookup", null);
__decorate([
    Get('/lyricsovh/search', () => MetaDataTrackLyricsResult, { description: 'Search Lyrics.ovh data', summary: 'Search Lyrics on lyrics.ovh' }),
    __param(0, QueryParameters()),
    __param(1, RestContext()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [LyricsOVHSearchParameters, Object]),
    __metadata("design:returntype", Promise)
], MetaDataController.prototype, "lyricsovhSearch", null);
__decorate([
    Get('/lrclib/get', () => MetaDataResult, { description: 'Get Lrclib.net data', summary: 'Get Lyrics on lrclib.net' }),
    __param(0, QueryParameters()),
    __param(1, RestContext()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [LrclibSearchParameters, Object]),
    __metadata("design:returntype", Promise)
], MetaDataController.prototype, "lcrlibSearch", null);
__decorate([
    Get('/acoustid/lookup', () => MetaDataResult, { description: 'Lookup AcoustId data', summary: 'Lookup AcoustId' }),
    __param(0, QueryParameters()),
    __param(1, RestContext()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [AcoustidLookupParameters, Object]),
    __metadata("design:returntype", Promise)
], MetaDataController.prototype, "acoustidLookup", null);
__decorate([
    Get('/musicbrainz/lookup', () => MetaDataResult, { description: 'Lookup MusicBrainz data', summary: 'Lookup MusicBrainz' }),
    __param(0, QueryParameters()),
    __param(1, RestContext()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [MusicBrainzLookupParameters, Object]),
    __metadata("design:returntype", Promise)
], MetaDataController.prototype, "musicbrainzLookup", null);
__decorate([
    Get('/musicbrainz/search', () => MetaDataResult, { description: 'Search MusicBrainz data', summary: 'Search MusicBrainz' }),
    __param(0, QueryParameters()),
    __param(1, RestContext()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [MusicBrainzSearchParameters, Object]),
    __metadata("design:returntype", Promise)
], MetaDataController.prototype, "musicbrainzSearch", null);
__decorate([
    Get('/acousticbrainz/lookup', () => MetaDataResult, { description: 'Lookup AcousticBrainz data', summary: 'Lookup AcousticBrainz' }),
    __param(0, QueryParameters()),
    __param(1, RestContext()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [AcousticBrainzLookupParameters, Object]),
    __metadata("design:returntype", Promise)
], MetaDataController.prototype, "acousticbrainzLookup", null);
__decorate([
    Get('/coverartarchive/lookup', () => MetaDataResult, { description: 'Lookup CoverArtArchive data', summary: 'Lookup CoverArtArchive' }),
    __param(0, QueryParameters()),
    __param(1, RestContext()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CoverArtArchiveLookupParameters, Object]),
    __metadata("design:returntype", Promise)
], MetaDataController.prototype, "coverartarchiveLookup", null);
__decorate([
    Get('/coverartarchive/image', {
        binary: ApiImageTypes,
        description: 'Get CoverArtArchive image', summary: 'Request CoverArtArchive Image'
    }),
    __param(0, QueryParameters()),
    __param(1, RestContext()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CoverArtArchiveImageParameters, Object]),
    __metadata("design:returntype", Promise)
], MetaDataController.prototype, "coverartarchiveImage", null);
__decorate([
    Get('/wikipedia/summary', () => MetaDataResult, { description: 'Search Wikipedia Summary data', summary: 'Search Wikipedia' }),
    __param(0, QueryParameters()),
    __param(1, RestContext()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [WikipediaSummaryParameters, Object]),
    __metadata("design:returntype", Promise)
], MetaDataController.prototype, "wikipediaSummarySearch", null);
__decorate([
    Get('/wikidata/summary', () => MetaDataResult, { description: 'Search WikiData summary data', summary: 'Search Wikidata' }),
    __param(0, QueryParameters()),
    __param(1, RestContext()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [WikidataSummaryParameters, Object]),
    __metadata("design:returntype", Promise)
], MetaDataController.prototype, "wikidataSummarySearch", null);
__decorate([
    Get('/wikidata/lookup', () => MetaDataResult, { description: 'Lookup WikiData summary data', summary: 'Lookup WikiData' }),
    __param(0, QueryParameters()),
    __param(1, RestContext()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [WikidataLookupParameters, Object]),
    __metadata("design:returntype", Promise)
], MetaDataController.prototype, "wikidataLookup", null);
MetaDataController = __decorate([
    Controller('/metadata', { tags: ['Meta Data'], roles: [UserRole.stream] })
], MetaDataController);
export { MetaDataController };
//# sourceMappingURL=metadata.controller.js.map