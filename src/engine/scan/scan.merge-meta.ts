import Logger from '../../utils/logger';
import {MergeChanges, MergeTrackInfo} from './scan.changes';
import {Album} from '../../objects/album/album.model';
import {AlbumType, MusicBrainz_VARIOUS_ARTISTS_ID, MusicBrainz_VARIOUS_ARTISTS_NAME} from '../../model/jam-types';
import {Track} from '../../objects/track/track.model';
import {MatchDir, MatchFile} from './scan.match-dir';
import {Artist} from '../../objects/artist/artist.model';
import {getAlbumName, getAlbumSlug, getArtistMBArtistID, getArtistName, getArtistNameSort, getArtistSlug, slugify} from './scan.utils';
import {Store} from '../store/store';
import {DBObjectType} from '../../db/db.types';

const log = Logger('Scan.MetaMerge');

export class ScanMetaMerger {
	private artistCache: Array<Artist> = [];
	private albumCache: Array<Album> = [];

	constructor(private store: Store) {

	}

	private async findAlbumInDB(trackInfo: MergeTrackInfo, artistID: string): Promise<Album | undefined> {
		if (trackInfo.track.tag.mbAlbumID) {
			const album = await this.store.albumStore.searchOne({mbAlbumID: trackInfo.track.tag.mbAlbumID});
			if (album) {
				return album;
			}
		}
		return this.store.albumStore.searchOne({slug: getAlbumSlug(trackInfo), artistID});
	}

	private async findAlbumInCache(trackInfo: MergeTrackInfo, artistID: string): Promise<Album | undefined> {
		if (trackInfo.track.tag.mbAlbumID) {
			const album = await this.albumCache.find(a => a.mbAlbumID === trackInfo.track.tag.mbAlbumID);
			if (album) {
				return album;
			}
		}
		const name = getAlbumName(trackInfo);
		return this.albumCache.find(a => (a.name === name) && (a.artistID === artistID));
	}

	private updateAlbum(album: Album, trackInfo: MergeTrackInfo) {
		album.albumType = trackInfo.dir.folder && trackInfo.dir.folder.tag && trackInfo.dir.folder.tag.albumType !== undefined ? trackInfo.dir.folder.tag.albumType : AlbumType.unknown;
		album.name = getAlbumName(trackInfo);
		album.artist = getArtistName(trackInfo);
		album.mbArtistID = getArtistMBArtistID(trackInfo);
		album.mbAlbumID = trackInfo.track.tag.mbAlbumID;
		album.genre = trackInfo.track.tag.genre;
		album.year = trackInfo.track.tag.year;
	}

	private async buildAlbum(trackInfo: MergeTrackInfo, artistID: string): Promise<Album> {
		return {
			id: await this.store.albumStore.getNewId(),
			type: DBObjectType.album,
			slug: getAlbumSlug(trackInfo),
			name: getAlbumName(trackInfo),
			albumType: trackInfo.dir.folder && trackInfo.dir.folder.tag && trackInfo.dir.folder.tag.albumType !== undefined ? trackInfo.dir.folder.tag.albumType : AlbumType.unknown,
			artist: getArtistName(trackInfo),
			artistID: artistID,
			mbArtistID: getArtistMBArtistID(trackInfo),
			mbAlbumID: trackInfo.track.tag.mbAlbumID,
			genre: trackInfo.track.tag.genre,
			trackIDs: [],
			rootIDs: [],
			year: trackInfo.track.tag.year,
			duration: trackInfo.track.media.duration || 0,
			created: Date.now()
		};
	}

	private async findArtistInDB(trackInfo: MergeTrackInfo): Promise<Artist | undefined> {
		const mbArtistID = trackInfo.track.tag.mbAlbumArtistID || trackInfo.track.tag.mbArtistID;
		if (mbArtistID) {
			const artist = await this.store.artistStore.searchOne({mbArtistID});
			if (artist) {
				return artist;
			}
		}
		return this.store.artistStore.searchOne({slug: getArtistSlug(trackInfo)});
	}

	private async findArtistInCache(trackInfo: MergeTrackInfo): Promise<Artist | undefined> {
		const mbArtistID = trackInfo.track.tag.mbAlbumArtistID || trackInfo.track.tag.mbArtistID;
		if (mbArtistID) {
			const artist = this.artistCache.find(a => a.mbArtistID === mbArtistID);
			if (artist) {
				return artist;
			}
		}
		const slug = getArtistSlug(trackInfo);
		return this.artistCache.find(a => a.slug === slug);
	}

