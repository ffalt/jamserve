import moment from 'moment';
import path from 'path';
import {DBObjectType} from '../../db/db.types';
import {AcousticBrainz} from '../../model/acousticbrainz-rest-data';
import {Acoustid} from '../../model/acoustid-rest-data';
import {CoverArtArchive} from '../../model/coverartarchive-rest-data';
import {Jam} from '../../model/jam-rest-data';
import {FolderType, LastFMLookupType, MusicBrainzLookupType, MusicBrainzSearchType} from '../../model/jam-types';
import {LastFM} from '../../model/lastfm-rest-data';
import {MusicBrainz} from '../../model/musicbrainz-rest-data';
import {AudioModule} from '../../modules/audio/audio.module';
import {MusicbrainzClientApi} from '../../modules/audio/clients/musicbrainz-client.interface';
import Logger from '../../utils/logger';
import {shuffle} from '../../utils/random';
import {Album} from '../album/album.model';
import {AlbumStore} from '../album/album.store';
import {Artist} from '../artist/artist.model';
import {ArtistStore} from '../artist/artist.store';
import {BaseStoreService} from '../base/base.service';
import {Folder} from '../folder/folder.model';
import {FolderStore} from '../folder/folder.store';
import {Track} from '../track/track.model';
import {TrackStore} from '../track/track.store';
import {MetaData} from './metadata.model';
import {MetaDataStore, SearchQueryMetaData} from './metadata.store';
import {MetaDataType} from './metadata.types';

const log = Logger('Metadata');

function stripInlineLastFM(content: string): string {
	return (content || '').replace(/<a href=".*">Read more on Last\.fm<\/a>\.?/g, '')
		.replace(/<a .* href=".*">Read more on Last\.fm<\/a>\.?/g, '')
		.replace('User-contributed text is available under the Creative Commons By-SA License; additional terms may apply.', '');
}

function stripInlineWikipediaHTML(content: string): string {
	return (content || '')
		.replace(/<p class="mw-empty-elt">\s*<\/p>/g, '')
		.replace(/<p>/g, '')
		.replace(/<\/p>/g, '\n');
}

interface SimilarArtist {
	name: string;
	url: string;
	mbid: string;
}

interface Song {
	name: string;
	artist: string;
	mbid: string;
	url: string;
}

export class MetaDataService extends BaseStoreService<MetaData, SearchQueryMetaData> {

	constructor(private metadataStore: MetaDataStore, private folderStore: FolderStore, private trackStore: TrackStore, private albumStore: AlbumStore, private artistStore: ArtistStore, private audioModule: AudioModule) {
		super(metadataStore);
	}

	private async getMusicBrainzIDWikipediaArtistInfo(mbArtistID: string): Promise<Jam.ExtendedInfo | undefined> {
		const result = await this.musicbrainzLookup(MusicBrainzLookupType.artist, mbArtistID);
		if (result && result.artist && result.artist.relations) {
			let rel = result.artist.relations.find(r => r.type === 'wikidata');
			if (rel && rel.url && rel.url.resource) {
				const list = rel.url.resource.split('/');
				const id = list[list.length - 1];
				const wiki = await this.wikidataSummary(id, 'en');
				if (wiki && wiki.summary) {
					const info: Jam.ExtendedInfo = {
						url: wiki.summary.url,
						description: stripInlineWikipediaHTML(wiki.summary.summary),
						source: 'Wikipedia',
						license: 'Creative Commons BY-SA license',
						licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0/'
					};
					return info;
				}
			}
			rel = result.artist.relations.find(r => r.type === 'wikipedia');
			if (rel && rel.url && rel.url.resource) {
				const list = rel.url.resource.split('/');
				const title = list[list.length - 1];
				const lang = list[2].split('.')[0];
				const wiki = await this.wikipediaSummary(title, lang);
				if (wiki && wiki.summary) {
					const info: Jam.ExtendedInfo = {
						url: wiki.summary.url,
						description: stripInlineWikipediaHTML(wiki.summary.summary),
						source: 'Wikipedia',
						license: 'Creative Commons BY-SA license',
						licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0/'
					};
					return info;
				}
			}
		}
		return;
	}

