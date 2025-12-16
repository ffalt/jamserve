import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import winston from 'winston';
import { ffmpegAvailable, generateSineWav, convertToMp3, temporaryDirectory } from './audio-generator.js';
import { WaveformStream } from '../../../src/modules/audio/waveform/waveform.stream.js';
import { clearBinCache } from '../../../src/utils/which.js';
import { beforeEach } from '@jest/globals';

const TMPDIR = path.join(os.tmpdir(), 'jamserve-waveform');
winston.configure({ transports: [new winston.transports.Console({ silent: true })] });

afterEach(() => {
	clearBinCache();
});
beforeEach(() => {
	clearBinCache();
});

describe('WaveformStream integration', () => {
	let temporary: string;
	beforeAll(async () => {
		temporary = await temporaryDirectory(TMPDIR);
	});

	test('generates waveform min/max pairs from an mp3 input', async () => {
		const available = await ffmpegAvailable();
		if (!available) {
			console.warn('ffmpeg not available, skipping WaveformStream integration test');
			return;
		}

		const wav = path.join(temporary, 'wave-tone.wav');
		const mp3 = path.join(temporary, 'wave-tone.mp3');

		// generate small audio files
		await generateSineWav(wav, 1, 440);
		await convertToMp3(wav, mp3, '128k');
		expect(fs.existsSync(mp3)).toBe(true);

		const wave = new WaveformStream(256, 44_100);
		const results: Array<[number, number]> = [];

		wave.on('data', (d: any) => {
			// waveform pushes arrays of [min, max]
			if (Array.isArray(d) && d.length === 2) {
				results.push([Number(d[0]), Number(d[1])]);
			}
		});

		const read = fs.createReadStream(mp3);
		read.pipe(wave);

		await new Promise<void>((resolve, reject) => {
			const to = setTimeout(() => {
				reject(new Error('timeout waiting for waveform end'));
			}, 10_000);
			wave.on('end', () => {
				clearTimeout(to);
				resolve();
			});
			wave.on('error', error => {
				clearTimeout(to);
				reject(error);
			});
			read.on('error', error => {
				clearTimeout(to);
				reject(error);
			});
		});

		expect(results.length).toBeGreaterThan(0);
		for (const pair of results) {
			expect(pair.length).toBe(2);
			expect(typeof pair[0]).toBe('number');
			expect(typeof pair[1]).toBe('number');
			expect(pair[0]).toBeLessThanOrEqual(pair[1]);
		}
	}, 20_000);
});
