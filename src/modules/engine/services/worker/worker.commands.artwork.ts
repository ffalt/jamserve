import { WorkerService } from '../worker.service.js';
import { WorkerRequestCreateArtwork, WorkerRequestDownloadArtwork, WorkerRequestMoveArtworks, WorkerRequestRemoveArtwork, WorkerRequestRenameArtwork, WorkerRequestReplaceArtwork } from './worker.types.js';
import { Changes } from '../../worker/changes.js';

export class WorkerCommandsArtwork {
	constructor(private readonly owner: WorkerService) {
	}

	async rename(parameters: WorkerRequestRenameArtwork): Promise<Changes> {
		const { root, orm, changes } = await this.owner.changes.start(parameters.rootID);
		await this.owner.artworkWorker.rename(orm, parameters.artworkID, parameters.newName, changes);
		return this.owner.changes.finish(orm, changes, root);
	}

	async create(parameters: WorkerRequestCreateArtwork): Promise<Changes> {
		const { root, orm, changes } = await this.owner.changes.start(parameters.rootID);
		await this.owner.artworkWorker.create(orm, parameters.folderID, parameters.artworkFilename, parameters.types, changes);
		return this.owner.changes.finish(orm, changes, root);
	}

	async move(parameters: WorkerRequestMoveArtworks): Promise<Changes> {
		const { root, orm, changes } = await this.owner.changes.start(parameters.rootID);
		await this.owner.artworkWorker.move(orm, parameters.artworkIDs, parameters.newParentID, changes);
		return this.owner.changes.finish(orm, changes, root);
	}

	async replace(parameters: WorkerRequestReplaceArtwork): Promise<Changes> {
		const { root, orm, changes } = await this.owner.changes.start(parameters.rootID);
		await this.owner.artworkWorker.replace(orm, parameters.artworkID, parameters.artworkFilename, changes);
		return this.owner.changes.finish(orm, changes, root);
	}

	async download(parameters: WorkerRequestDownloadArtwork): Promise<Changes> {
		const { root, orm, changes } = await this.owner.changes.start(parameters.rootID);
		await this.owner.artworkWorker.download(orm, parameters.folderID, parameters.artworkURL, parameters.types, changes);
		return this.owner.changes.finish(orm, changes, root);
	}

	async remove(parameters: WorkerRequestRemoveArtwork): Promise<Changes> {
		const { root, orm, changes } = await this.owner.changes.start(parameters.rootID);
		await this.owner.artworkWorker.remove(orm, root, parameters.artworkID, changes);
		return this.owner.changes.finish(orm, changes, root);
	}
}
