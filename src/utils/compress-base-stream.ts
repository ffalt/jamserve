import archiver from 'archiver';
import express from 'express';
import { replaceFileSystemChars } from './fs-utils.js';
import { logger } from './logger.js';
import { StreamData } from '../modules/deco/express/express-responder.js';

const log = logger('BaseCompressStream');

export abstract class BaseCompressStream implements StreamData {
	public filename: string;
	public streaming = true;
	public format: string;

	protected constructor(filename: string, format?: string) {
		this.filename = replaceFileSystemChars(filename, '_').replaceAll(' ', '_');
		this.format = format ?? 'zip';
		if (!BaseCompressStream.isSupportedFormat(this.format)) {
			throw new Error('Unsupported Download Format');
		}
	}

	static isSupportedFormat(format: string): boolean {
		return ['zip', 'tar'].includes(format);
	}

	pipe(stream: express.Response): void {
		const archive = archiver(this.format as archiver.Format, { zlib: { level: 0 } });
		archive.on('error', error => {
			throw error;
		});
		// eslint-disable-next-line no-control-regex
		const sanitizedName = (this.filename || 'download').replaceAll(/["\\]/g, '_').replaceAll(/[\u0000-\u001F\u007F]/g, '');
		stream.contentType(this.format);
		stream.setHeader('Content-Disposition', `attachment; filename="${sanitizedName}.${this.format}"`);
		stream.on('finish', () => {
			this.streaming = false;
		});
		archive.pipe(stream);
		this.run(archive);
		archive.finalize()
			.catch((error: unknown) => {
				log.error(error);
			});
	}

	protected abstract run(archive: archiver.Archiver): void;
}
