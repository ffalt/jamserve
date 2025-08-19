import { RateLimiter } from './limiter/rate-limiter.js';
import fetch, { Response } from 'node-fetch';

type WebserviceClientParameters = Record<string, string | number | undefined> | undefined;

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
			return Promise.reject(new Error(`${response.status} ${response.statusText || ''}`));
		}
		try {
			return await response.json() as T;
		} catch (error: unknown) {
			return Promise.reject(error);
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

	protected formatParams<P extends WebserviceClientParameters>(parameters: P): string {
		const search = new URLSearchParams();

		if (parameters) {
			for (const [key, value] of Object.entries(parameters) as Array<[string, string | number | undefined]>) {
				if (value !== undefined) {
					search.append(key, value.toString());
				}
			}
		}

		const qs = search.toString();
		return qs ? `?${qs}` : '';
	}

	protected async getJson<T>(url: string, ignoreStatus?: boolean): Promise<T> {
		return this.getJsonWithParameters<T, undefined>(url, undefined, ignoreStatus);
	}

	protected async getJsonWithParameters<T, P extends WebserviceClientParameters>(url: string, parameters?: P, ignoreStatus?: boolean): Promise<T> {
		this.checkDisabled();
		await this.limit();
		const urlParameters = parameters ? this.formatParams<P>(parameters) : '';
		const response = await fetch(url + urlParameters, {
			headers: { 'User-Agent': this.userAgent }
			// timeout: 20000
		});
		if (!ignoreStatus && response.status !== 200) {
			return Promise.reject(new Error(`Invalid Result: ${response.statusText}`));
		}
		const result = await this.parseResult<T>(response);
		if (result === undefined) {
			return Promise.reject(new Error(`Invalid Result from ${url}`));
		}
		return result;
	}
}
