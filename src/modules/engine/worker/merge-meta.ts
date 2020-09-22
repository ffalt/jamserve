import {MetaMergerCache, MetaMergeTrackInfo} from './meta-cache';
import {logger} from '../../../utils/logger';
import {Changes} from './changes';
import {Root} from '../../../entity/root/root';
import {cUnknownArtist, MUSICBRAINZ_VARIOUS_ARTISTS_NAME} from '../../../types/consts';
import {Artist} from '../../../entity/artist/artist';
import {Orm} from '../services/orm.service';
import {AlbumType} from '../../../types/enums';
import {Folder} from '../../../entity/folder/folder';
import {MetaStatBuilder} from '../../../utils/stats-builder';
import {slugify} from '../../../utils/slug';
import {Genre} from '../../../entity/genre/genre';

const log = logger('Worker.MetaMerger');

export class MetaMerger {
	cache!: MetaMergerCache;
	root!: Root;

	constructor(private orm: Orm, private changes: Changes, private rootID: string) {
	}

	private async collectArtistNames(artist: Artist): Promise<{ artistName: string; artistSortName: string; slug: string }> {
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
		return {artistName, slug: slugify(artistName), artistSortName: metaStatBuilder.mostUsed('artistSort') || artist.name};
	}

	private async collectArtistAlbumTypes(artist: Artist): Promise<Array<AlbumType>> {
		const types = new Set<AlbumType>();
		const albums = await artist.albums.getItems();
		for (const album of albums) {
			types.add(album.albumType);
		}
		return [...types];
	}

