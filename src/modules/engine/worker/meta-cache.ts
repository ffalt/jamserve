import {AlbumType} from '../../../types/enums';
import {Track} from '../../../entity/track/track';
import {Folder} from '../../../entity/folder/folder';
import {cUnknownAlbum, cUnknownArtist, MUSICBRAINZ_VARIOUS_ARTISTS_ID, MUSICBRAINZ_VARIOUS_ARTISTS_NAME} from '../../../types/consts';
import {extractAlbumName} from '../../../utils/album-name';
import {slugify} from '../../../utils/slug';
import {Artist} from '../../../entity/artist/artist';
import {Series} from '../../../entity/series/series';
import {Album} from '../../../entity/album/album';
import {Changes} from './changes';
import {Tag} from '../../../entity/tag/tag';
import {Root} from '../../../entity/root/root';
import {OrmService} from '../services/orm.service';

export interface MetaMergeTrackInfo {
	track: Track;
	tag: Tag;
	folder: Folder;
}

export function getAlbumName(trackInfo: MetaMergeTrackInfo): string {
	if (trackInfo.folder.albumType === AlbumType.compilation) {
		return trackInfo.folder.album || cUnknownAlbum;
	}
	return extractAlbumName(trackInfo.tag.album || cUnknownAlbum);
}

export function getAlbumSlug(trackInfo: MetaMergeTrackInfo): string {
	return slugify(getAlbumName(trackInfo));
}

export class MetaMergerCache {
	private artistCache: Array<{ artist: Artist; slugs: Array<string> }> = [];
	private seriesCache: Array<{ artist: Artist; series: Series }> = [];
	private albumCache: Array<{ artist: Artist; album: Album }> = [];

	constructor(private orm: OrmService, private changes: Changes, private root: Root) {
	}

	// series

	private async buildSeries(trackInfo: MetaMergeTrackInfo, artist: Artist): Promise<Series> {
		return this.orm.Series.create({
			name: trackInfo.tag.series || '',
			albumTypes: trackInfo.folder.albumType ? [trackInfo.folder.albumType] : [AlbumType.unknown],
			artist: artist.id,
			roots: [this.root]
		});
	}

	private async findSeriesInCache(trackInfo: MetaMergeTrackInfo, artistID: string): Promise<Series | undefined> {
		if (!trackInfo.tag.series) {
			return;
		}
		const cache = this.seriesCache.find(a => (a.series.name === trackInfo.tag.series) && a.artist.id === artistID);
		return cache?.series;
	}

	async getSeriesByID(id: string, changes?: Changes): Promise<Series | undefined> {
		const cache = this.seriesCache.find(a => a.series.id === id);
		if (cache?.series) {
			return cache.series;
		}
		const series = await this.orm.Series.findOne(id);
		if (series) {
			this.seriesCache.push({series, artist: await series.artist});
			if (changes && !changes.series.added.has(series)) {
				changes.series.updated.add(series);
			}
		}
		return series || undefined;
	}

	async findOrCreateSeries(trackInfo: MetaMergeTrackInfo, artist: Artist, album: Album): Promise<Series> {
		let series: Series | undefined | null = await this.findSeriesInCache(trackInfo, artist.id);
		if (series) {
			return series;
		}
		series = await this.orm.Series.findOne({$and: [{name: {$eq: trackInfo.tag.series}}, {artist: artist.id}]});
		if (!series) {
			series = await this.buildSeries(trackInfo, artist);
			this.changes.series.added.add(series);
		} else {
			this.changes.series.updated.add(series);
		}
		series.albums.add(album);
		this.seriesCache.push({series, artist});
		return series;
	}

	// album

	private async buildAlbum(trackInfo: MetaMergeTrackInfo, artist: Artist): Promise<Album> {
		const album = this.orm.Album.create({
			slug: getAlbumSlug(trackInfo),
			name: getAlbumName(trackInfo),
			albumType: trackInfo.folder.albumType || AlbumType.unknown,
			artist: artist,
			mbArtistID: trackInfo.tag.mbAlbumArtistID || trackInfo.tag.mbArtistID,
			mbReleaseID: trackInfo.tag.mbReleaseID,
			seriesNr: trackInfo.tag.seriesNr,
			year: trackInfo.tag.year,
			duration: trackInfo.tag.mediaDuration || 0
		});
		album.folders.add(trackInfo.folder);
		album.roots.add(this.root);
		this.orm.orm.em.persistLater(album);
		return album;
	}

