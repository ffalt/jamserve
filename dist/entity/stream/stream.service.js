var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import fse from 'fs-extra';
import path from 'path';
import { AudioModule } from '../../modules/audio/audio.module.js';
import { TranscoderStream } from '../../modules/audio/transcoder/transcoder-stream.js';
import { fileSuffix } from '../../utils/fs-utils.js';
import { Inject, InRequestScope } from 'typescript-ioc';
import { AudioFormatType, DBObjectType } from '../../types/enums.js';
import { GenericError, InvalidParamError } from '../../modules/deco/express/express-error.js';
let StreamService = class StreamService {
    async streamFile(filename, id, sourceFormat, opts) {
        let stats;
        try {
            stats = await fse.stat(filename);
        }
        catch {
            stats = undefined;
        }
        if (!stats) {
            return Promise.reject(GenericError('File not found'));
        }
        let destFormat = opts?.format || AudioFormatType.mp3;
        if (destFormat[0] === '.') {
            destFormat = destFormat.slice(1);
        }
        const bitRate = opts?.maxBitRate || 0;
        if (destFormat !== 'raw' && TranscoderStream.needsTranscoding(sourceFormat || fileSuffix(filename), destFormat, bitRate)) {
            return this.audioModule.transcoder.get(filename, id, destFormat, bitRate);
        }
        return { file: { filename, name: `${id}.${destFormat}` } };
    }
    async streamTrack(track, opts) {
        const tag = await track.tag.get();
        return await this.streamFile(path.join(track.path, track.fileName), track.id, tag?.mediaFormat, opts);
    }
    async streamEpisode(episode, opts) {
        const tag = await episode.tag.get();
        if (episode.path && tag?.mediaFormat) {
            return this.streamFile(episode.path, episode.id, tag?.mediaFormat, opts);
        }
        return Promise.reject(GenericError('Podcast episode not ready'));
    }
    async streamDBObject(o, type, opts) {
        switch (type) {
            case DBObjectType.track:
                return this.streamTrack(o, opts);
            case DBObjectType.episode:
                return this.streamEpisode(o, opts);
            default:
        }
        return Promise.reject(InvalidParamError('Invalid Object Type for Streaming'));
    }
};
__decorate([
    Inject,
    __metadata("design:type", AudioModule)
], StreamService.prototype, "audioModule", void 0);
StreamService = __decorate([
    InRequestScope
], StreamService);
export { StreamService };
//# sourceMappingURL=stream.service.js.map