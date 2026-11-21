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

export class LrclibClient extends WebserviceClient {
	private readonly apiKey: string;
	private readonly appId: string;

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
		return super.parseResult<T>(response);
	}

	async get(parameters: LrclibParameters): Promise<LrclibResult | undefined> {
		log.info('requesting', JSON.stringify(parameters));
		for (let attempt = 0; ; attempt++) {
			try {
				return await this.getJsonWithParameters<LrclibResult | undefined, LrclibParameters>('https://lrclib.net/api/get', parameters, true, this.headers());
			} catch (error: unknown) {
				if (!(error instanceof LrclibRateLimitError) || attempt >= RETRY_ATTEMPTS) {
					throw error;
				}
				log.info(`waiting ${error.retryAfterMS}ms before retrying`);
				await wait(error.retryAfterMS);
			}
		}
	}

	async find(parameters: LrclibParameters): Promise<TrackLyrics> {
		const data = await this.get(parameters);
		if (!data || !(data.plainLyrics || data.syncedLyrics)) {
			return {};
		}
		return { lyrics: data.plainLyrics, syncedLyrics: data.syncedLyrics, source: `https://lrclib.net/api/get/${data.id}` };
	}
}
