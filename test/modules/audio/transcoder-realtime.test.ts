import winston from 'winston';

import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { ffmpegAvailable, generateSineWav, convertToMp3, temporaryDirectory as ensureTemporaryDir } from './audio-generator.js';
import { TranscoderStream } from '../../../src/modules/audio/transcoder/transcoder-stream.js';
import { AudioFormatType } from '../../../src/types/enums.js';
import { clearBinCache } from '../../../src/utils/which.js';
import { beforeEach } from '@jest/globals';

const TMPDIR = path.join(os.tmpdir(), 'jamserve-integration');
winston.configure({ transports: [new winston.transports.Console({ silent: true })] });

afterEach(() => {
	clearBinCache();
});
beforeEach(() => {
	clearBinCache();
});

describe('TranscoderStream integration with real ffmpeg', () => {
	let temporary: string;
	beforeAll(async () => {
		temporary = await ensureTemporaryDir(TMPDIR);
	});

	test('generate wav, convert to mp3 and transcode to mp4', async () => {
		const available = await ffmpegAvailable();
		if (!available) {
			console.warn('ffmpeg not available, skipping integration test');
			return;
		}

		const wav = path.join(temporary, 'tone.wav');
		const mp3 = path.join(temporary, 'tone.mp3');
		const out = path.join(temporary, 'out.mp4');

		// generate 1s sine wav
		await generateSineWav(wav, 1, 440);
		expect(fs.existsSync(wav)).toBe(true);

		// convert to mp3
		await convertToMp3(wav, mp3, '128k');
		expect(fs.existsSync(mp3)).toBe(true);

		// Use TranscoderStream.transcodeToFile to convert mp3 -> mp4
		await expect(TranscoderStream.transcodeToFile(mp3, out, AudioFormatType.mp4, 128)).resolves.toBeUndefined();
		expect(fs.existsSync(out)).toBe(true);
		expect(fs.statSync(out).size).toBeGreaterThan(0);
	}, 20_000);

	test('transcode mp3 into multiple formats and bitrates', async () => {
		const available = await ffmpegAvailable();
		if (!available) {
			console.warn('ffmpeg not available, skipping integration test');
			return;
		}

		const wav = path.join(temporary, 'tone-multi.wav');
		const mp3 = path.join(temporary, 'tone-multi.mp3');

		// ensure source files exist
		await generateSineWav(wav, 1, 440);
		await convertToMp3(wav, mp3, '128k');
		expect(fs.existsSync(mp3)).toBe(true);

		const cases: Array<{ fmt: AudioFormatType; bitrate: number }> = [
			{ fmt: AudioFormatType.mp3, bitrate: 64 },
			{ fmt: AudioFormatType.mp3, bitrate: 192 },
			{ fmt: AudioFormatType.ogg, bitrate: 128 },
			{ fmt: AudioFormatType.oga, bitrate: 160 },
			{ fmt: AudioFormatType.flac, bitrate: 0 },
			{ fmt: AudioFormatType.mp4, bitrate: 128 },
			{ fmt: AudioFormatType.m4a, bitrate: 160 },
			{ fmt: AudioFormatType.webma, bitrate: 0 }
		];

		function extensionFor(fmt: AudioFormatType) {
			switch (fmt) {
				case AudioFormatType.mp3: {
					return 'mp3';
				}
				case AudioFormatType.ogg: {
					return 'ogg';
				}
				case AudioFormatType.oga: {
					return 'oga';
				}
				case AudioFormatType.flac: {
					return 'flac';
				}
				case AudioFormatType.mp4: {
					return 'mp4';
				}
				case AudioFormatType.m4a: {
					return 'm4a';
				}
				case AudioFormatType.webma: {
					return 'webm';
				}
				default: {
					return fmt satisfies string;
				}
			}
		}

		for (const c of cases) {
			const out = path.join(temporary, `out-${c.fmt}-${c.bitrate || 'auto'}.${extensionFor(c.fmt)}`);
			await expect(TranscoderStream.transcodeToFile(mp3, out, c.fmt, c.bitrate)).resolves.toBeUndefined();
			expect(fs.existsSync(out)).toBe(true);
			expect(fs.statSync(out).size).toBeGreaterThan(0);
		}
	}, 60_000);
});
