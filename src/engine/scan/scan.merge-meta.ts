import Logger from '../../utils/logger';
import {MergeChanges} from './scan.changes';
import {Album} from '../../objects/album/album.model';
import {AlbumType, cUnknownAlbum, cUnknownArtist, MusicBrainz_VARIOUS_ARTISTS_ID, MusicBrainz_VARIOUS_ARTISTS_NAME} from '../../model/jam-types';
import {Track} from '../../objects/track/track.model';
import {Artist} from '../../objects/artist/artist.model';
import {Store} from '../store/store';
import {DBObjectType} from '../../db/db.types';
import {extractAlbumName, slugify} from './scan.utils';
import {MetaStatBuilder} from './scan.metastats';
import {Folder} from '../../objects/folder/folder.model';

const log = Logger('IO.MetaMerge');

export interface MetaMergeTrackInfo {
	track: Track;
	parent: Folder;
}

export interface UpdateMetaMergeTrackInfo extends MetaMergeTrackInfo {
	oldTrack: Track;
}

export function getAlbumName(trackInfo: MetaMergeTrackInfo): string {
	if (trackInfo.parent && trackInfo.parent.tag.albumType === AlbumType.compilation) {
		return trackInfo.parent.tag.album || cUnknownAlbum;
	} else {
		return extractAlbumName(trackInfo.track.tag.album || cUnknownAlbum);
	}
}

export function getAlbumSlug(trackInfo: MetaMergeTrackInfo): string {
	return slugify(getAlbumName(trackInfo));
}

export class ScanMetaMerger {
	private artistCache: Array<{ artist: Artist, slugs: Array<string> }> = [];
	private albumCache: Array<Album> = [];
	private folderCache: Array<Folder> = [];

	constructor(private store: Store) {

	}

	private async findAlbumInDB(trackInfo: MetaMergeTrackInfo, artistID: string): Promise<Album | undefined> {
		if (trackInfo.track.tag.mbAlbumID) {
			const album = await this.store.albumStore.searchOne({mbAlbumID: trackInfo.track.tag.mbAlbumID});
			if (album) {
				return album;
			}
		}
		return this.store.albumStore.searchOne({slug: getAlbumSlug(trackInfo), artistID});
	}

	private async findAlbumInCache(trackInfo: MetaMergeTrackInfo, artistID: string): Promise<Album | undefined> {
		if (trackInfo.track.tag.mbAlbumID) {
			const album = await this.albumCache.find(a => a.mbAlbumID === trackInfo.track.tag.mbAlbumID);
			if (album) {
				return album;
			}
		}
		const name = getAlbumName(trackInfo);
		return this.albumCache.find(a => (a.name === name) && (a.artistID === artistID));
	}

	private async buildAlbum(trackInfo: MetaMergeTrackInfo, artistID: string): Promise<Album> {
		return {
			id: await this.store.albumStore.getNewId(),
			type: DBObjectType.album,
			slug: getAlbumSlug(trackInfo),
			name: getAlbumName(trackInfo),
			albumType: trackInfo.parent && trackInfo.parent.tag && trackInfo.parent.tag.albumType !== undefined ? trackInfo.parent.tag.albumType : AlbumType.unknown,
			artist: trackInfo.track.tag.albumArtist || trackInfo.track.tag.artist || cUnknownArtist,
			artistID: artistID,
			mbArtistID: trackInfo.track.tag.mbAlbumArtistID || trackInfo.track.tag.mbArtistID,
			mbAlbumID: trackInfo.track.tag.mbAlbumID,
			genre: trackInfo.track.tag.genre,
			folderIDs: [],
			trackIDs: [],
			rootIDs: [],
			year: trackInfo.track.tag.year,
			duration: trackInfo.track.media.duration || 0,
			created: Date.now()
		};
	}

	private async findArtistInDB(trackInfo: MetaMergeTrackInfo, albumArtist: boolean): Promise<Artist | undefined> {
		const mbArtistID = albumArtist ? (trackInfo.track.tag.mbAlbumArtistID || trackInfo.track.tag.mbArtistID) : trackInfo.track.tag.mbArtistID;
		if (mbArtistID) {
			const artist = await this.store.artistStore.searchOne({mbArtistID});
			if (artist) {
				return artist;
			}
		}
		const slug = slugify((albumArtist ? (trackInfo.track.tag.albumArtist || trackInfo.track.tag.artist) : trackInfo.track.tag.artist) || cUnknownArtist);
		return this.store.artistStore.searchOne({slug});
	}

