import { WorkerRequestMode } from './io.types.js';
export class IoCommandsFolder {
    constructor(owner) {
        this.owner = owner;
    }
    async move(folderIDs, newParentID, rootID) {
        const oldRequest = this.owner.find(c => (!!c.parameters.rootID) && (c.parameters.rootID === rootID) &&
            (c.mode === WorkerRequestMode.moveFolders) && (c.parameters.newParentID === newParentID));
        if (oldRequest) {
            for (const id of folderIDs) {
                if (!oldRequest.parameters.folderIDs.includes(id)) {
                    oldRequest.parameters.folderIDs.push(id);
                }
            }
            return this.owner.getRequestInfo(oldRequest);
        }
        return this.owner.newRequest(WorkerRequestMode.moveFolders, p => this.owner.workerService.folder.move(p), { rootID, newParentID, folderIDs });
    }
    async delete(id, rootID) {
        const oldRequest = this.owner.findRequest(rootID, WorkerRequestMode.deleteFolders);
        if (oldRequest) {
            if (!oldRequest.parameters.folderIDs.includes(id)) {
                oldRequest.parameters.folderIDs.push(id);
            }
            return this.owner.getRequestInfo(oldRequest);
        }
        return this.owner.newRequest(WorkerRequestMode.deleteFolders, p => this.owner.workerService.folder.remove(p), { rootID, folderIDs: [id] });
    }
    async rename(folderID, newName, rootID) {
        return this.owner.newRequest(WorkerRequestMode.renameFolder, p => this.owner.workerService.folder.rename(p), { rootID, folderID, newName });
    }
    async create(parentID, name, rootID) {
        return this.owner.newRequest(WorkerRequestMode.createFolder, p => this.owner.workerService.folder.create(p), { rootID, parentID, name });
    }
}
//# sourceMappingURL=io.commands.folder.js.map