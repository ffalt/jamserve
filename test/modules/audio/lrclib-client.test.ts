import { describe, expect, test } from '@jest/globals';
import nock from 'nock';
import { bestMatch, LrclibClient, LrclibRateLimitError, lrclibDuration, LrclibResult, REQUEST_INTERVAL_MS, REQUEST_INTERVAL_MS_WITH_KEY, retryAfterMS } from '../../../src/modules/audio/clients/lrclib-client.js';

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

	describe('search', () => {
		function record(values: Partial<LrclibResult>): LrclibResult {
			return { ...lyrics, ...values } as LrclibResult;
		}

		test('does not send a duration, since the endpoint has no such parameter', async () => {
			const scope = nock('https://lrclib.net').get('/api/search').query(actual => actual.duration === undefined).reply(200, [lyrics]);
			await makeClient().findBySearch({ track_name: 'Song', artist_name: 'Artist', duration: 100 });
			expect(scope.isDone()).toBe(true);
		});

		test('still sends the track and artist keywords', async () => {
			const scope = nock('https://lrclib.net').get('/api/search').query({ track_name: 'Song', artist_name: 'Artist' }).reply(200, [lyrics]);
			await makeClient().findBySearch({ track_name: 'Song', artist_name: 'Artist' });
			expect(scope.isDone()).toBe(true);
		});

		test('reports no lyrics for an empty result list', async () => {
			nock('https://lrclib.net').get('/api/search').query(true).reply(200, []);
			expect(await makeClient().findBySearch({ track_name: 'Song' })).toEqual({});
		});

		test('returns the lyrics of the picked record', async () => {
			nock('https://lrclib.net').get('/api/search').query(true).reply(200, [lyrics]);
			expect((await makeClient().findBySearch({ track_name: 'Song' })).syncedLyrics).toBe(lyrics.syncedLyrics);
		});

		describe('bestMatch', () => {
			test('picks nothing from an empty list', () => {
				expect(bestMatch([], 100)).toBeUndefined();
			});

			test('skips an instrumental record', () => {
				expect(bestMatch([record({ instrumental: true })], 100)).toBeUndefined();
			});

			test('skips a record without any lyrics', () => {
				expect(bestMatch([record({ plainLyrics: '', syncedLyrics: '' })], 100)).toBeUndefined();
			});

			test('prefers a synced record over a plain one', () => {
				const plain = record({ id: 1, syncedLyrics: '' });
				const synced = record({ id: 2 });
				expect(bestMatch([plain, synced], 100)?.id).toBe(2);
			});

			test('drops a record whose duration is too far off', () => {
				expect(bestMatch([record({ duration: 130 })], 100)).toBeUndefined();
			});

			test('keeps a record inside the two second tolerance', () => {
				expect(bestMatch([record({ duration: 102 })], 100)?.id).toBe(42);
			});

			test('picks the closest duration among several', () => {
				const near = record({ id: 1, duration: 101 });
				const exact = record({ id: 2, duration: 100 });
				expect(bestMatch([near, exact], 100)?.id).toBe(2);
			});

			test('ignores duration when the track has none', () => {
				expect(bestMatch([record({ duration: 999 })], undefined)?.id).toBe(42);
			});

			test('prefers synced even when a plain record matches the duration better', () => {
				const plainExact = record({ id: 1, duration: 100, syncedLyrics: '' });
				const syncedNear = record({ id: 2, duration: 101 });
				expect(bestMatch([plainExact, syncedNear], 100)?.id).toBe(2);
			});
		});
	});

	describe('client errors', () => {
		test('does not mistake an unauthorized key for a track without lyrics', async () => {
			nock('https://lrclib.net').get('/api/get').query(true).reply(401, { message: 'Invalid API key', name: 'InvalidApiKeyError', statusCode: 401 });
			await expect(makeClient({ apiKey: 'wrong' }).find(query)).rejects.toThrow('401');
		});

		test('reports the message the service sent', async () => {
			nock('https://lrclib.net').get('/api/get').query(true).reply(400, { message: 'duration: must be between 1 and 3600', name: 'ValidationError', statusCode: 400 });
			await expect(makeClient().find(query)).rejects.toThrow('duration: must be between 1 and 3600');
		});

		test('survives an error body that is not json', async () => {
			nock('https://lrclib.net').get('/api/get').query(true).reply(400, 'Failed to deserialize query string: missing field `artist_name`', { 'content-type': 'text/plain' });
			await expect(makeClient().find(query)).rejects.toThrow('missing field');
		});

		test('still reports a missing track as no lyrics', async () => {
			nock('https://lrclib.net').get('/api/get').query(true).reply(404, { message: 'Failed to find specified track', name: 'TrackNotFound', statusCode: 404 });
			expect(await makeClient().find(query)).toEqual({});
		});
	});

	describe('sequential requests', () => {
		class SequenceProbe extends LrclibClient {
			active = 0;
			overlapped = false;

			protected async getJsonWithParameters<T>(): Promise<T> {
				this.active++;
				this.overlapped ||= this.active > 1;
				await new Promise(resolve => setTimeout(resolve, 20));
				this.active--;
				return lyrics as T;
			}
		}

		test('waits for a request to finish before starting the next', async () => {
			const client = new SequenceProbe({ userAgent: 'JamServe/test', apiKey: 'secret' });
			client.enabled = true;
			await Promise.all([0, 1, 2].map(async () => client.get(query)));
			expect(client.overlapped).toBe(false);
		});

		test('still answers every caller', async () => {
			const client = new SequenceProbe({ userAgent: 'JamServe/test', apiKey: 'secret' });
			client.enabled = true;
			const results = await Promise.all([0, 1, 2].map(async () => client.get(query)));
			expect(results.map(result => result?.id)).toEqual([42, 42, 42]);
		});
	});

	describe('lrclibDuration', () => {
		test('keeps a duration the api accepts', () => {
			expect(lrclibDuration(180)).toBe(180);
		});

		test('rounds to whole seconds', () => {
			expect(lrclibDuration(180.6)).toBe(181);
		});

		test('drops a duration below the allowed range', () => {
			expect(lrclibDuration(0)).toBeUndefined();
		});

		test('drops a duration above the allowed range', () => {
			expect(lrclibDuration(3601)).toBeUndefined();
		});

		test('drops a missing duration', () => {
			expect(lrclibDuration(undefined)).toBeUndefined();
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
