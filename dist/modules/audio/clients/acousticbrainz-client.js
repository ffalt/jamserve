"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AcousticbrainzClient = void 0;
const webservice_json_client_1 = require("../../../utils/webservice-json-client");
class AcousticbrainzClient extends webservice_json_client_1.WebserviceJSONClient {
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
exports.AcousticbrainzClient = AcousticbrainzClient;
//# sourceMappingURL=acousticbrainz-client.js.map