import {FolderType, LastFMLookupType, MusicBrainzLookupType} from '../../model/jam-types';
import {AudioModule} from '../../modules/audio/audio.module';
import {shuffle} from '../../utils/random';
import Logger from '../../utils/logger';
import {MetaData, MetaInfo, MetaInfoAlbum, MetaInfoArtist, MetaInfoArtistSimilarArtist, MetaInfoFolderSimilarArtist, MetaInfoSimilarArtist, MetaInfoTopSong, MetaInfoTrack, MetaInfoTrackSimilarSong} from './metadata.model';
import {Folder} from '../folder/folder.model';
import {Artist} from '../artist/artist.model';
import {Album} from '../album/album.model';
import {Track} from '../track/track.model';
import {ArtistStore} from '../artist/artist.store';
import {AlbumStore} from '../album/album.store';
import {TrackStore} from '../track/track.store';
import {FolderStore} from '../folder/folder.store';
import {cVariousArtist} from '../../engine/scan/scan.service';
import {BaseStoreService} from '../base/base.service';
import {MetaDataStore, SearchQueryMetaData} from './metadata.store';
import {MusicbrainzClientApi} from '../../modules/audio/clients/musicbrainz-client.interface';
import {MusicBrainz} from '../../model/musicbrainz-rest-data';
import {MetaDataType} from './metadata.types';
import {DBObjectType} from '../../db/db.types';
import {Acoustid} from '../../model/acoustid-rest-data';
import path from 'path';
import {LastFM} from '../../model/lastfm-rest-data';
import {CoverArtArchive} from '../../model/coverartarchive-rest-data';
import {AcousticBrainz} from '../../model/acousticbrainz-rest-data';
import {FORMAT} from './metadata.format';
import {JamParameters} from '../../model/jam-rest-params';
import MusicBrainzLookup = JamParameters.MusicBrainzLookup;

const log = Logger('MetaDataService');


export class MetaDataService extends BaseStoreService<MetaData, SearchQueryMetaData> {

	constructor(private metadataStore: MetaDataStore, private folderStore: FolderStore, private trackStore: TrackStore, private albumStore: AlbumStore, private artistStore: ArtistStore, private audioModule: AudioModule) {
		super(metadataStore);
	}

	async mediaInfoArtistInfo(artistName: string): Promise<MetaInfoArtist | undefined> {
		const data = await this.audioModule.lastFM.artist(artistName);
		return FORMAT.packMediaInfoArtist(data);
	}

	async mediaInfoArtistInfoByArtistID(artistID: string): Promise<MetaInfoArtist | undefined> {
		const data = await this.lastFMLookup(LastFMLookupType.artist, artistID);
		if (data) {
			return FORMAT.packMediaInfoArtist(data.artist);
		}
	}

	async mediaInfoAlbumInfo(albumName: string, artistName: string): Promise<MetaInfoAlbum | undefined> {
		const data = await this.audioModule.lastFM.album(albumName, artistName);
		const result = FORMAT.packMediaInfoAlbum(data);
		if (result && result.mbid) {
			const mb = await this.musicbrainzLookup(MusicBrainzLookupType.release, result.mbid);
			result.releases = mb.releases;
		}
		return result;
	}

	async mediaInfoAlbumInfoByAlbumID(albumID: string): Promise<MetaInfoAlbum | undefined> {
		let result: MetaInfoAlbum | undefined;
		const data = await this.lastFMLookup(LastFMLookupType.album, albumID);
		if (data && data.album) {
			result = FORMAT.packMediaInfoAlbum(data.album);
		}
		if (result) {
			const mb = await this.musicbrainzLookup(MusicBrainzLookupType.release, albumID);
			result.releases = mb.releases;
		}
		return result;
	}

	async mediaInfoSimilarTrack(title: string, artist: string): Promise<Array<MetaInfoTrackSimilarSong>> {
		const data = await this.audioModule.lastFM.similarTrack(title, artist);
		return FORMAT.packMediaInfoSimilarSong(data);
	}

	async mediaInfoSimilarTrackByMBTrackID(trackID: string): Promise<Array<MetaInfoTrackSimilarSong>> {
		const data = await this.audioModule.lastFM.similarTrackID(trackID);
		return FORMAT.packMediaInfoSimilarSong(data);
	}

	async mediaInfoTopSongs(artistName: string): Promise<Array<MetaInfoTopSong>> {
		// TODO: get more than 50
		const data = await this.audioModule.lastFM.topArtistSongs(artistName);
		return FORMAT.packMediaInfoTopSongs(data);
	}

