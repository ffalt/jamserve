import rateLimiter from 'limiter';
import fetch from 'node-fetch';
export class WebserviceClient {
    constructor(requestPerInterval, requestIntervalMS, userAgent) {
        this.enabled = false;
        this.limiter = new rateLimiter.RateLimiter(requestPerInterval, requestIntervalMS);
        this.userAgent = userAgent;
    }
    async parseResult(response) {
        if (response.status === 404) {
            return Promise.reject(Error(`${response.status} ${response.statusText || ''}`));
        }
        try {
            return await response.json();
        }
        catch (err) {
            return Promise.reject(err);
        }
    }
    checkDisabled() {
        if (!this.enabled) {
            throw new Error('External service is disabled');
        }
    }
    async limit() {
        const limiter = this.limiter;
        return new Promise(resolve => {
            limiter.removeTokens(1, () => resolve());
        });
    }
    async getJson(url, parameters, ignoreStatus) {
        this.checkDisabled();
        await this.limit();
        const params = parameters ? `?${new URLSearchParams(parameters)}` : '';
        const response = await fetch(url + params, {
            headers: { 'User-Agent': this.userAgent },
        });
        if (!ignoreStatus && response.status !== 200) {
            return Promise.reject(new Error('Invalid Result'));
        }
        const result = await this.parseResult(response);
        if (result === undefined) {
            return Promise.reject(new Error('Invalid Result'));
        }
        return result;
    }
}
//# sourceMappingURL=webservice-client.js.map