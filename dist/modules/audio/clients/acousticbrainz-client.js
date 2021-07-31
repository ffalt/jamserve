import { WebserviceJSONClient } from '../../../utils/webservice-json-client';
export class AcousticbrainzClient extends WebserviceJSONClient {
    constructor(options) {
        const defaultOptions = {
            host: 'https://acousticbrainz.org',
            basePath: '/api/v1/'
        };
        super(1, 1000, options.userAgent, { ...defaultOptions, ...options });
    }
    async highLevel(mbid, nr) {
        return this.get({
            path: `${this.options.basePath}${mbid}/high-level`,
            query: { n: (nr !== undefined ? nr.toString() : undefined) },
            retry: 0
        });
    }
}
//# sourceMappingURL=acousticbrainz-client.js.map