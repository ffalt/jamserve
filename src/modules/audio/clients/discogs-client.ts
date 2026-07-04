import { logger } from '../../../utils/logger.js';
import { WebserviceClient } from '../../../utils/webservice-client.js';
import { Discogs } from './discogs-rest-data.js';
import fetch from 'node-fetch';

const log = logger('DiscogsClient');

export interface DiscogsOptions {
	userAgent: string;
	apiToken?: string;
}

export interface DiscogsReleaseSearchParameters {
	q?: string;
	artist?: string;
	title?: string;
	year?: string;
	format?: string;
	label?: string;
	country?: string;
	catno?: string;
	barcode?: string;
	genre?: string;
	style?: string;
	track?: string;
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

	private headers(): Record<string, string> {
		const h: Record<string, string> = { 'User-Agent': this.ua };
		if (this.token) {
			h.Authorization = `Discogs token=${this.token}`;
		}
		return h;
	}

	private async doGet<T>(path: string): Promise<T | undefined> {
		this.checkDisabled();
		await this.limit();
		const url = `https://api.discogs.com${path}`;
		log.info('requesting', url);
		const response = await fetch(url, { headers: this.headers(), signal: AbortSignal.timeout(30_000) });
		if (!response.ok) {
			log.error(`Discogs request failed: ${response.status} ${response.statusText}`);
			return undefined;
		}
		return response.json() as Promise<T>;
	}

	private async doSearch(parameters: Record<string, string>): Promise<Discogs.SearchResponse | undefined> {
		this.checkDisabled();
		await this.limit();
		const url = new URL('https://api.discogs.com/database/search');
		url.searchParams.set('per_page', '10');
		for (const [key, value] of Object.entries(parameters)) {
			url.searchParams.set(key, value);
		}
		log.info('requesting', url.href);
		const response = await fetch(url.href, { headers: this.headers(), signal: AbortSignal.timeout(30_000) });
		if (!response.ok) {
			log.error(`Discogs search failed: ${response.status} ${response.statusText}`);
			return undefined;
		}
		return response.json() as Promise<Discogs.SearchResponse>;
	}

	async searchRelease(parameters: DiscogsReleaseSearchParameters): Promise<Discogs.SearchResponse | undefined> {
		const { title, ...rest } = parameters;
		const search: Record<string, string> = { type: 'release' };
		for (const [key, value] of Object.entries(rest)) {
			if (value) search[key] = value;
		}
		if (title) search.release_title = title;
		return this.doSearch(search);
	}

	async searchArtist(query: string): Promise<Discogs.SearchResponse | undefined> {
		return this.doSearch({ type: 'artist', q: query });
	}

	async releaseById(id: number): Promise<Discogs.Release | undefined> {
		return this.doGet<Discogs.Release>(`/releases/${id}`);
	}

	async artistById(id: number): Promise<Discogs.Artist | undefined> {
		return this.doGet<Discogs.Artist>(`/artists/${id}`);
	}

	async masterById(id: number): Promise<Discogs.Master | undefined> {
		return this.doGet<Discogs.Master>(`/masters/${id}`);
	}

	async masterVersionsById(id: number): Promise<Discogs.MasterVersionsResponse | undefined> {
		return this.doGet<Discogs.MasterVersionsResponse>(`/masters/${id}/versions`);
	}
}
