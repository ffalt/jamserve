import { afterEach, beforeEach, describe, expect, test } from '@jest/globals';
import fse from 'fs-extra';
import path from 'node:path';
import { addLyricsHeader, lyricsFromText, lyricsSidecarCandidates, readLyricsSidecar, writeLyricsSidecar } from '../../../src/modules/audio/lyrics-file.js';

const testPath = path.resolve('./local/__tests__/lyrics-file/');
const audioFile = path.join(testPath, 'Artist - Song.mp3');

const lrc = '[00:12.34]first line\n[00:15.00]second line';

describe('lyrics sidecar files', () => {
	beforeEach(async () => {
		await fse.ensureDir(testPath);
		await fse.writeFile(audioFile, 'not really audio');
	});

	afterEach(async () => {
		await fse.remove(testPath);
	});

	describe('lyricsSidecarCandidates', () => {
		test('lists the base name and the full file name for every extension', () => {
			const candidates = lyricsSidecarCandidates(audioFile).map(candidate => path.basename(candidate));
			expect(candidates).toEqual([
				'Artist - Song.lrc',
				'Artist - Song.mp3.lrc',
				'Artist - Song.elrc',
				'Artist - Song.mp3.elrc',
				'Artist - Song.txt',
				'Artist - Song.mp3.txt'
			]);
		});
	});

	describe('lyricsFromText', () => {
		test('splits a timed file into synced and plain lyrics', () => {
			expect(lyricsFromText(lrc, 'file')).toEqual({ syncedLyrics: lrc, lyrics: 'first line\nsecond line', source: 'file' });
		});

		test('keeps text without timestamps as plain lyrics', () => {
			expect(lyricsFromText('first line', 'tag')).toEqual({ lyrics: 'first line', source: 'tag' });
		});

		test('strips a byte order mark', () => {
			expect(lyricsFromText('\u{FEFF}first line', 'file')?.lyrics).toBe('first line');
		});

		test('returns nothing for empty content', () => {
			expect(lyricsFromText('  \n  ', 'file')).toBeUndefined();
		});
	});

	describe('readLyricsSidecar', () => {
		test('reads a .lrc file next to the track', async () => {
			await fse.writeFile(path.join(testPath, 'Artist - Song.lrc'), lrc);
			expect(await readLyricsSidecar(audioFile)).toEqual({ syncedLyrics: lrc, lyrics: 'first line\nsecond line', source: 'file' });
		});

		test('reads a .lrc file named after the full file name', async () => {
			await fse.writeFile(path.join(testPath, 'Artist - Song.mp3.lrc'), lrc);
			expect((await readLyricsSidecar(audioFile))?.syncedLyrics).toBe(lrc);
		});

		test('reads a .txt file as plain lyrics', async () => {
			await fse.writeFile(path.join(testPath, 'Artist - Song.txt'), 'first line\nsecond line');
			expect(await readLyricsSidecar(audioFile)).toEqual({ lyrics: 'first line\nsecond line', source: 'file' });
		});

		test('prefers the synced file over the plain one', async () => {
			await fse.writeFile(path.join(testPath, 'Artist - Song.lrc'), lrc);
			await fse.writeFile(path.join(testPath, 'Artist - Song.txt'), 'plain only');
			expect((await readLyricsSidecar(audioFile))?.syncedLyrics).toBe(lrc);
		});

		test('returns nothing when no file exists', async () => {
			expect(await readLyricsSidecar(audioFile)).toBeUndefined();
		});

		test('skips an empty file', async () => {
			await fse.writeFile(path.join(testPath, 'Artist - Song.lrc'), '');
			expect(await readLyricsSidecar(audioFile)).toBeUndefined();
		});
	});

	describe('writeLyricsSidecar', () => {
		test('writes synced lyrics as .lrc with a header', async () => {
			const written = await writeLyricsSidecar(audioFile, { syncedLyrics: lrc, source: 'lrclib' }, { title: 'Song', artist: 'Artist', album: 'Album', duration: 125 });
			expect(written).toBe(path.join(testPath, 'Artist - Song.lrc'));
			const content = await fse.readFile(written!, 'utf8');
			expect(content).toBe('[ti:Song]\n[ar:Artist]\n[al:Album]\n[length:02:05]\n[by:lrclib]\n[re:jamserve]\n[00:12.34]first line\n[00:15.00]second line\n');
		});

		test('writes plain lyrics as .txt', async () => {
			const written = await writeLyricsSidecar(audioFile, { lyrics: 'first line', source: 'lyrics.ovh' });
			expect(written).toBe(path.join(testPath, 'Artist - Song.txt'));
			expect(await fse.readFile(written!, 'utf8')).toBe('first line\n');
		});

		test('never overwrites an existing file', async () => {
			await fse.writeFile(path.join(testPath, 'Artist - Song.lrc'), 'mine');
			expect(await writeLyricsSidecar(audioFile, { syncedLyrics: lrc })).toBeUndefined();
			expect(await fse.readFile(path.join(testPath, 'Artist - Song.lrc'), 'utf8')).toBe('mine');
		});

		test('writes synced lyrics when only a plain txt file exists', async () => {
			await fse.writeFile(path.join(testPath, 'Artist - Song.txt'), 'plain only');
			const written = await writeLyricsSidecar(audioFile, { syncedLyrics: lrc });
			expect(written).toBe(path.join(testPath, 'Artist - Song.lrc'));
			expect(await fse.pathExists(path.join(testPath, 'Artist - Song.lrc'))).toBe(true);
			expect(await fse.pathExists(path.join(testPath, 'Artist - Song.txt'))).toBe(true);
		});

		test('does not write plain lyrics when a synced file exists', async () => {
			await fse.writeFile(path.join(testPath, 'Artist - Song.lrc'), lrc);
			expect(await writeLyricsSidecar(audioFile, { lyrics: 'plain only' })).toBeUndefined();
			expect(await fse.pathExists(path.join(testPath, 'Artist - Song.txt'))).toBe(false);
		});

		test('writes nothing without lyrics', async () => {
			expect(await writeLyricsSidecar(audioFile, {})).toBeUndefined();
		});

		test('leaves no temporary file behind', async () => {
			await writeLyricsSidecar(audioFile, { syncedLyrics: lrc });
			const list = await fse.readdir(testPath);
			expect(list.some(name => name.endsWith('.jam-write'))).toBe(false);
		});

		test('writes a file that reads back as the same lyrics', async () => {
			await writeLyricsSidecar(audioFile, { syncedLyrics: lrc, source: 'lrclib' }, { title: 'Song', artist: 'Artist' });
			expect((await readLyricsSidecar(audioFile))?.lyrics).toBe('first line\nsecond line');
		});
	});

	describe('addLyricsHeader', () => {
		test('keeps a file that already has id tags unchanged', () => {
			const tagged = `[ti:Other]\n${lrc}`;
			expect(addLyricsHeader(tagged, { title: 'Song' }, 'lrclib')).toBe(tagged);
		});

		test('leaves out unknown values', () => {
			expect(addLyricsHeader(lrc, {}, undefined)).toBe('[re:jamserve]\n[00:12.34]first line\n[00:15.00]second line');
		});
	});
});
