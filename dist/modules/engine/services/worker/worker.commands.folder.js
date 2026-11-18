export class WorkerCommandsFolder {
    constructor(owner) {
        this.owner = owner;
    }
    async remove(parameters) {
        const { root, orm, changes } = await this.owner.changes.start(parameters.rootID);
        await this.owner.folderWorker.delete(orm, root, parameters.folderIDs, changes);
        return this.owner.changes.finish(orm, changes, root);
    }
    async refresh(parameters) {
        const { root, orm, changes } = await this.owner.changes.start(parameters.rootID);
        const folders = await this.owner.folderWorker.refresh(orm, parameters.folderIDs, parameters.withMetadata, changes);
        for (const folder of folders) {
            await this.owner.rootWorker.scan(orm, root, changes, folder);
        }
        return this.owner.changes.finish(orm, changes, root);
    }
    async create(parameters) {
        const { root, orm, changes } = await this.owner.changes.start(parameters.rootID);
        await this.owner.folderWorker.create(orm, parameters.parentID, parameters.name, root, changes);
        return this.owner.changes.finish(orm, changes, root);
    }
    async move(parameters) {
        const { root, orm, changes } = await this.owner.changes.start(parameters.rootID);
        await this.owner.folderWorker.move(orm, parameters.newParentID, parameters.folderIDs, changes);
        return this.owner.changes.finish(orm, changes, root);
    }
    async rename(parameters) {
        const { root, orm, changes } = await this.owner.changes.start(parameters.rootID);
        await this.owner.folderWorker.rename(orm, parameters.folderID, parameters.newName, changes);
        await this.owner.rootWorker.mergeChanges(orm, root, changes);
        return this.owner.changes.finish(orm, changes, root);
    }
}
//# sourceMappingURL=worker.commands.folder.js.map