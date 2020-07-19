"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompressListStream = void 0;
const path_1 = __importDefault(require("path"));
const compress_base_stream_1 = require("./compress-base-stream");
class CompressListStream extends compress_base_stream_1.BaseCompressStream {
    constructor(list, filename, format) {
        super(filename, format);
        this.list = [];
        this.list = list;
    }
    run(archive) {
        this.list.forEach(file => {
            archive.file(file, { name: path_1.default.basename(file) });
        });
    }
}
exports.CompressListStream = CompressListStream;
//# sourceMappingURL=compress-list-stream.js.map