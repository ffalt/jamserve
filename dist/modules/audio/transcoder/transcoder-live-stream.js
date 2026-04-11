import { logger } from '../../../utils/logger.js';
import { TranscoderStream } from './transcoder-stream.js';
const log = logger('audio.transcoder.live');
export class LiveTranscoderStream extends TranscoderStream {
    constructor(filename, format, maxBitRate, timeOffset) {
        super();
        this.filename = filename;
        this.format = format;
        this.maxBitRate = maxBitRate;
        this.timeOffset = timeOffset;
        if (maxBitRate <= 0) {
            this.maxBitRate = 128;
        }
    }
    pipe(stream) {
        log.info('Start transcode streaming', this.format, this.maxBitRate.toString());
        stream.contentType(this.format);
        const proc = TranscoderStream.getTranscodeProc(this.filename, this.format, this.maxBitRate, this.timeOffset);
        proc
            .on('end', () => {
            log.debug('file has been transcoded successfully');
        })
            .on('error', (error) => {
            log.error(error);
        })
            .writeToStream(stream, { end: true });
    }
}
//# sourceMappingURL=transcoder-live-stream.js.map