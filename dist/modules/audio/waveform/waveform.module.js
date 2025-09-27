import { IDFolderCache } from '../../../utils/id-file-cache.js';
import { WaveformGenerator } from './waveform.generator.js';
import fse from 'fs-extra';
import { logger } from '../../../utils/logger.js';
import { WaveformFormatType } from '../../../types/enums.js';
const log = logger('Audio:Waveform');
export class WaveformModule {
    constructor(waveformCachePath) {
        this.waveformCache = new IDFolderCache(waveformCachePath, 'waveform', (parameters) => {
            let suffix = '';
            if (parameters.width !== undefined) {
                suffix = `-${parameters.width}`;
            }
            return `${suffix}.${parameters.format}`;
        });
    }
    static async generateWaveform(filename, format, width) {
        const wf = new WaveformGenerator();
        switch (format) {
            case WaveformFormatType.svg: {
                return { buffer: { buffer: Buffer.from(await wf.svg(filename, width), 'ascii'), contentType: 'image/svg+xml' } };
            }
            case WaveformFormatType.json: {
                return { json: await wf.json(filename) };
            }
            case WaveformFormatType.dat: {
                return { buffer: { buffer: await wf.binary(filename), contentType: 'application/binary' } };
            }
            default:
        }
        return Promise.reject(new Error('Invalid Format for Waveform generation'));
    }
    async get(id, filename, format, width) {
        if (!filename || !(await fse.pathExists(filename))) {
            return Promise.reject(new Error('Invalid filename for waveform generation'));
        }
        return this.waveformCache.get(id, { format, width }, async (cacheFilename) => {
            const result = await WaveformModule.generateWaveform(filename, format, width);
            log.debug('Writing cache file', cacheFilename);
            if (result.buffer) {
                await fse.writeFile(cacheFilename, result.buffer.buffer);
            }
            else if (result.json) {
                await fse.writeFile(cacheFilename, JSON.stringify(result.json));
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
//# sourceMappingURL=waveform.module.js.map