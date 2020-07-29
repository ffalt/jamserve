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
exports.StreamService = void 0;
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const audio_module_1 = require("../../modules/audio/audio.module");
const transcoder_stream_1 = require("../../modules/audio/transcoder/transcoder-stream");
const fs_utils_1 = require("../../utils/fs-utils");
const typescript_ioc_1 = require("typescript-ioc");
const enums_1 = require("../../types/enums");
const express_error_1 = require("../../modules/rest/builder/express-error");
let StreamService = class StreamService {
    async streamFile(filename, id, sourceFormat, destFormat, maxBitRate) {
        let stats;
        try {
            stats = await fs_extra_1.default.stat(filename);
        }
        catch (e) {
            stats = undefined;
        }
        if (!stats) {
            return Promise.reject(Error('File not found'));
        }
        destFormat = destFormat || enums_1.AudioFormatType.mp3;
        if (destFormat[0] === '.') {
            destFormat = destFormat.slice(1);
        }
        const bitRate = maxBitRate || 0;
        if (destFormat !== 'raw' && transcoder_stream_1.TranscoderStream.needsTranscoding(sourceFormat || fs_utils_1.fileSuffix(filename), destFormat, bitRate)) {
            return this.audioModule.transcoder.get(filename, id, destFormat, bitRate);
        }
        return { file: { filename, name: `${id}.${destFormat}` } };
    }
    async streamTrack(track, format, maxBitRate, user) {
        const tag = await track.tag.get();
        return await this.streamFile(path_1.default.join(track.path, track.fileName), track.id, tag === null || tag === void 0 ? void 0 : tag.mediaFormat, format, maxBitRate);
    }
    async streamEpisode(episode, format, maxBitRate, user) {
        const tag = await episode.tag.get();
        if (episode.path && (tag === null || tag === void 0 ? void 0 : tag.mediaFormat)) {
            return this.streamFile(episode.path, episode.id, tag === null || tag === void 0 ? void 0 : tag.mediaFormat, format, maxBitRate);
        }
        return Promise.reject(express_error_1.GenericError('Podcast episode not ready'));
    }
    async streamDBObject(o, type, format, maxBitRate, user) {
        switch (type) {
            case enums_1.DBObjectType.track:
                return this.streamTrack(o, format, maxBitRate, user);
            case enums_1.DBObjectType.episode:
                return this.streamEpisode(o, format, maxBitRate, user);
            default:
        }
        return Promise.reject(Error('Invalid Object Type for Streaming'));
    }
};
__decorate([
    typescript_ioc_1.Inject,
    __metadata("design:type", audio_module_1.AudioModule)
], StreamService.prototype, "audioModule", void 0);
StreamService = __decorate([
    typescript_ioc_1.InRequestScope
], StreamService);
exports.StreamService = StreamService;
//# sourceMappingURL=stream.service.js.map