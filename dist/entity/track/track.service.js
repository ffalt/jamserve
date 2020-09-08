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
exports.TrackService = void 0;
const path_1 = __importDefault(require("path"));
const audio_module_1 = require("../../modules/audio/audio.module");
const image_module_1 = require("../../modules/image/image.module");
const logger_1 = require("../../utils/logger");
const metadata_1 = require("../../modules/audio/metadata");
const queue_1 = require("../../utils/queue");
const track_rule_1 = require("../health/track.rule");
const typescript_ioc_1 = require("typescript-ioc");
const folder_service_1 = require("../folder/folder.service");
const fs_utils_1 = require("../../utils/fs-utils");
const log = logger_1.logger('TrackService');
let TrackService = class TrackService {
    constructor() {
        this.checker = new track_rule_1.TrackRulesChecker(this.audioModule);
    }
    async getRawTag(track) {
        try {
            const result = await this.audioModule.readRawTag(path_1.default.join(track.path, track.fileName));
            if (!result) {
                const tag = await track.tag.get();
                if (tag) {
                    return metadata_1.trackTagToRawTag(tag);
                }
            }
            return result;
        }
        catch (e) {
            const tag = await track.tag.get();
            return tag ? metadata_1.trackTagToRawTag(tag) : undefined;
        }
    }
    async getImage(orm, track, size, format) {
        const tag = await track.tag.get();
        if (tag === null || tag === void 0 ? void 0 : tag.nrTagImages) {
            const result = await this.imageModule.getExisting(track.id, size, format);
            if (result) {
                return result;
            }
            try {
                const buffer = await this.audioModule.extractTagImage(path_1.default.join(track.path, track.fileName));
                if (buffer) {
                    return await this.imageModule.getBuffer(track.id, buffer, size, format);
                }
            }
            catch (e) {
                log.error('TrackService', 'Extracting image from audio failed: ' + path_1.default.join(track.path, track.fileName));
            }
        }
        const folder = await track.folder.get();
        if (folder) {
            const name = fs_utils_1.basenameStripExt(track.fileName);
            const artworks = await folder.artworks.getItems();
            const artwork = artworks.find(a => a.name.startsWith(name));
            if (artwork) {
                return this.imageModule.get(artwork.id, path_1.default.join(artwork.path, artwork.name), size, format);
            }
            return this.folderService.getImage(orm, folder, size, format);
        }
        return;
    }
    async health(tracks, media) {
        const result = [];
        await queue_1.processQueue(3, tracks, async (track) => {
            const health = await this.checker.run(track, !!media);
            if (health && health.length > 0) {
                result.push({ track, health });
            }
        });
        return result;
    }
};
__decorate([
    typescript_ioc_1.Inject,
    __metadata("design:type", audio_module_1.AudioModule)
], TrackService.prototype, "audioModule", void 0);
__decorate([
    typescript_ioc_1.Inject,
    __metadata("design:type", image_module_1.ImageModule)
], TrackService.prototype, "imageModule", void 0);
__decorate([
    typescript_ioc_1.Inject,
    __metadata("design:type", folder_service_1.FolderService)
], TrackService.prototype, "folderService", void 0);
TrackService = __decorate([
    typescript_ioc_1.InRequestScope,
    __metadata("design:paramtypes", [])
], TrackService);
exports.TrackService = TrackService;
//# sourceMappingURL=track.service.js.map