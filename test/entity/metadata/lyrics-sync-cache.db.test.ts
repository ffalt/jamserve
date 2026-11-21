import { describe, beforeEach, afterEach, expect, it } from '@jest/globals';
import tmp from 'tmp';
import fse from 'fs-extra';
import { Op } from 'sequelize';
import { bindMockConfig, DBConfigs, getTestContainer } from '../../mock/mock.config.js';
import { waitEngineStart } from '../../mock/mock.engine.js';
import { EngineService } from '../../../src/modules/engine/services/engine.service.js';
import { Orm } from '../../../src/modules/engine/services/orm.service.js';
import { isSyncedLyricsMarkedUnavailable, markSyncedLyricsUnavailable, SYNCED_LYRICS_MARKER_TTL_MS, syncedLyricsUnavailableKey } from '../../../src/entity/metadata/lyrics-sync-cache.js';
import { MetadataType } from '../../../src/types/enums.js';
import { Tag } from '../../../src/entity/tag/tag.js';

const tag = { title: 'The Song', artist: 'The Artist' } as Tag;

describe.each(DBConfigs)('synced lyrics marker with %o', db => {
	let engine: EngineService;
	let orm: Orm;
	let dir: tmp.DirResult;

	beforeEach(async () => {
		dir = tmp.dirSync();
		bindMockConfig(dir.name, db);
		engine = getTestContainer().get(EngineService);
		await engine.init();
		await engine.orm.drop();
		await engine.start();
		await waitEngineStart(engine);
		orm = engine.orm.fork();
	});

	afterEach(async () => {
		await engine.stop();
		await fse.remove(dir.name);
	});

	// sequelize manages createdAt and resets it on update, so an aged row has to be created as one
	async function writeMarkerAged(milliseconds: number): Promise<void> {
		const name = syncedLyricsUnavailableKey(tag)!;
		await orm.MetaData.removeByQueryAndFlush({ where: { name, dataType: MetadataType.lyrics } });
		const entry = orm.MetaData.create({ name, dataType: MetadataType.lyrics, data: JSON.stringify({ syncedLyrics: false }), createdAt: new Date(Date.now() - milliseconds) });
		await orm.MetaData.persistAndFlush(entry);
	}

	it('reports no marker before anything is written', async () => {
		expect(await isSyncedLyricsMarkedUnavailable(orm, tag)).toBe(false);
	});

	it('reports a freshly written marker', async () => {
		await markSyncedLyricsUnavailable(orm, tag);
		expect(await isSyncedLyricsMarkedUnavailable(orm, tag)).toBe(true);
	});

	it('still reports a marker just inside the time to live', async () => {
		await writeMarkerAged(SYNCED_LYRICS_MARKER_TTL_MS - 60_000);
		expect(await isSyncedLyricsMarkedUnavailable(orm, tag)).toBe(true);
	});

	it('ignores a marker that has outlived the time to live', async () => {
		await writeMarkerAged(SYNCED_LYRICS_MARKER_TTL_MS + 60_000);
		expect(await isSyncedLyricsMarkedUnavailable(orm, tag)).toBe(false);
	});

	it('keeps a single row when an expired marker is written again', async () => {
		const name = syncedLyricsUnavailableKey(tag)!;
		await writeMarkerAged(SYNCED_LYRICS_MARKER_TTL_MS + 60_000);
		await markSyncedLyricsUnavailable(orm, tag);
		expect(await orm.MetaData.count({ where: { name, dataType: MetadataType.lyrics } })).toBe(1);
	});

	it('reports the marker again after it was rewritten', async () => {
		await writeMarkerAged(SYNCED_LYRICS_MARKER_TTL_MS + 60_000);
		await markSyncedLyricsUnavailable(orm, tag);
		expect(await isSyncedLyricsMarkedUnavailable(orm, tag)).toBe(true);
	});

	it('keeps markers of different tracks apart', async () => {
		await markSyncedLyricsUnavailable(orm, tag);
		expect(await isSyncedLyricsMarkedUnavailable(orm, { title: 'Other', artist: 'The Artist' } as Tag)).toBe(false);
	});

	it('stores the marker as a lyrics metadata row', async () => {
		await markSyncedLyricsUnavailable(orm, tag);
		const entry = await orm.MetaData.findOneOrFail({ where: { name: syncedLyricsUnavailableKey(tag)!, dataType: MetadataType.lyrics } });
		expect(JSON.parse(entry.data)).toEqual({ syncedLyrics: false });
	});

	it('leaves markers of other ages untouched when one is rewritten', async () => {
		await markSyncedLyricsUnavailable(orm, tag);
		const other = orm.MetaData.create({ name: 'lyrics-synced-unavailable/other/track', dataType: MetadataType.lyrics, data: '{}' });
		await orm.MetaData.persistAndFlush(other);
		await markSyncedLyricsUnavailable(orm, tag);
		expect(await orm.MetaData.count({ where: { dataType: MetadataType.lyrics, createdAt: { [Op.lte]: new Date() } } })).toBe(2);
	});
});
