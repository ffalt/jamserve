import { jest } from '@jest/globals';
import { TrackController } from '../../../src/entity/track/track.controller.js';
import type { Context } from '../../../src/modules/engine/rest/context.js';
import { mockUser } from '../shared/mock-data.js';
import { ApiError } from '../../../src/modules/deco/express/express-error.js';

const defaultLyrics = { entries: [{ lyrics: 'some lyrics' }] };

describe('TrackController lyricsEmbed & rawTagSet format validation', () => {
	const controller = new TrackController();

	function makeContext(fileName: string, lyricsData: { entries: Array<{ lyrics?: string; syncedLyrics?: string }> } = defaultLyrics) {
		const mockTrack = {
			id: 'track-1',
			fileName,
			path: '/path/to',
			root: {
				idOrFail: () => 'root-1'
			}
		};

		const orm = {
			Track: {
				oneOrFailByID: jest.fn().mockResolvedValue(mockTrack as never)
			}
		};

		const engine = {
			audio: {
				isWriteSupported: jest.fn((name: string) => name.endsWith('.mp3') || name.endsWith('.flac')),
				isWriteRawTagSupported: jest.fn((name: string) => name.endsWith('.mp3') || name.endsWith('.flac')),
				isWriteLyricsSupported: jest.fn((name: string) => name.endsWith('.mp3') || name.endsWith('.flac'))
			},
			metadata: {
				lyricsByTrack: jest.fn().mockResolvedValue(lyricsData as never)
			},
			io: {
				track: {
					embedLyrics: jest.fn().mockResolvedValue({ id: 'job-1' } as never),
					writeTags: jest.fn().mockResolvedValue({ id: 'job-2' } as never)
				}
			}
		};

		const context = { orm, engine, user: mockUser } as unknown as Context;
		return { orm, engine, ctx: context };
	}

	test('lyricsEmbed rejects unsupported audio format with invalidParameterError', async () => {
		const { ctx } = makeContext('song.ogg');

		await expect(controller.lyricsEmbed('track-1', ctx)).rejects.toThrow(ApiError);
		await expect(controller.lyricsEmbed('track-1', ctx)).rejects.toMatchObject({
			failCode: 422,
			message: expect.stringContaining('Embedding lyrics is not supported for ogg format')
		});
	});

	test('lyricsEmbed rejects when track has no lyrics', async () => {
		const { ctx } = makeContext('song.mp3', { entries: [] });

		await expect(controller.lyricsEmbed('track-1', ctx)).rejects.toThrow(ApiError);
		await expect(controller.lyricsEmbed('track-1', ctx)).rejects.toMatchObject({
			failCode: 404,
			message: expect.stringContaining('No lyrics found for this track')
		});
	});

	test('lyricsEmbed enqueues embedLyrics job for mp3 track', async () => {
		const { engine, ctx } = makeContext('song.mp3');

		const result = await controller.lyricsEmbed('track-1', ctx);
		expect(engine.io.track.embedLyrics).toHaveBeenCalledWith('track-1', { lyrics: 'some lyrics' }, 'root-1');
		expect(result).toEqual({ id: 'job-1' });
	});

	test('lyricsEmbed enqueues embedLyrics job for flac track', async () => {
		const { engine, ctx } = makeContext('song.flac');

		const result = await controller.lyricsEmbed('track-1', ctx);
		expect(engine.io.track.embedLyrics).toHaveBeenCalledWith('track-1', { lyrics: 'some lyrics' }, 'root-1');
		expect(result).toEqual({ id: 'job-1' });
	});

	test('rawTagSet rejects unsupported audio format with invalidParameterError', async () => {
		const { ctx } = makeContext('song.wav');

		await expect(controller.rawTagSet({ id: 'track-1', tag: { version: 0, frames: {} } as any }, ctx)).rejects.toThrow(ApiError);
		await expect(controller.rawTagSet({ id: 'track-1', tag: { version: 0, frames: {} } as any }, ctx)).rejects.toMatchObject({
			failCode: 422,
			message: expect.stringContaining('Writing tags is not supported for wav format')
		});
	});

	test('rawTagSet enqueues writeTags job for supported format', async () => {
		const { engine, ctx } = makeContext('song.mp3');

		const result = await controller.rawTagSet({ id: 'track-1', tag: { version: 0, frames: {} } as any }, ctx);
		expect(engine.io.track.writeTags).toHaveBeenCalledWith('track-1', { version: 0, frames: {} }, 'root-1');
		expect(result).toEqual({ id: 'job-2' });
	});
});
