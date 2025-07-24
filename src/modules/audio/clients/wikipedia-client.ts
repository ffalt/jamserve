import { logger } from '../../../utils/logger.js';
import { WebserviceClient } from '../../../utils/webservice-client.js';
import { WikiData } from './wikidata-rest-data.js';

const log = logger('Wikipedia');

export interface WikipediaSummary {
	type: string;
	title: string;
	displaytitle: string;
	namespace: {
		id: number;
		text: string;
	};
	wikibase_item: string;
	titles: {
		canonical: string;
		normalized: string;
		display: string;
	};
	pageid: number;
	thumbnail: {
		source: string;
		width: number;
		height: number;
	};
	originalimage: {
		source: string;
		width: number;
		height: number;
	};
	lang: string;
	dir: string;
	revision: string;
	tid: string;
	timestamp: string;
	description: string;
	content_urls: {
		desktop: {
			page: string;
			revisions: string;
			edit: string;
			talk: string;
		};
		mobile: {
			page: string;
			revisions: string;
			edit: string;
			talk: string;
		};
	};
	api_urls: {
		summary: string;
		metadata: string;
		references: string;
		media: string;
		edit_html: string;
		talk_page_html: string;
	};
	extract: string;
	extract_html: string;
}

export interface WikipediaResponse {
	summary?: WikipediaSummary;
}

export interface WikiPHPApiPage {
	pageid: number;
	ns: number;
	title: string;
	extract: string;
}

export interface WikiPHPApiSummary {
	batchcomplete: string;
	warnings?: {
		extracts?: Record<string, string>;
	};
	query: {
		pages: Record<string, WikiPHPApiPage>;
	};
}

export class WikipediaClient extends WebserviceClient {
	constructor(userAgent: string) {
		// "no more than 200 requests/s to this API" https://en.wikipedia.org/api/rest_v1/#!/Page_content/get_page_summary_title
		super(200, 1000, userAgent);
	}

	async summary(title: string, lang: string | undefined): Promise<{ title: string; url: string; summary: string } | undefined> {
		log.info('requesting summary', title);
		const url = `https://${(lang || 'en')}.wikipedia.org/w/api.php`;
		const data: WikiPHPApiSummary = await this.getJson<WikiPHPApiSummary,
			{
				action: string;
				prop: string;
				format: string;
				exintro: number;
				redirects: number;
				titles: string;
			}
		>(url, {
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
		const page = pages[Object.keys(pages)[0]];
		if (!page) {
			return;
		}
		return { title: page.title, summary: page.extract, url: `https://${(lang || 'en')}.wikipedia.org/wiki/${encodeURIComponent(page.title)}` };
	}

	async summary_rest(title: string, lang: string | undefined): Promise<string | undefined> {
		log.info('requesting summary', title);
		const url = `https://${(lang || 'en')}.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`;
		const data: WikipediaSummary = await this.getJson<WikipediaSummary, { redirect: string }>(url, { redirect: 'true' });
		if (!data) {
			return;
		}
		return data.extract_html;
	}

	async wikidata(id: string): Promise<WikiData.Entity | undefined> {
		log.info('requesting wikidata entity', id);
		// &props=sitelinks|info
		const url = `https://www.wikidata.org/w/api.php?action=wbgetentities&format=json&ids=${(id)}`;
		const data = await this.getJson<WikiData.Response, void>(url);
		if (data?.entities) {
			return data.entities[id];
		}
		return;
	}
}
