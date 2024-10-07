var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var MetaDataService_1;
import moment from 'moment';
import path from 'path';
import { AudioModule } from '../../modules/audio/audio.module.js';
import { logger } from '../../utils/logger.js';
import { MetadataServiceExtendedInfo } from './metadata.service.extended-info.js';
import { MetadataServiceSimilarArtists } from './metadata.service.similar-artists.js';
import { MetadataServiceSimilarTracks } from './metadata.service.similar-tracks.js';
import { MetadataServiceTopTracks } from './metadata.service.top-tracks.js';
import { Inject, InRequestScope } from 'typescript-ioc';
import { CoverArtArchiveLookupType, DBObjectType, MetaDataType } from '../../types/enums.js';
import seq from 'sequelize';
import fetch from 'node-fetch';
import { InvalidParamError } from '../../modules/deco/express/express-error.js';
const log = logger('Metadata');
let MetaDataService = MetaDataService_1 = class MetaDataService {
    constructor() {
        this.extInfo = new MetadataServiceExtendedInfo(this);
        this.similarArtists = new MetadataServiceSimilarArtists(this);
        this.similarTracks = new MetadataServiceSimilarTracks(this);
        this.topTracks = new MetadataServiceTopTracks(this);
    }
    static async addToStore(orm, name, dataType, data) {
        const item = await orm.MetaData.create({
            name,
            dataType,
            data
        });
        await orm.MetaData.persistAndFlush(item);
    }
    async cleanUp(orm) {
        const olderThan = Date.now() - moment.duration(1, 'd').asMilliseconds();
        const removed = await orm.MetaData.removeByQueryAndFlush({ where: { createdAt: { [seq.Op.lt]: new Date(olderThan) } } });
        if (removed > 0) {
            log.info(`Removed meta data cache entries: ${removed} `);
        }
    }
    async clear(orm) {
        await orm.MetaData.removeByQueryAndFlush({});
    }
    async searchInStore(orm, name, dataType, generate) {
        const result = await orm.MetaData.findOne({ where: { name, dataType } });
        if (result) {
            return JSON.parse(result.data);
        }
        const data = (await generate()) || {};
        await MetaDataService_1.addToStore(orm, name, dataType, JSON.stringify(data));
        return data;
    }
    async musicbrainzSearch(orm, type, query) {
        return this.searchInStore(orm, `search-${type}${JSON.stringify(query)}`, MetaDataType.musicbrainz, async () => {
            return this.audioModule.musicbrainz.search({ type, query });
        });
    }
    async acoustidLookupTrack(track, includes) {
        return this.audioModule.acoustid.acoustid(path.join(track.path, track.fileName), includes);
    }
    async lastFMLookup(orm, type, mbid) {
        return this.searchInStore(orm, `lookup-${type}${mbid}`, MetaDataType.lastfm, async () => {
            return this.audioModule.lastFM.lookup(type, mbid);
        });
    }
    async lastFMAlbumSearch(orm, album, artist) {
        return this.searchInStore(orm, `search-album-${album}//${artist}`, MetaDataType.lastfm, async () => {
            return { album: await this.audioModule.lastFM.album(album, artist) };
        });
    }
    async lastFMArtistSearch(orm, artist) {
        return this.searchInStore(orm, `search-artist-${artist}`, MetaDataType.lastfm, async () => {
            return { artist: await this.audioModule.lastFM.artist(artist) };
        });
    }
    async lastFMTopTracksArtist(orm, artist) {
        return this.searchInStore(orm, `toptracks-artist-${artist}`, MetaDataType.lastfm, async () => {
            return { toptracks: await this.audioModule.lastFM.topArtistSongs(artist) };
        });
    }
    async lastFMTopTracksArtistID(orm, mbid) {
        return this.searchInStore(orm, `toptracks-artistid-${mbid}`, MetaDataType.lastfm, async () => {
            return { toptracks: await this.audioModule.lastFM.topArtistSongsID(mbid) };
        });
    }
    async lastFMSimilarTracks(orm, mbid) {
        return this.searchInStore(orm, `similar-trackid-${mbid}`, MetaDataType.lastfm, async () => {
            return { similartracks: await this.audioModule.lastFM.similarTrackID(mbid) };
        });
    }
    async lastFMSimilarTracksSearch(orm, name, artist) {
        return this.searchInStore(orm, `similar-search-track-${name}//${artist}`, MetaDataType.lastfm, async () => {
            return { album: await this.audioModule.lastFM.similarTrack(name, artist) };
        });
    }
    async acousticbrainzLookup(orm, mbid, nr) {
        return this.searchInStore(orm, `lookup-${mbid}${nr !== undefined ? `-${nr}` : ''}`, MetaDataType.acousticbrainz, async () => {
            return this.audioModule.acousticbrainz.highLevel(mbid, nr);
        });
    }
    async coverartarchiveLookup(orm, type, mbid) {
        return this.searchInStore(orm, `lookup-${type}${mbid}`, MetaDataType.coverartarchive, async () => {
            if (type === CoverArtArchiveLookupType.release) {
                return this.audioModule.coverArtArchive.releaseImages(mbid);
            }
            if (type === CoverArtArchiveLookupType.releaseGroup) {
                return this.audioModule.coverArtArchive.releaseGroupImages(mbid);
            }
            return Promise.reject(Error('Invalid CoverArtArchive Lookup Type'));
        });
    }
    async musicbrainzLookup(orm, type, mbid, inc) {
        return this.searchInStore(orm, `lookup-${type}${mbid}${inc ? inc : ''}`, MetaDataType.musicbrainz, async () => {
            return this.audioModule.musicbrainz.lookup({ type, id: mbid, inc });
        });
    }
    async lyrics(orm, artist, song) {
        return this.searchInStore(orm, `lyrics-${artist}/${song}`, MetaDataType.lyrics, async () => {
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
    async wikipediaSummary(orm, title, lang) {
        lang = lang || 'en';
        return this.searchInStore(orm, `summary-${title}/${lang}`, MetaDataType.wikipedia, async () => {
            return { summary: await this.audioModule.wikipedia.summary(title, lang) };
        });
    }
    async wikidataLookup(orm, id) {
        return this.searchInStore(orm, `wikidata-entity-${id}`, MetaDataType.wikidata, async () => {
            const entity = await this.audioModule.wikipedia.wikidata(id);
            return { id, type: DBObjectType.metadata, dataType: MetaDataType.wikidata, data: entity, date: Date.now() };
        });
    }
    async wikidataSummary(orm, id, lang) {
        return this.searchInStore(orm, `wikidata-summary-${id}`, MetaDataType.wikidata, async () => {
            const lookup = await this.wikidataLookup(orm, id);
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
                return this.wikipediaSummary(orm, langSite.title, lang);
            }
            return {};
        });
    }
    async lyricsByTrack(orm, track) {
        const tag = await track.tag.get();
        if (tag?.lyrics) {
            return { lyrics: tag.lyrics };
        }
        const song = tag?.title;
        if (!song) {
            return {};
        }
        try {
            let result;
            if (tag?.artist) {
                result = await this.lyrics(orm, tag.artist, song);
            }
            if ((!result || !result.lyrics) && tag?.albumArtist && (tag?.artist !== tag?.albumArtist)) {
                result = await this.lyrics(orm, tag.albumArtist, song);
            }
            return result || {};
        }
        catch (e) {
            log.error(e);
            return {};
        }
    }
    async coverartarchiveImage(url) {
        if (!this.audioModule.coverArtArchive.enabled) {
            throw new Error('External service is disabled');
        }
        if (!url || !(url.match(/^http(s)?:\/\/coverartarchive.org/))) {
            return Promise.reject(InvalidParamError('url'));
        }
        const response = await fetch(url);
        if (!response.ok)
            throw new Error(`Unexpected coverartarchive response ${response.statusText}`);
        const buffer = await response.buffer();
        return {
            buffer: { buffer, contentType: response.headers.get('content-type') || 'image' }
        };
    }
};
__decorate([
    Inject,
    __metadata("design:type", AudioModule)
], MetaDataService.prototype, "audioModule", void 0);
MetaDataService = MetaDataService_1 = __decorate([
    InRequestScope
], MetaDataService);
export { MetaDataService };
//# sourceMappingURL=metadata.service.js.map