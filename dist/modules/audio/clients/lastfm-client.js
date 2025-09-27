import { logger } from '../../../utils/logger.js';
import { WebserviceClient } from '../../../utils/webservice-client.js';
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
            case '#text': {
                result.url = sub;
                break;
            }
            case '@attr': {
                for (const subkey of Object.keys(sub)) {
                    result[subkey] = sub[subkey];
                }
                break;
            }
            case 'tags': {
                result[key] = LastFMClientBeautify.ensureList('tag', sub);
                break;
            }
            case 'streamable': {
                result[key] = { sample: sub['#text'], fulltrack: sub.fulltrack };
                break;
            }
            case 'image': {
                const images = Array.isArray(sub) ? sub : [sub];
                result[key] = images.filter(img => img.url && img.url.length > 0);
                break;
            }
            case 'tracks': {
                result[key] = LastFMClientBeautify.ensureList('track', sub);
                break;
            }
            case 'links': {
                result[key] = LastFMClientBeautify.ensureList('link', sub);
                break;
            }
            default: {
                result[key] = sub;
            }
        }
    }
    static walkBeautifyObject(o) {
        const result = {};
        for (const key of Object.keys(o)) {
            const sub = LastFMClientBeautify.walk(o[key], o);
            if (sub !== undefined) {
                LastFMClientBeautify.buildSubValue(key, sub, result);
            }
        }
        return result;
    }
    static walk(o, parent) {
        if (o === null || o === undefined) {
            return;
        }
        if (Array.isArray(o)) {
            return o
                .map((sub) => LastFMClientBeautify.walk(sub, parent))
                .filter((sub) => sub !== undefined);
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
            return await response.json();
        }
        catch (error) {
            return Promise.reject(error);
        }
    }
    async get(api, parameters) {
        log.info('requesting', api, JSON.stringify(parameters));
        parameters.method = api;
        const sortedParameters = { method: api };
        for (const key of Object.keys(parameters)) {
            sortedParameters[key] = parameters[key];
        }
        sortedParameters.api_key = this.options.key;
        sortedParameters.format = 'json';
        try {
            const data = await this.getJsonWithParameters('https://ws.audioscrobbler.com/2.0/', sortedParameters, true);
            if (data?.error) {
                return {};
            }
            return LastFMClientBeautify.beautify(data);
        }
        catch (error) {
            log.error(error);
            return Promise.reject(error);
        }
    }
    async artist(artist) {
        const data = await this.get('artist.getInfo', { artist });
        return data.artist;
    }
    async artistID(mbid) {
        const data = await this.get('artist.getInfo', { mbid });
        return data.artist;
    }
    async trackID(mbid) {
        const data = await this.get('track.getInfo', { mbid });
        return data.track;
    }
    async track(name, artist) {
        const data = await this.get('track.getInfo', { artist, name });
        return data.track;
    }
    async album(album, artist) {
        const data = await this.get('album.getInfo', { artist, album });
        return data.album;
    }
    async albumID(mbid) {
        const data = await this.get('album.getInfo', { mbid });
        return data.album;
    }
    async albumIDTopTags(mbid) {
        const data = await this.get('album.getTopTags', { mbid });
        return data.toptracks;
    }
    async similarTrack(track, artist) {
        const data = await this.get('track.getSimilar', { track, artist });
        return data.similartracks;
    }
    async similarTrackID(mbid) {
        const data = await this.get('track.getSimilar', { mbid });
        return data.similartracks;
    }
    async topArtistSongs(artist) {
        const data = await this.get('artist.getTopTracks', { artist });
        return data.toptracks;
    }
    async topArtistSongsID(mbid) {
        const data = await this.get('artist.getTopTracks', { mbid });
        return data.toptracks;
    }
    async lookup(type, id) {
        switch (type) {
            case 'album': {
                return { album: await this.albumID(id) };
            }
            case 'artist': {
                return { artist: await this.artistID(id) };
            }
            case 'track': {
                return { track: await this.trackID(id) };
            }
            case 'artist-toptracks': {
                return { toptracks: await this.topArtistSongsID(id) };
            }
            case 'track-similar': {
                return { similartracks: await this.similarTrackID(id) };
            }
            case 'album-toptracks': {
                return { toptracks: await this.albumIDTopTags(id) };
            }
            default: {
                return Promise.reject(new Error('Invalid LastFM lookup type parameter'));
            }
        }
    }
}
//# sourceMappingURL=lastfm-client.js.map