	private async findOrCreateAlbum(trackInfo: MergeTrackInfo, artistID: string, changes: MergeChanges): Promise<Album> {
		let album = await this.findAlbumInCache(trackInfo, artistID);
		if (album) {
			return album;
		}
		album = await this.findAlbumInDB(trackInfo, artistID);
		if (!album) {
			album = await this.buildAlbum(trackInfo, artistID);
			changes.newAlbums.push(album);
		} else {
			this.updateAlbum(album, trackInfo);
			changes.updateAlbums.push(album);
		}
		this.albumCache.push(album);
		return album;
	}

	private async getAlbumByID(id: string, changes?: MergeChanges): Promise<Album | undefined> {
		let album = this.albumCache.find(a => a.id === id);
		if (album) {
			return album;
		}
		album = await this.store.albumStore.byId(id);
		if (album) {
			this.albumCache.push(album);
			if (changes) {
				changes.updateAlbums.push(album);
			}
		}
		return album;
	}

	private async getArtistByID(id: string, changes: MergeChanges): Promise<Artist | undefined> {
		let artist = this.artistCache.find(a => a.id === id);
		if (artist) {
			return artist;
		}
		artist = await this.store.artistStore.byId(id);
		if (artist) {
			this.artistCache.push(artist);
			changes.updateArtists.push(artist);
		}
		return artist;
	}

	private async findOrCreateArtist(trackInfo: MergeTrackInfo, changes: MergeChanges): Promise<Artist> {
		let artist = await this.findArtistInCache(trackInfo);
		if (artist) {
			return artist;
		}
		artist = await this.findArtistInDB(trackInfo);
		if (!artist) {
			artist = await this.buildArtist(trackInfo);
			changes.newArtists.push(artist);
		} else {
			this.updateArtist(artist, trackInfo);
			changes.updateArtists.push(artist);
		}
		this.artistCache.push(artist);
		return artist;
	}

	private updateArtist(artist: Artist, trackInfo: MergeTrackInfo) {
		if (artist.name !== MusicBrainz_VARIOUS_ARTISTS_NAME) {
			artist.slug = getArtistSlug(trackInfo);
			artist.name = getArtistName(trackInfo);
			artist.nameSort = getArtistNameSort(trackInfo);
			artist.mbArtistID = getArtistMBArtistID(trackInfo);
		}
	}

	private async buildArtist(trackInfo: MergeTrackInfo): Promise<Artist> {
		return {
			id: await this.store.artistStore.getNewId(),
			type: DBObjectType.artist,
			rootIDs: [],
			slug: getArtistSlug(trackInfo),
			name: getArtistName(trackInfo),
			nameSort: getArtistNameSort(trackInfo),
			mbArtistID: getArtistMBArtistID(trackInfo),
			albumTypes: [],
			albumIDs: [],
			trackIDs: [],
			created: Date.now()
		};
	}

	private async findCompilationArtist(changes: MergeChanges): Promise<Artist | undefined> {
		const slug = slugify(MusicBrainz_VARIOUS_ARTISTS_NAME);
		let artist = await this.artistCache.find(a => a.slug === slug);
		if (artist) {
			return artist;
		}
		artist = await this.store.artistStore.searchOne({slug});
		if (artist) {
			this.artistCache.push(artist);
		}
		return artist;
	}

	private async findOrCreateCompilationArtist(changes: MergeChanges): Promise<Artist> {
		let artist = await this.findCompilationArtist(changes);
		if (!artist) {
			artist = {
				id: await this.store.artistStore.getNewId(),
				type: DBObjectType.artist,
				rootIDs: [],
				slug: slugify(MusicBrainz_VARIOUS_ARTISTS_NAME),
				name: MusicBrainz_VARIOUS_ARTISTS_NAME,
				mbArtistID: MusicBrainz_VARIOUS_ARTISTS_ID,
				albumTypes: [AlbumType.compilation],
				albumIDs: [],
				trackIDs: [],
				created: Date.now()
			};
			changes.newArtists.push(artist);
			this.artistCache.push(artist);
			return artist;
		}
		return artist;
	}

