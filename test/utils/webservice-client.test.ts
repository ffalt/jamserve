import { describe, expect, test } from '@jest/globals';
import { WebserviceClient } from '../../src/utils/webservice-client.js';

class ProbeClient extends WebserviceClient {
	async spend(count: number): Promise<number> {
		const start = Date.now();
		for (let index = 0; index < count; index++) {
			await this.limit();
		}
		return Date.now() - start;
	}
}

describe('WebserviceClient rate limit', () => {
	test('spaces requests out over the declared interval', async () => {
		const client = new ProbeClient(1, 200, 'test');
		expect(await client.spend(4)).toBeGreaterThanOrEqual(500);
	});

	test('lets a burst up to the declared tokens through at once', async () => {
		const client = new ProbeClient(4, 200, 'test');
		expect(await client.spend(4)).toBeLessThan(100);
	});

	test('throttles the requests after the burst', async () => {
		const client = new ProbeClient(2, 200, 'test');
		expect(await client.spend(6)).toBeGreaterThanOrEqual(400);
	});
});
