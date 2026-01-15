import { describe, expect, test } from '@jest/globals';
import {
	getFileType,
	SupportedReadImageFormat,
	SupportedWriteImageFormat,
	SupportedAudioFormat,
	SupportedTranscodeAudioFormat
} from '../../src/utils/filetype.js';
import { FileTyp } from '../../src/types/enums.js';

describe('filetype functions and constants', () => {
	describe('SupportedReadImageFormat', () => {
		test.each(['png', 'jpeg', 'jpg', 'gif', 'tiff', 'webp'])('should contain expected image formats', input => {
			expect(SupportedReadImageFormat).toContain(input);
		});
	});

	describe('SupportedWriteImageFormat', () => {
		test.each(['png', 'jpeg', 'jpg', 'tiff', 'webp'])('should contain expected image formats', input => {
			expect(SupportedWriteImageFormat).toContain(input);
		});

		test('should contain unexpected image formats', () => {
			// gif should not be in write formats
			expect(SupportedWriteImageFormat).not.toContain('gif');
		});
	});

	describe('SupportedAudioFormat', () => {
		test.each(['mp3', 'm4a', 'm4b', 'mp4', 'ogg', 'oga', 'flac', 'webma', 'wav'])('should contain expected audio formats', input => {
			expect(SupportedAudioFormat).toContain(input);
		});
	});
	describe('SupportedTranscodeAudioFormat', () => {
		test.each(['mp3', 'm4a', 'm4b', 'mp4', 'ogg', 'oga', 'flv', 'flac', 'webma', 'wav'])('should contain expected transcode audio formats', input => {
			expect(SupportedTranscodeAudioFormat).toContain(input);
		});
	});

	describe('getFileType', () => {
		test.each([
			'image.png',
			'image.jpg',
			'image.jpeg',
			'image.gif',
			'image.tiff',
			'image.webp',
			'image.PNG',
			'image.JPG',
			'image.wav.tiff'
		])('should identify image files', input => {
			expect(getFileType(input)).toBe(FileTyp.image);
		});

		test.each([
			'audio.mp3',
			'audio.flac',
			'audio.m4a',
			'audio.m4b',
			'audio.mp4',
			'audio.ogg',
			'audio.oga',
			'audio.webma',
			'audio.wav',
			'audio.MP3',
			'audio.FLAC',
			'audio.jpg.mp3'
		])('should identify audio files', input => {
			expect(getFileType(input)).toBe(FileTyp.audio);
		});

		test.each([
			'file.tag',
			'file.mp3.tag',
			'file.TAG'
		])('should identify tag files', input => {
			expect(getFileType(input)).toBe(FileTyp.tag);
		});

		test.each([
			'file.bak',
			'file.mp3.bak',
			'file.BAK'
		])('should identify backup files', input => {
			expect(getFileType(input)).toBe(FileTyp.backup);
		});

		test.each([
			'file',
			'file.',
			'file.txt',
			'file.tiff.txt',
			'file.mp3.pdf'
		])('should classify other files', input => {
			expect(getFileType(input)).toBe(FileTyp.other);
		});

		test('should handle paths', () => {
			expect(getFileType('/path/to/image.png')).toBe(FileTyp.image);
			expect(getFileType('/path/to/audio.mp3')).toBe(FileTyp.audio);
			expect(getFileType('/path/to/file.tag')).toBe(FileTyp.tag);
			expect(getFileType('/path/to/file.bak')).toBe(FileTyp.backup);
			expect(getFileType('/path/to/file.txt')).toBe(FileTyp.other);
		});
	});
});