	private async getMusicBrainzIDWikipediaAlbumInfo(mbReleaseID: string): Promise<Jam.ExtendedInfo | undefined> {
		const result = await this.musicbrainzLookup(MusicBrainzLookupType.release, mbReleaseID);
		if (result && result.release && result.release.relations) {
			const rel = result.release.relations.find(r => r.type === 'wikidata');
			if (rel && rel.url && rel.url.resource) {
				const list = rel.url.resource.split('/');
				const id = list[list.length - 1];
				const wiki = await this.wikidataSummary(id, 'en');
				if (wiki && wiki.summary) {
					const info: Jam.ExtendedInfo = {
						url: wiki.summary.url,
						description: stripInlineWikipediaHTML(wiki.summary.summary),
						source: 'Wikipedia',
						license: 'Creative Commons BY-SA license',
						licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0/'
					};
					return info;
				}
			}
		}
		return;
	}

	private async getLastFMArtistInfo(mbArtistID: string): Promise<Jam.ExtendedInfo | undefined> {
		const result = await this.lastFMLookup(LastFMLookupType.artist, mbArtistID);
		if (result && result.artist && result.artist.bio && result.artist.bio.content) {
			const info: Jam.ExtendedInfo = {
				url: result.artist.url,
				description: stripInlineLastFM(result.artist.bio.content),
				source: 'LastFM',
				license: 'Creative Commons BY-SA license',
				licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0/'
			};
			return info;
		}
		return;
	}

	private async getLastFMAlbumInfo(mbReleaseID: string): Promise<Jam.ExtendedInfo | undefined> {
		const result = await this.lastFMLookup(LastFMLookupType.album, mbReleaseID);
		if (result && result.album && result.album.wiki && result.album.wiki.content) {
			const info: Jam.ExtendedInfo = {
				url: result.album.url,
				description: stripInlineLastFM(result.album.wiki.content),
				source: 'LastFM',
				license: 'Creative Commons BY-SA license',
				licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0/'
			};
			return info;
		}
	}

	private async getArtistInfoByMusicBrainzID(mbArtistID: string): Promise<Jam.ExtendedInfo | undefined> {
		const info = await this.getMusicBrainzIDWikipediaArtistInfo(mbArtistID);
		if (info) {
			return info;
		}
		return this.getLastFMArtistInfo(mbArtistID);
	}

	private async getAlbumInfoByMusicBrainzID(mbReleaseID: string): Promise<Jam.ExtendedInfo | undefined> {
		let info = await this.getMusicBrainzIDWikipediaAlbumInfo(mbReleaseID);
		if (info) {
			return info;
		}
		info = await this.getLastFMAlbumInfo(mbReleaseID);
		if (info) {
			return info;
		}
		return;
	}

	private async getArtistInfoByName(artistName: string): Promise<Jam.ExtendedInfo | undefined> {
		const res = await this.musicbrainzSearch(MusicBrainzSearchType.artist, {artist: artistName});
		if (res && res.artists && res.artists.length === 1) {
			const info = await this.getArtistInfoByMusicBrainzID(res.artists[0].id);
			if (info) {
				return info;
			}
		}
		const lastfm = await this.lastFMArtistSearch(artistName);
		if (lastfm && lastfm.artist && lastfm.artist.mbid) {
			const info = await this.getArtistInfoByMusicBrainzID(lastfm.artist.mbid);
			if (info) {
				return info;
			}
		}
		return;
	}

	private async getAlbumInfoByName(albumName: string, artistName: string): Promise<Jam.ExtendedInfo | undefined> {
		const res = await this.musicbrainzSearch(MusicBrainzSearchType.release, {release: albumName, artist: artistName});
		if (res && res.releases && res.releases.length > 1) {
			const info = await this.getAlbumInfoByMusicBrainzID(res.releases[0].id);
			if (info) {
				return info;
			}
		}
		const lastfm = await this.lastFMAlbumSearch(albumName, artistName);
		if (lastfm && lastfm.album && lastfm.album.mbid) {
			const info = await this.getAlbumInfoByMusicBrainzID(lastfm.album.mbid);
			if (info) {
				return info;
			}
		}
		return;
	}

