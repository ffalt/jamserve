import { describe, expect, test } from '@jest/globals';
import nock from 'nock';
import { LrclibClient, LrclibRateLimitError, REQUEST_INTERVAL_MS, REQUEST_INTERVAL_MS_WITH_KEY, retryAfterMS } from '../../../src/modules/audio/clients/lrclib-client.js';

const lyrics = { id: 42, trackName: 'Song', artistName: 'Artist', albumName: 'Album', duration: 100, instrumental: false, plainLyrics: 'first line', syncedLyrics: '[00:12.34]first line' };
const query = { track_name: 'Song', artist_name: 'Artist' };

function makeClient(options: { apiKey?: string; appId?: string } = {}): LrclibClient {
	const client = new LrclibClient({ userAgent: 'JamServe/test (https://example.com)', ...options });
	client.enabled = true;
	return client;
}

describe('LrclibClient', () => {
	describe('identification headers', () => {
		test('sends no lrclib header when neither key nor app id is configured', async () => {
			const scope = nock('https://lrclib.net', { badheaders: ['Lrclib-Api-Key', 'Lrclib-App-Id'] }).get('/api/get').query(true).reply(200, lyrics);
			await makeClient().get(query);
			expect(scope.isDone()).toBe(true);
		});

		test('sends the api key when configured', async () => {
			const scope = nock('https://lrclib.net', { reqheaders: { 'Lrclib-Api-Key': 'secret' } }).get('/api/get').query(true).reply(200, lyrics);
			await makeClient({ apiKey: 'secret' }).get(query);
			expect(scope.isDone()).toBe(true);
		});

		test('sends the app id when only that is configured', async () => {
			const scope = nock('https://lrclib.net', { reqheaders: { 'Lrclib-App-Id': 'public-id' } }).get('/api/get').query(true).reply(200, lyrics);
			await makeClient({ appId: 'public-id' }).get(query);
			expect(scope.isDone()).toBe(true);
		});

		test('prefers the api key over the app id', async () => {
			const scope = nock('https://lrclib.net', { badheaders: ['Lrclib-App-Id'] }).get('/api/get').query(true).reply(200, lyrics);
			await makeClient({ apiKey: 'secret', appId: 'public-id' }).get(query);
			expect(scope.isDone()).toBe(true);
		});

		test('always identifies itself by user agent', async () => {
			const scope = nock('https://lrclib.net', { reqheaders: { 'User-Agent': 'JamServe/test (https://example.com)' } }).get('/api/get').query(true).reply(200, lyrics);
			await makeClient().get(query);
			expect(scope.isDone()).toBe(true);
		});
	});

	describe('request pacing', () => {
		async function timeRequests(client: LrclibClient, count: number): Promise<number> {
			nock('https://lrclib.net').get('/api/get').query(true).times(count).reply(200, lyrics);
			const start = Date.now();
			for (let index = 0; index < count; index++) {
				await client.get(query);
			}
			return Date.now() - start;
		}

		test('spaces requests out instead of letting a burst through', async () => {
			expect(await timeRequests(makeClient(), 3)).toBeGreaterThanOrEqual(REQUEST_INTERVAL_MS * 2 * 0.9);
		});

		test('keeps the gap close to the interval rather than stalling', async () => {
			expect(await timeRequests(makeClient(), 2)).toBeLessThan(REQUEST_INTERVAL_MS * 2);
		});

		test('paces faster when an api key is configured', async () => {
			expect(await timeRequests(makeClient({ apiKey: 'secret' }), 3)).toBeLessThan(REQUEST_INTERVAL_MS);
		});

		test('stays within the documented allowance', () => {
			expect(60_000 / REQUEST_INTERVAL_MS).toBeLessThan(90);
			expect(60_000 / REQUEST_INTERVAL_MS_WITH_KEY).toBeLessThan(6000);
		});
	});

	describe('retry on rate limit', () => {
		test('waits and retries when the service answers 429', async () => {
			nock('https://lrclib.net').get('/api/get').query(true).reply(429, {}, { 'retry-after': '0' });
			nock('https://lrclib.net').get('/api/get').query(true).reply(200, lyrics);
			expect((await makeClient().get(query))?.id).toBe(42);
		});

		test('retries when the service answers 503', async () => {
			nock('https://lrclib.net').get('/api/get').query(true).reply(503, {}, { 'retry-after': '0' });
			nock('https://lrclib.net').get('/api/get').query(true).reply(200, lyrics);
			expect((await makeClient().get(query))?.id).toBe(42);
		});

		test('gives up after the retries are used up', async () => {
			nock('https://lrclib.net').get('/api/get').query(true).times(3).reply(429, {}, { 'retry-after': '0' });
			await expect(makeClient().get(query)).rejects.toThrow(LrclibRateLimitError);
		});

		test('reports no lyrics for an unknown track', async () => {
			nock('https://lrclib.net').get('/api/get').query(true).reply(404, {});
			expect(await makeClient().find(query)).toEqual({});
		});
	});

	describe('retryAfterMS', () => {
		test('turns the header seconds into milliseconds', () => {
			expect(retryAfterMS('2')).toBeGreaterThanOrEqual(2000);
		});

		test('adds jitter on top of the header value', () => {
			expect(retryAfterMS('2')).toBeLessThanOrEqual(2600);
		});

		test('falls back to a second without a header', () => {
			expect(retryAfterMS(null)).toBeGreaterThanOrEqual(1000);
		});

		test('ignores a header that is not a number', () => {
			expect(retryAfterMS('later')).toBeGreaterThanOrEqual(1000);
		});

		test('caps a very long wait', () => {
			expect(retryAfterMS('86400')).toBe(60_000);
		});
	});
});
