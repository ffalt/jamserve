import moment from 'moment';
import path from 'path';
import { AudioModule } from '../../modules/audio/audio.module.js';
import * as MusicbrainzClientApi from '../../modules/audio/clients/musicbrainz-client.interface.js';
import { logger } from '../../utils/logger.js';
import { MetadataServiceExtendedInfo } from './metadata.service.extended-info.js';
import { MetadataServiceSimilarArtists } from './metadata.service.similar-artists.js';
import { MetadataServiceSimilarTracks } from './metadata.service.similar-tracks.js';
import { MetadataServiceTopTracks } from './metadata.service.top-tracks.js';
import { Inject, InRequestScope } from 'typescript-ioc';
import { CoverArtArchiveLookupType, DBObjectType, MetaDataType } from '../../types/enums.js';
import { Orm } from '../../modules/engine/services/orm.service.js';
import { Track } from '../track/track.js';
import { LastFM } from '../../modules/audio/clients/lastfm-rest-data.js';
import { WikidataLookupResponse, WikipediaSummaryResponse } from './metadata.types.js';
import { TrackLyrics } from '../track/track.model.js';
import { AcousticBrainz } from '../../modules/audio/clients/acousticbrainz-rest-data.js';
import { Acoustid } from '../../modules/audio/clients/acoustid-rest-data.js';
import { CoverArtArchive } from '../../modules/audio/clients/coverartarchive-rest-data.js';
import { MusicBrainz } from '../../modules/audio/clients/musicbrainz-rest-data.js';
import seq from 'sequelize';
import fetch from 'node-fetch';
import { InvalidParamError } from '../../modules/deco/express/express-error.js';
import { ApiBinaryResult } from '../../modules/deco/express/express-responder.js';

const log = logger('Metadata');

@InRequestScope
export class MetaDataService {
	extInfo = new MetadataServiceExtendedInfo(this);
	similarArtists = new MetadataServiceSimilarArtists(this);
	similarTracks = new MetadataServiceSimilarTracks(this);
	topTracks = new MetadataServiceTopTracks(this);
	@Inject
	private audioModule!: AudioModule;

	private static async addToStore(orm: Orm, name: string, dataType: MetaDataType, data: string): Promise<void> {
		const item = await orm.MetaData.create({
			name,
			dataType,
			data
		}
		);
		await orm.MetaData.persistAndFlush(item);
	}

	async cleanUp(orm: Orm): Promise<void> {
		const olderThan = Date.now() - moment.duration(1, 'd').asMilliseconds();
		const removed = await orm.MetaData.removeByQueryAndFlush({ where: { createdAt: { [seq.Op.lt]: new Date(olderThan) } } });
		if (removed > 0) {
			log.info(`Removed meta data cache entries: ${removed} `);
		}
	}

	async clear(orm: Orm): Promise<void> {
		await orm.MetaData.removeByQueryAndFlush({});
	}

	async searchInStore<T>(orm: Orm, name: string, dataType: MetaDataType, generate: () => Promise<any>): Promise<T> {
		const result = await orm.MetaData.findOne({ where: { name, dataType } });
		if (result) {
			return JSON.parse(result.data);
		}
		const data = (await generate()) || {};
		await MetaDataService.addToStore(orm, name, dataType, JSON.stringify(data));
		return data;
	}

	// searches

	async musicbrainzSearch(orm: Orm, type: string, query: MusicbrainzClientApi.SearchQuery): Promise<MusicBrainz.Response> {
		return this.searchInStore<MusicBrainz.Response>(orm, `search-${type}${JSON.stringify(query)}`,
			MetaDataType.musicbrainz, async () => {
				return this.audioModule.musicbrainz.search({ type, query });
			});
	}

	async acoustidLookupTrack(track: Track, includes: string | undefined): Promise<Array<Acoustid.Result>> {
		return this.audioModule.acoustid.acoustid(path.join(track.path, track.fileName), includes);
	}

	async lastFMLookup(orm: Orm, type: string, mbid: string): Promise<LastFM.Result> {
		return this.searchInStore<LastFM.Result>(orm, `lookup-${type}${mbid}`,
			MetaDataType.lastfm, async () => {
				return this.audioModule.lastFM.lookup(type, mbid);
			});
	}

	async lastFMAlbumSearch(orm: Orm, album: string, artist: string): Promise<LastFM.Result> {
		return this.searchInStore<LastFM.Result>(orm, `search-album-${album}//${artist}`,
			MetaDataType.lastfm, async () => {
				return { album: await this.audioModule.lastFM.album(album, artist) };
			});
	}

	async lastFMArtistSearch(orm: Orm, artist: string): Promise<LastFM.Result> {
		return this.searchInStore<LastFM.Result>(orm, `search-artist-${artist}`,
			MetaDataType.lastfm, async () => {
				return { artist: await this.audioModule.lastFM.artist(artist) };
			});
	}

	async lastFMTopTracksArtist(orm: Orm, artist: string): Promise<LastFM.Result> {
		return this.searchInStore<LastFM.Result>(orm, `toptracks-artist-${artist}`,
			MetaDataType.lastfm, async () => {
				return { toptracks: await this.audioModule.lastFM.topArtistSongs(artist) };
			});
	}

