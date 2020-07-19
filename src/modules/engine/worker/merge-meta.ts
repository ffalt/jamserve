import {MetaMergerCache, MetaMergeTrackInfo} from './meta-cache';
import {logger} from '../../../utils/logger';
import {Changes} from './changes';
import {Root} from '../../../entity/root/root';
import {MUSICBRAINZ_VARIOUS_ARTISTS_NAME} from '../../../types/consts';
import {Artist} from '../../../entity/artist/artist';
import {OrmService} from '../services/orm.service';
import {AlbumType} from '../../../types/enums';
import {Album} from '../../../entity/album/album';
import {Folder} from '../../../entity/folder/folder';

const log = logger('Worker.MetaMerger');

export class MetaMerger {
	cache: MetaMergerCache;

	constructor(private orm: OrmService, private changes: Changes, private root: Root) {
		this.cache = new MetaMergerCache(orm, changes, root);
	}

	/*

	private async addMeta(trackInfo: MetaMergeTrackInfo): Promise<void> {
		if (!trackInfo.parent) {
			return;
		}
		const artist = await this.cache.findOrCreateArtist(trackInfo, false);
		trackInfo.track.artistID = artist.id;
		const albumArtist: Artist = (trackInfo.parent.tag.artist === MUSICBRAINZ_VARIOUS_ARTISTS_NAME) ?
			await this.cache.findOrCreateCompilationArtist() :
			await this.cache.findOrCreateArtist(trackInfo, true);
		trackInfo.track.albumArtistID = albumArtist.id;
		const album = await this.cache.findOrCreateAlbum(trackInfo, albumArtist.id);
		trackInfo.track.albumID = album.id;
		if (trackInfo.track.tag.series) {
			const series = await this.cache.findOrCreateSeries(trackInfo, albumArtist.id, albumArtist.name, album.id);
			if (series) {
				trackInfo.track.seriesID = series.id;
				album.seriesID = series.id;
				if (!artist.seriesIDs.includes(series.id)) {
					artist.seriesIDs.push(series.id);
				}
			}
		}
	}

	private async removeMeta(track: Track): Promise<void> {
		if (track.seriesID) {
			const series = await this.cache.getSeriesByID(track.seriesID);
			if (series && !this.changes.updateSeries.includes(series)) {
				this.changes.updateSeries.push(series);
			}
		}
		let artist = await this.cache.getArtistByID(track.artistID);
		if (artist && !this.changes.updateArtists.includes(artist)) {
			this.changes.updateArtists.push(artist);
		}
		if (track.artistID !== track.albumArtistID) {
			artist = await this.cache.getArtistByID(track.albumArtistID);
			if (artist && !this.changes.updateArtists.includes(artist)) {
				this.changes.updateArtists.push(artist);
			}
		}
		const album = await this.cache.getAlbumByID(track.albumID);
		if (album && !this.changes.updateAlbums.includes(album)) {
			this.changes.updateAlbums.push(album);
		}
	}

	private async collectNewTrackInfos(changes: Changes): Promise<Array<MetaMergeTrackInfo>> {
		const newTracks: Array<MetaMergeTrackInfo> = [];
		for (const track of this.changes.newTracks) {
			const parent = await this.cache.getFolderByID(track.parentID);
			if (parent) {
				newTracks.push({track, parent});
			}
		}
		return newTracks;
	}

	private async collectUpdateTrackInfos(changes: Changes): Promise<Array<MetaMergeTrackInfo>> {
		const updateTracks: Array<MetaMergeTrackInfo> = [];
		for (const trackInfo of this.changes.updateTracks) {
			const parent = await this.cache.getFolderByID(trackInfo.track.parentID);
			if (parent) {
				updateTracks.push({track: trackInfo.track, oldTrack: trackInfo.oldTrack, parent});
			}
		}
		return updateTracks;
	}

	private async collectAll(rootID: string): Promise<void> {
		const allArtistIDs = await this.store.artistStore.searchIDs({rootID});
		for (const id of allArtistIDs) {
			await this.cache.getArtistByID(id);
		}
		const allAlbumIDs = await this.store.albumStore.searchIDs({rootID});
		for (const id of allAlbumIDs) {
			await this.cache.getAlbumByID(id);
		}
		const allSeriesIDs = await this.store.seriesStore.searchIDs({rootID});
		for (const id of allSeriesIDs) {
			await this.cache.getSeriesByID(id);
		}
	}

	// artist

	private async refreshArtistTracks(artist: Artist, removedTrackIDs: Array<string>, updateTracks: Array<MetaMergeTrackInfo>, newTracks: Array<MetaMergeTrackInfo>): Promise<Array<Track>> {
		// get all track ids in the db
		let trackIDs = await this.store.trackStore.searchIDs({artistID: artist.id});
		const tracksAlbumsIDs = await this.store.trackStore.searchIDs({albumArtistID: artist.id});
		for (const id of tracksAlbumsIDs) {
			if (!trackIDs.includes(id)) {
				trackIDs.push(id);
			}
		}
		// filter out removed tracks
		trackIDs = trackIDs.filter(t => !removedTrackIDs.includes(t));
		let removedFromArtist = updateTracks.filter(t => (t.oldTrack.artistID === artist.id && t.track.artistID !== artist.id)).map(t => t.track.id);
		// filter out updated tracks which are no longer part of the artist
		trackIDs = trackIDs.filter(t => !removedFromArtist.includes(t));
		// filter out updated tracks which are no longer part of the album artist
		removedFromArtist = updateTracks.filter(t => (t.oldTrack.albumArtistID === artist.id && t.track.albumArtistID !== artist.id)).map(t => t.track.id);
		trackIDs = trackIDs.filter(t => !removedFromArtist.includes(t));
		// get all new and updated tracks which are part of the artist
		const refreshedTracks: Array<MetaMergeTrackInfo> = (updateTracks.filter(t => t.track.artistID === artist.id || t.track.albumArtistID === artist.id) as Array<MetaMergeTrackInfo>)
			.concat(newTracks.filter(t => t.track.artistID === artist.id || t.track.albumArtistID === artist.id));

		const tracks = await this.store.trackStore.byIds(trackIDs);
		return tracks.concat(refreshedTracks.map(t => t.track));
	}

	private async refreshArtistAlbums(artist: Artist): Promise<Array<Album>> {
		// get all album ids in the db
		let albumIDs = await this.store.albumStore.searchIDs({artistID: artist.id});
		// filter out removed album
		albumIDs = albumIDs.filter(id => !this.changes.removedAlbums.find(a => a.id === id));
		// filter out updated albums which are no longer part of the artist
		const refreshedAlbums = this.changes.updateAlbums.filter(a => a.artistID === artist.id)
			.concat(this.changes.newAlbums.filter(a => a.artistID === artist.id));
		albumIDs = albumIDs.filter(id => !refreshedAlbums.find(t => t.id === id));

		const albums = await this.store.albumStore.byIds(albumIDs);
		return refreshedAlbums.concat(albums);
	}

	private async refreshArtist(artist: Artist, changes: Changes, removedTrackIDs: Array<string>, updateTracks: Array<MetaMergeTrackInfo>, newTracks: Array<MetaMergeTrackInfo>): Promise<void> {
		log.debug('Refreshing Artist:', artist.name);
		const tracks = await this.refreshArtistTracks(artist, removedTrackIDs, updateTracks, newTracks);
		if (tracks.length === 0) {
			if (this.changes.newArtists.includes(artist)) {
				log.error('new artist without tracks', artist);
			} else {
				this.changes.removedArtists.push(artist);
			}
			return;
		}
		const metaStatBuilder = new MetaStatBuilder();
		const rootIDs = new Set<string>();
		const folderIDs = new Set<string>();
		const trackIDs = new Set<string>();
		const seriesIDs = new Set<string>();
		for (const track of tracks) {
			if (track.artistID === artist.id) {
				metaStatBuilder.statSlugValue('artist', track.tag.artist);
				metaStatBuilder.statSlugValue('artistSort', track.tag.artistSort);
			}
			if (track.albumArtistID === artist.id) {
				metaStatBuilder.statSlugValue('artist', track.tag.albumArtist);
				metaStatBuilder.statSlugValue('artistSort', track.tag.albumArtistSort);
			}
			metaStatBuilder.statSlugValue('genre', track.tag.genre);
			rootIDs.add(track.rootID);
			folderIDs.add(track.parentID);
			trackIDs.add(track.id);
			if (track.seriesID) {
				seriesIDs.add(track.seriesID);
			}
		}
		artist.rootIDs = [...rootIDs];
		artist.trackIDs = [...trackIDs];
		artist.folderIDs = [...folderIDs];
		artist.seriesIDs = [...seriesIDs];
		artist.genres = metaStatBuilder.asStringList('genre');
		if (artist.name !== MUSICBRAINZ_VARIOUS_ARTISTS_NAME) {
			const artistName = metaStatBuilder.mostUsed('artist') || cUnknownArtist;
			artist.name = artistName;
			artist.slug = slugify(artistName);
			artist.nameSort = metaStatBuilder.mostUsed('artistSort');
		}
		const albums = await this.refreshArtistAlbums(artist);
		const albumIDs = new Set<string>();
		const albumTypes = new Set<AlbumType>();
		for (const album of albums) {
			albumIDs.add(album.id);
			albumTypes.add(album.albumType);
		}
		artist.albumIDs = [...albumIDs];
		artist.albumTypes = [...albumTypes];
		if (!this.changes.newArtists.includes(artist)) {
			this.changes.updateArtists.push(artist);
		}
	}

	private async refreshArtists(changes: Changes, removedTrackIDs: Array<string>, updateTracks: Array<MetaMergeTrackInfo>, newTracks: Array<MetaMergeTrackInfo>): Promise<void> {
		const checkArtists = this.changes.updateArtists.concat(this.changes.newArtists);
		this.changes.removedArtists = [];
		this.changes.updateArtists = [];
		for (const artist of checkArtists) {
			await this.refreshArtist(artist, changes, removedTrackIDs, updateTracks, newTracks);
		}
	}

	// series

	private async refreshSeriesTracks(series: Series, changes: Changes, removedTrackIDs: Array<string>, updateTracks: Array<MetaMergeTrackInfo>, newTracks: Array<MetaMergeTrackInfo>): Promise<Array<MetaMergeTrackInfo>> {
		let trackIDs = await this.store.trackStore.searchIDs({seriesID: series.id});
		// filter out removed tracks
		trackIDs = trackIDs.filter(t => !removedTrackIDs.includes(t));
		// filter out updated tracks which are no longer part of the series
		const removedFromAlbum = updateTracks.filter(t => (t.oldTrack.seriesID === series.id && t.track.seriesID !== series.id)).map(t => t.track.id);
		trackIDs = trackIDs.filter(t => !removedFromAlbum.includes(t));
		// get all new and updated tracks which are part of the series
		const refreshedTracks: Array<MetaMergeTrackInfo> = (updateTracks.filter(t => t.track && t.track.seriesID === series.id) as Array<MetaMergeTrackInfo>)
			.concat(newTracks.filter(t => t.track.seriesID === series.id));
		const refreshIDs = refreshedTracks.map(t => t.track.id);
		trackIDs = trackIDs.filter(t => !refreshIDs.includes(t));
		// unchanged tracks
		const tracks = await this.store.trackStore.byIds(trackIDs);
		for (const track of tracks) {
			const folder = await this.cache.getFolderByID(track.parentID);
			if (folder) {
				refreshedTracks.push({track, parent: folder});
			}
		}
		return refreshedTracks;
	}

	private async refreshSeriesAlbums(series: Series): Promise<Array<Album>> {
		// get all album ids in the db
		let albumIDs = await this.store.albumStore.searchIDs({seriesID: series.id});
		// filter out removed album
		albumIDs = albumIDs.filter(id => !this.changes.removedAlbums.find(a => a.id === id));
		// filter out updated albums which are no longer part of the artist
		const refreshedAlbums = this.changes.updateAlbums.filter(a => a.seriesID === series.id)
			.concat(this.changes.newAlbums.filter(a => a.seriesID === series.id));
		albumIDs = albumIDs.filter(id => !refreshedAlbums.find(t => t.id === id));
		const albums = await this.store.albumStore.byIds(albumIDs);
		return refreshedAlbums.concat(albums);
	}

	private async refreshSeries(series: Series, changes: Changes, removedTrackIDs: Array<string>, updateTracks: Array<MetaMergeTrackInfo>, newTracks: Array<MetaMergeTrackInfo>): Promise<void> {
		log.debug('Refreshing Series:', series.name);
		const tracks = await this.refreshSeriesTracks(series, changes, removedTrackIDs, updateTracks, newTracks);
		if (tracks.length === 0) {
			if (this.changes.newSeries.includes(series)) {
				console.error('new series without tracks', series);
			} else {
				this.changes.removedSeries.push(series);
			}
			return;
		}
		const rootIDs = new Set<string>();
		const trackIDs = new Set<string>();
		const folderIDs = new Set<string>();
		const albumIDs = new Set<string>();
		for (const trackInfo of tracks) {
			const track = trackInfo.track;
			rootIDs.add(track.rootID);
			folderIDs.add(track.parentID);
			albumIDs.add(track.albumID);
			trackIDs.add(track.id);
		}
		const albums = await this.refreshSeriesAlbums(series);
		const albumTypes = new Set<AlbumType>();
		for (const album of albums) {
			albumTypes.add(album.albumType);
		}
		const artist = await this.cache.getArtistByID(series.artistID);
		if (artist) {
			series.artist = artist.name;
		}
		series.rootIDs = [...rootIDs];
		series.trackIDs = [...trackIDs];
		series.folderIDs = [...folderIDs];
		series.albumIDs = [...albumIDs];
		series.albumTypes = [...albumTypes];
		if (!this.changes.newSeries.includes(series)) {
			this.changes.updateSeries.push(series);
		}
	}

	private async refreshSerieses(changes: Changes, removedTrackIDs: Array<string>, updateTracks: Array<MetaMergeTrackInfo>, newTracks: Array<MetaMergeTrackInfo>): Promise<void> {
		const checkSeries = this.changes.updateSeries.concat(this.changes.newSeries);
		this.changes.removedSeries = [];
		this.changes.updateSeries = [];
		for (const item of checkSeries) {
			await this.refreshSeries(item, changes, removedTrackIDs, updateTracks, newTracks);
		}
	}

	// album

	private async refreshAlbumTracks(album: Album, changes: Changes, removedTrackIDs: Array<string>, updateTracks: Array<MetaMergeTrackInfo>, newTracks: Array<MetaMergeTrackInfo>): Promise<Array<MetaMergeTrackInfo>> {
		let trackIDs = await this.store.trackStore.searchIDs({albumID: album.id});
		// filter out removed tracks
		trackIDs = trackIDs.filter(t => !removedTrackIDs.includes(t));
		// filter out updated tracks which are no longer part of the album
		const removedFromAlbum = updateTracks.filter(t => (t.oldTrack.albumID === album.id && t.track.albumID !== album.id)).map(t => t.track.id);
		trackIDs = trackIDs.filter(t => !removedFromAlbum.includes(t));
		// get all new and updated tracks which are part of the album
		const refreshedTracks: Array<MetaMergeTrackInfo> = (updateTracks.filter(t => t.track && t.track.albumID === album.id) as Array<MetaMergeTrackInfo>)
			.concat(newTracks.filter(t => t.track.albumID === album.id));
		const refreshIDs = refreshedTracks.map(t => t.track.id);
		trackIDs = trackIDs.filter(t => !refreshIDs.includes(t));
		// unchanged tracks
		const tracks = await this.store.trackStore.byIds(trackIDs);
		for (const track of tracks) {
			const folder = await this.cache.getFolderByID(track.parentID);
			if (folder) {
				refreshedTracks.push({track, parent: folder});
			}
		}
		return refreshedTracks;
	}

	private async refreshAlbum(album: Album, changes: Changes, removedTrackIDs: Array<string>, updateTracks: Array<MetaMergeTrackInfo>, newTracks: Array<MetaMergeTrackInfo>): Promise<void> {
		log.debug('Refreshing Album:', album.name);
		const trackInfos = await this.refreshAlbumTracks(album, changes, removedTrackIDs, updateTracks, newTracks);
		if (trackInfos.length === 0) {
			if (!this.changes.removedAlbums.includes(album)) {
				this.changes.removedAlbums.push(album);
			} else {
				console.error('new album without tracks', album);
			}
			return;
		}
		let duration = 0;
		const rootIDs = new Set<string>();
		const folderIDs = new Set<string>();
		const trackIDs = new Set<string>();
		const metaStatBuilder = new MetaStatBuilder();
		for (const trackInfo of trackInfos) {
			const track = trackInfo.track;
			rootIDs.add(track.rootID);
			folderIDs.add(track.parentID);
			trackIDs.add(track.id);
			metaStatBuilder.statSlugValue('artist', track.tag.albumArtist || track.tag.artist);
			metaStatBuilder.statID('mbArtistID', track.tag.mbAlbumArtistID || track.tag.mbArtistID);
			metaStatBuilder.statID('mbReleaseID', track.tag.mbReleaseID);
			metaStatBuilder.statSlugValue('genre', track.tag.genre);
			metaStatBuilder.statSlugValue('seriesNr', track.tag.seriesNr);
			metaStatBuilder.statSlugValue('series', track.tag.series);
			metaStatBuilder.statNumber('year', track.tag.year);
			duration += (track.media.duration || 0);
			metaStatBuilder.statSlugValue('name', getAlbumName(trackInfo));
			metaStatBuilder.statID('albumType', trackInfo.parent && trackInfo.parent.tag && trackInfo.parent.tag.albumType !== undefined ? trackInfo.parent.tag.albumType : undefined);
		}
		album.rootIDs = [...rootIDs];
		album.trackIDs = [...trackIDs];
		album.folderIDs = [...folderIDs];
		album.artist = metaStatBuilder.mostUsed('artist') || cUnknownArtist;
		album.name = metaStatBuilder.mostUsed('name') || cUnknownAlbum;
		album.seriesNr = metaStatBuilder.mostUsed('seriesNr');
		album.mbArtistID = metaStatBuilder.mostUsed('mbArtistID');
		album.mbReleaseID = metaStatBuilder.mostUsed('mbReleaseID');
		album.genres = metaStatBuilder.asStringList('genre');
		album.series = metaStatBuilder.mostUsed('series');
		album.year = metaStatBuilder.mostUsedNumber('year');
		album.albumType = metaStatBuilder.mostUsed('albumType') as AlbumType || AlbumType.unknown;
		album.duration = duration;
		if (!this.changes.newAlbums.includes(album)) {
			this.changes.updateAlbums.push(album);
		}
	}

	private async refreshAlbums(changes: Changes, removedTrackIDs: Array<string>, updateTracks: Array<MetaMergeTrackInfo>, newTracks: Array<MetaMergeTrackInfo>): Promise<void> {
		const checkAlbums = this.changes.updateAlbums.concat(this.changes.newAlbums);
		this.changes.removedAlbums = [];
		this.changes.updateAlbums = [];
		for (const album of checkAlbums) {
			await this.refreshAlbum(album, changes, removedTrackIDs, updateTracks, newTracks);
		}
	}

	 */

