import { describe, expect, test } from '@jest/globals';
import { backoffDelayMS } from '../../src/utils/webservice-json-client.js';

describe('backoffDelayMS', () => {
	test('waits the base delay on the first retry', () => {
		expect(backoffDelayMS(3000, 1)).toBe(3000);
	});

	test('doubles the delay with every further retry', () => {
		expect([2, 3, 4].map(retry => backoffDelayMS(3000, retry))).toEqual([6000, 12_000, 24_000]);
	});
});
