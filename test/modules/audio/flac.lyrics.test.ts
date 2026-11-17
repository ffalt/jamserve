import { describe, expect, jest, test } from '@jest/globals';
import { AudioModuleFLAC } from '../../../src/modules/audio/formats/flac.module.js';
import { ImageModule } from '../../../src/modules/image/image.module.js';
import { MediaTagRaw } from '../../../src/entity/tag/tag.model.js';
import { flacToRawTag } from '../../../src/modules/audio/metadata.js';
import { FORMAT } from '../../../src/modules/audio/audio.format.js';
import { Flac } from '../../../src/modules/audio/formats/flac/index.js';

describe('AudioModuleFLAC.writeLyrics', () => {
	let flac: AudioModuleFLAC;

	beforeEach(() => {
		flac = new AudioModuleFLAC({} as ImageModule);
	});

	const lrc = '[ti:Song]\n[00:12.34]first line\n[00:15.00]second line';

	test('writes plain text to USLT and synced events to SYLT frame', async () => {
		let writtenTag: MediaTagRaw | undefined;
		jest.spyOn(flac, 'readRaw').mockResolvedValue({ version: 4, frames: {} });
		jest.spyOn(flac, 'write').mockImplementation(async (_filename, tag) => {
			writtenTag = tag;
		});

		await flac.writeLyrics('test.flac', { syncedLyrics: lrc, language: 'eng' });

		expect(writtenTag).toBeDefined();
		expect(writtenTag?.frames.USLT).toEqual([
			{ id: 'USLT', value: { id: 'lyrics', language: 'eng', text: 'first line\nsecond line' } }
		]);
		expect(writtenTag?.frames.SYLT).toEqual([
			{
				id: 'SYLT',
				value: {
					id: 'lyrics',
					language: 'eng',
					timestampFormat: 2,
					contentType: 1,
					events: [
						{ timestamp: 12_340, text: 'first line' },
						{ timestamp: 15_000, text: 'second line' }
					]
				}
			}
		]);
	});

	test('writes plain lyrics without SYLT frame and clears prior SYLT frames', async () => {
		let writtenTag: MediaTagRaw | undefined;
		jest.spyOn(flac, 'readRaw').mockResolvedValue({
			version: 4,
			frames: {
				SYLT: [{ id: 'SYLT', value: {} }],
				ULT: [{ id: 'ULT', value: {} }],
				SLT: [{ id: 'SLT', value: {} }]
			}
		});
		jest.spyOn(flac, 'write').mockImplementation(async (_filename, tag) => {
			writtenTag = tag;
		});

		await flac.writeLyrics('test.flac', { lyrics: 'plain text' });

		expect(writtenTag).toBeDefined();
		expect(writtenTag?.frames.USLT).toEqual([
			{ id: 'USLT', value: { id: 'lyrics', language: 'und', text: 'plain text' } }
		]);
		expect(writtenTag?.frames.SYLT).toBeUndefined();
		expect(writtenTag?.frames.ULT).toBeUndefined();
		expect(writtenTag?.frames.SLT).toBeUndefined();
	});

	test('prefers explicit plain lyrics for USLT while keeping SYLT from syncedLyrics', async () => {
		let writtenTag: MediaTagRaw | undefined;
		jest.spyOn(flac, 'readRaw').mockResolvedValue({ version: 4, frames: {} });
		jest.spyOn(flac, 'write').mockImplementation(async (_filename, tag) => {
			writtenTag = tag;
		});

		await flac.writeLyrics('test.flac', { lyrics: 'explicit plain', syncedLyrics: lrc });

		expect(writtenTag).toBeDefined();
		expect(writtenTag?.frames.USLT).toEqual([
			{ id: 'USLT', value: { id: 'lyrics', language: 'und', text: 'explicit plain' } }
		]);
		expect(writtenTag?.frames.SYLT).toBeDefined();
		expect(writtenTag?.frames.SYLT?.[0].value.events).toHaveLength(2);
	});

	test('does nothing without lyrics', async () => {
		const writeSpy = jest.spyOn(flac, 'write').mockResolvedValue();
		await flac.writeLyrics('test.flac', {});
		expect(writeSpy).not.toHaveBeenCalled();
	});
});

describe('AudioModuleFLAC tag and comment roundtrip', () => {
	const syncedComment = 'lang=eng;format=2;contentType=1;id=lyrics;first line@12340|second line@15000';

	test('flacToRawTag parses SYNCHRONISEDLYRICS into SYLT frame', async () => {
		const raw = await flacToRawTag({
			comment: {
				vendor: 'jamserve',
				tag: {
					TITLE: 'Song',
					LYRICS: 'first line\nsecond line',
					SYNCHRONISEDLYRICS: syncedComment
				}
			}
		});

		expect(raw).toBeDefined();
		expect(raw?.frames.USLT?.[0].value).toEqual({
			id: '',
			language: '',
			text: 'first line\nsecond line'
		});
		expect(raw?.frames.SYLT?.[0].value).toEqual({
			id: 'lyrics',
			language: 'eng',
			timestampFormat: 2,
			contentType: 1,
			events: [
				{ timestamp: 12_340, text: 'first line' },
				{ timestamp: 15_000, text: 'second line' }
			]
		});
	});

	test('FORMAT.packFlacVorbisCommentJamServeTag unpacks syncedlyrics and lyrics', () => {
		const tag = FORMAT.packFlacVorbisCommentJamServeTag({
			vendor: 'jamserve',
			tag: {
				TITLE: 'Song',
				LYRICS: 'first line\nsecond line',
				SYNCHRONISEDLYRICS: syncedComment
			}
		});

		expect(tag).toBeDefined();
		expect(tag?.lyrics).toBe('first line\nsecond line');
		expect(tag?.syncedlyrics).toBe('[00:12.34]first line\n[00:15.00]second line');
	});

	test('extractTagSyncedLyrics returns structured synced lyrics', async () => {
		const flac = new AudioModuleFLAC({} as ImageModule);
		jest.spyOn(Flac.prototype, 'read').mockResolvedValue({
			comment: {
				vendor: 'jamserve',
				tag: {
					SYNCHRONISEDLYRICS: syncedComment
				}
			}
		});

		const result = await flac.extractTagSyncedLyrics('test.flac');
		expect(result).toEqual({
			language: 'eng',
			contentType: 'lyrics',
			timestampFormat: 'milliseconds',
			events: [
				{ timestamp: 12_340, text: 'first line' },
				{ timestamp: 15_000, text: 'second line' }
			]
		});
	});
});
