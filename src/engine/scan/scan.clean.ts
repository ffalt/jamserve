import {DBObjectType} from '../../db/db.types';
import {ImageModule} from '../../modules/image/image.module';
import Logger from '../../utils/logger';
import {updatePlayListTracks} from '../playlist/playlist.service';
import {Store} from '../store/store';
import {WaveformService} from '../waveform/waveform.service';
import {MergeChanges} from './scan.changes';

const log = Logger('IO.Clean');

export class ScanCleaner {

	constructor(private store: Store, private imageModule: ImageModule, private waveformService: WaveformService) {

	}

	/*

	clearID3(store: Store, imageModule: ImageModule, removeTracks: Array<Track>): Promise<void> {
		if (removeTracks.length === 0) {
			return;
		}
		log.debug('Cleaning ID3');
		const trackIDs = removeTracks.map(track => track.id);
		const albums = await store.albumStore.search({trackIDs});
		albums.forEach(album => {
			let duration = 0;
			album.trackIDs = album.trackIDs.filter(id => {
				const track = removeTracks.find(t => t.id === id);
				if (track) {
					duration += (track.media.duration || 0);
					return false;
				}
				return true;
			});
			album.duration -= duration;
		});
		const removeAlbums = albums.filter(album => album.trackIDs.length === 0).map(album => album.id);
		const updateAlbums = albums.filter(album => album.trackIDs.length !== 0);
		if (removeAlbums.length > 0) {
			await store.albumStore.remove(removeAlbums);
			await store.stateStore.removeByQuery({destIDs: removeAlbums, type: DBObjectType.album});
		}
		if (updateAlbums.length > 0) {
			await store.albumStore.replaceMany(updateAlbums);
		}
		const artists = await store.artistStore.search({trackIDs});
		artists.forEach(artist => {
			artist.trackIDs = artist.trackIDs.filter(id => !trackIDs.includes(id));
			artist.albumIDs = artist.albumIDs.filter(id => !removeAlbums.includes(id));
		});
		const removeArtists = artists.filter(artist => artist.trackIDs.length === 0).map(artist => artist.id);
		const updateArtists = artists.filter(artist => artist.trackIDs.length !== 0);
		if (removeArtists.length > 0) {
			await store.artistStore.remove(removeArtists);
			await store.stateStore.removeByQuery({destIDs: removeArtists, type: DBObjectType.artist});
		}
		if (updateArtists.length > 0) {
			await store.artistStore.replaceMany(updateArtists);
		}
		const ids = removeAlbums.concat(removeArtists);
		await imageModule.clearImageCacheByIDs(ids);
	}

	*/

	async clean(changes: MergeChanges): Promise<void> {
// log.info('Cleaning:', dir);
		let ids: Array<string> = [];
		if (changes.removedAlbums.length > 0) {
			log.debug('Cleaning albums', changes.removedAlbums.length);
			const albumIDs = changes.removedAlbums.map(a => a.id);
			await this.store.albumStore.remove(albumIDs);
			await this.store.stateStore.removeByQuery({destIDs: albumIDs, type: DBObjectType.album});
		}
		if (changes.removedArtists.length > 0) {
			log.debug('Cleaning artists', changes.removedArtists.length);
			const artistIDs = changes.removedArtists.map(a => a.id);
			await this.store.artistStore.remove(artistIDs);
			await this.store.stateStore.removeByQuery({destIDs: artistIDs, type: DBObjectType.artist});
		}
		if (changes.removedFolders.length > 0) {
			log.debug('Cleaning folders', changes.removedFolders.length);
			const folderIDs = changes.removedFolders.map(folder => folder.id);
			await this.store.folderStore.remove(folderIDs);
			await this.store.stateStore.removeByQuery({destIDs: folderIDs, type: DBObjectType.folder});
			ids = folderIDs;
		}
		if (changes.removedTracks.length > 0) {
			log.debug('Cleaning tracks', changes.removedTracks.length);
			const trackIDs = changes.removedTracks.map(track => track.id);
			ids = ids.concat(trackIDs);
			await this.store.trackStore.remove(trackIDs);
			await this.store.stateStore.removeByQuery({destIDs: trackIDs, type: DBObjectType.track});
			await this.store.bookmarkStore.removeByQuery({destIDs: trackIDs});
			const playlists = await this.store.playlistStore.search({trackIDs});
			if (playlists.items.length > 0) {
				for (const playlist of playlists.items) {
					playlist.trackIDs = playlist.trackIDs.filter(id => !trackIDs.includes(id));
					if (playlist.trackIDs.length === 0) {
						await this.store.playlistStore.remove(playlist.id);
					} else {
						await updatePlayListTracks(this.store.trackStore, playlist);
						await this.store.playlistStore.replace(playlist);
					}
				}

			}
		}
		if (ids.length > 0) {
			await this.imageModule.clearImageCacheByIDs(ids);
			await this.waveformService.clearWaveformCacheByIDs(ids);
		}
		// await clearID3(this.store, this.imageModule, removeTracks);
		// await clearID3(this.store, this.imageModule, changes.removedTracks);
	}

}
