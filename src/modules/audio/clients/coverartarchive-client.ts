import { JSONOptions, JSONRequest, WebserviceJSONClient } from '../../../utils/webservice-json-client.js';
import { CoverArtArchive } from './coverartarchive-rest-data.js';
import { Response } from 'node-fetch';

export class CoverArtArchiveClient extends WebserviceJSONClient<JSONRequest, CoverArtArchive.Response> {
	constructor(options: JSONOptions) {
		const defaultOptions = {
			host: 'https://coverartarchive.org',
			basePath: '/'
		};
		// https://musicbrainz.org/doc/Cover_Art_Archive/API#Rate_limiting_rules
		// there are currently no rate limiting rules in place at http://coverartarchive.org.
		// nevertheless, we limit this to 10 per second
		super(10, 1000, options.userAgent, { ...defaultOptions, ...options });
	}

	protected async parseResult<T>(response: Response): Promise<T | undefined> {
		if (response.status === 404) {
			return Promise.resolve({ images: [] } as T);
		}
		return super.parseResult<T>(response);
	}

	protected async processError(error: unknown, req: JSONRequest): Promise<CoverArtArchive.Response> {
		if (error instanceof SyntaxError) {
			// coverartarchive response may be code 200 with html on empty data
			// <!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 3.2 Final//EN">
			// <title>404 Not Found</title>
			// <h1>Not Found</h1>
			// <p>No cover art found for release {{mbid}}</p>
			// */
			return { images: [] };
		}
		return super.processError(error, req);
	}

	async releaseImages(mbid: string): Promise<CoverArtArchive.Response> {
		return await this.get({
			path: `${this.options.basePath}release/${mbid}/`,
			query: {},
			retry: 0
		});
	}

	async releaseGroupImages(mbid: string): Promise<CoverArtArchive.Response> {
		return await this.get({
			path: `${this.options.basePath}release-group/${mbid}/`,
			query: {},
			retry: 0
		});
	}
}
