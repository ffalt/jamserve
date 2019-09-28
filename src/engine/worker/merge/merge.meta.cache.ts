import {DBObjectType} from '../../../db/db.types';
import {AlbumType, cUnknownAlbum, cUnknownArtist, MUSICBRAINZ_VARIOUS_ARTISTS_ID, MUSICBRAINZ_VARIOUS_ARTISTS_NAME} from '../../../model/jam-types';
import {extractAlbumName} from '../../../utils/album-name';
import {slugify} from '../../../utils/slug';
import {Album} from '../../album/album.model';
import {Artist} from '../../artist/artist.model';
import {Folder} from '../../folder/folder.model';
import {Store} from '../../store/store';
import {Track} from '../../track/track.model';
import {Changes} from '../changes/changes';

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
	}
	return extractAlbumName(trackInfo.track.tag.album || cUnknownAlbum);
}

export function getAlbumSlug(trackInfo: MetaMergeTrackInfo): string {
	return slugify(getAlbumName(trackInfo));
}

export class MetaMergerCache {
	private artistCache: Array<{ artist: Artist, slugs: Array<string> }> = [];
	private albumCache: Array<Album> = [];
	private folderCache: Array<Folder> = [];

	constructor(private store: Store) {

	}

	// album

	private async buildAlbum(trackInfo: MetaMergeTrackInfo, artistID: string): Promise<Album> {
		return {
			id: await this.store.albumStore.getNewId(),
			type: DBObjectType.album,
			slug: getAlbumSlug(trackInfo),
			name: getAlbumName(trackInfo),
			albumType: trackInfo.parent && trackInfo.parent.tag && trackInfo.parent.tag.albumType !== undefined ? trackInfo.parent.tag.albumType : AlbumType.unknown,
			artist: trackInfo.track.tag.albumArtist || trackInfo.track.tag.artist || cUnknownArtist,
			artistID,
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
			const album = this.albumCache.find(a => a.mbAlbumID === trackInfo.track.tag.mbAlbumID);
			if (album) {
				return album;
			}
		}
		const name = getAlbumName(trackInfo);
		return this.albumCache.find(a => (a.name === name) && (a.artistID === artistID));
	}

	async getAlbumByID(id: string, changes?: Changes): Promise<Album | undefined> {
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

	async findOrCreateAlbum(trackInfo: MetaMergeTrackInfo, artistID: string, changes: Changes): Promise<Album> {
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
				if (!artist.slugs.includes(slug)) {
					artist.slugs.push(slug);
				}

				return artist.artist;
			}
		}
		const slugArtist = this.artistCache.find(a => a.slugs.includes(slug));
		if (slugArtist) {
			if (!slugArtist.artist.mbArtistID) {
				slugArtist.artist.mbArtistID = mbArtistID;
			}
			return slugArtist.artist;
		}
	}

	// artist

	async getArtistByID(id: string, changes: Changes): Promise<Artist | undefined> {
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

	private async findCompilationArtist(changes: Changes): Promise<Artist | undefined> {
		const artistCache = this.artistCache.find(a => a.artist.mbArtistID === MUSICBRAINZ_VARIOUS_ARTISTS_ID);
		if (artistCache) {
			return artistCache.artist;
		}
		const artist = await this.store.artistStore.searchOne({mbArtistID: MUSICBRAINZ_VARIOUS_ARTISTS_ID});
		if (artist) {
			changes.updateArtists.push(artist);
			this.artistCache.push({artist, slugs: [artist.slug]});
		}
		return artist;
	}

	async findOrCreateCompilationArtist(changes: Changes): Promise<Artist> {
		let artist = await this.findCompilationArtist(changes);
		if (!artist) {
			artist = {
				id: await this.store.artistStore.getNewId(),
				type: DBObjectType.artist,
				rootIDs: [],
				slug: slugify(MUSICBRAINZ_VARIOUS_ARTISTS_NAME),
				name: MUSICBRAINZ_VARIOUS_ARTISTS_NAME,
				mbArtistID: MUSICBRAINZ_VARIOUS_ARTISTS_ID,
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

	async findOrCreateArtist(trackInfo: MetaMergeTrackInfo, albumArtist: boolean, changes: Changes): Promise<Artist> {
		let artist = await this.findArtistInCache(trackInfo, albumArtist);
		if (artist) {
			return artist;
		}
		artist = await this.findArtistInDB(trackInfo, albumArtist);
		if (!artist) {
			const name = (albumArtist ? (trackInfo.track.tag.albumArtist || trackInfo.track.tag.artist) : trackInfo.track.tag.artist) || cUnknownArtist;
			if (name === MUSICBRAINZ_VARIOUS_ARTISTS_NAME) {
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

	// folder

	async getFolderByID(id: string, changes: Changes): Promise<Folder | undefined> {
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
}
