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
import path from 'node:path';
import { AudioModule } from '../../modules/audio/audio.module.js';
import { TranscoderStream } from '../../modules/audio/transcoder/transcoder-stream.js';
import { fileSuffix } from '../../utils/fs-utils.js';
import { Inject, InRequestScope } from 'typescript-ioc';
import { AudioFormatType, DBObjectType } from '../../types/enums.js';
import { genericError, invalidParameterError } from '../../modules/deco/express/express-error.js';
let StreamService = class StreamService {
    async streamFile(filename, id, sourceFormat, options) {
        let stats;
        try {
            stats = await fse.stat(filename);
        }
        catch {
            stats = undefined;
        }
        if (!stats) {
            return Promise.reject(genericError('File not found'));
        }
        let destinationFormat = options?.format ?? AudioFormatType.mp3;
        if (destinationFormat.startsWith('.')) {
            destinationFormat = destinationFormat.slice(1);
        }
        const bitRate = options?.maxBitRate ?? 0;
        if (destinationFormat !== 'raw' && TranscoderStream.needsTranscoding(sourceFormat ?? fileSuffix(filename), destinationFormat, bitRate)) {
            return this.audioModule.transcoder.get(filename, id, destinationFormat, bitRate);
        }
        return { file: { filename, name: `${id}.${destinationFormat}` } };
    }
    async streamTrack(track, options) {
        const tag = await track.tag.get();
        return await this.streamFile(path.join(track.path, track.fileName), track.id, tag?.mediaFormat, options);
    }
    async streamEpisode(episode, options) {
        const tag = await episode.tag.get();
        if (episode.path && tag?.mediaFormat) {
            return this.streamFile(episode.path, episode.id, tag.mediaFormat, options);
        }
        return Promise.reject(genericError('Podcast episode not ready'));
    }
    async streamDBObject(o, type, options) {
        switch (type) {
            case DBObjectType.track: {
                return this.streamTrack(o, options);
            }
            case DBObjectType.episode: {
                return this.streamEpisode(o, options);
            }
            default:
        }
        return Promise.reject(invalidParameterError('Invalid Object Type for Streaming'));
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