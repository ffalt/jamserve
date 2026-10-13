import { ArtworkImageType } from '../types/enums.js';

export function artWorkImageNameToType(name: string): Array<ArtworkImageType> {
	const lname = name.toLowerCase();
	const types: Array<ArtworkImageType> = [];
	for (const type of Object.values(ArtworkImageType)) {
		if (lname.includes(type)) {
			types.push(type);
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
