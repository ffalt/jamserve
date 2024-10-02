import { ArtworkImageType } from '../types/enums.js';

export function artWorkImageNameToType(name: string): Array<ArtworkImageType> {
	const lname = name.toLowerCase();
	const types: Array<ArtworkImageType> = [];
	for (const t in ArtworkImageType) {
		if (!Number(t) && lname.includes(t)) {
			types.push(t as ArtworkImageType);
		}
	}
	if ((!types.includes(ArtworkImageType.front)) && (lname.includes('cover') || lname.includes('folder'))) {
		types.push(ArtworkImageType.front);
	}
	if (types.length === 0) {
		types.push(ArtworkImageType.other);
	}
	types.sort((a, b) => a.localeCompare(b));
	return types;
}
