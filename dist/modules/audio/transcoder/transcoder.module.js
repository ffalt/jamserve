import { TranscoderStream } from './transcoder-stream.js';
import { LiveTranscoderStream } from './transcoder-live-stream.js';
import { IDFolderCache } from '../../../utils/id-file-cache.js';
import { logger } from '../../../utils/logger.js';
const log = logger('Audio:Transcoder');
export class TranscoderModule {
    constructor(transcodeCachePath) {
        this.transcodeCache = new IDFolderCache(transcodeCachePath, 'transcode', (parameters) => {
            let suffix = '';
            if (parameters.maxBitRate) {
                suffix = `-${parameters.maxBitRate}`;
            }
            return `${suffix}.${parameters.format}`;
        });
    }
    async get(filename, id, format, maxBitRate) {
        if (!TranscoderStream.validTranscoding(format)) {
            return Promise.reject(new Error('Unsupported transcoding format'));
        }
        return this.transcodeCache.get(id, { format, maxBitRate }, async (cacheFilename) => {
            log.debug('Writing transcode cache file', cacheFilename);
            await TranscoderStream.transcodeToFile(filename, cacheFilename, format, maxBitRate);
        });
    }
    getLive(filename, format, maxBitRate, timeOffset) {
        return new LiveTranscoderStream(filename, format, maxBitRate, timeOffset);
    }
    async clearCacheByIDs(ids) {
        await this.transcodeCache.removeByIDs(ids);
    }
}
//# sourceMappingURL=transcoder.module.js.map