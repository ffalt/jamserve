import { logger } from '../../../utils/logger.js';
import { WebserviceClient } from '../../../utils/webservice-client.js';
const log = logger('Wikipedia');
export class WikipediaClient extends WebserviceClient {
    constructor(userAgent) {
        super(200, 1000, userAgent);
    }
    async summary(title, lang) {
        log.info('requesting summary', title);
        const url = `https://${(lang ?? 'en')}.wikipedia.org/w/api.php`;
        const data = await this.getJsonWithParameters(url, {
            action: 'query',
            prop: 'extracts',
            format: 'json',
            exintro: 1,
            redirects: 1,
            titles: title
        });
        if (!data?.query?.pages) {
            return;
        }
        const pages = data.query.pages;
        const page = pages[Object.keys(pages).at(0) ?? -1];
        if (!page) {
            return;
        }
        return { title: page.title, summary: page.extract, url: `https://${(lang ?? 'en')}.wikipedia.org/wiki/${encodeURIComponent(page.title)}` };
    }
    async summary_rest(title, lang) {
        log.info('requesting summary', title);
        const url = `https://${(lang ?? 'en')}.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`;
        const data = await this.getJsonWithParameters(url, { redirect: 'true' });
        if (!data) {
            return;
        }
        return data.extract_html;
    }
    async wikidata(id) {
        log.info('requesting wikidata entity', id);
        const url = `https://www.wikidata.org/w/api.php?action=wbgetentities&format=json&ids=${(id)}`;
        const data = await this.getJson(url);
        if (data?.entities) {
            return data.entities[id];
        }
        return;
    }
}
//# sourceMappingURL=wikipedia-client.js.map