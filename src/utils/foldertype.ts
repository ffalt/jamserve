import path from 'path';

export function isExtraFolder(folder: string): boolean {
	const name = path.basename(folder).toLowerCase();
	return !!name.match(/^\[?(extra|various)]?$/);
}
