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
exports.WaveformService = exports.WaveformDefaultFormat = void 0;
const path_1 = __importDefault(require("path"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const audio_module_1 = require("../../modules/audio/audio.module");
const enums_1 = require("../../types/enums");
const typescript_ioc_1 = require("typescript-ioc");
const logger_1 = require("../../utils/logger");
const builder_1 = require("../../modules/rest/builder");
const log = logger_1.logger('Waveform');
exports.WaveformDefaultFormat = enums_1.WaveformFormatType.svg;
let WaveformService = class WaveformService {
    async getWaveform(obj, objType, format, width) {
        format = (format || exports.WaveformDefaultFormat);
        switch (objType) {
            case enums_1.DBObjectType.track:
                return this.getTrackWaveform(obj, format, width);
            case enums_1.DBObjectType.episode:
                return this.getEpisodeWaveform(obj, format, width);
            default:
        }
        return Promise.reject(builder_1.InvalidParamError('Invalid Object Type for Waveform generation'));
    }
    async getWaveformSVG(obj, objType, width) {
        const result = await this.getWaveform(obj, objType, enums_1.WaveformFormatType.svg, width);
        if (result) {
            if (result.buffer) {
                return result.buffer.buffer.toString();
            }
            if (result.file) {
                try {
                    return (await fs_extra_1.default.readFile(result.file.filename)).toString();
                }
                catch (e) {
                    log.error(e);
                    return Promise.reject(builder_1.GenericError('Invalid waveform result'));
                }
            }
            return Promise.reject(builder_1.GenericError('Invalid svg waveform result'));
        }
        return;
    }
    async getWaveformJSON(obj, objType) {
        const result = await this.getWaveform(obj, objType, enums_1.WaveformFormatType.json);
        if (result) {
            if (result.json) {
                return result.json;
            }
            if (result.buffer) {
                return JSON.parse(result.buffer.buffer.toString());
            }
            if (result.file) {
                try {
                    return await fs_extra_1.default.readJSON(result.file.filename);
                }
                catch (e) {
                    log.error(e);
                    return Promise.reject(builder_1.GenericError('Invalid json waveform result'));
                }
            }
            return Promise.reject(builder_1.GenericError('Invalid waveform result'));
        }
        return;
    }
    async getTrackWaveform(track, format, width) {
        return this.audioModule.waveform.get(track.id, path_1.default.join(track.path, track.fileName), format, width);
    }
    async getEpisodeWaveform(episode, format, width) {
        if (episode.path && episode.path) {
            return this.audioModule.waveform.get(episode.id, episode.path, format, width);
        }
        return Promise.reject(builder_1.GenericError('Podcast episode not ready'));
    }
};
__decorate([
    typescript_ioc_1.Inject,
    __metadata("design:type", audio_module_1.AudioModule)
], WaveformService.prototype, "audioModule", void 0);
WaveformService = __decorate([
    typescript_ioc_1.InRequestScope
], WaveformService);
exports.WaveformService = WaveformService;
//# sourceMappingURL=waveform.service.js.map