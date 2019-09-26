import {max, min} from 'd3-array';
import D3Node from 'd3-node';
import {scaleLinear} from 'd3-scale';
import {area} from 'd3-shape';
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

	async svg(filename: string, width?: number): Promise<string> {
		const data = await this.json(filename);
		const svg = this.buildSvg(data, width);
		// const svgo = new SVGO();
		// const optimized = await svgo.optimize(svg);
		// return optimized.data;
		return svg;
	}

	private async generateWaveform(filename: string): Promise<Waveform> {
		const stream = fs.createReadStream(filename);
		return new Promise<Waveform>((resolve, reject) => {
			const wf: Waveform = new Waveform(stream, {
				samplesPerPixel: 256,
				sampleRate: 44100
			});
			wf.run(err => {
				if (err) {
					reject(err);
				} else {
					resolve(wf);
				}
			});
		});
	}

	private buildSvg(data: WaveDataResponse, width?: number): string {
		width = width || 4000;
		const height = 256;
		const x = scaleLinear();
		const y = scaleLinear();
		let wfd = WaveformData.create(data);
		wfd = wfd.resample({width: width * 2});
		const channel = wfd.channel(0);
		const minArray = channel.min_array();
		const maxArray = channel.max_array();
		x.domain([0, wfd.length]).rangeRound([0, width]);
		y.domain([min(minArray) as any, max(maxArray) as any]).rangeRound([0, height]);
		const waveArea = area()
			.x((a, i) => x(i))
			.y0((b, i) => y(minArray[i]))
			.y1((c, i) => y(c as any));
		const d3n = new D3Node();
		const svg = d3n.createSVG(null, null, {preserveAspectRatio: 'none', width: '100%', height: '100%', viewBox: `0 0 ${width} ${height}`});
		svg
			.append('path')
			.datum(maxArray)
			.attr('stroke', 'green')
			.attr('fill', 'darkgreen')
			.attr('d', waveArea);
		const result = d3n.svgString();
		return result;
	}

}
