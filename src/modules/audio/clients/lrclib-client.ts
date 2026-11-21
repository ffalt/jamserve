import { logger } from '../../../utils/logger.js';
import { WebserviceClient } from '../../../utils/webservice-client.js';
import { Response } from 'node-fetch';
import { TrackLyrics } from '../../../entity/track/track.model.js';
import { wait } from '../../../utils/limiter/clock.js';

const log = logger('LrclibClient');

// https://lrclib.net/docs: ~90 requests/min per IP for a client identified by User-Agent,
// ~6000 requests/min app wide for an app registered with an Lrclib-Api-Key.
// The docs ask for sequential requests with a short gap between them, so pace one request
// per interval instead of allowing a burst: 800ms is 75/min, 200ms is 300/min
export const REQUEST_INTERVAL_MS = 800;
export const REQUEST_INTERVAL_MS_WITH_KEY = 200;
const RETRY_ATTEMPTS = 2;
const RETRY_AFTER_FALLBACK_MS = 1000;
const RETRY_AFTER_MAX_MS = 60_000;
const RETRY_AFTER_JITTER = 0.3;

export interface LrclibOptions {
	userAgent: string;
	apiKey?: string;
	appId?: string;
}

export interface LrclibParameters {
	[key: string]: string | number | undefined;

	track_name?: string;
	artist_name?: string;
	album_name?: string;
	duration?: number;
}

export interface LrclibResult {
	id: number;
	trackName: string;
	artistName: string;
	albumName: string;
	duration: number;
	instrumental: boolean;
	plainLyrics: string;
	syncedLyrics: string;
	source: string;
}

export class LrclibRateLimitError extends Error {
	constructor(public readonly retryAfterMS: number) {
		super(`LRCLib is rate limiting, retry after ${retryAfterMS}ms`);
	}
}

export function retryAfterMS(header: string | null): number {
	const seconds = Number(header);
	const base = Number.isFinite(seconds) && seconds > 0 ? seconds * 1000 : RETRY_AFTER_FALLBACK_MS;
	const jittered = base * (1 + (Math.random() * RETRY_AFTER_JITTER));
	return Math.min(Math.round(jittered), RETRY_AFTER_MAX_MS);
}

// the docs state lrclib itself matches a duration within +/- 2 seconds
export const DURATION_TOLERANCE_SECONDS = 2;
export const MIN_DURATION_SECONDS = 1;
export const MAX_DURATION_SECONDS = 3600;

// the docs warn that an overloaded edge may answer with something other than JSON
async function errorMessage(response: Response): Promise<string> {
	try {
		const body = await response.text();
		if (response.headers.get('content-type')?.includes('json')) {
			return ((JSON.parse(body) as { message?: string }).message ?? body).slice(0, 200);
		}
		return body.slice(0, 200);
	} catch {
		return response.statusText;
	}
}

export function lrclibDuration(seconds?: number): number | undefined {
	if (seconds === undefined || seconds < MIN_DURATION_SECONDS || seconds > MAX_DURATION_SECONDS) {
		return;
	}
	return Math.round(seconds);
}

export function toLyrics(data?: LrclibResult): TrackLyrics {
	if (!data || !(data.plainLyrics || data.syncedLyrics)) {
		return {};
	}
	return { lyrics: data.plainLyrics, syncedLyrics: data.syncedLyrics, source: `https://lrclib.net/api/get/${data.id}` };
}

export function bestMatch(results: Array<LrclibResult>, duration?: number): LrclibResult | undefined {
	const usable = results.filter(result => !result.instrumental && (result.plainLyrics || result.syncedLyrics));
	const candidates = duration === undefined ? usable : usable.filter(result => Math.abs(result.duration - duration) <= DURATION_TOLERANCE_SECONDS);
	const synced = candidates.filter(result => result.syncedLyrics);
	const preferred = synced.length > 0 ? synced : candidates;
	if (duration === undefined) {
		return preferred.at(0);
	}
	return preferred.toSorted((a, b) => Math.abs(a.duration - duration) - Math.abs(b.duration - duration)).at(0);
}

export class LrclibClient extends WebserviceClient {
	private readonly apiKey: string;
	private readonly appId: string;
	private inFlight: Promise<undefined> = Promise.resolve(undefined);

	constructor(options: LrclibOptions) {
		super(1, options.apiKey ? REQUEST_INTERVAL_MS_WITH_KEY : REQUEST_INTERVAL_MS, options.userAgent);
		this.apiKey = options.apiKey ?? '';
		this.appId = options.appId ?? '';
	}

	protected headers(): Record<string, string> {
		const result: Record<string, string> = {};
		if (this.apiKey) {
			result['Lrclib-Api-Key'] = this.apiKey;
		} else if (this.appId) {
			result['Lrclib-App-Id'] = this.appId;
		}
		return result;
	}

	protected async parseResult<T>(response: Response): Promise<T | undefined> {
		if (response.status === 429 || response.status === 503) {
			throw new LrclibRateLimitError(retryAfterMS(response.headers.get('retry-after')));
		}
		if (response.status === 404) {
			return Promise.resolve({} as T);
		}
		if (!response.ok) {
			throw new Error(`LRCLib request failed: ${response.status} ${await errorMessage(response)}`);
		}
		return super.parseResult<T>(response);
	}

	private async sequential<T>(task: () => Promise<T>): Promise<T> {
		const previous = this.inFlight;
		const { promise, resolve } = Promise.withResolvers<undefined>();
		this.inFlight = promise;
		await previous;
		try {
			return await task();
		} finally {
			resolve(undefined);
		}
	}

	private async request<T>(url: string, parameters: LrclibParameters): Promise<T | undefined> {
		return this.sequential(async () => {
			log.info('requesting', url, JSON.stringify(parameters));
			for (let attempt = 0; ; attempt++) {
				try {
					return await this.getJsonWithParameters<T | undefined, LrclibParameters>(url, parameters, true, this.headers());
				} catch (error: unknown) {
					if (!(error instanceof LrclibRateLimitError) || attempt >= RETRY_ATTEMPTS) {
						throw error;
					}
					log.info(`waiting ${error.retryAfterMS}ms before retrying`);
					await wait(error.retryAfterMS);
				}
			}
		});
	}

	async get(parameters: LrclibParameters): Promise<LrclibResult | undefined> {
		return this.request<LrclibResult>('https://lrclib.net/api/get', parameters);
	}

	async search(parameters: LrclibParameters): Promise<Array<LrclibResult>> {
		// the search endpoint takes no duration, it only serves to pick the match afterwards
		const { duration: _duration, ...query } = parameters;
		const data = await this.request<Array<LrclibResult>>('https://lrclib.net/api/search', query);
		return Array.isArray(data) ? data : [];
	}

	async find(parameters: LrclibParameters): Promise<TrackLyrics> {
		return toLyrics(await this.get(parameters));
	}

	// the docs do not define the order of search results, so pick the match instead of trusting the first
	async findBySearch(parameters: LrclibParameters): Promise<TrackLyrics> {
		return toLyrics(bestMatch(await this.search(parameters), parameters.duration));
	}
}
