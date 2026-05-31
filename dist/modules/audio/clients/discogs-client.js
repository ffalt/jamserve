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
    async doGet(path) {
        this.checkDisabled();
        await this.limit();
        const url = `https://api.discogs.com${path}`;
        log.info('requesting', url);
        const response = await fetch(url, { headers: this.headers(), signal: AbortSignal.timeout(30000) });
        if (!response.ok) {
            log.error(`Discogs request failed: ${response.status} ${response.statusText}`);
            return undefined;
        }
        return response.json();
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
    async searchRelease(parameters) {
        const { title, ...rest } = parameters;
        const search = { type: 'release' };
        for (const [key, value] of Object.entries(rest)) {
            if (value)
                search[key] = value;
        }
        if (title)
            search.release_title = title;
        return this.doSearch(search);
    }
    async searchArtist(query) {
        return this.doSearch({ type: 'artist', q: query });
    }
    async releaseById(id) {
        return this.doGet(`/releases/${id}`);
    }
    async artistById(id) {
        return this.doGet(`/artists/${id}`);
    }
    async masterById(id) {
        return this.doGet(`/masters/${id}`);
    }
    async masterVersionsById(id) {
        return this.doGet(`/masters/${id}/versions`);
    }
}
//# sourceMappingURL=discogs-client.js.map