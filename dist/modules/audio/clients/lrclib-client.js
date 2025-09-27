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
    async get(parameters) {
        log.info('requesting', JSON.stringify(parameters));
        return await this.getJsonWithParameters('https://lrclib.net/api/get', parameters, true);
    }
    async find(parameters) {
        const data = await this.get(parameters);
        if (!data || !(data.plainLyrics || data.syncedLyrics)) {
            return {};
        }
        return { lyrics: data.plainLyrics, syncedLyrics: data.syncedLyrics, source: `https://lrclib.net/api/get/${data.id}` };
    }
}
//# sourceMappingURL=lrclib-client.js.map