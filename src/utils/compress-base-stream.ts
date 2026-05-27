import express from 'express';
import { replaceFileSystemChars } from './fs-utils.js';
import { logger } from './logger.js';
import { StreamData } from '../modules/deco/express/express-responder.js';
import { sanitizeFilename } from './saniitize-filename.js';
import { Archive, archive, ArchiveFormat } from './archive.js';

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

	protected createArchive(): Archive {
		return archive(this.format as ArchiveFormat, { zlib: { level: 0 } });
	}

	pipe(stream: express.Response): void {
		const container = this.createArchive();

		const onArchiveError = (error: Error): void => {
			log.error('Archive error:', error.message);
			this.streaming = false;
			if (stream.headersSent) {
				stream.destroy();
			} else {
				stream.status(500).json({ error: 'Archive creation failed' });
			}
		};

		container.on('error', onArchiveError);

		const sanitizedName = sanitizeFilename(this.filename || 'download');
		stream.contentType(this.format);
		stream.setHeader('Content-Disposition', `attachment; filename="${sanitizedName}.${this.format}"`);
		stream.on('finish', () => {
			this.streaming = false;
		});
		container.pipe(stream);
		this.run(container);
		container.finalize()
			.catch((error: unknown) => {
				onArchiveError(error instanceof Error ? error : new Error(String(error)));
			});
	}

	protected abstract run(archive: Archive): void;
}
