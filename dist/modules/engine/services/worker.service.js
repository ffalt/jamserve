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
const orm_service_1 = require("./orm.service");
const typescript_ioc_1 = require("typescript-ioc");
let WorkerService = class WorkerService {
    constructor() {
        this.artworkWorker = new artwork_1.ArtworkWorker(this.orm, this.imageModule, this.audioModule);
        this.trackWorker = new track_1.TrackWorker(this.orm, this.imageModule, this.audioModule);
        this.folderWorker = new folder_1.FolderWorker(this.orm, this.imageModule, this.audioModule);
        this.rootWorker = new root_1.RootWorker(this.orm, this.imageModule, this.audioModule);
        this.changes = new changes_1.ChangesWorker(this.orm, this.imageModule, this.audioModule);
    }
    async refreshRoot(parameters) {
        const { root, changes } = await this.changes.start(parameters.rootID);
        await this.rootWorker.scan(root, changes);
        return this.changes.finish(changes, root);
    }
    async updateRoot(parameters) {
        const { root, changes } = await this.changes.start(parameters.rootID);
        await this.rootWorker.update(root, parameters.name, parameters.path, parameters.strategy);
        await this.rootWorker.scan(root, changes);
        return this.changes.finish(changes, root);
    }
    async createRoot(parameters) {
        const root = await this.rootWorker.create(parameters.name, parameters.path, parameters.strategy);
        const { changes } = await this.changes.start(root.id);
        return this.changes.finish(changes, root);
    }
    async removeRoot(parameters) {
        const { root, changes } = await this.changes.start(parameters.rootID);
        await this.rootWorker.remove(root, changes);
        return this.changes.finish(changes, root);
    }
    async deleteFolders(parameters) {
        const { root, changes } = await this.changes.start(parameters.rootID);
        await this.folderWorker.delete(root, parameters.folderIDs, changes);
        return this.changes.finish(changes, root);
    }
    async refreshFolders(parameters) {
        const { root, changes } = await this.changes.start(parameters.rootID);
        await this.folderWorker.refresh(parameters.folderIDs, changes);
        return this.changes.finish(changes, root);
    }
    async createFolder(parameters) {
        const { root, changes } = await this.changes.start(parameters.rootID);
        await this.folderWorker.create(parameters.parentID, parameters.name, root, changes);
        return this.changes.finish(changes, root);
    }
    async moveFolders(parameters) {
        const { root, changes } = await this.changes.start(parameters.rootID);
        await this.folderWorker.move(parameters.newParentID, parameters.folderIDs, changes);
        return this.changes.finish(changes, root);
    }
    async renameFolder(parameters) {
        const { root, changes } = await this.changes.start(parameters.rootID);
        await this.folderWorker.rename(parameters.folderID, parameters.newName, changes);
        return this.changes.finish(changes, root);
    }
    async refreshTracks(parameters) {
        const { root, changes } = await this.changes.start(parameters.rootID);
        await this.trackWorker.refresh(parameters.trackIDs, changes);
        return this.changes.finish(changes, root);
    }
    async removeTracks(parameters) {
        const { root, changes } = await this.changes.start(parameters.rootID);
        await this.trackWorker.remove(root, parameters.trackIDs, changes);
        return this.changes.finish(changes, root);
    }
    async moveTracks(parameters) {
        const { root, changes } = await this.changes.start(parameters.rootID);
        await this.trackWorker.move(parameters.trackIDs, parameters.newParentID, changes);
        return this.changes.finish(changes, root);
    }
    async renameTrack(parameters) {
        const { root, changes } = await this.changes.start(parameters.rootID);
        await this.trackWorker.rename(parameters.trackID, parameters.newName, changes);
        return this.changes.finish(changes, root);
    }
    async fixTracks(parameters) {
        const { root, changes } = await this.changes.start(parameters.rootID);
        await this.trackWorker.fix(parameters.fixes, changes);
        return this.changes.finish(changes, root);
    }
    async writeTrackTags(parameters) {
        const { root, changes } = await this.changes.start(parameters.rootID);
        await this.trackWorker.writeTags(parameters.tags, changes);
        return this.changes.finish(changes, root);
    }
    async renameArtwork(parameters) {
        const { root, changes } = await this.changes.start(parameters.rootID);
        await this.artworkWorker.rename(parameters.artworkID, parameters.newName, changes);
        return this.changes.finish(changes, root);
    }
    async createArtwork(parameters) {
        const { root, changes } = await this.changes.start(parameters.rootID);
        await this.artworkWorker.create(parameters.folderID, parameters.artworkFilename, parameters.types, changes);
        return this.changes.finish(changes, root);
    }
    async moveArtworks(parameters) {
        const { root, changes } = await this.changes.start(parameters.rootID);
        await this.artworkWorker.move(parameters.artworkIDs, parameters.newParentID, changes);
        return this.changes.finish(changes, root);
    }
    async replaceArtwork(parameters) {
        const { root, changes } = await this.changes.start(parameters.rootID);
        await this.artworkWorker.replace(parameters.artworkID, parameters.artworkFilename, changes);
        return this.changes.finish(changes, root);
    }
    async downloadArtwork(parameters) {
        const { root, changes } = await this.changes.start(parameters.rootID);
        await this.artworkWorker.download(parameters.folderID, parameters.artworkURL, parameters.types, changes);
        return this.changes.finish(changes, root);
    }
    async removeArtwork(parameters) {
        const { root, changes } = await this.changes.start(parameters.rootID);
        await this.artworkWorker.remove(root, parameters.artworkID, changes);
        return this.changes.finish(changes, root);
    }
};
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
    __metadata("design:type", orm_service_1.OrmService)
], WorkerService.prototype, "orm", void 0);
__decorate([
    typescript_ioc_1.Inject,
    __metadata("design:type", settings_service_1.SettingsService)
], WorkerService.prototype, "settingsService", void 0);
WorkerService = __decorate([
    typescript_ioc_1.Singleton,
    __metadata("design:paramtypes", [])
], WorkerService);
exports.WorkerService = WorkerService;
//# sourceMappingURL=worker.service.js.map