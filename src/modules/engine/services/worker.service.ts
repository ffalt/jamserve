import {Changes, ChangesWorker} from '../worker/changes';
import {ArtworkWorker} from '../worker/tasks/artwork';
import {FolderWorker} from '../worker/tasks/folder';
import {RootWorker} from '../worker/tasks/root';
import {TrackWorker} from '../worker/tasks/track';
import {SettingsService} from '../../../entity/settings/settings.service';
import {AudioModule} from '../../audio/audio.module';
import {ImageModule} from '../../image/image.module';
import {
	WorkerRequestCreateArtwork,
	WorkerRequestCreateFolder,
	WorkerRequestCreateRoot,
	WorkerRequestDeleteFolders,
	WorkerRequestDownloadArtwork,
	WorkerRequestFixTrack,
	WorkerRequestMoveArtworks,
	WorkerRequestMoveFolders,
	WorkerRequestMoveTracks,
	WorkerRequestRefreshFolders,
	WorkerRequestRefreshRoot,
	WorkerRequestRefreshRootMeta,
	WorkerRequestRefreshTracks,
	WorkerRequestRemoveArtwork,
	WorkerRequestRemoveRoot,
	WorkerRequestRemoveTracks,
	WorkerRequestRenameArtwork,
	WorkerRequestRenameFolder,
	WorkerRequestRenameTrack,
	WorkerRequestReplaceArtwork,
	WorkerRequestUpdateRoot,
	WorkerRequestWriteTrackTags
} from './worker.types';
import {Inject, InRequestScope} from 'typescript-ioc';

@InRequestScope
export class WorkerService {
	@Inject
	public artworkWorker!: ArtworkWorker;
	@Inject
	public trackWorker!: TrackWorker;
	@Inject
	public folderWorker!: FolderWorker;
	@Inject
	public rootWorker!: RootWorker;
	@Inject
	private changes!: ChangesWorker;
	@Inject
	private audioModule!: AudioModule;
	@Inject
	private imageModule!: ImageModule;
	@Inject
	private settingsService!: SettingsService;

	// root

	async refreshRoot(parameters: WorkerRequestRefreshRoot): Promise<Changes> {
		const {root, orm, changes} = await this.changes.start(parameters.rootID);
		await this.rootWorker.scan(orm, root, changes);
		return this.changes.finish(orm, changes, root);
	}

	async refreshRootMeta(parameters: WorkerRequestRefreshRootMeta): Promise<Changes> {
		const {root, orm, changes} = await this.changes.start(parameters.rootID);
		await this.rootWorker.refreshMeta(orm, root, changes);
		return this.changes.finish(orm, changes, root);
	}

	async updateRoot(parameters: WorkerRequestUpdateRoot): Promise<Changes> {
		const {root, orm, changes} = await this.changes.start(parameters.rootID);
		await this.rootWorker.update(orm, root, parameters.name, parameters.path, parameters.strategy);
		await this.rootWorker.scan(orm, root, changes);
		return this.changes.finish(orm, changes, root);
	}

	async createRoot(parameters: WorkerRequestCreateRoot): Promise<Changes> {
		const root = await this.rootWorker.create(this.changes.ormService.fork(true), parameters.name, parameters.path, parameters.strategy);
		const {orm, changes} = await this.changes.start(root.id);
		return this.changes.finish(orm, changes, root);
	}

	async removeRoot(parameters: WorkerRequestRemoveRoot): Promise<Changes> {
		const {root, orm, changes} = await this.changes.start(parameters.rootID);
		await this.rootWorker.remove(orm, root, changes);
		return this.changes.finish(orm, changes, root);
	}

	// folder

	async deleteFolders(parameters: WorkerRequestDeleteFolders): Promise<Changes> {
		const {root, orm, changes} = await this.changes.start(parameters.rootID);
		await this.folderWorker.delete(orm, root, parameters.folderIDs, changes);
		return this.changes.finish(orm, changes, root);
	}

	async refreshFolders(parameters: WorkerRequestRefreshFolders): Promise<Changes> {
		const {root, orm, changes} = await this.changes.start(parameters.rootID);
		await this.folderWorker.refresh(orm, parameters.folderIDs, changes);
		return this.changes.finish(orm, changes, root);
	}

	async createFolder(parameters: WorkerRequestCreateFolder): Promise<Changes> {
		const {root, orm, changes} = await this.changes.start(parameters.rootID);
		await this.folderWorker.create(orm, parameters.parentID, parameters.name, root, changes);
		return this.changes.finish(orm, changes, root);
	}

