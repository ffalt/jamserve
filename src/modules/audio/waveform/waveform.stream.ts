/***

 based on https://github.com/StreamMachine/sm-waveform
 MIT: https://github.com/StreamMachine/sm-waveform/blob/master/LICENSE

 */

import Ffmpeg from 'fluent-ffmpeg';
import { PassThrough, Readable, Transform, TransformCallback } from 'stream';
import { logger } from '../../../utils/logger.js';

const log = logger('waveform.stream');

export class WaveformStream extends Transform {
	_buf = new PassThrough();
	_out = new PassThrough();
	_ffmpeg: Ffmpeg.FfmpegCommand;
	_sampleRate: number;
	_samplesPerPixel: number;
	_started = false;
	_min: number | null = null;
	_max: number | null = null;
	_samples = 0;
	_total = 0;

	constructor(atSamplesPerPixel?: number, atSampleRate?: number) {
		super({ writableObjectMode: false, readableObjectMode: true, highWaterMark: 1024 });
		this._samplesPerPixel = atSamplesPerPixel ?? 256;
		this._sampleRate = atSampleRate ?? 44100;
		const options: Ffmpeg.FfmpegCommandOptions = {
			source: this._buf as Readable
		};
		this._ffmpeg = Ffmpeg(options).addOptions(['-f s16le', '-ac 1', '-acodec pcm_s16le', `-ar ${this._sampleRate}`]);
		this._ffmpeg.on('start', (cmd: string) => {
			log.debug(`ffmpeg started with ${cmd}`);
			this._started = true;
			return this.emit('_started');
		});
		let errored = false;
		this._ffmpeg.on('error', (err: any) => {
			if (err.code === 'ENOENT') {
				errored = true;
				log.debug('ffmpeg failed to start.');
				return this.emit('done', 'ffmpeg failed to start');
			}
			errored = true;
			log.debug(`ffmpeg decoding error: ${err}`);
			return this.emit('done', `ffmpeg decoding error: ${err}`);
		});
		this._ffmpeg.on('end', () => {
			if (!errored) {
				return this.emit('done');
			}
			return;
		});
		this._ffmpeg.writeToStream(this._out);
		this._out.on('readable', () => this.start());
	}

	start(): void {
		let data: Buffer | undefined = this._out.read();
		while (data && data.length > 0) {
			this.readResults(data.readInt16LE(0), 2, data);
			data = this._out.read();
		}
	}

	readResults(value: number, pos: number, data: Buffer): void {
		const dataLen = data.length;
		while (pos <= dataLen) {
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

	_transform(chunk: Buffer, encoding: BufferEncoding, cb: TransformCallback): void {
		this._total += chunk.length;
		if (this._started) {
			this._buf.write(chunk, encoding, cb as any);
		} else {
			this.once('_started', () => {
				this._buf.write(chunk, encoding, cb as any);
			});
		}
	}

	_flush(cb: TransformCallback): void {
		this._buf.end();
		this._out.once('end', () => {
			if (this._samples > 0) {
				this.push([this._min, this._max]);
			}
			cb();
		});
	}
}
