var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { ArtworkWorker } from '../worker/tasks/artwork';
import { FolderWorker } from '../worker/tasks/folder';
import { RootWorker } from '../worker/tasks/root';
import { TrackWorker } from '../worker/tasks/track';
import { SettingsService } from '../../../entity/settings/settings.service';
import { AudioModule } from '../../audio/audio.module';
import { ImageModule } from '../../image/image.module';
import { Inject, InRequestScope } from 'typescript-ioc';
import { WorkerCommandsFolder } from './worker/worker.commands.folder';
import { WorkerCommandsArtwork } from './worker/worker.commands.artwork';
import { WorkerCommandsRoot } from './worker/worker.commands.root';
import { WorkerCommandsTrack } from './worker/worker.commands.track';
import { ChangesWorker } from '../worker/changes-worker';
let WorkerService = class WorkerService {
    constructor() {
        this.folder = new WorkerCommandsFolder(this);
        this.artwork = new WorkerCommandsArtwork(this);
        this.root = new WorkerCommandsRoot(this);
        this.track = new WorkerCommandsTrack(this);
    }
};
__decorate([
    Inject,
    __metadata("design:type", ArtworkWorker)
], WorkerService.prototype, "artworkWorker", void 0);
__decorate([
    Inject,
    __metadata("design:type", TrackWorker)
], WorkerService.prototype, "trackWorker", void 0);
__decorate([
    Inject,
    __metadata("design:type", FolderWorker)
], WorkerService.prototype, "folderWorker", void 0);
__decorate([
    Inject,
    __metadata("design:type", RootWorker)
], WorkerService.prototype, "rootWorker", void 0);
__decorate([
    Inject,
    __metadata("design:type", ChangesWorker)
], WorkerService.prototype, "changes", void 0);
__decorate([
    Inject,
    __metadata("design:type", AudioModule)
], WorkerService.prototype, "audioModule", void 0);
__decorate([
    Inject,
    __metadata("design:type", ImageModule)
], WorkerService.prototype, "imageModule", void 0);
__decorate([
    Inject,
    __metadata("design:type", SettingsService)
], WorkerService.prototype, "settingsService", void 0);
WorkerService = __decorate([
    InRequestScope
], WorkerService);
export { WorkerService };
//# sourceMappingURL=worker.service.js.map