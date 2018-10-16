import {JamServe} from '../model/jamserve';
import {AlbumType, DBObjectType} from '../types';
import {Store} from '../store/store';
import Logger from '../utils/logger';
import {MergeChanges, MergeTrackInfo} from './merge';
import {clearID3} from './clean';
import {cUnknownAlbum, cUnknownArtist} from './tag';
import {Images} from './images';

const log = Logger('IO.meta');

export class MetaMerge {
	private readonly store: Store;
	private readonly images: Images;

	constructor(store: Store, images: Images) {
		this.store = store;
		this.images = images;
	}

	private static getArtistMBArtistID(trackInfo: MergeTrackInfo): string | undefined {
		if (trackInfo.dir.folder && trackInfo.dir.folder.tag.albumType === AlbumType.mix) {
			return;
		} else {
			return trackInfo.track.tag.mbAlbumArtistID || trackInfo.track.tag.mbArtistID;
		}
	}

	private static getArtistNameSort(trackInfo: MergeTrackInfo): string | undefined {
		if (trackInfo.dir.folder && trackInfo.dir.folder.tag.albumType === AlbumType.mix) {
			return;
		} else {
			return trackInfo.track.tag.artistSort;
		}
	}

	private static getArtistName(trackInfo: MergeTrackInfo): string {
		if (trackInfo.dir.folder && trackInfo.dir.folder.tag.albumType === AlbumType.mix) {
			return trackInfo.dir.folder.tag.artist || cUnknownArtist;
		} else {
			return trackInfo.track.tag.albumArtist || trackInfo.track.tag.artist || cUnknownArtist;
		}
	}

	private static getAlbumName(trackInfo: MergeTrackInfo): string {
		if (trackInfo.dir.folder && trackInfo.dir.folder.tag.albumType === AlbumType.mix) {
			return trackInfo.dir.folder.tag.album || cUnknownAlbum;
		} else {
			return trackInfo.track.tag.album || cUnknownAlbum;
		}
	}

	private async findArtist(trackInfo: MergeTrackInfo): Promise<JamServe.Artist | undefined> {
		const name = MetaMerge.getArtistName(trackInfo);
		const mbArtistID = trackInfo.track.tag.mbAlbumArtistID || trackInfo.track.tag.mbArtistID;
		if (mbArtistID) {
			const artist = await this.store.artist.searchOne({mbArtistID});
			if (artist) {
				return artist;
			}
		}
		return this.store.artist.searchOne({name});
	}

	private async addArtist(trackInfo: MergeTrackInfo): Promise<string> {
		const name = MetaMerge.getArtistName(trackInfo);
		const artist = await this.findArtist(trackInfo);
		if (artist) {
			artist.trackIDs.push(trackInfo.track.id);
			if (artist.rootIDs.indexOf(trackInfo.track.rootID) < 0) {
				artist.rootIDs.push(trackInfo.track.rootID);
			}
			await this.store.artist.replace(artist);
			return artist.id;
		} else {
			const a: JamServe.Artist = {
				id: '',
				type: DBObjectType.artist,
				rootIDs: [trackInfo.track.rootID],
				name: name,
				nameSort: MetaMerge.getArtistNameSort(trackInfo),
				albumIDs: [],
				mbArtistID: MetaMerge.getArtistMBArtistID(trackInfo),
				trackIDs: [trackInfo.track.id],
				created: Date.now()
			};
			log.debug('Add Artist', a.name);
			a.id = await this.store.artist.add(a);
			return a.id;
		}
	}

	private async removeID3Artist(track: JamServe.Track): Promise<void> {
		const artist = await this.store.artist.searchOne({trackID: track.id});
		if (artist) {
			artist.trackIDs = artist.trackIDs.filter(id => id !== track.id);
			if (artist.trackIDs.length === 0) {
				await this.store.artist.remove(artist.id);
				await this.store.state.removeByQuery({destID: artist.id, type: DBObjectType.artist});
			} else {
				await this.store.artist.replace(artist);
			}
		}
	}

	private async syncID3Artist(trackInfo: MergeTrackInfo): Promise<string> {
		const artist = await this.findArtist(trackInfo);
		if (artist && (artist.trackIDs.indexOf(trackInfo.track.id) >= 0)) {
			// TODO: upsert artist name changes with same mbArtistID
			return artist.id;
		}
		await this.removeID3Artist(trackInfo.track);
		return this.addArtist(trackInfo);
	}

