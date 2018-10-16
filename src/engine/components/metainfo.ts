import {JamServe} from '../../model/jamserve';
import {FolderType} from '../../types';
import {Store} from '../../store/store';
import {Audio} from '../../audio/audio';
import {shuffle} from '../../utils/random';
import Logger from '../../utils/logger';
import MetaInfoSimilarArtist = JamServe.MetaInfoSimilarArtist;

const log = Logger('Metainfo');

export class Metainfo {
	private store: Store;
	private audio: Audio;

	constructor(store: Store, audio: Audio) {
		this.store = store;
		this.audio = audio;
	}

	private async getInfo(isArtist: boolean, artistId: string | undefined, artistName: string | undefined, albumId: string | undefined, albumName: string | undefined): Promise<JamServe.MetaInfo> {
		const audio = this.audio;

		async function checkAlbumById(): Promise<JamServe.MetaInfoAlbum | undefined> {
			if (albumId) {
				return audio.mediaInfoAlbumInfoByAlbumID(albumId);
			}
		}

		async function checkAlbumByNameAndArtist(): Promise<JamServe.MetaInfoAlbum | undefined> {
			if (artistName && albumName) {
				return audio.mediaInfoAlbumInfo(albumName, artistName);
			}
		}

		async function checkAlbum(): Promise<JamServe.MetaInfoAlbum | undefined> {
			const data = await checkAlbumById();
			if (data) {
				return data;
			}
			return checkAlbumByNameAndArtist();
		}

		async function checkArtist(): Promise<JamServe.MetaInfoArtist | undefined> {
			if (artistId) {
				return audio.mediaInfoArtistInfoByArtistID(artistId);
			} else if (artistName) {
				return audio.mediaInfoArtistInfo(artistName);
			}
		}

		async function checkTopSongs(): Promise<Array<JamServe.MetaInfoTopSong> | undefined> {
			if (artistId) {
				return audio.mediaInfoTopSongsByArtistID(artistId);
			} else if (artistName) {
				return audio.mediaInfoTopSongs(artistName);
			}
		}


		if (isArtist) {
			const artist = await checkArtist();
			const topSongs = await checkTopSongs();
			return {
				artist: artist || {},
				topSongs: topSongs || [],
				album: {}
			};
		} else {
			const album = await checkAlbum();
			return {
				artist: {},
				topSongs: [],
				album: album || {}
			};
		}
	}

