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
import { AudioModule } from '../../modules/audio/audio.module';
import { TranscoderStream } from '../../modules/audio/transcoder/transcoder-stream';
import { fileSuffix } from '../../utils/fs-utils';
import { Inject, InRequestScope } from 'typescript-ioc';
import { GenericError, InvalidParamError } from '../../modules/rest';
import { AudioFormatType, DBObjectType } from '../../types/enums';
let StreamService = class StreamService {
    async streamFile(filename, id, sourceFormat, destFormat, maxBitRate) {
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
        destFormat = destFormat || AudioFormatType.mp3;
        if (destFormat[0] === '.') {
            destFormat = destFormat.slice(1);
        }
        const bitRate = maxBitRate || 0;
        if (destFormat !== 'raw' && TranscoderStream.needsTranscoding(sourceFormat || fileSuffix(filename), destFormat, bitRate)) {
            return this.audioModule.transcoder.get(filename, id, destFormat, bitRate);
        }
        return { file: { filename, name: `${id}.${destFormat}` } };
    }
    async streamTrack(track, format, maxBitRate) {
        const tag = await track.tag.get();
        return await this.streamFile(path.join(track.path, track.fileName), track.id, tag?.mediaFormat, format, maxBitRate);
    }
    async streamEpisode(episode, format, maxBitRate) {
        const tag = await episode.tag.get();
        if (episode.path && tag?.mediaFormat) {
            return this.streamFile(episode.path, episode.id, tag?.mediaFormat, format, maxBitRate);
        }
        return Promise.reject(GenericError('Podcast episode not ready'));
    }
    async streamDBObject(o, type, format, maxBitRate, _user) {
        switch (type) {
            case DBObjectType.track:
                return this.streamTrack(o, format, maxBitRate);
            case DBObjectType.episode:
                return this.streamEpisode(o, format, maxBitRate);
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