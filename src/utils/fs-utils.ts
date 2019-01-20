import path from 'path';
import fse from 'fs-extra';

export async function fileDeleteIfExists(pathName: string): Promise<void> {
	const exists = await fse.pathExists(pathName);
	if (exists) {
		await fse.unlink(pathName);
	}
}

export async function pathDeleteIfExists(pathName: string): Promise<void> {
	const exists = await fse.pathExists(pathName);
	if (exists) {
		await fse.remove(pathName);
	}
}

export function fileSuffix(filename: string): string {
	return path.extname(filename).slice(1).toLowerCase();
}

export function replaceFileSystemChars(s: string, replace: string): string {
	return s.toString()
		.replace(/:/g, ' - ')
		.replace(/[\?\/!\\]/g, replace);
}

export function cleanFolderSystemChars(s: string, replace: string): string {
	return s.toString()
		.replace(/:/g, ' -')
		.replace(/[\.\*\?\/!\\]/g, replace);
}

export function ensureTrailingPathSeparator(s: string): string {
	if (s.length > 0 && s[s.length - 1] !== path.sep) {
		return s + path.sep;
	}
	return s;
}

export function removeTrailingPathSeparator(s: string): string {
	if (s.length > 0 && s[s.length - 1] === path.sep) {
		return s.slice(0, s.length - 1);
	}
	return s;
}
