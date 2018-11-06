/* adapted from
	https://github.com/phding/waveform-node
	https://github.com/t4nz/ffmpeg-peaks
	https://github.com/antonKalinin/audio-waveform-svg-path
	https://github.com/invokemedia/audio-to-svg-waveform
 */

import {spawnTool} from '../../utils/tool';
import SVGO from 'svgo';
import {fsStat, tmpFile} from '../../utils/fs-utils';
import fs from 'fs';

export async function getWaveFormSVG(filepath: string): Promise<string> {
	const wf = new WaveFormSVG();
	const result = await wf.generate(filepath);
	return result;
}

class PeakData {
	lastMax: Array<number>;
	lastMin: Array<number>;
	indexI: Array<number>;
	indexJ: Array<number>;
	indexJJOverflow: Array<number>;
	splitPeaks: Array<Array<number>>;

	constructor(private channels: number) {
		this.lastMax = Array(channels).fill(0);
		this.lastMin = Array(channels).fill(0);
		this.indexI = Array(channels).fill(0);
		this.indexJ = Array(channels).fill(0);
		this.indexJJOverflow = Array(channels).fill(0);
		this.splitPeaks = [];
		for (let i = 0; i < channels; i++) {
			this.splitPeaks[i] = [];
		}
	}
}

class GetPeaks {
	/*
	Source: https://github.com/t4nz/ffmpeg-peaks/blob/master/getPeaks.js
	 */
	private mergedPeaks: Array<number> = [];
	private data?: PeakData;

	constructor(private splitChannels: boolean, private length: number, private sampleStep: number, private totalSamples: number) {
	}

	update(buffers: Array<Array<number>>) {
		const sampleSize = this.totalSamples / this.length;
		const channels = buffers.length;
		if (this.data === undefined) {
			this.data = new PeakData(channels);
		}
		for (let c = 0; c < channels; c++) {
			const chan = buffers[c];
			const peaks = this.data.splitPeaks[c];
			let i;
			for (i = this.data.indexI[c]; i < this.length; i++) {
				const start = Math.max(~~(i * sampleSize), this.data.indexJ[c]);
				const end = ~~((i + 1) * sampleSize);
				let min = this.data.lastMin[c];
				let max = this.data.lastMax[c];

				let broken = false;
				let jj;
				for (let j = start; j < end; j += this.sampleStep) {
					jj = j - this.data.indexJ[c] + this.data.indexJJOverflow[c];

					if (jj > chan.length - 1) {
						this.data.indexI[c] = i;
						this.data.indexJJOverflow[c] = jj - (chan.length - 1) - 1;
						this.data.indexJ[c] = j;
						this.data.lastMax[c] = max;
						this.data.lastMin[c] = min;
						broken = true;
						break;
					}

					const value = chan[jj];
					if (value > max) {
						max = value;
					}
					if (value < min) {
						min = value;
					}
				}
				if (broken) {
					break;
				} else {
					this.data.lastMax[c] = 0;
					this.data.lastMin[c] = 0;
				}
				peaks[2 * i] = max;
				peaks[2 * i + 1] = min;
				if (c === 0 || max > this.mergedPeaks[2 * i]) {
					this.mergedPeaks[2 * i] = max;
				}
				if (c === 0 || min < this.mergedPeaks[2 * i + 1]) {
					this.mergedPeaks[2 * i + 1] = min;
				}
			}
			this.data.indexI[c] = i;  // We finished for channel c. For the next call start from i = this.length so we do nothing.
		}
	}

	get() {
		return this.splitChannels && this.data ? this.data.splitPeaks : this.mergedPeaks;
	}
}

export class WaveFormSVG {
	private svgo = new SVGO();

	async generate(filename: string): Promise<string> {
		const temp = await tmpFile();
		await this.convertFile(filename, temp.filename);
		const peaks = await this.getPeaks(temp.filename);
		temp.cleanupCallback();
		const paths = this.svgPath(peaks);
		const svg = this.svg(paths);
		const optimized = await this.svgo.optimize(svg);
		return optimized.data;
	}