	// ExtendedInfos

	async getArtistInfo(artist: Artist): Promise<Jam.ExtendedInfo | undefined> {
		try {
			if (artist.mbArtistID) {
				const info = await this.getArtistInfoByMusicBrainzID(artist.mbArtistID);
				if (info) {
					return info;
				}
			}
			if (artist.name) {
				const info = await this.getArtistInfoByName(artist.name);
				if (info) {
					return info;
				}
			}
		} catch (e) {
			log.error(e);
		}
	}

	async getAlbumInfo(album: Album): Promise<Jam.ExtendedInfo | undefined> {
		try {
			if (album.mbAlbumID) {
				const info = await this.getAlbumInfoByMusicBrainzID(album.mbAlbumID);
				if (info) {
					return info;
				}
			}
			if (album.name && album.artist) {
				const info = await this.getAlbumInfoByName(album.name, album.artist);
				if (info) {
					return info;
				}
			}
		} catch (e) {
			log.error(e);
		}
	}

	async getFolderArtistInfo(folder: Folder): Promise<Jam.ExtendedInfo | undefined> {
		try {
			if (folder.tag.mbArtistID) {
				const info = await this.getArtistInfoByMusicBrainzID(folder.tag.mbArtistID);
				if (info) {
					return info;
				}
			}
			if (folder.tag.artist) {
				const info = await this.getArtistInfoByName(folder.tag.artist);
				if (info) {
					return info;
				}
			}
		} catch (e) {
			log.error(e);
		}
	}

	async getFolderAlbumInfo(folder: Folder): Promise<Jam.ExtendedInfo | undefined> {
		try {
			if (folder.tag.mbAlbumID) {
				const info = await this.getAlbumInfoByMusicBrainzID(folder.tag.mbAlbumID);
				if (info) {
					return info;
				}
			}
			if (folder.tag.album && folder.tag.artist) {
				const info = await this.getAlbumInfoByName(folder.tag.album, folder.tag.artist);
				if (info) {
					return info;
				}
			}
		} catch (e) {
			log.error(e);
		}
	}

	// similar artists

	private async getLastFMSimilarArtists(mbArtistID: string): Promise<Array<SimilarArtist>> {
		const lastfm = await this.lastFMLookup(LastFMLookupType.artist, mbArtistID);
		if (lastfm && lastfm.artist && lastfm.artist.similar && lastfm.artist.similar.artist) {
			return lastfm.artist.similar.artist;
		}
		return [];
	}

	private async findSimilarArtistFolders(similarArtists: Array<SimilarArtist>): Promise<Array<Folder>> {
		const names: Array<string> = [];
		similarArtists.forEach(a => {
			if (a.name) {
				names.push(a.name);
			}
		});
		return (await this.folderStore.search({types: [FolderType.artist], artists: names})).items;
	}

	private async findSimilarArtists(similarArtists: Array<SimilarArtist>): Promise<Array<Artist>> {
		const names: Array<string> = [];
		similarArtists.forEach(a => {
			if (a.name) {
				names.push(a.name);
			}
		});
		return (await this.artistStore.search({names})).items;
	}

	private async getSimilarArtistsInfo(mbArtistID?: string, artist?: string): Promise<Array<SimilarArtist>> {
		let similar: Array<SimilarArtist> = [];
		if (mbArtistID) {
			similar = await this.getLastFMSimilarArtists(mbArtistID);
		} else if (artist) {
			const a = await this.lastFMArtistSearch(artist);
			if (a && a.artist) {
				similar = await this.getLastFMSimilarArtists(a.artist.mbid);
			}
		}
		return similar;
	}

	async getSimilarArtists(artist: Artist): Promise<Array<Artist>> {
		try {
			const similar = await this.getSimilarArtistsInfo(artist.mbArtistID, artist.name);
			if (similar && similar.length > 0) {
				return this.findSimilarArtists(similar);
			}
		} catch (e) {
			log.error(e);
		}
		return [];
	}

