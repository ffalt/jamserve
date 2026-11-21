import { logger } from './logger.js';
import { WebserviceClient } from './webservice-client.js';
import { errorStatusCode } from './error.js';

const log = logger('WebserviceJSONClient');

export const DEFAULT_RETRY_DELAY_MS = 3000;

export function backoffDelayMS(baseMS: number, retry: number): number {
	return baseMS * (2 ** (retry - 1));
}

export interface JSONRequest {
	path: string;
	query: Record<string, string | undefined | null>;
	retry: number;
}

export interface JSONOptions {
	host?: string;
	port?: number;
	basePath?: string;
	userAgent: string;
	retryOn?: boolean;
	retryDelay?: number;
	retryCount?: number;
	timeout?: number;
}

export class WebserviceJSONClient<T extends JSONRequest, R> extends WebserviceClient {
	options: JSONOptions;

	constructor(requestPerInterval: number, requestIntervalMS: number, userAgent: string, options: JSONOptions) {
		super(requestPerInterval, requestIntervalMS, userAgent);
		const defaultOptions = {
			port: 80,
			basePath: '',
			userAgent: '',
			limit: 25,
			retryOn: false,
			retryDelay: DEFAULT_RETRY_DELAY_MS,
			retryCount: 3
		};
		this.options = { ...defaultOptions, ...options };
		if (this.options.timeout !== undefined) {
			this.timeout = this.options.timeout;
		}
	}

	protected reqToHost(_req: T): string {
		const port = this.options.port === 80 ? '' : `:${this.options.port}`;
		return `${this.options.host}${port}`;
	}

	protected reqToUrl(req: T): string {
		const search = new URLSearchParams();
		for (const [key, value] of Object.entries(req.query)) {
			if (value !== undefined && value !== null) {
				search.append(key, value);
			}
		}
		const qs = search.toString();
		const parameters = qs ? `?${qs}` : '';
		return `${this.reqToHost(req)}${req.path}${parameters}`;
	}

	protected async retry(error: unknown, req: T): Promise<R> {
		if (this.options.retryOn && req.retry < (this.options.retryCount ?? 0)) {
			req.retry++;
			const delay = backoffDelayMS(this.options.retryDelay ?? DEFAULT_RETRY_DELAY_MS, req.retry);
			log.info(`request failed, retry ${req.retry} in ${delay}ms`);
			return new Promise<R>((resolve, reject) => {
				setTimeout(() => {
					this.get(req).then(resolve).catch(reject);
				}, delay);
			});
		}
		return Promise.reject(error);
	}

	protected async processError(error: unknown, req: T): Promise<R> {
		const statusCode = errorStatusCode(error);
		if (statusCode === 502 || statusCode === 503) {
			return this.retry(error, req);
		}
		if (error instanceof Error && error.name === 'AbortError') {
			return this.retry(error, req);
		}
		return Promise.reject(error);
	}

	protected async get(req: T): Promise<R> {
		const url = this.reqToUrl(req);

		log.debug('requesting', url, JSON.stringify(req));
		try {
			return await this.getJson<R>(url);
		} catch (error: unknown) {
			return this.processError(error, req);
		}
	}
}
