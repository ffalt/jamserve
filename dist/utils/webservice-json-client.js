import { logger } from './logger.js';
import { WebserviceClient } from './webservice-client.js';
import { errorStatusCode } from './error.js';
const log = logger('WebserviceJSONClient');
export const DEFAULT_RETRY_DELAY_MS = 3000;
export function backoffDelayMS(baseMS, retry) {
    return baseMS * (2 ** (retry - 1));
}
export class WebserviceJSONClient extends WebserviceClient {
    constructor(requestPerInterval, requestIntervalMS, userAgent, options) {
        super(requestPerInterval, requestIntervalMS, userAgent);
        const defaultOptions = {
            port: 80,
            basePath: '',
            userAgent: '',
            limit: 25,
            retryOn: false,
            retryDelay: DEFAULT_RETRY_DELAY_MS,
            retryCount: 3
        };
        this.options = { ...defaultOptions, ...options };
        if (this.options.timeout !== undefined) {
            this.timeout = this.options.timeout;
        }
    }
    reqToHost(_req) {
        const port = this.options.port === 80 ? '' : `:${this.options.port}`;
        return `${this.options.host}${port}`;
    }
    reqToUrl(req) {
        const search = new URLSearchParams();
        for (const [key, value] of Object.entries(req.query)) {
            if (value !== undefined && value !== null) {
                search.append(key, value);
            }
        }
        const qs = search.toString();
        const parameters = qs ? `?${qs}` : '';
        return `${this.reqToHost(req)}${req.path}${parameters}`;
    }
    async retry(error, req) {
        if (this.options.retryOn && req.retry < (this.options.retryCount ?? 0)) {
            req.retry++;
            const delay = backoffDelayMS(this.options.retryDelay ?? DEFAULT_RETRY_DELAY_MS, req.retry);
            log.info(`request failed, retry ${req.retry} in ${delay}ms`);
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    this.get(req).then(resolve).catch(reject);
                }, delay);
            });
        }
        return Promise.reject(error);
    }
    async processError(error, req) {
        const statusCode = errorStatusCode(error);
        if (statusCode === 502 || statusCode === 503) {
            return this.retry(error, req);
        }
        if (error instanceof Error && error.name === 'AbortError') {
            return this.retry(error, req);
        }
        return Promise.reject(error);
    }
    async get(req) {
        const url = this.reqToUrl(req);
        log.debug('requesting', url, JSON.stringify(req));
        try {
            return await this.getJson(url);
        }
        catch (error) {
            return this.processError(error, req);
        }
    }
}
//# sourceMappingURL=webservice-json-client.js.map