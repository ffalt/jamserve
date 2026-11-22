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
import { lrclibDuration } from '../../modules/audio/clients/lrclib-client.js';
import { lyricsSlug, shortenLyricsTitle } from '../../utils/lyrics-slug.js';
import { lyricsToEvents, plainLyrics } from '../../utils/lyrics-lrc.js';
import { durationToSeconds, lyricsFromText, readLyricsSidecar, readLyricsSidecarSources, writeLyricsSidecar } from '../../modules/audio/lyrics-file.js';
import { ConfigService } from '../../modules/engine/services/config.service.js';
const log = logger('Metadata');
function hasLyrics(result) {
    return Boolean(result?.lyrics) || Boolean(result?.syncedLyrics);
}
export const LYRICS_MISS_TTL_MS = durationToMilliseconds(30, 'd');
function uniqueLyrics(entries) {
    const seen = new Set();
    return entries.filter(entry => {
        const key = `${entry.syncedLyrics ?? ''}\0${entry.lyrics ?? ''}`;
        if (seen.has(key)) {
            return false;
        }
        seen.add(key);
        return true;
    });
}
function lrclibStoreKey(prefix, track_name, artist_name, album_name, duration) {
    return [prefix, lyricsSlug(track_name), lyricsSlug(artist_name), album_name ? lyricsSlug(album_name) : '', duration ?? ''].join('/');
}
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
    static parseStore(data) {
        try {
            return JSON.parse(data);
        }
        catch {
            return;
        }
    }
    static isStaleMiss(entry, missTTL) {
        if (missTTL === undefined) {
            return false;
        }
        const data = this.parseStore(entry.data);
        if (data && Object.keys(data).length > 0) {
            return false;
        }
        return entry.createdAt.getTime() < Date.now() - missTTL;
    }
    async searchInStore(orm, name, dataType, generate, missTTL) {
        const result = await orm.MetaData.findOne({ where: { name, dataType } });
        if (result && !MetadataService_1.isStaleMiss(result, missTTL)) {
            return JSON.parse(result.data);
        }
        const data = (await generate()) ?? {};
        if (result) {
            await orm.MetaData.removeByQueryAndFlush({ where: { name, dataType } });
        }
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
        return this.searchInStore(orm, `lyrics-${lyricsSlug(artist)}/${lyricsSlug(song)}`, MetadataType.lyrics, async () => {
            let result = await this.audioModule.lyricsOVH.search(artist, song);
            const shortTitle = shortenLyricsTitle(song);
            if (shortTitle && !hasLyrics(result)) {
                result = await this.audioModule.lyricsOVH.search(artist, shortTitle);
            }
            return result;
        }, LYRICS_MISS_TTL_MS);
    }
    async lrclibFind(orm, track_name, artist_name, album_name, duration) {
        return this.searchInStore(orm, lrclibStoreKey('lrclib-find', track_name, artist_name, album_name, duration), MetadataType.lyrics, async () => {
            return await this.audioModule.lrclib.find({ track_name, artist_name, album_name, duration });
        }, LYRICS_MISS_TTL_MS);
    }
    async lrclibSearch(orm, track_name, artist_name, album_name, duration) {
        return this.searchInStore(orm, lrclibStoreKey('lrclib-search', track_name, artist_name, album_name, duration), MetadataType.lyrics, async () => {
            return await this.audioModule.lrclib.findBySearch({ track_name, artist_name, album_name, duration });
        }, LYRICS_MISS_TTL_MS);
    }
    async lrclibGet(orm, track_name, artist_name, album_name, duration) {
        return this.searchInStore(orm, lrclibStoreKey('lrclib-get', track_name, artist_name, album_name, duration), MetadataType.lyrics, async () => {
            return await this.audioModule.lrclib.get({ track_name, artist_name, album_name, duration });
        }, LYRICS_MISS_TTL_MS);
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
    static lyricsByTag(tag) {
        if (tag?.syncedlyrics) {
            return { syncedLyrics: tag.syncedlyrics, lyrics: tag.lyrics ?? plainLyrics(tag.syncedlyrics), language: tag.lyricslanguage, source: 'tag' };
        }
        if (tag?.lyrics) {
            const result = lyricsFromText(tag.lyrics, 'tag');
            return result ? { ...result, language: tag.lyricslanguage } : undefined;
        }
        return;
    }
    static selectLyrics(entries, parameters) {
        const includePlain = parameters?.lyricsIncPlain ?? true;
        const includeSynced = parameters?.lyricsIncSynced ?? true;
        const includeParsedSynced = parameters?.lyricsIncParsedSynced ?? true;
        const result = [];
        for (const entry of entries) {
            const selected = {
                lyrics: includePlain ? entry.lyrics : undefined,
                syncedLyrics: includeSynced ? entry.syncedLyrics : undefined,
                syncedLines: includeParsedSynced && entry.syncedLyrics ? lyricsToEvents(entry.syncedLyrics) : undefined,
                language: entry.language,
                source: entry.source
            };
            if (selected.lyrics ?? selected.syncedLyrics ?? selected.syncedLines) {
                result.push(selected);
            }
        }
        return result;
    }
    async lyricsByTrack(orm, track, parameters) {
        const tag = await track.tag.get();
        const entries = [];
        const embedded = MetadataService_1.lyricsByTag(tag);
        if (embedded) {
            entries.push(embedded);
        }
        const filename = path.join(track.path, track.fileName);
        try {
            const sidecar = await readLyricsSidecar(filename);
            if (sidecar) {
                entries.push(sidecar);
            }
            if (tag && entries.length === 0) {
                const external = await this.lyricsByExternalService(orm, track, tag);
                if (external) {
                    await this.storeLyricsSidecar(filename, external, tag);
                    entries.push(external);
                }
            }
        }
        catch (error) {
            log.error(error);
        }
        return { entries: MetadataService_1.selectLyrics(entries, parameters) };
    }
    async lyricsSidecarsByTrack(track) {
        try {
            return { entries: await readLyricsSidecarSources(path.join(track.path, track.fileName)) };
        }
        catch (error) {
            log.error(error);
            return { entries: [] };
        }
    }
    async lyricsByExternalService(orm, track, tag) {
        let result = { source: 'lrclib', ...(await this.lyricsLrcLibByTrackTag(orm, track, tag)) };
        if (!hasLyrics(result)) {
            result = { source: 'lyrics.ovh', ...(await this.lyricsOVHByTrackTag(orm, track, tag)) };
        }
        return hasLyrics(result) ? result : undefined;
    }
    async storeLyricsSidecar(filename, lyrics, tag) {
        if (!this.configService.env.lyrics.writeSidecar) {
            return;
        }
        await writeLyricsSidecar(filename, lyrics, {
            title: tag.title,
            artist: tag.artist ?? tag.albumArtist,
            album: tag.album,
            duration: durationToSeconds(tag.mediaDuration)
        });
    }
    async lyricsLrcLibByTrackTag(orm, _track, tag) {
        const artistName = tag.artist ?? tag.albumArtist;
        if (!artistName || !tag.title) {
            return {};
        }
        const duration = lrclibDuration(durationToSeconds(tag.mediaDuration));
        let result = await this.lrclibFind(orm, tag.title, artistName, tag.album, duration);
        if (!hasLyrics(result)) {
            result = await this.lrclibSearch(orm, tag.title, artistName, undefined, duration);
        }
        return result ?? {};
    }
    async lyricsAttempt(source, lookup) {
        try {
            const result = await lookup();
            return hasLyrics(result) ? { ...result, source: result?.source ?? source } : undefined;
        }
        catch (error) {
            log.errorMsg(`Lyrics lookup on ${source} failed`, error);
            return;
        }
    }
    async lyricsBySearch(orm, search, parameters) {
        const { title, artist, album } = search;
        const duration = lrclibDuration(search.duration);
        const attempts = [
            ['lrclib', async () => this.lrclibFind(orm, title, artist, album, duration)],
            ['lrclib', async () => this.lrclibSearch(orm, title, artist, undefined, duration)],
            ['lyrics.ovh', async () => this.lyricsOVH(orm, artist, title)]
        ];
        const entries = [];
        for (const [source, lookup] of attempts) {
            const result = await this.lyricsAttempt(source, lookup);
            if (result) {
                entries.push(result);
            }
        }
        return { entries: MetadataService_1.selectLyrics(uniqueLyrics(entries), parameters) };
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
__decorate([
    inject(ConfigService),
    __metadata("design:type", ConfigService)
], MetadataService.prototype, "configService", void 0);
MetadataService = MetadataService_1 = __decorate([
    injectable()
], MetadataService);
export { MetadataService };
//# sourceMappingURL=metadata.service.js.map