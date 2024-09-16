import { logger } from '../../../utils/logger.js';
import { WebserviceClient } from '../../../utils/webservice-client.js';
const log = logger('LyricsOVHClient');
export class LyricsOVHClient extends WebserviceClient {
    constructor(userAgent) {
        super(1, 1000, userAgent);
    }
    async parseResult(response) {
        if (response.status === 404) {
            return Promise.resolve({});
        }
        return super.parseResult(response);
    }
    async search(artistName, songName) {
        const url = `https://api.lyrics.ovh/v1/${LyricsOVHClient.cleanString(artistName)}/${LyricsOVHClient.cleanString(songName)}`;
        log.info('requesting', url);
        const data = await this.getJson(url, undefined, true);
        if (!data || !data.lyrics) {
            return;
        }
        return { lyrics: data.lyrics, source: url };
    }
    static cleanString(s) {
        return encodeURIComponent(s
            .replace(/[’´`]/g, '\'')
            .replace(/[():]/g, ' ')
            .replace(/[‐]/g, '-')
            .normalize()
            .trim());
    }
}
//# sourceMappingURL=lyricsovh-client.js.map