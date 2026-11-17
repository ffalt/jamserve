import { describe, expect, test } from '@jest/globals';
import { lyricsSlug, shortenLyricsTitle } from '../../src/utils/lyrics-slug.js';

describe('lyricsSlug function', () => {
	test.each([
		['The Beatles', 'thebeatles'],
		['the beatles', 'thebeatles'],
		['  The   Beatles  ', 'thebeatles'],
		['The Beatles!', 'thebeatles'],
		['Björk', 'bjork'],
		['Bjork', 'bjork'],
		['Sigur Rós', 'sigurros'],
		['Motörhead', 'motorhead'],
		['AC/DC', 'acdc'],
		['Guns N\' Roses', 'gunsnroses'],
		['Jay-Z', 'jayz'],
		['P!nk', 'pnk'],
		['Blink-182', 'blink182'],
		['Пикник', 'пикник'],
		['', '']
	])('normalizes %p to %p', (value, expected) => {
		expect(lyricsSlug(value)).toBe(expected);
	});

	test('maps tag spelling variants of the same name to one key', () => {
		const variants = ['Hey Jude', 'hey jude', 'HEY JUDE', 'Hey  Jude', 'Hey-Jude', 'Hey Jude.'];
		expect(new Set(variants.map(value => lyricsSlug(value))).size).toBe(1);
	});

	test('keeps a bracketed version distinct from the plain title', () => {
		expect(lyricsSlug('Hey Jude (Remastered 2009)')).not.toBe(lyricsSlug('Hey Jude'));
	});
});

describe('shortenLyricsTitle function', () => {
	test.each([
		['Hey Jude (Remastered 2009)', 'Hey Jude'],
		['Hey Jude [Live]', 'Hey Jude'],
		['Hey Jude / Revolution', 'Hey Jude'],
		['Intro: The Beginning', 'Intro'],
		['Umbrella feat. Jay-Z', 'Umbrella'],
		['Umbrella ft. Jay-Z', 'Umbrella'],
		['Umbrella featuring Jay-Z', 'Umbrella'],
		['Umbrella (feat. Jay-Z)', 'Umbrella']
	])('shortens %p to %p', (title, expected) => {
		expect(shortenLyricsTitle(title)).toBe(expected);
	});

	test.each([
		'Hey Jude',
		'Dancing with Myself',
		'Featuring',
		'(Instrumental)',
		'[Untitled]',
		''
	])('returns undefined for %p', title => {
		expect(shortenLyricsTitle(title)).toBeUndefined();
	});

	test('trims the shortened title', () => {
		expect(shortenLyricsTitle('Hey Jude   (Remastered)')).toBe('Hey Jude');
	});
});