	private async createFolderInfo(folder: JamServe.Folder): Promise<JamServe.MetaInfo | undefined> {
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

	private async createArtistInfo(artist: JamServe.Artist): Promise<JamServe.MetaInfo> {
		return this.getInfo(true, artist.mbArtistID, artist.name, undefined, undefined);
	}

	private async createAlbumInfo(album: JamServe.Album): Promise<JamServe.MetaInfo> {
		return this.getInfo(false, album.mbArtistID, album.artist, album.mbAlbumID, album.name);
	}

	private async createTrackInfo(track: JamServe.Track): Promise<JamServe.MetaInfoTrack> {
		if (!track.tag) {
			return {similar: []};
		}
		if (track.tag.mbTrackID) {
			const tracks = await this.audio.mediaInfoSimilarTrackByMBTrackID(track.tag.mbTrackID);
			if (tracks) {
				return {similar: tracks};
			}
		} else if (track.tag.artist && track.tag.title) {
			const tracks = await this.audio.mediaInfoSimilarTrack(track.tag.title, track.tag.artist);
			if (tracks) {
				return {similar: tracks};
			}
		}
		return {similar: []};
	}

	private async updateArtistInfo(artist: JamServe.Artist): Promise<JamServe.MetaInfo> {
		let info: JamServe.MetaInfo;
		try {
			info = await this.createArtistInfo(artist);
		} catch (e) {
			log.error(e);
			return {album: {}, artist: {}, topSongs: []};
		}
		info = info || {album: {}, artist: {}, topSongs: []};
		artist.info = info;
		await this.store.artist.replace(artist);
		return info;
	}

	private async updateAlbumInfo(album: JamServe.Album): Promise<JamServe.MetaInfo> {
		let info: JamServe.MetaInfo;
		try {
			info = await this.createAlbumInfo(album);
		} catch (e) {
			log.error(e);
			return {album: {}, artist: {}, topSongs: []};
		}
		info = info || {album: {}, artist: {}, topSongs: []};
		album.info = info;
		await this.store.album.replace(album);
		return info;
	}

	private async updateTrackInfo(track: JamServe.Track): Promise<JamServe.MetaInfoTrack> {
		let info: JamServe.MetaInfoTrack;
		try {
			info = await this.createTrackInfo(track);
		} catch (e) {
			log.error(e);
			return {similar: []};
		}
		info = info || {similar: []};
		track.info = info;
		await this.store.track.replace(track);
		return info;
	}

	private async updateFolderInfo(folder: JamServe.Folder): Promise<JamServe.MetaInfo> {
		let info: JamServe.MetaInfo | undefined;
		try {
			info = await this.createFolderInfo(folder);
		} catch (e) {
			log.error(e);
			return {album: {}, artist: {}, topSongs: []};
		}
		info = info || {album: {}, artist: {}, topSongs: []};
		folder.info = info;
		await this.store.folder.replace(folder);
		return info;
	}

	private async getSimilarSongs(similar: Array<JamServe.MetaInfoSimilarArtist>): Promise<Array<JamServe.MetaInfoTrackSimilarSong>> {
		const audio = this.audio;

		async function checkTopSongs(artist: JamServe.MetaInfoSimilarArtist): Promise<Array<JamServe.MetaInfoTopSong> | void> {
			if (artist.mbid) {
				return audio.mediaInfoTopSongsByArtistID(artist.mbid);
			} else if (artist.name) {
				return audio.mediaInfoTopSongs(artist.name);
			}
		}

		let tracks: Array<JamServe.MetaInfoTrackSimilarSong> = [];
		for (const artist of similar) {
			const songs = await checkTopSongs(artist);
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
		return shuffle<JamServe.MetaInfoTrackSimilarSong>(tracks);
	}

	private async getSimilarArtistTracks(similars: Array<MetaInfoSimilarArtist>): Promise<Array<JamServe.Track>> {
		if (!similars || similars.length === 0) {
			return [];
		}
		const similar = await this.getSimilarSongs(similars);
		const ids: Array<JamServe.MetaInfoTrackSimilarSong> = [];
		const vals: Array<JamServe.MetaInfoTrackSimilarSong> = [];
		const result: Array<JamServe.Track> = [];
		similar.forEach(sim => {
			if (sim.mbid) {
				ids.push(sim);
			} else {
				vals.push(sim);
			}
		});
		const mbTrackIDs = ids.map(track => track.mbid || '-').filter(id => id !== '-');
		const tracks = await this.store.track.search({mbTrackIDs});
		ids.forEach(sim => {
			const t = tracks.find(tr => tr.tag.mbTrackID === sim.mbid);
			if (!t) {
				vals.push(sim);
			} else {
				result.push(t);
			}
		});
		for (const sim of vals) {
			const track = await this.store.track.searchOne({title: sim.name, artist: sim.artist.name});
			if (track) {
				result.push(track);
			}
		}
		return result;
	}

	async getFolderSimilarArtists(info: JamServe.MetaInfo, includeNotPresent: boolean): Promise<Array<JamServe.MetaInfoFolderSimilarArtist>> {
		if (!info.artist.similar) {
			return [];
		}
		const names: Array<string> = [];
		const artistsHash: {
			[name: string]: {
				info: JamServe.MetaInfoSimilarArtist;
				folder?: JamServe.Folder;
			}
		} = {};
		info.artist.similar.forEach(a => {
			if (a.name) {
				names.push(a.name);
				artistsHash[a.name] = {info: a};
			}
		});
		const folders = await this.store.folder.search({types: [FolderType.artist], artists: names});
		folders.forEach(f => {
			const name = f.tag.artist || '';
			if (artistsHash[name]) {
				artistsHash[name].folder = f;
			} else {
				console.log('what? a child not in the name list?', f, artistsHash);
			}
		});
		const artists: Array<JamServe.MetaInfoFolderSimilarArtist> = [];
		Object.keys(artistsHash).forEach(key => {
			const a = artistsHash[key];
			if (a.folder) {
				const artist: JamServe.MetaInfoFolderSimilarArtist = {
					// id: a.folder.id,
					name: key,
					folder: a.folder
				};
				artists.push(artist);
			} else if (includeNotPresent) {
				const artist: JamServe.MetaInfoFolderSimilarArtist = {
					name: key
				};
				artists.push(artist);
			}
		});
		return artists;
	}

	async getSimilarArtists(info: JamServe.MetaInfo, includeNotPresent: boolean): Promise<Array<JamServe.MetaInfoArtistSimilarArtist>> {
		if (!info.artist.similar) {
			return [];
		}
		const names: Array<string> = [];
		const artistsHash: {
			[name: string]: {
				info: JamServe.MetaInfoSimilarArtist;
				artist?: JamServe.Artist;
			}
		} = {};
		info.artist.similar.forEach(a => {
			if (a.name) {
				names.push(a.name);
				artistsHash[a.name] = {info: a};
			}
		});
		const artists = await this.store.artist.search({names});
		artists.forEach(a => {
			const name = a.name || '';
			if (artistsHash[name]) {
				artistsHash[name].artist = a;
			} else {
				console.log('what? a child not in the name list?', a, artistsHash);
			}
		});
		const result: Array<JamServe.MetaInfoFolderSimilarArtist> = [];
		Object.keys(artistsHash).forEach(key => {
			const a = artistsHash[key];
			if (a.artist) {
				const artist: JamServe.MetaInfoArtistSimilarArtist = {
					// id: a.folder.id,
					name: key,
					artist: a.artist
				};
				result.push(artist);
			} else if (includeNotPresent) {
				const artist: JamServe.MetaInfoArtistSimilarArtist = {
					name: key
				};
				result.push(artist);
			}
		});
		return result;
	}

	async getFolderArtistInfo(folder: JamServe.Folder, includeNotPresent: boolean, includeSimilar: boolean): Promise<{ similar?: Array<JamServe.MetaInfoFolderSimilarArtist>, info: JamServe.MetaInfo }> {
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

	async getArtistInfos(artist: JamServe.Artist, includeNotPresent: boolean, includeSimilar: boolean): Promise<{ similar?: Array<JamServe.MetaInfoArtistSimilarArtist>, info: JamServe.MetaInfo }> {
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

	async getFolderInfo(folder: JamServe.Folder): Promise<JamServe.MetaInfo> {
		if (folder.info) {
			return folder.info;
		} else {
			return this.updateFolderInfo(folder);
		}
	}

	async getAlbumInfo(album: JamServe.Album): Promise<JamServe.MetaInfo> {
		if (album.info) {
			return album.info;
		} else {
			return this.updateAlbumInfo(album);
		}
	}

	async getTrackInfo(track: JamServe.Track): Promise<JamServe.MetaInfoTrack | undefined> {
		if (track.info) {
			return track.info;
		}
	}

	async getTopTracks(artist: string, count: number): Promise<Array<JamServe.Track>> {
		const folder = await this.store.folder.searchOne({types: [FolderType.artist], artist});
		if (!folder) {
			return [];
		}
		let info = folder.info;
		if (!info) {
			info = await this.updateFolderInfo(folder);
		}
		if (info.topSongs && info.topSongs.length > 0) {
			const ids: Array<JamServe.MetaInfoTopSong> = [];
			const vals: Array<JamServe.MetaInfoTopSong> = [];
			const result: Array<JamServe.Track> = [];
			info.topSongs.forEach(top => {
				if (top.mbid) {
					ids.push(top);
				} else {
					vals.push(top);
				}
			});
			const mbTrackIDs = ids.map(track => track.mbid || '-').filter(i => i !== '-');
			const tracks = await this.store.track.search({mbTrackIDs});
			ids.forEach(sim => {
				const t = tracks.find(tr => tr.tag.mbTrackID === sim.mbid);
				if (!t) {
					vals.push(sim);
				} else {
					result.push(t);
				}
			});
			for (const top of vals) {
				const track = await this.store.track.searchOne({title: top.name, artist: top.artist.name});
				if (track) {
					result.push(track);
				}
			}
			return result;
		}
		return [];
	}

	async getAlbumSimilarTracks(album: JamServe.Album): Promise<Array<JamServe.Track>> {
		const info = await this.getAlbumInfo(album);
		if (!info || !info.artist.similar) {
			return [];
		}
		return this.getSimilarArtistTracks(info.artist.similar);
	}

	async getArtistSimilarTracks(artist: JamServe.Artist): Promise<Array<JamServe.Track>> {
		const info = await this.getArtistInfos(artist, false, false);
		if (!info || !info.similar) {
			return [];
		}
		return this.getSimilarArtistTracks(info.similar);
	}

	async getFolderSimilarTracks(folder: JamServe.Folder): Promise<Array<JamServe.Track>> {
		const info = await this.getFolderInfo(folder);
		if (!info || !info.artist.similar) {
			return [];
		}
		return this.getSimilarArtistTracks(info.artist.similar);
	}

	async getTrackSimilarTracks(track: JamServe.Track): Promise<Array<JamServe.Track>> {
		const info = await this.getTrackInfo(track);
		if (!info || !info.similar || info.similar.length === 0) {
			return [];
		}
		const ids: Array<JamServe.MetaInfoTrackSimilarSong> = [];
		const vals: Array<JamServe.MetaInfoTrackSimilarSong> = [];
		const result: Array<JamServe.Track> = [];
		info.similar.forEach(sim => {
			if (sim.mbid) {
				ids.push(sim);
			} else {
				vals.push(sim);
			}
		});
		const mbTrackIDs = ids.map(t => t.mbid || '-').filter(i => i !== '-');
		const tracks = await this.store.track.search({mbTrackIDs});
		ids.forEach(sim => {
			const t = tracks.find(tr => tr.tag.mbTrackID === sim.mbid);
			if (!t) {
				vals.push(sim);
			} else {
				result.push(t);
			}
		});
		for (const sim of vals) {
			const t = await this.store.track.searchOne({title: sim.name, artist: sim.artist.name});
			if (t) {
				result.push(t);
			}
		}
		return result;
	}

}
