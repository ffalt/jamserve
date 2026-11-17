import { describe, expect, test } from '@jest/globals';
import { buildLyrics, eventsToLyrics, formatLyricsTimestamp, hasLyricsTimestamps, lyricsLanguageCode, lyricsToEvents, parseLyrics, parseSimplifiedSynchronisedLyrics, plainLyrics, removeWordTimestamps } from '../../src/utils/lyrics-lrc.js';

const lrc = [
	'[ti:Song]',
	'[ar:Artist]',
	'[00:12.34]first line',
	'[00:15.00]second line',
	'[01:05.5]third line'
].join('\n');

describe('hasLyricsTimestamps', () => {
	test.each([
		['[00:12.34]line', true],
		['[01:05]line', true],
		['[00:12.345]line', true],
		['just text', false],
		['[ti:Song]\nplain text', false],
		['', false]
	])('detects timestamps in %p as %p', (value, expected) => {
		expect(hasLyricsTimestamps(value)).toBe(expected);
	});
});

describe('parseLyrics', () => {
	test('reads id tags and timed lines', () => {
		const parsed = parseLyrics(lrc);
		expect(parsed.tags).toEqual({ ti: 'Song', ar: 'Artist' });
		expect(parsed.lines).toEqual([
			{ timestamp: 12_340, text: 'first line' },
			{ timestamp: 15_000, text: 'second line' },
			{ timestamp: 65_500, text: 'third line' }
		]);
	});

	test('expands a line with repeated timestamps', () => {
		const parsed = parseLyrics('[00:10.00][00:40.00]chorus');
		expect(parsed.lines).toEqual([
			{ timestamp: 10_000, text: 'chorus' },
			{ timestamp: 40_000, text: 'chorus' }
		]);
	});

	test('parses multiple timestamps with inline text on the same line', () => {
		const parsed = parseLyrics('[00:10.00]First stanza [00:20.00]Second stanza');
		expect(parsed.lines).toEqual([
			{ timestamp: 10_000, text: 'First stanza' },
			{ timestamp: 20_000, text: 'Second stanza' }
		]);
	});

	test('parses mixed repeated timestamps and inline text on the same line', () => {
		const parsed = parseLyrics('[00:05.00][00:10.00]Chorus [00:20.00]Outro');
		expect(parsed.lines).toEqual([
			{ timestamp: 5000, text: 'Chorus' },
			{ timestamp: 10_000, text: 'Chorus' },
			{ timestamp: 20_000, text: 'Outro' }
		]);
	});

	test('handles lines ending with an empty timestamp', () => {
		const parsed = parseLyrics('[00:10.00]First stanza [00:20.00]');
		expect(parsed.lines).toEqual([
			{ timestamp: 10_000, text: 'First stanza' },
			{ timestamp: 20_000, text: '' }
		]);
	});

	test('sorts lines by timestamp', () => {
		const parsed = parseLyrics('[00:20.00]later\n[00:10.00]earlier');
		expect(parsed.lines.map(line => line.text)).toEqual(['earlier', 'later']);
	});

	test('accepts three digit fractions and colon separators', () => {
		expect(parseLyrics('[00:01.5]a').lines[0].timestamp).toBe(1500);
		expect(parseLyrics('[00:01.05]a').lines[0].timestamp).toBe(1050);
		expect(parseLyrics('[00:01.005]a').lines[0].timestamp).toBe(1005);
		expect(parseLyrics('[00:01:50]a').lines[0].timestamp).toBe(1500);
	});

	test('keeps empty lines out of the result', () => {
		expect(parseLyrics('\n\n[00:01.00]a\n\n').lines).toHaveLength(1);
	});

	test('ignores lines without a timestamp', () => {
		expect(parseLyrics('no timing here').lines).toHaveLength(0);
	});
});

describe('buildLyrics', () => {
	test('writes id tags before the timed lines', () => {
		const result = buildLyrics([{ timestamp: 12_340, text: 'first line' }], { ti: 'Song', ar: 'Artist' });
		expect(result).toBe('[ti:Song]\n[ar:Artist]\n[00:12.34]first line');
	});

	test('skips empty id tags', () => {
		expect(buildLyrics([], { ti: 'Song', ar: undefined })).toBe('[ti:Song]');
	});

	test('round trips a parsed file', () => {
		const parsed = parseLyrics(lrc);
		const rebuilt = buildLyrics(parsed.lines, { ti: parsed.tags.ti, ar: parsed.tags.ar });
		expect(parseLyrics(rebuilt).lines).toEqual(parsed.lines);
	});
});

