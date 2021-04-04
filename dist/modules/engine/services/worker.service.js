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
const worker_commands_folder_1 = require("./worker/worker.commands.folder");
const worker_commands_artwork_1 = require("./worker/worker.commands.artwork");
const worker_commands_root_1 = require("./worker/worker.commands.root");
const worker_commands_track_1 = require("./worker/worker.commands.track");
let WorkerService = class WorkerService {
    constructor() {
        this.folder = new worker_commands_folder_1.WorkerCommandsFolder(this);
        this.artwork = new worker_commands_artwork_1.WorkerCommandsArtwork(this);
        this.root = new worker_commands_root_1.WorkerCommandsRoot(this);
        this.track = new worker_commands_track_1.WorkerCommandsTrack(this);
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