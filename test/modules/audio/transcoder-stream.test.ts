import { PassThrough } from 'node:stream';
import { TranscoderStream } from '../../../src/modules/audio/transcoder/transcoder-stream.js';
import { AudioFormatType } from '../../../src/types/enums.js';
import { clearBinCache } from '../../../src/utils/which.js';
import { beforeEach } from '@jest/globals';

afterEach(() => {
	clearBinCache();
});
beforeEach(() => {
	clearBinCache();
});

describe('TranscoderStream static utilities', () => {
	test('needsTranscoding logic', () => {
		expect(TranscoderStream.needsTranscoding('mp3', 'mp3', 0)).toBe(false);
		expect(TranscoderStream.needsTranscoding('mp3', 'mp3', 128)).toBe(true);
		expect(TranscoderStream.needsTranscoding('mp3', 'ogg', 0)).toBe(true);
	});

	test('validTranscoding includes expected formats', () => {
		expect(TranscoderStream.validTranscoding(AudioFormatType.mp3)).toBe(true);
		expect(TranscoderStream.validTranscoding(AudioFormatType.flv)).toBe(true);
		// an unknown value should not be considered valid
		expect(TranscoderStream.validTranscoding('invalid' as any)).toBe(false);
	});
});

describe('TranscoderStream ffmpeg argument generation and runtime', () => {
	test('getTranscodeProc emits maxrate option for flv', async () => {
		process.env.FFMPEG_PATH = '/usr/bin/true';
		const proc = TranscoderStream.getTranscodeProc('input.mp3', AudioFormatType.flv, 264);
		await new Promise<void>((resolve, reject) => {
			const to = setTimeout(() => {
				reject(new Error('timeout waiting for start'));
			}, 2000);
			proc.on('start', (cmd: string) => {
				clearTimeout(to);
				try {
					expect(typeof cmd).toBe('string');
					expect(cmd).toMatch(/-f\s+flv/);
					expect(cmd).toMatch(/-ar\s+44100/);
					expect(cmd).toMatch(/-maxrate\s+264k/);
					resolve();
				} catch (error) {
					reject(error);
				}
			});
			proc.on('error', error => {
				clearTimeout(to);
				reject(error as Error);
			});
			// start streaming to a sink so the process triggers
			proc.writeToStream(new PassThrough());
		});
	});

	test('getTranscodeProc for mp3 includes codec and bitrate', async () => {
		process.env.FFMPEG_PATH = '/usr/bin/true';
		const proc = TranscoderStream.getTranscodeProc('input.wav', AudioFormatType.mp3, 192);
		await new Promise<void>((resolve, reject) => {
			const to = setTimeout(() => {
				reject(new Error('timeout waiting for start'));
			}, 2000);
			proc.on('start', (cmd: string) => {
				clearTimeout(to);
				try {
					expect(cmd).toMatch(/-f\s+mp3/);
					expect(cmd).toMatch(/-b:a\s+192k/);
					expect(cmd).toMatch(/-c:a\s+libmp3lame/);
					resolve();
				} catch (error) {
					reject(error);
				}
			});
			proc.on('error', errror => {
				clearTimeout(to);
				reject(errror as Error);
			});
			proc.writeToStream(new PassThrough());
		});
	});

	// New edge tests
	test('getTranscodeProc for ogg/oga uses libvorbis and maxrate', async () => {
		process.env.FFMPEG_PATH = '/usr/bin/true';
		for (const fmt of [AudioFormatType.ogg, AudioFormatType.oga]) {
			const proc = TranscoderStream.getTranscodeProc('in.wav', fmt, 160);
			await new Promise<void>((resolve, reject) => {
				const to = setTimeout(() => {
					reject(new Error('timeout waiting for start'));
				}, 2000);
				proc.on('start', (cmd: string) => {
					clearTimeout(to);
					try {
						expect(cmd).toMatch(new RegExp(`-f\\s+${fmt}`));
						expect(cmd).toMatch(/-c:a\s+libvorbis/);
						expect(cmd).toMatch(/-maxrate\s+160k/);
						resolve();
					} catch (error) {
						reject(error);
					}
				});
				proc.on('error', error => {
					clearTimeout(to);
					reject(error as Error);
				});
				proc.writeToStream(new PassThrough());
			});
		}
	});

	test('getTranscodeProc for webma uses webm format', async () => {
		process.env.FFMPEG_PATH = '/usr/bin/true';
		const proc = TranscoderStream.getTranscodeProc('in.webma', AudioFormatType.webma, 0);
		await new Promise<void>((resolve, reject) => {
			const to = setTimeout(() => {
				reject(new Error('timeout waiting for start'));
			}, 2000);
			proc.on('start', (cmd: string) => {
				clearTimeout(to);
				try {
					expect(cmd).toMatch(/-f\s+webm/);
					resolve();
				} catch (error) {
					reject(error);
				}
			});
			proc.on('error', error => {
				clearTimeout(to);
				reject(error as Error);
			});
			proc.writeToStream(new PassThrough());
		});
	});

	test('getTranscodeProc for m4a/mp4/m4b uses mp4 format and bitrate', async () => {
		process.env.FFMPEG_PATH = '/usr/bin/true';
		for (const fmt of [AudioFormatType.mp4, AudioFormatType.m4a, AudioFormatType.m4b]) {
			const proc = TranscoderStream.getTranscodeProc('in.wav', fmt, 160);
			await new Promise<void>((resolve, reject) => {
				const to = setTimeout(() => {
					reject(new Error('timeout waiting for start'));
				}, 2000);
				proc.on('start', (cmd: string) => {
					clearTimeout(to);
					try {
						expect(cmd).toMatch(/-f\s+mp4/);
						expect(cmd).toMatch(/-b:a\s+160k/);
						resolve();
					} catch (error) {
						reject(error);
					}
				});
				proc.on('error', error => {
					clearTimeout(to);
					reject(error as Error);
				});
				proc.writeToStream(new PassThrough());
			});
		}
	});

	test('addOptions tokenizes quoted arguments correctly', async () => {
		process.env.FFMPEG_PATH = '/usr/bin/true';
		const proc = TranscoderStream.getTranscodeProc('in.mp3', AudioFormatType.mp3, 128);
		proc.addOptions(['-metadata title="My Test Song"', '-customFlag value']);
		await new Promise<void>((resolve, reject) => {
			const to = setTimeout(() => {
				reject(new Error('timeout waiting for start'));
			}, 2000);
			proc.on('start', (cmd: string) => {
				clearTimeout(to);
				try {
					// allow optional quotes around the metadata value
					expect(cmd).toMatch(/-metadata\s+title="?My Test Song"?/);
					expect(cmd).toMatch(/-customFlag\s+value/);
					resolve();
				} catch (error) {
					reject(error);
				}
			});
			proc.on('error', error => {
				clearTimeout(to);
				reject(error as Error);
			});
			proc.writeToStream(new PassThrough());
		});
	});
});