	async mediaInfoTopSongsByArtistID(artistID: string): Promise<Array<MetaInfoTopSong>> {
		// TODO: get more than 50
		const data = await this.audioModule.lastFM.topArtistSongsID(artistID);
		return FORMAT.packMediaInfoTopSongs(data);
	}

	private async getInfo(isArtist: boolean, artistId: string | undefined, artistName: string | undefined, albumId: string | undefined, albumName: string | undefined): Promise<MetaInfo> {
		if (isArtist) {
			let artist: MetaInfoArtist | undefined;
			let topSongs: Array<MetaInfoTopSong> = [];
			if (artistId) {
				artist = await this.mediaInfoArtistInfoByArtistID(artistId);
				topSongs = await this.mediaInfoTopSongsByArtistID(artistId);
			} else if (artistName && artistName !== cVariousArtist) {
				artist = await this.mediaInfoArtistInfo(artistName);
				topSongs = await this.mediaInfoTopSongs(artistName);
			}
			return {
				artist: artist || {},
				topSongs: topSongs || [],
				album: {}
			};
		} else {
			let album: MetaInfoAlbum | undefined;
			if (albumId) {
				album = await this.mediaInfoAlbumInfoByAlbumID(albumId);
			} else if (artistName && albumName) {
				album = await this.mediaInfoAlbumInfo(albumName, artistName);
			}
			return {
				artist: {},
				topSongs: [],
				album: album || {}
			};
		}
	}

	private async createFolderInfo(folder: Folder): Promise<MetaInfo | undefined> {
		if (!folder.tag) {
			return {
				artist: {},
				album: {},
				topSongs: []
			};
		}
		if (folder.tag.type === FolderType.artist) {
			return this.getInfo(true, folder.tag.mbArtistID, folder.tag.artist, folder.tag.mbAlbumID, folder.tag.album);
		} else if ((folder.tag.type === FolderType.album) || (folder.tag.type === FolderType.multialbum)) {
			return this.getInfo(false, folder.tag.mbArtistID, folder.tag.artist, folder.tag.mbAlbumID, folder.tag.album);
		}
	}

	private async createArtistInfo(artist: Artist): Promise<MetaInfo> {
		return this.getInfo(true, artist.mbArtistID, artist.name, undefined, undefined);
	}

	private async createAlbumInfo(album: Album): Promise<MetaInfo> {
		return this.getInfo(false, album.mbArtistID, album.artist, album.mbAlbumID, album.name);
	}

	private async createTrackInfo(track: Track): Promise<MetaInfoTrack> {
		if (!track.tag) {
			return {similar: []};
		}
		if (track.tag.mbTrackID) {
			const tracks = await this.mediaInfoSimilarTrackByMBTrackID(track.tag.mbTrackID);
			if (tracks) {
				return {similar: tracks};
			}
		} else if (track.tag.artist && track.tag.title) {
			const tracks = await this.mediaInfoSimilarTrack(track.tag.title, track.tag.artist);
			if (tracks) {
				return {similar: tracks};
			}
		}
		return {similar: []};
	}

	private async updateArtistInfo(artist: Artist): Promise<MetaInfo> {
		let info: MetaInfo;
		try {
			info = await this.createArtistInfo(artist);
		} catch (e) {
			log.error(e);
			return {album: {}, artist: {}, topSongs: []};
		}
		info = info || {album: {}, artist: {}, topSongs: []};
		artist.info = info;
		await this.artistStore.replace(artist);
		return info;
	}

	private async updateAlbumInfo(album: Album): Promise<MetaInfo> {
		let info: MetaInfo;
		try {
			info = await this.createAlbumInfo(album);
		} catch (e) {
			log.error(e);
			return {album: {}, artist: {}, topSongs: []};
		}
		info = info || {album: {}, artist: {}, topSongs: []};
		album.info = info;
		await this.albumStore.replace(album);
		return info;
	}

	private async updateTrackInfo(track: Track): Promise<MetaInfoTrack> {
		let info: MetaInfoTrack;
		try {
			info = await this.createTrackInfo(track);
		} catch (e) {
			log.error(e);
			return {similar: []};
		}
		info = info || {similar: []};
		track.info = info;
		await this.trackStore.replace(track);
		return info;
	}

