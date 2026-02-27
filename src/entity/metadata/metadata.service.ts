import moment from 'moment';
import path from 'node:path';
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
import { Op } from 'sequelize';
import fetch from 'node-fetch';
import { invalidParameterError } from '../../modules/deco/express/express-error.js';
import { ApiBinaryResult } from '../../modules/deco/express/express-responder.js';
import { LrclibResult } from '../../modules/audio/clients/lrclib-client.js';
import { Tag } from '../tag/tag.js';

const log = logger('Metadata');

@InRequestScope
export class MetaDataService {
	extInfo = new MetadataServiceExtendedInfo(this);
	similarArtists = new MetadataServiceSimilarArtists(this);
	similarTracks = new MetadataServiceSimilarTracks(this);
	topTracks = new MetadataServiceTopTracks(this);
	@Inject
	private readonly audioModule!: AudioModule;

	private static async addToStore(orm: Orm, name: string, dataType: MetaDataType, data: string): Promise<void> {
		const item = orm.MetaData.create({ name, dataType, data });
		await orm.MetaData.persistAndFlush(item);
	}

	async cleanUp(orm: Orm): Promise<void> {
		const olderThan = Date.now() - moment.duration(1, 'd').asMilliseconds();
		const removed = await orm.MetaData.removeByQueryAndFlush({ where: { createdAt: { [Op.lt]: new Date(olderThan) } } });
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
			return JSON.parse(result.data) as T;
		}
		const data = (await generate()) ?? {};
		await MetaDataService.addToStore(orm, name, dataType, JSON.stringify(data));
		return data as T;
	}

	// searches

	async musicbrainzSearch(orm: Orm, type: string, query: MusicbrainzClientApi.SearchQuery): Promise<MusicBrainz.Response | undefined> {
		return this.searchInStore<MusicBrainz.Response>(orm, `search-${type}${JSON.stringify(query)}`,
			MetaDataType.musicbrainz, async () => {
				return this.audioModule.musicbrainz.search({ type, query });
			});
	}

	async acoustidLookupTrack(track: Track, includes: string | undefined): Promise<Array<Acoustid.Result> | undefined> {
		return this.audioModule.acoustid.acoustid(path.join(track.path, track.fileName), includes);
	}

	async lastFMLookup(orm: Orm, type: string, mbid: string): Promise<LastFM.Result | undefined> {
		return this.searchInStore<LastFM.Result>(orm, `lookup-${type}${mbid}`,
			MetaDataType.lastfm, async () => {
				return this.audioModule.lastFM.lookup(type, mbid);
			});
	}

	async lastFMAlbumSearch(orm: Orm, album: string, artist: string): Promise<LastFM.Result | undefined> {
		return this.searchInStore<LastFM.Result>(orm, `search-album-${album}//${artist}`,
			MetaDataType.lastfm, async () => {
				return { album: await this.audioModule.lastFM.album(album, artist) };
			});
	}

	async lastFMArtistSearch(orm: Orm, artist: string): Promise<LastFM.Result | undefined> {
		return this.searchInStore<LastFM.Result>(orm, `search-artist-${artist}`,
			MetaDataType.lastfm, async () => {
				return { artist: await this.audioModule.lastFM.artist(artist) };
			});
	}

	async lastFMTopTracksArtist(orm: Orm, artist: string): Promise<LastFM.Result | undefined> {
		return this.searchInStore<LastFM.Result>(orm, `toptracks-artist-${artist}`,
			MetaDataType.lastfm, async () => {
				return { toptracks: await this.audioModule.lastFM.topArtistSongs(artist) };
			});
	}

	async lastFMTopTracksArtistID(orm: Orm, mbid: string): Promise<LastFM.Result | undefined> {
		return this.searchInStore<LastFM.Result>(orm, `toptracks-artistid-${mbid}`,
			MetaDataType.lastfm, async () => {
				return { toptracks: await this.audioModule.lastFM.topArtistSongsID(mbid) };
			});
	}

	async lastFMSimilarTracks(orm: Orm, mbid: string): Promise<LastFM.Result | undefined> {
		return this.searchInStore<LastFM.Result>(orm, `similar-trackid-${mbid}`,
			MetaDataType.lastfm, async () => {
				return { similartracks: await this.audioModule.lastFM.similarTrackID(mbid) };
			});
	}

	async lastFMSimilarTracksSearch(orm: Orm, name: string, artist: string): Promise<LastFM.Result | undefined> {
		return this.searchInStore<LastFM.Result>(orm, `similar-search-track-${name}//${artist}`,
			MetaDataType.lastfm, async () => {
				return { similartracks: await this.audioModule.lastFM.similarTrack(name, artist) };
			});
	}

	async acousticbrainzLookup(orm: Orm, mbid: string, nr: number | undefined): Promise<AcousticBrainz.Response | undefined> {
		const suffix = nr === undefined ? '' : `-${nr}`;
		const lookupKey = `lookup-${mbid}${suffix}`;
		return this.searchInStore<AcousticBrainz.Response>(
			orm,
			lookupKey,
			MetaDataType.acousticbrainz,
			async () => {
				return this.audioModule.acousticbrainz.highLevel(mbid, nr);
			});
	}

	async coverartarchiveLookup(orm: Orm, type: string, mbid: string): Promise<CoverArtArchive.Response | undefined> {
		const lookupKey = ['lookup-', type, mbid].join('');
		return this.searchInStore<CoverArtArchive.Response>(
			orm,
			lookupKey,
			MetaDataType.coverartarchive,
			async () => {
				if (type === CoverArtArchiveLookupType.release) {
					return this.audioModule.coverArtArchive.releaseImages(mbid);
				}
				if (type === CoverArtArchiveLookupType.releaseGroup) {
					return this.audioModule.coverArtArchive.releaseGroupImages(mbid);
				}
				return Promise.reject(new Error('Invalid CoverArtArchive Lookup Type'));
			});
	}

	async musicbrainzLookup(orm: Orm, type: string, mbid: string, inc?: string): Promise<MusicBrainz.Response | undefined> {
		const lookupKey = ['lookup-', type, mbid, inc ?? ''].join('');
		return this.searchInStore<MusicBrainz.Response>(
			orm,
			lookupKey,
			MetaDataType.musicbrainz,
			async () => {
				return this.audioModule.musicbrainz.lookup({ type, id: mbid, inc });
			}
		);
	}

	async lyricsOVH(orm: Orm, artist: string, song: string): Promise<TrackLyrics | undefined> {
		return this.searchInStore<TrackLyrics>(orm, `lyrics-${artist}/${song}`,
			MetaDataType.lyrics, async () => {
				let result = await this.audioModule.lyricsOVH.search(artist, song);
				const cutVariants = ['(', '/', '[', ':'];
				for (const cut of cutVariants) {
					if (!result?.lyrics && song.includes(cut)) {
						const title = song.slice(0, song.indexOf(cut)).trim();
						if (title.length > 0) {
							result = await this.audioModule.lyricsOVH.search(artist, title);
						}
					}
				}
				return result;
			});
	}

	async lrclibFind(orm: Orm, track_name: string, artist_name: string, album_name?: string, duration?: number): Promise<TrackLyrics | undefined> {
		return this.searchInStore<TrackLyrics>(orm, `lrclib-find-${track_name}/${artist_name}/${album_name}/${duration}`,
			MetaDataType.lyrics, async () => {
				return await this.audioModule.lrclib.find({ track_name, artist_name, album_name, duration });
			});
	}

	async lrclibGet(orm: Orm, track_name: string, artist_name: string, album_name?: string, duration?: number): Promise<LrclibResult | undefined> {
		return this.searchInStore<LrclibResult>(orm, `lrclib-get-${track_name}/${artist_name}/${album_name}/${duration}`,
			MetaDataType.lyrics, async () => {
				return await this.audioModule.lrclib.get({ track_name, artist_name, album_name, duration });
			});
	}

	async wikipediaSummary(orm: Orm, title: string, lang: string = 'en'): Promise<WikipediaSummaryResponse | undefined> {
		return this.searchInStore<WikipediaSummaryResponse>(orm, `summary-${title}/${lang}`,
			MetaDataType.wikipedia, async () => {
				return { summary: await this.audioModule.wikipedia.summary(title, lang) };
			});
	}

	async wikidataLookup(orm: Orm, id: string): Promise<WikidataLookupResponse | undefined> {
		return this.searchInStore<WikidataLookupResponse>(orm, `wikidata-entity-${id}`,
			MetaDataType.wikidata, async () => {
				const entity = await this.audioModule.wikipedia.wikidata(id);
				return { id, type: DBObjectType.metadata, dataType: MetaDataType.wikidata, data: entity, date: Date.now() };
			});
	}

	async wikidataSummary(orm: Orm, id: string, lang: string | undefined): Promise<WikipediaSummaryResponse | undefined> {
		return this.searchInStore<WikipediaSummaryResponse>(orm, `wikidata-summary-${id}`,
			MetaDataType.wikidata, async () => {
				const lookup = await this.wikidataLookup(orm, id);
				if (!lookup) {
					return {};
				}
				const obj = lookup.entity ?? lookup.data;
				if (!obj) {
					return {};
				}
				lang = lang ?? 'en';
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
		} catch (error: unknown) {
			log.error(error);
			return {};
		}
	}

	async lyricsLrcLibByTrackTag(orm: Orm, _track: Track, tag: Tag): Promise<TrackLyrics> {
		if (!tag.title) {
			return {};
		}
		let result = await this.lrclibFind(orm, tag.title, tag.artist ?? tag.albumArtist ?? '', tag.album);
		if (!result || !(result.lyrics ?? result.syncedLyrics)) {
			result = await this.lrclibFind(orm, tag.title || '', tag.artist ?? tag.albumArtist ?? '');
		}
		return result ?? {};
	}

	async lyricsOVHByTrackTag(orm: Orm, _track: Track, tag: Tag): Promise<TrackLyrics> {
		if (!tag.title) {
			return {};
		}
		let result: TrackLyrics | undefined;
		if (!result?.lyrics && tag.artist) {
			result = await this.lyricsOVH(orm, tag.artist, tag.title);
		}
		if (!result?.lyrics && tag.albumArtist && (tag.artist !== tag.albumArtist)) {
			result = await this.lyricsOVH(orm, tag.albumArtist, tag.title);
		}
		return result ?? {};
	}

	async coverartarchiveImage(url?: string): Promise<ApiBinaryResult | undefined> {
		if (!this.audioModule.coverArtArchive.enabled) {
			throw new Error('External service is disabled');
		}
		const pattern = /^http(s)?:\/\/coverartarchive.org/;
		if (!url || !pattern.test(url)) {
			return Promise.reject(invalidParameterError('url'));
		}
		const response = await fetch(url);
		if (!response.ok) throw new Error(`Unexpected coverartarchive response ${response.statusText}`);
		const arrayBuffer = await response.arrayBuffer();
		const buffer = Buffer.from(arrayBuffer);
		return {
			buffer: { buffer, contentType: response.headers.get('content-type') ?? 'image' }
		};
	}
}
