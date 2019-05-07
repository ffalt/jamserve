import fs from 'fs';
import SVGO from 'svgo';
import WaveformData from 'waveform-data';
import {WaveDataResponse, Waveform} from './waveform.class';

export class WaveformGenerator {

	async binary(filename: string): Promise<Buffer> {
		const wf: Waveform = await this.generateWaveform(filename);
		return wf.asBinary();
	}

	async json(filename: string): Promise<WaveDataResponse> {
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

	private buildSvg(data: WaveDataResponse): string {
		const width = 4000;
		const height = 256;
		if (data.data.length > 0) {
			let wfd = WaveformData.create(data);
			const samplesPerPixel = Math.floor(wfd.duration * wfd.adapter.sample_rate / (width * 2));
			wfd = wfd.resample({width: width * 2, scale: (samplesPerPixel < 256) ? 256 : undefined});
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