	private async addMeta(trackInfo: MetaMergeTrackInfo): Promise<void> {

		const linkArtist = async (a: Artist) => {
			await a.roots.add(this.root);
			await a.folders.add(trackInfo.folder);
			this.orm.Artist.persistLater(a);
		};

		const artist = await this.cache.findOrCreateArtist(trackInfo, false);
		await linkArtist(artist);
		await trackInfo.track.artist.set(artist);
		await artist.tracks.add(trackInfo.track);

		const albumArtist: Artist = (trackInfo.folder.artist === MUSICBRAINZ_VARIOUS_ARTISTS_NAME) ?
			await this.cache.findOrCreateCompilationArtist() :
			await this.cache.findOrCreateArtist(trackInfo, true);
		await linkArtist(albumArtist);
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

	private async applyChangedTrackMeta(): Promise<void> {
		const changedTracks = this.changes.tracks.added.ids().concat(this.changes.tracks.updated.ids());
		if (changedTracks.length === 0) {
			return;
		}
		const folderCache = new Map<string, Folder>();
		for (const id of changedTracks) {
			const track = await this.orm.Track.oneOrFailByID(id);
			const tag = await track.tag.get();
			let folder = folderCache.get(track.folder.idOrFail());
			if (!folder) {
				folder = await track.folder.getOrFail();
				folderCache.set(folder.id, folder);
			}
			if (tag && folder) {
				const trackInfo: MetaMergeTrackInfo = {track, tag, folder};
				await this.addMeta(trackInfo);
			}
			if (this.orm.em.changesCount() > 500) {
				log.debug('Syncing new Track Meta to DB');
				await this.orm.em.flush();
			}
		}
		if (this.orm.em.hasChanges()) {
			log.debug('Syncing new Track Meta to DB');
			await this.orm.em.flush();
		}
	}

	private async loadChangedMeta(): Promise<void> {
		const trackIDs = this.changes.tracks.updated.ids().concat(this.changes.tracks.removed.ids());
		if (trackIDs.length > 0) {
			log.info('Updating Metadata');
			// Load all artists/albums/series for track, in case track artist changed
			const artists = await this.orm.Artist.findIDsFilter({trackIDs});
			this.changes.artists.updated.appendIDs(artists);
			const albumArtists = await this.orm.Artist.findIDsFilter({albumTrackIDs: trackIDs});
			this.changes.artists.updated.appendIDs(albumArtists);
			const albums = await this.orm.Album.findIDsFilter({trackIDs});
			this.changes.albums.updated.appendIDs(albums);
			const series = await this.orm.Series.findIDsFilter({trackIDs});
			this.changes.series.updated.appendIDs(series);
			const genres = await this.orm.Genre.findIDsFilter({trackIDs});
			this.changes.genres.updated.appendIDs(genres);
		}
		if (this.orm.em.hasChanges()) {
			log.debug('Syncing Track/Folder Changes to DB');
			await this.orm.em.flush();
		}
	}

	private async applyChangedArtistMeta(id: string): Promise<void> {
		const artist = await this.orm.Artist.oneOrFailByID(id);
		log.debug('Updating artist', artist.name);
		const currentTracks = await this.orm.Track.findFilter({artistIDs: [id]});
		const tracks = currentTracks.filter(t => !this.changes.tracks.removed.has(t));
		await artist.tracks.set(tracks);
		const currentAlbumArtistTracks = await this.orm.Track.findFilter({albumArtistIDs: [id]});
		const albumTracks = currentAlbumArtistTracks.filter(t => !this.changes.tracks.removed.has(t));
		await artist.albumTracks.set(albumTracks);
		const allTracks = tracks.concat(albumTracks);
		if (allTracks.length === 0) {
			this.changes.artists.removed.add(artist);
			this.changes.artists.updated.delete(artist);
		} else {
			if (artist.name !== MUSICBRAINZ_VARIOUS_ARTISTS_NAME) {
				const {artistName, artistSortName, slug} = await this.collectArtistNames(artist);
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
			await artist.folders.set(folders);
			const genreMap = new Map<string, Genre>();
			for (const track of allTracks) {
				const genres = await track.genres.getItems();
				for (const genre of genres) {
					genreMap.set(genre.id, genre);
				}
			}
			await artist.genres.set([...genreMap.values()]);
			artist.albumTypes = await this.collectArtistAlbumTypes(artist);
			this.orm.Artist.persistLater(artist);
		}
	}

	private async applyChangedArtistsMeta(): Promise<void> {
		const artistIDs = this.changes.artists.updated.ids().concat(this.changes.artists.added.ids());
		for (const id of artistIDs) {
			await this.applyChangedArtistMeta(id);
			if (this.orm.em.changesCount() > 500) {
				log.debug('Syncing new Artist Meta to DB');
				await this.orm.em.flush();
			}
		}
		if (this.orm.em.hasChanges()) {
			log.debug('Syncing new Artist Meta to DB');
			await this.orm.em.flush();
		}
	}

	private async applyChangedSeriesMeta(): Promise<void> {
		const seriesIDs = this.changes.series.updated.ids().concat(this.changes.series.added.ids());

		for (const id of seriesIDs) {
			const series = await this.orm.Series.oneOrFailByID(id);
			log.debug('Updating series', series.name);
			const albumTypes = new Set<AlbumType>();
			const albums = (await series.albums.getItems()).filter(t => {
				return !this.changes.albums.removed.has(t);
			});
			const currentTracks = await this.orm.Track.findFilter({seriesIDs: [id]});
			const tracks = currentTracks.filter(t => !this.changes.tracks.removed.has(t));
			await series.tracks.set(tracks);
			if (tracks.length === 0) {
				this.changes.series.removed.add(series);
				this.changes.series.updated.delete(series);
			} else {
				for (const album of albums) {
					albumTypes.add(album.albumType);
				}
				series.albumTypes = [...albumTypes];
				this.orm.Series.persistLater(series);
			}
			if (this.orm.em.changesCount() > 500) {
				log.debug('Syncing new Series Meta to DB');
				await this.orm.em.flush();
			}
		}
		if (this.orm.em.hasChanges()) {
			log.debug('Syncing new Series Meta to DB');
			await this.orm.em.flush();
		}
	}

	private async applyChangedAlbumMeta(): Promise<void> {
		const albumIDs = this.changes.albums.updated.ids().concat(this.changes.albums.added.ids());
		for (const id of albumIDs) {
			const album = await this.orm.Album.oneOrFailByID(id);
			log.debug('Updating album', album.name);
			const currentTracks = await this.orm.Track.findFilter({albumIDs: [id]});
			const tracks = currentTracks.filter(t => !this.changes.tracks.removed.has(t));
			await album.tracks.set(tracks);
			if (tracks.length === 0) {
				this.changes.albums.removed.add(album);
				this.changes.albums.updated.delete(album);
			} else {
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
				}
				album.albumType = (metaStatBuilder.mostUsed('albumType') as AlbumType) || AlbumType.unknown;

				let duration = 0;
				const genreMap = new Map<string, Genre>();
				for (const track of tracks) {
					const tag = await track.tag.get();
					duration += (tag?.mediaDuration || 0);
					metaStatBuilder.statID('seriesNr', tag?.seriesNr);
					metaStatBuilder.statNumber('year', tag?.year);
					const genres = await track.genres.getItems();
					for (const genre of genres) {
						genreMap.set(genre.id, genre);
					}
				}
				album.duration = duration;
				album.seriesNr = metaStatBuilder.mostUsed('seriesNr');
				album.year = metaStatBuilder.mostUsedNumber('year');
				await album.genres.set([...genreMap.values()]);
				this.orm.Album.persistLater(album);
			}
			if (this.orm.em.changesCount() > 500) {
				log.debug('Syncing new Album Meta to DB');
				await this.orm.em.flush();
			}
		}
		if (this.orm.em.hasChanges()) {
			log.debug('Syncing new Album Meta to DB');
			await this.orm.em.flush();
		}
	}

	private async applyChangedGenresMeta(): Promise<void> {
		const genreIDs = this.changes.genres.updated.ids();
		for (const id of genreIDs) {
			const genre = await this.orm.Genre.oneOrFailByID(id);
			log.debug('Updating genre', genre.name);
			const currentTracks = await this.orm.Track.findFilter({genreIDs: [id]});
			const tracks = currentTracks.filter(t => !this.changes.tracks.removed.has(t));
			if (tracks.length === 0) {
				this.changes.genres.removed.add(genre);
				this.changes.genres.updated.delete(genre);
				this.orm.Genre.removeLater(genre);
			} else {
				await genre.tracks.set(tracks);
				this.orm.Genre.persistLater(genre);
			}
			if (this.orm.em.changesCount() > 500) {
				log.debug('Syncing new Genre Meta to DB');
				await this.orm.em.flush();
			}
		}
		if (this.orm.em.hasChanges()) {
			log.debug('Syncing new Genre Meta to DB');
			await this.orm.em.flush();
		}
	}

	async mergeMeta(): Promise<void> {
		this.root = await this.orm.Root.oneOrFailByID(this.rootID);
		this.cache = new MetaMergerCache(this.orm, this.changes, this.root);
		await this.loadChangedMeta(); // register all album/series/artist/genre to check for changes
		await this.applyChangedTrackMeta(); // add/update track meta
		await this.applyChangedAlbumMeta(); // update albums
		await this.applyChangedArtistsMeta(); // update artists
		await this.applyChangedSeriesMeta(); // update series
		await this.applyChangedGenresMeta(); // update genres
	}
}
