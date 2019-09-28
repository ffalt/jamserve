import {hashMD5} from './hash';

export function generateArtworkId(folderID: string, filename: string, size: number): string {
	return `${folderID}-${hashMD5(`${filename}${size}${filename}`)}`;
}
