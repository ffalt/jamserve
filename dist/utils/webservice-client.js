"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebserviceClient = void 0;
const limiter_1 = __importDefault(require("limiter"));
const node_fetch_1 = __importDefault(require("node-fetch"));
class WebserviceClient {
    constructor(requestPerInterval, requestIntervalMS, userAgent) {
        this.enabled = false;
        this.limiter = new limiter_1.default.RateLimiter(requestPerInterval, requestIntervalMS);
        this.userAgent = userAgent;
    }
    async parseResult(response) {
        if (response.status === 404) {
            return Promise.reject(Error(`${response.status} ${response.statusText || ''}`));
        }
        try {
            return response.json();
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
    async getJson(url, parameters) {
        this.checkDisabled();
        await this.limit();
        const params = parameters ? `?${new URLSearchParams(parameters)}` : '';
        const response = await node_fetch_1.default(url + params, {
            headers: { 'User-Agent': this.userAgent },
            timeout: 20000
        });
        if (response.status !== 200) {
            return Promise.reject(new Error('Invalid Result'));
        }
        const result = await this.parseResult(response);
        if (result === undefined) {
            return Promise.reject(new Error('Invalid Result'));
        }
        return result;
    }
}
exports.WebserviceClient = WebserviceClient;
//# sourceMappingURL=webservice-client.js.map