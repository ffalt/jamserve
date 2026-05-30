import { logger } from '../../../utils/logger.js';
import { WebserviceClient } from '../../../utils/webservice-client.js';
import fetch from 'node-fetch';
const log = logger('DiscogsClient');
export class DiscogsClient extends WebserviceClient {
    constructor(options) {
        super(25, 60000, options.userAgent);
        this.ua = options.userAgent;
        this.token = options.apiToken ?? '';
    }
    headers() {
        const h = { 'User-Agent': this.ua };
        if (this.token) {
            h.Authorization = `Discogs token=${this.token}`;
        }
        return h;
    }
    async doSearch(parameters) {
        this.checkDisabled();
        await this.limit();
        const url = new URL('https://api.discogs.com/database/search');
        url.searchParams.set('per_page', '10');
        for (const [key, value] of Object.entries(parameters)) {
            url.searchParams.set(key, value);
        }
        log.info('requesting', url.toString());
        const response = await fetch(url.toString(), { headers: this.headers(), signal: AbortSignal.timeout(30000) });
        if (!response.ok) {
            log.error(`Discogs search failed: ${response.status} ${response.statusText}`);
            return undefined;
        }
        return response.json();
    }
    async searchRelease(artist, title) {
        return this.doSearch({ type: 'release', artist, release_title: title });
    }
    async searchArtist(query) {
        return this.doSearch({ type: 'artist', q: query });
    }
}
//# sourceMappingURL=discogs-client.js.map