	private async updateFolderInfo(folder: Folder): Promise<MetaInfo> {
		let info: MetaInfo | undefined;
		try {
			info = await this.createFolderInfo(folder);
		} catch (e) {
			log.error(e);
			return {album: {}, artist: {}, topSongs: []};
		}
		info = info || {album: {}, artist: {}, topSongs: []};
		folder.info = info;
		await this.folderStore.replace(folder);
		return info;
	}

	private async checkTopSongs(artist: MetaInfoSimilarArtist): Promise<Array<MetaInfoTopSong> | void> {
		if (artist.mbid) {
			return this.mediaInfoTopSongsByArtistID(artist.mbid);
		} else if (artist.name) {
			return this.mediaInfoTopSongs(artist.name);
		}
	}

	private async getSimilarSongs(similar: Array<MetaInfoSimilarArtist>): Promise<Array<MetaInfoTrackSimilarSong>> {
		let tracks: Array<MetaInfoTrackSimilarSong> = [];
		for (const artist of similar) {
			const songs = await this.checkTopSongs(artist);
			if (songs) {
				tracks = tracks.concat(songs.map(song => {
					return {
						name: song.name,
						artist: song.artist,
						mbid: song.mbid,
						url: song.url,
						image: song.image
					};
				}));
			}
		}
		return shuffle<MetaInfoTrackSimilarSong>(tracks);
	}

	private async getSimilarArtistTracks(similars: Array<MetaInfoSimilarArtist>): Promise<Array<Track>> {
		if (!similars || similars.length === 0) {
			return [];
		}
		const similar = await this.getSimilarSongs(similars);
		const ids: Array<MetaInfoTrackSimilarSong> = [];
		const vals: Array<MetaInfoTrackSimilarSong> = [];
		const result: Array<Track> = [];
		similar.forEach(sim => {
			if (sim.mbid) {
				ids.push(sim);
			} else {
				vals.push(sim);
			}
		});
		const mbTrackIDs = ids.map(track => track.mbid || '-').filter(id => id !== '-');
		const tracks = await this.trackStore.search({mbTrackIDs});
		ids.forEach(sim => {
			const t = tracks.find(tr => tr.tag.mbTrackID === sim.mbid);
			if (!t) {
				vals.push(sim);
			} else {
				result.push(t);
			}
		});
		for (const sim of vals) {
			const track = await this.trackStore.searchOne({title: sim.name, artist: sim.artist.name});
			if (track) {
				result.push(track);
			}
		}
		return result;
	}

	async getFolderSimilarArtists(info: MetaInfo, includeNotPresent: boolean): Promise<Array<MetaInfoFolderSimilarArtist>> {
		if (!info.artist.similar) {
			return [];
		}
		const names: Array<string> = [];
		const artistsHash: {
			[name: string]: {
				info: MetaInfoSimilarArtist;
				folder?: Folder;
			}
		} = {};
		info.artist.similar.forEach(a => {
			if (a.name) {
				names.push(a.name);
				artistsHash[a.name] = {info: a};
			}
		});
		const folders = await this.folderStore.search({types: [FolderType.artist], artists: names});
		folders.forEach(f => {
			const name = f.tag.artist || '';
			if (artistsHash[name]) {
				artistsHash[name].folder = f;
			} else {
				console.log('what? a child not in the name list?', f, artistsHash);
			}
		});
		const artists: Array<MetaInfoFolderSimilarArtist> = [];
		Object.keys(artistsHash).forEach(key => {
			const a = artistsHash[key];
			if (a.folder) {
				const artist: MetaInfoFolderSimilarArtist = {
					// id: a.folder.id,
					name: key,
					folder: a.folder
				};
				artists.push(artist);
			} else if (includeNotPresent) {
				const artist: MetaInfoFolderSimilarArtist = {
					name: key
				};
				artists.push(artist);
			}
		});
		return artists;
	}

