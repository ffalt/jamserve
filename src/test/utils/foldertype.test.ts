import { isExtraFolder } from '../../utils/foldertype.js';

describe('isExtraFolder', () => {
	describe('should return true', () => {
		test.each([
			// Standalone "extra"
			'extra',
			'EXTRA',
			'Extra',
			// Standalone "various"
			'various',
			'VARIOUS',
			'Various',
			// Bracketed "extra"
			'[extra]',
			'[EXTRA]',
			'[Extra]',
			// Bracketed "various"
			'[various]',
			'[VARIOUS]',
			'[Various]',
			// Paths
			'/path/to/extra',
			'/path/to/[extra]',
			'C:/path/to/various',
			'C:/path/to/[various]'
		])('for folder "%s"', folder => {
			expect(isExtraFolder(folder)).toBe(true);
		});
	});

	describe('should return false', () => {
		test.each([
			// Non-matching cases
			'extras',
			'my-extra',
			'extra-stuff',
			'various-things',
			'[extras]',
			'(extra)',
			'',
			'/path/to/not-extra'
		])('for folder "%s"', folder => {
			expect(isExtraFolder(folder)).toBe(false);
		});
	});
});
