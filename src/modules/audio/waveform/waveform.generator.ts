import { max, min } from 'd3-array';
import { scaleLinear } from 'd3-scale';
import { area } from 'd3-shape';
import fs from 'node:fs';
import WaveformData from 'waveform-data';
import { WaveDataResponse, Waveform } from './waveform.class.js';

export class WaveformGenerator {
	async binary(filename: string): Promise<Buffer> {
		const wf: Waveform = await this.generateWaveform(filename);
		return wf.asBinary();
	}

	async json(filename: string): Promise<WaveDataResponse> {
		const wf: Waveform = await this.generateWaveform(filename);
		return wf.asJSON();
	}

	async svg(filename: string, width?: number): Promise<string> {
		const data = await this.json(filename);
		return this.buildSvg(data, width);
	}

	private async generateWaveform(filename: string): Promise<Waveform> {
		const stream = fs.createReadStream(filename);
		return new Promise<Waveform>((resolve, reject) => {
			const wf: Waveform = new Waveform(stream, {
				samplesPerPixel: 256,
				sampleRate: 44_100
			});
			wf.run((error?: unknown) => {
				if (error) {
					reject(error as unknown);
				} else {
					resolve(wf);
				}
			});
		});
	}

	private buildSvg(data: WaveDataResponse, w = 4000): string {
		const height = 256;
		const x = scaleLinear();
		const y = scaleLinear();
		const wfd = WaveformData.create(data);
		const channel = wfd.channel(0);
		const minArray = channel.min_array();
		const maxArray = channel.max_array();
		x.domain([0, wfd.length]).rangeRound([0, w]);
		y.domain([min(minArray) as any, max(maxArray) as any]).rangeRound([0, height]);
		const waveArea = area<number>()
			.x((_a, index) => x(index))
			.y0((_b, index) => y(minArray[index]))
			.y1(c => y(c));
		const d = waveArea(maxArray) ?? '';
		return `<?xml version="1.0" encoding="UTF-8"?>\n` +
			`<svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" width="100%" height="100%" viewBox="0 0 ${w} ${height}">` +
			`<path stroke="green" fill="darkgreen" d="${d}"/></svg>`;
	}
}
