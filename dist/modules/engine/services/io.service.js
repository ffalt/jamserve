var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var IoService_1;
import { WorkerService } from './worker.service.js';
import { OrmService } from './orm.service.js';
import { IoRequest } from './io/io.types.js';
import { Inject, InRequestScope } from 'typescript-ioc';
import { logger } from '../../../utils/logger.js';
import { IoCommandsArtwork } from './io/io.commands.artwork.js';
import { IoCommandsFolder } from './io/io.commands.folder.js';
import { IoCommandsRoot } from './io/io.commands.root.js';
import { IoCommandsTrack } from './io/io.commands.track.js';
import { errorToString } from '../../../utils/error.js';
const log = logger('IO');
let IoService = IoService_1 = class IoService {
    constructor() {
        this.artwork = new IoCommandsArtwork(this);
        this.folder = new IoCommandsFolder(this);
        this.root = new IoCommandsRoot(this);
        this.track = new IoCommandsTrack(this);
        this.scanning = false;
        this.rootStatus = new Map();
        this.queue = [];
        this.history = [];
        this.afterRefreshListeners = [];
        this.nextID = Date.now();
    }
    pushHistory(entry) {
        this.history.push(entry);
        if (this.history.length > IoService_1.HISTORY_MAX) {
            this.history.shift();
        }
    }
    async runRequest(cmd) {
        this.clearAfterRefresh();
        this.rootStatus.set(cmd.parameters.rootID, { lastScan: Date.now(), scanning: true });
        try {
            this.current = cmd;
            await cmd.run();
            this.rootStatus.set(cmd.parameters.rootID, { lastScan: Date.now() });
            this.pushHistory({ id: cmd.id, date: Date.now() });
            this.current = undefined;
        }
        catch (error) {
            log.error(error);
            this.current = undefined;
            let message = errorToString(error);
            if (message.startsWith('Error:')) {
                message = message.slice(6).trim();
            }
            this.rootStatus.set(cmd.parameters.rootID, { lastScan: Date.now(), error: message });
            this.pushHistory({ id: cmd.id, error: message, date: Date.now() });
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
                    .catch((error) => {
                    log.error(error);
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
            .catch((error) => {
            this.scanning = false;
            log.error(error);
        });
    }
    generateRequestID() {
        this.nextID += 1;
        return this.nextID.toString();
    }
    addRequest(req) {
        this.queue.push(req);
        this.run();
        return this.getRequestInfo(req);
    }
    findRequest(rootID, mode) {
        return this.queue.find(c => !!c.parameters.rootID && (c.parameters.rootID === rootID && c.mode === mode));
    }
    find(parameter) {
        return this.queue.find(parameter);
    }
    getRequestInfo(req) {
        const pos = this.queue.indexOf(req);
        return { id: req.id, pos: pos === -1 ? undefined : pos };
    }
    newRequest(mode, execute, parameters) {
        const request = (new IoRequest(this.generateRequestID(), mode, execute, parameters));
        return this.addRequest(request);
    }
    getAdminChangeQueueInfoStatus(id) {
        if (this.current?.id === id) {
            return { id };
        }
        const cmd = this.queue.find(c => c.id === id);
        if (cmd) {
            const pos = this.queue.indexOf(cmd);
            return { id, pos: pos === -1 ? undefined : pos };
        }
        const done = this.history.find(c => c.id === id);
        if (done) {
            return { id, error: done.error, done: done.date };
        }
        if (this.track.delayedTrackTagWrite.findbyID(id)) {
            return { id };
        }
        if (this.track.delayedTrackFix.findbyID(id)) {
            return { id };
        }
        return { id, error: 'ID not found', done: Date.now() };
    }
    getRootStatus(id) {
        let status = this.rootStatus.get(id);
        status ?? (status = { lastScan: Date.now() });
        if (!status.scanning) {
            const cmd = this.queue.find(c => c.parameters.rootID === id);
            status.scanning = !!cmd;
        }
        return status;
    }
    registerAfterRefresh(listener) {
        this.afterRefreshListeners.push(listener);
    }
    removeAfterRefresh(listener) {
        this.afterRefreshListeners = this.afterRefreshListeners.filter(l => l !== listener);
    }
};
IoService.HISTORY_MAX = 1000;
__decorate([
    Inject,
    __metadata("design:type", OrmService)
], IoService.prototype, "orm", void 0);
__decorate([
    Inject,
    __metadata("design:type", WorkerService)
], IoService.prototype, "workerService", void 0);
IoService = IoService_1 = __decorate([
    InRequestScope
], IoService);
export { IoService };
//# sourceMappingURL=io.service.js.map