	async getSimilarArtists(info: MetaInfo, includeNotPresent: boolean): Promise<Array<MetaInfoArtistSimilarArtist>> {
		if (!info.artist.similar) {
			return [];
		}
		const names: Array<string> = [];
		const artistsHash: {
			[name: string]: {
				info: MetaInfoSimilarArtist;
				artist?: Artist;
			}
		} = {};
		info.artist.similar.forEach(a => {
			if (a.name) {
				names.push(a.name);
				artistsHash[a.name] = {info: a};
			}
		});
		const artists = await this.artistStore.search({names});
		artists.forEach(a => {
			const name = a.name || '';
			if (artistsHash[name]) {
				artistsHash[name].artist = a;
			} else {
				console.log('what? a child not in the name list?', a, artistsHash);
			}
		});
		const result: Array<MetaInfoFolderSimilarArtist> = [];
		Object.keys(artistsHash).forEach(key => {
			const a = artistsHash[key];
			if (a.artist) {
				const artist: MetaInfoArtistSimilarArtist = {
					// id: a.folder.id,
					name: key,
					artist: a.artist
				};
				result.push(artist);
			} else if (includeNotPresent) {
				const artist: MetaInfoArtistSimilarArtist = {
					name: key
				};
				result.push(artist);
			}
		});
		return result;
	}

	async getFolderArtistInfo(folder: Folder, includeNotPresent: boolean, includeSimilar: boolean): Promise<{ similar?: Array<MetaInfoFolderSimilarArtist>, info: MetaInfo }> {
		let info = folder.info;
		if (!info) {
			info = await this.updateFolderInfo(folder);
		}
		if (!includeSimilar || !info.artist.similar) {
			return {info};
		}
		const similar = await this.getFolderSimilarArtists(info, includeNotPresent);
		return {similar, info};
	}

	async getArtistInfos(artist: Artist, includeNotPresent: boolean, includeSimilar: boolean): Promise<{ similar?: Array<MetaInfoArtistSimilarArtist>, info: MetaInfo }> {
		let info = artist.info;
		if (!info) {
			info = await this.updateArtistInfo(artist);
		}
		if (!includeSimilar || !info.artist.similar) {
			return {info};
		}
		const similar = await this.getSimilarArtists(info, includeNotPresent);
		return {similar, info};
	}

	async getFolderInfo(folder: Folder): Promise<MetaInfo> {
		if (folder.info) {
			return folder.info;
		} else {
			return this.updateFolderInfo(folder);
		}
	}

	async getAlbumInfo(album: Album): Promise<MetaInfo> {
		if (album.info) {
			return album.info;
		} else {
			return this.updateAlbumInfo(album);
		}
	}

	async getTrackInfo(track: Track): Promise<MetaInfoTrack | undefined> {
		if (track.info) {
			return track.info;
		}
	}

	async getTopTracks(artist: string, count: number): Promise<Array<Track>> {
		const folder = await this.folderStore.searchOne({types: [FolderType.artist], artist});
		if (!folder) {
			return [];
		}
		let info = folder.info;
		if (!info) {
			info = await this.updateFolderInfo(folder);
		}
		if (info.topSongs && info.topSongs.length > 0) {
			const ids: Array<MetaInfoTopSong> = [];
			const vals: Array<MetaInfoTopSong> = [];
			const result: Array<Track> = [];
			info.topSongs.forEach(top => {
				if (top.mbid) {
					ids.push(top);
				} else {
					vals.push(top);
				}
			});
			const mbTrackIDs = ids.map(track => track.mbid || '-').filter(i => i !== '-');
			const tracks = await this.trackStore.search({mbTrackIDs});
			ids.forEach(sim => {
				const t = tracks.find(tr => tr.tag.mbTrackID === sim.mbid);
				if (!t) {
					vals.push(sim);
				} else {
					result.push(t);
				}
			});
			for (const top of vals) {
				const track = await this.trackStore.searchOne({title: top.name, artist: top.artist.name});
				if (track) {
					result.push(track);
				}
			}
			return result;
		}
		return [];
	}

	async getAlbumSimilarTracks(album: Album): Promise<Array<Track>> {
		const info = await this.getAlbumInfo(album);
		if (!info || !info.artist.similar) {
			return [];
		}
		return this.getSimilarArtistTracks(info.artist.similar);
	}

	async getArtistSimilarTracks(artist: Artist): Promise<Array<Track>> {
		const info = await this.getArtistInfos(artist, false, false);
		if (!info || !info.similar) {
			return [];
		}
		return this.getSimilarArtistTracks(info.similar);
	}

	async getFolderSimilarTracks(folder: Folder): Promise<Array<Track>> {
		const info = await this.getFolderInfo(folder);
		if (!info || !info.artist.similar) {
			return [];
		}
		return this.getSimilarArtistTracks(info.artist.similar);
	}

