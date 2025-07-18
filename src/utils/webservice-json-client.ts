import { logger } from './logger.js';
import { WebserviceClient } from './webservice-client.js';

const log = logger('WebserviceJSONClient');

export interface StatusCodeError extends Error {
	statusCode?: number;
}

export interface JSONRequest {
	path: string;
	query: { [name: string]: string | undefined };
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
			retryDelay: 3000,
			retryCount: 3
		};
		this.options = { ...defaultOptions, ...options };
	}

	protected reqToHost(_req: T): string {
		const port = this.options.port !== 80 ? `:${this.options.port}` : '';
		return `${this.options.host}${port}`;
	}

	protected reqToUrl(req: T): string {
		const q = Object.keys(req.query)
			.filter(key => (req.query[key] !== undefined && req.query[key] !== null))
			.map(key => `${key}=${req.query[key]}`);
		const params = q.length > 0 ? `?${q.join('&')}` : '';
		return `${this.reqToHost(req)}${req.path}${params}`;
	}

	protected async retry(error: Error, req: T): Promise<R> {
		if (this.options.retryOn && req.retry < (this.options.retryCount || 0)) {
			req.retry++;
			log.info(`rate limit hit, retrying in ${this.options.retryDelay}ms`);
			return new Promise<R>((resolve, reject) => {
				setTimeout(() => {
					this.get(req).then(resolve).catch(reject);
				}, this.options.retryDelay ?? 3000);
			});
		}
		return Promise.reject(error);
	}

	protected async processError(e: Error | StatusCodeError, req: T): Promise<R> {
		const statusCode = (e as StatusCodeError).statusCode;
		if (statusCode === 502 || statusCode === 503) {
			return this.retry(e, req);
		}
		return Promise.reject(e);
	}

	protected isRateLimitError(body?: { error?: string }): boolean {
		return !!body?.error?.includes('allowable rate limit');
	}

	protected async get(req: T): Promise<R> {
		const url = this.reqToUrl(req);

		log.debug('requesting', url, JSON.stringify(req));
		try {
			const data = await this.getJson<R, void>(url);
			if (this.isRateLimitError(data as { error?: string })) {
				return this.retry(Error((data as { error: string }).error), req);
			}
			return data;
		} catch (e) {
			return this.processError(e as Error, req);
		}
	}
}
