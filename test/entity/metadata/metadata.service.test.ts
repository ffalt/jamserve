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
			lyrics: 'Plain lyrics',
			syncedLyrics: '[00:01.00]Synced lyrics',
			source: 'https://lrclib.net/api/get/12345'
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
			lyrics: 'OVH lyrics',
			source: 'https://api.lyrics.ovh/v1/Another%20Artist/Another%20Track'
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
			lyrics: 'Fallback lrclib lyrics',
			source: 'lrclib'
		});
	});
});
