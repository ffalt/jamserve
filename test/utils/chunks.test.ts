import { describe, expect, test } from '@jest/globals';
import { chunks, collectChunked, ID_CHUNK_SIZE } from '../../src/utils/chunks.js';

function ids(count: number): Array<string> {
	return Array.from({ length: count }, (_, index) => `id-${index}`);
}

describe('chunks', () => {
	test('returns nothing for an empty list', () => {
		expect(chunks([])).toEqual([]);
	});

	test('returns one chunk if the list fits', () => {
		expect(chunks(ids(3), 5)).toEqual([['id-0', 'id-1', 'id-2']]);
	});

	test('splits a longer list', () => {
		const result = chunks(ids(12), 5);
		expect(result).toHaveLength(3);
		expect(result[0]).toHaveLength(5);
		expect(result[2]).toEqual(['id-10', 'id-11']);
	});

	test('keeps every item, in order', () => {
		expect(chunks(ids(1001), ID_CHUNK_SIZE).flat()).toEqual(ids(1001));
	});
});

describe('collectChunked', () => {
	test('runs no query for an empty list', async () => {
		let calls = 0;
		const result = await collectChunked<string, string>([], async chunk => {
			calls++;
			return chunk;
		});
		expect(calls).toBe(0);
		expect(result).toEqual([]);
	});

	test('runs one query per chunk and collects the results', async () => {
		const sizes: Array<number> = [];
		const result = await collectChunked<string, string>(ids(1200), async chunk => {
			sizes.push(chunk.length);
			return chunk;
		}, 500);
		expect(sizes).toEqual([500, 500, 200]);
		expect(result).toEqual(ids(1200));
	});
});
