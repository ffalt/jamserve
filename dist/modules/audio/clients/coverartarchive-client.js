import { WebserviceJSONClient } from '../../../utils/webservice-json-client.js';
export class CoverArtArchiveClient extends WebserviceJSONClient {
    constructor(options) {
        const defaultOptions = {
            host: 'https://coverartarchive.org',
            basePath: '/'
        };
        super(10, 1000, options.userAgent, { ...defaultOptions, ...options });
    }
    async parseResult(response) {
        if (response.status === 404) {
            return Promise.resolve({ images: [] });
        }
        return super.parseResult(response);
    }
    async processError(error, req) {
        if (error instanceof SyntaxError) {
            return { images: [] };
        }
        return super.processError(error, req);
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
//# sourceMappingURL=coverartarchive-client.js.map