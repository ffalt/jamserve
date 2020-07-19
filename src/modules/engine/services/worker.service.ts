import {Changes, ChangesWorker} from '../worker/changes';
import {ArtworkWorker} from '../worker/tasks/artwork';
import {FolderWorker} from '../worker/tasks/folder';
import {RootWorker} from '../worker/tasks/root';
import {TrackWorker} from '../worker/tasks/track';
import {SettingsService} from '../../../entity/settings/settings.service';
import {AudioModule} from '../../audio/audio.module';
import {ImageModule} from '../../image/image.module';
import {OrmService} from './orm.service';
import {
	WorkerRequestCreateArtwork,
	WorkerRequestCreateFolder,
	WorkerRequestCreateRoot,
	WorkerRequestRemoveArtwork,
	WorkerRequestDeleteFolders,
	WorkerRequestDownloadArtwork,
	WorkerRequestFixTrack, WorkerRequestMoveArtworks,
	WorkerRequestMoveFolders,
	WorkerRequestMoveTracks,
	WorkerRequestRefreshFolders,
	WorkerRequestRefreshRoot,
	WorkerRequestRefreshTracks,
	WorkerRequestRemoveRoot,
	WorkerRequestRemoveTracks,
	WorkerRequestRenameArtwork,
	WorkerRequestRenameFolder,
	WorkerRequestRenameTrack,
	WorkerRequestReplaceArtwork,
	WorkerRequestUpdateRoot,
	WorkerRequestWriteTrackTags
} from './worker.types';
import {Inject, Singleton} from 'typescript-ioc';

@Singleton
export class WorkerService {
	public artworkWorker: ArtworkWorker;
	public trackWorker: TrackWorker;
	public folderWorker: FolderWorker;
	public rootWorker: RootWorker;
	private changes: ChangesWorker;
	@Inject
	private audioModule!: AudioModule;
	@Inject
	private imageModule!: ImageModule
	@Inject
	public orm!: OrmService
	@Inject
	private settingsService!: SettingsService

	constructor() {
		this.artworkWorker = new ArtworkWorker(this.orm, this.imageModule, this.audioModule);
		this.trackWorker = new TrackWorker(this.orm, this.imageModule, this.audioModule);
		this.folderWorker = new FolderWorker(this.orm, this.imageModule, this.audioModule);
		this.rootWorker = new RootWorker(this.orm, this.imageModule, this.audioModule);
		this.changes = new ChangesWorker(this.orm, this.imageModule, this.audioModule);
	}

	// root

	async refreshRoot(parameters: WorkerRequestRefreshRoot): Promise<Changes> {
		const {root, changes} = await this.changes.start(parameters.rootID);
		await this.rootWorker.scan(root, changes);
		return this.changes.finish(changes, root);
	}

	async updateRoot(parameters: WorkerRequestUpdateRoot): Promise<Changes> {
		const {root, changes} = await this.changes.start(parameters.rootID);
		await this.rootWorker.update(root, parameters.name, parameters.path, parameters.strategy);
		await this.rootWorker.scan(root, changes);
		return this.changes.finish(changes, root);
	}

	async createRoot(parameters: WorkerRequestCreateRoot): Promise<Changes> {
		const root = await this.rootWorker.create(parameters.name, parameters.path, parameters.strategy);
		const {changes} = await this.changes.start(root.id);
		return this.changes.finish(changes, root);
	}

	async removeRoot(parameters: WorkerRequestRemoveRoot): Promise<Changes> {
		const {root, changes} = await this.changes.start(parameters.rootID);
		await this.rootWorker.remove(root, changes);
		return this.changes.finish(changes, root);
	}

	// folder

	async deleteFolders(parameters: WorkerRequestDeleteFolders): Promise<Changes> {
		const {root, changes} = await this.changes.start(parameters.rootID);
		await this.folderWorker.delete(root, parameters.folderIDs, changes);
		return this.changes.finish(changes, root);
	}

	async refreshFolders(parameters: WorkerRequestRefreshFolders): Promise<Changes> {
		const {root, changes} = await this.changes.start(parameters.rootID);
		await this.folderWorker.refresh(parameters.folderIDs, changes);
		return this.changes.finish(changes, root);
	}

