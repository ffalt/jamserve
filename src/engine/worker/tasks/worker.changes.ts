import {DBObjectType} from '../../../db/db.types';
import {Jam} from '../../../model/jam-rest-data';
import {RootScanStrategy} from '../../../model/jam-types';
import {AudioModule} from '../../../modules/audio/audio.module';
import {ImageModule} from '../../../modules/image/image.module';
import {updatePlayListTracks} from '../../playlist/playlist.service';
import {Root} from '../../root/root.model';
import {Store} from '../../store/store';
import {Changes} from '../changes/changes';
import {MatchDir} from '../match-dir/match-dir.types';
import {MatchDirMerge} from '../merge/merge.match-dir';
import {MetaMerger} from '../merge/merge.meta';

export class ChangesWorker {

	constructor(
		private store: Store, private audioModule: AudioModule, private imageModule: ImageModule,
		public settings: Jam.AdminSettingsLibrary
	) {

	}

	private emptyChanges(): Changes {
		const changes: Changes = {
			newArtists: [],
			updateArtists: [],
			removedArtists: [],

			newAlbums: [],
			updateAlbums: [],
			removedAlbums: [],

			newTracks: [],
			updateTracks: [],
			removedTracks: [],

			newFolders: [],
			updateFolders: [],
			removedFolders: [],
			start: Date.now(),
			end: 0
		};
		return changes;
	}

	async cleanChanges(changes: Changes): Promise<void> {
		let imageCleanIds = new Set<string>();
		let trackCleanIds = new Set<string>();
		if (changes.removedAlbums.length > 0) {
			const albumIDs = changes.removedAlbums.map(a => a.id);
			await this.store.albumStore.remove(albumIDs);
			await this.store.stateStore.removeByQuery({destIDs: albumIDs, type: DBObjectType.album});
			imageCleanIds = new Set<string>([...imageCleanIds, ...albumIDs]);
		}
		if (changes.removedArtists.length > 0) {
			const artistIDs = changes.removedArtists.map(a => a.id);
			await this.store.artistStore.remove(artistIDs);
			await this.store.stateStore.removeByQuery({destIDs: artistIDs, type: DBObjectType.artist});
			imageCleanIds = new Set<string>([...imageCleanIds, ...artistIDs]);
		}
		if (changes.removedFolders.length > 0) {
			const folderIDs = changes.removedFolders.map(folder => folder.id);
			await this.store.folderStore.remove(folderIDs);
			await this.store.stateStore.removeByQuery({destIDs: folderIDs, type: DBObjectType.folder});
			imageCleanIds = new Set<string>([...imageCleanIds, ...folderIDs]);
		}
		if (changes.removedTracks.length > 0) {
			const trackIDs = changes.removedTracks.map(track => track.id);
			imageCleanIds = new Set<string>([...imageCleanIds, ...trackIDs]);
			trackCleanIds = new Set<string>([...trackCleanIds, ...trackIDs]);
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
		if (changes.updateTracks.length > 0) {
			for (const t of changes.updateTracks) {
				imageCleanIds.add(t.track.albumID);
				imageCleanIds.add(t.oldTrack.albumID);
			}
		}
		let ids = [...imageCleanIds];
		if (ids.length > 0) {
			await this.imageModule.clearImageCacheByIDs(ids);
		}
		ids = [...trackCleanIds];
		if (ids.length > 0) {
			await this.audioModule.clearCacheByIDs(ids);
		}
	}

	async storeChanges(changes: Changes): Promise<void> {
		await this.store.trackStore.bulk(changes.newTracks);
		await this.store.trackStore.upsert(changes.updateTracks.map(t => t.track));
		await this.store.folderStore.bulk(changes.newFolders);
		await this.store.folderStore.upsert(changes.updateFolders);

		await this.store.albumStore.bulk(changes.newAlbums);
		await this.store.albumStore.upsert(changes.updateAlbums);
		await this.store.artistStore.bulk(changes.newArtists);
		await this.store.artistStore.upsert(changes.updateArtists);
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
		return {root, changes: this.emptyChanges()};
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
