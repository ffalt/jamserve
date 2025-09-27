import { WaveformStream } from './waveform.stream.js';
export class Waveform {
    constructor(stream, options) {
        this.stream = stream;
        this.options = { samplesPerPixel: 256, sampleRate: 44100 };
        this.samples = [];
        this.options = { ...this.options, ...options };
    }
    run(callback) {
        const ws = new WaveformStream(this.options.samplesPerPixel, this.options.sampleRate);
        ws.on('readable', () => {
            let px = ws.read();
            while (px && px.length > 0) {
                this.samples.push(px.at(0), px.at(1));
                px = ws.read();
            }
        });
        ws.on('done', (error) => {
            callback(error);
        });
        this.stream.pipe(ws);
    }
    asBinaryV1() {
        const result = Buffer.alloc((this.samples.length * 2) + 20);
        result.writeInt32LE(1, 0);
        result.writeUInt32LE(0, 4);
        result.writeInt32LE(this.options.sampleRate, 8);
        result.writeInt32LE(this.options.samplesPerPixel, 12);
        result.writeInt32LE(this.samples.length / 2, 16);
        let pos = 20;
        for (const sample of this.samples) {
            result.writeInt16LE(sample, pos);
            pos += 2;
        }
        return result;
    }
    asBinary() {
        const result = Buffer.alloc((this.samples.length * 2) + 24);
        result.writeInt32LE(2, 0);
        result.writeUInt32LE(0, 4);
        result.writeInt32LE(this.options.sampleRate, 8);
        result.writeInt32LE(this.options.samplesPerPixel, 12);
        result.writeInt32LE(this.samples.length / 2, 16);
        result.writeInt32LE(2, 20);
        let pos = 24;
        for (const sample of this.samples) {
            result.writeInt16LE(sample, pos);
            pos += 2;
        }
        return result;
    }
    asJSON() {
        return {
            version: 2,
            channels: 1,
            sample_rate: this.options.sampleRate,
            samples_per_pixel: this.options.samplesPerPixel,
            bits: 16,
            length: this.samples.length / 2,
            data: this.samples
        };
    }
}
//# sourceMappingURL=waveform.class.js.map