	async moveFolders(parameters: WorkerRequestMoveFolders): Promise<Changes> {
		const {root, orm, changes} = await this.changes.start(parameters.rootID);
		await this.folderWorker.move(orm, parameters.newParentID, parameters.folderIDs, changes);
		return this.changes.finish(orm, changes, root);
	}

	async renameFolder(parameters: WorkerRequestRenameFolder): Promise<Changes> {
		const {root, orm, changes} = await this.changes.start(parameters.rootID);
		await this.folderWorker.rename(orm, parameters.folderID, parameters.newName, changes);
		await this.rootWorker.mergeChanges(orm, root, changes);
		return this.changes.finish(orm, changes, root);
	}

	// tracks

	async refreshTracks(parameters: WorkerRequestRefreshTracks): Promise<Changes> {
		const {root, orm, changes} = await this.changes.start(parameters.rootID);
		await this.trackWorker.refresh(orm, parameters.trackIDs, changes);
		return this.changes.finish(orm, changes, root);
	}

	async removeTracks(parameters: WorkerRequestRemoveTracks): Promise<Changes> {
		const {root, orm, changes} = await this.changes.start(parameters.rootID);
		await this.trackWorker.remove(orm, root, parameters.trackIDs, changes);
		return this.changes.finish(orm, changes, root);
	}

	async moveTracks(parameters: WorkerRequestMoveTracks): Promise<Changes> {
		const {root, orm, changes} = await this.changes.start(parameters.rootID);
		await this.trackWorker.move(orm, parameters.trackIDs, parameters.newParentID, changes);
		return this.changes.finish(orm, changes, root);
	}

	async renameTrack(parameters: WorkerRequestRenameTrack): Promise<Changes> {
		const {root, orm, changes} = await this.changes.start(parameters.rootID);
		await this.trackWorker.rename(orm, parameters.trackID, parameters.newName, changes);
		return this.changes.finish(orm, changes, root);
	}

	async fixTracks(parameters: WorkerRequestFixTrack): Promise<Changes> {
		const {root, orm, changes} = await this.changes.start(parameters.rootID);
		await this.trackWorker.fix(orm, parameters.fixes, changes);
		return this.changes.finish(orm, changes, root);
	}

	async writeTrackTags(parameters: WorkerRequestWriteTrackTags): Promise<Changes> {
		const {root, orm, changes} = await this.changes.start(parameters.rootID);
		await this.trackWorker.writeTags(orm, parameters.tags, changes);
		await this.rootWorker.mergeChanges(orm, root, changes);
		return this.changes.finish(orm, changes, root);
	}

	// artworks

	async renameArtwork(parameters: WorkerRequestRenameArtwork): Promise<Changes> {
		const {root, orm, changes} = await this.changes.start(parameters.rootID);
		await this.artworkWorker.rename(orm, parameters.artworkID, parameters.newName, changes);
		return this.changes.finish(orm, changes, root);
	}

	async createArtwork(parameters: WorkerRequestCreateArtwork): Promise<Changes> {
		const {root, orm, changes} = await this.changes.start(parameters.rootID);
		await this.artworkWorker.create(orm, parameters.folderID, parameters.artworkFilename, parameters.types, changes);
		return this.changes.finish(orm, changes, root);
	}

	async moveArtworks(parameters: WorkerRequestMoveArtworks): Promise<Changes> {
		const {root, orm, changes} = await this.changes.start(parameters.rootID);
		await this.artworkWorker.move(orm, parameters.artworkIDs, parameters.newParentID, changes);
		return this.changes.finish(orm, changes, root);
	}

	async replaceArtwork(parameters: WorkerRequestReplaceArtwork): Promise<Changes> {
		const {root, orm, changes} = await this.changes.start(parameters.rootID);
		await this.artworkWorker.replace(orm, parameters.artworkID, parameters.artworkFilename, changes);
		return this.changes.finish(orm, changes, root);
	}

	async downloadArtwork(parameters: WorkerRequestDownloadArtwork): Promise<Changes> {
		const {root, orm, changes} = await this.changes.start(parameters.rootID);
		await this.artworkWorker.download(orm, parameters.folderID, parameters.artworkURL, parameters.types, changes);
		return this.changes.finish(orm, changes, root);
	}

	async removeArtwork(parameters: WorkerRequestRemoveArtwork): Promise<Changes> {
		const {root, orm, changes} = await this.changes.start(parameters.rootID);
		await this.artworkWorker.remove(orm, root, parameters.artworkID, changes);
		return this.changes.finish(orm, changes, root);
	}
}
