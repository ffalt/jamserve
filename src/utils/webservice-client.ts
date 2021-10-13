import rateLimiter from 'limiter';
import fetch, {Response} from 'node-fetch';

export class WebserviceClient {
	enabled = false;
	private readonly limiter: rateLimiter.RateLimiter;
	private readonly userAgent: string;

	constructor(requestPerInterval: number, requestIntervalMS: number, userAgent: string) {
		this.limiter = new rateLimiter.RateLimiter(requestPerInterval, requestIntervalMS);
		this.userAgent = userAgent;
	}

	protected async parseResult<T>(response: Response): Promise<T | undefined> {
		if (response.status === 404) {
			return Promise.reject(Error(`${response.status} ${response.statusText || ''}`));
		}
		try {
			return await response.json() as any;
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
		return new Promise<void>(resolve => {
			limiter.removeTokens(1, () => resolve());
		});
	}

	protected async getJson<T>(url: string, parameters?: any | undefined, ignoreStatus?: boolean): Promise<T> {
		this.checkDisabled();
		await this.limit();
		const params = parameters ? `?${new URLSearchParams(parameters)}` : '';
		const response = await fetch(url + params, {
			headers: {'User-Agent': this.userAgent},
			//timeout: 20000
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
