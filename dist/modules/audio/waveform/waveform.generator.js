import { max, min } from 'd3-array';
import { scaleLinear } from 'd3-scale';
import { area } from 'd3-shape';
import { select } from 'd3-selection';
import fs from 'node:fs';
import WaveformData from 'waveform-data';
import { Waveform } from './waveform.class.js';
import { JSDOM } from 'jsdom';
export class WaveformGenerator {
    async binary(filename) {
        const wf = await this.generateWaveform(filename);
        return wf.asBinary();
    }
    async json(filename) {
        const wf = await this.generateWaveform(filename);
        return wf.asJSON();
    }
    async svg(filename, width) {
        const data = await this.json(filename);
        return this.buildSvg(data, width);
    }
    async generateWaveform(filename) {
        const stream = fs.createReadStream(filename);
        return new Promise((resolve, reject) => {
            const wf = new Waveform(stream, {
                samplesPerPixel: 256,
                sampleRate: 44100
            });
            wf.run((error) => {
                if (error) {
                    reject(error);
                }
                else {
                    resolve(wf);
                }
            });
        });
    }
    buildSvg(data, width) {
        const height = 256;
        const x = scaleLinear();
        const y = scaleLinear();
        const wfd = WaveformData.create(data);
        const channel = wfd.channel(0);
        const minArray = channel.min_array();
        const maxArray = channel.max_array();
        x.domain([0, wfd.length]).rangeRound([0, width ?? 4000]);
        y.domain([min(minArray), max(maxArray)]).rangeRound([0, height]);
        const waveArea = area()
            .x((_a, index) => x(index))
            .y0((_b, index) => y(minArray[index]))
            .y1(c => y(c));
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
            .attr('d', waveArea);
        const node = svg.node();
        return node?.outerHTML ?? '';
    }
}
//# sourceMappingURL=waveform.generator.js.map