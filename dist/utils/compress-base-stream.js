import { replaceFileSystemChars } from './fs-utils.js';
import { logger } from './logger.js';
import { sanitizeFilename } from './saniitize-filename.js';
import { archive } from './archive.js';
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
    createArchive() {
        return archive(this.format, { zlib: { level: 0 } });
    }
    pipe(stream) {
        const container = this.createArchive();
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
        container.on('error', onArchiveError);
        const sanitizedName = sanitizeFilename(this.filename || 'download');
        stream.contentType(this.format);
        stream.setHeader('Content-Disposition', `attachment; filename="${sanitizedName}.${this.format}"`);
        stream.on('finish', () => {
            this.streaming = false;
        });
        container.pipe(stream);
        this.run(container);
        container.finalize()
            .catch((error) => {
            onArchiveError(error instanceof Error ? error : new Error(String(error)));
        });
    }
}
//# sourceMappingURL=compress-base-stream.js.map