	private collectAlbumGenres(album: Album): Array<string> {
		const genres = new Set<string>();
		const folders = album.folders.getItems();
		for (const folder of folders) {
			folder.genres.forEach(genre => genres.add(genre));
		}
		return [...genres];
	}


	private collectArtistGenres(artist: Artist): Array<string> {
		const genres = new Set<string>();
		const albums = artist.albums.getItems();
		for (const album of albums) {
			album.genres.forEach(genre => genres.add(genre));
		}
		return [...genres];
	}

	private collectArtistAlbumTypes(artist: Artist): Array<AlbumType> {
		const types = new Set<AlbumType>();
		const albums = artist.albums.getItems();
		for (const album of albums) {
			types.add(album.albumType);
		}
		return [...types];
	}


	private async addMeta(trackInfo: MetaMergeTrackInfo): Promise<void> {

		const linkArtist = async (a: Artist) => {
			a.roots.add(this.root);
			a.folders.add(trackInfo.folder);
			this.orm.orm.em.persistLater(a);
		};

		const artist = await this.cache.findOrCreateArtist(trackInfo, false);
		await this.orm.Artist.populate(artist, ['roots', 'folders', 'tracks']);
		await linkArtist(artist);
		artist.tracks.add(trackInfo.track);

		const albumArtist: Artist = (trackInfo.folder.artist === MUSICBRAINZ_VARIOUS_ARTISTS_NAME) ?
			await this.cache.findOrCreateCompilationArtist() :
			await this.cache.findOrCreateArtist(trackInfo, true);
		await this.orm.Artist.populate(albumArtist, ['roots', 'folders', 'albumTracks']);
		await linkArtist(albumArtist);
		albumArtist.albumTracks.add(trackInfo.track);

		const album = await this.cache.findOrCreateAlbum(trackInfo, albumArtist);
		await this.orm.Album.populate(album, ['roots', 'folders', 'tracks']);
		album.roots.add(this.root);
		album.folders.add(trackInfo.folder);
		album.tracks.add(trackInfo.track);
		this.orm.orm.em.persistLater(album);

		if (trackInfo.tag.series) {
			const series = await this.cache.findOrCreateSeries(trackInfo, albumArtist, album);
			if (series) {
				await this.orm.Series.populate(series, ['roots', 'folders', 'tracks', 'albums']);
				series.roots.add(this.root);
				series.folders.add(trackInfo.folder);
				series.tracks.add(trackInfo.track);
				series.albums.add(album);
				this.orm.orm.em.persistLater(series);
			}
		}
		this.orm.orm.em.persistLater(trackInfo.track);
	}

