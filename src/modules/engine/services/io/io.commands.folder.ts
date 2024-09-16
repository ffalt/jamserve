import {AdminChangeQueueInfo, WorkerRequestMode} from './io.types.js';
import {WorkerRequestCreateFolder, WorkerRequestRemoveFolders, WorkerRequestMoveFolders, WorkerRequestRenameFolder} from '../worker/worker.types.js';
import {IoService} from '../io.service.js';

export class IoCommandsFolder {
	constructor(private owner: IoService) {
	}

	async move(folderIDs: Array<string>, newParentID: string, rootID: string): Promise<AdminChangeQueueInfo> {
		const oldRequest = this.owner.find(c =>
			(!!c.parameters.rootID) && (c.parameters.rootID === rootID) &&
			(c.mode === WorkerRequestMode.moveFolders) && ((c.parameters as WorkerRequestMoveFolders).newParentID === newParentID)
		);
		if (oldRequest) {
			for (const id of folderIDs) {
				if (!(oldRequest.parameters as WorkerRequestMoveFolders).folderIDs.includes(id)) {
					(oldRequest.parameters as WorkerRequestMoveFolders).folderIDs.push(id);
				}
			}
			return this.owner.getRequestInfo(oldRequest);
		}
		return this.owner.newRequest<WorkerRequestMoveFolders>(
			WorkerRequestMode.moveFolders, p => this.owner.workerService.folder.move(p), {rootID, newParentID, folderIDs}
		);
	}

	async delete(id: string, rootID: string): Promise<AdminChangeQueueInfo> {
		const oldRequest = this.owner.findRequest(rootID, WorkerRequestMode.deleteFolders);
		if (oldRequest) {
			if (!(oldRequest.parameters as WorkerRequestRemoveFolders).folderIDs.includes(id)) {
				(oldRequest.parameters as WorkerRequestRemoveFolders).folderIDs.push(id);
			}
			return this.owner.getRequestInfo(oldRequest);
		}
		return this.owner.newRequest<WorkerRequestRemoveFolders>(
			WorkerRequestMode.deleteFolders, p => this.owner.workerService.folder.remove(p), {rootID, folderIDs: [id]}
		);
	}


	async rename(folderID: string, newName: string, rootID: string): Promise<AdminChangeQueueInfo> {
		return this.owner.newRequest<WorkerRequestRenameFolder>(
			WorkerRequestMode.renameFolder, p => this.owner.workerService.folder.rename(p), {rootID, folderID, newName}
		);
	}

	async create(parentID: string, name: string, rootID: string): Promise<AdminChangeQueueInfo> {
		return this.owner.newRequest<WorkerRequestCreateFolder>(
			WorkerRequestMode.createFolder, p => this.owner.workerService.folder.create(p), {rootID, parentID, name}
		);
	}

}

