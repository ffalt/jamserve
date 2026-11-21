import { WebserviceJSONClient } from '../../../utils/webservice-json-client.js';
import { REQUEST_INTERVAL_MS } from './musicbrainz-client.js';
export class AcousticbrainzClient extends WebserviceJSONClient {
    constructor(options) {
        const defaultOptions = {
            host: 'https://acousticbrainz.org',
            basePath: '/api/v1/'
        };
        super(1, REQUEST_INTERVAL_MS, options.userAgent, { ...defaultOptions, ...options });
    }
    async highLevel(mbid, nr) {
        return this.get({
            path: `${this.options.basePath}${mbid}/high-level`,
            query: { n: (nr === undefined ? undefined : nr.toString()) },
            retry: 0
        });
    }
}
//# sourceMappingURL=acousticbrainz-client.js.map