import archiver from 'archiver';
import path from 'path';
import { BaseCompressStream } from './compress-base-stream.js';

export class CompressListStream extends BaseCompressStream {
	public list: Array<string> = [];

	constructor(list: Array<string>, filename: string, format?: string) {
		super(filename, format);
		this.list = list;
	}

	protected run(archive: archiver.Archiver): void {
		this.list.forEach(file => {
			archive.file(file, { name: path.basename(file) });
		});
	}
}