	private async findArtistInCache(trackInfo: MetaMergeTrackInfo, albumArtist: boolean): Promise<Artist | undefined> {
		const mbArtistID = albumArtist ? (trackInfo.track.tag.mbAlbumArtistID || trackInfo.track.tag.mbArtistID) : trackInfo.track.tag.mbArtistID;
		const slug = slugify((albumArtist ? (trackInfo.track.tag.albumArtist || trackInfo.track.tag.artist) : trackInfo.track.tag.artist) || cUnknownArtist);
		if (mbArtistID) {
			const artist = this.artistCache.find(a => a.artist.mbArtistID === mbArtistID);
			if (artist) {
				if (artist.slugs.indexOf(slug) < 0) {
					artist.slugs.push(slug);
				}

				return artist.artist;
			}
		}
		const slugArtist = this.artistCache.find(a => a.slugs.indexOf(slug) >= 0);
		if (slugArtist) {
			if (!slugArtist.artist.mbArtistID) {
				slugArtist.artist.mbArtistID = mbArtistID;
			}
			return slugArtist.artist;
		}
	}

	private async findOrCreateAlbum(trackInfo: MetaMergeTrackInfo, artistID: string, changes: MergeChanges): Promise<Album> {
		let album = await this.findAlbumInCache(trackInfo, artistID);
		if (album) {
			return album;
		}
		album = await this.findAlbumInDB(trackInfo, artistID);
		if (!album) {
			album = await this.buildAlbum(trackInfo, artistID);
			changes.newAlbums.push(album);
		} else {
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
		const artistCache = this.artistCache.find(a => a.artist.id === id);
		if (artistCache) {
			return artistCache.artist;
		}
		const artist = await this.store.artistStore.byId(id);
		if (artist) {
			this.artistCache.push({artist, slugs: [artist.slug]});
			changes.updateArtists.push(artist);
		}
		return artist;
	}

	private async buildArtist(trackInfo: MetaMergeTrackInfo, albumArtist: boolean): Promise<Artist> {
		const name = (albumArtist ? (trackInfo.track.tag.albumArtist || trackInfo.track.tag.artist) : trackInfo.track.tag.artist) || cUnknownArtist;
		const nameSort = albumArtist ? (trackInfo.track.tag.albumArtistSort || trackInfo.track.tag.artistSort) : trackInfo.track.tag.artistSort;
		const mbArtistID = albumArtist ? (trackInfo.track.tag.mbAlbumArtistID || trackInfo.track.tag.mbArtistID) : trackInfo.track.tag.mbArtistID;
		return {
			id: await this.store.artistStore.getNewId(),
			type: DBObjectType.artist,
			rootIDs: [],
			slug: slugify(name),
			name,
			nameSort,
			mbArtistID,
			albumTypes: [],
			albumIDs: [],
			folderIDs: [],
			trackIDs: [],
			created: Date.now()
		};
	}

	private async findCompilationArtist(changes: MergeChanges): Promise<Artist | undefined> {
		const artistCache = await this.artistCache.find(a => a.artist.mbArtistID === MusicBrainz_VARIOUS_ARTISTS_ID);
		if (artistCache) {
			return artistCache.artist;
		}
		const artist = await this.store.artistStore.searchOne({mbArtistID: MusicBrainz_VARIOUS_ARTISTS_ID});
		if (artist) {
			changes.updateArtists.push(artist);
			this.artistCache.push({artist, slugs: [artist.slug]});
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
				folderIDs: [],
				albumIDs: [],
				trackIDs: [],
				created: Date.now()
			};
			changes.newArtists.push(artist);
			this.artistCache.push({artist, slugs: [artist.slug]});
			return artist;
		}
		return artist;
	}

	private async findOrCreateArtist(trackInfo: MetaMergeTrackInfo, albumArtist: boolean, changes: MergeChanges): Promise<Artist> {
		let artist = await this.findArtistInCache(trackInfo, albumArtist);
		if (artist) {
			return artist;
		}
		artist = await this.findArtistInDB(trackInfo, albumArtist);
		if (!artist) {
			const name = (albumArtist ? (trackInfo.track.tag.albumArtist || trackInfo.track.tag.artist) : trackInfo.track.tag.artist) || cUnknownArtist;
			if (name === MusicBrainz_VARIOUS_ARTISTS_NAME) {
				return this.findOrCreateCompilationArtist(changes);
			}
			artist = await this.buildArtist(trackInfo, albumArtist);
			changes.newArtists.push(artist);
		} else {
			changes.updateArtists.push(artist);
		}
		this.artistCache.push({artist, slugs: [artist.slug]});
		return artist;
	}

