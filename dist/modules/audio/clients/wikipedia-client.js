import { logger } from '../../../utils/logger.js';
import { WebserviceClient } from '../../../utils/webservice-client.js';
const log = logger('Wikipedia');
export class WikipediaClient extends WebserviceClient {
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
        const data = await this.getJson(url);
        if (!data || !data.entities) {
            return;
        }
        return data.entities[id];
    }
}
//# sourceMappingURL=wikipedia-client.js.map