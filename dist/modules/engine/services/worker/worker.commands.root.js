export class WorkerCommandsRoot {
    constructor(owner) {
        this.owner = owner;
    }
    async refresh(parameters) {
        const { root, orm, changes } = await this.owner.changes.start(parameters.rootID);
        await this.owner.rootWorker.scan(orm, root, changes);
        return this.owner.changes.finish(orm, changes, root);
    }
    async refreshMeta(parameters) {
        const { root, orm, changes } = await this.owner.changes.start(parameters.rootID);
        await this.owner.rootWorker.refreshMeta(orm, root, changes);
        return this.owner.changes.finish(orm, changes, root);
    }
    async update(parameters) {
        const { root, orm, changes } = await this.owner.changes.start(parameters.rootID);
        await this.owner.rootWorker.update(orm, root, parameters.name, parameters.path, parameters.strategy);
        await this.owner.rootWorker.scan(orm, root, changes);
        return this.owner.changes.finish(orm, changes, root);
    }
    async create(parameters) {
        const root = await this.owner.rootWorker.create(this.owner.changes.ormService.fork(true), parameters.name, parameters.path, parameters.strategy);
        const { orm, changes } = await this.owner.changes.start(root.id);
        return this.owner.changes.finish(orm, changes, root);
    }
    async remove(parameters) {
        const { root, orm, changes } = await this.owner.changes.start(parameters.rootID);
        await this.owner.rootWorker.remove(orm, root, changes);
        return this.owner.changes.finish(orm, changes, root);
    }
}
//# sourceMappingURL=worker.commands.root.js.map