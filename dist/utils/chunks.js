export const ID_CHUNK_SIZE = 500;
export function chunks(items, size = ID_CHUNK_SIZE) {
    if (items.length <= size) {
        return items.length === 0 ? [] : [items];
    }
    const result = [];
    for (let start = 0; start < items.length; start += size) {
        result.push(items.slice(start, start + size));
    }
    return result;
}
export async function collectChunked(items, load, size = ID_CHUNK_SIZE) {
    const result = [];
    for (const chunk of chunks(items, size)) {
        result.push(...await load(chunk));
    }
    return result;
}
//# sourceMappingURL=chunks.js.map