import moment from 'moment';
import path from 'path';
import {DBObjectType} from '../../db/db.types';
import {AcousticBrainz} from '../../model/acousticbrainz-rest-data';
import {Acoustid} from '../../model/acoustid-rest-data';
import {CoverArtArchive} from '../../model/coverartarchive-rest-data';
import {Jam} from '../../model/jam-rest-data';
import {CoverArtArchiveLookupType} from '../../model/jam-types';
import {LastFM} from '../../model/lastfm-rest-data';
import {MusicBrainz} from '../../model/musicbrainz-rest-data';
import {AudioModule} from '../../modules/audio/audio.module';
import {MusicbrainzClientApi} from '../../modules/audio/clients/musicbrainz-client.interface';
import {logger} from '../../utils/logger';
import {AlbumStore} from '../album/album.store';
import {ArtistStore} from '../artist/artist.store';
import {BaseStoreService} from '../base/base.service';
import {FolderStore} from '../folder/folder.store';
import {Track} from '../track/track.model';
import {TrackStore} from '../track/track.store';
import {MetaData} from './metadata.model';
import {MetadataServiceExtendedInfo} from './metadata.service.extended-info';
import {MetadataServiceSimilarArtists} from './metadata.service.similar-artists';
import {MetadataServiceSimilarTracks} from './metadata.service.similar-tracks';
import {MetadataServiceTopTracks} from './metadata.service.top-tracks';
import {MetaDataStore, SearchQueryMetaData} from './metadata.store';
import {MetaDataType} from './metadata.types';

const log = logger('Metadata');

export class MetaDataService extends BaseStoreService<MetaData, SearchQueryMetaData> {
	extInfo: MetadataServiceExtendedInfo;
	similarArtists: MetadataServiceSimilarArtists;
	similarTracks: MetadataServiceSimilarTracks;
	topTracks: MetadataServiceTopTracks;

	constructor(
		private metadataStore: MetaDataStore, private folderStore: FolderStore, private trackStore: TrackStore,
		private albumStore: AlbumStore, private artistStore: ArtistStore, private audioModule: AudioModule
	) {
		super(metadataStore);
		this.extInfo = new MetadataServiceExtendedInfo(this);
		this.similarArtists = new MetadataServiceSimilarArtists(this, folderStore, artistStore);
		this.similarTracks = new MetadataServiceSimilarTracks(this, trackStore);
		this.topTracks = new MetadataServiceTopTracks(this);
	}

	defaultSort(items: Array<MetaData>): Array<MetaData> {
		return items;
	}

	private async addToStore(name: string, dataType: MetaDataType, data: any): Promise<void> {
		await this.metadataStore.add({id: '', name, type: DBObjectType.metadata, dataType, data, date: Date.now()});
	}

	async cleanUp(): Promise<void> {
		const olderThan = Date.now() - moment.duration(1, 'd').asMilliseconds();
		const removed = await this.metadataStore.removeByQuery({olderThan});
		if (removed > 0) {
			log.info(`Removed meta data cache entries: ${removed} `);
		}
	}

	async clear(): Promise<void> {
		const ids = await this.metadataStore.allIds();
		await this.metadataStore.remove(ids);
	}

	async searchInStore<T>(name: string, dataType: MetaDataType, generate: () => Promise<any>): Promise<T> {
		const result = await this.metadataStore.searchOne({name, dataType});
		if (result) {
			return result.data;
		}
		const data = await generate();
		await this.addToStore(name, dataType, data);
		return data;
	}

	// searches

	async musicbrainzSearch(type: string, query: MusicbrainzClientApi.SearchQuery): Promise<MusicBrainz.Response> {
		return this.searchInStore<MusicBrainz.Response>(`search-${type}${JSON.stringify(query)}`,
			MetaDataType.musicbrainz, async () => {
				return this.audioModule.musicbrainz.search({type, query});
			});
	}

	async acoustidLookupTrack(track: Track, includes: string | undefined): Promise<Array<Acoustid.Result>> {
		return this.audioModule.acoustid.acoustid(path.join(track.path, track.name), includes);
	}

	async lastFMLookup(type: string, mbid: string): Promise<LastFM.Result> {
		return this.searchInStore<LastFM.Result>(`lookup-${type}${mbid}`,
			MetaDataType.lastfm, async () => {
				return this.audioModule.lastFM.lookup(type, mbid);
			});
	}

	async lastFMAlbumSearch(album: string, artist: string): Promise<LastFM.Result> {
		return this.searchInStore<LastFM.Result>(`search-album-${album}//${artist}`,
			MetaDataType.lastfm, async () => {
				return {album: await this.audioModule.lastFM.album(album, artist)};
			});
	}