	async getTrackSimilarTracks(track: Track): Promise<Array<Track>> {
		const info = await this.getTrackInfo(track);
		if (!info || !info.similar || info.similar.length === 0) {
			return [];
		}
		const ids: Array<MetaInfoTrackSimilarSong> = [];
		const vals: Array<MetaInfoTrackSimilarSong> = [];
		const result: Array<Track> = [];
		info.similar.forEach(sim => {
			if (sim.mbid) {
				ids.push(sim);
			} else {
				vals.push(sim);
			}
		});
		const mbTrackIDs = ids.map(t => t.mbid || '-').filter(i => i !== '-');
		const tracks = await this.trackStore.search({mbTrackIDs});
		ids.forEach(sim => {
			const t = tracks.find(tr => tr.tag.mbTrackID === sim.mbid);
			if (!t) {
				vals.push(sim);
			} else {
				result.push(t);
			}
		});
		for (const sim of vals) {
			const t = await this.trackStore.searchOne({title: sim.name, artist: sim.artist.name});
			if (t) {
				result.push(t);
			}
		}
		return result;
	}

// async musicbrainzAlbumByFolder(folder: Folder): Promise<MusicBrainz.Response> {
// 	const query: MusicbrainzClientApi.SearchQueryRelease = {
// 		arid: folder.tag.mbArtistID,
// 		artist: folder.tag.artist,
// 		release: folder.tag.album || folder.tag.title
// 	};
// 	return this.musicbrainz.search({type: 'release', query});
// }

	async musicbrainzSearch(type: string, query: MusicbrainzClientApi.SearchQuery): Promise<MusicBrainz.Response> {
		const name = 'search-' + type + JSON.stringify(query);
		const result = await this.metadataStore.searchOne({name, dataType: MetaDataType.musicbrainz});
		if (result) {
			return result.data;
		}
		const brainz = await this.audioModule.musicbrainzSearch(type, query);
		await this.metadataStore.add({id: '', name, type: DBObjectType.metadata, dataType: MetaDataType.musicbrainz, data: brainz});
		return brainz;
	}

	async acoustidLookupTrack(track: Track, includes: string | undefined): Promise<Array<Acoustid.Result>> {
		const acoustid = await this.audioModule.acoustidLookup(path.join(track.path, track.name), includes);
		return acoustid;
	}

	async lastFMLookup(type: string, mbid: string): Promise<LastFM.Result> {
		const name = 'lookup-' + type + mbid;
		// TODO: get more than 50
		const result = await this.metadataStore.searchOne({name, dataType: MetaDataType.lastfm});
		if (result) {
			return result.data;
		}
		const lastfm = await this.audioModule.lastFMLookup(type, mbid);
		await this.metadataStore.add({id: '', name, type: DBObjectType.metadata, dataType: MetaDataType.lastfm, data: lastfm});
		return lastfm;
	}

	async acousticbrainzLookup(mbid: string, nr: number | undefined): Promise<AcousticBrainz.Response> {
		const name = 'lookup-' + mbid + (nr !== undefined) ? '-' + nr : '';
		const result = await this.metadataStore.searchOne({name, dataType: MetaDataType.acousticbrainz});
		if (result) {
			return result.data;
		}
		const abrainz = await this.audioModule.acousticbrainzLookup(mbid, nr);
		await this.metadataStore.add({id: '', name, type: DBObjectType.metadata, dataType: MetaDataType.acousticbrainz, data: abrainz});
		return abrainz;
	}

	async coverartarchiveLookup(type: string, mbid: string): Promise<CoverArtArchive.Response> {
		const name = 'lookup-' + type + mbid;
		const result = await this.metadataStore.searchOne({name, dataType: MetaDataType.coverartarchive});
		if (result) {
			return result.data;
		}
		const caa = await this.audioModule.coverartarchiveLookup(type, mbid);
		await this.metadataStore.add({id: '', name, type: DBObjectType.metadata, dataType: MetaDataType.coverartarchive, data: caa});
		return caa;
	}

	async musicbrainzLookup(type: string, mbid: string, inc?: string): Promise<MusicBrainz.Response> {
		const name = 'lookup-' + type + mbid + (inc ? inc : '');
		const result = await this.metadataStore.searchOne({name, dataType: MetaDataType.musicbrainz});
		if (result) {
			return result.data;
		}
		const brainz = await this.audioModule.musicbrainzLookup(type, mbid, inc);
		await this.metadataStore.add({id: '', name, type: DBObjectType.metadata, dataType: MetaDataType.musicbrainz, data: brainz});
		return brainz;
	}
}
