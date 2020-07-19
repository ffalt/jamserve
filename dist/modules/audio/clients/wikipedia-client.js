"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WikipediaClient = void 0;
const logger_1 = require("../../../utils/logger");
const webservice_client_1 = require("../../../utils/webservice-client");
const log = logger_1.logger('Wikipedia');
class WikipediaClient extends webservice_client_1.WebserviceClient {
    constructor(userAgent) {
        super(200, 1000, userAgent);
    }
    async summary(title, lang) {
        log.info('requesting summary', title);
        const url = `https://${(lang || 'en')}.wikipedia.org/w/api.php`;
        const data = await this.getJson(url, {
            action: 'query',
            prop: 'extracts',
            format: 'json',
            exintro: 1,
            redirects: 1,
            titles: title
        });
        if (!data || !data.query || !data.query.pages) {
            return;
        }
        const pages = data.query.pages;
        const page = pages[Object.keys(pages)[0]];
        if (!page) {
            return;
        }
        return { title: page.title, summary: page.extract, url: `https://${(lang || 'en')}.wikipedia.org/wiki/${encodeURIComponent(page.title)}` };
    }
    async summary_rest(title, lang) {
        log.info('requesting summary', title);
        const url = `https://${(lang || 'en')}.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`;
        const data = await this.getJson(url, { redirect: 'true' });
        if (!data) {
            return;
        }
        return data.extract_html;
    }
    async wikidata(id) {
        log.info('requesting wikidata entity', id);
        const url = `https://www.wikidata.org/w/api.php?action=wbgetentities&format=json&ids=${(id)}`;
        const data = await this.getJson(url, {});
        if (!data || !data.entities) {
            return;
        }
        return data.entities[id];
    }
}
exports.WikipediaClient = WikipediaClient;
//# sourceMappingURL=wikipedia-client.js.map