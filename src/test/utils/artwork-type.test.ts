import { describe, expect, test } from '@jest/globals';
import { artWorkImageNameToType } from '../../utils/artwork-type.js';
import { ArtworkImageType } from '../../types/enums.js';

describe('artWorkImageNameToType function', () => {
	describe('matching artwork types', () => {
		test.each([
			['front.jpg', [ArtworkImageType.front]],
			['back.png', [ArtworkImageType.back]],
			['booklet.jpg', [ArtworkImageType.booklet]],
			['medium.png', [ArtworkImageType.medium]],
			['tray.jpg', [ArtworkImageType.tray]],
			['obi.png', [ArtworkImageType.obi]],
			['spine.jpg', [ArtworkImageType.spine]],
			['track.png', [ArtworkImageType.track]],
			['liner.jpg', [ArtworkImageType.liner]],
			['sticker.png', [ArtworkImageType.sticker]],
			['poster.jpg', [ArtworkImageType.poster]],
			['watermark.png', [ArtworkImageType.watermark]],
			['raw.jpg', [ArtworkImageType.raw]],
			['unedited.png', [ArtworkImageType.unedited]],
			['artist.jpg', [ArtworkImageType.artist]]
		])('Should identify %s as %s', (input, expected) => {
			const result = artWorkImageNameToType(input);
			expect(result).toEqual(expected);
		});
	});

	describe('case insensitivity', () => {
		test.each([
			['FRONT.jpg', [ArtworkImageType.front]],
			['Back.png', [ArtworkImageType.back]],
			['bOoKlEt.jpg', [ArtworkImageType.booklet]]
		])('Should be case insensitive for %s', (input, expected) => {
			const result = artWorkImageNameToType(input);
			expect(result).toEqual(expected);
		});
	});

	describe('cover and folder as front', () => {
		test.each([
			['cover.jpg', [ArtworkImageType.front]],
			['folder.png', [ArtworkImageType.front]]
		])('Should identify %s as front', (input, expected) => {
			const result = artWorkImageNameToType(input);
			expect(result).toEqual(expected);
		});
	});

	describe('multiple types in one name', () => {
		test.each([
			['front_back.jpg', [ArtworkImageType.back, ArtworkImageType.front]],
			['booklet_medium_tray.png', [ArtworkImageType.booklet, ArtworkImageType.medium, ArtworkImageType.tray]]
		])('Should identify multiple types in %s', (input, expected) => {
			const result = artWorkImageNameToType(input);
			expect(result).toEqual(expected);
		});
	});

	describe('default to other', () => {
		test.each([
			['image.jpg', [ArtworkImageType.other]],
			['artwork.png', [ArtworkImageType.other]],
			['123.jpg', [ArtworkImageType.other]]
		])('Should default to other for %s', (input, expected) => {
			const result = artWorkImageNameToType(input);
			expect(result).toEqual(expected);
		});
	});

	describe('edge cases', () => {
		test('Should handle empty string', () => {
			const result = artWorkImageNameToType('');
			expect(result).toEqual([ArtworkImageType.other]);
		});
	});
});
