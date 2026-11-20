import { describe, expect, jest, test } from '@jest/globals';
import { MetadataService } from '../../../src/entity/metadata/metadata.service.js';
import type { Orm } from '../../../src/modules/engine/services/orm.service.js';
import type { Track } from '../../../src/entity/track/track.js';
import type { Tag } from '../../../src/entity/tag/tag.js';

describe('MetadataService.lyricsByTrack', () => {
	const service = new MetadataService();
	(service as any).configService = {
		env: {
			lyrics: {
				writeSidecar: false
			}
		}
	};

	test('preserves exact source URL from LRCLIB lookup', async () => {
		const mockTag = {
			title: 'Test Track',
			artist: 'Test Artist',
			album: 'Test Album'
		} as Tag;

		const mockTrack = {
			id: 'track-1',
			fileName: 'track.mp3',
			path: '/music',
			tag: {
				get: jest.fn().mockResolvedValue(mockTag as never)
			}
		} as unknown as Track;

		const orm = {} as Orm;

		jest.spyOn(service, 'lyricsLrcLibByTrackTag').mockResolvedValue({
			lyrics: 'Plain lyrics',
			syncedLyrics: '[00:01.00]Synced lyrics',
			source: 'https://lrclib.net/api/get/12345'
		});

		const result = await service.lyricsByTrack(orm, mockTrack);
		expect(result).toEqual({
			entries: [{
				lyrics: 'Plain lyrics',
				syncedLyrics: '[00:01.00]Synced lyrics',
				syncedLines: [{ timestamp: 1000, text: 'Synced lyrics' }],
				source: 'https://lrclib.net/api/get/12345'
			}]
		});
	});

	test('preserves exact source URL from LyricsOVH when LRCLIB has no lyrics', async () => {
		const mockTag = {
			title: 'Another Track',
			artist: 'Another Artist'
		} as Tag;

		const mockTrack = {
			id: 'track-2',
			fileName: 'track2.mp3',
			path: '/music',
			tag: {
				get: jest.fn().mockResolvedValue(mockTag as never)
			}
		} as unknown as Track;

		const orm = {} as Orm;

		jest.spyOn(service, 'lyricsLrcLibByTrackTag').mockResolvedValue({});
		jest.spyOn(service, 'lyricsOVHByTrackTag').mockResolvedValue({
			lyrics: 'OVH lyrics',
			source: 'https://api.lyrics.ovh/v1/Another%20Artist/Another%20Track'
		});

		const result = await service.lyricsByTrack(orm, mockTrack);
		expect(result).toEqual({
			entries: [{
				lyrics: 'OVH lyrics',
				source: 'https://api.lyrics.ovh/v1/Another%20Artist/Another%20Track'
			}]
		});
	});

	test('falls back to default source identifiers when provider source is omitted', async () => {
		const mockTag = {
			title: 'Fallback Track',
			artist: 'Fallback Artist'
		} as Tag;

		const mockTrack = {
			id: 'track-3',
			fileName: 'track3.mp3',
			path: '/music',
			tag: {
				get: jest.fn().mockResolvedValue(mockTag as never)
			}
		} as unknown as Track;

		const orm = {} as Orm;

		jest.spyOn(service, 'lyricsLrcLibByTrackTag').mockResolvedValue({
			lyrics: 'Fallback lrclib lyrics'
		});

		const result = await service.lyricsByTrack(orm, mockTrack);
		expect(result).toEqual({
			entries: [{
				lyrics: 'Fallback lrclib lyrics',
				source: 'lrclib'
			}]
		});
	});

	test('returns an empty list when no lyrics are found', async () => {
		const mockTag = {
			title: 'Unknown Track',
			artist: 'Unknown Artist'
		} as Tag;

		const mockTrack = {
			id: 'track-4',
			fileName: 'track4.mp3',
			path: '/music',
			tag: {
				get: jest.fn().mockResolvedValue(mockTag as never)
			}
		} as unknown as Track;

		jest.spyOn(service, 'lyricsLrcLibByTrackTag').mockResolvedValue({});
		jest.spyOn(service, 'lyricsOVHByTrackTag').mockResolvedValue({});

		const result = await service.lyricsByTrack({} as Orm, mockTrack);
		expect(result).toEqual({ entries: [] });
	});

	test('reports the stored lyrics language of the embedded synced tag lyrics', async () => {
		const mockTag = {
			title: 'Synced Track',
			artist: 'Synced Artist',
			syncedlyrics: '[00:00.50]First line\n[00:02.25]Second line',
			lyricslanguage: 'eng'
		} as Tag;

		const mockTrack = {
			id: 'track-6',
			fileName: 'track6.mp3',
			path: '/music',
			tag: {
				get: jest.fn().mockResolvedValue(mockTag as never)
			}
		} as unknown as Track;

		const result = await service.lyricsByTrack({} as Orm, mockTrack);
		expect(result.entries).toHaveLength(1);
		expect(result.entries[0].language).toBe('eng');
		expect(result.entries[0].source).toBe('tag');
	});

	test('reports the stored lyrics language of the embedded unsynced tag lyrics', async () => {
		const mockTag = {
			title: 'Plain Track',
			artist: 'Plain Artist',
			lyrics: 'Eine Zeile',
			lyricslanguage: 'deu'
		} as Tag;

		const mockTrack = {
			id: 'track-7',
			fileName: 'track7.mp3',
			path: '/music',
			tag: {
				get: jest.fn().mockResolvedValue(mockTag as never)
			}
		} as unknown as Track;

		const result = await service.lyricsByTrack({} as Orm, mockTrack);
		expect(result.entries).toEqual([{ lyrics: 'Eine Zeile', language: 'deu', source: 'tag' }]);
	});

	test('parses synced lyrics of embedded tag lyrics without querying external services', async () => {
		const mockTag = {
			title: 'Embedded Track',
			artist: 'Embedded Artist',
			syncedlyrics: '[00:00.50]First line\n[00:02.25]<00:02.25>Second line'
		} as Tag;

		const mockTrack = {
			id: 'track-5',
			fileName: 'track5.mp3',
			path: '/music',
			tag: {
				get: jest.fn().mockResolvedValue(mockTag as never)
			}
		} as unknown as Track;

		const lrclib = jest.spyOn(service, 'lyricsLrcLibByTrackTag').mockResolvedValue({});
		lrclib.mockClear();

		const result = await service.lyricsByTrack({} as Orm, mockTrack);
		expect(lrclib).not.toHaveBeenCalled();
		expect(result.entries).toHaveLength(1);
		expect(result.entries[0].source).toBe('tag');
		expect(result.entries[0].syncedLines).toEqual([
			{ timestamp: 500, text: 'First line' },
			{ timestamp: 2250, text: 'Second line' }
		]);
	});

	describe('lyrics selection parameters', () => {
		function syncedTrack(id: string) {
			const mockTag = {
				title: 'Selected Track',
				artist: 'Selected Artist',
				syncedlyrics: '[00:00.50]First line\n[00:02.25]Second line',
				lyricslanguage: 'eng'
			} as Tag;

			return {
				id,
				fileName: `${id}.mp3`,
				path: '/music',
				tag: {
					get: jest.fn().mockResolvedValue(mockTag as never)
				}
			} as unknown as Track;
		}

		test('includes everything when no parameters are given', async () => {
			const result = await service.lyricsByTrack({} as Orm, syncedTrack('track-9'));
			expect(result.entries[0].lyrics).toBe('First line\nSecond line');
			expect(result.entries[0].syncedLyrics).toBe('[00:00.50]First line\n[00:02.25]Second line');
			expect(result.entries[0].syncedLines).toHaveLength(2);
		});

		test('returns only the parsed synced lyrics when the others are excluded', async () => {
			const result = await service.lyricsByTrack({} as Orm, syncedTrack('track-10'), {
				lyricsIncPlain: false,
				lyricsIncSynced: false,
				lyricsIncParsedSynced: true
			});
			expect(result.entries).toEqual([{
				lyrics: undefined,
				syncedLyrics: undefined,
				syncedLines: [
					{ timestamp: 500, text: 'First line' },
					{ timestamp: 2250, text: 'Second line' }
				],
				language: 'eng',
				source: 'tag'
			}]);
		});

		test('returns only the plain lyrics when the synced ones are excluded', async () => {
			const result = await service.lyricsByTrack({} as Orm, syncedTrack('track-11'), {
				lyricsIncPlain: true,
				lyricsIncSynced: false,
				lyricsIncParsedSynced: false
			});
			expect(result.entries[0].lyrics).toBe('First line\nSecond line');
			expect(result.entries[0].syncedLyrics).toBeUndefined();
			expect(result.entries[0].syncedLines).toBeUndefined();
		});

		test('drops entries that have nothing left after the selection', async () => {
			const mockTag = { title: 'Plain Only', artist: 'Plain Artist', lyrics: 'Just plain' } as Tag;
			const mockTrack = {
				id: 'track-12',
				fileName: 'track12.mp3',
				path: '/music',
				tag: { get: jest.fn().mockResolvedValue(mockTag as never) }
			} as unknown as Track;

			jest.spyOn(service, 'lyricsLrcLibByTrackTag').mockResolvedValue({});
			jest.spyOn(service, 'lyricsOVHByTrackTag').mockResolvedValue({});

			const result = await service.lyricsByTrack({} as Orm, mockTrack, { lyricsIncPlain: false });
			expect(result.entries).toEqual([]);
		});
	});
});
