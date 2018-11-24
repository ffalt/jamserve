import path from 'path';
import fse from 'fs-extra';

export async function fileDeleteIfExists(pathName: string): Promise<void> {
	const exists = await fse.pathExists(pathName);
	if (exists) {
		await fse.unlink(pathName);
	}
}

export function fileSuffix(filename: string): string {
	return path.extname(filename).slice(1).toLowerCase();
}

export function replaceFileSystemChars(s: string, replace: string): string {
	return s.toString()
		.replace(/:/g, ' - ').replace(/  /g, ' ')
		.replace(/[\?\/!\\]/g, replace);
}
