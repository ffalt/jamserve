"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompressFolderStream = void 0;
const compress_base_stream_1 = require("./compress-base-stream");
class CompressFolderStream extends compress_base_stream_1.BaseCompressStream {
    constructor(folder, filename, format) {
        super(filename, format);
        this.folder = folder;
    }
    run(archive) {
        archive.directory(this.folder, false);
    }
}
exports.CompressFolderStream = CompressFolderStream;
//# sourceMappingURL=compress-folder-stream.js.map