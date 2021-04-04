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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChangesWorker = exports.logChanges = exports.Changes = exports.ChangeSet = void 0;
const logger_1 = require("../../../utils/logger");
const moment_1 = __importDefault(require("moment"));
const merge_meta_1 = require("./merge-meta");
const base_1 = require("./tasks/base");
const orm_service_1 = require("../services/orm.service");
const typescript_ioc_1 = require("typescript-ioc");
const log = logger_1.logger('IO.Changes');
class IdSet {
    constructor() {
        this.set = new Set();
    }
    get size() {
        return this.set.size;
    }
    add(item) {
        if (item) {
            this.set.add(item.id);
        }
    }
    addID(item) {
        if (item) {
            this.set.add(item);
        }
    }
    has(item) {
        return this.set.has(item.id);
    }
    hasID(item) {
        return this.set.has(item);
    }
    delete(item) {
        this.set.delete(item.id);
    }
    ids() {
        return [...this.set];
    }
    append(items) {
        for (const item of items) {
            this.add(item);
        }
    }
    appendIDs(items) {
        for (const item of items) {
            this.set.add(item);
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
        this.genres = new ChangeSet();
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
    logChangeSet('Genres', changes.genres);
}
exports.logChanges = logChanges;
let ChangesWorker = class ChangesWorker extends base_1.BaseWorker {
    async start(rootID) {
        const orm = this.ormService.fork(true);
        const root = await orm.Root.findOneOrFailByID(rootID);
        return { root, orm, changes: new Changes() };
    }
    async finish(orm, changes, root) {
        const metaMerger = new merge_meta_1.MetaMerger(orm, changes, root.id);
        await metaMerger.mergeMeta();
        await this.mergeDependendRemovals(orm, changes);
        await this.mergeRemovals(orm, changes);
        await this.cleanCacheFiles(changes);
        changes.end = Date.now();
        logChanges(changes);
        this.ormService.clearCache();
        return changes;
    }
    async cleanCacheFiles(changes) {
        const imageCleanIds = new IdSet();
        for (const changeSet of [
            changes.albums, changes.artists, changes.artworks, changes.folders,
            changes.roots, changes.tracks, changes.series, changes.genres
        ]) {
            imageCleanIds.appendIDs(changeSet.removed.ids());
            imageCleanIds.appendIDs(changeSet.updated.ids());
        }
        const imageIDs = imageCleanIds.ids();
        if (imageIDs.length > 0) {
            log.debug('Cleaning Image Cache IDs:', imageIDs.length);
            await this.imageModule.clearImageCacheByIDs(imageIDs);
        }
        const trackCleanIds = new IdSet();
        trackCleanIds.appendIDs(changes.tracks.removed.ids());
        trackCleanIds.appendIDs(changes.tracks.updated.ids());
        const trackIDs = trackCleanIds.ids();
        if (trackIDs.length > 0) {
            log.debug('Cleaning Audio Cache IDs:', trackIDs.length);
            await this.audioModule.clearCacheByIDs(trackIDs);
        }
    }
    async mergeDependendRemovals(orm, changes) {
        const stateCleanIds = new IdSet();
        const trackIDs = changes.tracks.removed.ids();
        stateCleanIds.appendIDs(trackIDs);
        stateCleanIds.appendIDs(changes.albums.removed.ids());
        stateCleanIds.appendIDs(changes.artists.removed.ids());
        stateCleanIds.appendIDs(changes.folders.removed.ids());
        stateCleanIds.appendIDs(changes.genres.removed.ids());
        stateCleanIds.appendIDs(changes.roots.removed.ids());
        stateCleanIds.appendIDs(changes.series.removed.ids());
        const stateDestIDs = stateCleanIds.ids();
        if (stateDestIDs.length > 0) {
            const states = await orm.State.findIDs({ where: { destID: stateDestIDs } });
            await orm.State.removeLaterByIDs(states);
        }
        const stateBookmarkIDs = await orm.Bookmark.findIDs({ where: { track: trackIDs } });
        if (stateBookmarkIDs.length > 0) {
            await orm.Bookmark.removeLaterByIDs(stateBookmarkIDs);
        }
        const playlistEntryIDs = await orm.PlaylistEntry.findIDs({ where: { track: trackIDs } });
        if (playlistEntryIDs.length > 0) {
            await orm.PlaylistEntry.removeLaterByIDs(playlistEntryIDs);
        }
        if (orm.em.hasChanges()) {
            log.debug('Syncing Removal Dependend Updates to DB');
            await orm.em.flush();
        }
    }
    async mergeRemovals(orm, changes) {
        await orm.Track.removeLaterByIDs(changes.tracks.removed.ids());
        await orm.Artwork.removeLaterByIDs(changes.artworks.removed.ids());
        await orm.Folder.removeLaterByIDs(changes.folders.removed.ids());
        await orm.Root.removeLaterByIDs(changes.roots.removed.ids());
        await orm.Album.removeLaterByIDs(changes.albums.removed.ids());
        await orm.Artist.removeLaterByIDs(changes.artists.removed.ids());
        await orm.Series.removeLaterByIDs(changes.series.removed.ids());
        if (orm.em.hasChanges()) {
            log.debug('Syncing Removal Updates to DB');
            await orm.em.flush();
        }
    }
};
__decorate([
    typescript_ioc_1.Inject,
    __metadata("design:type", orm_service_1.OrmService)
], ChangesWorker.prototype, "ormService", void 0);
ChangesWorker = __decorate([
    typescript_ioc_1.InRequestScope
], ChangesWorker);
exports.ChangesWorker = ChangesWorker;
//# sourceMappingURL=changes.js.map