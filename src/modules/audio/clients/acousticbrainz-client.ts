import {JSONOptions, JSONRequest, WebserviceJSONClient} from '../../../utils/webservice-json-client';
import {AcousticBrainz} from './acousticbrainz-rest-data';

export class AcousticbrainzClient extends WebserviceJSONClient<JSONRequest, AcousticBrainz.Response> {

	constructor(options: JSONOptions) {
		const defaultOptions = {
			host: 'https://acousticbrainz.org',
			basePath: '/api/v1/'
		};
		// unknown rate limit, using same from musicbrainz https://musicbrainz.org/doc/XML_Web_Service/Rate_Limiting "Currently that rate is (on average) 1 request per second. (per ip)"
		super(1, 1000, options.userAgent, {...defaultOptions, ...options});
	}

	async highLevel(mbid: string, nr?: number): Promise<AcousticBrainz.Response> {
		return this.get({
			path: `${this.options.basePath}${mbid}/high-level`,
			query: {n: (nr !== undefined ? nr.toString() : undefined)},
			retry: 0
		});
	}

}
