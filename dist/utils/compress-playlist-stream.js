import path from 'node:path';
import { CompressListStream } from './compress-list-stream.js';
export class CompressPlaylistStream extends CompressListStream {
    run(archive) {
        super.run(archive);
        const filenames = this.list.map(f => path.basename(f));
        archive.append(this.buildM3U(filenames), { name: `${this.filename}.m3u` });
        archive.append(this.buildPLS(filenames), { name: `${this.filename}.pls` });
    }
    buildM3U(filenames) {
        return ['#EXTM3U', ...filenames].join('\n');
    }
    buildPLS(filenames) {
        const lines = ['[playlist]'];
        for (const [index, f] of filenames.entries())
            lines.push(`File${index + 1}=${f}`);
        lines.push(`NumberOfEntries=${filenames.length}`, 'Version=2');
        return lines.join('\n');
    }
}
//# sourceMappingURL=compress-playlist-stream.js.map