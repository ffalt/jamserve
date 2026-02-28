import archiver from 'archiver';
import { replaceFileSystemChars } from './fs-utils.js';
import { logger } from './logger.js';
const log = logger('BaseCompressStream');
export class BaseCompressStream {
    constructor(filename, format) {
        this.streaming = true;
        this.filename = replaceFileSystemChars(filename, '_').replaceAll(' ', '_');
        this.format = format ?? 'zip';
        if (!BaseCompressStream.isSupportedFormat(this.format)) {
            throw new Error('Unsupported Download Format');
        }
    }
    static isSupportedFormat(format) {
        return ['zip', 'tar'].includes(format);
    }
    pipe(stream) {
        const archive = archiver(this.format, { zlib: { level: 0 } });
        const onArchiveError = (error) => {
            log.error('Archive error:', error.message);
            this.streaming = false;
            if (stream.headersSent) {
                stream.destroy();
            }
            else {
                stream.status(500).json({ error: 'Archive creation failed' });
            }
        };
        archive.on('error', onArchiveError);
        const sanitizedName = (this.filename || 'download').replaceAll(/["\\]/g, '_').replaceAll(/[\u0000-\u001F\u007F]/g, '');
        stream.contentType(this.format);
        stream.setHeader('Content-Disposition', `attachment; filename="${sanitizedName}.${this.format}"`);
        stream.on('finish', () => {
            this.streaming = false;
        });
        archive.pipe(stream);
        this.run(archive);
        archive.finalize()
            .catch((error) => {
            onArchiveError(error instanceof Error ? error : new Error(String(error)));
        });
    }
}
//# sourceMappingURL=compress-base-stream.js.map