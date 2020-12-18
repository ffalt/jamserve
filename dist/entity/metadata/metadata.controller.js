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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetaDataController = void 0;
const rest_1 = require("../../modules/rest");
const enums_1 = require("../../types/enums");
const metadata_model_1 = require("./metadata.model");
const metadata_args_1 = require("./metadata.args");
const consts_1 = require("../../types/consts");
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
    rest_1.Get('/lastfm/lookup', () => metadata_model_1.MetaDataResult, { description: 'Lookup LastFM data', summary: 'Lookup LastFM' }),
    __param(0, rest_1.QueryParams()),
    __param(1, rest_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [metadata_args_1.LastFMLookupArgs, Object]),
    __metadata("design:returntype", Promise)
], MetaDataController.prototype, "lastfmLookup", null);
__decorate([
    rest_1.Get('/lyricsovh/search', () => metadata_model_1.MetaDataResult, { description: 'Search Lyrics.ovh data', summary: 'Search Lyrics' }),
    __param(0, rest_1.QueryParams()),
    __param(1, rest_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [metadata_args_1.LyricsOVHSearchArgs, Object]),
    __metadata("design:returntype", Promise)
], MetaDataController.prototype, "lyricsovhSearch", null);
__decorate([
    rest_1.Get('/acoustid/lookup', () => metadata_model_1.MetaDataResult, { description: 'Lookup AcoustId data', summary: 'Lookup AcoustId' }),
    __param(0, rest_1.QueryParams()),
    __param(1, rest_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [metadata_args_1.AcoustidLookupArgs, Object]),
    __metadata("design:returntype", Promise)
], MetaDataController.prototype, "acoustidLookup", null);
__decorate([
    rest_1.Get('/musicbrainz/lookup', () => metadata_model_1.MetaDataResult, { description: 'Lookup MusicBrainz data', summary: 'Lookup MusicBrainz' }),
    __param(0, rest_1.QueryParams()),
    __param(1, rest_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [metadata_args_1.MusicBrainzLookupArgs, Object]),
    __metadata("design:returntype", Promise)
], MetaDataController.prototype, "musicbrainzLookup", null);
__decorate([
    rest_1.Get('/musicbrainz/search', () => metadata_model_1.MetaDataResult, { description: 'Search MusicBrainz data', summary: 'Search MusicBrainz' }),
    __param(0, rest_1.QueryParams()),
    __param(1, rest_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [metadata_args_1.MusicBrainzSearchArgs, Object]),
    __metadata("design:returntype", Promise)
], MetaDataController.prototype, "musicbrainzSearch", null);
__decorate([
    rest_1.Get('/acousticbrainz/lookup', () => metadata_model_1.MetaDataResult, { description: 'Lookup AcousticBrainz data', summary: 'Lookup AcousticBrainz' }),
    __param(0, rest_1.QueryParams()),
    __param(1, rest_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [metadata_args_1.AcousticBrainzLookupArgs, Object]),
    __metadata("design:returntype", Promise)
], MetaDataController.prototype, "acousticbrainzLookup", null);
__decorate([
    rest_1.Get('/coverartarchive/lookup', () => metadata_model_1.MetaDataResult, { description: 'Lookup CoverArtArchive data', summary: 'Lookup CoverArtArchive' }),
    __param(0, rest_1.QueryParams()),
    __param(1, rest_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [metadata_args_1.CoverArtArchiveLookupArgs, Object]),
    __metadata("design:returntype", Promise)
], MetaDataController.prototype, "coverartarchiveLookup", null);
__decorate([
    rest_1.Get('/coverartarchive/image', {
        binary: consts_1.ApiImageTypes,
        description: 'Get CoverArtArchive image', summary: 'Request CoverArtArchive Image'
    }),
    __param(0, rest_1.QueryParams()),
    __param(1, rest_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [metadata_args_1.CoverArtArchiveImageArgs, Object]),
    __metadata("design:returntype", Promise)
], MetaDataController.prototype, "coverartarchiveImage", null);
__decorate([
    rest_1.Get('/wikipedia/summary', () => metadata_model_1.MetaDataResult, { description: 'Search Wikipedia Summary data', summary: 'Search Wikipedia' }),
    __param(0, rest_1.QueryParams()),
    __param(1, rest_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [metadata_args_1.WikipediaSummaryArgs, Object]),
    __metadata("design:returntype", Promise)
], MetaDataController.prototype, "wikipediaSummarySearch", null);
__decorate([
    rest_1.Get('/wikidata/summary', () => metadata_model_1.MetaDataResult, { description: 'Search WikiData summary data', summary: 'Search Wikidata' }),
    __param(0, rest_1.QueryParams()),
    __param(1, rest_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [metadata_args_1.WikidataSummaryArgs, Object]),
    __metadata("design:returntype", Promise)
], MetaDataController.prototype, "wikidataSummarySearch", null);
__decorate([
    rest_1.Get('/wikidata/lookup', () => metadata_model_1.MetaDataResult, { description: 'Lookup WikiData summary data', summary: 'Lookup WikiData' }),
    __param(0, rest_1.QueryParams()),
    __param(1, rest_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [metadata_args_1.WikidataLookupArgs, Object]),
    __metadata("design:returntype", Promise)
], MetaDataController.prototype, "wikidataLookup", null);
MetaDataController = __decorate([
    rest_1.Controller('/metadata', { tags: ['Meta Data'], roles: [enums_1.UserRole.stream] })
], MetaDataController);
exports.MetaDataController = MetaDataController;
//# sourceMappingURL=metadata.controller.js.map