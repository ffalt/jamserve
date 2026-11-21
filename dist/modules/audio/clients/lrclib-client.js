import { logger } from '../../../utils/logger.js';
import { WebserviceClient } from '../../../utils/webservice-client.js';
import { wait } from '../../../utils/limiter/clock.js';
const log = logger('LrclibClient');
export const REQUEST_INTERVAL_MS = 800;
export const REQUEST_INTERVAL_MS_WITH_KEY = 200;
const RETRY_ATTEMPTS = 2;
const RETRY_AFTER_FALLBACK_MS = 1000;
const RETRY_AFTER_MAX_MS = 60000;
const RETRY_AFTER_JITTER = 0.3;
export class LrclibRateLimitError extends Error {
    constructor(retryAfterMS) {
        super(`LRCLib is rate limiting, retry after ${retryAfterMS}ms`);
        this.retryAfterMS = retryAfterMS;
    }
}
export function retryAfterMS(header) {
    const seconds = Number(header);
    const base = Number.isFinite(seconds) && seconds > 0 ? seconds * 1000 : RETRY_AFTER_FALLBACK_MS;
    const jittered = base * (1 + (Math.random() * RETRY_AFTER_JITTER));
    return Math.min(Math.round(jittered), RETRY_AFTER_MAX_MS);
}
export const DURATION_TOLERANCE_SECONDS = 2;
export const MIN_DURATION_SECONDS = 1;
export const MAX_DURATION_SECONDS = 3600;
async function errorMessage(response) {
    try {
        const body = await response.text();
        if (response.headers.get('content-type')?.includes('json')) {
            return (JSON.parse(body).message ?? body).slice(0, 200);
        }
        return body.slice(0, 200);
    }
    catch {
        return response.statusText;
    }
}
export function lrclibDuration(seconds) {
    if (seconds === undefined || seconds < MIN_DURATION_SECONDS || seconds > MAX_DURATION_SECONDS) {
        return;
    }
    return Math.round(seconds);
}
export function toLyrics(data) {
    if (!data || !(data.plainLyrics || data.syncedLyrics)) {
        return {};
    }
    return { lyrics: data.plainLyrics, syncedLyrics: data.syncedLyrics, source: `https://lrclib.net/api/get/${data.id}` };
}
export function bestMatch(results, duration) {
    const usable = results.filter(result => !result.instrumental && (result.plainLyrics || result.syncedLyrics));
    const candidates = duration === undefined ? usable : usable.filter(result => Math.abs(result.duration - duration) <= DURATION_TOLERANCE_SECONDS);
    const synced = candidates.filter(result => result.syncedLyrics);
    const preferred = synced.length > 0 ? synced : candidates;
    if (duration === undefined) {
        return preferred.at(0);
    }
    return preferred.toSorted((a, b) => Math.abs(a.duration - duration) - Math.abs(b.duration - duration)).at(0);
}
export class LrclibClient extends WebserviceClient {
    constructor(options) {
        super(1, options.apiKey ? REQUEST_INTERVAL_MS_WITH_KEY : REQUEST_INTERVAL_MS, options.userAgent);
        this.inFlight = Promise.resolve(undefined);
        this.apiKey = options.apiKey ?? '';
        this.appId = options.appId ?? '';
    }
    headers() {
        const result = {};
        if (this.apiKey) {
            result['Lrclib-Api-Key'] = this.apiKey;
        }
        else if (this.appId) {
            result['Lrclib-App-Id'] = this.appId;
        }
        return result;
    }
    async parseResult(response) {
        if (response.status === 429 || response.status === 503) {
            throw new LrclibRateLimitError(retryAfterMS(response.headers.get('retry-after')));
        }
        if (response.status === 404) {
            return Promise.resolve({});
        }
        if (!response.ok) {
            throw new Error(`LRCLib request failed: ${response.status} ${await errorMessage(response)}`);
        }
        return super.parseResult(response);
    }
    async sequential(task) {
        const previous = this.inFlight;
        const { promise, resolve } = Promise.withResolvers();
        this.inFlight = promise;
        await previous;
        try {
            return await task();
        }
        finally {
            resolve(undefined);
        }
    }
    async request(url, parameters) {
        return this.sequential(async () => {
            log.info('requesting', url, JSON.stringify(parameters));
            for (let attempt = 0;; attempt++) {
                try {
                    return await this.getJsonWithParameters(url, parameters, true, this.headers());
                }
                catch (error) {
                    if (!(error instanceof LrclibRateLimitError) || attempt >= RETRY_ATTEMPTS) {
                        throw error;
                    }
                    log.info(`waiting ${error.retryAfterMS}ms before retrying`);
                    await wait(error.retryAfterMS);
                }
            }
        });
    }
    async get(parameters) {
        return this.request('https://lrclib.net/api/get', parameters);
    }
    async search(parameters) {
        const { duration: _duration, ...query } = parameters;
        const data = await this.request('https://lrclib.net/api/search', query);
        return Array.isArray(data) ? data : [];
    }
    async find(parameters) {
        return toLyrics(await this.get(parameters));
    }
    async findBySearch(parameters) {
        return toLyrics(bestMatch(await this.search(parameters), parameters.duration));
    }
}
//# sourceMappingURL=lrclib-client.js.map