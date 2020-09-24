"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GpodderClient = void 0;
const logger_1 = require("../../../utils/logger");
const webservice_client_1 = require("../../../utils/webservice-client");
const log = logger_1.logger('GPodderClient');
class GpodderClient extends webservice_client_1.WebserviceClient {
    constructor(userAgent) {
        super(1, 1000, userAgent);
    }
    async parseResult(response, body) {
        if (response.statusCode === 404) {
            return Promise.resolve(undefined);
        }
        return super.parseResult(response, body);
    }
    async validateClientConfig() {
        var _a;
        const now = Date.now();
        if (this.clientConfig && this.clientConfig.valid_until > now) {
            return this.clientConfig;
        }
        const url = `https://gpodder.net/clientconfig.json`;
        log.info('requesting', url);
        const data = await this.getJson(url);
        const isValid = data && ((_a = data.mygpo) === null || _a === void 0 ? void 0 : _a.baseurl) && data['mygpo-feedservice'].baseurl && (!isNaN(data.update_timeout));
        if (!isValid) {
            throw new Error('Gpodder API has changed & can not be used with this server version');
        }
        this.clientConfig = { ...data, valid_until: data.update_timeout + now };
        return this.clientConfig;
    }
    async top(amount) {
        const config = await this.validateClientConfig();
        const url = `${config.mygpo.baseurl}toplist/${amount}.json`;
        log.info('requesting', url);
        const data = (await this.getJson(url)) || [];
        return data.map(d => this.transform(d));
    }
    async tags(amount) {
        const config = await this.validateClientConfig();
        const url = `${config.mygpo.baseurl}api/2/tags/${amount}.json`;
        log.info('requesting', url);
        return ((await this.getJson(url)) || [])
            .filter(d => !!d.tag);
    }
    async byTag(tag, amount) {
        const config = await this.validateClientConfig();
        const url = `${config.mygpo.baseurl}api/2/tag/${encodeURIComponent(tag)}/${amount}.json`;
        log.info('requesting', url);
        const data = (await this.getJson(url)) || [];
        return data.map(d => this.transform(d));
    }
    async search(name) {
        const config = await this.validateClientConfig();
        const url = `${config.mygpo.baseurl}search.json?q=${encodeURIComponent(name)}`;
        log.info('requesting', url);
        const data = (await this.getJson(url)) || [];
        return data.map(d => this.transform(d));
    }
    ensureHTTPS(url) {
        if (url && url.toLowerCase().startsWith('http:')) {
            return 'https:' + url.slice(5);
        }
        else if (url && url.toLowerCase().startsWith('https:')) {
            return url;
        }
        else {
            return '';
        }
    }
    transform(d) {
        return {
            ...d,
            url: this.ensureHTTPS(d.url),
            logo_url: this.ensureHTTPS(d.logo_url),
            scaled_logo_url: this.ensureHTTPS(d.scaled_logo_url),
            website: this.ensureHTTPS(d.website),
            mygpo_link: this.ensureHTTPS(d.mygpo_link)
        };
    }
}
exports.GpodderClient = GpodderClient;
//# sourceMappingURL=gpodder-client.js.map