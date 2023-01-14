import fs from 'fs';

const genreData = JSON.parse(fs.readFileSync(new URL('../static/genres.json', import.meta.url)).toString());

let GenresSlugs: { [slug: string]: string }; // will be build on first use

export const Genres: Array<string> = genreData.list;

function slugify(genre: string): string {
	return genre.replace(/[& \-.]/g, '').toLowerCase();
}

function buildGenreSlugs(): void {
	if (!GenresSlugs) {
		GenresSlugs = {};
		Genres.forEach(g => {
			GenresSlugs[slugify(g)] = g;
		});
	}
}

export function getKnownGenre(genre: string): string | undefined {
	const slug = slugify(genre);
	buildGenreSlugs();
	return GenresSlugs[slug];
}

export function cleanGenre(genre: string): Array<string> {
	const results: Array<string> = [];
	const parts = genre.split('/');
	parts.forEach(part => {
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
			buildGenreSlugs();
			if (GenresSlugs && GenresSlugs[slug]) {
				result = GenresSlugs[slug];
			}
			if (!result && part.includes(' & ')) {
				const subParts = part.split('&');
				subParts.forEach(sub => {
					const subs = cleanGenre(sub);
					for (const s of subs) {
						if (!results.includes(s)) {
							results.push(s);
						}
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
	return results;
}
