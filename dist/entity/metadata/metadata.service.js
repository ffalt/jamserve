var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var MetadataService_1;
import { durationToMilliseconds } from '../../utils/date-time.js';
import path from 'node:path';
import { AudioModule } from '../../modules/audio/audio.module.js';
import { logger } from '../../utils/logger.js';
import { MetadataServiceExtendedInfo } from './metadata.service.extended-info.js';
import { MetadataServiceSimilarArtists } from './metadata.service.similar-artists.js';
import { MetadataServiceSimilarTracks } from './metadata.service.similar-tracks.js';
import { MetadataServiceTopTracks } from './metadata.service.top-tracks.js';
import { injectable, inject } from 'inversify';
import { CoverArtArchiveLookupType, DBObjectType, MetadataType } from '../../types/enums.js';
import { Op } from 'sequelize';
import fetch from 'node-fetch';
import { invalidParameterError } from '../../modules/deco/express/express-error.js';
const log = logger('Metadata');
let MetadataService = MetadataService_1 = class MetadataService {
    constructor() {
        this.extInfo = new MetadataServiceExtendedInfo(this);
        this.similarArtists = new MetadataServiceSimilarArtists(this);
        this.similarTracks = new MetadataServiceSimilarTracks(this);
        this.topTracks = new MetadataServiceTopTracks(this);
    }
    static async addToStore(orm, name, dataType, data) {
        const item = orm.MetaData.create({ name, dataType, data });
        await orm.MetaData.persistAndFlush(item);
    }
    static async fetchExternalImage(url, serviceName) {
        const response = await fetch(url);
        if (!response.ok)
            throw new Error(`Unexpected ${serviceName} response ${response.statusText}`);
        const buffer = Buffer.from(await response.arrayBuffer());
        return { buffer: { buffer, contentType: response.headers.get('content-type') ?? 'image' } };
    }
    async searchInStore(orm, name, dataType, generate) {
        const result = await orm.MetaData.findOne({ where: { name, dataType } });
        if (result) {
            return JSON.parse(result.data);
        }
        const data = (await generate()) ?? {};
        await MetadataService_1.addToStore(orm, name, dataType, JSON.stringify(data));
        return data;
    }
    async cleanUp(orm) {
        const olderThan = Date.now() - durationToMilliseconds(1, 'd');
        const removed = await orm.MetaData.removeByQueryAndFlush({ where: { createdAt: { [Op.lt]: new Date(olderThan) } } });
        if (removed > 0) {
            log.info(`Removed meta data cache entries: ${removed} `);
        }
    }
    async clear(orm) {
        await orm.MetaData.removeByQueryAndFlush({});
    }
    async musicbrainzSearch(orm, type, query) {
        return this.searchInStore(orm, `search-${type}${JSON.stringify(query)}`, MetadataType.musicbrainz, async () => {
            return this.audioModule.musicbrainz.search({ type, query });
        });
    }
    async acoustidLookupTrack(track, includes) {
        return this.audioModule.acoustid.acoustid(path.join(track.path, track.fileName), includes);
    }
    async lastFMLookup(orm, type, mbid) {
        return this.searchInStore(orm, `lookup-${type}${mbid}`, MetadataType.lastfm, async () => {
            return this.audioModule.lastFM.lookup(type, mbid);
        });
    }
    async lastFMAlbumSearch(orm, album, artist) {
        return this.searchInStore(orm, `search-album-${album}//${artist}`, MetadataType.lastfm, async () => {
            return { album: await this.audioModule.lastFM.album(album, artist) };
        });
    }
    async lastFMArtistSearch(orm, artist) {
        return this.searchInStore(orm, `search-artist-${artist}`, MetadataType.lastfm, async () => {
            return { artist: await this.audioModule.lastFM.artist(artist) };
        });
    }
    async lastFMTopTracksArtist(orm, artist) {
        return this.searchInStore(orm, `toptracks-artist-${artist}`, MetadataType.lastfm, async () => {
            return { toptracks: await this.audioModule.lastFM.topArtistSongs(artist) };
        });
    }
    async lastFMTopTracksArtistID(orm, mbid) {
        return this.searchInStore(orm, `toptracks-artistid-${mbid}`, MetadataType.lastfm, async () => {
            return { toptracks: await this.audioModule.lastFM.topArtistSongsID(mbid) };
        });
    }
    async lastFMSimilarTracks(orm, mbid) {
        return this.searchInStore(orm, `similar-trackid-${mbid}`, MetadataType.lastfm, async () => {
            return { similartracks: await this.audioModule.lastFM.similarTrackID(mbid) };
        });
    }
    async lastFMSimilarTracksSearch(orm, name, artist) {
        return this.searchInStore(orm, `similar-search-track-${name}//${artist}`, MetadataType.lastfm, async () => {
            return { similartracks: await this.audioModule.lastFM.similarTrack(name, artist) };
        });
    }
    async acousticbrainzLookup(orm, mbid, nr) {
        const suffix = nr === undefined ? '' : `-${nr}`;
        const lookupKey = `lookup-${mbid}${suffix}`;
        return this.searchInStore(orm, lookupKey, MetadataType.acousticbrainz, async () => {
            return this.audioModule.acousticbrainz.highLevel(mbid, nr);
        });
    }
    async coverartarchiveLookup(orm, type, mbid) {
        const lookupKey = ['lookup-', type, mbid].join('');
        return this.searchInStore(orm, lookupKey, MetadataType.coverartarchive, async () => {
            if (type === CoverArtArchiveLookupType.release) {
                return this.audioModule.coverArtArchive.releaseImages(mbid);
            }
            if (type === CoverArtArchiveLookupType.releaseGroup) {
                return this.audioModule.coverArtArchive.releaseGroupImages(mbid);
            }
            return Promise.reject(new Error('Invalid CoverArtArchive Lookup Type'));
        });
    }
    async musicbrainzLookup(orm, type, mbid, inc) {
        const lookupKey = ['lookup-', type, mbid, inc ?? ''].join('');
        return this.searchInStore(orm, lookupKey, MetadataType.musicbrainz, async () => {
            return this.audioModule.musicbrainz.lookup({ type, id: mbid, inc });
        });
    }
    async lyricsOVH(orm, artist, song) {
        return this.searchInStore(orm, `lyrics-${artist}/${song}`, MetadataType.lyrics, async () => {
            let result = await this.audioModule.lyricsOVH.search(artist, song);
            const cutVariants = ['(', '/', '[', ':'];
            for (const cut of cutVariants) {
                if (result?.lyrics || !song.includes(cut)) {
                    continue;
                }
                const title = song.slice(0, song.indexOf(cut)).trim();
                if (title.length > 0) {
                    result = await this.audioModule.lyricsOVH.search(artist, title);
                }
            }
            return result;
        });
    }
    async lrclibFind(orm, track_name, artist_name, album_name, duration) {
        return this.searchInStore(orm, `lrclib-find-${track_name}/${artist_name}/${album_name}/${duration}`, MetadataType.lyrics, async () => {
            return await this.audioModule.lrclib.find({ track_name, artist_name, album_name, duration });
        });
    }
    async lrclibGet(orm, track_name, artist_name, album_name, duration) {
        return this.searchInStore(orm, `lrclib-get-${track_name}/${artist_name}/${album_name}/${duration}`, MetadataType.lyrics, async () => {
            return await this.audioModule.lrclib.get({ track_name, artist_name, album_name, duration });
        });
    }
    async wikipediaSummary(orm, title, lang = 'en') {
        return this.searchInStore(orm, `summary-${title}/${lang}`, MetadataType.wikipedia, async () => {
            return { summary: await this.audioModule.wikipedia.summary(title, lang) };
        });
    }
    async wikidataLookup(orm, id) {
        return this.searchInStore(orm, `wikidata-entity-${id}`, MetadataType.wikidata, async () => {
            const entity = await this.audioModule.wikipedia.wikidata(id);
            return { id, type: DBObjectType.metadata, dataType: MetadataType.wikidata, data: entity, date: Date.now() };
        });
    }
    async wikidataSummary(orm, id, lang) {
        return this.searchInStore(orm, `wikidata-summary-${id}`, MetadataType.wikidata, async () => {
            const lookup = await this.wikidataLookup(orm, id);
            if (!lookup) {
                return {};
            }
            const obj = lookup.entity ?? lookup.data;
            if (!obj) {
                return {};
            }
            lang ?? (lang = 'en');
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
        if (!tag) {
            return {};
        }
        if (tag.lyrics || tag.syncedlyrics) {
            return { lyrics: tag.lyrics, syncedLyrics: tag.syncedlyrics };
        }
        try {
            let result = await this.lyricsLrcLibByTrackTag(orm, track, tag);
            if (!(result.lyrics || result.syncedLyrics)) {
                result = await this.lyricsOVHByTrackTag(orm, track, tag);
            }
            return result;
        }
        catch (error) {
            log.error(error);
            return {};
        }
    }
    async lyricsLrcLibByTrackTag(orm, _track, tag) {
        if (!tag.title) {
            return {};
        }
        let result = await this.lrclibFind(orm, tag.title, tag.artist ?? tag.albumArtist ?? '', tag.album);
        if (!result || !(result.lyrics ?? result.syncedLyrics)) {
            result = await this.lrclibFind(orm, tag.title || '', tag.artist ?? tag.albumArtist ?? '');
        }
        return result ?? {};
    }
    async lyricsOVHByTrackTag(orm, _track, tag) {
        if (!tag.title) {
            return {};
        }
        let result;
        if (!result?.lyrics && tag.artist) {
            result = await this.lyricsOVH(orm, tag.artist, tag.title);
        }
        if (!result?.lyrics && tag.albumArtist && (tag.artist !== tag.albumArtist)) {
            result = await this.lyricsOVH(orm, tag.albumArtist, tag.title);
        }
        return result ?? {};
    }
    async coverartarchiveImage(url) {
        if (!this.audioModule.coverArtArchive.enabled) {
            throw new Error('External service is disabled');
        }
        if (!url || !/^http(s)?:\/\/coverartarchive.org/.test(url)) {
            return Promise.reject(invalidParameterError('url'));
        }
        return MetadataService_1.fetchExternalImage(url, 'coverartarchive');
    }
    async discogsReleaseSearch(orm, parameters) {
        const cacheKey = `discogs-search-${JSON.stringify(parameters)}`;
        return this.searchInStore(orm, cacheKey, MetadataType.discogs, async () => this.audioModule.discogs.searchRelease(parameters));
    }
    async discogsArtistSearch(orm, query) {
        return this.searchInStore(orm, `discogs-artist-${query}`, MetadataType.discogs, async () => this.audioModule.discogs.searchArtist(query));
    }
    async discogsRelease(orm, id) {
        return this.searchInStore(orm, `discogs-release-${id}`, MetadataType.discogs, async () => this.audioModule.discogs.releaseById(id));
    }
    async discogsArtist(orm, id) {
        return this.searchInStore(orm, `discogs-artist-id-${id}`, MetadataType.discogs, async () => this.audioModule.discogs.artistById(id));
    }
    async discogsMaster(orm, id) {
        return this.searchInStore(orm, `discogs-master-${id}`, MetadataType.discogs, async () => this.audioModule.discogs.masterById(id));
    }
    async discogsMasterVersions(orm, id) {
        return this.searchInStore(orm, `discogs-master-versions-${id}`, MetadataType.discogs, async () => this.audioModule.discogs.masterVersionsById(id));
    }
    async discogsImage(url) {
        if (!this.audioModule.discogs.enabled) {
            throw new Error('External service is disabled');
        }
        if (!url || !/^https?:\/\/i\.discogs\.com\//.test(url)) {
            return Promise.reject(invalidParameterError('url'));
        }
        return MetadataService_1.fetchExternalImage(url, 'discogs');
    }
};
__decorate([
    inject(AudioModule),
    __metadata("design:type", AudioModule)
], MetadataService.prototype, "audioModule", void 0);
MetadataService = MetadataService_1 = __decorate([
    injectable()
], MetadataService);
export { MetadataService };
//# sourceMappingURL=metadata.service.js.map