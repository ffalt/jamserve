import { describe, expect, test } from '@jest/globals';
import { AudioModule } from '../../../src/modules/audio/audio.module.js';

describe('AudioModule format support checks', () => {
	const audio = new AudioModule();

	test('isWriteSupported returns true for mp3 and flac, false for others', () => {
		expect(audio.isWriteSupported('test.mp3')).toBe(true);
		expect(audio.isWriteSupported('test.flac')).toBe(true);
		expect(audio.isWriteSupported('test.ogg')).toBe(false);
		expect(audio.isWriteSupported('test.wav')).toBe(false);
		expect(audio.isWriteSupported('test.m4a')).toBe(false);
		expect(audio.isWriteSupported('test.mp4')).toBe(false);
		expect(audio.isWriteSupported('mp3')).toBe(true);
		expect(audio.isWriteSupported('flac')).toBe(true);
	});

	test('isWriteLyricsSupported returns true for mp3 and flac, false for others', () => {
		expect(audio.isWriteLyricsSupported('test.mp3')).toBe(true);
		expect(audio.isWriteLyricsSupported('test.flac')).toBe(true);
		expect(audio.isWriteLyricsSupported('test.ogg')).toBe(false);
		expect(audio.isWriteLyricsSupported('test.wav')).toBe(false);
		expect(audio.isWriteLyricsSupported('test.m4a')).toBe(false);
		expect(audio.isWriteLyricsSupported('test.mp4')).toBe(false);
		expect(audio.isWriteLyricsSupported('mp3')).toBe(true);
		expect(audio.isWriteLyricsSupported('flac')).toBe(true);
	});
});
