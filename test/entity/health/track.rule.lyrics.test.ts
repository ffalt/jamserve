import { jest, afterEach, beforeEach, describe, expect, test } from '@jest/globals';
import fse from 'fs-extra';
import path from 'node:path';
import { TrackRulesChecker } from '../../../src/entity/health/track.rule.js';
import { AudioFormatType, MetadataType, TrackHealthID } from '../../../src/types/enums.js';
import type { Orm } from '../../../src/modules/engine/services/orm.service.js';
import type { AudioModule } from '../../../src/modules/audio/audio.module.js';
import type { Track } from '../../../src/entity/track/track.js';
import type { Tag } from '../../../src/entity/tag/tag.js';

const testPath = path.resolve('./local/__tests__/track-rule-lyrics/');
const fileName = 'Artist - Song.flac';
const lrc = '[00:12.34]first line\n[00:15.00]second line';

function makeTag(values: Partial<Tag> = {}): Tag {
	return { mediaFormat: AudioFormatType.flac, album: 'Album', artist: 'Artist', albumArtist: 'Artist', title: 'Song', genres: ['Rock'], trackNr: 1, trackTotal: 10, year: 2020, ...values } as Tag;
}

function makeTrack(tag: Tag): Track {
	return {
		path: testPath,
		fileName,
		series: { id: () => undefined },
		tag: { get: async () => tag },
		folder: { getOrFail: async () => ({ albumType: undefined }) }
	} as unknown as Track;
}

function makeOrm(found?: unknown): Orm {
	return { MetaData: { findOne: jest.fn().mockResolvedValue(found as never) } } as unknown as Orm;
}

async function runChecker(orm: Orm, tag: Tag): Promise<Array<TrackHealthID>> {
	const checker = new TrackRulesChecker({} as AudioModule);
	const hints = await checker.run(orm, makeTrack(tag), false);
	return hints.map(hint => hint.id);
}

describe('TrackRulesChecker synced lyrics', () => {
	beforeEach(async () => {
		await fse.ensureDir(testPath);
		await fse.writeFile(path.join(testPath, fileName), 'not really audio');
	});

	afterEach(async () => {
		await fse.remove(testPath);
	});

	test('reports a track without any lyrics', async () => {
		expect(await runChecker(makeOrm(), makeTag())).toContain(TrackHealthID.lyricsSyncedExists);
	});

	test('accepts synced lyrics in the tag', async () => {
		expect(await runChecker(makeOrm(), makeTag({ syncedlyrics: lrc }))).not.toContain(TrackHealthID.lyricsSyncedExists);
	});

	test('accepts timestamps found in the plain lyrics tag', async () => {
		expect(await runChecker(makeOrm(), makeTag({ lyrics: lrc }))).not.toContain(TrackHealthID.lyricsSyncedExists);
	});

	test('reports a track with non-synced lyrics in the tag', async () => {
		expect(await runChecker(makeOrm(), makeTag({ lyrics: 'first line' }))).toContain(TrackHealthID.lyricsSyncedExists);
	});

	test('accepts a synced sidecar file', async () => {
		await fse.writeFile(path.join(testPath, 'Artist - Song.lrc'), lrc);
		expect(await runChecker(makeOrm(), makeTag())).not.toContain(TrackHealthID.lyricsSyncedExists);
	});

	test('reports a track with a plain sidecar file only', async () => {
		await fse.writeFile(path.join(testPath, 'Artist - Song.txt'), 'first line');
		expect(await runChecker(makeOrm(), makeTag())).toContain(TrackHealthID.lyricsSyncedExists);
	});

	test('stays silent for a track marked as unavailable online', async () => {
		const orm = makeOrm({ name: 'lyrics-synced-unavailable/artist/song', dataType: MetadataType.lyrics });
		expect(await runChecker(orm, makeTag())).not.toContain(TrackHealthID.lyricsSyncedExists);
	});

	test('reports a track without a title, since it cannot be looked up', async () => {
		expect(await runChecker(makeOrm(), makeTag({ title: undefined }))).toContain(TrackHealthID.lyricsSyncedExists);
	});
});
