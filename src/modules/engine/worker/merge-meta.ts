import { MetaMergerCache, MetaMergeTrackInfo } from './meta-cache.js';
import { logger } from '../../../utils/logger.js';
import { Changes } from './changes.js';
import { Root } from '../../../entity/root/root.js';
import { cUnknownArtist, MUSICBRAINZ_VARIOUS_ARTISTS_NAME } from '../../../types/consts.js';
import { Artist } from '../../../entity/artist/artist.js';
import { Orm } from '../services/orm.service.js';
import { AlbumType, FolderType } from '../../../types/enums.js';
import { Folder } from '../../../entity/folder/folder.js';
import { MetaStatBuilder } from '../../../utils/stats-builder.js';
import { slugify } from '../../../utils/slug.js';
import { Genre } from '../../../entity/genre/genre.js';
import { extractAlbumName } from '../../../utils/album-name.js';
import { Album } from '../../../entity/album/album.js';
import { Track } from '../../../entity/track/track.js';

const log = logger('Worker.MetaMerger');

export class MetaMerger {
	cache!: MetaMergerCache;
	root!: Root;

	constructor(
		private readonly orm: Orm,
		private readonly changes: Changes,
		private readonly rootID: string
	) {
	}

	private static async collectArtistNames(artist: Artist): Promise<{ artistName: string; artistSortName: string; slug: string }> {
		const metaStatBuilder = new MetaStatBuilder();
		const tracks = await artist.tracks.getItems();
		for (const track of tracks) {
			const tag = await track.tag.getOrFail();
			if (track.artist.id() === artist.id) {
				metaStatBuilder.statSlugValue('artist', tag.artist);
				metaStatBuilder.statSlugValue('artistSort', tag.artistSort);
			}
			if (track.albumArtist.id() === artist.id) {
				metaStatBuilder.statSlugValue('artist', tag.albumArtist);
				metaStatBuilder.statSlugValue('artistSort', tag.albumArtistSort);
			}
		}
		const artistName = metaStatBuilder.mostUsed('artist') || cUnknownArtist;
		return { artistName, slug: slugify(artistName), artistSortName: metaStatBuilder.mostUsed('artistSort') || artist.name };
	}

	private static async collectArtistAlbumTypes(artist: Artist): Promise<Array<AlbumType>> {
		const types = new Set<AlbumType>();
		const albums = await artist.albums.getItems();
		for (const album of albums) {
			types.add(album.albumType);
		}
		return [...types];
	}

	private async linkArtist(a: Artist, trackInfo: MetaMergeTrackInfo): Promise<void> {
		await a.roots.add(this.root);
		await a.folders.add(trackInfo.folder);
		this.orm.Artist.persistLater(a);
	}

	private async addMeta(trackInfo: MetaMergeTrackInfo): Promise<void> {
		const artist = await this.cache.findOrCreateArtist(trackInfo, false);
		await this.linkArtist(artist, trackInfo);
		await trackInfo.track.artist.set(artist);
		await artist.tracks.add(trackInfo.track);

		const albumArtist: Artist = (trackInfo.folder.artist === MUSICBRAINZ_VARIOUS_ARTISTS_NAME) ?
			await this.cache.findOrCreateCompilationArtist() :
			await this.cache.findOrCreateArtist(trackInfo, true);
		await this.linkArtist(albumArtist, trackInfo);
		await trackInfo.track.albumArtist.set(albumArtist);
		await albumArtist.albumTracks.add(trackInfo.track);

		const album = await this.cache.findOrCreateAlbum(trackInfo, albumArtist);
		await album.roots.add(this.root);
		await album.folders.add(trackInfo.folder);
		await album.tracks.add(trackInfo.track);
		await trackInfo.track.album.set(album);
		this.orm.Album.persistLater(album);

		if (trackInfo.tag.series) {
			const series = await this.cache.findOrCreateSeries(trackInfo, albumArtist, album);
			if (series) {
				await series.roots.add(this.root);
				await series.folders.add(trackInfo.folder);
				await series.tracks.add(trackInfo.track);
				await series.albums.add(album);
				await trackInfo.track.series.set(series);
				this.orm.Series.persistLater(series);
			}
		}

		this.orm.Track.persistLater(trackInfo.track);
	}