	private svg(paths: string): string {
		const w = 100;
		const h = 81;
		const result = `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<svg xmlns="http://www.w3.org/2000/svg" xml:space="preserve" version="1.1" preserveAspectRatio="none"
     viewBox="0 0 ${w} ${h}" style="fill-rule:evenodd;clip-rule:evenodd;">
    <g transform="matrix(0.0334504,0,0,81,0,40.5)">
		<path stroke="black" d="${paths}" />
	</g>
</svg>`;
		return result;
	}

	private svgPathMixedChannel(peaks: Array<number>): string {
		const totalPeaks = peaks.length;
		const d: Array<string> = [];
		// "for" is used for faster iteration
		for (let peakNumber = 0; peakNumber < totalPeaks; peakNumber++) {
			const num = peaks[peakNumber] / 3;
			if (peakNumber % 2 === 0) {
				d.push(`M${~~(peakNumber / 2)}, ${num}`);
			} else {
				d.push(`L${~~(peakNumber / 2)}, ${num}`);
			}
		}
		return d.join(' ');
	}

	private svgPath(peaks: Array<number> | Array<Array<number>>): string {
		if (Array.isArray(peaks[0])) {
			const left: Array<number> = <Array<number>>peaks[0];
			const right: Array<number> = <Array<number>>peaks[1];
			const d: Array<string> = [];
			for (let peakNumber = 0, totalPeaks = left.length; peakNumber < totalPeaks; peakNumber++) {
				const leftValue = left[peakNumber];
				const rightValue = right[peakNumber];
				d.push(`M${peakNumber}, ${leftValue} L${peakNumber}, ${rightValue} `);
				console.log(leftValue, rightValue);
			}
			return d.join(' ');
		} else {
			return this.svgPathMixedChannel(<Array<number>>peaks);
		}
	}

	private async getPeaks(filename: string): Promise<Array<number> | Array<Array<number>>> {
		const stats = await fsStat(filename);
		const opts = Object.assign({
			numOfChannels: 2,
			sampleRate: 44100,
			maxValue: 1.0,
			minValue: -1.0,
			width: 4000,
			precision: 1
		}, {});
		let oddByte: number | null = null;
		let sc = 0;
		const totalSamples = ~~((stats.size / 2) / opts.numOfChannels);
		const splitChannels = false; // opts.numOfChannels >= 2;
		const peaks = new GetPeaks(splitChannels, opts.width, opts.precision, totalSamples);
		const readable = fs.createReadStream(filename);
		readable.on('data', (chunk) => {
			let i = 0;
			let value: number;
			const samples: Array<Array<number>> = [];
			for (let ii = 0; ii < opts.numOfChannels; ii++) {
				samples[ii] = [];
			}
			if (oddByte !== null) {
				value = ((chunk.readInt8(i++, true) << 8) | oddByte) / 32768.0;
				samples[sc].push(value);
				sc = (sc + 1) % opts.numOfChannels;
			}
			for (; i + 1 < chunk.length; i += 2) {
				value = chunk.readInt16LE(i, true) / 32768.0;
				samples[sc].push(value);
				sc = (sc + 1) % opts.numOfChannels;
			}
			oddByte = (i < chunk.length ? chunk.readUInt8(i, true) : null);
			peaks.update(samples);
		});
		return new Promise<Array<number> | Array<Array<number>>>((resolve, reject) => {
			readable.on('error', (err) => {
				reject(err);
			});
			readable.on('end', () => {
				resolve(peaks.get());
			});
		});
	}

	private async convertFile(filepath: string, destpath: string): Promise<void> {
		await spawnTool('ffmpeg', 'FFMPEG_PATH', ['-v', 'error', '-i', filepath, '-f', 's16le', '-acodec', 'pcm_s16le', '-y', destpath]);
	}

}
