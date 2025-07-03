export function extractAlbumName(name: string): string {
	let result = name;

	const patterns = [
		/[([]([\d]{4})[)\]]/gi, // years
		/[([](cd\s*\d*)[)\]]/gi, // CD numbers
		/[([](disc\s*\d*)[)\]]/gi, // disc numbers
		/[([](disc\s*\d*:.*)[)\]]/gi, // disc with description
		/[([](bonus.*)[)\]]/gi, // bonus content
		/[([](.*(edition|retail))[)\]]/gi, // editions and retail
		/[([](\d+\s*cds?)[)\]]/gi, // CD counts
		/[([](\d+\s*of\s*\d+)[)\]]/gi, // disc numbering
		/[([](ep|bootleg|deluxe|promo)[)\]]/gi, // format keywords 1
		/[([](single|lp|retro|ost|uvs)[)\]]/gi, // format keywords 2
		/[([](demp|demos|remix(es)?)[)\]]/gi, // format keywords 3
		/[([](remaster(ed)?|live|vinyl)[)\]]/gi, // format keywords 4
		/[([](collection|maxi)[)\]]/gi, // format keywords 5
		/-\s*cd\d*/gi // CD numbers with hyphens
	];

	// Apply each pattern
	for (const pattern of patterns) {
		result = result.replace(pattern, '');
	}

	result = result.trim();
	if (result.length === 0) {
		return name.trim();
	}
	return result;
}
