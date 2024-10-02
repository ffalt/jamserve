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
			return Promise.reject(err);
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

	protected async getJson<T, P>(url: string, parameters?: P, ignoreStatus?: boolean): Promise<T> {
		this.checkDisabled();
		await this.limit();
		const params = parameters ? `?${new URLSearchParams(parameters)}` : '';
		const response = await fetch(url + params, {
			headers: { 'User-Agent': this.userAgent }
			// timeout: 20000
		});
		if (!ignoreStatus && response.status !== 200) {
			return Promise.reject(new Error('Invalid Result'));
		}
		const result = await this.parseResult<T>(response);
		if (result === undefined) {
			return Promise.reject(new Error('Invalid Result'));
		}
		return result;
	}
}
