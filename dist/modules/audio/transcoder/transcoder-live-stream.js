import { logger } from '../../../utils/logger.js';
import { TranscoderStream } from './transcoder-stream.js';
const log = logger('audio.transcoder.live');
export class LiveTranscoderStream extends TranscoderStream {
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
        const proc = TranscoderStream.getTranscodeProc(this.filename, this.format, this.maxBitRate);
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
//# sourceMappingURL=transcoder-live-stream.js.map