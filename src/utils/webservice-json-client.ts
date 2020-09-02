import {logger} from './logger';
import {WebserviceClient} from './webservice-client';

const log = logger('WebserviceJSONClient');

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
		this.options = {...defaultOptions, ...options};
	}

	protected reqToHost(req: T): string {
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

	protected async retry(error: Error, req: T): Promise<any> {
		if (this.options.retryOn && req.retry < (this.options.retryCount || 0)) {
			req.retry++;
			log.info(`rate limit hit, retrying in ${this.options.retryDelay}ms`);
			return new Promise<any>((resolve, reject) => {
				setTimeout(() => {
					this.get(req).then(resolve).catch(reject);
				}, this.options.retryDelay || 3000);
			});
		}
		return Promise.reject(error);
	}

	protected async processError(e: Error | any, req: T): Promise<R> {
		const statusCode = e.statusCode;
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
			const data = await this.getJson<any>(url, undefined);
			if (this.isRateLimitError(data)) {
				return this.retry(Error(data.error), req);
			}
			return data;
		} catch (e) {
			return this.processError(e, req);
		}
	}
}
