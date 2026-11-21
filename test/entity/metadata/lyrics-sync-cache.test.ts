import { jest, describe, expect, test } from '@jest/globals';
import { isSyncedLyricsMarkedUnavailable, markSyncedLyricsUnavailable, syncedLyricsUnavailableKey } from '../../../src/entity/metadata/lyrics-sync-cache.js';
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
			persistAndFlush: jest.fn().mockResolvedValue(undefined as never)
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

	test('stores nothing for a track that is already marked', async () => {
		const orm = makeOrm({ name: 'lyrics-synced-unavailable/theartist/thesong' });
		await markSyncedLyricsUnavailable(orm as unknown as Orm, makeTag());
		expect(orm.MetaData.create).not.toHaveBeenCalled();
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
		expect(await isSyncedLyricsMarkedUnavailable(orm as unknown as Orm, makeTag())).toBe(false);
		expect(orm.MetaData.findOne).toHaveBeenCalledWith({ where: { name: 'lyrics-synced-unavailable/theartist/thesong', dataType: MetadataType.lyrics } });
	});
});
