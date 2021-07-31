import { logger } from '../../../utils/logger';
import { WebserviceClient } from '../../../utils/webservice-client';
const log = logger('LastFM');
class LastFMClientBeautify {
    static ensureList(name, sub) {
        if (sub[name]) {
            return Array.isArray(sub[name]) ? sub[name] : [sub[name]];
        }
        return sub;
    }
    static buildSubValue(key, sub, result) {
        switch (key) {
            case '#text':
                result.url = sub;
                break;
            case '@attr':
                Object.keys(sub).forEach(subkey => {
                    result[subkey] = sub[subkey];
                });
                break;
            case 'tags':
                result[key] = LastFMClientBeautify.ensureList('tag', sub);
                break;
            case 'streamable':
                result[key] = { sample: sub['#text'], fulltrack: sub.fulltrack };
                break;
            case 'image': {
                const images = Array.isArray(sub) ? sub : [sub];
                result[key] = images.filter(img => img.url && img.url.length > 0);
                break;
            }
            case 'tracks':
                result[key] = LastFMClientBeautify.ensureList('track', sub);
                break;
            case 'links':
                result[key] = LastFMClientBeautify.ensureList('link', sub);
                break;
            default:
                result[key] = sub;
        }
    }
    static walkBeautifyObject(o) {
        const result = {};
        Object.keys(o).forEach(key => {
            const sub = LastFMClientBeautify.walk(o[key], o);
            if (sub !== undefined) {
                LastFMClientBeautify.buildSubValue(key, sub, result);
            }
        });
        return result;
    }
    static walk(o, parent) {
        if (o === null || o === undefined) {
            return undefined;
        }
        if (Array.isArray(o)) {
            return o.map((sub) => LastFMClientBeautify.walk(sub, parent)).filter((sub) => sub !== undefined);
        }
        if (typeof o === 'object') {
            return LastFMClientBeautify.walkBeautifyObject(o);
        }
        return o;
    }
    static beautify(obj) {
        return LastFMClientBeautify.walk(obj, {});
    }
}
export class LastFMClient extends WebserviceClient {
    constructor(options) {
        super(5, 1000, options.userAgent);
        this.options = options;
    }
    async parseResult(response) {
        if (response.status === 404) {
            return {};
        }
        try {
            return response.json();
        }
        catch (err) {
            return Promise.reject(err);
        }
    }
    async get(api, params) {
        log.info('requesting', api, JSON.stringify(params));
        params.method = api;
        const sortedParams = { method: api };
        Object.keys(params).forEach(key => {
            sortedParams[key] = params[key];
        });
        sortedParams.api_key = this.options.key;
        sortedParams.format = 'json';
        try {
            const data = await this.getJson('https://ws.audioscrobbler.com/2.0/', sortedParams, true);
            if (data?.error) {
                return {};
            }
            return LastFMClientBeautify.beautify(data);
        }
        catch (e) {
            log.error(e);
            return Promise.reject(e);
        }
    }
    async artist(artist) {
        return (await this.get('artist.getInfo', { artist })).artist;
    }
    async artistID(mbid) {
        return (await this.get('artist.getInfo', { mbid })).artist;
    }
    async trackID(mbid) {
        return (await this.get('track.getInfo', { mbid })).track;
    }
    async track(name, artist) {
        return (await this.get('track.getInfo', { artist, name })).track;
    }
    async album(album, artist) {
        return (await this.get('album.getInfo', { artist, album })).album;
    }
    async albumID(mbid) {
        return (await this.get('album.getInfo', { mbid })).album;
    }
    async albumIDTopTags(mbid) {
        return (await this.get('album.getTopTags', { mbid })).toptracks;
    }
    async similarTrack(track, artist) {
        return (await this.get('track.getSimilar', { track, artist })).similartracks;
    }
    async similarTrackID(mbid) {
        return (await this.get('track.getSimilar', { mbid })).similartracks;
    }
    async topArtistSongs(artist) {
        return (await this.get('artist.getTopTracks', { artist })).toptracks;
    }
    async topArtistSongsID(mbid) {
        return (await this.get('artist.getTopTracks', { mbid })).toptracks;
    }
    async lookup(type, id) {
        switch (type) {
            case 'album':
                return { album: await this.albumID(id) };
            case 'artist':
                return { artist: await this.artistID(id) };
            case 'track':
                return { track: await this.trackID(id) };
            case 'artist-toptracks':
                return { toptracks: await this.topArtistSongsID(id) };
            case 'track-similar':
                return { similartracks: await this.similarTrackID(id) };
            case 'album-toptracks':
                return { toptracks: await this.albumIDTopTags(id) };
            default:
                return Promise.reject(Error('Invalid LastFM lookup type parameter'));
        }
    }
}
//# sourceMappingURL=lastfm-client.js.map