"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WaveformGenerator = void 0;
const d3_array_1 = require("d3-array");
const d3_node_1 = __importDefault(require("d3-node"));
const d3_scale_1 = require("d3-scale");
const d3_shape_1 = require("d3-shape");
const fs_1 = __importDefault(require("fs"));
const waveform_data_1 = __importDefault(require("waveform-data"));
const waveform_class_1 = require("./waveform.class");
class WaveformGenerator {
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
        const stream = fs_1.default.createReadStream(filename);
        return new Promise((resolve, reject) => {
            const wf = new waveform_class_1.Waveform(stream, {
                samplesPerPixel: 256,
                sampleRate: 44100
            });
            wf.run(err => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(wf);
                }
            });
        });
    }
    buildSvg(data, width) {
        const height = 256;
        const x = d3_scale_1.scaleLinear();
        const y = d3_scale_1.scaleLinear();
        let wfd = waveform_data_1.default.create(data);
        if (width !== undefined) {
            const samplesPerPixel = Math.floor(wfd.duration * wfd.sample_rate / width);
            wfd = wfd.resample({ width: width * 2, scale: (samplesPerPixel < wfd.scale) ? wfd.scale : undefined });
        }
        else {
            width = 4000;
        }
        const channel = wfd.channel(0);
        const minArray = channel.min_array();
        const maxArray = channel.max_array();
        x.domain([0, wfd.length]).rangeRound([0, width]);
        y.domain([d3_array_1.min(minArray), d3_array_1.max(maxArray)]).rangeRound([0, height]);
        const waveArea = d3_shape_1.area()
            .x((a, i) => x(i))
            .y0((b, i) => y(minArray[i]))
            .y1((c) => y(c));
        const d3n = new d3_node_1.default();
        const svg = d3n.createSVG(null, null, { preserveAspectRatio: 'none', width: '100%', height: '100%', viewBox: `0 0 ${width} ${height}` });
        svg
            .append('path')
            .datum(maxArray)
            .attr('stroke', 'green')
            .attr('fill', 'darkgreen')
            .attr('d', waveArea);
        return d3n.svgString();
    }
}
exports.WaveformGenerator = WaveformGenerator;
//# sourceMappingURL=waveform.generator.js.map