	async getSimilarArtistFolders(folder: Folder): Promise<Array<Folder>> {
		try {
			const similar = await this.getSimilarArtistsInfo(folder.tag.mbArtistID, folder.tag.artist);
			if (similar && similar.length > 0) {
				return this.findSimilarArtistFolders(similar);
			}
		} catch (e) {
			log.error(e);
		}
		return [];
	}

	// similar tracks

	private async findSimilarTracks(songs: Array<Song>): Promise<Array<Track>> {
		const ids: Array<Song> = [];
		const vals: Array<Song> = [];
		const result: Array<Track> = [];
		songs.forEach(sim => {
			if (sim.mbid) {
				ids.push(sim);
			} else {
				vals.push(sim);
			}
		});
		const mbTrackIDs = ids.map(track => track.mbid || '-').filter(id => id !== '-');
		const list = await this.trackStore.search({mbTrackIDs});
		ids.forEach(sim => {
			const t = list.items.find(tr => tr.tag.mbTrackID === sim.mbid);
			if (!t) {
				vals.push(sim);
			} else {
				result.push(t);
			}
		});
		for (const sim of vals) {
			const track = await this.trackStore.searchOne({title: sim.name, artist: sim.artist});
			if (track) {
				result.push(track);
			}
		}
		return result;
	}

	private async getSimilarSongs(similar: Array<SimilarArtist>): Promise<Array<Song>> {
		let tracks: Array<Song> = [];
		for (const artist of similar) {
			let data: LastFM.Result | undefined;
			if (artist.mbid) {
				data = await this.lastFMTopTracksArtistID(artist.mbid);
			} else if (artist.name) {
				data = await this.lastFMTopTracksArtist(artist.name);
			}
			if (data && data.toptracks && data.toptracks.track) {
				tracks = tracks.concat(data.toptracks.track.map(song => {
					return {
						name: song.name,
						artist: song.artist.name,
						mbid: song.mbid,
						url: song.url
					};
				}));
			}
		}
		return shuffle(tracks);
	}

	private async getSimilarArtistTracks(similars: Array<SimilarArtist>): Promise<Array<Track>> {
		if (!similars || similars.length === 0) {
			return [];
		}
		const songs = await this.getSimilarSongs(similars);
		return this.findSimilarTracks(songs);
	}

	async getTopTracks(artist: string): Promise<Array<Track>> {
		const result = await this.lastFMTopTracksArtist(artist);
		if (result && result.toptracks && result.toptracks.track) {
			const songs: Array<Song> = result.toptracks.track.map(t => {
				return {
					name: t.name,
					artist: t.artist.name,
					mbid: t.mbid,
					url: t.url
				};
			});
			return this.findSimilarTracks(songs);
		}
		return [];
	}

	async getAlbumSimilarTracks(album: Album): Promise<Array<Track>> {
		const similar = await this.getSimilarArtistsInfo(album.mbArtistID, album.artist);
		return this.getSimilarArtistTracks(similar);
	}

	async getArtistSimilarTracks(artist: Artist): Promise<Array<Track>> {
		const similar = await this.getSimilarArtistsInfo(artist.mbArtistID, artist.name);
		return this.getSimilarArtistTracks(similar);
	}

	async getFolderSimilarTracks(folder: Folder): Promise<Array<Track>> {
		const similar = await this.getSimilarArtistsInfo(folder.tag.mbArtistID, folder.tag.artist);
		return this.getSimilarArtistTracks(similar);
	}

	async getTrackSimilarTracks(track: Track): Promise<Array<Track>> {
		if (track.tag.mbTrackID) {
			const data = await this.lastFMSimilarTracks(track.tag.mbTrackID);
			if (data && data.similartracks && data.similartracks.track) {
				const songs = data.similartracks.track.map(t => {
					return {
						name: t.name,
						artist: t.artist.name,
						mbid: t.mbid,
						url: t.url
					};
				});
				return this.findSimilarTracks(songs);
			}
		}
		return [];
	}

	// generic searches

