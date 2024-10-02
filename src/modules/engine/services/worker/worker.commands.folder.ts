import { WorkerService } from '../worker.service.js';
import { WorkerRequestCreateFolder, WorkerRequestRemoveFolders, WorkerRequestMoveFolders, WorkerRequestRefreshFolders, WorkerRequestRenameFolder } from './worker.types.js';
import { Changes } from '../../worker/changes.js';

export class WorkerCommandsFolder {
	constructor(private owner: WorkerService) {
	}

	async remove(parameters: WorkerRequestRemoveFolders): Promise<Changes> {
		const { root, orm, changes } = await this.owner.changes.start(parameters.rootID);
		await this.owner.folderWorker.delete(orm, root, parameters.folderIDs, changes);
		return this.owner.changes.finish(orm, changes, root);
	}

	async refresh(parameters: WorkerRequestRefreshFolders): Promise<Changes> {
		const { root, orm, changes } = await this.owner.changes.start(parameters.rootID);
		await this.owner.folderWorker.refresh(orm, parameters.folderIDs, changes);
		return this.owner.changes.finish(orm, changes, root);
	}

	async create(parameters: WorkerRequestCreateFolder): Promise<Changes> {
		const { root, orm, changes } = await this.owner.changes.start(parameters.rootID);
		await this.owner.folderWorker.create(orm, parameters.parentID, parameters.name, root, changes);
		return this.owner.changes.finish(orm, changes, root);
	}

	async move(parameters: WorkerRequestMoveFolders): Promise<Changes> {
		const { root, orm, changes } = await this.owner.changes.start(parameters.rootID);
		await this.owner.folderWorker.move(orm, parameters.newParentID, parameters.folderIDs, changes);
		return this.owner.changes.finish(orm, changes, root);
	}

	async rename(parameters: WorkerRequestRenameFolder): Promise<Changes> {
		const { root, orm, changes } = await this.owner.changes.start(parameters.rootID);
		await this.owner.folderWorker.rename(orm, parameters.folderID, parameters.newName, changes);
		await this.owner.rootWorker.mergeChanges(orm, root, changes);
		return this.owner.changes.finish(orm, changes, root);
	}
}
