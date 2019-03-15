import SVGO from 'svgo';
import fs from 'fs';
import {PassThrough, Readable, Stream, Transform, TransformCallback} from 'stream';
import Logger from '../../../utils/logger';
import Ffmpeg from 'fluent-ffmpeg';

// import WaveformData from 'waveform-data';
const WaveformData = require('waveform-data');

const log = Logger('Waveform');

export interface IWaveformData {
	version: number;
	sample_rate: number;
	samples_per_pixel: number;
	bits: number;
	length: number;
	data: Array<number>;
}

/**
 class WaveformStream & class Waveform

 based on https://github.com/StreamMachine/sm-waveform
 MIT: https://github.com/StreamMachine/sm-waveform/blob/master/LICENSE

 */

class WaveformStream extends Transform {
	_buf = new PassThrough;
	_out = new PassThrough;
	_ffmpeg: Ffmpeg.FfmpegCommand;
	_sampleRate: number;
	_samplesPerPixel: number;
	_started = false;
	_min: number | null = null;
	_max: number | null = null;
	_samples = 0;
	_total = 0;

	constructor(_at__samplesPerPixel?: number, _at__sampleRate?: number) {
		super({writableObjectMode: false, readableObjectMode: true, highWaterMark: 1024});
		this._samplesPerPixel = _at__samplesPerPixel != null ? _at__samplesPerPixel : 256;
		this._sampleRate = _at__sampleRate != null ? _at__sampleRate : 44100;
		const options: Ffmpeg.FfmpegCommandOptions = {
			source: <Readable>this._buf
		};
		this._ffmpeg = Ffmpeg(options).addOptions(['-f s16le', '-ac 1', '-acodec pcm_s16le', '-ar ' + this._sampleRate]);
		this._ffmpeg.on('start', (cmd: string) => {
			log.debug('ffmpeg started with ' + cmd);
			this._started = true;
			return this.emit('_started');
		});
		let errored = false;
		this._ffmpeg.on('error', (err: any) => {
			if (err.code === 'ENOENT') {
				errored = true;
				log.debug('ffmpeg failed to start.');
				return this.emit('done', 'ffmpeg failed to start');
			} else {
				errored = true;
				log.debug('ffmpeg decoding error: ' + err);
				return this.emit('done', 'ffmpeg decoding error: ' + err);
			}
		});
		this._ffmpeg.on('end', () => {
			if (!errored) {
				return this.emit('done');
			}
		});
		this._ffmpeg.writeToStream(this._out);
		this._out.on('readable', () => this.start());
	}

	start() {
		let oddByte: number | null = null;
		let i: number;
		let value: number;
		let data: Buffer | undefined = this._out.read();
		while (data && data.length > 0) {
			i = 0;
			if (oddByte != null) {
				value = ((data.readInt8(0) << 8) | oddByte);
				oddByte = null;
				i = 1;
			} else {
				value = data.readInt16LE(0);
				i = 2;
			}
			this.readResults(value, i, data);
			data = this._out.read();
		}
	}

	readResults(value: number, pos: number, data: Buffer) {
		const dataLen = data.length;
		while (true) {
			this._min = this._min === null ? value : Math.min(this._min, value);
			this._max = this._max === null ? value : Math.max(this._max, value);
			this._samples += 1;
			if (this._samples === this._samplesPerPixel) {
				this.push([Math.round(this._min), Math.round(this._max)]);
				this._min = null;
				this._max = null;
				this._samples = 0;
			}
			if (pos >= dataLen) {
				break;
			}
			value = data.readInt16LE(pos);
			pos += 2;
		}
	}

	_transform(chunk: Buffer, encoding: string, cb: TransformCallback) {
		this._total += chunk.length;
		// debug('_trans chunk: ' + chunk.length + '/' + this._total);
		if (this._started) {
			return this._buf.write(chunk, encoding, <any>cb);
		} else {
			return this.once('_started', () => {
				return this._buf.write(chunk, encoding, <any>cb);
			});
		}
	}

	_flush(cb: TransformCallback) {
		this._buf.end();
		return this._out.once('end', () => {
			if (this._samples > 0) {
				this.push([this._min, this._max]);
			}
			return cb();
		});
	}

}

interface WaveformOptions {
	samplesPerPixel: number;
	sampleRate: number;
}

