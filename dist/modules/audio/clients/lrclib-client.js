import { logger } from '../../../utils/logger.js';
import { WebserviceClient } from '../../../utils/webservice-client.js';
const log = logger('LrclibClient');
export class LrclibClient extends WebserviceClient {
    constructor(userAgent) {
        super(1, 1000, userAgent);
    }
    async parseResult(response) {
        if (response.status === 404) {
            return Promise.resolve({});
        }
        return super.parseResult(response);
    }
    async get(params) {
        log.info('requesting', JSON.stringify(params));
        return await this.getJson('https://lrclib.net/api/get', params, true);
    }
    async find(params) {
        const data = await this.get(params);
        if (!data || !(data.plainLyrics || data.syncedLyrics)) {
            return {};
        }
        return { lyrics: data.plainLyrics, syncedLyrics: data.syncedLyrics, source: `https://lrclib.net/api/get/${data.id}` };
    }
}
//# sourceMappingURL=lrclib-client.js.map