import {LastFM} from '../../../model/lastfm-rest-data';
import Logger from '../../../utils/logger';
import {WebserviceClient} from '../../../utils/webservice-client';
import {LastFMClientApi} from './lastfm-client.interface';

const log = Logger('LastFM');

export class LastFMClient extends WebserviceClient {
	options: LastFMClientApi.LastFMClientApiOptions;

	constructor(options: LastFMClientApi.LastFMClientApiOptions) {
		// "not make more than 5 requests per originating IP address per second" https://www.last.fm/api/tos
		super(5, 1000, options.userAgent);
		this.options = options;
	}

	private beautify(obj: any): any {

		const walk = (o: any, parent: any): any => {
			if (o === null) {
				return undefined;
			}
			if (o === undefined) {
				return undefined;
			}
			if (Array.isArray(o)) {
				return o.map((sub: any) => walk(sub, parent)).filter((sub: any) => sub !== undefined);
			}
			if (typeof o === 'object') {
				const result: any = {};
				Object.keys(o).forEach(key => {
					const sub = walk(o[key], o);
					if (sub !== undefined) {
						if (key === '#text') {
							result['url'] = sub;
						} else if (key === '@attr') {
							Object.keys(sub).forEach(subkey => {
								result[subkey] = sub[subkey];
							});
						} else if (key === 'tags') {
							if (sub.tag) {
								if (!Array.isArray(sub.tag)) {
									sub.tag = [sub.tag];
								}
								result[key] = sub.tag;
							} else {
								result[key] = sub;
							}
						} else if (key === 'streamable') {
							result[key] = {
								sample: sub['#text'],
								fulltrack: sub['fulltrack']
							};
							if (sub.tag) {
								if (!Array.isArray(sub.tag)) {
									sub.tag = [sub.tag];
								}
								result[key] = sub.tag;
							} else {
								result[key] = sub;
							}
						} else if (key === 'image') {
							const images = Array.isArray(sub) ? sub : [sub];
							result[key] = images.filter(img => img.url && img.url.length > 0);
						} else if (key === 'tracks') {
							if (sub.track) {
								if (!Array.isArray(sub.track)) {
									sub.track = [sub.track];
								}
								result[key] = sub.track;
							} else {
								result[key] = sub;
							}
						} else if (key === 'links') {
							if (sub.link) {
								if (!Array.isArray(sub.link)) {
									sub.link = [sub.link];
								}
								result[key] = sub.link;
							} else {
								result[key] = sub;
							}
						} else {
							result[key] = sub;
						}
					}
				});
				return result;
			}
			return o;
		};
		return walk(obj, {});
	}

	private async get(api: string, params: { [name: string]: string; }): Promise<LastFM.Result> {
		log.info('requesting', api, JSON.stringify(params));
		params['method'] = api;
		const sorted_params: { [name: string]: string; } = {method: api};
		Object.keys(params).forEach(key => {
			sorted_params[key] = params[key];
		});
		sorted_params['api_key'] = this.options.key;
		sorted_params['format'] = 'json';
		try {
			const data = await this.getJson('http://ws.audioscrobbler.com/2.0/', sorted_params);
			return this.beautify(data) as LastFM.Result;
		} catch (e) {
			log.error(e);
			return Promise.reject(e);
		}
	}

	async artist(artist: string): Promise<LastFM.Artist | undefined> {
		// https://www.last.fm/api/show/artist.getInfo
		const data = await this.get('artist.getInfo', {artist});
		return data.artist;
	}

	async trackID(mbid: string): Promise<LastFM.Track | undefined> {
		// https://www.last.fm/api/show/artist.getInfo
		const data = await this.get('artist.getInfo', {mbid});
		return data.track;
	}

	async artistID(mbid: string): Promise<LastFM.Artist | undefined> {
		// https://www.last.fm/api/show/artist.getInfo
		const data = await this.get('artist.getInfo', {mbid});
		return data.artist;
	}

	async album(album: string, artist: string): Promise<LastFM.Album | undefined> {
		// https://www.last.fm/api/show/album.getInfo
		const data = await this.get('album.getInfo', {artist, album});
		return data.album;
	}

	async albumID(mbid: string): Promise<LastFM.Album | undefined> {
		// https://www.last.fm/api/show/album.getInfo
		const data = await this.get('album.getInfo', {mbid});
		return data.album;
	}

	async albumIDTopTags(mbid: string): Promise<LastFM.TopTracks | undefined> {
		// https://www.last.fm/api/show/album.getTopTags
		const data = await this.get('album.getTopTags', {mbid});
		return data.toptracks;
	}

	async similarTrack(track: string, artist: string): Promise<LastFM.SimilarTracks | undefined> {
		// https://www.last.fm/api/show/track.getSimilar
		const data = await this.get('track.getSimilar', {track, artist});
		return data.similartracks;
	}

	async similarTrackID(mbid: string): Promise<LastFM.SimilarTracks | undefined> {
		// https://www.last.fm/api/show/track.getSimilar
		const data = await this.get('track.getSimilar', {mbid});
		return data.similartracks;
	}

	async topArtistSongs(artist: string): Promise<LastFM.TopTracks | undefined> {
		// https://www.last.fm/api/show/artist.getTopTracks
		const data = await this.get('artist.getTopTracks', {artist});
		return data.toptracks;
	}

	async topArtistSongsID(mbid: string): Promise<LastFM.TopTracks | undefined> {
		// https://www.last.fm/api/show/artist.getTopTracks
		const data = await this.get('artist.getTopTracks', {mbid});
		return data.toptracks;
	}

	async lookup(type: string, id: string): Promise<LastFM.Result> {
		if (type === 'album') {
			const album = await this.albumID(id);
			return {album};
		}
		if (type === 'album-toptracks') {
			const toptracks = await this.albumIDTopTags(id);
			return {toptracks};
		}
		if (type === 'artist') {
			const artist = await this.artistID(id);
			return {artist};
		}
		if (type === 'track') {
			const track = await this.trackID(id);
			return {track};
		}
		if (type === 'track-similar') {
			const similartracks = await this.similarTrackID(id);
			return {similartracks};
		}
		if (type === 'artist-toptracks') {
			const toptracks = await this.topArtistSongsID(id);
			return {toptracks};
		}
		return Promise.reject(Error('Invalid LastFM lookup type parameter'));
	}

}
