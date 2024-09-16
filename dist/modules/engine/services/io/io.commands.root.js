import { WorkerRequestMode } from './io.types.js';
export class IoCommandsRoot {
    constructor(owner) {
        this.owner = owner;
    }
    async update(rootID, name, path, strategy) {
        return this.owner.newRequest(WorkerRequestMode.updateRoot, p => this.owner.workerService.root.update(p), { rootID, name, path, strategy });
    }
    async create(name, path, strategy) {
        return this.owner.newRequest(WorkerRequestMode.createRoot, p => this.owner.workerService.root.create(p), { rootID: '', name, path, strategy });
    }
    async delete(rootID) {
        const oldRequest = this.owner.findRequest(rootID, WorkerRequestMode.removeRoot);
        if (oldRequest) {
            return this.owner.getRequestInfo(oldRequest);
        }
        return this.owner.newRequest(WorkerRequestMode.removeRoot, p => this.owner.workerService.root.remove(p), { rootID });
    }
    async refresh(rootID) {
        const oldRequest = this.owner.findRequest(rootID, WorkerRequestMode.refreshRoot);
        if (oldRequest) {
            return this.owner.getRequestInfo(oldRequest);
        }
        return this.owner.newRequest(WorkerRequestMode.refreshRoot, p => this.owner.workerService.root.refresh(p), { rootID });
    }
    async refreshMeta(rootID) {
        const oldRequest = this.owner.findRequest(rootID, WorkerRequestMode.refreshRootMeta);
        if (oldRequest) {
            return this.owner.getRequestInfo(oldRequest);
        }
        return this.owner.newRequest(WorkerRequestMode.refreshRootMeta, p => this.owner.workerService.root.refreshMeta(p), { rootID });
    }
    async refreshAllMeta(orm) {
        const roots = await orm.Root.all();
        const result = [];
        for (const root of roots) {
            result.push(await this.refreshMeta(root.id));
        }
        return result;
    }
    async refreshAll(orm) {
        const roots = await orm.Root.all();
        const result = [];
        for (const root of roots) {
            result.push(await this.refresh(root.id));
        }
        return result;
    }
    async startUpRefresh(orm, forceRescan) {
        if (!forceRescan) {
            await this.refreshAll(orm);
        }
        else {
            await this.refreshAllMeta(orm);
        }
    }
}
//# sourceMappingURL=io.commands.root.js.map