	async musicbrainzSearch(type: string, query: MusicbrainzClientApi.SearchQuery): Promise<MusicBrainz.Response> {
		const name = 'search-' + type + JSON.stringify(query);
		const result = await this.metadataStore.searchOne({name, dataType: MetaDataType.musicbrainz});
		if (result) {
			return result.data;
		}
		const brainz = await this.audioModule.musicbrainzSearch(type, query);
		await this.metadataStore.add({id: '', name, type: DBObjectType.metadata, dataType: MetaDataType.musicbrainz, data: brainz, date: Date.now()});
		return brainz;
	}

	async acoustidLookupTrack(track: Track, includes: string | undefined): Promise<Array<Acoustid.Result>> {
		const acoustid = await this.audioModule.acoustidLookup(path.join(track.path, track.name), includes);
		return acoustid;
	}

	async lastFMLookup(type: string, mbid: string): Promise<LastFM.Result> {
		const name = 'lookup-' + type + mbid;
		const result = await this.metadataStore.searchOne({name, dataType: MetaDataType.lastfm});
		if (result) {
			return result.data;
		}
		const lastfm = await this.audioModule.lastFMLookup(type, mbid);
		await this.metadataStore.add({id: '', name, type: DBObjectType.metadata, dataType: MetaDataType.lastfm, data: lastfm, date: Date.now()});
		return lastfm;
	}

	async lastFMAlbumSearch(album: string, artist: string): Promise<LastFM.Result> {
		const name = 'search-album-' + album + '//' + artist;
		const result = await this.metadataStore.searchOne({name, dataType: MetaDataType.lastfm});
		if (result) {
			return result.data;
		}
		const lastfm = {album: await this.audioModule.lastFM.album(album, artist)};
		await this.metadataStore.add({id: '', name, type: DBObjectType.metadata, dataType: MetaDataType.lastfm, data: lastfm, date: Date.now()});
		return lastfm;
	}

	async lastFMArtistSearch(artist: string): Promise<LastFM.Result> {
		const name = 'search-artist-' + artist;
		const result = await this.metadataStore.searchOne({name, dataType: MetaDataType.lastfm});
		if (result) {
			return result.data;
		}
		const lastfm = {artist: await this.audioModule.lastFM.artist(artist)};
		await this.metadataStore.add({id: '', name, type: DBObjectType.metadata, dataType: MetaDataType.lastfm, data: lastfm, date: Date.now()});
		return lastfm;
	}

	async lastFMTopTracksArtist(artist: string): Promise<LastFM.Result> {
		const name = 'toptracks-artist-' + artist;
		const result = await this.metadataStore.searchOne({name, dataType: MetaDataType.lastfm});
		if (result) {
			return result.data;
		}
		const lastfm = {toptracks: await this.audioModule.lastFM.topArtistSongs(artist)};
		await this.metadataStore.add({id: '', name, type: DBObjectType.metadata, dataType: MetaDataType.lastfm, data: lastfm, date: Date.now()});
		return lastfm;
	}

	async lastFMTopTracksArtistID(mbid: string): Promise<LastFM.Result> {
		const name = 'toptracks-artistid-' + mbid;
		const result = await this.metadataStore.searchOne({name, dataType: MetaDataType.lastfm});
		if (result) {
			return result.data;
		}
		const lastfm = {toptracks: await this.audioModule.lastFM.topArtistSongsID(mbid)};
		await this.metadataStore.add({id: '', name, type: DBObjectType.metadata, dataType: MetaDataType.lastfm, data: lastfm, date: Date.now()});
		return lastfm;
	}

	async lastFMSimilarTracks(mbid: string): Promise<LastFM.Result> {
		const name = 'similar-trackid-' + mbid;
		const result = await this.metadataStore.searchOne({name, dataType: MetaDataType.lastfm});
		if (result) {
			return result.data;
		}
		const lastfm = {similartracks: await this.audioModule.lastFM.similarTrackID(mbid)};
		await this.metadataStore.add({id: '', name, type: DBObjectType.metadata, dataType: MetaDataType.lastfm, data: lastfm, date: Date.now()});
		return lastfm;
	}

