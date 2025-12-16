import { PassThrough, Readable } from 'node:stream';
import ffmpeg from '../../../src/modules/audio/tools/ffmpeg.js';
import { clearBinCache } from '../../../src/utils/which.js';
import { beforeEach } from '@jest/globals';

afterEach(() => {
	clearBinCache();
});
beforeEach(() => {
	clearBinCache();
});

describe('ffmpeg wrapper smoke', () => {
	test('start and end events are emitted', async () => {
		process.env.FFMPEG_PATH = '/usr/bin/true';
		const source = new Readable({
			read() {
				// nop
			}
		});
		const out = new PassThrough();

		const options = { source: source };
		const proc = ffmpeg(options);

		const events: Array<string> = [];

		proc.on('start', cmd => {
			events.push('start');
			expect(typeof cmd).toBe('string');
		});

		proc.on('end', () => {
			events.push('end');
		});

		proc.on('error', error => {
			// If any error occurs, fail the test
			throw error;
		});

		proc.writeToStream(out);

		// End the source to allow the child process to run and finish
		source.push(null);

		// Wait until 'end' or timeout
		await new Promise((resolve, reject) => {
			const to = setTimeout(() => {
				reject(new Error('timeout waiting for end'));
			}, 2000);
			out.on('end', () => {
				clearTimeout(to);
				resolve(undefined);
			});
			proc.on('end', () => {
				clearTimeout(to);
				resolve(undefined);
			});
		});

		expect(events).toContain('start');
		expect(events).toContain('end');
	});

	test('error event is emitted on non-zero exit', async () => {
		process.env.FFMPEG_PATH = '/usr/bin/false';
		const source = new Readable({
			read() {
				// nop
			}
		});
		const out = new PassThrough();

		const proc = ffmpeg({ source });

		await new Promise<void>((resolve, reject) => {
			const to = setTimeout(() => {
				reject(new Error('timeout waiting for error'));
			}, 2000);
			proc.on('error', (error: unknown) => {
				clearTimeout(to);
				try {
					expect(error).toBeInstanceOf(Error);
					// error message should include exit code
					expect(String(error)).toMatch(/exited with code/);
					resolve();
				} catch (error_) {
					reject(error_);
				}
			});
			proc.on('end', () => {
				clearTimeout(to);
				reject(new Error('unexpected end event'));
			});
			proc.writeToStream(out);
			source.push(null);
		});
	});

	test('writeToStream with end: false does not end destination stream', async () => {
		process.env.FFMPEG_PATH = '/usr/bin/true';
		const source = new Readable({
			read() {
				// nop
			}
		});
		const out = new PassThrough();

		const proc = ffmpeg({ source });

		// start and don't let the wrapper end the destination stream
		proc.writeToStream(out, { end: false });

		source.push(null);

		await new Promise<void>((resolve, reject) => {
			const to = setTimeout(() => {
				reject(new Error('timeout waiting for end'));
			}, 2000);
			proc.on('end', () => {
				clearTimeout(to);
				// the child finished; ensure the destination stream was NOT ended by the pipe
				try {
					expect(out.writableEnded).toBe(false);
					resolve();
				} catch (error) {
					reject(error);
				}
			});
		});
	});
});
