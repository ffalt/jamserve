import archiver from 'archiver';
import path from 'node:path';
import { CompressListStream } from './compress-list-stream.js';

export class CompressPlaylistStream extends CompressListStream {
	protected run(archive: archiver.Archiver): void {
		super.run(archive);
		const filenames = this.list.map(f => path.basename(f));
		archive.append(this.buildM3U(filenames), { name: `${this.filename}.m3u` });
		archive.append(this.buildPLS(filenames), { name: `${this.filename}.pls` });
	}

	private buildM3U(filenames: Array<string>): string {
		return ['#EXTM3U', ...filenames].join('\n');
	}

	private buildPLS(filenames: Array<string>): string {
		const lines = ['[playlist]'];
		for (const [index, f] of filenames.entries()) lines.push(`File${index + 1}=${f}`);
		lines.push(`NumberOfEntries=${filenames.length}`, 'Version=2');
		return lines.join('\n');
	}
}
