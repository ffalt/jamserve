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
const io_types_1 = require("./io/io.types");
const typescript_ioc_1 = require("typescript-ioc");
const logger_1 = require("../../../utils/logger");
const io_commands_artwork_1 = require("./io/io.commands.artwork");
const io_commands_folder_1 = require("./io/io.commands.folder");
const io_commands_root_1 = require("./io/io.commands.root");
const io_commands_track_1 = require("./io/io.commands.track");
const log = logger_1.logger('IO');
let IoService = class IoService {
    constructor() {
        this.scanning = false;
        this.afterRefreshListeners = [];
        this.rootStatus = new Map();
        this.queue = [];
        this.nextID = Date.now();
        this.history = [];
        this.artwork = new io_commands_artwork_1.IoCommandsArtwork(this);
        this.folder = new io_commands_folder_1.IoCommandsFolder(this);
        this.root = new io_commands_root_1.IoCommandsRoot(this);
        this.track = new io_commands_track_1.IoCommandsTrack(this);
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
    find(param) {
        return this.queue.find(param);
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
        if (!status) {
            status = { lastScan: Date.now() };
        }
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