import { logger } from './logger.js';
import { WebserviceClient } from './webservice-client.js';
import { errorStatusCode } from './error.js';
const log = logger('WebserviceJSONClient');
export class WebserviceJSONClient extends WebserviceClient {
    constructor(requestPerInterval, requestIntervalMS, userAgent, options) {
        super(requestPerInterval, requestIntervalMS, userAgent);
        const defaultOptions = {
            port: 80,
            basePath: '',
            userAgent: '',
            limit: 25,
            retryOn: false,
            retryDelay: 3000,
            retryCount: 3
        };
        this.options = { ...defaultOptions, ...options };
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
            log.info(`rate limit hit, retrying in ${this.options.retryDelay}ms`);
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    this.get(req).then(resolve).catch(reject);
                }, this.options.retryDelay ?? 3000);
            });
        }
        return Promise.reject(error);
    }
    async processError(error, req) {
        const statusCode = errorStatusCode(error);
        if (statusCode === 502 || statusCode === 503) {
            return this.retry(error, req);
        }
        return Promise.reject(error);
    }
    isRateLimitError(body) {
        return !!body?.error?.includes('allowable rate limit');
    }
    async get(req) {
        const url = this.reqToUrl(req);
        log.debug('requesting', url, JSON.stringify(req));
        try {
            const data = await this.getJson(url);
            if (this.isRateLimitError(data)) {
                return await this.retry(new Error(data.error), req);
            }
            return data;
        }
        catch (error) {
            return this.processError(error, req);
        }
    }
}
//# sourceMappingURL=webservice-json-client.js.map