	private async addMeta(trackInfo: MergeTrackInfo, changes: MergeChanges): Promise<void> {
		if (trackInfo.dir.folder) {
			const artist = await this.findOrCreateArtist(trackInfo, changes);
			trackInfo.track.artistID = artist.id;
			let album: Album;
			if (trackInfo.dir.folder.tag.artist === MusicBrainz_VARIOUS_ARTISTS_NAME) {
				const compilationArtist = await this.findOrCreateCompilationArtist(changes);
				if (compilationArtist !== artist && changes.newArtists.indexOf(compilationArtist) < 0 && changes.updateArtists.indexOf(compilationArtist) < 0) {
					changes.updateArtists.push(compilationArtist);
				}
				album = await this.findOrCreateAlbum(trackInfo, compilationArtist.id, changes);
				album.artist = compilationArtist.name;
				album.albumType = AlbumType.compilation;
				trackInfo.track.albumArtistID = compilationArtist.id;
			} else {
				album = await this.findOrCreateAlbum(trackInfo, artist.id, changes);
				album.albumType = (trackInfo.dir.folder.tag.albumType === undefined) ? AlbumType.unknown : trackInfo.dir.folder.tag.albumType;
				trackInfo.track.albumArtistID = artist.id;
			}
			trackInfo.track.albumID = album.id;
		}
	}

	private async removeMeta(track: Track, changes: MergeChanges): Promise<void> {
		let artist = await this.getArtistByID(track.artistID, changes);
		if (artist && changes.updateArtists.indexOf(artist) < 0) {
			changes.updateArtists.push(artist);
		}
		if (track.artistID !== track.albumArtistID) {
			artist = await this.getArtistByID(track.albumArtistID, changes);
			if (artist && changes.updateArtists.indexOf(artist) < 0) {
				changes.updateArtists.push(artist);
			}
		}
		const album = await this.getAlbumByID(track.albumID, changes);
		if (album && changes.updateAlbums.indexOf(album) < 0) {
			changes.updateAlbums.push(album);
		}
	}

