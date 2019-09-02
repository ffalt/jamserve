import rateLimiter from 'limiter';
import request from 'request';
import xml2js from 'xml2js';

export class WebserviceXMLClient {
	private limiter: rateLimiter.RateLimiter;
	private readonly userAgent: string;

	constructor(requestPerInterval: number, requestIntervalMS: number, userAgent: string) {
		this.limiter = new rateLimiter.RateLimiter(requestPerInterval, requestIntervalMS);
		this.userAgent = userAgent;
	}

	protected async getJson<T>(url: string, parameters?: object): Promise<T> {
		const options: request.Options = {
			url,
			headers: {'User-Agent': this.userAgent},
			qs: parameters
		};
		return new Promise<T>((resolve, reject) => {
			this.limiter.removeTokens(1, () => {
				request(options, (err, response, body) => {
					if (err) {
						return reject(err);
					}
					xml2js.parseString(body, (err2, result) => {
						if (err2) {
							return reject(err2);
						}
						resolve(result as T);
					});
				});
			});

		});
	}

}
