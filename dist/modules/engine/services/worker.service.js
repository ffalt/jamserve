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
exports.WorkerService = void 0;
const changes_1 = require("../worker/changes");
const artwork_1 = require("../worker/tasks/artwork");
const folder_1 = require("../worker/tasks/folder");
const root_1 = require("../worker/tasks/root");
const track_1 = require("../worker/tasks/track");
const settings_service_1 = require("../../../entity/settings/settings.service");
const audio_module_1 = require("../../audio/audio.module");
const image_module_1 = require("../../image/image.module");
const typescript_ioc_1 = require("typescript-ioc");
let WorkerService = class WorkerService {
    async refreshRoot(parameters) {
        const { root, orm, changes } = await this.changes.start(parameters.rootID);
        await this.rootWorker.scan(orm, root, changes);
        return this.changes.finish(orm, changes, root);
    }
    async updateRoot(parameters) {
        const { root, orm, changes } = await this.changes.start(parameters.rootID);
        await this.rootWorker.update(orm, root, parameters.name, parameters.path, parameters.strategy);
        await this.rootWorker.scan(orm, root, changes);
        return this.changes.finish(orm, changes, root);
    }
    async createRoot(parameters) {
        const root = await this.rootWorker.create(this.changes.ormService.fork(true), parameters.name, parameters.path, parameters.strategy);
        const { orm, changes } = await this.changes.start(root.id);
        return this.changes.finish(orm, changes, root);
    }
    async removeRoot(parameters) {
        const { root, orm, changes } = await this.changes.start(parameters.rootID);
        await this.rootWorker.remove(orm, root, changes);
        return this.changes.finish(orm, changes, root);
    }
    async deleteFolders(parameters) {
        const { root, orm, changes } = await this.changes.start(parameters.rootID);
        await this.folderWorker.delete(orm, root, parameters.folderIDs, changes);
        return this.changes.finish(orm, changes, root);
    }
    async refreshFolders(parameters) {
        const { root, orm, changes } = await this.changes.start(parameters.rootID);
        await this.folderWorker.refresh(orm, parameters.folderIDs, changes);
        return this.changes.finish(orm, changes, root);
    }
    async createFolder(parameters) {
        const { root, orm, changes } = await this.changes.start(parameters.rootID);
        await this.folderWorker.create(orm, parameters.parentID, parameters.name, root, changes);
        return this.changes.finish(orm, changes, root);
    }
    async moveFolders(parameters) {
        const { root, orm, changes } = await this.changes.start(parameters.rootID);
        await this.folderWorker.move(orm, parameters.newParentID, parameters.folderIDs, changes);
        return this.changes.finish(orm, changes, root);
    }
    async renameFolder(parameters) {
        const { root, orm, changes } = await this.changes.start(parameters.rootID);
        await this.folderWorker.rename(orm, parameters.folderID, parameters.newName, changes);
        await this.rootWorker.mergeChanges(orm, root, changes);
        return this.changes.finish(orm, changes, root);
    }
    async refreshTracks(parameters) {
        const { root, orm, changes } = await this.changes.start(parameters.rootID);
        await this.trackWorker.refresh(orm, parameters.trackIDs, changes);
        return this.changes.finish(orm, changes, root);
    }
    async removeTracks(parameters) {
        const { root, orm, changes } = await this.changes.start(parameters.rootID);
        await this.trackWorker.remove(orm, root, parameters.trackIDs, changes);
        return this.changes.finish(orm, changes, root);
    }
    async moveTracks(parameters) {
        const { root, orm, changes } = await this.changes.start(parameters.rootID);
        await this.trackWorker.move(orm, parameters.trackIDs, parameters.newParentID, changes);
        return this.changes.finish(orm, changes, root);
    }
    async renameTrack(parameters) {
        const { root, orm, changes } = await this.changes.start(parameters.rootID);
        await this.trackWorker.rename(orm, parameters.trackID, parameters.newName, changes);
        return this.changes.finish(orm, changes, root);
    }
    async fixTracks(parameters) {
        const { root, orm, changes } = await this.changes.start(parameters.rootID);
        await this.trackWorker.fix(orm, parameters.fixes, changes);
        return this.changes.finish(orm, changes, root);
    }
    async writeTrackTags(parameters) {
        const { root, orm, changes } = await this.changes.start(parameters.rootID);
        await this.trackWorker.writeTags(orm, parameters.tags, changes);
        await this.rootWorker.mergeChanges(orm, root, changes);
        return this.changes.finish(orm, changes, root);
    }
    async renameArtwork(parameters) {
        const { root, orm, changes } = await this.changes.start(parameters.rootID);
        await this.artworkWorker.rename(orm, parameters.artworkID, parameters.newName, changes);
        return this.changes.finish(orm, changes, root);
    }
    async createArtwork(parameters) {
        const { root, orm, changes } = await this.changes.start(parameters.rootID);
        await this.artworkWorker.create(orm, parameters.folderID, parameters.artworkFilename, parameters.types, changes);
        return this.changes.finish(orm, changes, root);
    }
    async moveArtworks(parameters) {
        const { root, orm, changes } = await this.changes.start(parameters.rootID);
        await this.artworkWorker.move(orm, parameters.artworkIDs, parameters.newParentID, changes);
        return this.changes.finish(orm, changes, root);
    }
    async replaceArtwork(parameters) {
        const { root, orm, changes } = await this.changes.start(parameters.rootID);
        await this.artworkWorker.replace(orm, parameters.artworkID, parameters.artworkFilename, changes);
        return this.changes.finish(orm, changes, root);
    }
    async downloadArtwork(parameters) {
        const { root, orm, changes } = await this.changes.start(parameters.rootID);
        await this.artworkWorker.download(orm, parameters.folderID, parameters.artworkURL, parameters.types, changes);
        return this.changes.finish(orm, changes, root);
    }
    async removeArtwork(parameters) {
        const { root, orm, changes } = await this.changes.start(parameters.rootID);
        await this.artworkWorker.remove(orm, root, parameters.artworkID, changes);
        return this.changes.finish(orm, changes, root);
    }
};
__decorate([
    typescript_ioc_1.Inject,
    __metadata("design:type", artwork_1.ArtworkWorker)
], WorkerService.prototype, "artworkWorker", void 0);
__decorate([
    typescript_ioc_1.Inject,
    __metadata("design:type", track_1.TrackWorker)
], WorkerService.prototype, "trackWorker", void 0);
__decorate([
    typescript_ioc_1.Inject,
    __metadata("design:type", folder_1.FolderWorker)
], WorkerService.prototype, "folderWorker", void 0);
__decorate([
    typescript_ioc_1.Inject,
    __metadata("design:type", root_1.RootWorker)
], WorkerService.prototype, "rootWorker", void 0);
__decorate([
    typescript_ioc_1.Inject,
    __metadata("design:type", changes_1.ChangesWorker)
], WorkerService.prototype, "changes", void 0);
__decorate([
    typescript_ioc_1.Inject,
    __metadata("design:type", audio_module_1.AudioModule)
], WorkerService.prototype, "audioModule", void 0);
__decorate([
    typescript_ioc_1.Inject,
    __metadata("design:type", image_module_1.ImageModule)
], WorkerService.prototype, "imageModule", void 0);
__decorate([
    typescript_ioc_1.Inject,
    __metadata("design:type", settings_service_1.SettingsService)
], WorkerService.prototype, "settingsService", void 0);
WorkerService = __decorate([
    typescript_ioc_1.InRequestScope
], WorkerService);
exports.WorkerService = WorkerService;
//# sourceMappingURL=worker.service.js.map