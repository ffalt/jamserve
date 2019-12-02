import {AlbumType, cUnknownAlbum, cUnknownArtist, MUSICBRAINZ_VARIOUS_ARTISTS_NAME} from '../../../model/jam-types';
import {logger} from '../../../utils/logger';
import {slugify} from '../../../utils/slug';
import {Album} from '../../album/album.model';
import {Artist} from '../../artist/artist.model';
import {Store} from '../../store/store';
import {Track} from '../../track/track.model';
import {Changes} from '../changes/changes';
import {MetaStatBuilder} from '../match-dir/match-dir.meta-stats.builder';
import {getAlbumName, MetaMergerCache, MetaMergeTrackInfo, UpdateMetaMergeTrackInfo} from './merge.meta.cache';

const log = logger('IO.MetaMerger');

export class MetaMerger {
	cache: MetaMergerCache;

	constructor(private store: Store) {
		this.cache = new MetaMergerCache(store);
	}

	private async addMeta(trackInfo: MetaMergeTrackInfo, changes: Changes): Promise<void> {
		if (!trackInfo.parent) {
			return;
		}
		const artist = await this.cache.findOrCreateArtist(trackInfo, false, changes);
		trackInfo.track.artistID = artist.id;
		let albumArtist: Artist;
		albumArtist = (trackInfo.parent.tag.artist === MUSICBRAINZ_VARIOUS_ARTISTS_NAME) ?
			await this.cache.findOrCreateCompilationArtist(changes) :
			await this.cache.findOrCreateArtist(trackInfo, true, changes);
		trackInfo.track.albumArtistID = albumArtist.id;
		const album = await this.cache.findOrCreateAlbum(trackInfo, albumArtist.id, changes);
		trackInfo.track.albumID = album.id;
	}

	private async removeMeta(track: Track, changes: Changes): Promise<void> {
		let artist = await this.cache.getArtistByID(track.artistID, changes);
		if (artist && !changes.updateArtists.includes(artist)) {
			changes.updateArtists.push(artist);
		}
		if (track.artistID !== track.albumArtistID) {
			artist = await this.cache.getArtistByID(track.albumArtistID, changes);
			if (artist && !changes.updateArtists.includes(artist)) {
				changes.updateArtists.push(artist);
			}
		}
		const album = await this.cache.getAlbumByID(track.albumID, changes);
		if (album && !changes.updateAlbums.includes(album)) {
			changes.updateAlbums.push(album);
		}
	}

	private async refreshArtistTracks(artist: Artist, removedTrackIDs: Array<string>, updateTracks: Array<UpdateMetaMergeTrackInfo>, newTracks: Array<MetaMergeTrackInfo>): Promise<Array<Track>> {
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

	private async refreshArtistAlbums(artist: Artist, changes: Changes): Promise<Array<Album>> {
		// get all album ids in the db
		let albumIDs = await this.store.albumStore.searchIDs({artistID: artist.id});
		// filter out removed album
		albumIDs = albumIDs.filter(id => !changes.removedAlbums.find(a => a.id === id));
		// filter out updated albums which are no longer part of the artist
		const refreshedAlbums = changes.updateAlbums.filter(a => a.artistID === artist.id)
			.concat(changes.newAlbums.filter(a => a.artistID === artist.id));
		albumIDs = albumIDs.filter(id => !refreshedAlbums.find(t => t.id === id));

		const albums = await this.store.albumStore.byIds(albumIDs);
		return refreshedAlbums.concat(albums);
	}

	private async refreshArtist(artist: Artist, changes: Changes, removedTrackIDs: Array<string>, updateTracks: Array<UpdateMetaMergeTrackInfo>, newTracks: Array<MetaMergeTrackInfo>): Promise<void> {
		log.debug('Refreshing Artist:', artist.name);
		const tracks = await this.refreshArtistTracks(artist, removedTrackIDs, updateTracks, newTracks);
		if (tracks.length === 0) {
			if (changes.newArtists.includes(artist)) {
				console.error('new artist without tracks', artist);
			} else {
				changes.removedArtists.push(artist);
			}
			return;
		}
		const metaStatBuilder = new MetaStatBuilder();
		const rootIDs = new Set<string>();
		const folderIDs = new Set<string>();
		const trackIDs = new Set<string>();
		for (const track of tracks) {
			if (track.artistID === artist.id) {
				metaStatBuilder.statSlugValue('artist', track.tag.artist);
				metaStatBuilder.statSlugValue('artistSort', track.tag.artistSort);
			}
			if (track.albumArtistID === artist.id) {
				metaStatBuilder.statSlugValue('artist', track.tag.albumArtist);
				metaStatBuilder.statSlugValue('artistSort', track.tag.albumArtistSort);
			}
			rootIDs.add(track.rootID);
			folderIDs.add(track.parentID);
			trackIDs.add(track.id);
		}
		artist.rootIDs = [...rootIDs];
		artist.trackIDs = [...trackIDs];
		artist.folderIDs = [...folderIDs];
		if (artist.name !== MUSICBRAINZ_VARIOUS_ARTISTS_NAME) {
			const artistName = metaStatBuilder.mostUsed('artist') || cUnknownArtist;
			artist.name = artistName;
			artist.slug = slugify(artistName);
			artist.nameSort = metaStatBuilder.mostUsed('artistSort');
		}
		const albums = await this.refreshArtistAlbums(artist, changes);
		const albumIDs = new Set<string>();
		const albumTypes = new Set<AlbumType>();
		for (const album of albums) {
			albumIDs.add(album.id);
			albumTypes.add(album.albumType);
		}
		artist.albumIDs = [...albumIDs];
		artist.albumTypes = [...albumTypes];
		if (!changes.newArtists.includes(artist)) {
			changes.updateArtists.push(artist);
		}
	}

	private async refreshArtists(changes: Changes, removedTrackIDs: Array<string>, updateTracks: Array<UpdateMetaMergeTrackInfo>, newTracks: Array<MetaMergeTrackInfo>): Promise<void> {
		const checkArtists = changes.updateArtists.concat(changes.newArtists);
		changes.removedArtists = [];
		changes.updateArtists = [];
		for (const artist of checkArtists) {
			await this.refreshArtist(artist, changes, removedTrackIDs, updateTracks, newTracks);
		}
	}

	private async refreshAlbumTracks(album: Album, changes: Changes, removedTrackIDs: Array<string>, updateTracks: Array<UpdateMetaMergeTrackInfo>, newTracks: Array<MetaMergeTrackInfo>): Promise<Array<MetaMergeTrackInfo>> {
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
			const folder = await this.cache.getFolderByID(track.parentID, changes);
			if (folder) {
				refreshedTracks.push({track, parent: folder});
			}
		}
		return refreshedTracks;
	}

