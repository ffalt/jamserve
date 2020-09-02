"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebserviceJSONClient = void 0;
const logger_1 = require("./logger");
const webservice_client_1 = require("./webservice-client");
const log = logger_1.logger('WebserviceJSONClient');
class WebserviceJSONClient extends webservice_client_1.WebserviceClient {
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
    reqToHost(req) {
        const port = this.options.port !== 80 ? `:${this.options.port}` : '';
        return `${this.options.host}${port}`;
    }
    reqToUrl(req) {
        const q = Object.keys(req.query)
            .filter(key => (req.query[key] !== undefined && req.query[key] !== null))
            .map(key => `${key}=${req.query[key]}`);
        const params = q.length > 0 ? `?${q.join('&')}` : '';
        return `${this.reqToHost(req)}${req.path}${params}`;
    }
    async retry(error, req) {
        if (this.options.retryOn && req.retry < (this.options.retryCount || 0)) {
            req.retry++;
            log.info(`rate limit hit, retrying in ${this.options.retryDelay}ms`);
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    this.get(req).then(resolve).catch(reject);
                }, this.options.retryDelay || 3000);
            });
        }
        return Promise.reject(error);
    }
    async processError(e, req) {
        const statusCode = e.statusCode;
        if (statusCode === 502 || statusCode === 503) {
            return this.retry(e, req);
        }
        return Promise.reject(e);
    }
    isRateLimitError(body) {
        var _a;
        return !!((_a = body === null || body === void 0 ? void 0 : body.error) === null || _a === void 0 ? void 0 : _a.includes('allowable rate limit'));
    }
    async get(req) {
        const url = this.reqToUrl(req);
        log.debug('requesting', url, JSON.stringify(req));
        try {
            const data = await this.getJson(url, undefined);
            if (this.isRateLimitError(data)) {
                return this.retry(Error(data.error), req);
            }
            return data;
        }
        catch (e) {
            return this.processError(e, req);
        }
    }
}
exports.WebserviceJSONClient = WebserviceJSONClient;
//# sourceMappingURL=webservice-json-client.js.map