import { RateLimiter } from './limiter/RateLimiter.js';
import fetch, { Response } from 'node-fetch';

export class WebserviceClient {
	enabled = false;
	private readonly limiter: RateLimiter;
	private readonly userAgent: string;

	constructor(requestPerInterval: number, requestIntervalMS: number, userAgent: string) {
		this.limiter = new RateLimiter({ tokensPerInterval: requestPerInterval, interval: requestIntervalMS, fireImmediately: true });
		this.userAgent = userAgent;
	}

	protected async parseResult<T>(response: Response): Promise<T | undefined> {
		if (response.status === 404) {
			return Promise.reject(Error(`${response.status} ${response.statusText || ''}`));
		}
		try {
			return await response.json() as T;
		} catch (err) {
			return Promise.reject(err as Error);
		}
	}

	protected checkDisabled(): void {
		if (!this.enabled) {
			throw new Error('External service is disabled');
		}
	}

	protected async limit(): Promise<void> {
		const limiter = this.limiter;
		await limiter.removeTokens(1);
	}

	protected formatParams<P>(parameters: P): string {
		const obj: any = { ...parameters };
		Object.keys(obj).forEach(key => {
			if (obj[key] === undefined) {
				delete obj[key];
			}
		});
		return `?${new URLSearchParams(obj)}`;
	}

	protected async getJson<T, P>(url: string, parameters?: P, ignoreStatus?: boolean): Promise<T> {
		this.checkDisabled();
		await this.limit();
		const params = parameters ? this.formatParams<P>(parameters) : '';
		const response = await fetch(url + params, {
			headers: { 'User-Agent': this.userAgent }
			// timeout: 20000
		});
		if (!ignoreStatus && response.status !== 200) {
			return Promise.reject(Error('Invalid Result'));
		}
		const result = await this.parseResult<T>(response);
		if (result === undefined) {
			return Promise.reject(Error('Invalid Result'));
		}
		return result;
	}
}
