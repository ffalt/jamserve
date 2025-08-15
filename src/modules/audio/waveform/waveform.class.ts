/***

 based on https://github.com/StreamMachine/sm-waveform
 MIT: https://github.com/StreamMachine/sm-waveform/blob/master/LICENSE

 */

import { Stream } from 'node:stream';
import { WaveformStream } from './waveform.stream.js';

export interface WaveformOptions {
	samplesPerPixel: number;
	sampleRate: number;
}

/** https://github.com/bbc/audiowaveform/blob/master/doc/DataFormat.md */
export interface WaveDataResponse {
	/** The version number of the waveform data format. */
	version: number;
	/** The number of waveform channels present (version 2 only). */
	channels: number;
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
	options: WaveformOptions = { samplesPerPixel: 256, sampleRate: 44_100 };
	samples: Array<number> = [];

	constructor(private readonly stream: Stream, options: WaveformOptions) {
		this.options = { ...this.options, ...options };
	}

	run(callback: (error?: unknown) => void): void {
		const ws = new WaveformStream(this.options.samplesPerPixel, this.options.sampleRate);
		ws.on('readable', () => {
			let px: Array<number> | undefined = ws.read();
			while (px && px.length > 0) {
				this.samples.push(px.at(0)!, px.at(1)!);
				px = ws.read();
			}
		});
		ws.on('done', (error: unknown) => {
			callback(error);
		});
		this.stream.pipe(ws);
	}

	asBinaryV1(): Buffer {
		// https://github.com/bbc/audiowaveform/blob/master/doc/DataFormat.md
		const result = Buffer.alloc((this.samples.length * 2) + 20);
		result.writeInt32LE(1, 0); // version
		result.writeUInt32LE(0, 4); // flags 0 (lsb) 	0: 16-bit resolution, 1: 8-bit resolution 1-31 	Unused
		result.writeInt32LE(this.options.sampleRate, 8); // Sample rate
		result.writeInt32LE(this.options.samplesPerPixel, 12); // Samples per pixel
		result.writeInt32LE(this.samples.length / 2, 16); // Length of waveform data (number of minimum and maximum value pairs)
		let pos = 20;
		for (const sample of this.samples) {
			result.writeInt16LE(sample, pos);
			pos += 2;
		}
		return result;
	}

	asBinary(): Buffer {
		// https://github.com/bbc/audiowaveform/blob/master/doc/DataFormat.md
		const result = Buffer.alloc((this.samples.length * 2) + 24);
		result.writeInt32LE(2, 0); // version
		result.writeUInt32LE(0, 4); // flags 0 (lsb) 	0: 16-bit resolution, 1: 8-bit resolution 1-31 	Unused
		result.writeInt32LE(this.options.sampleRate, 8); // Sample rate
		result.writeInt32LE(this.options.samplesPerPixel, 12); // Samples per pixel
		result.writeInt32LE(this.samples.length / 2, 16); // Length of waveform data (number of minimum and maximum value pairs)
		result.writeInt32LE(2, 20); // Channels
		let pos = 24;
		for (const sample of this.samples) {
			result.writeInt16LE(sample, pos);
			pos += 2;
		}
		return result;
	}

	asJSON(): WaveDataResponse {
		// https://github.com/bbc/audiowaveform/blob/master/doc/DataFormat.md
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
