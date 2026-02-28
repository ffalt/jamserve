import { RateLimiter } from './limiter/rate-limiter.js';
import fetch from 'node-fetch';
export class WebserviceClient {
    constructor(requestPerInterval, requestIntervalMS, userAgent) {
        this.enabled = false;
        this.limiter = new RateLimiter({ tokensPerInterval: requestPerInterval, interval: requestIntervalMS, fireImmediately: true });
        this.userAgent = userAgent;
    }
    async parseResult(response) {
        if (response.status === 404) {
            return Promise.reject(new Error(`${response.status} ${response.statusText || ''}`));
        }
        try {
            return await response.json();
        }
        catch (error) {
            return Promise.reject(error);
        }
    }
    checkDisabled() {
        if (!this.enabled) {
            throw new Error('External service is disabled');
        }
    }
    async limit() {
        const limiter = this.limiter;
        await limiter.removeTokens(1);
    }
    formatParams(parameters) {
        const search = new URLSearchParams();
        if (parameters) {
            for (const [key, value] of Object.entries(parameters)) {
                if (value !== undefined) {
                    search.append(key, value.toString());
                }
            }
        }
        const qs = search.toString();
        return qs ? `?${qs}` : '';
    }
    async getJson(url, ignoreStatus) {
        return this.getJsonWithParameters(url, undefined, ignoreStatus);
    }
    async getJsonWithParameters(url, parameters, ignoreStatus) {
        this.checkDisabled();
        await this.limit();
        const urlParameters = parameters ? this.formatParams(parameters) : '';
        const response = await fetch(url + urlParameters, {
            headers: { 'User-Agent': this.userAgent },
            signal: AbortSignal.timeout(30000)
        });
        if (!ignoreStatus && response.status !== 200) {
            return Promise.reject(new Error(`Invalid Result: ${response.statusText}`));
        }
        const result = await this.parseResult(response);
        if (result === undefined) {
            return Promise.reject(new Error(`Invalid Result from ${url}`));
        }
        return result;
    }
}
//# sourceMappingURL=webservice-client.js.map