import path from 'path';
import { BaseCompressStream } from './compress-base-stream';
export class CompressListStream extends BaseCompressStream {
    constructor(list, filename, format) {
        super(filename, format);
        this.list = [];
        this.list = list;
    }
    run(archive) {
        this.list.forEach(file => {
            archive.file(file, { name: path.basename(file) });
        });
    }
}
//# sourceMappingURL=compress-list-stream.js.map