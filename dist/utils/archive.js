import { ZipArchive, TarArchive } from 'archiver';
export function archive(format, options) {
    if (format === 'zip') {
        return new ZipArchive(options);
    }
    if (format === 'tar') {
        return new TarArchive(options);
    }
    throw new Error(`Unknown format: ${format}`);
}
//# sourceMappingURL=archive.js.map