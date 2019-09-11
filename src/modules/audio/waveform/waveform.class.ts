/***

 based on https://github.com/StreamMachine/sm-waveform
 MIT: https://github.com/StreamMachine/sm-waveform/blob/master/LICENSE

 */

import {Stream} from 'stream';
import {WaveformStream} from './waveform.stream';

export interface WaveformOptions {
	samplesPerPixel: number;
	sampleRate: number;
}

/** https://github.com/bbc/audiowaveform/blob/master/doc/DataFormat.md */
export interface WaveDataResponse {
	/** The version number of the waveform data format. */
	version: number;
	/** The number of waveform channels present (version 2 only). */
	channels?: number;
	/** Sample rate of original audio file (Hz). */
	sample_rate: number;
	/** Number of audio samples per waveform minimum/maximum pair. */
	samples_per_pixel: number;
	/** Resolution of waveform data. May be either 8 or 16. */
	bits: number;
	/** Length of waveform data (number of minimum and maximum value pairs per channel). */
	length: number;
	/** Array of minimum and maximum waveform data points, interleaved. Depending on bits, each value may be in the range -128 to +127 or -32768 to +32727. */
	data: Array<number>;
}

export class Waveform {

	_samples: Array<number> = [];

	constructor(private stream: Stream, private opts: WaveformOptions) {
		this.opts = {
			samplesPerPixel: 256,
			sampleRate: 44100, ...(opts || {})
		};
	}

	run(cb: (err?: Error) => void): void {
		const ws = new WaveformStream(this.opts.samplesPerPixel, this.opts.sampleRate);
		ws.on('readable', () => {
			let px = ws.read();
			while (px && px.length > 0) {
				this._samples.push(px[0]);
				this._samples.push(px[1]);
				px = ws.read();
			}
		});
		ws.on('done', err => {
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

	asJSON(): WaveDataResponse {
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
