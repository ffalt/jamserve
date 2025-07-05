import { describe, expect, test } from '@jest/globals';
import { bcryptPassword, bcryptComparePassword } from '../../utils/bcrypt.js';

describe('bcrypt functions', () => {
	describe('bcryptPassword', () => {
		test('should hash a password', async () => {
			const password = 'testPassword123';
			const hash = await bcryptPassword(password);

			// Check that the hash is a string and not the original password
			expect(typeof hash).toBe('string');
			expect(hash).not.toBe(password);

			// bcrypt hashes start with $2b$ (algorithm identifier and cost)
			expect(hash.startsWith('$2b$')).toBe(true);
		});

		test('should generate different hashes for the same password', async () => {
			const password = 'testPassword123';
			const hash1 = await bcryptPassword(password);
			const hash2 = await bcryptPassword(password);

			// Each hash should be different due to different salts
			expect(hash1).not.toBe(hash2);
		});
	});

	describe('bcryptComparePassword', () => {
		test('should return true for matching password and hash', async () => {
			const password = 'testPassword123';
			const hash = await bcryptPassword(password);

			const result = await bcryptComparePassword(password, hash);
			expect(result).toBe(true);
		});

		test('should return false for non-matching password and hash', async () => {
			const password = 'testPassword123';
			const wrongPassword = 'wrongPassword123';
			const hash = await bcryptPassword(password);

			const result = await bcryptComparePassword(wrongPassword, hash);
			expect(result).toBe(false);
		});

		test('should reject with an error for invalid hash format', async () => {
			const password = 'testPassword123';
			const invalidHash = 'invalidHash';

			expect(await bcryptComparePassword(password, invalidHash)).toBe(false);
		});
	});
});
