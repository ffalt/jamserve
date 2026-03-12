import path from 'node:path';
import os from 'node:os';
import { TranscoderModule } from '../../../src/modules/audio/transcoder/transcoder.module.js';
import { LiveTranscoderStream } from '../../../src/modules/audio/transcoder/transcoder-live-stream.js';
import { TranscoderStream } from '../../../src/modules/audio/transcoder/transcoder-stream.js';
import { AudioFormatType } from '../../../src/types/enums.js';
import { ffmpegAvailable, generateSineWav, convertToMp3, temporaryDirectory } from './audio-generator.js';
import fs from 'node:fs';

const TMPDIR = path.join(os.tmpdir(), 'jamserve-transcoder-module');

describe('TranscoderModule.getLive', () => {
	test('returns a LiveTranscoderStream with the given parameters', () => {
		const module = new TranscoderModule('/tmp/cache');
		const stream = module.getLive('file.mp3', AudioFormatType.mp3, 128);
		expect(stream).toBeInstanceOf(LiveTranscoderStream);
		expect(stream.filename).toBe('file.mp3');
		expect(stream.format).toBe(AudioFormatType.mp3);
		expect(stream.maxBitRate).toBe(128);
		expect(stream.timeOffset).toBeUndefined();
	});

	test('passes timeOffset to LiveTranscoderStream', () => {
		const module = new TranscoderModule('/tmp/cache');
		const stream = module.getLive('file.mp3', AudioFormatType.ogg, 64, 45);
		expect(stream).toBeInstanceOf(LiveTranscoderStream);
		expect(stream.timeOffset).toBe(45);
	});

	test('LiveTranscoderStream defaults maxBitRate to 128 when zero', () => {
		const module = new TranscoderModule('/tmp/cache');
		const stream = module.getLive('file.mp3', AudioFormatType.mp3, 0);
		expect(stream.maxBitRate).toBe(128);
	});
});

describe('TranscoderModule.get', () => {
	test('rejects on unsupported format', async () => {
		const module = new TranscoderModule(path.join(TMPDIR, 'cache-unsupported'));
		await expect(module.get('file.mp3', 'id1', 'xyz', 128)).rejects.toThrow('Unsupported transcoding format');
	});

	test('creates cached transcode file when ffmpeg available', async () => {
		const available = await ffmpegAvailable();
		if (!available) {
			console.warn('ffmpeg not available, skipping integration test');
			return;
		}
		const temporary = await temporaryDirectory(TMPDIR);
		const wav = path.join(temporary, 'tone.wav');
		const mp3 = path.join(temporary, 'tone.mp3');
		await generateSineWav(wav, 1, 440);
		await convertToMp3(wav, mp3, '128k');
		const cacheDir = path.join(temporary, 'cache');
		await fs.promises.mkdir(cacheDir, { recursive: true });
		const module = new TranscoderModule(cacheDir);
		const result = await module.get(mp3, 'testid', AudioFormatType.mp3, 64);
		expect(result.file.filename).toBeTruthy();
		expect(fs.existsSync(result.file.filename)).toBe(true);
		expect(fs.statSync(result.file.filename).size).toBeGreaterThan(0);
	}, 20_000);

	test('returns cached file on second call without re-encoding', async () => {
		const available = await ffmpegAvailable();
		if (!available) {
			console.warn('ffmpeg not available, skipping integration test');
			return;
		}
		const temporary = await temporaryDirectory(TMPDIR);
		const wav = path.join(temporary, 'tone-cached.wav');
		const mp3 = path.join(temporary, 'tone-cached.mp3');
		await generateSineWav(wav, 1, 440);
		await convertToMp3(wav, mp3, '128k');
		const cacheDir = path.join(temporary, 'cache-second');
		await fs.promises.mkdir(cacheDir, { recursive: true });
		const module = new TranscoderModule(cacheDir);
		const result1 = await module.get(mp3, 'cacheid', AudioFormatType.mp3, 64);
		const mtime1 = fs.statSync(result1.file.filename).mtimeMs;
		// second call must reuse the same cached file
		const result2 = await module.get(mp3, 'cacheid', AudioFormatType.mp3, 64);
		const mtime2 = fs.statSync(result2.file.filename).mtimeMs;
		expect(result1.file.filename).toBe(result2.file.filename);
		expect(mtime1).toBe(mtime2);
	}, 30_000);
});

describe('TranscoderStream.needsTranscoding', () => {
	test('returns false for same format with zero bitrate', () => {
		expect(TranscoderStream.needsTranscoding('mp3', 'mp3', 0)).toBe(false);
	});

	test('returns true when formats differ', () => {
		expect(TranscoderStream.needsTranscoding('mp3', 'ogg', 0)).toBe(true);
	});

	test('returns true when bitrate is set even with same format', () => {
		expect(TranscoderStream.needsTranscoding('flac', 'flac', 128)).toBe(true);
	});
});