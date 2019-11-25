import {Jam} from '../../model/jam-rest-data';
import {ArtworkImageType, RootScanStrategy, TrackHealthID} from '../../model/jam-types';
import {AudioModule} from '../../modules/audio/audio.module';
import {ImageModule} from '../../modules/image/image.module';
import {Root} from '../root/root.model';
import {Store} from '../store/store';
import {WaveformService} from '../waveform/waveform.service';
import {Changes} from './changes/changes';
import {MatchDirBuilderDB} from './match-dir/match-dir.builder.db';
import {ArtworkWorker} from './tasks/worker.artwork';
import {ChangesWorker} from './tasks/worker.changes';
import {FolderWorker} from './tasks/worker.folder';
import {RootWorker} from './tasks/worker.root';
import {TrackWorker} from './tasks/worker.track';
import {StreamService} from '../stream/stream.service';

export interface WorkerRequestParameters {
	rootID: string;
}

export interface WorkerRequestMoveTracks extends WorkerRequestParameters {
	trackIDs: Array<string>;
	newParentID: string;
}

export interface WorkerRequestRenameTrack extends WorkerRequestParameters {
	trackID: string;
	newName: string;
}

export interface WorkerRequestFixTrack extends WorkerRequestParameters {
	trackID: string;
	fixID: TrackHealthID;
}

export interface WorkerRequestRenameFolder extends WorkerRequestParameters {
	folderID: string;
	newName: string;
}

export interface WorkerRequestCreateFolder extends WorkerRequestParameters {
	parentID: string;
	name: string;
}

export interface WorkerRequestUpdateRoot extends WorkerRequestParameters {
	name: string;
	path: string;
	strategy: RootScanStrategy;
}

export interface WorkerRequestCreateRoot extends WorkerRequestParameters {
	path: string;
	name: string;
	strategy: RootScanStrategy;
}

export interface WorkerRequestWriteTrackTags extends WorkerRequestParameters {
	tags: Array<{ trackID: string; tag: Jam.RawTag }>;
}

export interface WorkerRequestRefreshRoot extends WorkerRequestParameters {
	forceMetaRefresh: boolean;
}

export interface WorkerRequestRefreshFolders extends WorkerRequestParameters {
	folderIDs: Array<string>;
}

export interface WorkerRequestMoveFolders extends WorkerRequestParameters {
	newParentID: string;
	folderIDs: Array<string>;
}

export interface WorkerRequestRemoveRoot extends WorkerRequestParameters {
}

export interface WorkerRequestRefreshTracks extends WorkerRequestParameters {
	trackIDs: Array<string>;
}

export interface WorkerRequestRemoveTracks extends WorkerRequestParameters {
	trackIDs: Array<string>;
}

export interface WorkerRequestDeleteFolders extends WorkerRequestParameters {
	folderIDs: Array<string>;
}

export interface WorkerRequestDeleteArtwork extends WorkerRequestParameters {
	folderID: string;
	artworkID: string;
}

export interface WorkerRequestDownloadArtwork extends WorkerRequestParameters {
	folderID: string;
	artworkURL: string;
	types: Array<ArtworkImageType>;
}

export interface WorkerRequestUpdateArtwork extends WorkerRequestParameters {
	folderID: string;
	artworkID: string;
	artworkFilename: string;
	artworkMimeType: string;
}

export interface WorkerRequestCreateArtwork extends WorkerRequestParameters {
	folderID: string;
	artworkFilename: string;
	artworkMimeType: string;
	types: Array<ArtworkImageType>;
}

export interface WorkerRequestRenameArtwork extends WorkerRequestParameters {
	folderID: string;
	artworkID: string;
	name: string;
}

export class WorkerService {
	private settings: Jam.AdminSettingsLibrary = {
		scanAtStart: true
	};
	public artworkWorker: ArtworkWorker;
	public trackWorker: TrackWorker;
	public folderWorker: FolderWorker;
	public rootWorker: RootWorker;
	private changes: ChangesWorker;

	constructor(private store: Store, private audioModule: AudioModule, private imageModule: ImageModule) {
		this.artworkWorker = new ArtworkWorker(store, imageModule);
		this.trackWorker = new TrackWorker(store, imageModule, audioModule);
		this.folderWorker = new FolderWorker(store);
		this.rootWorker = new RootWorker(store);
		this.changes = new ChangesWorker(store, audioModule, imageModule, this.settings);
	}

