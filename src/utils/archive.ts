import archiver, { ZipArchive, TarArchive, type ArchiverOptions } from 'archiver';

export type ArchiveFormat = 'zip' | 'tar' | 'json';

export type Archive = archiver.Archiver;

export function archive(format: ArchiveFormat, options?: ArchiverOptions): archiver.Archiver {
	if (format === 'zip') {
		return new ZipArchive(options);
	}
	if (format === 'tar') {
		return new TarArchive(options);
	}
	throw new Error(`Unknown format: ${format}`);
}
