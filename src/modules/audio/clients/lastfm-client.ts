import {logger} from '../../../utils/logger';
import {WebserviceClient} from '../../../utils/webservice-client';
import {LastFM} from './lastfm-rest-data';
import {LastFMClientApiOptions} from './lastfm-client.interface';
import {Response} from 'node-fetch';

const log = logger('LastFM');

class LastFMClientBeautify {

	private static ensureList(name: string, sub: any): any {
		if (sub[name]) {
			return Array.isArray(sub[name]) ? sub[name] : [sub[name]];
		}
		return sub;
	}

	private static buildSubValue(key: string, sub: any, result: any): void {
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
				result[key] = {sample: sub['#text'], fulltrack: sub.fulltrack};
				break;
			case 'image': {
				const images = Array.isArray(sub) ? sub : [sub];
				result[key] = images.filter(img => img.url && img.url.length > 0);
				break;
			}
			case 'tracks':
				result[key] = LastFMClientBeautify.ensureList('track', sub);
				break;
			case  'links':
				result[key] = LastFMClientBeautify.ensureList('link', sub);
				break;
			default:
				result[key] = sub;
		}

	}

	private static walkBeautifyObject(o: any): any {
		const result: any = {};
		Object.keys(o).forEach(key => {
			const sub = LastFMClientBeautify.walk(o[key], o);
			if (sub !== undefined) {
				LastFMClientBeautify.buildSubValue(key, sub, result);
			}
		});
		return result;
	}

	private static walk(o: any, parent: any): any {
		if (o === null || o === undefined) {
			return undefined;
		}
		if (Array.isArray(o)) {
			return o.map((sub: any) => LastFMClientBeautify.walk(sub, parent)).filter((sub: any) => sub !== undefined);
		}
		if (typeof o === 'object') {
			return LastFMClientBeautify.walkBeautifyObject(o);
		}
		return o;
	}

	static beautify(obj: any): any {
		return LastFMClientBeautify.walk(obj, {});
	}

}

export class LastFMClient extends WebserviceClient {
	options: LastFMClientApiOptions;

	constructor(options: LastFMClientApiOptions) {
		// "not make more than 5 requests per originating IP address per second" https://www.last.fm/api/tos
		super(5, 1000, options.userAgent);
		this.options = options;
	}

	protected async parseResult<T>(response: Response): Promise<T | undefined> {
		if (response.status === 404) {
			return {} as T;
		}
		try {
			return await response.json() as any;
		} catch (err) {
			return Promise.reject(err);
		}
	}

	private async get(api: string, params: { [name: string]: string }): Promise<LastFM.Result> {
		log.info('requesting', api, JSON.stringify(params));
		params.method = api;
		const sortedParams: { [name: string]: string } = {method: api};
		Object.keys(params).forEach(key => {
			sortedParams[key] = params[key];
		});
		sortedParams.api_key = this.options.key;
		sortedParams.format = 'json';
		try {
			const data = await this.getJson<any>('https://ws.audioscrobbler.com/2.0/', sortedParams, true);
			if (data?.error) {
				return {};
			}
			return LastFMClientBeautify.beautify(data) as LastFM.Result;
		} catch (e: any) {
			log.error(e);
			return Promise.reject(e);
		}
	}

	async artist(artist: string): Promise<LastFM.Artist | undefined> {
		// https://www.last.fm/api/show/artist.getInfo
		return (await this.get('artist.getInfo', {artist})).artist;
	}

	async artistID(mbid: string): Promise<LastFM.Artist | undefined> {
		// https://www.last.fm/api/show/artist.getInfo
		return (await this.get('artist.getInfo', {mbid})).artist;
	}

	async trackID(mbid: string): Promise<LastFM.Track | undefined> {
		// https://www.last.fm/api/show/track.getInfo
		return (await this.get('track.getInfo', {mbid})).track;
	}

	async track(name: string, artist: string): Promise<LastFM.Track | undefined> {
		// https://www.last.fm/api/show/track.getInfo
		return (await this.get('track.getInfo', {artist, name})).track;
	}

	async album(album: string, artist: string): Promise<LastFM.Album | undefined> {
		// https://www.last.fm/api/show/album.getInfo
		return (await this.get('album.getInfo', {artist, album})).album;
	}

	async albumID(mbid: string): Promise<LastFM.Album | undefined> {
		// https://www.last.fm/api/show/album.getInfo
		return (await this.get('album.getInfo', {mbid})).album;
	}

	async albumIDTopTags(mbid: string): Promise<LastFM.TopTracks | undefined> {
		// https://www.last.fm/api/show/album.getTopTags
		return (await this.get('album.getTopTags', {mbid})).toptracks;
	}

	async similarTrack(track: string, artist: string): Promise<LastFM.SimilarTracks | undefined> {
		// https://www.last.fm/api/show/track.getSimilar
		return (await this.get('track.getSimilar', {track, artist})).similartracks;
	}

	async similarTrackID(mbid: string): Promise<LastFM.SimilarTracks | undefined> {
		// https://www.last.fm/api/show/track.getSimilar
		return (await this.get('track.getSimilar', {mbid})).similartracks;
	}

	async topArtistSongs(artist: string): Promise<LastFM.TopTracks | undefined> {
		// https://www.last.fm/api/show/artist.getTopTracks
		return (await this.get('artist.getTopTracks', {artist})).toptracks;
	}

	async topArtistSongsID(mbid: string): Promise<LastFM.TopTracks | undefined> {
		// https://www.last.fm/api/show/artist.getTopTracks
		return (await this.get('artist.getTopTracks', {mbid})).toptracks;
	}

	async lookup(type: string, id: string): Promise<LastFM.Result> {
		switch (type) {
			case'album' :
				return {album: await this.albumID(id)};
			case'artist' :
				return {artist: await this.artistID(id)};
			case'track' :
				return {track: await this.trackID(id)};
			case'artist-toptracks' :
				return {toptracks: await this.topArtistSongsID(id)};
			case'track-similar' :
				return {similartracks: await this.similarTrackID(id)};
			case'album-toptracks' :
				return {toptracks: await this.albumIDTopTags(id)};
			default:
				return Promise.reject(Error('Invalid LastFM lookup type parameter'));
		}
	}

}