	async lastFMTopTracksArtistID(orm: Orm, mbid: string): Promise<LastFM.Result> {
		return this.searchInStore<LastFM.Result>(orm, `toptracks-artistid-${mbid}`,
			MetaDataType.lastfm, async () => {
				return { toptracks: await this.audioModule.lastFM.topArtistSongsID(mbid) };
			});
	}

	async lastFMSimilarTracks(orm: Orm, mbid: string): Promise<LastFM.Result> {
		return this.searchInStore<LastFM.Result>(orm, `similar-trackid-${mbid}`,
			MetaDataType.lastfm, async () => {
				return { similartracks: await this.audioModule.lastFM.similarTrackID(mbid) };
			});
	}

	async lastFMSimilarTracksSearch(orm: Orm, name: string, artist: string): Promise<LastFM.Result> {
		return this.searchInStore<LastFM.Result>(orm, `similar-search-track-${name}//${artist}`,
			MetaDataType.lastfm, async () => {
				return { album: await this.audioModule.lastFM.similarTrack(name, artist) };
			});
	}

	async acousticbrainzLookup(orm: Orm, mbid: string, nr: number | undefined): Promise<AcousticBrainz.Response> {
		return this.searchInStore<AcousticBrainz.Response>(orm, `lookup-${mbid}${nr !== undefined ? `-${nr}` : ''}`,
			MetaDataType.acousticbrainz, async () => {
				return this.audioModule.acousticbrainz.highLevel(mbid, nr);
			});
	}

	async coverartarchiveLookup(orm: Orm, type: string, mbid: string): Promise<CoverArtArchive.Response> {
		return this.searchInStore<CoverArtArchive.Response>(orm, `lookup-${type}${mbid}`,
			MetaDataType.coverartarchive, async () => {
				if (type === CoverArtArchiveLookupType.release) {
					return this.audioModule.coverArtArchive.releaseImages(mbid);
				}
				if (type === CoverArtArchiveLookupType.releaseGroup) {
					return this.audioModule.coverArtArchive.releaseGroupImages(mbid);
				}
				return Promise.reject(Error('Invalid CoverArtArchive Lookup Type'));
			});
	}

	async musicbrainzLookup(orm: Orm, type: string, mbid: string, inc?: string): Promise<MusicBrainz.Response> {
		return this.searchInStore<MusicBrainz.Response>(orm, `lookup-${type}${mbid}${inc ? inc : ''}`,
			MetaDataType.musicbrainz, async () => {
				return this.audioModule.musicbrainz.lookup({ type, id: mbid, inc });
			});
	}

	async lyrics(orm: Orm, artist: string, song: string): Promise<TrackLyrics> {
		return this.searchInStore<TrackLyrics>(orm, `lyrics-${artist}/${song}`,
			MetaDataType.lyrics, async () => {
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

	async wikipediaSummary(orm: Orm, title: string, lang: string | undefined): Promise<WikipediaSummaryResponse> {
		lang = lang || 'en';
		return this.searchInStore<WikipediaSummaryResponse>(orm, `summary-${title}/${lang}`,
			MetaDataType.wikipedia, async () => {
				return { summary: await this.audioModule.wikipedia.summary(title, lang) };
			});
	}

	async wikidataLookup(orm: Orm, id: string): Promise<WikidataLookupResponse> {
		return this.searchInStore<WikidataLookupResponse>(orm, `wikidata-entity-${id}`,
			MetaDataType.wikidata, async () => {
				const entity = await this.audioModule.wikipedia.wikidata(id);
				return { id, type: DBObjectType.metadata, dataType: MetaDataType.wikidata, data: entity, date: Date.now() };
			});
	}

	async wikidataSummary(orm: Orm, id: string, lang: string | undefined): Promise<WikipediaSummaryResponse> {
		return this.searchInStore<WikipediaSummaryResponse>(orm, `wikidata-summary-${id}`,
			MetaDataType.wikidata, async () => {
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

	async lyricsByTrack(orm: Orm, track: Track): Promise<TrackLyrics> {
		const tag = await track.tag.get();
		if (tag?.lyrics) {
			return { lyrics: tag.lyrics };
		}
		const song = tag?.title;
		if (!song) {
			return {};
		}
		try {
			let result: TrackLyrics | undefined;
			if (tag?.artist) {
				result = await this.lyrics(orm, tag.artist, song);
			}
			if ((!result || !result.lyrics) && tag?.albumArtist && (tag?.artist !== tag?.albumArtist)) {
				result = await this.lyrics(orm, tag.albumArtist, song);
			}
			return result || {};
		} catch (e: any) {
			log.error(e);
			return {};
		}
	}

	async coverartarchiveImage(url?: string): Promise<ApiBinaryResult | undefined> {
		if (!this.audioModule.coverArtArchive.enabled) {
			throw new Error('External service is disabled');
		}
		if (!url || !(url.match(/^http(s)?:\/\/coverartarchive.org/))) {
			return Promise.reject(InvalidParamError('url'));
		}
		const response = await fetch(url);
		if (!response.ok) throw new Error(`Unexpected coverartarchive response ${response.statusText}`);
		const buffer = await response.buffer();
		return {
			buffer: { buffer, contentType: response.headers.get('content-type') || 'image' }
		};
	}
}
