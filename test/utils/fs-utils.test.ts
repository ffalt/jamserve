import { describe, expect, test, beforeEach, afterEach } from '@jest/globals';
import {
	fileDeleteIfExists,
	pathDeleteIfExists,
	fileSuffix,
	fileExtension,
	basenameStripExtension,
	replaceFileSystemChars,
	containsFolderSystemChars,
	replaceFolderSystemChars,
	ensureTrailingPathSeparator,
	removeTrailingPathSeparator
} from '../../src/utils/fs-utils.js';
import path from 'node:path';
import fse from 'fs-extra';
import tmp from 'tmp';

describe('fs-utils functions', () => {
	describe('fileDeleteIfExists', () => {
		let temporaryFile: tmp.FileResult;

		beforeEach(() => {
			temporaryFile = tmp.fileSync();
		});

		afterEach(() => {
			try {
				temporaryFile.removeCallback();
			} catch {
				// Ignore errors during cleanup
			}
		});

		test('should delete a file if it exists', async () => {
			expect(fse.existsSync(temporaryFile.name)).toBe(true);
			await fileDeleteIfExists(temporaryFile.name);
			expect(fse.existsSync(temporaryFile.name)).toBe(false);
		});

		test('should not throw if file does not exist', async () => {
			const nonExistentFile = path.join(path.dirname(temporaryFile.name), 'non-existent-file.txt');
			await expect(fileDeleteIfExists(nonExistentFile)).resolves.not.toThrow();
		});
	});

	describe('pathDeleteIfExists', () => {
		let temporaryDir: tmp.DirResult;

		beforeEach(() => {
			temporaryDir = tmp.dirSync({ unsafeCleanup: true });
		});

		afterEach(() => {
			try {
				temporaryDir.removeCallback();
			} catch {
				// Ignore errors during cleanup
			}
		});

		test('should delete a directory if it exists', async () => {
			expect(fse.existsSync(temporaryDir.name)).toBe(true);
			await pathDeleteIfExists(temporaryDir.name);
			expect(fse.existsSync(temporaryDir.name)).toBe(false);
		});

		test('should not throw if directory does not exist', async () => {
			const nonExistentDir = path.join(path.dirname(temporaryDir.name), 'non-existent-dir');
			await expect(pathDeleteIfExists(nonExistentDir)).resolves.not.toThrow();
		});
	});

	describe('fileSuffix', () => {
		test('should return the file extension without the dot', () => {
			expect(fileSuffix('file.txt')).toBe('txt');
			expect(fileSuffix('file.TXT')).toBe('txt'); // lowercase
			expect(fileSuffix('file.tar.gz')).toBe('gz');
			expect(fileSuffix('/path/to/file.jpg')).toBe('jpg');
		});

		test('should return empty string for files without extension', () => {
			expect(fileSuffix('file')).toBe('');
			expect(fileSuffix('/path/to/file')).toBe('');
		});
	});

	describe('fileExt', () => {
		test('should return the file extension with the dot', () => {
			expect(fileExtension('file.txt')).toBe('.txt');
			expect(fileExtension('file.TXT')).toBe('.txt'); // lowercase
			expect(fileExtension('file.tar.gz')).toBe('.gz');
			expect(fileExtension('/path/to/file.jpg')).toBe('.jpg');
		});

		test('should return empty string for files without extension', () => {
			expect(fileExtension('file')).toBe('');
			expect(fileExtension('/path/to/file')).toBe('');
		});
	});

	describe('basenameStripExt', () => {
		test('should return the basename without extension', () => {
			expect(basenameStripExtension('file.txt')).toBe('file');
			expect(basenameStripExtension('file.tar.gz')).toBe('file.tar');
			expect(basenameStripExtension('/path/to/file.jpg')).toBe('file');
		});

		test('should return the basename for files without extension', () => {
			expect(basenameStripExtension('file')).toBe('file');
			expect(basenameStripExtension('/path/to/file')).toBe('file');
		});
	});

	describe('replaceFileSystemChars', () => {
		test('should replace invalid file system characters', () => {
			expect(replaceFileSystemChars('file:name', '_')).toBe('file - name');
			expect(replaceFileSystemChars('file?name', '_')).toBe('file_name');
			expect(replaceFileSystemChars('file/name', '_')).toBe('file_name');
			expect(replaceFileSystemChars('file\\name', '_')).toBe('file_name');
			expect(replaceFileSystemChars('file|name', '_')).toBe('file_name');
			expect(replaceFileSystemChars('file*name', '_')).toBe('file_name');
			expect(replaceFileSystemChars('file"name', '_')).toBe('file_name');
		});

		test('should use the provided replacement character', () => {
			expect(replaceFileSystemChars('file:name', '-')).toBe('file - name');
			expect(replaceFileSystemChars('file?name', '-')).toBe('file-name');
		});
	});

	describe('containsFolderSystemChars', () => {
		test.each([
			'folder<name',
			'folder>name',
			'folder:name',
			'folder"name',
			'folder/name',
			'folder\\name',
			'folder|name',
			'folder?name',
			'folder*name'
		])('should return true for strings with invalid folder characters', input => {
			expect(containsFolderSystemChars(input)).toBe(true);
		});

		test.each([
			'aux',
			'con',
			'nul',
			'prn',
			'com1',
			'com2',
			'lpt1',
			'lpt2'
		])('should return true for reserved names', input => {
			expect(containsFolderSystemChars(input)).toBe(true);
		});

		test.each([
			'valid-folder',
			'valid_folder',
			'ValidFolder123'
		])('should return false for valid folder names', input => {
			expect(containsFolderSystemChars(input)).toBe(false);
		});
	});

	describe('replaceFolderSystemChars', () => {
		test('should replace invalid folder characters with underscore except for :', () => {
			expect(replaceFolderSystemChars('folder:name', '_')).toBe('folder -name');
		});

		test.each([
			'folder?name',
			'folder/name',
			'folder/name',
			'folder\\name',
			'folder|name',
			'folder*name',
			'folder"name',
			'folder<name',
			'folder>name'
		])('should replace invalid folder characters with underscore', input => {
			expect(replaceFolderSystemChars(input, '_')).toBe('folder_name');
		});

		test('should use the provided replacement character', () => {
			expect(replaceFolderSystemChars('folder/name', '-')).toBe('folder-name');
			expect(replaceFolderSystemChars('folder?name', '-')).toBe('folder-name');
		});
	});

	describe('ensureTrailingPathSeparator', () => {
		test('should add path separator if missing', () => {
			const pathWithoutSeparator = '/path/to/folder';
			expect(ensureTrailingPathSeparator(pathWithoutSeparator)).toBe(`${pathWithoutSeparator}${path.sep}`);
		});

		test('should not add path separator if already present', () => {
			const pathWithSeparator = `/path/to/folder${path.sep}`;
			expect(ensureTrailingPathSeparator(pathWithSeparator)).toBe(pathWithSeparator);
		});
	});

	describe('removeTrailingPathSeparator', () => {
		test('should remove path separator if present', () => {
			const pathWithSeparator = `/path/to/folder${path.sep}`;
			expect(removeTrailingPathSeparator(pathWithSeparator)).toBe('/path/to/folder');
		});

		test('should not modify path without separator', () => {
			const pathWithoutSeparator = '/path/to/folder';
			expect(removeTrailingPathSeparator(pathWithoutSeparator)).toBe(pathWithoutSeparator);
		});
	});
});