	async createFolder(parameters: WorkerRequestCreateFolder): Promise<Changes> {
		const {root, changes} = await this.changes.start(parameters.rootID);
		await this.folderWorker.create(parameters.parentID, parameters.name, root, changes);
		return this.changes.finish(changes, root);
	}

	async moveFolders(parameters: WorkerRequestMoveFolders): Promise<Changes> {
		const {root, changes} = await this.changes.start(parameters.rootID);
		await this.folderWorker.move(parameters.newParentID, parameters.folderIDs, changes);
		return this.changes.finish(changes, root);
	}

	async renameFolder(parameters: WorkerRequestRenameFolder): Promise<Changes> {
		const {root, changes} = await this.changes.start(parameters.rootID);
		await this.folderWorker.rename(parameters.folderID, parameters.newName, changes);
		return this.changes.finish(changes, root);
	}

	// tracks

	async refreshTracks(parameters: WorkerRequestRefreshTracks): Promise<Changes> {
		const {root, changes} = await this.changes.start(parameters.rootID);
		await this.trackWorker.refresh(parameters.trackIDs, changes);
		return this.changes.finish(changes, root);
	}

	async removeTracks(parameters: WorkerRequestRemoveTracks): Promise<Changes> {
		const {root, changes} = await this.changes.start(parameters.rootID);
		await this.trackWorker.remove(root, parameters.trackIDs, changes);
		return this.changes.finish(changes, root);
	}

	async moveTracks(parameters: WorkerRequestMoveTracks): Promise<Changes> {
		const {root, changes} = await this.changes.start(parameters.rootID);
		await this.trackWorker.move(parameters.trackIDs, parameters.newParentID, changes);
		return this.changes.finish(changes, root);
	}

	async renameTrack(parameters: WorkerRequestRenameTrack): Promise<Changes> {
		const {root, changes} = await this.changes.start(parameters.rootID);
		await this.trackWorker.rename(parameters.trackID, parameters.newName, changes);
		return this.changes.finish(changes, root);
	}

	async fixTracks(parameters: WorkerRequestFixTrack): Promise<Changes> {
		const {root, changes} = await this.changes.start(parameters.rootID);
		await this.trackWorker.fix(parameters.fixes, changes);
		return this.changes.finish(changes, root);
	}

	async writeTrackTags(parameters: WorkerRequestWriteTrackTags): Promise<Changes> {
		const {root, changes} = await this.changes.start(parameters.rootID);
		await this.trackWorker.writeTags(parameters.tags, changes);
		return this.changes.finish(changes, root);
	}

	// artworks

	async renameArtwork(parameters: WorkerRequestRenameArtwork): Promise<Changes> {
		const {root, changes} = await this.changes.start(parameters.rootID);
		await this.artworkWorker.rename(parameters.artworkID, parameters.newName, changes);
		return this.changes.finish(changes, root);
	}

	async createArtwork(parameters: WorkerRequestCreateArtwork): Promise<Changes> {
		const {root, changes} = await this.changes.start(parameters.rootID);
		await this.artworkWorker.create(parameters.folderID, parameters.artworkFilename, parameters.types, changes);
		return this.changes.finish(changes, root);
	}

	async moveArtworks(parameters: WorkerRequestMoveArtworks): Promise<Changes> {
		const {root, changes} = await this.changes.start(parameters.rootID);
		await this.artworkWorker.move(parameters.artworkIDs, parameters.newParentID, changes);
		return this.changes.finish(changes, root);
	}

	async replaceArtwork(parameters: WorkerRequestReplaceArtwork): Promise<Changes> {
		const {root, changes} = await this.changes.start(parameters.rootID);
		await this.artworkWorker.replace(parameters.artworkID, parameters.artworkFilename, changes);
		return this.changes.finish(changes, root);
	}

	async downloadArtwork(parameters: WorkerRequestDownloadArtwork): Promise<Changes> {
		const {root, changes} = await this.changes.start(parameters.rootID);
		await this.artworkWorker.download(parameters.folderID, parameters.artworkURL, parameters.types, changes);
		return this.changes.finish(changes, root);
	}

	async removeArtwork(parameters: WorkerRequestRemoveArtwork): Promise<Changes> {
		const {root, changes} = await this.changes.start(parameters.rootID);
		await this.artworkWorker.remove(root, parameters.artworkID, changes);
		return this.changes.finish(changes, root);
	}
}
