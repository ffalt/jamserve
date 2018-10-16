import archiver from 'archiver';
import express from 'express';
import {IStreamData} from '../typings';
import * as path from 'path';

export class CompressStream implements IStreamData {
	public filename: string;
	public folder: string;
	public streaming = true;

	constructor(folder: string, filename: string) {
		this.filename = filename;
		this.folder = folder;
	}

	pipe(stream: express.Response) {
		// logger.verbose('Start streaming');
		const format = 'zip';
		const archive = archiver(format, {zlib: {level: 0}});
		archive.on('error', (err) => {
			// logger.error('archiver err ' + err);
			throw err;
		});
		stream.contentType('zip');
		stream.setHeader('Content-Disposition', 'attachment; filename="' + (this.filename || 'download') + '.' + format + '"');
		// stream.setHeader('Content-Length', stat.size); do not report wrong size!
		stream.on('finish', () => {
			// logger.verbose('streamed ' + archive.pointer() + ' total bytes');
			this.streaming = false;
		});
		archive.pipe(stream);
		archive.directory(this.folder, false);
		archive.finalize();
	}

}

export class CompressListStream implements IStreamData {
	public filename: string;
	public list: Array<string> = [];
	public streaming = true;

	constructor(list: Array<string>, filename: string) {
		this.filename = filename;
		this.list = list;
	}

	pipe(stream: express.Response) {
		// logger.verbose('Start streaming');
		const format = 'zip';
		const archive = archiver(format, {zlib: {level: 0}});
		archive.on('error', (err) => {
			// logger.error('archiver err ' + err);
			throw err;
		});
		stream.contentType('zip');
		stream.setHeader('Content-Disposition', 'attachment; filename="' + (this.filename || 'download') + '.' + format + '"');
		// stream.setHeader('Content-Length', stat.size); do not report wrong size!
		stream.on('finish', () => {
			// logger.verbose('streamed ' + archive.pointer() + ' total bytes');
			this.streaming = false;
		});
		archive.pipe(stream);
		this.list.forEach(file => {
			archive.file(file, {name: path.basename(file)});
		});
		archive.finalize();
	}

}
