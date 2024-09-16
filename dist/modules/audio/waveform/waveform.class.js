import { WaveformStream } from './waveform.stream.js';
export class Waveform {
    constructor(stream, opts) {
        this.stream = stream;
        this.opts = { samplesPerPixel: 256, sampleRate: 44100 };
        this.samples = [];
        this.opts = { ...this.opts, ...(opts || {}) };
    }
    run(cb) {
        const ws = new WaveformStream(this.opts.samplesPerPixel, this.opts.sampleRate);
        ws.on('readable', () => {
            let px = ws.read();
            while (px && px.length > 0) {
                this.samples.push(px[0]);
                this.samples.push(px[1]);
                px = ws.read();
            }
        });
        ws.on('done', err => {
            cb(err);
        });
        this.stream.pipe(ws);
    }
    asBinaryV1() {
        const result = Buffer.alloc((this.samples.length * 2) + 20);
        result.writeInt32LE(1, 0);
        result.writeUInt32LE(0, 4);
        result.writeInt32LE(this.opts.sampleRate, 8);
        result.writeInt32LE(this.opts.samplesPerPixel, 12);
        result.writeInt32LE(this.samples.length / 2, 16);
        let pos = 20;
        this.samples.forEach(num => {
            result.writeInt16LE(num, pos);
            pos += 2;
        });
        return result;
    }
    asBinary() {
        const result = Buffer.alloc((this.samples.length * 2) + 24);
        result.writeInt32LE(2, 0);
        result.writeUInt32LE(0, 4);
        result.writeInt32LE(this.opts.sampleRate, 8);
        result.writeInt32LE(this.opts.samplesPerPixel, 12);
        result.writeInt32LE(this.samples.length / 2, 16);
        result.writeInt32LE(2, 20);
        let pos = 24;
        this.samples.forEach(num => {
            result.writeInt16LE(num, pos);
            pos += 2;
        });
        return result;
    }
    asJSON() {
        return {
            version: 2,
            channels: 1,
            sample_rate: this.opts.sampleRate,
            samples_per_pixel: this.opts.samplesPerPixel,
            bits: 16,
            length: this.samples.length / 2,
            data: this.samples
        };
    }
}
//# sourceMappingURL=waveform.class.js.map