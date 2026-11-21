import { jest, describe, expect, test } from '@jest/globals';
import { Op } from 'sequelize';
import { isSyncedLyricsMarkedUnavailable, markSyncedLyricsUnavailable, SYNCED_LYRICS_MARKER_TTL_MS, syncedLyricsUnavailableKey } from '../../../src/entity/metadata/lyrics-sync-cache.js';
import { MetadataType } from '../../../src/types/enums.js';
import type { Orm } from '../../../src/modules/engine/services/orm.service.js';
import type { Tag } from '../../../src/entity/tag/tag.js';

function makeTag(values: Partial<Tag> = {}): Tag {
	return { title: 'The Song', artist: 'The Artist', ...values } as Tag;
}

function makeOrm(found?: unknown) {
	const created = { name: '', dataType: MetadataType.lyrics, data: '' };
	return {
		MetaData: {
			findOne: jest.fn().mockResolvedValue(found as never),
			create: jest.fn().mockReturnValue(created as never),
			persistAndFlush: jest.fn().mockResolvedValue(undefined as never),
			removeByQueryAndFlush: jest.fn().mockResolvedValue(0 as never)
		}
	};
}

describe('syncedLyricsUnavailableKey', () => {
	test('builds a key from the slugged artist and title', () => {
		expect(syncedLyricsUnavailableKey(makeTag())).toBe('lyrics-synced-unavailable/theartist/thesong');
	});

	test('falls back to the album artist', () => {
		expect(syncedLyricsUnavailableKey(makeTag({ artist: undefined, albumArtist: 'The Band' }))).toBe('lyrics-synced-unavailable/theband/thesong');
	});

	test('builds no key without a title', () => {
		expect(syncedLyricsUnavailableKey(makeTag({ title: undefined }))).toBeUndefined();
	});
});

describe('markSyncedLyricsUnavailable', () => {
	test('stores one lyrics cache entry', async () => {
		const orm = makeOrm();
		await markSyncedLyricsUnavailable(orm as unknown as Orm, makeTag());
		expect(orm.MetaData.create).toHaveBeenCalledWith({ name: 'lyrics-synced-unavailable/theartist/thesong', dataType: MetadataType.lyrics, data: JSON.stringify({ syncedLyrics: false }) });
		expect(orm.MetaData.persistAndFlush).toHaveBeenCalled();
	});

	test('replaces an earlier marker instead of adding a second row', async () => {
		const orm = makeOrm({ name: 'lyrics-synced-unavailable/theartist/thesong' });
		await markSyncedLyricsUnavailable(orm as unknown as Orm, makeTag());
		expect(orm.MetaData.removeByQueryAndFlush).toHaveBeenCalledWith({ where: { name: 'lyrics-synced-unavailable/theartist/thesong', dataType: MetadataType.lyrics } });
		expect(orm.MetaData.create).toHaveBeenCalled();
	});

	test('stores nothing without a title', async () => {
		const orm = makeOrm();
		await markSyncedLyricsUnavailable(orm as unknown as Orm, makeTag({ title: undefined }));
		expect(orm.MetaData.create).not.toHaveBeenCalled();
	});
});

describe('isSyncedLyricsMarkedUnavailable', () => {
	test('is false without a title', async () => {
		const orm = makeOrm({ name: 'anything' });
		expect(await isSyncedLyricsMarkedUnavailable(orm as unknown as Orm, makeTag({ title: undefined }))).toBe(false);
		expect(orm.MetaData.findOne).not.toHaveBeenCalled();
	});

	test('looks the entry up by name and lyrics type', async () => {
		const orm = makeOrm();
		await isSyncedLyricsMarkedUnavailable(orm as unknown as Orm, makeTag());
		const where = (orm.MetaData.findOne.mock.calls.at(0)?.at(0) as { where: { name: string; dataType: MetadataType } }).where;
		expect(where.name).toBe('lyrics-synced-unavailable/theartist/thesong');
		expect(where.dataType).toBe(MetadataType.lyrics);
	});

	test('only accepts a marker written inside the time to live', async () => {
		const orm = makeOrm();
		const before = Date.now();
		await isSyncedLyricsMarkedUnavailable(orm as unknown as Orm, makeTag());
		const where = (orm.MetaData.findOne.mock.calls.at(0)?.at(0) as { where: { createdAt: Record<symbol, Date> } }).where;
		const freshSince = where.createdAt[Op.gte];
		expect(freshSince.getTime()).toBeGreaterThanOrEqual(before - SYNCED_LYRICS_MARKER_TTL_MS);
		expect(freshSince.getTime()).toBeLessThanOrEqual(Date.now() - SYNCED_LYRICS_MARKER_TTL_MS + 1000);
	});

	test('expires a marker after a month', () => {
		expect(SYNCED_LYRICS_MARKER_TTL_MS).toBe(30 * 24 * 60 * 60 * 1000);
	});

	test('treats a marker older than the time to live as absent', async () => {
		const orm = makeOrm();
		expect(await isSyncedLyricsMarkedUnavailable(orm as unknown as Orm, makeTag())).toBe(false);
	});
});
