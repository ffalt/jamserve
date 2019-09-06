import rateLimiter from 'limiter';
import request from 'request';

export class WebserviceClient {
	private readonly limiter: rateLimiter.RateLimiter;
	private readonly userAgent: string;

	constructor(requestPerInterval: number, requestIntervalMS: number, userAgent: string) {
		this.limiter = new rateLimiter.RateLimiter(requestPerInterval, requestIntervalMS);
		this.userAgent = userAgent;
	}

	protected async getJson<T>(url: string, parameters?: object | undefined): Promise<T> {
		const options: request.Options = {
			url,
			headers: {'User-Agent': this.userAgent},
			qs: parameters,
			timeout: 20000
		};
		const limiter = this.limiter;
		return new Promise<T>((resolve, reject) => {
			limiter.removeTokens(1, () => {
				request(options, (err, response, body) => {
					if (err) {
						reject(err);
					} else {
						if (response.statusCode === 404) {
							reject(Error(response.statusCode + (response.statusMessage ? ' ' + response.statusMessage : '')));
						}
						try {
							resolve(JSON.parse(body) as T);
						} catch (err) {
							reject(err);
						}
					}
				});
			});
		});
	}

}
