import { afterEach, beforeEach, describe, expect, test } from '@jest/globals';
import fse from 'fs-extra';
import path from 'node:path';
import { ID3v2, IID3V2 } from 'jamp3';
import { AudioModuleMP3 } from '../../../src/modules/audio/formats/mp3.module.js';
import { writeMP3Track } from '../../mock/mock.track.js';

const testPath = path.resolve('./local/__tests__/mp3-lyrics/');
const audioFile = path.join(testPath, 'track.mp3');

const lrc = '[ti:Song]\n[00:12.34]first line\n[00:15.00]second line';

async function readFrames(id: string): Promise<Array<IID3V2.Frame>> {
	const tag = await new ID3v2().read(audioFile);
	const frames: Array<IID3V2.Frame> = tag?.frames ?? [];
	return frames.filter(frame => frame.id === id);
}

describe('AudioModuleMP3.writeLyrics', () => {
	const mp3 = new AudioModuleMP3();

	beforeEach(async () => {
		await fse.ensureDir(testPath);
		await writeMP3Track(audioFile);
	});

	afterEach(async () => {
		await fse.remove(testPath);
	});

	test('writes the plain text into an USLT frame', async () => {
		await mp3.writeLyrics(audioFile, { syncedLyrics: lrc, language: 'eng' });
		const frames = await readFrames('USLT');
		expect(frames).toHaveLength(1);
		expect((frames[0].value as IID3V2.FrameValue.LangDescText).text).toBe('first line\nsecond line');
		expect((frames[0].value as IID3V2.FrameValue.LangDescText).language).toBe('eng');
	});

	test('writes the timed lines into a SYLT frame', async () => {
		await mp3.writeLyrics(audioFile, { syncedLyrics: lrc });
		const frames = await readFrames('SYLT');
		expect(frames).toHaveLength(1);
		const value = frames[0].value as IID3V2.FrameValue.SynchronisedLyrics;
		expect(value.contentType).toBe(1);
		expect(value.timestampFormat).toBe(2);
		expect(value.language).toBe('und');
		expect(value.events).toEqual([
			{ timestamp: 12_340, text: 'first line' },
			{ timestamp: 15_000, text: 'second line' }
		]);
	});

	test('reads the written lyrics back as synced lyrics', async () => {
		await mp3.writeLyrics(audioFile, { syncedLyrics: lrc });
		const result = await mp3.extractTagSyncedLyrics(audioFile);
		expect(result?.contentType).toBe('lyrics');
		expect(result?.timestampFormat).toBe('milliseconds');
		expect(result?.events.map(event => event.text)).toEqual(['first line', 'second line']);
	});

	test('writes plain lyrics without a SYLT frame', async () => {
		await mp3.writeLyrics(audioFile, { lyrics: 'first line\nsecond line' });
		expect(await readFrames('SYLT')).toHaveLength(0);
		expect((await readFrames('USLT')).length).toBe(1);
	});

	test('keeps the scanned tag readable as lyrics', async () => {
		await mp3.writeLyrics(audioFile, { syncedLyrics: lrc });
		const scanned = await mp3.read(audioFile);
		expect(scanned.lyrics).toBe('first line\nsecond line');
	});

	test('scans the lyrics language of the SYLT frame into the tag', async () => {
		await mp3.writeLyrics(audioFile, { syncedLyrics: lrc, language: 'eng' });
		const scanned = await mp3.read(audioFile);
		expect(scanned.lyricslanguage).toBe('eng');
	});

	test('scans the lyrics language of the USLT frame into the tag', async () => {
		await mp3.writeLyrics(audioFile, { lyrics: 'first line\nsecond line', language: 'deu' });
		const scanned = await mp3.read(audioFile);
		expect(scanned.lyricslanguage).toBe('deu');
	});

	test('leaves the lyrics language unset when no frame declares one', async () => {
		await mp3.writeLyrics(audioFile, { syncedLyrics: lrc });
		const scanned = await mp3.read(audioFile);
		expect(scanned.lyricslanguage).toBeUndefined();
	});

	test('prefers explicit plain lyrics for USLT frame when both are provided', async () => {
		await mp3.writeLyrics(audioFile, { lyrics: 'explicit plain', syncedLyrics: lrc });
		const usltFrames = await readFrames('USLT');
		expect(usltFrames).toHaveLength(1);
		expect((usltFrames[0].value as IID3V2.FrameValue.LangDescText).text).toBe('explicit plain');
		const syltFrames = await readFrames('SYLT');
		expect(syltFrames).toHaveLength(1);
	});

	test('replaces lyrics frames instead of adding more', async () => {
		await mp3.writeLyrics(audioFile, { syncedLyrics: lrc });
		await mp3.writeLyrics(audioFile, { lyrics: 'other lyrics' });
		expect(await readFrames('SYLT')).toHaveLength(0);
		const frames = await readFrames('USLT');
		expect(frames).toHaveLength(1);
		expect((frames[0].value as IID3V2.FrameValue.LangDescText).text).toBe('other lyrics');
	});

	test('does nothing without lyrics', async () => {
		await mp3.writeLyrics(audioFile, {});
		expect(await readFrames('USLT')).toHaveLength(0);
	});
});
