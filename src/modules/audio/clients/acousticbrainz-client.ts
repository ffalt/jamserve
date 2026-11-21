import { JSONOptions, JSONRequest, WebserviceJSONClient } from '../../../utils/webservice-json-client.js';
import { AcousticBrainz } from './acousticbrainz-rest-data.js';
import { REQUEST_INTERVAL_MS } from './musicbrainz-client.js';

export class AcousticbrainzClient extends WebserviceJSONClient<JSONRequest, AcousticBrainz.Response> {
	constructor(options: JSONOptions) {
		const defaultOptions = {
			host: 'https://acousticbrainz.org',
			basePath: '/api/v1/'
		};
		// unknown rate limit, using the same pacing as musicbrainz
		super(1, REQUEST_INTERVAL_MS, options.userAgent, { ...defaultOptions, ...options });
	}

	async highLevel(mbid: string, nr?: number): Promise<AcousticBrainz.Response> {
		return this.get({
			path: `${this.options.basePath}${mbid}/high-level`,
			query: { n: (nr === undefined ? undefined : nr.toString()) },
			retry: 0
		});
	}
}
