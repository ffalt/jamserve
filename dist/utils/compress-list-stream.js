import path from 'node:path';
import { BaseCompressStream } from './compress-base-stream.js';
export class CompressListStream extends BaseCompressStream {
    constructor(list, filename, format) {
        super(filename, format);
        this.list = [];
        this.list = list;
    }
    run(archive) {
        for (const file of this.list) {
            archive.file(file, { name: path.basename(file) });
        }
    }
}
//# sourceMappingURL=compress-list-stream.js.map