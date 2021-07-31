var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import path from 'path';
import { AudioModule } from '../../modules/audio/audio.module';
import { ImageModule } from '../../modules/image/image.module';
import { logger } from '../../utils/logger';
import { trackTagToRawTag } from '../../modules/audio/metadata';
import { processQueue } from '../../utils/queue';
import { TrackRulesChecker } from '../health/track.rule';
import { Inject, InRequestScope } from 'typescript-ioc';
import { FolderService } from '../folder/folder.service';
import { basenameStripExt } from '../../utils/fs-utils';
const log = logger('TrackService');
let TrackService = class TrackService {
    constructor() {
        this.checker = new TrackRulesChecker(this.audioModule);
    }
    async getRawTag(track) {
        try {
            const result = await this.audioModule.readRawTag(path.join(track.path, track.fileName));
            if (!result) {
                const tag = await track.tag.get();
                if (tag) {
                    return trackTagToRawTag(tag);
                }
            }
            return result;
        }
        catch (e) {
            const tag = await track.tag.get();
            return tag ? trackTagToRawTag(tag) : undefined;
        }
    }
    async getImage(orm, track, size, format) {
        const tag = await track.tag.get();
        if (tag?.nrTagImages) {
            const result = await this.imageModule.getExisting(track.id, size, format);
            if (result) {
                return result;
            }
            try {
                const buffer = await this.audioModule.extractTagImage(path.join(track.path, track.fileName));
                if (buffer) {
                    return await this.imageModule.getBuffer(track.id, buffer, size, format);
                }
            }
            catch (e) {
                log.error('TrackService', 'Extracting image from audio failed: ' + path.join(track.path, track.fileName));
            }
        }
        const folder = await track.folder.get();
        if (folder) {
            const name = basenameStripExt(track.fileName);
            const artworks = await folder.artworks.getItems();
            const artwork = artworks.find(a => a.name.startsWith(name));
            if (artwork) {
                return this.imageModule.get(artwork.id, path.join(artwork.path, artwork.name), size, format);
            }
            return this.folderService.getImage(orm, folder, size, format);
        }
        return;
    }
    async health(tracks, media) {
        const result = [];
        await processQueue(3, tracks, async (track) => {
            const health = await this.checker.run(track, !!media);
            if (health && health.length > 0) {
                result.push({ track, health });
            }
        });
        return result;
    }
};
__decorate([
    Inject,
    __metadata("design:type", AudioModule)
], TrackService.prototype, "audioModule", void 0);
__decorate([
    Inject,
    __metadata("design:type", ImageModule)
], TrackService.prototype, "imageModule", void 0);
__decorate([
    Inject,
    __metadata("design:type", FolderService)
], TrackService.prototype, "folderService", void 0);
TrackService = __decorate([
    InRequestScope,
    __metadata("design:paramtypes", [])
], TrackService);
export { TrackService };
//# sourceMappingURL=track.service.js.map