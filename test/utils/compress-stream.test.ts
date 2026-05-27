import { describe, expect, test, jest, beforeEach } from '@jest/globals';
import { BaseCompressStream } from '../../src/utils/compress-base-stream.js';
import { CompressFolderStream } from '../../src/utils/compress-folder-stream.js';
import { CompressListStream } from '../../src/utils/compress-list-stream.js';
import express from 'express';
import path from 'node:path';
import tmp from 'tmp';
import type { Archive } from '../../src/utils/archive.js';

class TestCompressStream extends BaseCompressStream {
	public runCalled = false;
	public mockArchiver: Archive | undefined;

	constructor(filename: string, format?: string) {
		super(filename, format);
	}

	protected override createArchive(): Archive {
		return this.mockArchiver!;
	}

	protected run(_archive: Archive): void {
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

			stream.mockArchiver = mockArchiver as unknown as Archive;

			stream.pipe(mockResponse);

			expect(stream.runCalled).toBe(true);
			expect(stream.streaming).toBe(false); // Should be set to false after finish event
			expect(mockResponse.contentType).toHaveBeenCalledWith('zip');
			expect(mockResponse.setHeader).toHaveBeenCalledWith(
				'Content-Disposition',
				'attachment; filename="test.zip"'
			);
		});

		test('should use tar format in contentType and Content-Disposition when format is tar', () => {
			const stream = new TestCompressStream('my-archive', 'tar');

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

			const mockArchiver = {
				on: jest.fn().mockReturnThis(),
				pipe: jest.fn().mockReturnThis(),
				finalize: jest.fn().mockResolvedValue(undefined as never)
			};

			stream.mockArchiver = mockArchiver as unknown as Archive;

			stream.pipe(mockResponse);

			expect(stream.format).toBe('tar');
			expect(mockResponse.contentType).toHaveBeenCalledWith('tar');
			expect(mockResponse.setHeader).toHaveBeenCalledWith(
				'Content-Disposition',
				'attachment; filename="my-archive.tar"'
			);
		});
	});

	describe('CompressFolderStream', () => {
		let temporaryDir: tmp.DirResult;

		beforeEach(() => {
			temporaryDir = tmp.dirSync({ unsafeCleanup: true });
		});

		test('should create instance with folder path', () => {
			const stream = new CompressFolderStream(temporaryDir.name, 'test-folder');
			expect(stream.folder).toBe(temporaryDir.name);
			expect(stream.filename).toBe('test-folder');
		});

		test('should add directory to archive', () => {
			const stream = new CompressFolderStream(temporaryDir.name, 'test-folder');

			// Mock archiver
			const mockArchiver = {
				directory: jest.fn()
			};

			// Call run method
			stream['run'](mockArchiver as unknown as Archive);

			expect(mockArchiver.directory).toHaveBeenCalledWith(temporaryDir.name, false);
		});
	});

	describe('CompressListStream', () => {
		let temporaryFiles: Array<string> = [];

		beforeEach(() => {
			// Create temporary files
			const file1 = tmp.fileSync();
			const file2 = tmp.fileSync();
			temporaryFiles = [file1.name, file2.name];
		});

		test('should create instance with file list', () => {
			const stream = new CompressListStream(temporaryFiles, 'test-list');
			expect(stream.list).toEqual(temporaryFiles);
			expect(stream.filename).toBe('test-list');
		});

		test('should add files to archive', () => {
			const stream = new CompressListStream(temporaryFiles, 'test-list');

			// Mock archiver
			const mockArchiver = {
				file: jest.fn()
			};

			// Call run method
			stream['run'](mockArchiver as unknown as Archive);

			expect(mockArchiver.file).toHaveBeenCalledTimes(2);
			expect(mockArchiver.file).toHaveBeenCalledWith(temporaryFiles[0], {
				name: path.basename(temporaryFiles[0])
			});
			expect(mockArchiver.file).toHaveBeenCalledWith(temporaryFiles[1], {
				name: path.basename(temporaryFiles[1])
			});
		});
	});
});
