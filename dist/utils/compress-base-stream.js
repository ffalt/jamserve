import archiver from 'archiver';
import { replaceFileSystemChars } from './fs-utils.js';
import { logger } from './logger.js';
const log = logger('BaseCompressStream');
export class BaseCompressStream {
    constructor(filename, format) {
        this.streaming = true;
        this.filename = replaceFileSystemChars(filename, '_').replace(/ /g, '_');
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
        const archive = archiver(this.format, { zlib: { level: 0 } });
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
//# sourceMappingURL=compress-base-stream.js.map