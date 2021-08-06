var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var ChangesWorker_1;
import { Inject, InRequestScope } from 'typescript-ioc';
import { BaseWorker } from './tasks/base';
import { OrmService } from '../services/orm.service';
import { MetaMerger } from './merge-meta';
import { Changes, IdSet } from './changes';
import { logger } from '../../../utils/logger';
import moment from 'moment';
const log = logger('IO.Changes');
let ChangesWorker = ChangesWorker_1 = class ChangesWorker extends BaseWorker {
    async start(rootID) {
        const orm = this.ormService.fork(true);
        const root = await orm.Root.findOneOrFailByID(rootID);
        return { root, orm, changes: new Changes() };
    }
    async finish(orm, changes, root) {
        const metaMerger = new MetaMerger(orm, changes, root.id);
        await metaMerger.mergeMeta();
        await ChangesWorker_1.mergeDependendRemovals(orm, changes);
        await ChangesWorker_1.mergeRemovals(orm, changes);
        await this.cleanCacheFiles(changes);
        changes.end = Date.now();
        this.logChanges(changes);
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
    static async mergeDependendRemovals(orm, changes) {
        const stateCleanIds = new IdSet();
        const trackIDs = changes.tracks.removed.ids();
        stateCleanIds.appendIDs(trackIDs);
        stateCleanIds.appendIDs(changes.albums.removed.ids());
        stateCleanIds.appendIDs(changes.artists.removed.ids());
        stateCleanIds.appendIDs(changes.folders.removed.ids());
        stateCleanIds.appendIDs(changes.genres.removed.ids());
        stateCleanIds.appendIDs(changes.roots.removed.ids());
        stateCleanIds.appendIDs(changes.series.removed.ids());
        const stateBookmarkIDs = await orm.Bookmark.findIDs({ where: { track: trackIDs } });
        if (stateBookmarkIDs.length > 0) {
            await orm.Bookmark.removeLaterByIDs(stateBookmarkIDs);
            stateCleanIds.appendIDs(stateBookmarkIDs);
        }
        const playlistEntryIDs = await orm.PlaylistEntry.findIDs({ where: { track: trackIDs } });
        if (playlistEntryIDs.length > 0) {
            await orm.PlaylistEntry.removeLaterByIDs(playlistEntryIDs);
            stateCleanIds.appendIDs(playlistEntryIDs);
        }
        const stateDestIDs = stateCleanIds.ids();
        if (stateDestIDs.length > 0) {
            const states = await orm.State.findIDs({ where: { destID: stateDestIDs } });
            await orm.State.removeLaterByIDs(states);
        }
        if (orm.em.hasChanges()) {
            log.debug('Syncing Removal Dependend Updates to DB');
            await orm.em.flush();
        }
    }
    static async mergeRemovals(orm, changes) {
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
    logChanges(changes) {
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
        const v = moment.utc(changes.end - changes.start).format('HH:mm:ss.SSS');
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
};
__decorate([
    Inject,
    __metadata("design:type", OrmService)
], ChangesWorker.prototype, "ormService", void 0);
ChangesWorker = ChangesWorker_1 = __decorate([
    InRequestScope
], ChangesWorker);
export { ChangesWorker };
//# sourceMappingURL=changes-worker.js.map