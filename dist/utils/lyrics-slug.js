const cutMarker = /[([/:]/u;
const featuring = /\s+(feat|ft|featuring)\.?\s.*$/i;
const diacritic = /\p{Diacritic}/gu;
const nonAlphanumeric = /[^\p{Letter}\p{Number}]/gu;
export function shortenLyricsTitle(title) {
    let result = title;
    const index = result.search(cutMarker);
    if (index > 0) {
        result = result.slice(0, index);
    }
    result = result.replace(featuring, '').trim();
    if (result.length === 0 || result === title.trim()) {
        return undefined;
    }
    return result;
}
export function lyricsSlug(value) {
    return value
        .normalize('NFD')
        .replaceAll(diacritic, '')
        .replaceAll(nonAlphanumeric, '')
        .toLowerCase();
}
//# sourceMappingURL=lyrics-slug.js.map