	private async loadChangedMeta(): Promise<void> {
		const trackIDs = this.changes.tracks.updated.ids().concat(this.changes.tracks.removed.ids());
		if (trackIDs.length > 0) {
			log.info('Updating Metadata');
			// Load all artists/albums/series for track, in case track artist changed
			const artists = await this.orm.Artist.findIDsFilter({ trackIDs });
			this.changes.artists.updated.appendIDs(artists);
			const albumArtists = await this.orm.Artist.findIDsFilter({ albumTrackIDs: trackIDs });
			this.changes.artists.updated.appendIDs(albumArtists);
			const albums = await this.orm.Album.findIDsFilter({ trackIDs });
			this.changes.albums.updated.appendIDs(albums);
			const series = await this.orm.Series.findIDsFilter({ trackIDs });
			this.changes.series.updated.appendIDs(series);
			const genres = await this.orm.Genre.findIDsFilter({ trackIDs });
			this.changes.genres.updated.appendIDs(genres.filter(id => !this.changes.genres.added.hasID(id)));
		}
		await this.flush('Track/Folder');
	}

	private async flush(section: string): Promise<void> {
		if (this.orm.em.hasChanges()) {
			log.debug('Syncing ' + section + ' Meta to DB');
			await this.orm.em.flush();
		}
	}

	private async flushIfNeeded(section: string): Promise<void> {
		if (this.orm.em.changesCount() > 500) {
			log.debug('Syncing ' + section + ' Meta to DB');
			await this.orm.em.flush();
		}
	}

	private async applyChangedTrackMeta(id: string, folderCache: Map<string, Folder>) {
		const track = await this.orm.Track.oneOrFailByID(id);
		let folder = folderCache.get(track.folder.idOrFail());
		if (!folder) {
			folder = await track.folder.getOrFail();
			folderCache.set(folder.id, folder);
		}
		const tag = await track.tag.get();
		if (tag && folder) {
			const trackInfo: MetaMergeTrackInfo = { track, tag, folder };
			await this.addMeta(trackInfo);
		}
	}

	private async applyChangedTracksMeta(): Promise<void> {
		const changedTracks = this.changes.tracks.added.ids().concat(this.changes.tracks.updated.ids());
		const folderCache = new Map<string, Folder>();
		for (const id of changedTracks) {
			await this.applyChangedTrackMeta(id, folderCache);
			await this.flushIfNeeded('Track');
		}
		await this.flush('Track');
	}

	private async applyChangedArtistMeta(id: string): Promise<void> {
		const artist = await this.orm.Artist.oneOrFailByID(id);
		log.debug('Updating artist', artist.name);
		const currentTracks = await this.orm.Track.findFilter({ artistIDs: [id] });
		const tracks = currentTracks.filter(t => !this.changes.tracks.removed.has(t));
		await artist.tracks.set(tracks);
		const currentAlbumArtistTracks = await this.orm.Track.findFilter({ albumArtistIDs: [id] });
		const albumTracks = currentAlbumArtistTracks.filter(t => !this.changes.tracks.removed.has(t));
		await artist.albumTracks.set(albumTracks);
		const allTracks = tracks.concat(albumTracks);
		if (allTracks.length === 0) {
			this.changes.artists.removed.add(artist);
			this.changes.artists.updated.delete(artist);
		} else {
			await this.updateArtistMeta(artist, allTracks);
		}
	}

