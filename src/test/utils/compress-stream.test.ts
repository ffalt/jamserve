import { describe, expect, test, jest, beforeEach } from '@jest/globals';
import { BaseCompressStream } from '../../utils/compress-base-stream.js';
import { CompressFolderStream } from '../../utils/compress-folder-stream.js';
import { CompressListStream } from '../../utils/compress-list-stream.js';
import archiver from 'archiver';
import express from 'express';
import path from 'path';
import tmp from 'tmp';

// Mock implementation of BaseCompressStream for testing
class TestCompressStream extends BaseCompressStream {
	public runCalled = false;

	constructor(filename: string, format?: string) {
		super(filename, format);
	}

	protected run(_archive: archiver.Archiver): void {
		this.runCalled = true;
	}
}

describe('Compress Stream Classes', () => {
	describe('BaseCompressStream', () => {
		test('should validate supported formats', () => {
			expect(BaseCompressStream.isSupportedFormat('zip')).toBe(true);
			expect(BaseCompressStream.isSupportedFormat('tar')).toBe(true);
			expect(BaseCompressStream.isSupportedFormat('rar')).toBe(false);
			expect(BaseCompressStream.isSupportedFormat('7z')).toBe(false);
		});

		test('should throw error for unsupported format', () => {
			expect(() => new TestCompressStream('test', 'rar')).toThrow('Unsupported Download Format');
		});

		test('should replace file system chars in filename', () => {
			const stream = new TestCompressStream('test/file:name?');
			expect(stream.filename).toBe('test_file_-_name_');
		});

		test('should default to zip format', () => {
			const stream = new TestCompressStream('test');
			expect(stream.format).toBe('zip');
		});

		test('should call run method when piped', () => {
			const stream = new TestCompressStream('test');

			// Mock express response
			const mockResponse = {
				contentType: jest.fn(),
				setHeader: jest.fn(),
				on: jest.fn((event: string, callback: () => void) => {
					if (event === 'finish') {
						callback();
					}
					return mockResponse;
				}),
				pipe: jest.fn()
			} as unknown as express.Response;

			// Mock archiver
			const mockArchiver = {
				on: jest.fn().mockReturnThis(),
				pipe: jest.fn().mockReturnThis(),
				finalize: jest.fn().mockResolvedValue(undefined as never)
			};

			// Mock archiver function
			const mockArchiverFn = jest.fn().mockReturnValue(mockArchiver);
			jest.spyOn(archiver, 'create').mockImplementation(mockArchiverFn as any);

			stream.pipe(mockResponse);

			expect(stream.runCalled).toBe(true);
			expect(stream.streaming).toBe(false); // Should be set to false after finish event
			expect(mockResponse.contentType).toHaveBeenCalledWith('zip');
			expect(mockResponse.setHeader).toHaveBeenCalledWith(
				'Content-Disposition',
				'attachment; filename="test.zip"'
			);
		});
	});

	describe('CompressFolderStream', () => {
		let tempDir: tmp.DirResult;

		beforeEach(() => {
			tempDir = tmp.dirSync({ unsafeCleanup: true });
		});

		test('should create instance with folder path', () => {
			const stream = new CompressFolderStream(tempDir.name, 'test-folder');
			expect(stream.folder).toBe(tempDir.name);
			expect(stream.filename).toBe('test-folder');
		});

		test('should add directory to archive', () => {
			const stream = new CompressFolderStream(tempDir.name, 'test-folder');

			// Mock archiver
			const mockArchiver = {
				directory: jest.fn()
			};

			// Call run method
			stream['run'](mockArchiver as unknown as archiver.Archiver);

			expect(mockArchiver.directory).toHaveBeenCalledWith(tempDir.name, false);
		});
	});

	describe('CompressListStream', () => {
		let tempFiles: string[] = [];

		beforeEach(() => {
			// Create temporary files
			const file1 = tmp.fileSync();
			const file2 = tmp.fileSync();
			tempFiles = [file1.name, file2.name];
		});

		test('should create instance with file list', () => {
			const stream = new CompressListStream(tempFiles, 'test-list');
			expect(stream.list).toEqual(tempFiles);
			expect(stream.filename).toBe('test-list');
		});

		test('should add files to archive', () => {
			const stream = new CompressListStream(tempFiles, 'test-list');

			// Mock archiver
			const mockArchiver = {
				file: jest.fn()
			};

			// Call run method
			stream['run'](mockArchiver as unknown as archiver.Archiver);

			expect(mockArchiver.file).toHaveBeenCalledTimes(2);
			expect(mockArchiver.file).toHaveBeenCalledWith(tempFiles[0], {
				name: path.basename(tempFiles[0])
			});
			expect(mockArchiver.file).toHaveBeenCalledWith(tempFiles[1], {
				name: path.basename(tempFiles[1])
			});
		});
	});
});
