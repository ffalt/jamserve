import path from 'node:path';
import { BaseCompressStream } from './compress-base-stream.js';
import { Archive } from './archive.js';

export class CompressListStream extends BaseCompressStream {
	public list: Array<string> = [];

	constructor(list: Array<string>, filename: string, format?: string) {
		super(filename, format);
		this.list = list;
	}

	protected run(archive: Archive): void {
		for (const file of this.list) {
			archive.file(file, { name: path.basename(file) });
		}
	}
}