	private async updateArtistMeta(artist: Artist, tracks: Array<Track>): Promise<void> {
		if (artist.name !== MUSICBRAINZ_VARIOUS_ARTISTS_NAME) {
			const { artistName, artistSortName, slug } = await MetaMerger.collectArtistNames(artist);
			artist.name = artistName;
			artist.slug = slug;
			artist.nameSort = artistSortName;
		}
		const albums = (await artist.albums.getItems()).filter(t => t.artist.id() === artist.id && !this.changes.albums.removed.has(t));
		await artist.albums.set(albums);
		const folders: Array<Folder> = [];
		for (const folder of (await artist.folders.getItems())) {
			if ((await folder.albums.getItems()).find(a => (a.artist.id() === artist.id) && !this.changes.folders.removed.has(folder))) {
				folders.push(folder);
			}
		}
		for (const folder of folders) {
			const parent = await folder.parent.get();
			if (parent?.folderType === FolderType.artist) {
				if (!folders.find(f => f.id === parent.id)) {
					folders.push(parent);
				}
			}
		}
		await artist.folders.set(folders);
		const genreMap = new Map<string, Genre>();
		for (const track of tracks) {
			const genres = await track.genres.getItems();
			for (const genre of genres) {
				genreMap.set(genre.id, genre);
			}
		}
		await artist.genres.set([...genreMap.values()]);
		artist.albumTypes = await MetaMerger.collectArtistAlbumTypes(artist);
		this.orm.Artist.persistLater(artist);
	}

	private async applyChangedArtistsMeta(): Promise<void> {
		const artistIDs = this.changes.artists.updated.ids().concat(this.changes.artists.added.ids());
		for (const id of artistIDs) {
			await this.applyChangedArtistMeta(id);
			await this.flushIfNeeded('Artist');
		}
		await this.flush('Artist');
	}

	private async applyChangedSerieMeta(id: string): Promise<void> {
		const series = await this.orm.Series.oneOrFailByID(id);
		log.debug('Updating series', series.name);
		const albumTypes = new Set<AlbumType>();
		const albums = (await series.albums.getItems()).filter(t => !this.changes.albums.removed.has(t));
		const currentTracks = await this.orm.Track.findFilter({ seriesIDs: [id] });
		const tracks = currentTracks.filter(t => !this.changes.tracks.removed.has(t));
		await series.tracks.set(tracks);
		if (tracks.length === 0) {
			this.changes.series.removed.add(series);
			this.changes.series.updated.delete(series);
		} else {
			const genreMap = new Map<string, Genre>();
			for (const album of albums) {
				albumTypes.add(album.albumType);
				const genres = await album.genres.getItems();
				genres.forEach(genre => genreMap.set(genre.id, genre));
			}
			await series.genres.set([...genreMap.values()]);
			series.albumTypes = [...albumTypes];
			this.orm.Series.persistLater(series);
		}
	}

	private async applyChangedSeriesMeta(): Promise<void> {
		const seriesIDs = this.changes.series.updated.ids().concat(this.changes.series.added.ids());
		for (const id of seriesIDs) {
			await this.applyChangedSerieMeta(id);
			await this.flushIfNeeded('Series');
		}
		await this.flush('Series');
	}

	private async applyChangedAlbumMeta(id: string): Promise<void> {
		const album = await this.orm.Album.oneOrFailByID(id);
		log.debug('Updating album', album.name);
		const currentTracks = await this.orm.Track.findFilter({ albumIDs: [id] });
		const tracks = currentTracks.filter(t => !this.changes.tracks.removed.has(t));
		await album.tracks.set(tracks);
		if (tracks.length === 0) {
			this.changes.albums.removed.add(album);
			this.changes.albums.updated.delete(album);
		} else {
			await this.updateAlbumMeta(album, tracks);
		}
	}

