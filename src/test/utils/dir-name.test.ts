import { describe, expect, test } from '@jest/globals';
import { splitDirectoryName, validateFolderName } from '../../utils/dir-name.js';

describe('dir-name functions', () => {
	describe('splitDirectoryName', () => {
		test.each([
			'2020 Album Title',
			'2020 - Album Title', // dash
			'(2020) Album Title', // parentheses
			'[2020] Album Title' // brackets
		])('should extract year from the beginning of the name', input => {
			const result = splitDirectoryName(input);
			expect(result.title).toBe('Album Title');
			expect(result.year).toBe(2020);
		});

		test('should not extract year if not at the beginning', () => {
			const result = splitDirectoryName('Album Title 2020');
			expect(result.title).toBe('Album Title 2020');
			expect(result.year).toBeUndefined();
		});

		test('should not extract non-year numbers', () => {
			const result = splitDirectoryName('1234 Album Title');
			expect(result.title).toBe('Album Title');
			expect(result.year).toBe(1234);

			const result2 = splitDirectoryName('123 Album Title');
			expect(result2.title).toBe('123 Album Title');
			expect(result2.year).toBeUndefined();
		});

		test('should handle paths and trim the result', () => {
			const result = splitDirectoryName('/path/to/2020 Album Title');
			expect(result.title).toBe('Album Title');
			expect(result.year).toBe(2020);
		});
	});

	describe('validateFolderName', () => {
		test('should accept valid folder names', async () => {
			const validNames = [
				'Valid Folder',
				'valid-folder',
				'valid_folder',
				'ValidFolder123'
			];

			for (const name of validNames) {
				const result = await validateFolderName(name);
				expect(result).toBe(name);
			}
		});

		test('should reject folder names with invalid characters', async () => {
			const invalidNames = [
				'Invalid/Folder',
				'Invalid\\Folder',
				'Invalid:Folder',
				'Invalid*Folder',
				'Invalid?Folder',
				'Invalid"Folder',
				'Invalid<Folder',
				'Invalid>Folder',
				'Invalid|Folder'
			];

			for (const name of invalidNames) {
				await expect(validateFolderName(name)).rejects.toThrow('Invalid Directory Name');
			}
		});

		test('should reject reserved folder names', async () => {
			const reservedNames = [
				'.',
				'..'
			];

			for (const name of reservedNames) {
				await expect(validateFolderName(name)).rejects.toThrow('Invalid Directory Name');
			}
		});

		test('should reject empty folder names', async () => {
			await expect(validateFolderName('')).rejects.toThrow('Invalid Directory Name');
			await expect(validateFolderName('   ')).rejects.toThrow('Invalid Directory Name');
		});

		test('should trim folder names', async () => {
			const result = await validateFolderName('  ValidFolder  ');
			expect(result).toBe('ValidFolder');
		});
	});
});
