import {CoverArtArchive} from '../../../model/coverartarchive-rest-data';
import Logger from '../../../utils/logger';
import {WebserviceClient} from '../../../utils/webservice-client';

const log = Logger('CoverArtArchive');

declare namespace CoverArtArchiveClientApi {

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

export class CoverArtArchiveClient extends WebserviceClient {
	options = {
		host: 'https://coverartarchive.org',
		port: 80,
		basePath: '/',
		userAgent: '',
		limit: 25,
		retryOn: false,
		retryDelay: 3000,
		retryCount: 3
	};

	constructor(options: CoverArtArchiveClientApi.Options) {
		// https://musicbrainz.org/doc/Cover_Art_Archive/API#Rate_limiting_rules
		// there are currently no rate limiting rules in place at http://coverartarchive.org.

		// nevertheless, we limit this to 10 per second
		super(10, 1000, options.userAgent);
		this.options = {...this.options, ...options};
	}

	async releaseImages(mbid: string): Promise<CoverArtArchive.Response> {
		const data = await this.get({
			path: this.options.basePath + 'release/' + mbid + '/',
			query: {},
			retry: 0
		});
		return data;
	}

	async releaseGroupImages(mbid: string): Promise<CoverArtArchive.Response> {
		const data = await this.get({
			path: this.options.basePath + 'release-group/' + mbid + '/',
			query: {},
			retry: 0
		});
		return data;
	}

	private async get(req: CoverArtArchiveClientApi.Request): Promise<CoverArtArchive.Response> {
		const q = Object.keys(req.query)
			.filter(key => (req.query[key] !== undefined && req.query[key] !== null))
			.map(key => key + '=' + req.query[key]);
		const url = this.options.host + (this.options.port !== 80 ? ':' + this.options.port : '') + req.path + '?' + q.join('&');

		const isRateLimitError = (body: any): boolean => {
			return (body && body.error && body.error.includes('allowable rate limit'));
		};
		const options = this.options;

		const retry = async (error: Error): Promise<any> => {
			if (options.retryOn && req.retry < options.retryCount) {
				req.retry++;
				log.info('rate limit hit, retrying in ' + options.retryDelay + 'ms');
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
			if (e instanceof SyntaxError) {
				// coverartarchive response is html on empty data
				// <!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 3.2 Final//EN">
				// <title>404 Not Found</title>
				// <h1>Not Found</h1>
				// <p>No cover art found for release {{mbid}}</p>
				// */
				return Promise.resolve({images: []});
			}
			const statusCode = e.statusCode;
			if (statusCode === 502 || statusCode === 503) {
				return retry(e);
			}
			log.error(e);
			return Promise.reject(e);
		}
	}

}