	private async findAlbum(trackInfo: MergeTrackInfo, artistID: string): Promise<JamServe.Album | undefined> {
		const name = MetaMerge.getAlbumName(trackInfo);
		if (trackInfo.track.tag.mbAlbumID) {
			const album = await this.store.album.searchOne({mbAlbumID: trackInfo.track.tag.mbAlbumID});
			if (album) {
				return album;
			}
		}
		return this.store.album.searchOne({name, artistID});
	}

	private async addID3Album(trackInfo: MergeTrackInfo, artistID: string): Promise<string> {
		const name = MetaMerge.getAlbumName(trackInfo);
		const album = await this.findAlbum(trackInfo, artistID);
		if (album) {
			album.trackIDs.push(trackInfo.track.id);
			if (album.rootIDs.indexOf(trackInfo.track.rootID) < 0) {
				album.rootIDs.push(trackInfo.track.rootID);
			}
			album.duration += (trackInfo.track.media.duration || 0);
			await this.store.album.replace(album);
			return album.id;
		} else {
			const a: JamServe.Album = {
				id: '',
				type: DBObjectType.album,
				name: name,
				artist: MetaMerge.getArtistName(trackInfo),
				artistID: artistID,
				mbArtistID: MetaMerge.getArtistMBArtistID(trackInfo),
				mbAlbumID: trackInfo.track.tag.mbAlbumID,
				genre: trackInfo.track.tag.genre,
				trackIDs: [trackInfo.track.id],
				rootIDs: [trackInfo.track.rootID],
				year: trackInfo.track.tag.year,
				duration: trackInfo.track.media.duration || 0,
				created: Date.now()
			};
			log.debug('Add Album', a.name);
			a.id = await this.store.album.add(a);
			const artist = await this.store.artist.byId(artistID);
			if (artist) {
				artist.albumIDs.push(a.id);
				await this.store.artist.replace(artist);
			}
			return a.id;
		}
	}

	private async removeID3Album(track: JamServe.Track): Promise<void> {
		const album = await this.store.album.searchOne({trackID: track.id});
		if (album) {
			album.trackIDs = album.trackIDs.filter(id => id !== track.id);
			album.duration -= (track.media.duration || 0);
			if (album.trackIDs.length === 0) {
				const artist = await this.store.artist.byId(album.artistID);
				if (artist) {
					artist.albumIDs = artist.albumIDs.filter(id => id !== album.id);
					await this.store.artist.replace(artist);
					await this.store.album.remove(album.id);
					await this.store.state.removeByQuery({destID: album.id, type: DBObjectType.album});
				}
			} else {
				await this.store.album.replace(album);
			}
		}
	}

	private async syncAlbum(trackInfo: MergeTrackInfo, artistID: string): Promise<void> {
		const album = await this.findAlbum(trackInfo, artistID);
		if (album && (album.trackIDs.indexOf(trackInfo.track.id) >= 0)) {
			// TODO: upsert artist name changes with same mbArtistID
			return;
		}
		await this.removeID3Album(trackInfo.track);
		await this.addID3Album(trackInfo, artistID);
	}

