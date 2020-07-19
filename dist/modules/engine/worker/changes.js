"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChangesWorker = exports.logChanges = exports.Changes = exports.ChangeSet = void 0;
const logger_1 = require("../../../utils/logger");
const moment_1 = __importDefault(require("moment"));
const merge_meta_1 = require("./merge-meta");
const base_1 = require("./tasks/base");
const log = logger_1.logger('Worker.Changes');
class IdSet {
    constructor() {
        this.list = [];
    }
    get size() {
        return this.list.length;
    }
    add(item) {
        if (item && !this.has(item)) {
            this.list.push(item);
        }
    }
    has(item) {
        return !!this.list.find(i => i.id === item.id);
    }
    delete(item) {
        this.list = this.list.filter(i => i.id !== item.id);
    }
    ids() {
        return this.list.map(i => i.id);
    }
    append(items) {
        for (const item of items) {
            this.add(item);
        }
    }
}
class ChangeSet {
    constructor() {
        this.added = new IdSet();
        this.updated = new IdSet();
        this.removed = new IdSet();
    }
}
exports.ChangeSet = ChangeSet;
class Changes {
    constructor() {
        this.artists = new ChangeSet();
        this.albums = new ChangeSet();
        this.tracks = new ChangeSet();
        this.roots = new ChangeSet();
        this.folders = new ChangeSet();
        this.series = new ChangeSet();
        this.artworks = new ChangeSet();
        this.start = Date.now();
        this.end = 0;
    }
}
exports.Changes = Changes;
function logChanges(changes) {
    function logChange(name, list) {
        if (list.size > 0) {
            log.info(name, list.size);
        }
    }
    function logChangeSet(name, set) {
        logChange('Added ' + name, set.added);
        logChange('Updated ' + name, set.updated);
        logChange('Removed ' + name, set.removed);
    }
    const v = moment_1.default.utc(changes.end - changes.start).format('HH:mm:ss.SSS');
    log.info('Duration:', v);
    logChangeSet('Tracks', changes.tracks);
    logChangeSet('Folders', changes.folders);
    logChangeSet('Artists', changes.artists);
    logChangeSet('Albums', changes.albums);
    logChangeSet('Series', changes.series);
    logChangeSet('Artworks', changes.artworks);
    logChangeSet('Roots', changes.roots);
}
exports.logChanges = logChanges;
class ChangesWorker extends base_1.BaseWorker {
    async start(rootID) {
        if (!rootID) {
            return Promise.reject(Error(`Root not found`));
        }
        const root = await this.orm.Root.findOne(rootID);
        if (!root) {
            return Promise.reject(Error(`Root not found`));
        }
        return { root, changes: new Changes() };
    }
    async finish(changes, root) {
        const metaMerger = new merge_meta_1.MetaMerger(this.orm, changes, root);
        await metaMerger.mergeMeta();
        changes.tracks.removed.list.forEach(f => this.orm.orm.em.removeLater(f));
        changes.artworks.removed.list.forEach(f => this.orm.orm.em.removeLater(f));
        changes.folders.removed.list.forEach(f => this.orm.orm.em.removeLater(f));
        changes.roots.removed.list.forEach(f => this.orm.orm.em.removeLater(f));
        changes.albums.removed.list.forEach(f => this.orm.orm.em.removeLater(f));
        changes.artists.removed.list.forEach(f => this.orm.orm.em.removeLater(f));
        changes.series.removed.list.forEach(f => this.orm.orm.em.removeLater(f));
        log.debug('Flushing changes');
        await this.orm.orm.em.flush();
        changes.end = Date.now();
        logChanges(changes);
        return changes;
    }
}
exports.ChangesWorker = ChangesWorker;
//# sourceMappingURL=changes.js.map