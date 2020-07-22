import {MetaMergerCache, MetaMergeTrackInfo} from './meta-cache';
import {logger} from '../../../utils/logger';
import {Changes} from './changes';
import {Root} from '../../../entity/root/root';
import {MUSICBRAINZ_VARIOUS_ARTISTS_NAME} from '../../../types/consts';
import {Artist} from '../../../entity/artist/artist';
import {Orm} from '../services/orm.service';
import {AlbumType} from '../../../types/enums';
import {Album} from '../../../entity/album/album';
import {Folder} from '../../../entity/folder/folder';

const log = logger('Worker.MetaMerger');

export class MetaMerger {
	cache!: MetaMergerCache;
	root!: Root;

	constructor(private orm: Orm, private changes: Changes, private rootID: string) {
	}

	private async collectAlbumGenres(album: Album): Promise<Array<string>> {
		const genres = new Set<string>();
		const folders = await album.folders.getItems();
		for (const folder of folders) {
			folder.genres.forEach(genre => genres.add(genre));
		}
		return [...genres];
	}

	private async collectArtistGenres(artist: Artist): Promise<Array<string>> {
		const genres = new Set<string>();
		const albums = await artist.albums.getItems();
		for (const album of albums) {
			album.genres.forEach(genre => genres.add(genre));
		}
		return [...genres];
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
		for (const id of changedTracks) {
			const track = await this.orm.Track.oneOrFailByID(id);
			const tag = await track.tag.get();
			const folder = await track.folder.get();
			if (tag && folder) {
				const trackInfo: MetaMergeTrackInfo = {track, tag, folder};
				await this.addMeta(trackInfo);
			}
		}
		log.debug('Syncing new Meta to DB');
		await this.orm.em.flush();
	}

	private async loadChangedMeta(): Promise<void> {
		const trackIDs = this.changes.tracks.updated.ids().concat(this.changes.tracks.removed.ids());
		if (trackIDs.length > 0) {
			// Load all artists/albums/series for track, in case track artist changed
			const artists = await this.orm.Artist.findIDsFilter({trackIDs})
			this.changes.artists.updated.appendIDs(artists);
			const albumArtists = await this.orm.Artist.findIDsFilter({albumTrackIDs: trackIDs})
			this.changes.artists.updated.appendIDs(albumArtists);
			const albums = await this.orm.Album.findIDsFilter({trackIDs})
			this.changes.albums.updated.appendIDs(albums);
			const series = await this.orm.Series.findIDsFilter({trackIDs})
			this.changes.series.updated.appendIDs(series);
		}
	}

	private async applyChangedArtistMeta(): Promise<void> {
		const artistIDs = this.changes.artists.updated.ids().concat(this.changes.artists.added.ids());
		for (const id of artistIDs) {
			const artist = await this.orm.Artist.oneOrFailByID(id);
			log.debug('Updating artist', artist.name);
			const currentTracks = await this.orm.Track.findFilter({artistIDs: [id]});
			const tracks = currentTracks.filter(t => !this.changes.tracks.removed.has(t));
			await artist.tracks.set(tracks);
			const currentAlbumArtistTracks = await this.orm.Track.findFilter({albumArtistIDs: [id]});
			const albumTracks = currentAlbumArtistTracks.filter(t => !this.changes.tracks.removed.has(t));
			await artist.albumTracks.set(albumTracks);
			if (tracks.length === 0 && albumTracks.length === 0) {
				this.changes.artists.removed.add(artist);
				this.changes.artists.updated.delete(artist);
			} else {
				const albums = (await artist.albums.getItems()).filter(t => t.artist.id() === artist.id && !this.changes.albums.removed.has(t));
				await artist.albums.set(albums);
				const folders: Array<Folder> = [];
				for (const folder of (await artist.folders.getItems())) {
					if ((await folder.albums.getItems()).find(a => (a.artist.id() === artist.id) && !this.changes.folders.removed.has(folder))) {
						folders.push(folder);
					}
				}
				await artist.folders.set(folders);
				artist.genres = await this.collectArtistGenres(artist);
				artist.albumTypes = await this.collectArtistAlbumTypes(artist);
			}
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
			for (const album of albums) {
				albumTypes.add(album.albumType);
			}
			series.albumTypes = [...albumTypes];
			const currentTracks = await this.orm.Track.findFilter({seriesIDs: [id]});
			const tracks = currentTracks.filter(t => !this.changes.tracks.removed.has(t));
			series.tracks.set(tracks);
			if (tracks.length === 0) {
				this.changes.series.removed.add(series);
				this.changes.series.updated.delete(series);
			}
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
				album.genres = await this.collectAlbumGenres(album);
			}
		}
	}

	async mergeMeta(): Promise<void> {
		this.root = await this.orm.Root.oneOrFailByID(this.rootID);
		this.cache = new MetaMergerCache(this.orm, this.changes, this.root);
		await this.loadChangedMeta(); // register all album/series/artist to check for changes

		log.debug('Syncing Track/Folder Changes to DB');
		await this.orm.em.flush();

		await this.applyChangedTrackMeta(); // add/update track meta

		await this.applyChangedAlbumMeta(); // update albums
		await this.applyChangedArtistMeta(); // update artists
		await this.applyChangedSeriesMeta(); // update series

		log.debug('Syncing Meta Updates to DB');
		await this.orm.em.flush();
	}
}
