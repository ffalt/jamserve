import {DBObjectType} from '../../../db/db.types';
import {AlbumType, cUnknownAlbum, cUnknownArtist, MUSICBRAINZ_VARIOUS_ARTISTS_ID, MUSICBRAINZ_VARIOUS_ARTISTS_NAME} from '../../../model/jam-types';
import {extractAlbumName} from '../../../utils/album-name';
import {slugify} from '../../../utils/slug';
import {Album} from '../../album/album.model';
import {Artist} from '../../artist/artist.model';
import {Folder} from '../../folder/folder.model';
import {Series} from '../../series/series.model';
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
	private seriesCache: Array<Series> = [];
	private albumCache: Array<Album> = [];
	private folderCache: Array<Folder> = [];

	constructor(private store: Store) {

	}

	// series

	private async buildSeries(trackInfo: MetaMergeTrackInfo, artistID: string, artist: string): Promise<Series> {
		return {
			id: await this.store.seriesStore.getNewId(),
			type: DBObjectType.series,
			name: trackInfo.track.tag.series || '',
			albumTypes: trackInfo.parent && trackInfo.parent.tag && trackInfo.parent.tag.albumType !== undefined ? [trackInfo.parent.tag.albumType] : [AlbumType.unknown],
			artistID, artist,
			folderIDs: [],
			albumIDs: [],
			trackIDs: [],
			rootIDs: [],
			created: Date.now()
		};
	}

	private async findSeriesInDB(trackInfo: MetaMergeTrackInfo, artistID: string): Promise<Series | undefined> {
		return this.store.seriesStore.searchOne({name: trackInfo.track.tag.series, artistID});
	}

	private async findSeriesInCache(trackInfo: MetaMergeTrackInfo, artistID: string): Promise<Series | undefined> {
		if (!trackInfo.track.tag.series) {
			return;
		}
		return this.seriesCache.find(a => (a.name === trackInfo.track.tag.series) && (a.artistID === artistID));
	}

	async getSeriesByID(id: string, changes?: Changes): Promise<Series | undefined> {
		let series = this.seriesCache.find(a => a.id === id);
		if (series) {
			return series;
		}
		series = await this.store.seriesStore.byId(id);
		if (series) {
			this.seriesCache.push(series);
			if (changes) {
				changes.updateSeries.push(series);
			}
		}
		return series;
	}

	async findOrCreateSeries(trackInfo: MetaMergeTrackInfo, artistID: string, artist: string, albumID: string, changes: Changes): Promise<Series> {
		let series = await this.findSeriesInCache(trackInfo, artistID);
		if (series) {
			return series;
		}
		series = await this.findSeriesInDB(trackInfo, artistID);
		if (!series) {
			series = await this.buildSeries(trackInfo, artistID, artist);
			changes.newSeries.push(series);
		} else {
			changes.updateSeries.push(series);
		}
		this.seriesCache.push(series);
		return series;
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
			mbReleaseID: trackInfo.track.tag.mbReleaseID,
			series: trackInfo.track.tag.series,
			seriesNr: trackInfo.track.tag.seriesNr,
			genres: [],
			folderIDs: [],
			trackIDs: [],
			rootIDs: [],
			year: trackInfo.track.tag.year,
			duration: trackInfo.track.media.duration || 0,
			created: Date.now()
		};
	}

	private async findAlbumInDB(trackInfo: MetaMergeTrackInfo, artistID: string): Promise<Album | undefined> {
		if (trackInfo.track.tag.mbReleaseID) {
			const album = await this.store.albumStore.searchOne({mbReleaseID: trackInfo.track.tag.mbReleaseID});
			if (album) {
				return album;
			}
		}
		return this.store.albumStore.searchOne({slug: getAlbumSlug(trackInfo), artistID});
	}

	private async findAlbumInCache(trackInfo: MetaMergeTrackInfo, artistID: string): Promise<Album | undefined> {
		if (trackInfo.track.tag.mbReleaseID) {
			const album = this.albumCache.find(a => a.mbReleaseID === trackInfo.track.tag.mbReleaseID);
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

	// artist

	private async buildArtist(trackInfo: MetaMergeTrackInfo, albumArtist: boolean): Promise<Artist> {
		let aa = {mbArtistID: trackInfo.track.tag.mbArtistID, name: trackInfo.track.tag.artist, nameSort: trackInfo.track.tag.artistSort};
		if (albumArtist && (trackInfo.track.tag.mbAlbumArtistID || trackInfo.track.tag.albumArtist)) {
			aa = {mbArtistID: trackInfo.track.tag.mbAlbumArtistID, name: trackInfo.track.tag.albumArtist, nameSort: trackInfo.track.tag.albumArtistSort};
		}
		aa.name = aa.name || cUnknownArtist;
		return {
			id: await this.store.artistStore.getNewId(),
			type: DBObjectType.artist,
			rootIDs: [],
			slug: slugify(aa.name),
			name: aa.name,
			nameSort: aa.nameSort,
			mbArtistID: aa.mbArtistID,
			albumTypes: [],
			seriesIDs: [],
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
		let aa = {mbArtistID: trackInfo.track.tag.mbArtistID, name: trackInfo.track.tag.artist};
		if (albumArtist && (trackInfo.track.tag.mbAlbumArtistID || trackInfo.track.tag.albumArtist)) {
			aa = {mbArtistID: trackInfo.track.tag.mbAlbumArtistID, name: trackInfo.track.tag.albumArtist};
		}
		const slug = slugify(aa.name || cUnknownArtist);
		if (aa.mbArtistID) {
			const artist = this.artistCache.find(a => a.artist.mbArtistID === aa.mbArtistID);
			if (artist) {
				// disabled merging with id AND slug. if aa.mbArtistID is wrong, it's causing wrongly combined artists
				// in all following new tracks of those artists all over the place, which is worse than duplicated artist entries
				// not sure how to handle invalid data better in this stage

				// if (!artist.slugs.includes(slug)) {
				// 	artist.slugs.push(slug);
				// }
				return artist.artist;
			}
		}
		const slugArtist = this.artistCache.find(a => a.slugs.includes(slug));
		if (slugArtist) {
			if (!slugArtist.artist.mbArtistID && aa.mbArtistID) {
				slugArtist.artist.mbArtistID = aa.mbArtistID;
			}
			return slugArtist.artist;
		}
	}

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
				seriesIDs: [],
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
