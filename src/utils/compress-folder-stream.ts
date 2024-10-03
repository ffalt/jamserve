import archiver from 'archiver';
import { BaseCompressStream } from './compress-base-stream.js';

export class CompressFolderStream extends BaseCompressStream {
	constructor(public folder: string, filename: string, format?: string) {
		super(filename, format);
	}

	protected run(archive: archiver.Archiver): void {
		archive.directory(this.folder, false);
	}
}
