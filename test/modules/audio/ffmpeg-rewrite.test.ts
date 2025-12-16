import winston from 'winston';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { rewriteWriteFFmpeg } from '../../../src/modules/audio/tools/ffmpeg-rewrite.js';
import { convertToMp3, ffmpegAvailable, generateSineWav, temporaryDirectory } from './audio-generator.js';
import { clearBinCache } from '../../../src/utils/which.js';
import { beforeEach } from '@jest/globals';

const TMPDIR = path.join(os.tmpdir(), 'jamserve-ffmpeg-rewrite');
winston.configure({ transports: [new winston.transports.Console({ silent: true })] });

afterEach(() => {
	clearBinCache();
});
beforeEach(() => {
	clearBinCache();
});

describe('ffmpeg-rewrite', () => {
	let temporary: string;
	beforeAll(async () => {
		temporary = await temporaryDirectory(TMPDIR);
	});

	test('rewrites file by copying audio/video codecs and removing metadata', async () => {
		const available = await ffmpegAvailable();
		if (!available) {
			console.warn('ffmpeg not available, skipping rewrite test');
			return;
		}

		const wav = path.join(temporary, 'rw-tone.wav');
		const mp3 = path.join(temporary, 'rw-tone.mp3');
		const out = path.join(temporary, 'rw-out.mp3');

		await generateSineWav(wav, 1, 440);
		await convertToMp3(wav, mp3, '128k');
		expect(fs.existsSync(mp3)).toBe(true);

		await expect(rewriteWriteFFmpeg(mp3, out)).resolves.toBeUndefined();
		expect(fs.existsSync(out)).toBe(true);
		expect(fs.statSync(out).size).toBeGreaterThan(0);
	});

	test('rejects when source does not exist', async () => {
		const available = await ffmpegAvailable();
		if (!available) {
			console.warn('ffmpeg not available, skipping rewrite error test');
			return;
		}
		const bad = path.join(temporary, 'nonexistent-input.mp3');
		const out = path.join(temporary, 'rw-out-bad.mp3');
		await expect(rewriteWriteFFmpeg(bad, out)).rejects.toBeInstanceOf(Error);
	});
});
