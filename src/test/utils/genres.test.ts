import { describe, expect, test } from '@jest/globals';
import { cleanGenre, Genres } from '../../utils/genres.js';

describe('genres functions and constants', () => {
	describe('Genres', () => {
		test('should be an array of strings', () => {
			expect(Array.isArray(Genres)).toBe(true);
			expect(Genres.length).toBeGreaterThan(0);
			Genres.forEach(genre => {
				expect(typeof genre).toBe('string');
			});
		});

		test('should contain common music genres', () => {
			const commonGenres = ['Rock', 'Pop', 'Jazz', 'Blues', 'Classical', 'Hip Hop', 'Electronic'];
			commonGenres.forEach(genre => {
				expect(Genres).toContain(genre);
			});
		});
	});

	describe('cleanGenre', () => {
		test.each(['Rock', 'Jazz', 'Blues', 'Classical'])('should return the genre as is if it is a known genre', genre => {
			expect(cleanGenre(genre)).toEqual([genre]);
		});

		test('should handle case insensitivity', () => {
			expect(cleanGenre('rock')).toEqual(['Rock']);
			expect(cleanGenre('JAZZ')).toEqual(['Jazz']);
			expect(cleanGenre('blues')).toEqual(['Blues']);
		});

		test('should handle genres with spaces, hyphens, and periods', () => {
			expect(cleanGenre('hip hop')).toEqual(['Hip Hop']);
			expect(cleanGenre('R&B')).toEqual(['R&B']);
			expect(cleanGenre('Heavy-Metal')).toEqual(['Heavy Metal']);
		});

		test('should handle multiple genres separated by slashes', () => {
			expect(cleanGenre('Rock/Pop')).toEqual(['Rock', 'Pop']);
			expect(cleanGenre('Jazz/Blues/Funk')).toEqual(['Jazz', 'Blues', 'Funk']);
		});

		test('should handle genres with ampersands', () => {
			expect(cleanGenre('Rhythm & Blues')).toEqual(['Rhythm & Blues']);
			expect(cleanGenre('Rock & Roll')).toEqual(['Rock & Roll']);
		});

		test('should handle ID3v1 genre numbers in parentheses', () => {
			// ID3v1 genre 0 is Blues
			expect(cleanGenre('(0)')).toEqual(['Blues']);
			// ID3v1 genre 1 is Classic Rock
			expect(cleanGenre('(1)')).toEqual(['Classic Rock']);
			// ID3v1 genre 2 is Country
			expect(cleanGenre('(2)')).toEqual(['Country']);
		});

		test('should handle mixed formats', () => {
			expect(cleanGenre('rock/pop & electronic')).toEqual(['Rock', 'Pop', 'Electronic']);
			expect(cleanGenre('(0)/(1)')).toEqual(['Blues', 'Classic Rock']);
		});

		test('should return an empty array for empty input', () => {
			expect(cleanGenre('')).toEqual([]);
		});

		test('should handle unknown genres', () => {
			expect(cleanGenre('Unknown Genre')).toEqual(['Unknown Genre']);
		});

		test('should remove duplicates', () => {
			expect(cleanGenre('Rock/rock')).toEqual(['Rock']);
			expect(cleanGenre('Jazz/jazz/JAZZ')).toEqual(['Jazz']);
		});
	});
});
