declare module 'archiver' {
	import type { Transform, TransformOptions } from 'node:stream';
	import type { ZlibOptions } from 'node:zlib';

	export interface ArchiverOptions extends TransformOptions {
		zlib?: ZlibOptions;
		statConcurrency?: number;
	}

	interface EntryData {
		name: string;
		prefix?: string;
		date?: Date | string;
		mode?: number;
		store?: boolean;
	}

	type EntryDataFunction = (entry: EntryData) => false | EntryData;

	class Archiver extends Transform {
		append(
			source: Buffer | NodeJS.ReadableStream | string,
			data: EntryData,
		): this;

		directory(dirpath: string, destpath: false | string, data?: Partial<EntryData> | EntryDataFunction): this;

		file(filename: string, data: EntryData): this;

		finalize(): Promise<void>;

		pointer(): number;
	}

	export class ZipArchive extends Archiver {
		constructor(options?: ArchiverOptions);
	}

	export class TarArchive extends Archiver {
		constructor(options?: ArchiverOptions);
	}

	export { Archiver };
}