	private async refreshAlbum(album: Album, changes: Changes, removedTrackIDs: Array<string>, updateTracks: Array<UpdateMetaMergeTrackInfo>, newTracks: Array<MetaMergeTrackInfo>): Promise<void> {
		log.debug('Refreshing Album:', album.name);
		const trackInfos = await this.refreshAlbumTracks(album, changes, removedTrackIDs, updateTracks, newTracks);
		if (trackInfos.length === 0) {
			if (!changes.removedAlbums.includes(album)) {
				changes.removedAlbums.push(album);
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
			metaStatBuilder.statID('mbAlbumID', track.tag.mbAlbumID);
			metaStatBuilder.statSlugValue('genre', track.tag.genre);
			metaStatBuilder.statSlugValue('grouping', track.tag.grouping);
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
		album.grouping = metaStatBuilder.mostUsed('grouping');
		album.mbArtistID = metaStatBuilder.mostUsed('mbArtistID');
		album.mbAlbumID = metaStatBuilder.mostUsed('mbAlbumID');
		album.genre = metaStatBuilder.mostUsed('genre');
		album.year = metaStatBuilder.mostUsedNumber('year');
		album.albumType = metaStatBuilder.mostUsed('albumType') as AlbumType || AlbumType.unknown;
		album.duration = duration;
		if (!changes.newAlbums.includes(album)) {
			changes.updateAlbums.push(album);
		}
	}

	private async refreshAlbums(changes: Changes, removedTrackIDs: Array<string>, updateTracks: Array<UpdateMetaMergeTrackInfo>, newTracks: Array<MetaMergeTrackInfo>): Promise<void> {
		const checkAlbums = changes.updateAlbums.concat(changes.newAlbums);
		changes.removedAlbums = [];
		changes.updateAlbums = [];
		for (const album of checkAlbums) {
			await this.refreshAlbum(album, changes, removedTrackIDs, updateTracks, newTracks);
		}
	}

	private async collectNewTrackInfos(changes: Changes): Promise<Array<MetaMergeTrackInfo>> {
		const newTracks: Array<MetaMergeTrackInfo> = [];
		for (const track of changes.newTracks) {
			const parent = await this.cache.getFolderByID(track.parentID, changes);
			if (parent) {
				newTracks.push({track, parent});
			}
		}
		return newTracks;
	}

	private async collectUpdateTrackInfos(changes: Changes): Promise<Array<UpdateMetaMergeTrackInfo>> {
		const updateTracks: Array<UpdateMetaMergeTrackInfo> = [];
		for (const trackInfo of changes.updateTracks) {
			const parent = await this.cache.getFolderByID(trackInfo.track.parentID, changes);
			if (parent) {
				updateTracks.push({track: trackInfo.track, oldTrack: trackInfo.oldTrack, parent});
			}
		}
		return updateTracks;
	}

	private async collectAll(rootID: string, changes: Changes): Promise<void> {
		const allArtistIDs = await this.store.artistStore.searchIDs({rootID});
		for (const id of allArtistIDs) {
			await this.cache.getArtistByID(id, changes);
		}
		const allAlbumIDs = await this.store.albumStore.searchIDs({rootID});
		for (const id of allAlbumIDs) {
			await this.cache.getAlbumByID(id, changes);
		}
	}

	async mergeMeta(forceMetaRefresh: boolean, rootID: string, changes: Changes): Promise<void> {
		const newTracks: Array<MetaMergeTrackInfo> = await this.collectNewTrackInfos(changes);
		const updateTracks: Array<UpdateMetaMergeTrackInfo> = await this.collectUpdateTrackInfos(changes);
		// merge new
		for (const trackInfo of newTracks) {
			await this.addMeta(trackInfo, changes);
		}
		// remove missing
		for (const track of changes.removedTracks) {
			await this.removeMeta(track, changes);
		}
		// update updated
		for (const trackInfo of updateTracks) {
			await this.removeMeta(trackInfo.oldTrack, changes);
			await this.addMeta(trackInfo, changes);
		}
		if (forceMetaRefresh) {
			// collect all artists & albums to refresh
			await this.collectAll(rootID, changes);
		}
		const removedTrackIDs = changes.removedTracks.map(t => t.id);
		await this.refreshAlbums(changes, removedTrackIDs, updateTracks, newTracks);
		await this.refreshArtists(changes, removedTrackIDs, updateTracks, newTracks);
	}
}