	private async findAlbumInDB(trackInfo: MetaMergeTrackInfo, artist: Artist): Promise<Album | undefined> {
		if (trackInfo.tag.mbReleaseID) {
			const album = await this.orm.Album.findOne({mbReleaseID: {$eq: trackInfo.tag.mbReleaseID}});
			if (album) {
				return album;
			}
		}
		return await this.orm.Album.findOne({
			$and: [
				{slug: {$eq: getAlbumSlug(trackInfo)}},
				{artist: artist.id}
			]
		}) || undefined;
	}

	private async findAlbumInCache(trackInfo: MetaMergeTrackInfo, artist: Artist): Promise<Album | undefined> {
		if (trackInfo.tag.mbReleaseID) {
			const cache = this.albumCache.find(a => a.album.mbReleaseID === trackInfo.tag.mbReleaseID);
			if (cache?.album) {
				return cache.album;
			}
		}
		const name = getAlbumName(trackInfo);
		const cache = this.albumCache.find(a => (a.album.name === name) && (a.artist.id === artist.id));
		return cache?.album;
	}

	async getAlbumByID(id: string): Promise<Album | undefined> {
		const cache = this.albumCache.find(a => a.album.id === id);
		if (cache?.album) {
			return cache.album;
		}
		const album = await this.orm.Album.findOne(id);
		if (album) {
			this.albumCache.push({album, artist: await album.artist});
			this.changes.albums.updated.add(album);
		}
		return album || undefined;
	}

	async findOrCreateAlbum(trackInfo: MetaMergeTrackInfo, artist: Artist): Promise<Album> {
		let album = await this.findAlbumInCache(trackInfo, artist);
		if (album) {
			return album;
		}
		album = await this.findAlbumInDB(trackInfo, artist);
		if (!album) {
			album = await this.buildAlbum(trackInfo, artist);
			this.changes.albums.added.add(album);
		} else {
			this.changes.albums.updated.add(album);
		}
		this.albumCache.push({album, artist});
		return album;
	}

	// artist

	private async findArtistInDB(trackInfo: MetaMergeTrackInfo, albumArtist: boolean): Promise<Artist | undefined> {
		const mbArtistID = albumArtist ? (trackInfo.tag.mbAlbumArtistID || trackInfo.tag.mbArtistID) : trackInfo.tag.mbArtistID;
		if (mbArtistID) {
			const artist = await this.orm.Artist.findOne({mbArtistID: {$eq: mbArtistID}});
			if (artist) {
				return artist;
			}
		}
		const slug = slugify((albumArtist ? (trackInfo.tag.albumArtist || trackInfo.tag.artist) : trackInfo.tag.artist) || cUnknownArtist);
		return await this.orm.Artist.findOne({slug: {$eq: slug}}) || undefined;
	}

