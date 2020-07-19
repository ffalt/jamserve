"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LiveTranscoderStream = void 0;
const logger_1 = require("../../../utils/logger");
const transcoder_stream_1 = require("./transcoder-stream");
const log = logger_1.logger('audio.transcoder.live');
class LiveTranscoderStream extends transcoder_stream_1.TranscoderStream {
    constructor(filename, format, maxBitRate) {
        super();
        this.filename = filename;
        this.format = format;
        this.maxBitRate = maxBitRate;
        if (maxBitRate <= 0) {
            this.maxBitRate = 128;
        }
    }
    pipe(stream) {
        log.info('Start transcode streaming', this.format, this.maxBitRate);
        stream.contentType(this.format);
        const proc = transcoder_stream_1.TranscoderStream.getTranscodeProc(this.filename, this.format, this.maxBitRate);
        proc
            .on('end', () => {
            log.debug('file has been transcoded successfully');
        })
            .on('error', (err) => {
            log.error(`an error happened while transcoding: ${err.message}`);
        })
            .writeToStream(stream, { end: true });
    }
}
exports.LiveTranscoderStream = LiveTranscoderStream;
//# sourceMappingURL=transcoder-live-stream.js.map