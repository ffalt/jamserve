import { logger } from '../../../utils/logger.js';
import { WebserviceClient } from '../../../utils/webservice-client.js';
import { LastFM } from './lastfm-rest-data.js';
import { LastFMClientApiOptions } from './lastfm-client.interface.js';
import { Response } from 'node-fetch';

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
			case '#text': {
				result.url = sub;
				break;
			}
			case '@attr': {
				for (const subkey of Object.keys(sub as Record<string, any>)) {
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

	private static walkBeautifyObject(o: Record<string, any>): any {
		const result: any = {};
		for (const key of Object.keys(o)) {
			const sub = LastFMClientBeautify.walk(o[key], o);
			if (sub !== undefined) {
				LastFMClientBeautify.buildSubValue(key, sub, result);
			}
		}
		return result;
	}

	private static walk(o: unknown, parent: any): unknown {
		if (o === null || o === undefined) {
			return;
		}
		if (Array.isArray(o)) {
			return o
				.map((sub: Array<object | Array<any> | undefined | null>) => LastFMClientBeautify.walk(sub, parent))
				.filter((sub: any) => sub !== undefined);
		}
		if (typeof o === 'object') {
			return LastFMClientBeautify.walkBeautifyObject(o);
		}
		return o;
	}

	static beautify<T>(obj: unknown): T {
		return LastFMClientBeautify.walk(obj, {}) as T;
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
			return await response.json() as T;
		} catch (error: unknown) {
			return Promise.reject(error);
		}
	}

	private async get(api: string, parameters: Record<string, string>): Promise<LastFM.Result> {
		log.info('requesting', api, JSON.stringify(parameters));
		parameters.method = api;
		const sortedParameters: Record<string, string | number | undefined> = { method: api };
		for (const key of Object.keys(parameters)) {
			sortedParameters[key] = parameters[key];
		}
		sortedParameters.api_key = this.options.key;
		sortedParameters.format = 'json';
		try {
			const data = await this.getJsonWithParameters<any, Record<string, string | number | undefined>>('https://ws.audioscrobbler.com/2.0/', sortedParameters, true);
			if (data?.error) {
				return {};
			}
			return LastFMClientBeautify.beautify(data as unknown) as LastFM.Result;
		} catch (error: unknown) {
			log.error(error);
			return Promise.reject(error);
		}
	}

	async artist(artist: string): Promise<LastFM.Artist | undefined> {
		// https://www.last.fm/api/show/artist.getInfo
		const data = await this.get('artist.getInfo', { artist });
		return data.artist;
	}

	async artistID(mbid: string): Promise<LastFM.Artist | undefined> {
		// https://www.last.fm/api/show/artist.getInfo
		const data = await this.get('artist.getInfo', { mbid });
		return data.artist;
	}

	async trackID(mbid: string): Promise<LastFM.Track | undefined> {
		// https://www.last.fm/api/show/track.getInfo
		const data = await this.get('track.getInfo', { mbid });
		return data.track;
	}

	async track(name: string, artist: string): Promise<LastFM.Track | undefined> {
		// https://www.last.fm/api/show/track.getInfo
		const data = await this.get('track.getInfo', { artist, name });
		return data.track;
	}

	async album(album: string, artist: string): Promise<LastFM.Album | undefined> {
		// https://www.last.fm/api/show/album.getInfo
		const data = await this.get('album.getInfo', { artist, album });
		return data.album;
	}

	async albumID(mbid: string): Promise<LastFM.Album | undefined> {
		// https://www.last.fm/api/show/album.getInfo
		const data = await this.get('album.getInfo', { mbid });
		return data.album;
	}

	async albumIDTopTags(mbid: string): Promise<LastFM.TopTracks | undefined> {
		// https://www.last.fm/api/show/album.getTopTags
		const data = await this.get('album.getTopTags', { mbid });
		return data.toptracks;
	}

	async similarTrack(track: string, artist: string): Promise<LastFM.SimilarTracks | undefined> {
		// https://www.last.fm/api/show/track.getSimilar
		const data = await this.get('track.getSimilar', { track, artist });
		return data.similartracks;
	}

	async similarTrackID(mbid: string): Promise<LastFM.SimilarTracks | undefined> {
		// https://www.last.fm/api/show/track.getSimilar
		const data = await this.get('track.getSimilar', { mbid });
		return data.similartracks;
	}

	async topArtistSongs(artist: string): Promise<LastFM.TopTracks | undefined> {
		// https://www.last.fm/api/show/artist.getTopTracks
		const data = await this.get('artist.getTopTracks', { artist });
		return data.toptracks;
	}

	async topArtistSongsID(mbid: string): Promise<LastFM.TopTracks | undefined> {
		// https://www.last.fm/api/show/artist.getTopTracks
		const data = await this.get('artist.getTopTracks', { mbid });
		return data.toptracks;
	}

	async lookup(type: string, id: string): Promise<LastFM.Result> {
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
