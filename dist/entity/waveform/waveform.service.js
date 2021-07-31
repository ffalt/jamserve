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
import fse from 'fs-extra';
import { AudioModule } from '../../modules/audio/audio.module';
import { DBObjectType, WaveformFormatType } from '../../types/enums';
import { Inject, InRequestScope } from 'typescript-ioc';
import { logger } from '../../utils/logger';
import { GenericError, InvalidParamError } from '../../modules/rest/builder';
const log = logger('Waveform');
export const WaveformDefaultFormat = WaveformFormatType.svg;
let WaveformService = class WaveformService {
    async getWaveform(obj, objType, format, width) {
        format = (format || WaveformDefaultFormat);
        switch (objType) {
            case DBObjectType.track:
                return this.getTrackWaveform(obj, format, width);
            case DBObjectType.episode:
                return this.getEpisodeWaveform(obj, format, width);
            default:
        }
        return Promise.reject(InvalidParamError('Invalid Object Type for Waveform generation'));
    }
    async getWaveformSVG(obj, objType, width) {
        const result = await this.getWaveform(obj, objType, WaveformFormatType.svg, width);
        if (result) {
            if (result.buffer) {
                return result.buffer.buffer.toString();
            }
            if (result.file) {
                try {
                    return (await fse.readFile(result.file.filename)).toString();
                }
                catch (e) {
                    log.error(e);
                    return Promise.reject(GenericError('Invalid waveform result'));
                }
            }
            return Promise.reject(GenericError('Invalid svg waveform result'));
        }
        return;
    }
    async getWaveformJSON(obj, objType) {
        const result = await this.getWaveform(obj, objType, WaveformFormatType.json);
        if (result) {
            if (result.json) {
                return result.json;
            }
            if (result.buffer) {
                return JSON.parse(result.buffer.buffer.toString());
            }
            if (result.file) {
                try {
                    return await fse.readJSON(result.file.filename);
                }
                catch (e) {
                    log.error(e);
                    return Promise.reject(GenericError('Invalid json waveform result'));
                }
            }
            return Promise.reject(GenericError('Invalid waveform result'));
        }
        return;
    }
    async getTrackWaveform(track, format, width) {
        return this.audioModule.waveform.get(track.id, path.join(track.path, track.fileName), format, width);
    }
    async getEpisodeWaveform(episode, format, width) {
        if (episode.path && episode.path) {
            return this.audioModule.waveform.get(episode.id, episode.path, format, width);
        }
        return Promise.reject(GenericError('Podcast episode not ready'));
    }
};
__decorate([
    Inject,
    __metadata("design:type", AudioModule)
], WaveformService.prototype, "audioModule", void 0);
WaveformService = __decorate([
    InRequestScope
], WaveformService);
export { WaveformService };
//# sourceMappingURL=waveform.service.js.map