	async mergeMeta(): Promise<void> {
		for (const track of this.changes.tracks.added.list.concat(this.changes.tracks.updated.list)) {
			await this.orm.Track.populate(track, ['folder', 'tag']);
			const tag = track.tag;
			const folder = track.folder;
			if (tag && folder) {
				const trackInfo: MetaMergeTrackInfo = {track, tag, folder};
				await this.addMeta(trackInfo);
			}
		}
		if (this.changes.tracks.updated.size > 0) {
			// Load all artists/albums/series for track, in case track artist changed
			const trackIDs = this.changes.tracks.updated.ids();
			const artists = await this.orm.Artist.findFilter({trackIDs})
			this.changes.artists.updated.append(artists);
			const albumArtists = await this.orm.Artist.findFilter({albumTrackIDs: trackIDs})
			this.changes.artists.updated.append(albumArtists);
			const albums = await this.orm.Album.findFilter({trackIDs})
			this.changes.albums.updated.append(albums);
			const series = await this.orm.Series.findFilter({trackIDs})
			this.changes.series.updated.append(series);
		}
		for (const track of this.changes.tracks.removed.list) {
			this.changes.albums.updated.add(track.album);
			this.changes.artists.updated.add(track.artist);
			this.changes.series.updated.add(track.series);
			this.changes.artists.updated.add(track.albumArtist);
		}
		for (const album of this.changes.albums.added.list) {
			log.debug('Updating new album meta', album.name);
			album.genres = this.collectAlbumGenres(album);
		}
		for (const album of this.changes.albums.updated.list) {
			log.debug('Updating album meta', album.name);
			// await this.orm.Album.populate(album, ['tracks', 'folders']);
			const tracks = album.tracks.getItems().filter(t => t.album?.id === album.id && !this.changes.tracks.removed.has(t));
			album.tracks.set(tracks);
			if (tracks.length === 0) {
				album.folders.set([]);
				album.roots.set([]);
				this.changes.albums.removed.add(album);
				this.changes.albums.updated.delete(album);
			} else {
				const folders: Array<Folder> = [];
				for (const folder of album.folders.getItems()) {
					await this.orm.Folder.populate(folder, ['albums']);
					if (folder.albums.getItems().find(a => a.id === album.id) && !this.changes.folders.removed.has(folder)) {
						folders.push(folder);
					}
				}
				album.folders.set(folders);
				album.genres = this.collectAlbumGenres(album);
			}
		}
		for (const artist of this.changes.artists.added.list) {
			log.debug('Updating new artist meta', artist.name);
			artist.genres = this.collectArtistGenres(artist);
			artist.albumTypes = this.collectArtistAlbumTypes(artist);
		}
		for (const artist of this.changes.artists.updated.list) {
			log.debug('Updating artist', artist.name);
			await this.orm.Artist.populate(artist, ['roots', 'folders', 'tracks', 'albumTracks', 'albums']);
			const tracks = artist.tracks.getItems().filter(t => t.artist?.id === artist.id && !this.changes.tracks.removed.has(t));
			artist.tracks.set(tracks);
			const albumTracks = artist.albumTracks.getItems().filter(t => t.albumArtist?.id === artist.id && !this.changes.tracks.removed.has(t));
			artist.albumTracks.set(albumTracks);
			if (tracks.length === 0 && artist.albumTracks.length === 0) {
				artist.folders.set([]);
				artist.albums.set([]);
				this.changes.artists.removed.add(artist);
				this.changes.artists.updated.delete(artist);
			} else {
				const albums = artist.albums.getItems().filter(t => t.artist?.id === artist.id && !this.changes.albums.removed.has(t));
				artist.albums.set(albums);
				const folders: Array<Folder> = [];
				for (const folder of artist.folders.getItems()) {
					await this.orm.Folder.populate(folder, ['albums']);
					if (folder.albums.getItems().find(a => a.id === artist.id) && !this.changes.folders.removed.has(folder)) {
						folders.push(folder);
					}
				}
				artist.folders.set(folders);
				artist.genres = this.collectArtistGenres(artist);
				artist.albumTypes = this.collectArtistAlbumTypes(artist);
			}
		}
		for (const series of this.changes.series.added.list.concat(this.changes.series.updated.list)) {
			await this.orm.Series.populate(series, ['tracks', 'albums']);
			log.debug('Updating series', series.name);
			const albumTypes = new Set<AlbumType>();
			const albums = series.albums.getItems().filter(t => {
				return !this.changes.albums.removed.has(t);
			});
			for (const album of albums) {
				albumTypes.add(album.albumType);
			}
			series.albumTypes = [...albumTypes];
			const tracks = series.tracks.getItems().filter(t => {
				return !this.changes.tracks.removed.has(t);
			});
			series.tracks.set(tracks);
			if (tracks.length === 0) {
				this.changes.series.removed.add(series);
				this.changes.series.updated.delete(series);
			}
		}
	}
}
