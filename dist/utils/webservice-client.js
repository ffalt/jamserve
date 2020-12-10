"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebserviceClient = void 0;
const limiter_1 = __importDefault(require("limiter"));
const request_1 = __importDefault(require("request"));
class WebserviceClient {
    constructor(requestPerInterval, requestIntervalMS, userAgent) {
        this.enabled = false;
        this.limiter = new limiter_1.default.RateLimiter(requestPerInterval, requestIntervalMS);
        this.userAgent = userAgent;
    }
    async parseResult(response, body) {
        if (response.statusCode === 404) {
            return Promise.reject(Error(`${response.statusCode} ${response.statusMessage || ''}`));
        }
        try {
            return Promise.resolve(JSON.parse(body));
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
    async getJson(url, parameters) {
        this.checkDisabled();
        const options = {
            url,
            headers: { 'User-Agent': this.userAgent },
            qs: parameters,
            timeout: 20000
        };
        const limiter = this.limiter;
        return new Promise((resolve, reject) => {
            limiter.removeTokens(1, () => {
                request_1.default(options, (err, response, body) => {
                    if (err) {
                        reject(err);
                    }
                    else {
                        this.parseResult(response, body)
                            .then(result => {
                            if (result === undefined) {
                                reject(new Error('Invalid Result'));
                            }
                            else {
                                resolve(result);
                            }
                        }).catch(reject);
                    }
                });
            });
        });
    }
}
exports.WebserviceClient = WebserviceClient;
//# sourceMappingURL=webservice-client.js.map