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
import { Controller, Ctx, Get, QueryParams } from '../../modules/rest/index.js';
import { UserRole } from '../../types/enums.js';
import { MetaDataResult } from './metadata.model.js';
import { AcousticBrainzLookupArgs, AcoustidLookupArgs, CoverArtArchiveImageArgs, CoverArtArchiveLookupArgs, LastFMLookupArgs, LyricsOVHSearchArgs, MusicBrainzLookupArgs, MusicBrainzSearchArgs, WikidataLookupArgs, WikidataSummaryArgs, WikipediaSummaryArgs } from './metadata.args.js';
import { ApiImageTypes } from '../../types/consts.js';
let MetaDataController = class MetaDataController {
    async lastfmLookup(args, { orm, engine }) {
        return { data: await engine.metadata.lastFMLookup(orm, args.type, args.mbID) };
    }
    async lyricsovhSearch(args, { orm, engine }) {
        return { data: await engine.metadata.lyrics(orm, args.artist, args.title) };
    }
    async acoustidLookup(args, { orm, engine }) {
        const track = await orm.Track.oneOrFailByID(args.trackID);
        return { data: await engine.metadata.acoustidLookupTrack(track, args.inc) };
    }
    async musicbrainzLookup(args, { orm, engine }) {
        return { data: await engine.metadata.musicbrainzLookup(orm, args.type, args.mbID, args.inc) };
    }
    async musicbrainzSearch(args, { orm, engine }) {
        return { data: await engine.metadata.musicbrainzSearch(orm, args.type, { ...args, type: undefined }) };
    }
    async acousticbrainzLookup(args, { orm, engine }) {
        return { data: await engine.metadata.acousticbrainzLookup(orm, args.mbID, args.nr) };
    }
    async coverartarchiveLookup(args, { orm, engine }) {
        return { data: await engine.metadata.coverartarchiveLookup(orm, args.type, args.mbID) };
    }
    async coverartarchiveImage(imageArgs, { engine }) {
        return engine.metadata.coverartarchiveImage(imageArgs.url);
    }
    async wikipediaSummarySearch(args, { orm, engine }) {
        return { data: await engine.metadata.wikipediaSummary(orm, args.title, args.lang) };
    }
    async wikidataSummarySearch(args, { orm, engine }) {
        return { data: await engine.metadata.wikidataSummary(orm, args.wikiDataID, args.lang) };
    }
    async wikidataLookup(args, { orm, engine }) {
        return { data: await engine.metadata.wikidataLookup(orm, args.wikiDataID) };
    }
};
__decorate([
    Get('/lastfm/lookup', () => MetaDataResult, { description: 'Lookup LastFM data', summary: 'Lookup LastFM' }),
    __param(0, QueryParams()),
    __param(1, Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [LastFMLookupArgs, Object]),
    __metadata("design:returntype", Promise)
], MetaDataController.prototype, "lastfmLookup", null);
__decorate([
    Get('/lyricsovh/search', () => MetaDataResult, { description: 'Search Lyrics.ovh data', summary: 'Search Lyrics' }),
    __param(0, QueryParams()),
    __param(1, Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [LyricsOVHSearchArgs, Object]),
    __metadata("design:returntype", Promise)
], MetaDataController.prototype, "lyricsovhSearch", null);
__decorate([
    Get('/acoustid/lookup', () => MetaDataResult, { description: 'Lookup AcoustId data', summary: 'Lookup AcoustId' }),
    __param(0, QueryParams()),
    __param(1, Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [AcoustidLookupArgs, Object]),
    __metadata("design:returntype", Promise)
], MetaDataController.prototype, "acoustidLookup", null);
__decorate([
    Get('/musicbrainz/lookup', () => MetaDataResult, { description: 'Lookup MusicBrainz data', summary: 'Lookup MusicBrainz' }),
    __param(0, QueryParams()),
    __param(1, Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [MusicBrainzLookupArgs, Object]),
    __metadata("design:returntype", Promise)
], MetaDataController.prototype, "musicbrainzLookup", null);
__decorate([
    Get('/musicbrainz/search', () => MetaDataResult, { description: 'Search MusicBrainz data', summary: 'Search MusicBrainz' }),
    __param(0, QueryParams()),
    __param(1, Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [MusicBrainzSearchArgs, Object]),
    __metadata("design:returntype", Promise)
], MetaDataController.prototype, "musicbrainzSearch", null);
__decorate([
    Get('/acousticbrainz/lookup', () => MetaDataResult, { description: 'Lookup AcousticBrainz data', summary: 'Lookup AcousticBrainz' }),
    __param(0, QueryParams()),
    __param(1, Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [AcousticBrainzLookupArgs, Object]),
    __metadata("design:returntype", Promise)
], MetaDataController.prototype, "acousticbrainzLookup", null);
__decorate([
    Get('/coverartarchive/lookup', () => MetaDataResult, { description: 'Lookup CoverArtArchive data', summary: 'Lookup CoverArtArchive' }),
    __param(0, QueryParams()),
    __param(1, Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CoverArtArchiveLookupArgs, Object]),
    __metadata("design:returntype", Promise)
], MetaDataController.prototype, "coverartarchiveLookup", null);
__decorate([
    Get('/coverartarchive/image', {
        binary: ApiImageTypes,
        description: 'Get CoverArtArchive image', summary: 'Request CoverArtArchive Image'
    }),
    __param(0, QueryParams()),
    __param(1, Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CoverArtArchiveImageArgs, Object]),
    __metadata("design:returntype", Promise)
], MetaDataController.prototype, "coverartarchiveImage", null);
__decorate([
    Get('/wikipedia/summary', () => MetaDataResult, { description: 'Search Wikipedia Summary data', summary: 'Search Wikipedia' }),
    __param(0, QueryParams()),
    __param(1, Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [WikipediaSummaryArgs, Object]),
    __metadata("design:returntype", Promise)
], MetaDataController.prototype, "wikipediaSummarySearch", null);
__decorate([
    Get('/wikidata/summary', () => MetaDataResult, { description: 'Search WikiData summary data', summary: 'Search Wikidata' }),
    __param(0, QueryParams()),
    __param(1, Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [WikidataSummaryArgs, Object]),
    __metadata("design:returntype", Promise)
], MetaDataController.prototype, "wikidataSummarySearch", null);
__decorate([
    Get('/wikidata/lookup', () => MetaDataResult, { description: 'Lookup WikiData summary data', summary: 'Lookup WikiData' }),
    __param(0, QueryParams()),
    __param(1, Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [WikidataLookupArgs, Object]),
    __metadata("design:returntype", Promise)
], MetaDataController.prototype, "wikidataLookup", null);
MetaDataController = __decorate([
    Controller('/metadata', { tags: ['Meta Data'], roles: [UserRole.stream] })
], MetaDataController);
export { MetaDataController };
//# sourceMappingURL=metadata.controller.js.map