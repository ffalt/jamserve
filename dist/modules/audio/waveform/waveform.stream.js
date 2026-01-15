import ffmpeg from '../tools/ffmpeg.js';
import { PassThrough, Transform } from 'node:stream';
import { logger } from '../../../utils/logger.js';
import { errorStringCode } from '../../../utils/error.js';
const log = logger('waveform.stream');
export class WaveformStream extends Transform {
    constructor(atSamplesPerPixel, atSampleRate) {
        super({ writableObjectMode: false, readableObjectMode: true, highWaterMark: 1024 });
        this._buffer = new PassThrough();
        this._out = new PassThrough();
        this._started = false;
        this._min = null;
        this._max = null;
        this._samples = 0;
        this._total = 0;
        this._samplesPerPixel = atSamplesPerPixel ?? 256;
        this._sampleRate = atSampleRate ?? 44100;
        const options = {
            source: this._buffer
        };
        this._ffmpeg = ffmpeg(options).addOptions(['-f s16le', '-ac 1', '-acodec pcm_s16le', `-ar ${this._sampleRate}`]);
        this._ffmpeg.on('start', (cmd) => {
            log.debug(`ffmpeg started with ${cmd}`);
            this._started = true;
            return this.emit('_started');
        });
        let errored = false;
        this._ffmpeg.on('error', (error) => {
            const code = errorStringCode(error);
            if (code === 'ENOENT') {
                errored = true;
                log.debug('ffmpeg failed to start.');
                return this.emit('done', 'ffmpeg failed to start');
            }
            errored = true;
            const message = errorStringCode(error);
            log.debug(`ffmpeg decoding error: ${message}`);
            return this.emit('done', `ffmpeg decoding error: ${message}`);
        });
        this._ffmpeg.on('end', () => {
            if (!errored) {
                return this.emit('done');
            }
            return;
        });
        this._ffmpeg.writeToStream(this._out);
        this._out.on('readable', () => {
            this.start();
        });
    }
    start() {
        let data = this._out.read();
        while (data && data.length > 0) {
            this.readResults(data.readInt16LE(0), 2, data);
            data = this._out.read();
        }
    }
    readResults(value, pos, data) {
        const dataLength = data.length;
        while (pos <= dataLength) {
            this._min = this._min === null ? value : Math.min(this._min, value);
            this._max = this._max === null ? value : Math.max(this._max, value);
            this._samples += 1;
            if (this._samples === this._samplesPerPixel) {
                this.push([Math.round(this._min), Math.round(this._max)]);
                this._min = null;
                this._max = null;
                this._samples = 0;
            }
            if (pos >= dataLength) {
                break;
            }
            value = data.readInt16LE(pos);
            pos += 2;
        }
    }
    _transform(chunk, encoding, callback) {
        this._total += chunk.length;
        if (this._started) {
            this._buffer.write(chunk, encoding, callback);
        }
        else {
            this.once('_started', () => {
                this._buffer.write(chunk, encoding, callback);
            });
        }
    }
    _flush(callback) {
        this._buffer.end();
        this._out.once('end', () => {
            if (this._samples > 0) {
                this.push([this._min, this._max]);
            }
            callback();
        });
    }
}
//# sourceMappingURL=waveform.stream.js.map