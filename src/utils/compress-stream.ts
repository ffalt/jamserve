import archiver from 'archiver';
import express from 'express';
import {IStreamData} from '../typings';
import * as path from 'path';
import {replaceFileSystemChars} from './fs-utils';

abstract class BaseCompressStream implements IStreamData {
	public filename: string;
	public streaming = true;
	public format: string;

	protected constructor(filename: string, format?: string) {
		this.filename = replaceFileSystemChars(filename, '_').replace(/ /g, '_');
		this.format = format || 'zip';
		if (!CompressListStream.isSupportedFormat(this.format)) {
			throw new Error('Unsupported Download Format');
		}
	}

	static isSupportedFormat(format: string): boolean {
		return ['zip', 'tar'].indexOf(format) >= 0;
	}

	pipe(stream: express.Response) {
		// logger.verbose('Start streaming');
		const format = 'zip';
		const archive = archiver(<archiver.Format>this.format, {zlib: {level: 0}});
		archive.on('error', (err) => {
			// logger.error('archiver err ' + err);
			throw err;
		});
		stream.contentType('zip');
		stream.setHeader('Content-Disposition', 'attachment; filename="' + (this.filename || 'download') + '.' + format + '"');
		// stream.setHeader('Content-Length', stat.size); do NOT report wrong size!
		stream.on('finish', () => {
			// logger.verbose('streamed ' + archive.pointer() + ' total bytes');
			this.streaming = false;
		});
		archive.pipe(stream);
		this.run(archive);
		archive.finalize();
	}

	protected abstract run(archive: archiver.Archiver): void;
}


export class CompressFolderStream extends BaseCompressStream {

	constructor(public folder: string, filename: string, format?: string) {
		super(filename, format);
	}

	protected run(archive: archiver.Archiver): void {
		archive.directory(this.folder, false);
	}
}

export class CompressListStream extends BaseCompressStream {
	public list: Array<string> = [];

	constructor(list: Array<string>, filename: string, format?: string) {
		super(filename, format);
		this.list = list;
	}

	protected run(archive: archiver.Archiver): void {
		this.list.forEach(file => {
			archive.file(file, {name: path.basename(file)});
		});
	}

}