class Waveform {

	_samples: Array<number> = [];

	constructor(private stream: Stream, private opts: WaveformOptions) {
		this.opts = Object.assign({
			samplesPerPixel: 256,
			sampleRate: 44100
		}, opts || {});
	}

	run(cb: (err?: Error) => void) {
		const ws = new WaveformStream(this.opts.samplesPerPixel, this.opts.sampleRate);
		ws.on('readable', () => {
			let px = ws.read();
			while (px && px.length > 0) {
				this._samples.push(px[0]);
				this._samples.push(px[1]);
				px = ws.read();
			}
		});
		ws.on('done', (err) => {
			cb(err);
		});
		this.stream.pipe(ws);
	}

	asBinary(): Buffer {
		// https://github.com/bbc/audiowaveform/blob/master/doc/DataFormat.md
		const result = Buffer.alloc(20 + (this._samples.length * 2));
		result.writeInt32LE(1, 0); // version
		result.writeUInt32LE(0, 4); // flags 0 (lsb) 	0: 16-bit resolution, 1: 8-bit resolution 1-31 	Unused
		result.writeInt32LE(this.opts.sampleRate, 8); // Sample rate
		result.writeInt32LE(this.opts.samplesPerPixel, 12); // Samples per pixel
		result.writeInt32LE(this._samples.length / 2, 16); // Length of waveform data (number of minimum and maximum value pairs)
		let pos = 20;
		this._samples.forEach(num => {
			result.writeInt16LE(num, pos);
			pos += 2;
		});
		return result;
	}

	asJSON(): IWaveformData {
		// https://github.com/bbc/audiowaveform/blob/master/doc/DataFormat.md
		return {
			version: 1,
			sample_rate: this.opts.sampleRate,
			samples_per_pixel: this.opts.samplesPerPixel,
			bits: 16,
			length: this._samples.length / 2,
			data: this._samples
		};
	}

}

export class WaveformGenerator {

	async binary(filename: string): Promise<Buffer> {
		const wf: Waveform = await this.generateWaveform(filename);
		return wf.asBinary();
	}

	async json(filename: string): Promise<IWaveformData> {
		const wf: Waveform = await this.generateWaveform(filename);
		return wf.asJSON();
	}

	async svg(filename: string): Promise<string> {
		const data = await this.json(filename);
		const svg = this.buildSvg(data);
		const svgo = new SVGO();
		const optimized = await svgo.optimize(svg);
		return optimized.data;
	}

	private async generateWaveform(filename: string): Promise<Waveform> {
		const stream = fs.createReadStream(filename);
		return new Promise<Waveform>((resolve, reject) => {
			const wf: Waveform = new Waveform(stream, {
				samplesPerPixel: 256,
				sampleRate: 44100
			});
			wf.run((err) => {
				if (err) {
					reject(err);
				} else {
					resolve(wf);
				}
			});
		});
	}

	private buildSvg(data: IWaveformData): string {
		const width = 4000;
		const height = 256;
		if (data.data.length > 0) {
			let wfd = WaveformData.create(data);
			const samplesPerPixel = Math.floor(wfd.duration * wfd.adapter.sample_rate / (width * 2));
			if (samplesPerPixel < 256) {
				wfd = wfd.resample({width: width * 2, scale: 256});
			} else {
				wfd = wfd.resample({width: width * 2});
			}
			wfd.adapter.data.data = wfd.adapter.data.data.slice(0, width * 2);
			data = wfd.adapter.data;
		}
		const totalPeaks = data.data.length;
		const d: Array<string> = [];
		for (let peakNumber = 0; peakNumber < totalPeaks; peakNumber++) {
			const num = (data.data[peakNumber] / height) + (height / 2);
			if (peakNumber % 2 === 0) {
				d.push(`M${~~(peakNumber / 2)}, ${num}`);
			} else {
				d.push(`L${~~(peakNumber / 2)}, ${num}`);
			}
		}
		const result = `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<svg xmlns="http://www.w3.org/2000/svg" xml:space="preserve" version="1.1" preserveAspectRatio="none"
     viewBox="0 0 ${width} ${height}" style="fill-rule:evenodd;clip-rule:evenodd;">
		<path stroke="green" d="${d.join(' ')}" />
</svg>`;
		return result;
	}

}
