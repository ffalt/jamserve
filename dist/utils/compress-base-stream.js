"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseCompressStream = void 0;
const archiver_1 = __importDefault(require("archiver"));
const fs_utils_1 = require("./fs-utils");
const logger_1 = require("./logger");
const log = logger_1.logger('BaseCompressStream');
class BaseCompressStream {
    constructor(filename, format) {
        this.streaming = true;
        this.filename = fs_utils_1.replaceFileSystemChars(filename, '_').replace(/ /g, '_');
        this.format = format || 'zip';
        if (!BaseCompressStream.isSupportedFormat(this.format)) {
            throw new Error('Unsupported Download Format');
        }
    }
    static isSupportedFormat(format) {
        return ['zip', 'tar'].includes(format);
    }
    pipe(stream) {
        const format = 'zip';
        const archive = archiver_1.default(this.format, { zlib: { level: 0 } });
        archive.on('error', err => {
            throw err;
        });
        stream.contentType('zip');
        stream.setHeader('Content-Disposition', `attachment; filename="${this.filename || 'download'}.${format}"`);
        stream.on('finish', () => {
            this.streaming = false;
        });
        archive.pipe(stream);
        this.run(archive);
        archive.finalize().catch(e => log.error(e));
    }
}
exports.BaseCompressStream = BaseCompressStream;
//# sourceMappingURL=compress-base-stream.js.map