	private async findArtistInCache(trackInfo: MetaMergeTrackInfo, albumArtist: boolean): Promise<Artist | undefined> {
		let aa = {mbArtistID: trackInfo.tag.mbArtistID, name: trackInfo.tag.artist};
		if (albumArtist && (trackInfo.tag.mbAlbumArtistID || trackInfo.tag.albumArtist)) {
			aa = {mbArtistID: trackInfo.tag.mbAlbumArtistID, name: trackInfo.tag.albumArtist};
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

	async getArtistByID(id: string): Promise<Artist | undefined> {
		const artistCache = this.artistCache.find(a => a.artist.id === id);
		if (artistCache) {
			return artistCache.artist;
		}
		const artist = await this.orm.Artist.findOne(id);
		if (artist) {
			this.artistCache.push({artist, slugs: [artist.slug]});
			this.changes.artists.updated.add(artist);
		}
		return artist || undefined;
	}

	private async findCompilationArtist(): Promise<Artist | undefined> {
		const artistCache = this.artistCache.find(a => a.artist.mbArtistID === MUSICBRAINZ_VARIOUS_ARTISTS_ID);
		if (artistCache) {
			return artistCache.artist;
		}
		const artist = await this.orm.Artist.findOne({mbArtistID: {$eq: MUSICBRAINZ_VARIOUS_ARTISTS_ID}});
		if (artist) {
			this.changes.artists.updated.add(artist);
			this.artistCache.push({artist, slugs: [artist.slug]});
		}
		return artist || undefined;
	}

	private async buildArtist(trackInfo: MetaMergeTrackInfo, albumArtist: boolean): Promise<Artist> {
		let aa = {mbArtistID: trackInfo.tag.mbArtistID, name: trackInfo.tag.artist, nameSort: trackInfo.tag.artistSort};
		if (albumArtist && (trackInfo.tag.mbAlbumArtistID || trackInfo.tag.albumArtist)) {
			aa = {mbArtistID: trackInfo.tag.mbAlbumArtistID, name: trackInfo.tag.albumArtist, nameSort: trackInfo.tag.albumArtistSort};
		}
		aa.name = aa.name || cUnknownArtist;
		const artist = this.orm.Artist.create({
			slug: slugify(aa.name),
			name: aa.name,
			nameSort: aa.nameSort || aa.name,
			mbArtistID: aa.mbArtistID,
			albumTypes: trackInfo.folder.albumType ? [trackInfo.folder.albumType] : [],
		});
		artist.roots.add(this.root);
		artist.folders.add(trackInfo.folder)
		artist.tracks.add(trackInfo.track);
		this.orm.orm.em.persistLater(artist);
		return artist;
	}

	async findOrCreateCompilationArtist(): Promise<Artist> {
		let artist = await this.findCompilationArtist();
		if (!artist) {
			artist = this.orm.Artist.create({
				slug: slugify(MUSICBRAINZ_VARIOUS_ARTISTS_NAME),
				name: MUSICBRAINZ_VARIOUS_ARTISTS_NAME,
				nameSort: MUSICBRAINZ_VARIOUS_ARTISTS_NAME,
				mbArtistID: MUSICBRAINZ_VARIOUS_ARTISTS_ID,
				albumTypes: [AlbumType.compilation]
			});
			this.changes.artists.added.add(artist);
			this.artistCache.push({artist, slugs: [artist.slug]});
			this.orm.orm.em.persistLater(artist);
			return artist;
		} else if (!this.changes.artists.added.has(artist)) {
			this.changes.artists.updated.add(artist);
		}
		return artist;
	}

	async findOrCreateArtist(trackInfo: MetaMergeTrackInfo, albumArtist: boolean): Promise<Artist> {
		let artist = await this.findArtistInCache(trackInfo, albumArtist);
		if (artist) {
			return artist;
		}
		artist = await this.findArtistInDB(trackInfo, albumArtist);
		if (!artist) {
			const name = (albumArtist ? (trackInfo.tag.albumArtist || trackInfo.tag.artist) : trackInfo.tag.artist) || cUnknownArtist;
			if (name === MUSICBRAINZ_VARIOUS_ARTISTS_NAME) {
				return this.findOrCreateCompilationArtist();
			}
			artist = await this.buildArtist(trackInfo, albumArtist);
			this.changes.artists.added.add(artist);
		} else {
			this.changes.artists.updated.add(artist);
		}
		this.artistCache.push({artist, slugs: [artist.slug]});
		return artist;
	}

	// folder
	//
	// async getFolderByID(id: string): Promise<Folder | undefined> {
	// 	let folder = changes.newFolders.find(f => f.id === id);
	// 	if (!folder) {
	// 		folder = changes.updateFolders.find(f => f.id === id);
	// 	}
	// 	if (!folder) {
	// 		folder = this.folderCache.find(f => f.id === id);
	// 	}
	// 	if (!folder) {
	// 		folder = await this.store.folderStore.byId(id);
	// 		if (folder) {
	// 			this.folderCache.push(folder);
	// 		}
	// 	}
	// 	return folder;
	// }
}
