"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TranscoderModule = void 0;
const transcoder_stream_1 = require("./transcoder-stream");
const id_file_cache_1 = require("../../../utils/id-file-cache");
const logger_1 = require("../../../utils/logger");
const log = logger_1.logger('Audio:Transcoder');
class TranscoderModule {
    constructor(transcodeCachePath) {
        this.transcodeCache = new id_file_cache_1.IDFolderCache(transcodeCachePath, 'transcode', (params) => `${params.maxBitRate ? `-${params.maxBitRate}` : ''}.${params.format}`);
    }
    async get(filename, id, format, maxBitRate) {
        if (!transcoder_stream_1.TranscoderStream.validTranscoding(format)) {
            return Promise.reject(Error('Unsupported transcoding format'));
        }
        return this.transcodeCache.get(id, { format, maxBitRate }, async (cacheFilename) => {
            log.debug('Writing transcode cache file', cacheFilename);
            await transcoder_stream_1.TranscoderStream.transcodeToFile(filename, cacheFilename, format, maxBitRate);
        });
    }
    async clearCacheByIDs(ids) {
        await this.transcodeCache.removeByIDs(ids);
    }
}
exports.TranscoderModule = TranscoderModule;
//# sourceMappingURL=transcoder.module.js.map