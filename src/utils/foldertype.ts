import path from 'node:path';

export function isExtraFolder(folder: string): boolean {
	const name = path.basename(folder).toLowerCase();
	const pattern = /^\[?(extra|various)]?$/;
	return pattern.exec(name) !== null;
}