describe('formatLyricsTimestamp', () => {
	test.each([
		[0, '[00:00.00]'],
		[1500, '[00:01.50]'],
		[65_500, '[01:05.50]'],
		[600_000, '[10:00.00]'],
		[-10, '[00:00.00]']
	])('formats %p as %p', (value, expected) => {
		expect(formatLyricsTimestamp(value)).toBe(expected);
	});
});

describe('plainLyrics', () => {
	test('removes id tags and timestamps', () => {
		expect(plainLyrics(lrc)).toBe('first line\nsecond line\nthird line');
	});

	test('removes word timestamps', () => {
		expect(plainLyrics('[00:12.34]<00:12.34>hello <00:12.90>world')).toBe('hello world');
	});

	test('keeps text without timestamps as is', () => {
		expect(plainLyrics('first line\nsecond line')).toBe('first line\nsecond line');
	});

	test('preserves stanza breaks while normalizing excessive blank lines', () => {
		const lyricsWithStanzas = '[00:01.00]Verse 1 line 1\n[00:03.00]Verse 1 line 2\n\n\n[00:10.00]Verse 2 line 1\n[00:12.00]Verse 2 line 2';
		expect(plainLyrics(lyricsWithStanzas)).toBe('Verse 1 line 1\nVerse 1 line 2\n\nVerse 2 line 1\nVerse 2 line 2');
	});

	test('trims leading and trailing empty lines from plain lyrics', () => {
		const lyricsWithPaddedBlanks = '\n\n[ti:Song]\n\n[00:01.00]Line 1\n[00:05.00]Line 2\n\n\n';
		expect(plainLyrics(lyricsWithPaddedBlanks)).toBe('Line 1\nLine 2');
	});
});

describe('removeWordTimestamps', () => {
	test('drops the word tags and collapses the gaps', () => {
		expect(removeWordTimestamps('<00:12.34>hello <00:12.90>world')).toBe('hello world');
	});
});

describe('lyricsToEvents', () => {
	test('converts a file to timed events without word timestamps', () => {
		expect(lyricsToEvents('[00:12.34]<00:12.34>hello <00:12.90>world')).toEqual([{ timestamp: 12_340, text: 'hello world' }]);
	});

	test('round trips events back to a file', () => {
		const events = lyricsToEvents(lrc);
		expect(lyricsToEvents(eventsToLyrics(events))).toEqual(events);
	});
});

describe('lyricsLanguageCode', () => {
	test.each([
		['eng', 'eng'],
		['DEU', 'deu'],
		['en', 'und'],
		['english', 'und'],
		[undefined, 'und'],
		['', 'und']
	])('maps %p to %p', (value, expected) => {
		expect(lyricsLanguageCode(value)).toBe(expected);
	});
});

describe('parseSimplifiedSynchronisedLyrics', () => {
	test('parses simplified ID3v2/Vorbis format with metadata and events', () => {
		const raw = 'lang=eng;format=2;contentType=1;id=lyrics;first line@12340|second line@15000';
		const parsed = parseSimplifiedSynchronisedLyrics(raw);
		expect(parsed).toEqual({
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

	test('parses raw LRC timestamped text', () => {
		const raw = '[00:12.34]first line\n[00:15.00]second line';
		const parsed = parseSimplifiedSynchronisedLyrics(raw);
		expect(parsed).toEqual({
			id: 'lyrics',
			language: 'und',
			timestampFormat: 2,
			contentType: 1,
			events: [
				{ timestamp: 12_340, text: 'first line' },
				{ timestamp: 15_000, text: 'second line' }
			]
		});
	});

	test('returns undefined for empty or event-less values', () => {
		expect(parseSimplifiedSynchronisedLyrics(undefined)).toBeUndefined();
		expect(parseSimplifiedSynchronisedLyrics('')).toBeUndefined();
		expect(parseSimplifiedSynchronisedLyrics('lang=eng;format=2;contentType=1;id=lyrics')).toBeUndefined();
		expect(parseSimplifiedSynchronisedLyrics('plain lyrics without timestamps')).toBeUndefined();
	});
});
