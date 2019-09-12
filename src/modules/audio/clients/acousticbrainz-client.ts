import {AcousticBrainz} from '../../../model/acousticbrainz-rest-data';
import {logger} from '../../../utils/logger';
import {WebserviceClient} from '../../../utils/webservice-client';

const log = logger('AcousticBrainz');

declare namespace AcousticbrainzClientApi {

	export interface Request {
		path: string;
		query: { [name: string]: string | undefined };
		retry: number;
	}

	export interface Options {
		host?: string;
		port?: number;
		basePath?: string;
		userAgent: string;
		retryOn?: boolean;
		retryDelay?: number;
		retryCount?: number;
	}

}

export class AcousticbrainzClient extends WebserviceClient {
	options = {
		host: 'https://acousticbrainz.org',
		port: 80,
		basePath: '/api/v1/',
		userAgent: '',
		retryOn: false,
		retryDelay: 3000,
		retryCount: 3
	};

	constructor(options: AcousticbrainzClientApi.Options) {
		// unknown rate limit, using same from musicbrainz https://musicbrainz.org/doc/XML_Web_Service/Rate_Limiting "Currently that rate is (on average) 1 request per second. (per ip)"
		super(1, 1000, options.userAgent);
		this.options = {...this.options, ...options};
	}

	async highLevel(mbid: string, nr?: number): Promise<AcousticBrainz.Response> {
		return this.get({
			path: `${this.options.basePath + mbid}/high-level`,
			query: {
				n: (nr !== undefined ? nr.toString() : undefined)
			},
			retry: 0
		});
	}

	private async get(req: AcousticbrainzClientApi.Request): Promise<any> {
		const q = Object.keys(req.query)
			.filter(key => (req.query[key] !== undefined && req.query[key] !== null))
			.map(key => `${key}=${req.query[key]}`);
		const url = `${this.options.host}${this.options.port !== 80 ? `:${this.options.port}` : ''}${req.path}?${q.join('&')}`;

		const isRateLimitError = (body: any): boolean => {
			return (body && body.error && body.error.includes('allowable rate limit'));
			// "error":"Your requests are exceeding the allowable rate limit. Please see http://wiki.musicbrainz.org/XMLWebService for more information."
		};
		const options = this.options;

		const retry = async (error: Error): Promise<any> => {
			if (options.retryOn && req.retry < options.retryCount) {
				req.retry++;
				log.info(`rate limit hit, retrying in ${options.retryDelay}ms`);
				return new Promise<any>((resolve, reject) => {
					setTimeout(() => {
						this.get(req).then(resolve).catch(reject);
					}, options.retryDelay);
				});
			}
			return Promise.reject(error);
		};

		log.info('requesting', JSON.stringify(req));
		try {
			const data = await this.getJson<any>(url, undefined);
			if (isRateLimitError(data)) {
				return retry(Error(data.error));
			}
			return data;
		} catch (e) {
			const statusCode = e.statusCode;
			if (statusCode === 502 || statusCode === 503) {
				return retry(e);
			}
			log.error(e);
			return Promise.reject(e);
		}
	}

}
