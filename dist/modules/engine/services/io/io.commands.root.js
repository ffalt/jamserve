"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IoCommandsRoot = void 0;
const io_types_1 = require("./io.types");
class IoCommandsRoot {
    constructor(owner) {
        this.owner = owner;
    }
    async update(rootID, name, path, strategy) {
        return this.owner.newRequest(io_types_1.WorkerRequestMode.updateRoot, p => this.owner.workerService.root.update(p), { rootID, name, path, strategy });
    }
    async create(name, path, strategy) {
        return this.owner.newRequest(io_types_1.WorkerRequestMode.createRoot, p => this.owner.workerService.root.create(p), { rootID: '', name, path, strategy });
    }
    async delete(rootID) {
        const oldRequest = this.owner.findRequest(rootID, io_types_1.WorkerRequestMode.removeRoot);
        if (oldRequest) {
            return this.owner.getRequestInfo(oldRequest);
        }
        return this.owner.newRequest(io_types_1.WorkerRequestMode.removeRoot, p => this.owner.workerService.root.remove(p), { rootID });
    }
    async refresh(rootID) {
        const oldRequest = this.owner.findRequest(rootID, io_types_1.WorkerRequestMode.refreshRoot);
        if (oldRequest) {
            return this.owner.getRequestInfo(oldRequest);
        }
        return this.owner.newRequest(io_types_1.WorkerRequestMode.refreshRoot, p => this.owner.workerService.root.refresh(p), { rootID });
    }
    async refreshMeta(rootID) {
        const oldRequest = this.owner.findRequest(rootID, io_types_1.WorkerRequestMode.refreshRootMeta);
        if (oldRequest) {
            return this.owner.getRequestInfo(oldRequest);
        }
        return this.owner.newRequest(io_types_1.WorkerRequestMode.refreshRootMeta, p => this.owner.workerService.root.refreshMeta(p), { rootID });
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
exports.IoCommandsRoot = IoCommandsRoot;
//# sourceMappingURL=io.commands.root.js.map