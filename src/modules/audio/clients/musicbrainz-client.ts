import { WebserviceJSONClient } from '../../../utils/webservice-json-client.js';
import * as MusicbrainzClientApi from './musicbrainz-client.interface.js';
import { LookupBrowseTypes, LookupIncludes } from './musicbrainz-client.types.js';
import { MusicBrainz } from './musicbrainz-rest-data.js';
import { capitalize } from '../../../utils/capitalize.js';

export class MusicbrainzClient extends WebserviceJSONClient<MusicbrainzClientApi.Request, MusicBrainz.Response> {
	constructor(options: MusicbrainzClientApi.Options) {
		const defaultOptions = {
			host: 'https://musicbrainz.org',
			basePath: '/ws/2/'
		};
		// https://musicbrainz.org/doc/XML_Web_Service/Rate_Limiting "Currently that rate is (on average) 1 request per second. (per ip)"
		super(1, 1000, options.userAgent, { ...defaultOptions, ...options });
	}

	formatKey(key: string): string {
		return key.split('-').map((value, index) => {
			if (index === 0) {
				return value;
			}
			return capitalize(value);
		}).join('');
	};

	private beautify(obj: Record<string, any>): Record<string, any> | undefined {
		const walk = (o: Record<string, any> | undefined | null): Record<string, any> | undefined => {
			if (o === null) {
				return;
			}
			if (o === undefined) {
				return;
			}
			if (Array.isArray(o)) {
				return o.map((element: Record<string, any>) => walk(element)).filter((sub: any) => sub !== undefined);
			}
			if (typeof o === 'object') {
				const result: Record<string, any> = {};
				for (const key of Object.keys(o)) {
					const value: Record<string, any> = o[key];
					const sub = walk(value);
					if (sub !== undefined) {
						result[this.formatKey(key)] = sub;
					}
				}
				return result;
			}
			return o;
		};
		return walk(obj);
	}

	private concatSearchQuery(query: MusicbrainzClientApi.SearchQuery): string {
		return Object.entries(query)
			.filter(([_key, value]) => (value !== undefined && value !== null))
			.map(([key, value]) => `${key}:"${encodeURIComponent(value as string | number | boolean)}"`)
			.join('%20AND%20');
	}

	protected reqToUrl(req: MusicbrainzClientApi.Request): string {
		const q = Object.entries(req.query)
			.filter(([_key, value]) => (value !== undefined && value !== null))
			.map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value!)}`);
		q.push(
			`limit=${req.limit ?? (this.options as MusicbrainzClientApi.Options).limit ?? 25}`,
			`offset=${req.offset ?? 0}`,
			'fmt=json'
		);
		return `${this.reqToHost(req)}${req.path}?${q.join('&')}`;
	}

	protected isRateLimitError(body?: { error?: string }): boolean {
		// "error":"Your requests are exceeding the allowable rate limit. Please see http://wiki.musicbrainz.org/XMLWebService for more information."
		return !!(body?.error?.includes('allowable rate limit'));
	}

	async search(parameters: MusicbrainzClientApi.ParameterSearch): Promise<MusicBrainz.Response> {
		const data = await this.get({
			path: `${this.options.basePath}${parameters.type}/`,
			query: { query: this.concatSearchQuery(parameters.query) },
			retry: 0,
			limit: parameters.limit,
			offset: parameters.offset
		});
		return this.beautify(data) as MusicBrainz.Response;
	}

	async lookup(parameters: MusicbrainzClientApi.ParameterLookup): Promise<MusicBrainz.Response> {
		if (parameters.id.length === 0) {
			return Promise.reject(new Error(`Invalid lookup id for type ${parameters.type}`));
		}
		const lookup = LookupIncludes[parameters.type];
		if (!lookup) {
			return Promise.reject(new Error('Invalid Lookup'));
		}
		const inc = parameters.inc ?? lookup.join('+');
		const data = await this.get({
			path: `${this.options.basePath}${parameters.type}/${parameters.id}`,
			query: { mbid: parameters.id, inc },
			retry: 0,
			limit: parameters.limit,
			offset: parameters.offset
		});
		return this.beautify({ [parameters.type]: data }) as MusicBrainz.Response;
	}

	async browse(parameters: MusicbrainzClientApi.ParameterBrowse): Promise<MusicBrainz.Response> {
		const invalidKey = Object.keys(parameters.lookupIds).find(key => !LookupBrowseTypes[parameters.type]?.includes(key));
		if (invalidKey) {
			return Promise.reject(new Error(`Invalid browse lookup key for type ${parameters.type}: ${invalidKey}`));
		}
		const query = { inc: parameters.inc, ...parameters.lookupIds };
		const data = await this.get({
			path: `${this.options.basePath}${parameters.type}/`,
			query,
			retry: 0,
			limit: parameters.limit,
			offset: parameters.offset
		});
		return this.beautify({ [parameters.type]: data }) as MusicBrainz.Response;
	}

	async luceneSearch(parameters: MusicbrainzClientApi.ParameterLuceneSearch): Promise<MusicBrainz.Response> {
		// https://lucene.apache.org/core/4_3_0/queryparser/org/apache/lucene/queryparser/classic/package-summary.html#package_description
		if (parameters.query.length === 0) {
			return Promise.reject(new Error(`Invalid query for type ${parameters.type}`));
		}
		const data = await this.get({
			path: `${this.options.basePath}${parameters.type}/`,
			query: { query: encodeURIComponent(parameters.query || '') },
			retry: 0,
			limit: parameters.limit,
			offset: parameters.offset
		});
		return this.beautify({ [parameters.type]: data }) as MusicBrainz.Response;
	}
}
