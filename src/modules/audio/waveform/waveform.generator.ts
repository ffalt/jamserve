import {max, min} from 'd3-array';
import {scaleLinear} from 'd3-scale';
import {area} from 'd3-shape';
import {select} from 'd3-selection';
import fs from 'fs';
import WaveformData from 'waveform-data';
import {WaveDataResponse, Waveform} from './waveform.class';
import {JSDOM} from 'jsdom';

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
		// const svg = this.buildSvg(data, width);
		// const svgo = new SVGO();
		// const optimized = await svgo.optimize(svg);
		// return optimized.data;
		// return svg;
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
		const height = 256;
		const x = scaleLinear();
		const y = scaleLinear();
		let wfd = WaveformData.create(data);
		if (width !== undefined) {
			const samplesPerPixel = Math.floor(wfd.duration * wfd.sample_rate / width);
			wfd = wfd.resample({width: width * 2, scale: (samplesPerPixel < wfd.scale) ? wfd.scale : undefined});
		} else {
			width = 4000;
		}
		const channel = wfd.channel(0);
		const minArray = channel.min_array();
		const maxArray = channel.max_array();
		x.domain([0, wfd.length]).rangeRound([0, width]);
		y.domain([min(minArray) as any, max(maxArray) as any]).rangeRound([0, height]);
		const waveArea = area()
			.x((a, i) => x(i))
			.y0((b, i) => y(minArray[i]))
			.y1((c) => y(c as any));
		const fakedom = new JSDOM('<!DOCTYPE html><html><body></body></html>');
		const d3Element = select(fakedom.window.document).select('body');
		const svg = d3Element.append('svg')
			.attr('xmlns', 'http://www.w3.org/2000/svg')
			.attr('preserveAspectRatio', 'none')
			.attr('width', '100%')
			.attr('height', '100%')
			.attr('viewBox', `0 0 ${width} ${height}`);
		svg
			.append('path')
			.datum(maxArray)
			.attr('stroke', 'green')
			.attr('fill', 'darkgreen')
			.attr('d', waveArea as any);
		const node = svg.node();
		return node?.outerHTML || '';
	}

}
