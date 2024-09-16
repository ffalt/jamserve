import { BaseCompressStream } from './compress-base-stream.js';
export class CompressFolderStream extends BaseCompressStream {
    constructor(folder, filename, format) {
        super(filename, format);
        this.folder = folder;
    }
    run(archive) {
        archive.directory(this.folder, false);
    }
}
//# sourceMappingURL=compress-folder-stream.js.map