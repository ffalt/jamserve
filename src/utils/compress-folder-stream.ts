import { BaseCompressStream } from './compress-base-stream.js';
import { Archive } from './archive.js';

export class CompressFolderStream extends BaseCompressStream {
	constructor(public folder: string, filename: string, format?: string) {
		super(filename, format);
	}

	protected run(archive: Archive): void {
		archive.directory(this.folder, false);
	}
}