	private async addID3s(trackInfos: Array<MergeTrackInfo>): Promise<void> {
		const artistSearchesName: { [name: string]: Array<MergeTrackInfo> } = {};
		const artistTracks: { [id: string]: { artist: JamServe.Artist, tracks: Array<MergeTrackInfo>, hasChanged: boolean } } = {};
		// collect artists searches
		trackInfos.forEach(trackInfo => {
			const name = MetaMerge.getArtistName(trackInfo);
			if (name && name.length > 0) {
				artistSearchesName[name] = artistSearchesName[name] || [];
				artistSearchesName[name].push(trackInfo);
			}
		});
		// search artists
		for (const name of Object.keys(artistSearchesName)) {
			const artist = await this.store.artist.searchOne({name});
			const idtracks = artistSearchesName[name];
			if (artist) {
				idtracks.forEach(t => {
					t.track.artistID = artist.id;
				});
				artistTracks[artist.id] = (artistTracks[artist.id] || {artist, tracks: [], hasChanged: true});
				artistTracks[artist.id].tracks = artistTracks[artist.id].tracks.concat(idtracks);
				artistTracks[artist.id].hasChanged = true;
				artist.trackIDs = artist.trackIDs.concat(idtracks.map(t => t.track.id));
				idtracks.forEach(t => {
					if (artist.rootIDs.indexOf(t.track.rootID) < 0) {
						artist.rootIDs.push(t.track.rootID);
					}
				});
				// gets saved later
			} else {
				const a: JamServe.Artist = {
					id: '',
					type: DBObjectType.artist,
					name: MetaMerge.getArtistName(idtracks[0]),
					nameSort: MetaMerge.getArtistNameSort(idtracks[0]),
					rootIDs: [],
					albumIDs: [],
					mbArtistID: MetaMerge.getArtistMBArtistID(idtracks[0]),
					trackIDs: idtracks.map(t => t.track.id),
					created: Date.now()
				};
				idtracks.forEach(t => {
					if (a.rootIDs.indexOf(t.track.rootID) < 0) {
						a.rootIDs.push(t.track.rootID);
					}
				});
				log.debug('Add Artist', a.name);
				a.id = await this.store.artist.add(a);
				artistTracks[a.id] = {artist: a, tracks: idtracks, hasChanged: false};
				idtracks.forEach(t => {
					t.track.artistID = a.id;
				});
			}
		}
		// search albums
		for (const artistID of  Object.keys(artistTracks)) {
			const artistidtracks = artistTracks[artistID];
			const albumtracks: { [name: string]: Array<MergeTrackInfo> } = {};
			artistidtracks.tracks.forEach(trackInfo => {
				const name = MetaMerge.getAlbumName(trackInfo);
				albumtracks[name] = albumtracks[name] || [];
				albumtracks[name].push(trackInfo);
			});
			for (const name of Object.keys(albumtracks)) {
				const atracks = albumtracks[name];
				const album = await this.store.album.searchOne({name, artistID});
				if (album) {
					album.trackIDs = album.trackIDs.concat(atracks.map(t => t.track.id));
					atracks.forEach(t => {
						t.track.albumID = album.id;
						album.duration += (t && t.track && t.track.media && t.track.media.duration ? t.track.media.duration : 0);
						if (album.rootIDs.indexOf(t.track.rootID) < 0) {
							album.rootIDs.push(t.track.rootID);
						}
					});
					log.debug('Update Album', album.name);
					artistidtracks.artist.albumIDs.push(album.id);
					artistidtracks.hasChanged = true;
					artistidtracks.tracks.forEach(t => {
						t.track.albumID = album.id;
						if (album.rootIDs.indexOf(t.track.rootID) < 0) {
							album.rootIDs.push(t.track.rootID);
						}
					});
					await this.store.album.replace(album);
				} else {
					const a: JamServe.Album = {
						id: '',
						type: DBObjectType.album,
						name: name,
						rootIDs: [],
						artist: MetaMerge.getArtistName(atracks[0]),
						artistID: artistID,
						mbArtistID: MetaMerge.getArtistMBArtistID(atracks[0]),
						mbAlbumID: atracks[0].track.tag.mbAlbumID,
						genre: atracks[0].track.tag.genre,
						trackIDs: atracks.map(t => t.track.id),
						year: atracks[0].track.tag.year,
						duration: atracks.reduce((b, c) => (b + (c && c.track && c.track.media && c.track.media.duration ? c.track.media.duration : 0)), 0),
						created: Date.now()
					};
					atracks.forEach(t => {
						if (a.rootIDs.indexOf(t.track.rootID) < 0) {
							a.rootIDs.push(t.track.rootID);
						}
					});
					log.debug('Add Album', a.name);
					a.id = await this.store.album.add(a);
					artistidtracks.artist.albumIDs.push(a.id);
					artistidtracks.tracks.forEach(t => {
						t.track.albumID = a.id;
					});
					artistidtracks.hasChanged = true;
				}
			}
		}
		// save artists
		for (const artistID of Object.keys(artistTracks)) {
			const artistidtracks = artistTracks[artistID];
			if (artistidtracks.hasChanged) {
				log.debug('Update Artist', artistidtracks.artist.name);
				await this.store.artist.replace(artistidtracks.artist);
			}
		}
		// save tracks
		for (const trackInfo of trackInfos) {
			if (trackInfo.track.albumID || trackInfo.track.artistID) {
				log.debug('Update Track', trackInfo.track.name);
				await this.store.track.replace(trackInfo.track);
			}
		}
	}

	private async syncID3(trackInfo: MergeTrackInfo): Promise<void> {
		const id = await this.syncID3Artist(trackInfo);
		await this.syncAlbum(trackInfo, id);
	}

	async sync(changes: MergeChanges): Promise<void> {
		// new tracks && leftovers from last unfinished scan
		const trackInfos = changes.newTracks.concat(changes.unchangedTracks.filter(t => (!t.track.albumID && !t.track.artistID)));
		await this.addID3s(trackInfos);
		for (const trackInfo of changes.updateTracks) {
			await this.syncID3(trackInfo);
		}
		await clearID3(this.store, this.images, changes.removedTracks);
	}
}
