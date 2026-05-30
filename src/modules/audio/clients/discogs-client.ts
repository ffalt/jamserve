import { logger } from '../../../utils/logger.js';
import { WebserviceClient } from '../../../utils/webservice-client.js';
import { Discogs } from './discogs-rest-data.js';
import fetch from 'node-fetch';

const log = logger('DiscogsClient');

export interface DiscogsOptions {
	userAgent: string;
	apiToken?: string;
}

export class DiscogsClient extends WebserviceClient {
	private readonly token: string;
	private readonly ua: string;

	constructor(options: DiscogsOptions) {
		// 25 req/min unauthenticated; 60 req/min with token
		super(25, 60_000, options.userAgent);
		this.ua = options.userAgent;
		this.token = options.apiToken ?? '';
	}

	headers(): Record<string, string> {
		const h: Record<string, string> = { 'User-Agent': this.ua };
		if (this.token) {
			h.Authorization = `Discogs token=${this.token}`;
		}
		return h;
	}

	private async doSearch(parameters: Record<string, string>): Promise<Discogs.SearchResponse | undefined> {
		this.checkDisabled();
		await this.limit();
		const url = new URL('https://api.discogs.com/database/search');
		url.searchParams.set('per_page', '10');
		for (const [key, value] of Object.entries(parameters)) {
			url.searchParams.set(key, value);
		}
		log.info('requesting', url.toString());
		const response = await fetch(url.toString(), { headers: this.headers(), signal: AbortSignal.timeout(30_000) });
		if (!response.ok) {
			log.error(`Discogs search failed: ${response.status} ${response.statusText}`);
			return undefined;
		}
		return response.json() as Promise<Discogs.SearchResponse>;
	}

	async searchRelease(artist: string, title: string): Promise<Discogs.SearchResponse | undefined> {
		return this.doSearch({ type: 'release', artist, release_title: title });
	}

	async searchArtist(query: string): Promise<Discogs.SearchResponse | undefined> {
		return this.doSearch({ type: 'artist', q: query });
	}
}
