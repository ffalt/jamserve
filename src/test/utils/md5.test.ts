import { describe, expect, test } from '@jest/globals';
import { hashMD5 } from '../../utils/md5.js';
import crypto from 'node:crypto';

describe('MD5 functions', () => {
	describe('hashMD5', () => {
		test('should calculate the MD5 hash of a string', () => {
			const input = 'test string';
			const expectedHash = crypto.createHash('md5').update(input).digest('hex');

			const result = hashMD5(input);

			expect(result).toBe(expectedHash);
		});

		test('should return the same hash for the same input', () => {
			const input = 'test string';

			const hash1 = hashMD5(input);
			const hash2 = hashMD5(input);

			expect(hash1).toBe(hash2);
		});

		test('should return different hashes for different inputs', () => {
			const input1 = 'test string 1';
			const input2 = 'test string 2';

			const hash1 = hashMD5(input1);
			const hash2 = hashMD5(input2);

			expect(hash1).not.toBe(hash2);
		});

		test('should handle empty strings', () => {
			const input = '';
			const expectedHash = crypto.createHash('md5').update(input).digest('hex');

			const result = hashMD5(input);

			expect(result).toBe(expectedHash);
		});

		test('should handle special characters', () => {
			const input = '!@#$%^&*()_+{}|:"<>?[];\',./-=';
			const expectedHash = crypto.createHash('md5').update(input).digest('hex');

			const result = hashMD5(input);

			expect(result).toBe(expectedHash);
		});

		test('should handle Unicode characters', () => {
			const input = '你好，世界！';
			const expectedHash = crypto.createHash('md5').update(input).digest('hex');

			const result = hashMD5(input);

			expect(result).toBe(expectedHash);
		});

		test('should return a 32-character hexadecimal string', () => {
			const input = 'test string';
			const result = hashMD5(input);

			expect(result).toMatch(/^[0-9a-f]{32}$/);
		});
	});
});
