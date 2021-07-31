export class WorkerCommandsTrack {
    constructor(owner) {
        this.owner = owner;
    }
    async refresh(parameters) {
        const { root, orm, changes } = await this.owner.changes.start(parameters.rootID);
        await this.owner.trackWorker.refresh(orm, parameters.trackIDs, changes);
        return this.owner.changes.finish(orm, changes, root);
    }
    async remove(parameters) {
        const { root, orm, changes } = await this.owner.changes.start(parameters.rootID);
        await this.owner.trackWorker.remove(orm, root, parameters.trackIDs, changes);
        return this.owner.changes.finish(orm, changes, root);
    }
    async move(parameters) {
        const { root, orm, changes } = await this.owner.changes.start(parameters.rootID);
        await this.owner.trackWorker.move(orm, parameters.trackIDs, parameters.newParentID, changes);
        return this.owner.changes.finish(orm, changes, root);
    }
    async rename(parameters) {
        const { root, orm, changes } = await this.owner.changes.start(parameters.rootID);
        await this.owner.trackWorker.rename(orm, parameters.trackID, parameters.newName, changes);
        return this.owner.changes.finish(orm, changes, root);
    }
    async fix(parameters) {
        const { root, orm, changes } = await this.owner.changes.start(parameters.rootID);
        await this.owner.trackWorker.fix(orm, parameters.fixes, changes);
        return this.owner.changes.finish(orm, changes, root);
    }
    async writeTags(parameters) {
        const { root, orm, changes } = await this.owner.changes.start(parameters.rootID);
        await this.owner.trackWorker.writeTags(orm, parameters.tags, changes);
        await this.owner.rootWorker.mergeChanges(orm, root, changes);
        return this.owner.changes.finish(orm, changes, root);
    }
}
//# sourceMappingURL=worker.commands.track.js.map