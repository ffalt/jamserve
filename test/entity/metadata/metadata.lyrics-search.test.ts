import { describe, expect, jest, test } from '@jest/globals';
import { MetadataService } from '../../../src/entity/metadata/metadata.service.js';
import type { Orm } from '../../../src/modules/engine/services/orm.service.js';
import type { LyricsSearchParameters } from '../../../src/entity/metadata/metadata.parameters.js';

const search: LyricsSearchParameters = { title: 'Jerry Was a Race Car Driver', artist: 'Primus', album: 'Sailing the Seas of Cheese', duration: 191 };

function makeService(): MetadataService {
	return new MetadataService();
}

const orm = {} as Orm;

describe('MetadataService.lyricsBySearch', () => {
	test('reports nothing when no service has lyrics', async () => {
		const service = makeService();
		jest.spyOn(service, 'lrclibFind').mockResolvedValue({});
		jest.spyOn(service, 'lrclibSearch').mockResolvedValue({});
		jest.spyOn(service, 'lyricsOVH').mockResolvedValue({});
		expect(await service.lyricsBySearch(orm, search)).toEqual({ entries: [] });
	});

	test('asks lrclib before lyrics.ovh', async () => {
		const service = makeService();
		const order: Array<string> = [];
		jest.spyOn(service, 'lrclibFind').mockImplementation(async () => {
			order.push('lrclib-find');
			return {};
		});
		jest.spyOn(service, 'lrclibSearch').mockImplementation(async () => {
			order.push('lrclib-search');
			return {};
		});
		jest.spyOn(service, 'lyricsOVH').mockImplementation(async () => {
			order.push('lyrics.ovh');
			return {};
		});
		await service.lyricsBySearch(orm, search);
		expect(order).toEqual(['lrclib-find', 'lrclib-search', 'lyrics.ovh']);
	});

	test('reports every distinct hit, not only the first', async () => {
		const service = makeService();
		jest.spyOn(service, 'lrclibFind').mockResolvedValue({ syncedLyrics: '[00:01.00]from the exact record', source: 'https://lrclib.net/api/get/1' });
		jest.spyOn(service, 'lrclibSearch').mockResolvedValue({ syncedLyrics: '[00:02.00]from the keyword search', source: 'https://lrclib.net/api/get/2' });
		jest.spyOn(service, 'lyricsOVH').mockResolvedValue({ lyrics: 'from lyrics.ovh', source: 'https://lyrics.ovh/x' });
		const { entries } = await service.lyricsBySearch(orm, search);
		expect(entries.map(entry => entry.source)).toEqual(['https://lrclib.net/api/get/1', 'https://lrclib.net/api/get/2', 'https://lyrics.ovh/x']);
	});

	test('reports the same lyrics only once', async () => {
		const service = makeService();
		jest.spyOn(service, 'lrclibFind').mockResolvedValue({ syncedLyrics: '[00:01.00]same text', source: 'https://lrclib.net/api/get/1' });
		jest.spyOn(service, 'lrclibSearch').mockResolvedValue({ syncedLyrics: '[00:01.00]same text', source: 'https://lrclib.net/api/get/1' });
		jest.spyOn(service, 'lyricsOVH').mockResolvedValue({});
		const { entries } = await service.lyricsBySearch(orm, search);
		expect(entries).toHaveLength(1);
	});

	test('keeps the results of the other services when one fails', async () => {
		const service = makeService();
		jest.spyOn(service, 'lrclibFind').mockRejectedValue(new Error('lrclib is down'));
		jest.spyOn(service, 'lrclibSearch').mockRejectedValue(new Error('lrclib is down'));
		jest.spyOn(service, 'lyricsOVH').mockResolvedValue({ lyrics: 'still found', source: 'https://lyrics.ovh/x' });
		const { entries } = await service.lyricsBySearch(orm, search);
		expect(entries.map(entry => entry.lyrics)).toEqual(['still found']);
	});

	test('falls back to the service name when a result carries no source', async () => {
		const service = makeService();
		jest.spyOn(service, 'lrclibFind').mockResolvedValue({ lyrics: 'no source given' });
		jest.spyOn(service, 'lrclibSearch').mockResolvedValue({});
		jest.spyOn(service, 'lyricsOVH').mockResolvedValue({});
		const { entries } = await service.lyricsBySearch(orm, search);
		expect(entries.at(0)?.source).toBe('lrclib');
	});

	test('passes the album and duration to the exact lookup', async () => {
		const service = makeService();
		const find = jest.spyOn(service, 'lrclibFind').mockResolvedValue({});
		jest.spyOn(service, 'lrclibSearch').mockResolvedValue({});
		jest.spyOn(service, 'lyricsOVH').mockResolvedValue({});
		await service.lyricsBySearch(orm, search);
		expect(find).toHaveBeenCalledWith(orm, 'Jerry Was a Race Car Driver', 'Primus', 'Sailing the Seas of Cheese', 191);
	});

	test('drops a duration the lyrics service would reject', async () => {
		const service = makeService();
		const find = jest.spyOn(service, 'lrclibFind').mockResolvedValue({});
		jest.spyOn(service, 'lrclibSearch').mockResolvedValue({});
		jest.spyOn(service, 'lyricsOVH').mockResolvedValue({});
		await service.lyricsBySearch(orm, { ...search, duration: 99_999 });
		expect(find).toHaveBeenCalledWith(orm, 'Jerry Was a Race Car Driver', 'Primus', 'Sailing the Seas of Cheese', undefined);
	});

	test('searches without the album, which is the tag most likely to differ', async () => {
		const service = makeService();
		jest.spyOn(service, 'lrclibFind').mockResolvedValue({});
		const keyword = jest.spyOn(service, 'lrclibSearch').mockResolvedValue({});
		jest.spyOn(service, 'lyricsOVH').mockResolvedValue({});
		await service.lyricsBySearch(orm, search);
		expect(keyword).toHaveBeenCalledWith(orm, 'Jerry Was a Race Car Driver', 'Primus', undefined, 191);
	});

	test('leaves out the synced lines when they are not asked for', async () => {
		const service = makeService();
		jest.spyOn(service, 'lrclibFind').mockResolvedValue({ syncedLyrics: '[00:01.00]a line' });
		jest.spyOn(service, 'lrclibSearch').mockResolvedValue({});
		jest.spyOn(service, 'lyricsOVH').mockResolvedValue({});
		const { entries } = await service.lyricsBySearch(orm, search, { lyricsIncParsedSynced: false });
		expect(entries.at(0)?.syncedLines).toBeUndefined();
	});

	test('parses the synced lines by default', async () => {
		const service = makeService();
		jest.spyOn(service, 'lrclibFind').mockResolvedValue({ syncedLyrics: '[00:01.00]a line' });
		jest.spyOn(service, 'lrclibSearch').mockResolvedValue({});
		jest.spyOn(service, 'lyricsOVH').mockResolvedValue({});
		const { entries } = await service.lyricsBySearch(orm, search);
		expect(entries.at(0)?.syncedLines).toEqual([{ timestamp: 1000, text: 'a line' }]);
	});
});