	private async updateAlbumMeta(album: Album, tracks: Track[]): Promise<void> {
		const folders: Array<Folder> = [];
		const albumFolders = await album.folders.getItems();
		for (const folder of albumFolders) {
			const folderAlbums = await folder.albums.getItems();
			if (folderAlbums.find(a => a.id === album.id) && !this.changes.folders.removed.has(folder)) {
				folders.push(folder);
			}
		}
		await album.folders.set(folders);

		const metaStatBuilder = new MetaStatBuilder();
		for (const folder of folders) {
			metaStatBuilder.statID('albumType', folder.albumType);
			metaStatBuilder.statID('mbArtistID', folder.mbArtistID);
			metaStatBuilder.statID('mbReleaseID', folder.mbReleaseID);
		}
		album.albumType = (metaStatBuilder.mostUsed('albumType') as AlbumType) || AlbumType.unknown;
		let duration = 0;
		const genreMap = new Map<string, Genre>();
		for (const track of tracks) {
			const tag = await track.tag.get();
			duration += (tag?.mediaDuration || 0);
			metaStatBuilder.statID('seriesNr', tag?.seriesNr);
			metaStatBuilder.statNumber('year', tag?.year);
			metaStatBuilder.statID('mbArtistID', tag?.mbArtistID);
			metaStatBuilder.statID('mbReleaseID', tag?.mbReleaseID);
			metaStatBuilder.statSlugValue('album', tag?.album && extractAlbumName(tag?.album));
			const genres = await track.genres.getItems();
			genres.forEach(genre => genreMap.set(genre.id, genre));
		}
		album.mbArtistID = metaStatBuilder.mostUsed('mbArtistID');
		album.mbReleaseID = metaStatBuilder.mostUsed('mbReleaseID');
		album.name = metaStatBuilder.mostUsed('album', album.name) || album.name;
		album.slug = slugify(album.name);
		album.duration = duration;
		album.seriesNr = metaStatBuilder.mostUsed('seriesNr');
		album.year = metaStatBuilder.mostUsedNumber('year');
		await album.genres.set([...genreMap.values()]);
		this.orm.Album.persistLater(album);
	}

	private async applyChangedAlbumsMeta(): Promise<void> {
		const albumIDs = this.changes.albums.updated.ids().concat(this.changes.albums.added.ids());
		for (const id of albumIDs) {
			await this.applyChangedAlbumMeta(id);
			await this.flushIfNeeded('Album');
		}
		await this.flush('Album');
	}

	private async applyChangedGenreMeta(id: string): Promise<void> {
		const genre = await this.orm.Genre.oneOrFailByID(id);
		log.debug('Updating genre', genre.name);
		const currentTracks = await this.orm.Track.findFilter({ genreIDs: [id] });
		const tracks = currentTracks.filter(t => !this.changes.tracks.removed.has(t));
		if (tracks.length === 0) {
			this.changes.genres.removed.add(genre);
			this.changes.genres.updated.delete(genre);
			this.orm.Genre.removeLater(genre);
		} else {
			await genre.tracks.set(tracks);
			this.orm.Genre.persistLater(genre);
		}
	}

	private async applyChangedGenresMeta(): Promise<void> {
		const trackIDs = this.changes.tracks.removed.ids();
		const updateGenreIDs = trackIDs.length === 0 ? [] : await this.orm.Genre.findIDsFilter({ trackIDs });
		this.changes.genres.updated.appendIDs(updateGenreIDs);
		const genreIDs = this.changes.genres.updated.ids();
		for (const id of genreIDs) {
			await this.applyChangedGenreMeta(id);
			await this.flushIfNeeded('Genre');
		}
		await this.flush('Genre');
	}

	async mergeMeta(): Promise<void> {
		this.root = await this.orm.Root.oneOrFailByID(this.rootID);
		this.cache = new MetaMergerCache(this.orm, this.changes, this.root);
		await this.loadChangedMeta(); // register all album/series/artist/genre to check for changes
		await this.applyChangedTracksMeta();
		await this.applyChangedAlbumsMeta();
		await this.applyChangedArtistsMeta();
		await this.applyChangedSeriesMeta();
		await this.applyChangedGenresMeta();
	}
}