	async lastFMArtistSearch(artist: string): Promise<LastFM.Result> {
		return this.searchInStore<LastFM.Result>(`search-artist-${artist}`,
			MetaDataType.lastfm, async () => {
				return {artist: await this.audioModule.lastFM.artist(artist)};
			});
	}

	async lastFMTopTracksArtist(artist: string): Promise<LastFM.Result> {
		return this.searchInStore<LastFM.Result>(`toptracks-artist-${artist}`,
			MetaDataType.lastfm, async () => {
				return {toptracks: await this.audioModule.lastFM.topArtistSongs(artist)};
			});
	}

	async lastFMTopTracksArtistID(mbid: string): Promise<LastFM.Result> {
		return this.searchInStore<LastFM.Result>(`toptracks-artistid-${mbid}`,
			MetaDataType.lastfm, async () => {
				return {toptracks: await this.audioModule.lastFM.topArtistSongsID(mbid)};
			});
	}

	async lastFMSimilarTracks(mbid: string): Promise<LastFM.Result> {
		return this.searchInStore<LastFM.Result>(`similar-trackid-${mbid}`,
			MetaDataType.lastfm, async () => {
				return {similartracks: await this.audioModule.lastFM.similarTrackID(mbid)};
			});
	}

	async acousticbrainzLookup(mbid: string, nr: number | undefined): Promise<AcousticBrainz.Response> {
		return this.searchInStore<AcousticBrainz.Response>(`lookup-${mbid}${nr !== undefined ? `-${nr}` : ''}`,
			MetaDataType.acousticbrainz, async () => {
				return this.audioModule.acousticbrainz.highLevel(mbid, nr);
			});
	}

	async coverartarchiveLookup(type: string, mbid: string): Promise<CoverArtArchive.Response> {
		return this.searchInStore<CoverArtArchive.Response>(`lookup-${type}${mbid}`,
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

	async musicbrainzLookup(type: string, mbid: string, inc?: string): Promise<MusicBrainz.Response> {
		return this.searchInStore<MusicBrainz.Response>(`lookup-${type}${mbid}${inc ? inc : ''}`,
			MetaDataType.musicbrainz, async () => {
				return this.audioModule.musicbrainz.lookup({type, id: mbid, inc});
			});
	}

	async lyrics(artist: string, song: string): Promise<Jam.TrackLyrics> {
		return this.searchInStore<Jam.TrackLyrics>(`lyrics-${artist}/${song}`,
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

	async wikipediaSummary(title: string, lang: string | undefined): Promise<Jam.WikipediaSummaryResponse> {
		lang = lang || 'en';
		return this.searchInStore<Jam.WikipediaSummaryResponse>(`summary-${title}/${lang}`,
			MetaDataType.wikipedia, async () => {
				return {summary: await this.audioModule.wikipedia.summary(title, lang)};
			});
	}

	async wikidataLookup(id: string): Promise<Jam.WikidataLookupResponse> {
		return this.searchInStore<Jam.WikidataLookupResponse>(`wikidata-entity-${id}`,
			MetaDataType.wikidata, async () => {
				const entity = await this.audioModule.wikipedia.wikidata(id);
				return {id, type: DBObjectType.metadata, dataType: MetaDataType.wikidata, data: entity, date: Date.now()};
			});
	}

	async wikidataSummary(id: string, lang: string | undefined): Promise<Jam.WikipediaSummaryResponse> {
		return this.searchInStore<Jam.WikipediaSummaryResponse>(`wikidata-summary-${id}`,
			MetaDataType.wikidata, async () => {
				const lookup = await this.wikidataLookup(id);
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
					return this.wikipediaSummary(langSite.title, lang);
				}
				return {};
			});
	}

	async lyricsByTrack(track: Track): Promise<Jam.TrackLyrics> {
		if (track.tag.lyrics) {
			return {lyrics: track.tag.lyrics};
		}
		const song = track.tag.title;
		if (!song) {
			return {};
		}
		try {
			let result: Jam.TrackLyrics | undefined;
			if (track.tag.artist) {
				result = await this.lyrics(track.tag.artist, song);
			}
			if ((!result || !result.lyrics) && track.tag.albumArtist && (track.tag.artist !== track.tag.albumArtist)) {
				result = await this.lyrics(track.tag.albumArtist, song);
			}
			return result || {};
		} catch (e) {
			log.error(e);
			return {};
		}
	}
}