	public setSettings(settings: Jam.AdminSettingsLibrary): void {
		this.settings = settings;
		this.changes.settings = settings;
	}

	private async mergeDBMatch(root: Root, folderIDs: Array<string>, trackIDs: Array<string>, changes: Changes): Promise<void> {
		if (folderIDs.length + trackIDs.length === 0) {
			return;
		}
		const dbMatcher = new MatchDirBuilderDB(this.store);
		const {rootMatch, changedDirs} = await dbMatcher.build(folderIDs, trackIDs);
		await this.changes.mergeMatch(root, rootMatch, dir => changedDirs.includes(dir), false, changes);
	}

	// root

	async refreshRoot(parameters: WorkerRequestRefreshRoot): Promise<Changes> {
		const {root, changes} = await this.changes.start(parameters.rootID);
		const {rootMatch, removedFolders, removedTracks} = await this.rootWorker.scan(root);
		changes.removedFolders = removedFolders;
		changes.removedTracks = removedTracks;
		await this.changes.mergeMatch(root, rootMatch, () => true, parameters.forceMetaRefresh, changes);
		return this.changes.finish(changes, root.id, parameters.forceMetaRefresh);
	}

	async updateRoot(parameters: WorkerRequestUpdateRoot): Promise<Changes> {
		const {root, changes} = await this.changes.start(parameters.rootID);
		const forceRefreshMeta = root.strategy !== parameters.strategy;
		await this.rootWorker.update(root, parameters.name, parameters.path, parameters.strategy);
		const {rootMatch, removedFolders, removedTracks} = await this.rootWorker.scan(root);
		changes.removedFolders = removedFolders;
		changes.removedTracks = removedTracks;
		await this.changes.mergeMatch(root, rootMatch, () => true, false, changes);
		return this.changes.finish(changes, root.id, forceRefreshMeta);
	}

	async createRoot(parameters: WorkerRequestCreateRoot): Promise<Changes> {
		const root = await this.rootWorker.create(parameters.name, parameters.path, parameters.strategy);
		const {changes} = await this.changes.start(root.id);
		return this.changes.finish(changes, root.id, false);
	}

	async removeRoot(parameters: WorkerRequestRemoveRoot): Promise<Changes> {
		const {root, changes} = await this.changes.start(parameters.rootID);
		const {removedFolders, removedTracks} = await this.rootWorker.remove(root);
		changes.removedFolders = removedFolders;
		changes.removedTracks = removedTracks;
		await this.mergeDBMatch(root, [], [], changes);
		return this.changes.finish(changes, root.id, false);
	}

	// folder

	async deleteFolders(parameters: WorkerRequestDeleteFolders): Promise<Changes> {
		const {root, changes} = await this.changes.start(parameters.rootID);
		const {removedFolders, removedTracks, changedFolderIDs, changedTrackIDs} = await this.folderWorker.delete(root, parameters.folderIDs);
		changes.removedFolders = removedFolders;
		changes.removedTracks = removedTracks;
		await this.mergeDBMatch(root, changedFolderIDs, changedTrackIDs, changes);
		return this.changes.finish(changes, root.id, false);
	}

	async refreshFolders(parameters: WorkerRequestRefreshFolders): Promise<Changes> {
		const {root, changes} = await this.changes.start(parameters.rootID);
		await this.mergeDBMatch(root, parameters.folderIDs, [], changes);
		return this.changes.finish(changes, root.id, false);
	}

	async createFolder(parameters: WorkerRequestCreateFolder): Promise<Changes> {
		const {root, changes} = await this.changes.start(parameters.rootID);
		const {folder, parent} = await this.folderWorker.create(parameters.parentID, parameters.name);
		changes.newFolders.push(folder);
		changes.updateFolders.push(parent);
		return this.changes.finish(changes, root.id, false);
	}

	async moveFolders(parameters: WorkerRequestMoveFolders): Promise<Changes> {
		const {root, changes} = await this.changes.start(parameters.rootID);
		const {changedFolderIDs, changedTrackIDs} = await this.folderWorker.move(parameters.newParentID, parameters.folderIDs);
		await this.mergeDBMatch(root, changedFolderIDs, changedTrackIDs, changes);
		return this.changes.finish(changes, root.id, false);
	}

	async renameFolder(parameters: WorkerRequestRenameFolder): Promise<Changes> {
		const {root, changes} = await this.changes.start(parameters.rootID);
		const {changedFolderIDs, changedTrackIDs} = await this.folderWorker.rename(parameters.folderID, parameters.newName);
		await this.mergeDBMatch(root, changedFolderIDs, changedTrackIDs, changes);
		return this.changes.finish(changes, root.id, false);
	}