	async acousticbrainzLookup(mbid: string, nr: number | undefined): Promise<AcousticBrainz.Response> {
		const name = 'lookup-' + mbid + (nr !== undefined) ? '-' + nr : '';
		const result = await this.metadataStore.searchOne({name, dataType: MetaDataType.acousticbrainz});
		if (result) {
			return result.data;
		}
		const abrainz = await this.audioModule.acousticbrainzLookup(mbid, nr);
		await this.metadataStore.add({id: '', name, type: DBObjectType.metadata, dataType: MetaDataType.acousticbrainz, data: abrainz, date: Date.now()});
		return abrainz;
	}

	async coverartarchiveLookup(type: string, mbid: string): Promise<CoverArtArchive.Response> {
		const name = 'lookup-' + type + mbid;
		const result = await this.metadataStore.searchOne({name, dataType: MetaDataType.coverartarchive});
		if (result) {
			return result.data;
		}
		const caa = await this.audioModule.coverartarchiveLookup(type, mbid);
		await this.metadataStore.add({id: '', name, type: DBObjectType.metadata, dataType: MetaDataType.coverartarchive, data: caa, date: Date.now()});
		return caa;
	}

	async musicbrainzLookup(type: string, mbid: string, inc?: string): Promise<MusicBrainz.Response> {
		const name = 'lookup-' + type + mbid + (inc ? inc : '');
		const result = await this.metadataStore.searchOne({name, dataType: MetaDataType.musicbrainz});
		if (result) {
			return result.data;
		}
		const brainz = await this.audioModule.musicbrainzLookup(type, mbid, inc);
		await this.metadataStore.add({id: '', name, type: DBObjectType.metadata, dataType: MetaDataType.musicbrainz, data: brainz, date: Date.now()});
		return brainz;
	}

	async lyrics(artist: string, song: string): Promise<Jam.TrackLyrics> {
		const name = 'lyrics-' + artist + '/' + song;
		const result = await this.metadataStore.searchOne({name, dataType: MetaDataType.lyrics});
		if (result) {
			return result.data;
		}
		const lyrics = await this.audioModule.getLyrics(artist, song) || {};
		await this.metadataStore.add({id: '', name, type: DBObjectType.metadata, dataType: MetaDataType.lyrics, data: lyrics, date: Date.now()});
		return lyrics;
	}

	async wikipediaSummary(title: string, lang: string | undefined): Promise<Jam.WikipediaSummaryResponse> {
		lang = lang || 'en';
		const name = 'summary-' + title + '/' + lang;
		const result = await this.metadataStore.searchOne({name, dataType: MetaDataType.wikipedia});
		if (result) {
			return result.data;
		}
		const pedia = {summary: await this.audioModule.wikipediaSummary(title, lang)};
		await this.metadataStore.add({id: '', name, type: DBObjectType.metadata, dataType: MetaDataType.wikipedia, data: pedia, date: Date.now()});
		return pedia;
	}

	async wikidataLookup(id: string): Promise<Jam.WikidataLookupResponse> {
		const name = 'wikidata-entity-' + id;
		let result = await this.metadataStore.searchOne({name, dataType: MetaDataType.wikidata});
		if (result) {
			return {entity: result.data};
		}
		const entity = await this.audioModule.wikidataID(id);
		result = {id: '', name, type: DBObjectType.metadata, dataType: MetaDataType.wikidata, data: entity, date: Date.now()};
		await this.metadataStore.add(result);
		return {entity};
	}

	async wikidataSummary(id: string, lang: string | undefined): Promise<Jam.WikipediaSummaryResponse> {
		const lookup = await this.wikidataLookup(id);
		if (!lookup.entity) {
			return {};
		}
		lang = lang || 'en';
		const site = lang + 'wiki';
		if (lookup.entity.sitelinks) {
			const langSite = lookup.entity.sitelinks[site];
			if (!langSite) {
				return {};
			}
			return this.wikipediaSummary(langSite.title, lang);
		}
		return {};
	}

	async cleanUp(): Promise<void> {
		const olderThan = Date.now() - moment.duration(1, 'd').asMilliseconds();
		const removed = await this.metadataStore.removeByQuery({olderThan});
		if (removed > 0) {
			log.info(`Removed meta data cache entries: ${removed} `);
		}
	}

}
