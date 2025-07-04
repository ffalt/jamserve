import { describe, expect, test } from '@jest/globals';
import { extractAlbumName } from '../../utils/album-name.js';

describe('extractAlbumName function', () => {
	describe('removal of text in parentheses', () => {
		test.each([
			'Album Name (2023)', // year
			'Album Name (2 CDs)', // CD count
			'Album Name (3cds)', // CD count (no space)
			'Album Name (CD 1)', // CD number
			'Album Name (cd1)', // CD number (no space)
			'Album Name (Disc 1)', // disc information
			'Album Name (disc2)', // disc information (no space)
			'Album Name (Disc 3: Bonus Tracks)', // disc information with description
			'Album Name (Bonus Tracks)', // bonus information
			'Album Name (bonus disc)', // bonus information (lowercase)
			'Album Name (Deluxe Edition)', // edition information
			'Album Name (Limited Edition)', // edition information (Limited)
			'Album Name (Special Edition)', // edition information (Special)
			'Album Name (Retail)', // retail information
			'Album Name (1 of 3)', // disc numbering
			'Album Name (EP)', // EP
			'Album Name (Bootleg)', // Bootleg
			'Album Name (Deluxe)', // Deluxe
			'Album Name (Promo)', // Promo
			'Album Name (Single)', // Single
			'Album Name (LP)', // LP
			'Album Name (Retro)', // Retro
			'Album Name (OST)', // OST
			'Album Name (UVS)', // UVS
			'Album Name (DEMP)', // DEMP
			'Album Name (Demos)', // Demos
			'Album Name (Remastered)', // Remastered
			'Album Name (Remix)', // Remix
			'Album Name (Live)', // Live
			'Album Name (Remixes)', // Remixes
			'Album Name (Vinyl)', // Vinyl
			'Album Name (Collection)', // Collection
			'Album Name (Maxi)', // Maxi
			'Album Name (Bonus Disc)' // Bonus Disc
		])('Should remove format information in parentheses', input => {
			expect(extractAlbumName(input)).toBe('Album Name');
		});
	});

	describe('removal of text in square brackets', () => {
		test.each([
			'Album Name [2023]', // year
			'Album Name [2 CDs]', // CD count
			'Album Name [3cds]', // CD count (no space)
			'Album Name [CD 1]', // CD number
			'Album Name [cd1]', // CD number (no space)
			'Album Name [Disc 1]', // disc information
			'Album Name [disc2]', // disc information (no space)
			'Album Name [Disc 3: Bonus Tracks]', // disc information with description
			'Album Name [Bonus Tracks]', // bonus information
			'Album Name [bonus disc]', // bonus information (lowercase)
			'Album Name [Deluxe Edition]', // edition information
			'Album Name [Limited Edition]', // edition information (Limited)
			'Album Name [Special Edition]', // edition information (Special)
			'Album Name [Retail]', // retail information
			'Album Name [1 of 3]', // disc numbering
			'Album Name [EP]', // EP
			'Album Name [Bootleg]', // Bootleg
			'Album Name [Deluxe]', // Deluxe
			'Album Name [Promo]', // Promo
			'Album Name [Single]', // Single
			'Album Name [LP]', // LP
			'Album Name [Retro]', // Retro
			'Album Name [OST]', // OST
			'Album Name [UVS]', // UVS
			'Album Name [DEMP]', // DEMP
			'Album Name [Demos]', // Demos
			'Album Name [Remastered]', // Remastered
			'Album Name [Remix]', // Remix
			'Album Name [Live]', // Live
			'Album Name [Remixes]', // Remixes
			'Album Name [Vinyl]', // Vinyl
			'Album Name [Collection]', // Collection
			'Album Name [Maxi]', // Maxi
			'Album Name [Bonus Disc]' // Bonus Disc
		])('Should remove format information in square brackets', input => {
			expect(extractAlbumName(input)).toBe('Album Name');
		});
	});

	describe('removal of CD numbers with hyphens', () => {
		test.each([
			'Album Name - CD1', // standard format
			'Album Name -CD2', // no space
			'Album Name- CD3', // space after
			'Album Name-CD4' // no spaces
		])('Should remove CD numbers with hyphens', input => {
			expect(extractAlbumName(input)).toBe('Album Name');
		});
	});

	describe('edge cases', () => {
		test.each([
			['', ''], // empty strings
			['   ', ''] // strings with only whitespace
		])('Should handle edge cases', (input, expected) => {
			expect(extractAlbumName(input)).toBe(expected);
		});

		test.each([
			'(2023)', // parentheses
			'[Deluxe Edition]', // square brackets
			'- CD1' // hyphen
		])('Should return original string when only pattern to be removed', input => {
			expect(extractAlbumName(input)).toBe(input);
		});
	});

	describe('multiple patterns in the same string', () => {
		test.each([
			'Album Name (2023) [Deluxe Edition] - CD1', // standard order
			'Album Name [Remastered] (2 CDs) - CD2' // different order
		])('Should remove multiple patterns', input => {
			expect(extractAlbumName(input)).toBe('Album Name');
		});
	});

	describe('preserving text that doesn\'t match the patterns', () => {
		test.each([
			'Album Name (with Special Guest)', // parentheses
			'Album Name [Live at Wembley]' // square brackets
		])('Should preserve text that doesn\'t match patterns', input => {
			expect(extractAlbumName(input)).toBe(input);
		});
	});

	describe('case sensitivity', () => {
		test.each([
			'Album Name (DELUXE EDITION)', // uppercase
			'Album Name (deluxe edition)', // lowercase
			'Album Name (Deluxe Edition)' // mixed case
		])('Should be case insensitive', input => {
			expect(extractAlbumName(input)).toBe('Album Name');
		});
	});
});
