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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetaDataService = void 0;
const moment_1 = __importDefault(require("moment"));
const path_1 = __importDefault(require("path"));
const audio_module_1 = require("../../modules/audio/audio.module");
const logger_1 = require("../../utils/logger");
const metadata_service_extended_info_1 = require("./metadata.service.extended-info");
const metadata_service_similar_artists_1 = require("./metadata.service.similar-artists");
const metadata_service_similar_tracks_1 = require("./metadata.service.similar-tracks");
const metadata_service_top_tracks_1 = require("./metadata.service.top-tracks");
const typescript_ioc_1 = require("typescript-ioc");
const enums_1 = require("../../types/enums");
const orm_service_1 = require("../../modules/engine/services/orm.service");
const log = logger_1.logger('Metadata');
let MetaDataService = class MetaDataService {
    constructor() {
        this.extInfo = new metadata_service_extended_info_1.MetadataServiceExtendedInfo(this);
        this.similarArtists = new metadata_service_similar_artists_1.MetadataServiceSimilarArtists(this);
        this.similarTracks = new metadata_service_similar_tracks_1.MetadataServiceSimilarTracks(this);
        this.topTracks = new metadata_service_top_tracks_1.MetadataServiceTopTracks(this);
    }
    async addToStore(name, dataType, data) {
        const item = await this.orm.MetaData.create({
            name,
            dataType,
            data
        });
        await this.orm.orm.em.persistAndFlush(item);
    }
    async cleanUp() {
        const olderThan = Date.now() - moment_1.default.duration(1, 'd').asMilliseconds();
        const removed = await this.orm.MetaData.remove({ createdAt: { $lt: new Date(olderThan) } }, true);
        if (removed > 0) {
            log.info(`Removed meta data cache entries: ${removed} `);
        }
    }
    async clear() {
        await this.orm.MetaData.remove({}, true);
    }
    async searchInStore(name, dataType, generate) {
        const result = await this.orm.MetaData.findOne({ name: { $eq: name }, dataType: { $eq: dataType } });
        if (result) {
            return result.data;
        }
        const data = await generate();
        await this.addToStore(name, dataType, data);
        return data;
    }
    async musicbrainzSearch(type, query) {
        return this.searchInStore(`search-${type}${JSON.stringify(query)}`, enums_1.MetaDataType.musicbrainz, async () => {
            return this.audioModule.musicbrainz.search({ type, query });
        });
    }
    async acoustidLookupTrack(track, includes) {
        return this.audioModule.acoustid.acoustid(path_1.default.join(track.path, track.fileName), includes);
    }
    async lastFMLookup(type, mbid) {
        return this.searchInStore(`lookup-${type}${mbid}`, enums_1.MetaDataType.lastfm, async () => {
            return this.audioModule.lastFM.lookup(type, mbid);
        });
    }
    async lastFMAlbumSearch(album, artist) {
        return this.searchInStore(`search-album-${album}//${artist}`, enums_1.MetaDataType.lastfm, async () => {
            return { album: await this.audioModule.lastFM.album(album, artist) };
        });
    }
    async lastFMArtistSearch(artist) {
        return this.searchInStore(`search-artist-${artist}`, enums_1.MetaDataType.lastfm, async () => {
            return { artist: await this.audioModule.lastFM.artist(artist) };
        });
    }
    async lastFMTopTracksArtist(artist) {
        return this.searchInStore(`toptracks-artist-${artist}`, enums_1.MetaDataType.lastfm, async () => {
            return { toptracks: await this.audioModule.lastFM.topArtistSongs(artist) };
        });
    }
    async lastFMTopTracksArtistID(mbid) {
        return this.searchInStore(`toptracks-artistid-${mbid}`, enums_1.MetaDataType.lastfm, async () => {
            return { toptracks: await this.audioModule.lastFM.topArtistSongsID(mbid) };
        });
    }
    async lastFMSimilarTracks(mbid) {
        return this.searchInStore(`similar-trackid-${mbid}`, enums_1.MetaDataType.lastfm, async () => {
            return { similartracks: await this.audioModule.lastFM.similarTrackID(mbid) };
        });
    }
    async lastFMSimilarTracksSearch(name, artist) {
        return this.searchInStore(`similar-search-track-${name}//${artist}`, enums_1.MetaDataType.lastfm, async () => {
            return { album: await this.audioModule.lastFM.similarTrack(name, artist) };
        });
    }
    async acousticbrainzLookup(mbid, nr) {
        return this.searchInStore(`lookup-${mbid}${nr !== undefined ? `-${nr}` : ''}`, enums_1.MetaDataType.acousticbrainz, async () => {
            return this.audioModule.acousticbrainz.highLevel(mbid, nr);
        });
    }
    async coverartarchiveLookup(type, mbid) {
        return this.searchInStore(`lookup-${type}${mbid}`, enums_1.MetaDataType.coverartarchive, async () => {
            if (type === enums_1.CoverArtArchiveLookupType.release) {
                return this.audioModule.coverArtArchive.releaseImages(mbid);
            }
            if (type === enums_1.CoverArtArchiveLookupType.releaseGroup) {
                return this.audioModule.coverArtArchive.releaseGroupImages(mbid);
            }
            return Promise.reject(Error('Invalid CoverArtArchive Lookup Type'));
        });
    }
    async musicbrainzLookup(type, mbid, inc) {
        return this.searchInStore(`lookup-${type}${mbid}${inc ? inc : ''}`, enums_1.MetaDataType.musicbrainz, async () => {
            return this.audioModule.musicbrainz.lookup({ type, id: mbid, inc });
        });
    }
    async lyrics(artist, song) {
        return this.searchInStore(`lyrics-${artist}/${song}`, enums_1.MetaDataType.lyrics, async () => {
            let result = await this.audioModule.lyricsOVH.search(artist, song);
            const cutVariants = ['(', '/', '[', ':'];
            for (const cut of cutVariants) {
                if (!result || !result.lyrics) {
                    if (song.includes(cut)) {
                        const title = song.slice(0, song.indexOf(cut)).trim();
                        if (title.length > 0) {
                            result = await this.audioModule.lyricsOVH.search(artist, title);
                        }
                    }
                }
            }
            return result;
        });
    }
    async wikipediaSummary(title, lang) {
        lang = lang || 'en';
        return this.searchInStore(`summary-${title}/${lang}`, enums_1.MetaDataType.wikipedia, async () => {
            return { summary: await this.audioModule.wikipedia.summary(title, lang) };
        });
    }
    async wikidataLookup(id) {
        return this.searchInStore(`wikidata-entity-${id}`, enums_1.MetaDataType.wikidata, async () => {
            const entity = await this.audioModule.wikipedia.wikidata(id);
            return { id, type: enums_1.DBObjectType.metadata, dataType: enums_1.MetaDataType.wikidata, data: entity, date: Date.now() };
        });
    }
    async wikidataSummary(id, lang) {
        return this.searchInStore(`wikidata-summary-${id}`, enums_1.MetaDataType.wikidata, async () => {
            const lookup = await this.wikidataLookup(id);
            if (!lookup) {
                return {};
            }
            const obj = lookup.entity || lookup.data;
            if (!obj) {
                return {};
            }
            lang = lang || 'en';
            const site = `${lang}wiki`;
            if (obj.sitelinks) {
                const langSite = obj.sitelinks[site];
                if (!langSite) {
                    return {};
                }
                return this.wikipediaSummary(langSite.title, lang);
            }
            return {};
        });
    }
    async lyricsByTrack(track) {
        var _a, _b, _c, _d, _e, _f;
        if ((_a = track.tag) === null || _a === void 0 ? void 0 : _a.lyrics) {
            return { lyrics: track.tag.lyrics };
        }
        const song = (_b = track.tag) === null || _b === void 0 ? void 0 : _b.title;
        if (!song) {
            return {};
        }
        try {
            let result;
            if ((_c = track.tag) === null || _c === void 0 ? void 0 : _c.artist) {
                result = await this.lyrics(track.tag.artist, song);
            }
            if ((!result || !result.lyrics) && ((_d = track.tag) === null || _d === void 0 ? void 0 : _d.albumArtist) && (((_e = track.tag) === null || _e === void 0 ? void 0 : _e.artist) !== ((_f = track.tag) === null || _f === void 0 ? void 0 : _f.albumArtist))) {
                result = await this.lyrics(track.tag.albumArtist, song);
            }
            return result || {};
        }
        catch (e) {
            log.error(e);
            return {};
        }
    }
};
__decorate([
    typescript_ioc_1.Inject,
    __metadata("design:type", audio_module_1.AudioModule)
], MetaDataService.prototype, "audioModule", void 0);
__decorate([
    typescript_ioc_1.Inject,
    __metadata("design:type", orm_service_1.OrmService)
], MetaDataService.prototype, "orm", void 0);
MetaDataService = __decorate([
    typescript_ioc_1.Singleton
], MetaDataService);
exports.MetaDataService = MetaDataService;
//# sourceMappingURL=metadata.service.js.map