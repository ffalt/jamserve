import { describe, expect, test } from '@jest/globals';
import { processQueue } from '../../src/utils/queue.js';

async function runWithConcurrency(concurrent: number, items: number): Promise<{ maxInFlight: number; processed: Array<number> }> {
	const list = Array.from({ length: items }, (_, index) => index);
	const processed: Array<number> = [];
	let inFlight = 0;
	let maxInFlight = 0;
	await processQueue<number>(concurrent, list, async item => {
		inFlight++;
		maxInFlight = Math.max(maxInFlight, inFlight);
		await new Promise(resolve => setTimeout(resolve, 5));
		processed.push(item);
		inFlight--;
	});
	return { maxInFlight, processed };
}

describe('processQueue', () => {
	test('does nothing for an empty list', async () => {
		const result = await runWithConcurrency(2, 0);
		expect(result.processed).toEqual([]);
		expect(result.maxInFlight).toBe(0);
	});

	test('processes every item', async () => {
		const result = await runWithConcurrency(3, 12);
		expect(result.processed.sort((a, b) => a - b)).toEqual(Array.from({ length: 12 }, (_, index) => index));
	});

	test.each([1, 2, 5])('runs at most %i at the same time', async concurrent => {
		const result = await runWithConcurrency(concurrent, 20);
		expect(result.maxInFlight).toBeLessThanOrEqual(concurrent);
	});

	test('uses the given limit, not a built-in one', async () => {
		const result = await runWithConcurrency(2, 20);
		expect(result.maxInFlight).toBe(2);
	});

	test('runs one at a time for an invalid limit', async () => {
		const result = await runWithConcurrency(0, 5);
		expect(result.maxInFlight).toBe(1);
		expect(result.processed).toHaveLength(5);
	});
});
