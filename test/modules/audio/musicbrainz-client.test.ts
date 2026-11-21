import { describe, expect, test } from '@jest/globals';
import nock from 'nock';
import { MusicbrainzClient, REQUEST_INTERVAL_MS } from '../../../src/modules/audio/clients/musicbrainz-client.js';
import { MusicBrainzLookupType } from '../../../src/types/enums.js';

const mbid = 'dbdb86f4-921a-31de-a698-dfd84ddfa3fb';
const releaseGroup = { 'id': mbid, 'title': 'Album', 'artist-credit': [] };

function makeClient(): MusicbrainzClient {
	const client = new MusicbrainzClient({ userAgent: 'JamServe/test (https://example.com)', retryOn: true, retryCount: 2, retryDelay: 10 });
	client.enabled = true;
	return client;
}

describe('MusicbrainzClient', () => {
	test('spaces requests out instead of letting a burst through', async () => {
		nock('https://musicbrainz.org').get(`/ws/2/release-group/${mbid}`).query(true).times(3).reply(200, releaseGroup);
		const client = makeClient();
		const start = Date.now();
		for (let index = 0; index < 3; index++) {
			await client.lookup({ type: MusicBrainzLookupType.releaseGroup, id: mbid });
		}
		expect(Date.now() - start).toBeGreaterThanOrEqual(REQUEST_INTERVAL_MS * 2 * 0.9);
	});

	test('retries a 503 rate limit response and returns the result', async () => {
		const scope = nock('https://musicbrainz.org')
			.get(`/ws/2/release-group/${mbid}`).query(true).reply(503, { error: 'Your requests are exceeding the allowable rate limit.' })
			.get(`/ws/2/release-group/${mbid}`).query(true).reply(200, releaseGroup);
		const data = await makeClient().lookup({ type: MusicBrainzLookupType.releaseGroup, id: mbid });
		expect(data.releaseGroup?.id).toBe(mbid);
		expect(scope.isDone()).toBe(true);
	});

	test('fails after the configured retry count is used up', async () => {
		const scope = nock('https://musicbrainz.org')
			.get(`/ws/2/release-group/${mbid}`).query(true).times(3).reply(503, { error: 'Your requests are exceeding the allowable rate limit.' });
		await expect(makeClient().lookup({ type: MusicBrainzLookupType.releaseGroup, id: mbid })).rejects.toThrow(/Invalid Result/);
		expect(scope.isDone()).toBe(true);
	});
});
