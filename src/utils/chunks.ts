/**
 * Ids collected during a scan can be hundreds of thousands, and they end up inlined
 * into the `IN (…)` list of one statement. Queries over such a list are split into chunks.
 */
export const ID_CHUNK_SIZE = 500;

export function chunks<T>(items: Array<T>, size: number = ID_CHUNK_SIZE): Array<Array<T>> {
	if (items.length <= size) {
		return items.length === 0 ? [] : [items];
	}
	const result: Array<Array<T>> = [];
	for (let start = 0; start < items.length; start += size) {
		result.push(items.slice(start, start + size));
	}
	return result;
}

/**
 * Run a query for each chunk of the given items and collect the results.
 */
export async function collectChunked<T, R>(items: Array<T>, load: (chunk: Array<T>) => Promise<Array<R>>, size: number = ID_CHUNK_SIZE): Promise<Array<R>> {
	const result: Array<R> = [];
	for (const chunk of chunks(items, size)) {
		result.push(...await load(chunk));
	}
	return result;
}
