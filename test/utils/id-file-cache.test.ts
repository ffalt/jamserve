import { describe, expect, test, beforeEach, afterEach, jest } from '@jest/globals';
import { IDFolderCache } from '../../src/utils/id-file-cache.js';
import fse from 'fs-extra';
import path from 'node:path';
import tmp from 'tmp';

interface TestParameters {
	size: number;
	format: string;
}

describe('IDFolderCache', () => {
	let temporaryDir: tmp.DirResult;
	let cache: IDFolderCache<TestParameters>;

	beforeEach(() => {
		// Create a temporary directory for test files
		temporaryDir = tmp.dirSync({ unsafeCleanup: true });

		// Create a cache instance with test parameters
		cache = new IDFolderCache<TestParameters>(
			temporaryDir.name,
			'test',
			(parameters: TestParameters) => `-${parameters.size}-${parameters.format}`
		);
	});

	afterEach(() => {
		temporaryDir.removeCallback();
	});

	describe('prefixCacheFilename', () => {
		test('should create a prefixed filename', () => {
			const result = cache.prefixCacheFilename('123');
			expect(result).toBe('test-123');
		});
	});

	describe('cacheFilename', () => {
		test('should create a cache filename with parameters', () => {
			const result = cache.cacheFilename('123', { size: 100, format: 'jpg' });
			expect(result).toBe('test-123-100-jpg');
		});
	});

	describe('getExisting', () => {
		test('should return undefined for non-existent cache file', async () => {
			const result = await cache.getExisting('123', { size: 100, format: 'jpg' });
			expect(result).toBeUndefined();
		});

		test('should return cache result for existing cache file', async () => {
			const cacheID = cache.cacheFilename('123', { size: 100, format: 'jpg' });
			const cachefile = path.join(temporaryDir.name, cacheID);

			// Create a test file
			await fse.writeFile(cachefile, 'test content');

			const result = await cache.getExisting('123', { size: 100, format: 'jpg' });
			expect(result).toBeDefined();
			expect(result?.file.filename).toBe(cachefile);
			expect(result?.file.name).toBe(cacheID);
		});

		test('should use debounce for pending requests', async () => {
			const cacheID = cache.cacheFilename('123', { size: 100, format: 'jpg' });
			const cachefile = path.join(temporaryDir.name, cacheID);

			// Create a test file
			await fse.writeFile(cachefile, 'test content');

			// Mock the debounce isPending and append methods
			const isPendingSpy = jest.spyOn(cache['cacheDebounce'], 'isPending').mockReturnValue(true);
			const appendSpy = jest.spyOn(cache['cacheDebounce'], 'append').mockResolvedValue({
				file: { filename: cachefile, name: cacheID }
			});

			const result = await cache.getExisting('123', { size: 100, format: 'jpg' });

			expect(isPendingSpy).toHaveBeenCalledWith(cacheID);
			expect(appendSpy).toHaveBeenCalledWith(cacheID);
			expect(result).toBeDefined();
			expect(result?.file.filename).toBe(cachefile);
			expect(result?.file.name).toBe(cacheID);

			// Restore the original methods
			isPendingSpy.mockRestore();
			appendSpy.mockRestore();
		});
	});

	describe('get', () => {
		test('should create a new cache file if it does not exist', async () => {
			const cacheID = cache.cacheFilename('123', { size: 100, format: 'jpg' });
			const cachefile = path.join(temporaryDir.name, cacheID);

			// Mock the build function
			const build = jest.fn(async (filename: string) => {
				await fse.writeFile(filename, 'test content');
			});

			const result = await cache.get('123', { size: 100, format: 'jpg' }, build);

			expect(build).toHaveBeenCalledWith(cachefile);
			expect(result).toBeDefined();
			expect(result.file.filename).toBe(cachefile);
			expect(result.file.name).toBe(cacheID);

			// Verify the file was created
			const exists = await fse.pathExists(cachefile);
			expect(exists).toBe(true);
		});

		test('should not create a new cache file if it already exists', async () => {
			const cacheID = cache.cacheFilename('123', { size: 100, format: 'jpg' });
			const cachefile = path.join(temporaryDir.name, cacheID);

			// Create a test file
			await fse.writeFile(cachefile, 'test content');

			// Mock the build function
			const build = jest.fn(async () => {
				// This should not be called
			});

			const result = await cache.get('123', { size: 100, format: 'jpg' }, build);

			expect(build).not.toHaveBeenCalled();
			expect(result).toBeDefined();
			expect(result.file.filename).toBe(cachefile);
			expect(result.file.name).toBe(cacheID);
		});

		test('should use debounce for pending requests', async () => {
			const cacheID = cache.cacheFilename('123', { size: 100, format: 'jpg' });
			const cachefile = path.join(temporaryDir.name, cacheID);

			// Mock the debounce methods
			const isPendingSpy = jest.spyOn(cache['cacheDebounce'], 'isPending').mockReturnValue(true);
			const appendSpy = jest.spyOn(cache['cacheDebounce'], 'append').mockResolvedValue({
				file: { filename: cachefile, name: cacheID }
			});

			// Mock the build function
			const build = jest.fn(async () => {
				// This should not be called
			});

			const result = await cache.get('123', { size: 100, format: 'jpg' }, build);

			expect(isPendingSpy).toHaveBeenCalledWith(cacheID);
			expect(appendSpy).toHaveBeenCalledWith(cacheID);
			expect(build).not.toHaveBeenCalled();
			expect(result).toBeDefined();
			expect(result.file.filename).toBe(cachefile);
			expect(result.file.name).toBe(cacheID);

			// Restore the original methods
			isPendingSpy.mockRestore();
			appendSpy.mockRestore();
		});

		test('should handle build errors', async () => {
			// Mock the build function to throw an error
			const build = jest.fn(async () => {
				throw new Error('Build error');
			});

			// Mock the debounce reject method
			const rejectSpy = jest.spyOn(cache['cacheDebounce'], 'reject');

			await expect(cache.get('123', { size: 100, format: 'jpg' }, build))
				.rejects.toThrow('Build error');

			expect(build).toHaveBeenCalled();
			expect(rejectSpy).toHaveBeenCalled();

			// Restore the original method
			rejectSpy.mockRestore();
		});
	});

	describe('removeByIDs', () => {
		test('should remove cache files by IDs', async () => {
			// Create test files
			const cacheID1 = cache.cacheFilename('123', { size: 100, format: 'jpg' });
			const cachefile1 = path.join(temporaryDir.name, cacheID1);
			await fse.writeFile(cachefile1, 'test content 1');

			const cacheID2 = cache.cacheFilename('456', { size: 200, format: 'png' });
			const cachefile2 = path.join(temporaryDir.name, cacheID2);
			await fse.writeFile(cachefile2, 'test content 2');

			// Create a file that should not be removed
			const otherFile = path.join(temporaryDir.name, 'other-file.txt');
			await fse.writeFile(otherFile, 'other content');

			// Remove files for ID 123
			await cache.removeByIDs(['123']);

			// Check that the correct files were removed
			expect(await fse.pathExists(cachefile1)).toBe(false);
			expect(await fse.pathExists(cachefile2)).toBe(true);
			expect(await fse.pathExists(otherFile)).toBe(true);
		});

		test('should handle empty ID list', async () => {
			// Create a test file
			const cacheID = cache.cacheFilename('123', { size: 100, format: 'jpg' });
			const cachefile = path.join(temporaryDir.name, cacheID);
			await fse.writeFile(cachefile, 'test content');

			// Call removeByIDs with empty list
			await cache.removeByIDs([]);

			// Check that no files were removed
			expect(await fse.pathExists(cachefile)).toBe(true);
		});

		test('should handle empty IDs in the list', async () => {
			// Create a test file
			const cacheID = cache.cacheFilename('123', { size: 100, format: 'jpg' });
			const cachefile = path.join(temporaryDir.name, cacheID);
			await fse.writeFile(cachefile, 'test content');

			// Call removeByIDs with a list containing an empty ID
			await cache.removeByIDs(['', '123']);

			// Check that the correct file was removed
			expect(await fse.pathExists(cachefile)).toBe(false);
		});
	});
});
