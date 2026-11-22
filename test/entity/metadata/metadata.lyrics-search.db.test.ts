import { describe, beforeEach, afterEach, expect, it, jest } from '@jest/globals';
import tmp from 'tmp';
import fse from 'fs-extra';
import { bindMockConfig, DBConfigs, getTestContainer } from '../../mock/mock.config.js';
import { waitEngineStart } from '../../mock/mock.engine.js';
import { EngineService } from '../../../src/modules/engine/services/engine.service.js';
import { Orm } from '../../../src/modules/engine/services/orm.service.js';
import { MetadataService } from '../../../src/entity/metadata/metadata.service.js';
import { MetadataType } from '../../../src/types/enums.js';
import { LYRICS_MISS_TTL_MS } from '../../../src/entity/metadata/metadata.service.js';
import type { LyricsSearchParameters } from '../../../src/entity/metadata/metadata.parameters.js';
import type { TrackLyrics } from '../../../src/entity/track/track.model.js';

const search: LyricsSearchParameters = { title: 'Jerry Was a Race Car Driver', artist: 'Primus', album: 'Sailing the Seas of Cheese', duration: 191 };
const found: TrackLyrics = { syncedLyrics: '[00:01.00]a line', source: 'https://lrclib.net/api/get/1' };

describe.each(DBConfigs)('lyrics search storage with %o', db => {
	let engine: EngineService;
	let orm: Orm;
	let service: MetadataService;
	let dir: tmp.DirResult;
	let lrclibFind: ReturnType<typeof jest.fn>;
	let lrclibFindBySearch: ReturnType<typeof jest.fn>;
	let lyricsOVHSearch: ReturnType<typeof jest.fn>;

	beforeEach(async () => {
		dir = tmp.dirSync();
		bindMockConfig(dir.name, db);
		engine = getTestContainer().get(EngineService);
		await engine.init();
		await engine.orm.drop();
		await engine.start();
		await waitEngineStart(engine);
		orm = engine.orm.fork();
		service = engine.metadata;
		lrclibFind = jest.fn(async () => ({}) as TrackLyrics);
		lrclibFindBySearch = jest.fn(async () => ({}) as TrackLyrics);
		lyricsOVHSearch = jest.fn(async () => ({}) as TrackLyrics);
		(service as any).audioModule = {
			lrclib: { find: lrclibFind, findBySearch: lrclibFindBySearch },
			lyricsOVH: { search: lyricsOVHSearch }
		};
	});

	afterEach(async () => {
		await engine.stop();
		await fse.remove(dir.name);
	});

	async function lyricsRows(): Promise<Array<{ name: string; data: string }>> {
		return orm.MetaData.find({ where: { dataType: MetadataType.lyrics } });
	}

	it('stores a row for every attempt when nothing was found', async () => {
		await service.lyricsBySearch(orm, search);
		expect(await lyricsRows()).toHaveLength(3);
	});

	it('stores an empty result for an attempt that found no lyrics', async () => {
		await service.lyricsBySearch(orm, search);
		const rows = await lyricsRows();
		expect(rows.every(row => row.data === '{}')).toBe(true);
	});

	it('stores the lyrics of a successful attempt', async () => {
		lrclibFind.mockResolvedValue(found as never);
		await service.lyricsBySearch(orm, search);
		const rows = await lyricsRows();
		const stored = rows.find(row => row.name.startsWith('lrclib-find/'));
		expect(JSON.parse(stored?.data ?? '{}')).toEqual(found);
	});

	it('answers a repeated search from the table instead of the service', async () => {
		await service.lyricsBySearch(orm, search);
		await service.lyricsBySearch(orm, search);
		expect(lrclibFind).toHaveBeenCalledTimes(1);
	});

	it('does not add a second row for a repeated search', async () => {
		await service.lyricsBySearch(orm, search);
		await service.lyricsBySearch(orm, search);
		expect(await lyricsRows()).toHaveLength(3);
	});

	it('returns the stored lyrics on the repeated search', async () => {
		lrclibFind.mockResolvedValue(found as never);
		await service.lyricsBySearch(orm, search);
		const { entries } = await service.lyricsBySearch(orm, search);
		expect(entries.at(0)?.syncedLyrics).toBe(found.syncedLyrics);
	});

	it('keeps searches of different songs apart', async () => {
		await service.lyricsBySearch(orm, search);
		await service.lyricsBySearch(orm, { ...search, title: 'Tommy the Cat' });
		expect(await lyricsRows()).toHaveLength(6);
	});

	// sequelize manages createdAt and resets it on update, so an aged row has to be created as one
	async function ageRows(milliseconds: number): Promise<void> {
		const rows = await lyricsRows();
		await orm.MetaData.removeByQueryAndFlush({ where: { dataType: MetadataType.lyrics } });
		for (const row of rows) {
			const entry = orm.MetaData.create({ name: row.name, dataType: MetadataType.lyrics, data: row.data, createdAt: new Date(Date.now() - milliseconds) });
			await orm.MetaData.persistAndFlush(entry);
		}
	}

	it('keeps answering from a miss that is still young', async () => {
		await service.lyricsBySearch(orm, search);
		await ageRows(LYRICS_MISS_TTL_MS - 60_000);
		await service.lyricsBySearch(orm, search);
		expect(lrclibFind).toHaveBeenCalledTimes(1);
	});

	it('retries a miss that is older than the time to live', async () => {
		await service.lyricsBySearch(orm, search);
		await ageRows(LYRICS_MISS_TTL_MS + 60_000);
		await service.lyricsBySearch(orm, search);
		expect(lrclibFind).toHaveBeenCalledTimes(2);
	});

	it('keeps a single row when an expired miss is retried', async () => {
		await service.lyricsBySearch(orm, search);
		await ageRows(LYRICS_MISS_TTL_MS + 60_000);
		await service.lyricsBySearch(orm, search);
		expect(await lyricsRows()).toHaveLength(3);
	});

	it('reports the lyrics a retried miss finds the second time', async () => {
		await service.lyricsBySearch(orm, search);
		await ageRows(LYRICS_MISS_TTL_MS + 60_000);
		lrclibFind.mockResolvedValue(found as never);
		const { entries } = await service.lyricsBySearch(orm, search);
		expect(entries.at(0)?.syncedLyrics).toBe(found.syncedLyrics);
	});

	it('never retries a stored result, however old it is', async () => {
		lrclibFind.mockResolvedValue(found as never);
		await service.lyricsBySearch(orm, search);
		await ageRows(LYRICS_MISS_TTL_MS * 12);
		await service.lyricsBySearch(orm, search);
		expect(lrclibFind).toHaveBeenCalledTimes(1);
	});

	it('stores nothing for an attempt that failed with an error', async () => {
		lrclibFind.mockRejectedValue(new Error('lrclib is down') as never);
		await service.lyricsBySearch(orm, search);
		const rows = await lyricsRows();
		expect(rows.some(row => row.name.startsWith('lrclib-find/'))).toBe(false);
	});

	it('still stores the attempts that did answer', async () => {
		lrclibFind.mockRejectedValue(new Error('lrclib is down') as never);
		await service.lyricsBySearch(orm, search);
		expect(await lyricsRows()).toHaveLength(2);
	});
});
