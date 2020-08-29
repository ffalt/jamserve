"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IoService = void 0;
const worker_service_1 = require("./worker.service");
const orm_service_1 = require("./orm.service");
const io_types_1 = require("./io.types");
const typescript_ioc_1 = require("typescript-ioc");
const logger_1 = require("../../../utils/logger");
const log = logger_1.logger('IO');
let IoService = class IoService {
    constructor() {
        this.scanning = false;
        this.afterRefreshListeners = [];
        this.rootStatus = new Map();
        this.queue = [];
        this.delayedTrackTagWrite = new Map();
        this.delayedTrackFix = new Map();
        this.nextID = Date.now();
        this.history = [];
    }
    generateRequestID() {
        this.nextID += 1;
        return this.nextID.toString();
    }
    async runRequest(cmd) {
        this.clearAfterRefresh();
        this.rootStatus.set(cmd.parameters.rootID, { lastScan: Date.now(), scanning: true });
        try {
            this.current = cmd;
            await cmd.run();
            this.rootStatus.set(cmd.parameters.rootID, { lastScan: Date.now() });
            this.history.push({ id: cmd.id, date: Date.now() });
            this.current = undefined;
        }
        catch (e) {
            console.error(e);
            this.current = undefined;
            let msg = e.toString();
            if (msg.startsWith('Error:')) {
                msg = msg.slice(6).trim();
            }
            this.rootStatus.set(cmd.parameters.rootID, { lastScan: Date.now(), error: msg });
            this.history.push({ id: cmd.id, error: msg, date: Date.now() });
        }
        if (this.queue.length === 0) {
            this.runAfterRefresh();
        }
    }
    runAfterRefresh() {
        this.clearAfterRefresh();
        this.afterScanTimeout = setTimeout(() => {
            this.clearAfterRefresh();
            for (const listener of this.afterRefreshListeners) {
                listener()
                    .catch(e => {
                    console.error(e);
                });
            }
        }, 10000);
    }
    clearAfterRefresh() {
        if (this.afterScanTimeout) {
            clearTimeout(this.afterScanTimeout);
        }
        this.afterScanTimeout = undefined;
    }
    findRequest(rootID, mode) {
        return this.queue.find(c => !!c.parameters.rootID && (c.parameters.rootID === rootID && c.mode === mode));
    }
    async next() {
        const cmd = this.queue.shift();
        if (cmd) {
            await this.runRequest(cmd);
            await this.next();
        }
    }
    run() {
        if (this.scanning) {
            return;
        }
        this.scanning = true;
        log.info('Start Processing');
        this.next()
            .then(() => {
            this.scanning = false;
            log.info('Stop Processing');
        })
            .catch(e => {
            this.scanning = false;
            log.error(e);
        });
    }
    addRequest(req) {
        this.queue.push(req);
        this.run();
        return this.getRequestInfo(req);
    }
    getRequestInfo(req) {
        const pos = this.queue.indexOf(req);
        return { id: req.id, pos: pos >= 0 ? pos : undefined };
    }
    newRequest(mode, execute, parameters) {
        return this.addRequest(new io_types_1.IoRequest(this.generateRequestID(), mode, execute, parameters));
    }
    getAdminChangeQueueInfoStatus(id) {
        if (this.current && this.current.id === id) {
            return { id };
        }
        const cmd = this.queue.find(c => c.id === id);
        if (cmd) {
            const pos = this.queue.indexOf(cmd);
            return { id, pos: pos >= 0 ? pos : undefined };
        }
        const done = this.history.find(c => c.id === id);
        if (done) {
            return { id, error: done.error, done: done.date };
        }
        for (const d of this.delayedTrackTagWrite) {
            if (d[1].request.id === id) {
                return { id };
            }
        }
        for (const d of this.delayedTrackFix) {
            if (d[1].request.id === id) {
                return { id };
            }
        }
        return { id, error: 'ID not found', done: Date.now() };
    }
    getRootStatus(id) {
        let status = this.rootStatus.get(id);
        if (!status) {
            status = { lastScan: Date.now() };
        }
        if (!status.scanning) {
            const cmd = this.queue.find(c => c.parameters.rootID === id);
            status.scanning = !!cmd;
        }
        return status;
    }
    async refresh(orm) {
        const roots = await orm.Root.all();
        const result = [];
        for (const root of roots) {
            result.push(await this.refreshRoot(root.id));
        }
        return result;
    }
    async refreshRoot(rootID) {
        const oldRequest = this.findRequest(rootID, io_types_1.WorkerRequestMode.refreshRoot);
        if (oldRequest) {
            return this.getRequestInfo(oldRequest);
        }
        return this.newRequest(io_types_1.WorkerRequestMode.refreshRoot, p => this.workerService.refreshRoot(p), { rootID });
    }
    async removeRoot(rootID) {
        const oldRequest = this.findRequest(rootID, io_types_1.WorkerRequestMode.removeRoot);
        if (oldRequest) {
            return this.getRequestInfo(oldRequest);
        }
        return this.newRequest(io_types_1.WorkerRequestMode.removeRoot, p => this.workerService.removeRoot(p), { rootID });
    }
    async moveFolders(folderIDs, newParentID, rootID) {
        const oldRequest = this.queue.find(c => (!!c.parameters.rootID) && (c.parameters.rootID === rootID) &&
            (c.mode === io_types_1.WorkerRequestMode.moveFolders) && (c.parameters.newParentID === newParentID));
        if (oldRequest) {
            for (const id of folderIDs) {
                if (!oldRequest.parameters.folderIDs.includes(id)) {
                    oldRequest.parameters.folderIDs.push(id);
                }
            }
            return this.getRequestInfo(oldRequest);
        }
        return this.newRequest(io_types_1.WorkerRequestMode.moveFolders, p => this.workerService.moveFolders(p), { rootID, newParentID, folderIDs });
    }
    async deleteFolder(id, rootID) {
        const oldRequest = this.findRequest(rootID, io_types_1.WorkerRequestMode.deleteFolders);
        if (oldRequest) {
            if (!oldRequest.parameters.folderIDs.includes(id)) {
                oldRequest.parameters.folderIDs.push(id);
            }
            return this.getRequestInfo(oldRequest);
        }
        return this.newRequest(io_types_1.WorkerRequestMode.deleteFolders, p => this.workerService.deleteFolders(p), { rootID, folderIDs: [id] });
    }
    async renameArtwork(artworkID, newName, rootID) {
        return this.newRequest(io_types_1.WorkerRequestMode.renameArtwork, p => this.workerService.renameArtwork(p), { rootID, artworkID, newName });
    }
    async replaceArtwork(artworkID, artworkFilename, rootID) {
        return this.newRequest(io_types_1.WorkerRequestMode.replaceArtwork, p => this.workerService.replaceArtwork(p), { rootID, artworkID, artworkFilename });
    }
    async createArtwork(folderID, artworkFilename, types, rootID) {
        return this.newRequest(io_types_1.WorkerRequestMode.createArtwork, p => this.workerService.createArtwork(p), { rootID, folderID, artworkFilename, types });
    }
    async downloadArtwork(folderID, artworkURL, types, rootID) {
        return this.newRequest(io_types_1.WorkerRequestMode.downloadArtwork, p => this.workerService.downloadArtwork(p), { rootID, folderID, artworkURL, types });
    }
    async deleteArtwork(artworkID, rootID) {
        return this.newRequest(io_types_1.WorkerRequestMode.deleteArtwork, p => this.workerService.removeArtwork(p), { rootID, artworkID });
    }
    async removeTrack(id, rootID) {
        const oldRequest = this.findRequest(rootID, io_types_1.WorkerRequestMode.removeTracks);
        if (oldRequest) {
            if (!oldRequest.parameters.trackIDs.includes(id)) {
                oldRequest.parameters.trackIDs.push(id);
            }
            return this.getRequestInfo(oldRequest);
        }
        return this.newRequest(io_types_1.WorkerRequestMode.removeTracks, p => this.workerService.removeTracks(p), { rootID, trackIDs: [id] });
    }
    async moveTracks(trackIDs, newParentID, rootID) {
        const oldRequest = this.queue.find(c => ((!!c.parameters.rootID) && (c.parameters.rootID === rootID) &&
            (c.mode === io_types_1.WorkerRequestMode.moveTracks) && c.parameters.newParentID === newParentID));
        if (oldRequest) {
            for (const id of trackIDs) {
                if (!oldRequest.parameters.trackIDs.includes(id)) {
                    oldRequest.parameters.trackIDs.push(id);
                }
            }
            return this.getRequestInfo(oldRequest);
        }
        return this.newRequest(io_types_1.WorkerRequestMode.moveTracks, p => this.workerService.moveTracks(p), { rootID, trackIDs, newParentID });
    }
    async renameTrack(trackID, newName, rootID) {
        return this.newRequest(io_types_1.WorkerRequestMode.renameTrack, p => this.workerService.renameTrack(p), { rootID, trackID, newName });
    }
    async writeRawTag(trackID, tag, rootID) {
        const oldRequest = this.findRequest(rootID, io_types_1.WorkerRequestMode.writeTrackTags);
        if (oldRequest) {
            oldRequest.parameters.tags.push({ trackID, tag });
            return this.getRequestInfo(oldRequest);
        }
        let delayedCmd = this.delayedTrackTagWrite.get(rootID);
        if (delayedCmd) {
            if (delayedCmd.timeout) {
                clearTimeout(delayedCmd.timeout);
            }
            (delayedCmd.request.parameters).tags.push({ trackID, tag });
        }
        else {
            delayedCmd = {
                request: new io_types_1.IoRequest(this.generateRequestID(), io_types_1.WorkerRequestMode.writeTrackTags, p => this.workerService.writeTrackTags(p), { rootID, tags: [{ trackID, tag }] }),
                timeout: undefined
            };
            this.delayedTrackTagWrite.set(rootID, delayedCmd);
        }
        delayedCmd.timeout = setTimeout(() => {
            this.delayedTrackTagWrite.delete(rootID);
            if (delayedCmd) {
                this.addRequest(delayedCmd.request);
            }
        }, 10000);
        return this.getRequestInfo(delayedCmd.request);
    }
    async fixTrack(trackID, fixID, rootID) {
        const oldRequest = this.findRequest(rootID, io_types_1.WorkerRequestMode.fixTrack);
        if (oldRequest) {
            oldRequest.parameters.fixes.push({ trackID, fixID });
            return this.getRequestInfo(oldRequest);
        }
        let delayedCmd = this.delayedTrackFix.get(rootID);
        if (delayedCmd) {
            if (delayedCmd.timeout) {
                clearTimeout(delayedCmd.timeout);
            }
            (delayedCmd.request.parameters).fixes.push({ trackID, fixID });
        }
        else {
            delayedCmd = {
                request: new io_types_1.IoRequest(this.generateRequestID(), io_types_1.WorkerRequestMode.fixTrack, p => this.workerService.fixTracks(p), { rootID, fixes: [{ trackID, fixID }] }),
                timeout: undefined
            };
            this.delayedTrackFix.set(rootID, delayedCmd);
        }
        delayedCmd.timeout = setTimeout(() => {
            this.delayedTrackFix.delete(rootID);
            if (delayedCmd) {
                this.addRequest(delayedCmd.request);
            }
        }, 10000);
        return this.getRequestInfo(delayedCmd.request);
    }
    async renameFolder(folderID, newName, rootID) {
        return this.newRequest(io_types_1.WorkerRequestMode.renameFolder, p => this.workerService.renameFolder(p), { rootID, folderID, newName });
    }
    async newFolder(parentID, name, rootID) {
        return this.newRequest(io_types_1.WorkerRequestMode.createFolder, p => this.workerService.createFolder(p), { rootID, parentID, name });
    }
    async updateRoot(rootID, name, path, strategy) {
        return this.newRequest(io_types_1.WorkerRequestMode.updateRoot, p => this.workerService.updateRoot(p), { rootID, name, path, strategy });
    }
    async createRoot(name, path, strategy) {
        return this.newRequest(io_types_1.WorkerRequestMode.createRoot, p => this.workerService.createRoot(p), { rootID: '', name, path, strategy });
    }
    registerAfterRefresh(listener) {
        this.afterRefreshListeners.push(listener);
    }
    removeAfterRefresh(listener) {
        this.afterRefreshListeners = this.afterRefreshListeners.filter(l => l !== listener);
    }
};
__decorate([
    typescript_ioc_1.Inject,
    __metadata("design:type", orm_service_1.OrmService)
], IoService.prototype, "orm", void 0);
__decorate([
    typescript_ioc_1.Inject,
    __metadata("design:type", worker_service_1.WorkerService)
], IoService.prototype, "workerService", void 0);
IoService = __decorate([
    typescript_ioc_1.InRequestScope
], IoService);
exports.IoService = IoService;
//# sourceMappingURL=io.service.js.map