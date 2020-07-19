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
const log = logger_1.logger('TrackService');
let TrackService = class TrackService {
    constructor() {
        this.checker = new track_rule_1.TrackRulesChecker(this.audioModule);
    }
    async getRawTag(track) {
        try {
            const result = await this.audioModule.readRawTag(path_1.default.join(track.path, track.fileName));
            if (!result && track.tag) {
                return metadata_1.trackTagToRawTag(track.tag);
            }
            return result;
        }
        catch (e) {
            return track.tag ? metadata_1.trackTagToRawTag(track.tag) : undefined;
        }
    }
    defaultCompare(a, b) {
        var _a, _b, _c, _d;
        let res = a.path.localeCompare(b.path);
        if (res !== 0) {
            return res;
        }
        if (((_a = a.tag) === null || _a === void 0 ? void 0 : _a.disc) !== undefined && ((_b = b.tag) === null || _b === void 0 ? void 0 : _b.disc) !== undefined) {
            res = a.tag.disc - b.tag.disc;
            if (res !== 0) {
                return res;
            }
        }
        if (((_c = a.tag) === null || _c === void 0 ? void 0 : _c.trackNr) !== undefined && ((_d = b.tag) === null || _d === void 0 ? void 0 : _d.trackNr) !== undefined) {
            res = a.tag.trackNr - b.tag.trackNr;
            if (res !== 0) {
                return res;
            }
        }
        return a.name.localeCompare(b.name);
    }
    defaultSort(tracks) {
        return tracks.sort((a, b) => this.defaultCompare(a, b));
    }
    async getImage(track, size, format) {
        if (track.tag && track.tag.nrTagImages) {
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
        if (track.folder) {
            return this.folderService.getImage(track.folder, size, format);
        }
    }
    async health(list, media) {
        const tracks = this.defaultSort(list);
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
    typescript_ioc_1.Singleton,
    __metadata("design:paramtypes", [])
], TrackService);
exports.TrackService = TrackService;
//# sourceMappingURL=track.service.js.map