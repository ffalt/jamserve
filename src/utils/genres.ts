import genreData from '../model/genres.json';

let GenresSlugs: { [slug: string]: string }; // will be build on first use

export const Genres: Array<string> = genreData.list;

function slugify(genre: string): string {
	return genre.replace(/[& \-.]/g, '').toLowerCase();
}

export function getKnownGenre(genre: string): string | undefined {
	const slug = slugify(genre);
	if (!GenresSlugs) {
		GenresSlugs = {};
		Genres.forEach(g => {
			GenresSlugs[slugify(g)] = g;
		});
	}
	return GenresSlugs[slug];
}

export function cleanGenre(genre: string): string {
	const results: Array<string> = [];
	const parts = genre.split('/');
	parts.forEach((part: string) => {
		// test for (number)
		part = part.trim();
		const numpart = /\((\d+)\)/.exec(part);
		let num: number | undefined;
		if (numpart) {
			num = parseInt(numpart[1], 10);
			part = part.slice(0, numpart.index) + part.slice(numpart.index + numpart[0].length);
		}
		if (part.length === 0 && (num !== undefined)) {
			const s = genreData.id3v1[num];
			if (s) {
				part = s;
			}
		}
		if (part.length > 0) {
			const slug = slugify(part);
			let result: string | undefined;
			if (!GenresSlugs) {
				GenresSlugs = {};
				Genres.forEach(g => {
					GenresSlugs[slugify(g)] = g;
				});
			}
			if (GenresSlugs && GenresSlugs[slug]) {
				result = GenresSlugs[slug];
			}
			if (!result && part.includes(' & ')) {
				const subParts = part.split('&');
				subParts.forEach(sub => {
					sub = cleanGenre(sub);
					if (!results.includes(sub)) {
						results.push(sub);
					}
				});
			} else if (result) {
				if (!results.includes(result)) {
					results.push(result);
				}
			} else {
				if (!results.includes(part)) {
					results.push(part);
				}
			}
		}
	});
	return results.join(' / ');
}
