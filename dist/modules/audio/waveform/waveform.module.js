"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WaveformModule = void 0;
const id_file_cache_1 = require("../../../utils/id-file-cache");
const waveform_generator_1 = require("./waveform.generator");
const fs_extra_1 = __importDefault(require("fs-extra"));
const logger_1 = require("../../../utils/logger");
const enums_1 = require("../../../types/enums");
const log = logger_1.logger('Audio:Waveform');
class WaveformModule {
    constructor(waveformCachePath) {
        this.waveformCache = new id_file_cache_1.IDFolderCache(waveformCachePath, 'waveform', (params) => {
            return `${params.width !== undefined ? `-${params.width}` : ''}.${params.format}`;
        });
    }
    async generateWaveform(filename, format, width) {
        const wf = new waveform_generator_1.WaveformGenerator();
        switch (format) {
            case enums_1.WaveformFormatType.svg:
                return { buffer: { buffer: Buffer.from(await wf.svg(filename, width), 'ascii'), contentType: 'image/svg+xml' } };
            case enums_1.WaveformFormatType.json:
                return { json: await wf.json(filename) };
            case enums_1.WaveformFormatType.dat:
                return { buffer: { buffer: await wf.binary(filename), contentType: 'application/binary' } };
            default:
        }
        return Promise.reject(Error('Invalid Format for Waveform generation'));
    }
    async get(id, filename, format, width) {
        if (!filename || !(await fs_extra_1.default.pathExists(filename))) {
            return Promise.reject(Error('Invalid filename for waveform generation'));
        }
        return this.waveformCache.get(id, { format, width }, async (cacheFilename) => {
            const result = await this.generateWaveform(filename, format, width);
            log.debug('Writing cache file', cacheFilename);
            if (result.buffer) {
                await fs_extra_1.default.writeFile(cacheFilename, result.buffer.buffer);
            }
            else if (result.json) {
                await fs_extra_1.default.writeFile(cacheFilename, JSON.stringify(result.json));
            }
            else {
                throw new Error('Invalid waveform generation result');
            }
        });
    }
    async clearCacheByIDs(ids) {
        await this.waveformCache.removeByIDs(ids);
    }
}
exports.WaveformModule = WaveformModule;
//# sourceMappingURL=waveform.module.js.map