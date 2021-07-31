import genreData from '../static/genres.json';
let GenresSlugs;
export const Genres = genreData.list;
function slugify(genre) {
    return genre.replace(/[& \-.]/g, '').toLowerCase();
}
function buildGenreSlugs() {
    if (!GenresSlugs) {
        GenresSlugs = {};
        Genres.forEach(g => {
            GenresSlugs[slugify(g)] = g;
        });
    }
}
export function getKnownGenre(genre) {
    const slug = slugify(genre);
    buildGenreSlugs();
    return GenresSlugs[slug];
}
export function cleanGenre(genre) {
    const results = [];
    const parts = genre.split('/');
    parts.forEach(part => {
        part = part.trim();
        const numpart = /\((\d+)\)/.exec(part);
        let num;
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
            let result;
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
            }
            else if (result) {
                if (!results.includes(result)) {
                    results.push(result);
                }
            }
            else {
                if (!results.includes(part)) {
                    results.push(part);
                }
            }
        }
    });
    return results;
}
//# sourceMappingURL=genres.js.map