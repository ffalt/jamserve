import {DBObjectType} from '../../../db/db.types';
import {Jam} from '../../../model/jam-rest-data';
import {RootScanStrategy} from '../../../model/jam-types';
import {AudioModule} from '../../../modules/audio/audio.module';
import {ImageModule} from '../../../modules/image/image.module';
import {updatePlayListTracks} from '../../playlist/playlist.service';
import {Root} from '../../root/root.model';
import {Store} from '../../store/store';
import {Changes, emptyChanges} from '../changes/changes';
import {MatchDir} from '../match-dir/match-dir.types';
import {MatchDirMerge} from '../merge/merge.match-dir';
import {MetaMerger} from '../merge/merge.meta';
import {logger} from '../../../utils/logger';

const log = logger('IO.ChangesWorker');

export class ChangesWorker {

	constructor(
		private store: Store, private audioModule: AudioModule, private imageModule: ImageModule,
		public settings: Jam.AdminSettingsLibrary
	) {

	}

	async cleanChanges(changes: Changes): Promise<void> {
		let imageCleanIds = new Set<string>();
		let trackCleanIds = new Set<string>();
		if (changes.removedAlbums.length > 0) {
			log.debug('Removing Albums:', changes.removedAlbums.length);
			const albumIDs = changes.removedAlbums.map(a => a.id);
			await this.store.albumStore.remove(albumIDs);
			await this.store.stateStore.removeByQuery({destIDs: albumIDs, type: DBObjectType.album});
			imageCleanIds = new Set<string>([...imageCleanIds, ...albumIDs]);
		}
		if (changes.removedArtists.length > 0) {
			log.debug('Removing Artists:', changes.removedArtists.length);
			const artistIDs = changes.removedArtists.map(a => a.id);
			await this.store.artistStore.remove(artistIDs);
			await this.store.stateStore.removeByQuery({destIDs: artistIDs, type: DBObjectType.artist});
			imageCleanIds = new Set<string>([...imageCleanIds, ...artistIDs]);
		}
		if (changes.removedFolders.length > 0) {
			log.debug('Removing Folders:', changes.removedFolders.length);
			const folderIDs = changes.removedFolders.map(folder => folder.id);
			await this.store.folderStore.remove(folderIDs);
			await this.store.stateStore.removeByQuery({destIDs: folderIDs, type: DBObjectType.folder});
			imageCleanIds = new Set<string>([...imageCleanIds, ...folderIDs]);
		}
		if (changes.removedSeries.length > 0) {
			log.debug('Removing Series:', changes.removedSeries.length);
			const seriesIDs = changes.removedSeries.map(series => series.id);
			await this.store.seriesStore.remove(seriesIDs);
			await this.store.stateStore.removeByQuery({destIDs: seriesIDs, type: DBObjectType.series});
			imageCleanIds = new Set<string>([...imageCleanIds, ...seriesIDs]);
		}
		if (changes.removedTracks.length > 0) {
			log.debug('Removing Tracks:', changes.removedTracks.length);
			const trackIDs = changes.removedTracks.map(track => track.id);
			imageCleanIds = new Set<string>([...imageCleanIds, ...trackIDs]);
			trackCleanIds = new Set<string>([...trackCleanIds, ...trackIDs]);
			await this.store.trackStore.remove(trackIDs);
			await this.store.stateStore.removeByQuery({destIDs: trackIDs, type: DBObjectType.track});
			await this.store.bookmarkStore.removeByQuery({destIDs: trackIDs});
			const playlists = await this.store.playlistStore.search({trackIDs});
			if (playlists.items.length > 0) {
				for (const playlist of playlists.items) {
					const count = playlist.trackIDs.length;
					playlist.trackIDs = playlist.trackIDs.filter(id => !trackIDs.includes(id));
					if (count !== playlist.trackIDs.length) {
						log.debug('Updating Playlist:', playlist.name);
						await updatePlayListTracks(this.store.trackStore, playlist);
						await this.store.playlistStore.replace(playlist);
					}
				}

			}
		}
		if (changes.updateAlbums.length > 0) {
			const albumIDs = changes.updateAlbums.map(a => a.id);
			imageCleanIds = new Set<string>([...imageCleanIds, ...albumIDs]);
		}
		if (changes.updateArtists.length > 0) {
			const artistIDs = changes.updateArtists.map(a => a.id);
			imageCleanIds = new Set<string>([...imageCleanIds, ...artistIDs]);
		}
		if (changes.updateFolders.length > 0) {
			const folderIDs = changes.updateFolders.map(f => f.id);
			imageCleanIds = new Set<string>([...imageCleanIds, ...folderIDs]);
		}
		if (changes.updateSeries.length > 0) {
			const seriesIDs = changes.updateSeries.map(s => s.id);
			imageCleanIds = new Set<string>([...imageCleanIds, ...seriesIDs]);
		}
		if (changes.updateTracks.length > 0) {
			for (const t of changes.updateTracks) {
				imageCleanIds.add(t.track.albumID);
				imageCleanIds.add(t.oldTrack.albumID);
			}
		}
		let ids = [...imageCleanIds];
		if (ids.length > 0) {
			log.debug('Cleaning Image Cache IDs:', ids.length);
			await this.imageModule.clearImageCacheByIDs(ids);
		}
		ids = [...trackCleanIds];
		if (ids.length > 0) {
			log.debug('Cleaning Audio Cache IDs:', ids.length);
			await this.audioModule.clearCacheByIDs(ids);
		}
	}