	// tracks

	async refreshTracks(parameters: WorkerRequestRefreshTracks): Promise<Changes> {
		const {root, changes} = await this.changes.start(parameters.rootID);
		const {changedFolderIDs, changedTrackIDs} = await this.trackWorker.refresh(parameters.trackIDs);
		await this.mergeDBMatch(root, changedFolderIDs, changedTrackIDs, changes);
		return this.changes.finish(changes, root.id, false);
	}

	async removeTracks(parameters: WorkerRequestRemoveTracks): Promise<Changes> {
		const {root, changes} = await this.changes.start(parameters.rootID);
		const {changedFolderIDs, changedTrackIDs, removedTracks} = await this.trackWorker.delete(root, parameters.trackIDs);
		changes.removedTracks = removedTracks;
		await this.mergeDBMatch(root, changedFolderIDs, changedTrackIDs, changes);
		return this.changes.finish(changes, root.id, false);
	}

	async moveTracks(parameters: WorkerRequestMoveTracks): Promise<Changes> {
		const {root, changes} = await this.changes.start(parameters.rootID);
		const {changedFolderIDs, changedTrackIDs} = await this.trackWorker.move(parameters.trackIDs, parameters.newParentID);
		await this.mergeDBMatch(root, changedFolderIDs, changedTrackIDs, changes);
		return this.changes.finish(changes, root.id, false);
	}

	async renameTrack(parameters: WorkerRequestRenameTrack): Promise<Changes> {
		const {root, changes} = await this.changes.start(parameters.rootID);
		await this.trackWorker.rename(parameters.trackID, parameters.newName);
		return this.changes.finish(changes, root.id, false);
	}

	async fixTrack(parameters: WorkerRequestFixTrack): Promise<Changes> {
		const {root, changes} = await this.changes.start(parameters.rootID);
		const {changedFolderIDs, changedTrackIDs} = await this.trackWorker.fix(parameters.trackID, parameters.fixID);
		await this.mergeDBMatch(root, changedFolderIDs, changedTrackIDs, changes);
		return this.changes.finish(changes, root.id, false);
	}

	async writeTrackTags(parameters: WorkerRequestWriteTrackTags): Promise<Changes> {
		const {root, changes} = await this.changes.start(parameters.rootID);
		const {changedFolderIDs, changedTrackIDs} = await this.trackWorker.writeTags(parameters.tags);
		await this.mergeDBMatch(root, changedFolderIDs, changedTrackIDs, changes);
		return this.changes.finish(changes, root.id, false);
	}

	// artworks

	async renameArtwork(parameters: WorkerRequestRenameArtwork): Promise<Changes> {
		const {root, changes} = await this.changes.start(parameters.rootID);
		await this.artworkWorker.rename(parameters.folderID, parameters.artworkID, parameters.name, changes);
		return this.changes.finish(changes, root.id, false);
	}

	async createArtwork(parameters: WorkerRequestCreateArtwork): Promise<Changes> {
		const {root, changes} = await this.changes.start(parameters.rootID);
		await this.artworkWorker.create(parameters.folderID, parameters.artworkFilename, parameters.artworkMimeType, parameters.types, changes);
		return this.changes.finish(changes, root.id, false);
	}

	async updateArtwork(parameters: WorkerRequestUpdateArtwork): Promise<Changes> {
		const {root, changes} = await this.changes.start(parameters.rootID);
		await this.artworkWorker.update(parameters.folderID, parameters.artworkID, parameters.artworkFilename, parameters.artworkMimeType, changes);
		return this.changes.finish(changes, root.id, false);
	}

	async downloadArtwork(parameters: WorkerRequestDownloadArtwork): Promise<Changes> {
		const {root, changes} = await this.changes.start(parameters.rootID);
		await this.artworkWorker.download(parameters.folderID, parameters.folderID, parameters.artworkURL, parameters.types, changes);
		return this.changes.finish(changes, root.id, false);
	}

	async deleteArtwork(parameters: WorkerRequestDeleteArtwork): Promise<Changes> {
		const {root, changes} = await this.changes.start(parameters.rootID);
		await this.artworkWorker.delete(parameters.folderID, parameters.artworkID, changes);
		return this.changes.finish(changes, root.id, false);
	}
}
