import fse from 'fs-extra';
import path from 'path';

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

export function fileExt(filename: string): string {
	return path.extname(filename).toLowerCase();
}

export function basenameStripExt(filename: string): string {
	return path.basename(filename, path.extname(filename));
}

export function replaceFileSystemChars(s: string, replace: string): string {
	return s.toString()
		.replace(/:/g, ' - ')
		.replace(/[?/!\\"|*]/g, replace);
}

const FolderSystemCharsRegEx = /[<>:"/\\|?*]|^(?:aux|con|clock\$|nul|prn|com[1-9]|lpt[1-9])$/i;

export function containsFolderSystemChars(s: string): boolean {
	return FolderSystemCharsRegEx.test(s);
}

export function replaceFolderSystemChars(s: string, replace: string): string {
	/*
		< (less than)
		> (greater than)
		: (colon)
		" (double quote)
		/ (forward slash)
		\ (backslash)
		| (vertical bar or pipe)
		? (question mark)
		* (asterisk)
	 */
	return s.toString()
		.replace(/:/g, ' -')
		.replace(/[|*?/!\\<>"]/g, replace);
}

export function ensureTrailingPathSeparator(s: string): string {
	if (!s.endsWith(path.sep)) {
		return s + path.sep;
	}
	return s;
}

export function removeTrailingPathSeparator(s: string): string {
	if (s.endsWith(path.sep)) {
		return s.slice(0, s.length - 1);
	}
	return s;
}