	async storeChanges(changes: Changes): Promise<void> {
		log.debug('Storing New Tracks:', changes.newTracks.length);
		await this.store.trackStore.bulk(changes.newTracks);
		log.debug('Updating Tracks:', changes.updateTracks.length);
		await this.store.trackStore.upsert(changes.updateTracks.map(t => t.track));
		log.debug('Storing New Folders:', changes.newTracks.length);
		await this.store.folderStore.bulk(changes.newFolders);
		log.debug('Updating Folders:', changes.updateFolders.length);
		await this.store.folderStore.upsert(changes.updateFolders);
		log.debug('Storing New Albums:', changes.newTracks.length);
		await this.store.albumStore.bulk(changes.newAlbums);
		log.debug('Updating Albums:', changes.updateAlbums.length);
		await this.store.albumStore.upsert(changes.updateAlbums);
		log.debug('Storing New Artists:', changes.newTracks.length);
		await this.store.artistStore.bulk(changes.newArtists);
		log.debug('Updating Artists:', changes.updateArtists.length);
		await this.store.artistStore.upsert(changes.updateArtists);
		log.debug('Storing New Series:', changes.newTracks.length);
		await this.store.seriesStore.bulk(changes.newSeries);
		log.debug('Updating Series:', changes.updateSeries.length);
		await this.store.seriesStore.upsert(changes.updateSeries);
	}

	async mergeMatch(root: Root, rootMatch: MatchDir, rebuildDirTag: (dir: MatchDir) => boolean, forceTrackMetaRefresh: boolean, changes: Changes): Promise<void> {
		const merger = new MatchDirMerge(this.audioModule, this.imageModule, this.store, this.settings, root.strategy || RootScanStrategy.auto);
		await merger.merge(rootMatch, root.id, rebuildDirTag, forceTrackMetaRefresh, changes);
	}

	async start(rootID: string): Promise<{ changes: Changes, root: Root }> {
		const root = await this.store.rootStore.byId(rootID);
		if (!root) {
			return Promise.reject(Error(`Root ${rootID} not found`));
		}
		return {root, changes: emptyChanges()};
	}

	async finish(changes: Changes, rootID: string, forceMetaRefresh: boolean): Promise<Changes> {
		const metaMerger = new MetaMerger(this.store);
		await metaMerger.mergeMeta(forceMetaRefresh, rootID, changes);

		await this.storeChanges(changes);
		await this.cleanChanges(changes);

		changes.end = Date.now();

		return changes;
	}

}
