"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CoverArtArchiveClient = void 0;
const webservice_json_client_1 = require("../../../utils/webservice-json-client");
class CoverArtArchiveClient extends webservice_json_client_1.WebserviceJSONClient {
    constructor(options) {
        const defaultOptions = {
            host: 'https://coverartarchive.org',
            basePath: '/'
        };
        super(10, 1000, options.userAgent, { ...defaultOptions, ...options });
    }
    async parseResult(response, body) {
        if (response.statusCode === 404) {
            return Promise.resolve({ images: [] });
        }
        return super.parseResult(response, body);
    }
    async processError(e, req) {
        if (e instanceof SyntaxError) {
            return { images: [] };
        }
        return super.processError(e, req);
    }
    async releaseImages(mbid) {
        return await this.get({
            path: `${this.options.basePath}release/${mbid}/`,
            query: {},
            retry: 0
        });
    }
    async releaseGroupImages(mbid) {
        return await this.get({
            path: `${this.options.basePath}release-group/${mbid}/`,
            query: {},
            retry: 0
        });
    }
}
exports.CoverArtArchiveClient = CoverArtArchiveClient;
//# sourceMappingURL=coverartarchive-client.js.map