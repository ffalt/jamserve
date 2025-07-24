import { WebserviceJSONClient } from '../../../utils/webservice-json-client.js';
import * as MusicbrainzClientApi from './musicbrainz-client.interface.js';
import { LookupBrowseTypes, LookupIncludes } from './musicbrainz-client.types.js';
import { MusicBrainz } from './musicbrainz-rest-data.js';

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
			return value[0].toUpperCase() + value.slice(1);
		}).join('');
	};

	private beautify(obj: any): any {
		const walk = (o: any): any => {
			if (o === null) {
				return;
			}
			if (o === undefined) {
				return;
			}
			if (Array.isArray(o)) {
				return o.map(element => walk(element)).filter((sub: any) => sub !== undefined);
			}
			if (typeof o === 'object') {
				const result: any = {};
				for (const key of Object.keys(o)) {
					const sub = walk(o[key]);
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
		return Object.keys(query)
			.filter(key => ((query as any)[key] !== undefined && (query as any)[key] !== null))
			.map(key => `${key}:"${encodeURIComponent((query as any)[key])}"`)
			.join('%20AND%20');
	}

	protected reqToUrl(req: MusicbrainzClientApi.Request): string {
		const q = Object.keys(req.query)
			.filter(key => (req.query[key] !== undefined && req.query[key] !== null))
			.map(key => `${key}=${req.query[key]}`);
		q.push(
			`limit=${req.limit || (this.options as MusicbrainzClientApi.Options).limit || 25}`,
			`offset=${req.offset || 0}`,
			'fmt=json'
		);
		return `${this.reqToHost(req)}${req.path}?${q.join('&')}`;
	}

	protected isRateLimitError(body?: { error?: string }): boolean {
		// "error":"Your requests are exceeding the allowable rate limit. Please see http://wiki.musicbrainz.org/XMLWebService for more information."
		return !!(body?.error?.includes('allowable rate limit'));
	}

	async search(params: MusicbrainzClientApi.ParameterSearch): Promise<MusicBrainz.Response> {
		const data = await this.get({
			path: `${this.options.basePath}${params.type}/`,
			query: { query: this.concatSearchQuery(params.query || {}) },
			retry: 0,
			limit: params.limit,
			offset: params.offset
		});
		return this.beautify(data);
	}

	async lookup(params: MusicbrainzClientApi.ParameterLookup): Promise<MusicBrainz.Response> {
		if (!params.id || params.id.length === 0) {
			return Promise.reject(new Error(`Invalid lookup id for type ${params.type}`));
		}
		const lookup = LookupIncludes[params.type];
		const inc = params.inc || LookupIncludes[params.type].join('+');
		if (!lookup) {
			return Promise.reject(new Error('Invalid Lookup'));
		}
		const data = await this.get({
			path: `${this.options.basePath}${params.type}/${params.id}`,
			query: {
				mbid: params.id,
				inc
			},
			retry: 0,
			limit: params.limit,
			offset: params.offset
		});
		const result: any = {};
		result[params.type] = data || {};
		return this.beautify(result);
	}

	async browse(params: MusicbrainzClientApi.ParameterBrowse): Promise<MusicBrainz.Response> {
		const invalidKey = Object.keys(params.lookupIds).find(key => !LookupBrowseTypes[params.type]?.includes(key));
		if (invalidKey) {
			return Promise.reject(new Error(`Invalid browse lookup key for type ${params.type}: ${invalidKey}`));
		}
		const query = { inc: params.inc, ...params.lookupIds };
		const data = await this.get({
			path: `${this.options.basePath}${params.type}/`,
			query,
			retry: 0,
			limit: params.limit,
			offset: params.offset
		});
		const result: any = {};
		result[params.type] = data || {};
		return this.beautify(result);
	}

	async luceneSearch(params: MusicbrainzClientApi.ParameterLuceneSearch): Promise<MusicBrainz.Response> {
		// https://lucene.apache.org/core/4_3_0/queryparser/org/apache/lucene/queryparser/classic/package-summary.html#package_description
		if (!params.query || params.query.length === 0) {
			return Promise.reject(new Error(`Invalid query for type ${params.type}`));
		}
		const data = await this.get({
			path: `${this.options.basePath}${params.type}/`,
			query: {
				query: encodeURIComponent(params.query || '')
			},
			retry: 0,
			limit: params.limit,
			offset: params.offset
		});
		const result: any = {};
		result[params.type] = data || {};
		return this.beautify(result);
	}
}