	private async addMeta(trackInfo: MetaMergeTrackInfo, changes: MergeChanges): Promise<void> {
		if (trackInfo.parent) {
			const artist = await this.findOrCreateArtist(trackInfo, false, changes);
			trackInfo.track.artistID = artist.id;
			let albumArtist: Artist;
			if (trackInfo.parent.tag.artist === MusicBrainz_VARIOUS_ARTISTS_NAME) {
				albumArtist = await this.findOrCreateCompilationArtist(changes);
			} else {
				albumArtist = await this.findOrCreateArtist(trackInfo, true, changes);
			}
			trackInfo.track.albumArtistID = albumArtist.id;
			const album = await this.findOrCreateAlbum(trackInfo, albumArtist.id, changes);
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

	async findFolder(id: string, changes: MergeChanges): Promise<Folder | undefined> {
		let folder = changes.newFolders.find(f => f.id === id);
		if (!folder) {
			folder = changes.updateFolders.find(f => f.id === id);
		}
		if (!folder) {
			folder = this.folderCache.find(f => f.id === id);
		}
		if (!folder) {
			folder = await this.store.folderStore.byId(id);
			if (folder) {
				this.folderCache.push(folder);
			}
		}
		return folder;
	}

	async mergeMeta(forceMetaRefresh: boolean, rootID: string, changes: MergeChanges): Promise<void> {
		// merge new
		const newTracks: Array<MetaMergeTrackInfo> = [];
		const updateTracks: Array<UpdateMetaMergeTrackInfo> = [];
		for (const track of changes.newTracks) {
			const parent = await this.findFolder(track.parentID, changes);
			if (parent) {
				newTracks.push({track, parent});
			}
		}
		for (const trackInfo of changes.updateTracks) {
			const parent = await this.findFolder(trackInfo.track.parentID, changes);
			if (parent) {
				updateTracks.push({track: trackInfo.track, oldTrack: trackInfo.oldTrack, parent});
			}
		}

		log.debug('merge meta tracks new', newTracks.length);
		for (const trackInfo of newTracks) {
			await this.addMeta(trackInfo, changes);
		}
		// remove missing
		log.debug('merge meta tracks remove', changes.removedTracks.length);
		for (const track of changes.removedTracks) {
			await this.removeMeta(track, changes);
		}
		// update updated
		log.debug('merge meta tracks update', updateTracks.length);
		for (const trackInfo of updateTracks) {
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
			log.debug('refresh album', album.name, album.id, album.artist);
			// get the db state
			let tracksIDs = await this.store.trackStore.searchIDs({albumID: album.id});
			// filter out removed tracks
			tracksIDs = tracksIDs.filter(t => removedTrackIDs.indexOf(t) < 0);
			// filter out updated tracks which are no longer part of the album
			const removedFromAlbum = updateTracks.filter(t => (t.oldTrack.albumID === album.id && t.track.albumID !== album.id)).map(t => t.track.id);
			tracksIDs = tracksIDs.filter(t => removedFromAlbum.indexOf(t) < 0);
			// rest tracksIDs are untouched tracks
			// get all new and updated tracks which are part of the album
			const refreshedTracks: Array<MetaMergeTrackInfo> = (<Array<MetaMergeTrackInfo>>updateTracks.filter(t => t.track && t.track.albumID === album.id))
				.concat(newTracks.filter(t => t.track.albumID === album.id));
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
				album.folderIDs = [];
				const metaStatBuilder = new MetaStatBuilder();
				const tracks = await this.store.trackStore.byIds(tracksIDs);
				for (const track of tracks) {
					const folder = await this.findFolder(track.parentID, changes);
					if (folder) {
						refreshedTracks.push({track, parent: folder});
					}
				}

				for (const trackInfo of refreshedTracks) {
					const track = trackInfo.track;
					if (album.rootIDs.indexOf(track.rootID) < 0) {
						album.rootIDs.push(track.rootID);
					}
					if (album.folderIDs.indexOf(track.parentID) < 0) {
						album.folderIDs.push(track.parentID);
					}
					if (album.trackIDs.indexOf(track.id) < 0) {
						album.trackIDs.push(track.id);
					}
					metaStatBuilder.statSlugValue('artist', track.tag.albumArtist || track.tag.artist);
					metaStatBuilder.statID('mbArtistID', track.tag.mbAlbumArtistID || track.tag.mbArtistID);
					metaStatBuilder.statID('mbAlbumID', track.tag.mbAlbumID);
					metaStatBuilder.statSlugValue('genre', track.tag.genre);
					metaStatBuilder.statNumber('year', track.tag.year);
					duration += (track.media.duration || 0);
					metaStatBuilder.statSlugValue('name', getAlbumName(trackInfo));
					metaStatBuilder.statID('albumType', trackInfo.parent && trackInfo.parent.tag && trackInfo.parent.tag.albumType !== undefined ? trackInfo.parent.tag.albumType : undefined);
				}
				album.artist = metaStatBuilder.mostUsed('artist') || cUnknownArtist;
				album.name = metaStatBuilder.mostUsed('name') || cUnknownAlbum;
				album.mbArtistID = metaStatBuilder.mostUsed('mbArtistID');
				album.mbAlbumID = metaStatBuilder.mostUsed('mbAlbumID');
				album.genre = metaStatBuilder.mostUsed('genre');
				album.year = metaStatBuilder.mostUsedNumber('year');
				album.albumType = <AlbumType>metaStatBuilder.mostUsed('albumType') || AlbumType.unknown;
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
			log.debug('refresh artist', artist.name, artist.id);
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
			let removedFromArtist = updateTracks.filter(t => (t.oldTrack.artistID === artist.id && t.track.artistID !== artist.id)).map(t => t.track.id);
			tracksIDs = tracksIDs.filter(t => removedFromArtist.indexOf(t) < 0);
			// filter out updated tracks which are no longer part of the album artist
			removedFromArtist = updateTracks.filter(t => (t.oldTrack.albumArtistID === artist.id && t.track.albumArtistID !== artist.id)).map(t => t.track.id);
			tracksIDs = tracksIDs.filter(t => removedFromArtist.indexOf(t) < 0);
			// get all new and updated tracks which are part of the artist
			const refreshedTracks: Array<MetaMergeTrackInfo> = (<Array<MetaMergeTrackInfo>>updateTracks.filter(t => t.track.artistID === artist.id || t.track.albumArtistID === artist.id))
				.concat(newTracks.filter(t => t.track.artistID === artist.id || t.track.albumArtistID === artist.id));
			if (refreshedTracks.length + tracksIDs.length === 0) {
				if (changes.newArtists.indexOf(artist) < 0) {
					changes.removedArtists.push(artist);
				} else {
					log.error('new artist without tracks', artist);
				}
			} else {
				artist.trackIDs = [];
				artist.folderIDs = [];
				artist.albumIDs = [];
				artist.albumTypes = [];
				artist.rootIDs = [];
				const metaStatBuilder = new MetaStatBuilder();
				let tracks = await this.store.trackStore.byIds(tracksIDs);
				tracks = tracks.concat(refreshedTracks.map(t => t.track));
				for (const track of tracks) {
					if (track.artistID === artist.id) {
						metaStatBuilder.statSlugValue('artist', track.tag.artist);
						metaStatBuilder.statSlugValue('artistSort', track.tag.artistSort);
					}
					if (track.albumArtistID === artist.id) {
						metaStatBuilder.statSlugValue('artist', track.tag.albumArtist);
						metaStatBuilder.statSlugValue('artistSort', track.tag.albumArtistSort);
					}
					if (artist.rootIDs.indexOf(track.rootID) < 0) {
						artist.rootIDs.push(track.rootID);
					}
					if (artist.folderIDs.indexOf(track.parentID) < 0) {
						artist.folderIDs.push(track.parentID);
					}
					if (artist.trackIDs.indexOf(track.id) < 0) {
						artist.trackIDs.push(track.id);
					}
				}
				if (artist.name !== MusicBrainz_VARIOUS_ARTISTS_NAME) {
					const artistName = metaStatBuilder.mostUsed('artist') || cUnknownArtist;
					artist.name = artistName;
					artist.slug = slugify(artistName);
					artist.nameSort = metaStatBuilder.mostUsed('artistSort');
				}
				let albumIDs = await this.store.albumStore.searchIDs({artistID: artist.id});
				albumIDs = albumIDs.filter(id => !changes.removedAlbums.find(a => a.id === id));
				const refreshedAlbums = changes.updateAlbums.filter(a => a.artistID === artist.id)
					.concat(changes.newAlbums.filter(a => a.artistID === artist.id));
				albumIDs = albumIDs.filter(id => !refreshedAlbums.find(t => t.id === id));
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