	async mergeMeta(forceMetaRefresh: boolean, rootID: string, changes: MergeChanges): Promise<void> {
		// merge new
		log.debug('merge meta tracks new', changes.newTracks.length);
		for (const trackInfo of changes.newTracks) {
			await this.addMeta(trackInfo, changes);
		}
		// remove missing
		log.debug('merge meta tracks remove', changes.removedTracks.length);
		for (const track of changes.removedTracks) {
			await this.removeMeta(track, changes);
		}
		// update updated
		log.debug('merge meta tracks update', changes.updateTracks.length);
		for (const trackInfo of changes.updateTracks) {
			await this.removeMeta(trackInfo.oldTrack, changes);
			await this.addMeta(trackInfo, changes);
		}
		if (forceMetaRefresh) {
			const allArtistIDs = await this.store.artistStore.searchIDs({rootID});
			for (const id of allArtistIDs) {
				await this.getArtistByID(id, changes);
			}
			const allAlbumIDs = await this.store.albumStore.searchIDs({rootID});
			for (const id of allAlbumIDs) {
				await this.getAlbumByID(id, changes);
			}
		}

		const removedTrackIDs = changes.removedTracks.map(t => t.id);

		const checkAlbums = changes.updateAlbums.concat(changes.newAlbums);
		log.debug('refresh albums', checkAlbums.length);

		changes.removedAlbums = [];
		changes.updateAlbums = [];
		for (const album of checkAlbums) {
			// get the db state
			let tracksIDs = await this.store.trackStore.searchIDs({albumID: album.id});
			// filter out removed tracks
			tracksIDs = tracksIDs.filter(t => removedTrackIDs.indexOf(t) < 0);
			// filter out updated tracks which are no longer part of the album
			const removedFromAlbum = changes.updateTracks.filter(t => (t.oldTrack.albumID === album.id && t.track.albumID !== album.id)).map(t => t.track.id);
			tracksIDs = tracksIDs.filter(t => removedFromAlbum.indexOf(t) < 0);
			// rest tracksIDs are untouched tracks
			// get all new and updated tracks which are part of the album
			const refreshedTracks: Array<MergeTrackInfo> = (<Array<MergeTrackInfo>>changes.updateTracks.filter(t => t.track && t.track.albumID === album.id))
				.concat(changes.newTracks.filter(t => t.track.albumID === album.id));
			if (refreshedTracks.length + tracksIDs.length === 0) {
				if (changes.removedAlbums.indexOf(album) < 0) {
					changes.removedAlbums.push(album);
				} else {
					log.error('new album without tracks', album);
				}
			} else {
				let duration = 0;
				album.rootIDs = [];
				album.trackIDs = [];
				const tracks = await this.store.trackStore.byIds(tracksIDs);
				for (const track of tracks) {
					if (album.rootIDs.indexOf(track.rootID) < 0) {
						album.rootIDs.push(track.rootID);
					}
					if (album.trackIDs.indexOf(track.id) < 0) {
						album.trackIDs.push(track.id);
					}
					duration += (track.media.duration || 0);
				}
				for (const trackInfo of refreshedTracks) {
					if (album.rootIDs.indexOf(trackInfo.track.rootID) < 0) {
						album.rootIDs.push(trackInfo.track.rootID);
					}
					if (album.trackIDs.indexOf(trackInfo.track.id) < 0) {
						album.trackIDs.push(trackInfo.track.id);
					}
					// TODO: update most used values, not with the last
					this.updateAlbum(album, trackInfo);
					duration += (trackInfo.track.media.duration || 0);
				}
				album.duration = duration;
				if (changes.newAlbums.indexOf(album) < 0) {
					changes.updateAlbums.push(album);
				}
			}
		}
		const checkArtists = changes.updateArtists.concat(changes.newArtists);
		log.debug('refresh artists', checkArtists.length);
		changes.removedArtists = [];
		changes.updateArtists = [];
		for (const artist of checkArtists) {
			// get the db state
			let tracksIDs = await this.store.trackStore.searchIDs({artistID: artist.id});
			const tracksAlbumsIDs = await this.store.trackStore.searchIDs({albumArtistID: artist.id});
			for (const id of tracksAlbumsIDs) {
				if (tracksIDs.indexOf(id) < 0) {
					tracksIDs.push(id);
				}
			}
			// filter out removed tracks
			tracksIDs = tracksIDs.filter(t => removedTrackIDs.indexOf(t) < 0);
			// filter out updated tracks which are no longer part of the artist
			let removedFromArtist = changes.updateTracks.filter(t => (t.oldTrack.artistID === artist.id && t.track.artistID !== artist.id)).map(t => t.track.id);
			tracksIDs = tracksIDs.filter(t => removedFromArtist.indexOf(t) < 0);
			// filter out updated tracks which are no longer part of the album artist
			removedFromArtist = changes.updateTracks.filter(t => (t.oldTrack.albumArtistID === artist.id && t.track.albumArtistID !== artist.id)).map(t => t.track.id);
			tracksIDs = tracksIDs.filter(t => removedFromArtist.indexOf(t) < 0);
			// get all new and updated tracks which are part of the artist
			const refreshedTracks: Array<MergeTrackInfo> = (<Array<MergeTrackInfo>>changes.updateTracks.filter(t => t.track.artistID === artist.id || t.track.albumArtistID === artist.id))
				.concat(changes.newTracks.filter(t => t.track.artistID === artist.id || t.track.albumArtistID === artist.id));
			if (refreshedTracks.length + tracksIDs.length === 0) {
				if (changes.newArtists.indexOf(artist) < 0) {
					changes.removedArtists.push(artist);
				} else {
					log.error('new artist without tracks', artist);
				}
			} else {
				artist.trackIDs = [];
				artist.albumIDs = [];
				artist.albumTypes = [];
				artist.rootIDs = [];
				const tracks = await this.store.trackStore.byIds(tracksIDs);
				for (const track of tracks) {
					if (artist.rootIDs.indexOf(track.rootID) < 0) {
						artist.rootIDs.push(track.rootID);
					}
					if (artist.trackIDs.indexOf(track.id) < 0) {
						artist.trackIDs.push(track.id);
					}
				}
				for (const trackInfo of refreshedTracks) {
					if (artist.rootIDs.indexOf(trackInfo.track.rootID) < 0) {
						artist.rootIDs.push(trackInfo.track.rootID);
					}
					if (artist.trackIDs.indexOf(trackInfo.track.id) < 0) {
						artist.trackIDs.push(trackInfo.track.id);
					}
				}

				let albumIDs = await this.store.albumStore.searchIDs({artistID: artist.id});
				albumIDs = albumIDs.filter(id => !!changes.removedAlbums.find(a => a.id === id));
				const refreshedAlbums = changes.updateAlbums.filter(a => a.artistID === artist.id)
					.concat(changes.newAlbums.filter(a => a.artistID === artist.id));
				albumIDs = albumIDs.filter(id => !!refreshedAlbums.find(t => t.artistID === id));
				let albums = await this.store.albumStore.byIds(albumIDs);
				albums = refreshedAlbums.concat(albums);
				for (const album of albums) {
					if (artist.albumIDs.indexOf(album.id) < 0) {
						artist.albumIDs.push(album.id);
					}
					if (artist.albumTypes.indexOf(album.albumType) < 0) {
						artist.albumTypes.push(album.albumType);
					}
				}
				if (changes.newArtists.indexOf(artist) < 0) {
					changes.updateArtists.push(artist);
				}
			}
		}
	}

}
