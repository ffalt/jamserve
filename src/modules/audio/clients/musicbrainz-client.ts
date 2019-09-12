import {MusicBrainz} from '../../../model/musicbrainz-rest-data';
import {logger} from '../../../utils/logger';
import {WebserviceClient} from '../../../utils/webservice-client';
import {MusicbrainzClientApi} from './musicbrainz-client.interface';
import {LookupBrowseTypes, LookupIncludes} from './musicbrainz-client.types';

const log = logger('Musicbrainz');

export class MusicbrainzClient extends WebserviceClient {
	options = {
		host: 'https://musicbrainz.org',
		port: 80,
		basePath: '/ws/2/',
		userAgent: '',
		limit: 25,
		retryOn: false,
		retryDelay: 3000,
		retryCount: 3
	};

	constructor(options: MusicbrainzClientApi.Options) {
		// https://musicbrainz.org/doc/XML_Web_Service/Rate_Limiting "Currently that rate is (on average) 1 request per second. (per ip)"
		super(1, 1000, options.userAgent);
		this.options = {...this.options, ...options};
	}

	private beautify(obj: any): any {
		const formatKey = (key: string): string => {
			return key.split('-').map((value, index) => {
				if (index === 0) {
					return value;
				}
				return value[0].toUpperCase() + value.slice(1);
			}).join('');
		};

		const walk = (o: any): any => {
			if (o === null) {
				return undefined;
			}
			if (o === undefined) {
				return undefined;
			}
			if (Array.isArray(o)) {
				return o.map(walk).filter((sub: any) => sub !== undefined);
			}
			if (typeof o === 'object') {
				const result: any = {};
				Object.keys(o).forEach(key => {
					const sub = walk(o[key]);
					if (sub !== undefined) {
						result[formatKey(key)] = sub;
					}
				});
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

	private async get(req: MusicbrainzClientApi.Request): Promise<any> {
		const q = Object.keys(req.query)
			.filter(key => (req.query[key] !== undefined && req.query[key] !== null))
			.map(key => `${key}=${req.query[key]}`);
		q.push(`limit=${req.limit || this.options.limit || 25}`);
		q.push(`offset=${req.offset || 0}`);
		q.push('fmt=json');
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
			return Promise.reject(e);
		}
	}

	async search(params: MusicbrainzClientApi.ParameterSearch): Promise<MusicBrainz.Response> {
		const data = await this.get({
			path: `${this.options.basePath + params.type}/`,
			query: {query: this.concatSearchQuery(params.query || {})},
			retry: 0,
			limit: params.limit,
			offset: params.offset
		});
		return this.beautify(data);
	}

	async luceneSearch(params: MusicbrainzClientApi.ParameterLuceneSearch): Promise<MusicBrainz.Response> {
		// https://lucene.apache.org/core/4_3_0/queryparser/org/apache/lucene/queryparser/classic/package-summary.html#package_description
		if (!params.query || params.query.length === 0) {
			return Promise.reject(Error(`Invalid query for type ${params.type}`));
		}
		const data = await this.get({
			path: `${this.options.basePath + params.type}/`,
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

	async lookup(params: MusicbrainzClientApi.ParameterLookup): Promise<MusicBrainz.Response> {
		if (!params.id || params.id.length === 0) {
			return Promise.reject(Error(`Invalid lookup id for type ${params.type}`));
		}
		const lookup = LookupIncludes[params.type];
		const inc = params.inc || LookupIncludes[params.type].join('+');
		if (!lookup) {
			return Promise.reject(Error('Invalid Lookup'));
		}
		const data = await this.get({
			path: `${this.options.basePath + params.type}/${params.id}`,
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
		const invalidKey = Object.keys(params.lookupIds).find(key => !LookupBrowseTypes[params.type] || !LookupBrowseTypes[params.type].includes(key));
		if (invalidKey) {
			return Promise.reject(Error(`Invalid browse lookup key for type ${params.type}: ${invalidKey}`));
		}
		const query = {inc: params.inc, ...params.lookupIds};
		const data = await this.get({
			path: this.options.basePath + params.type,
			query,
			retry: 0,
			limit: params.limit,
			offset: params.offset
		});
		const result: any = {};
		result[params.type] = data || {};
		return this.beautify(result);
	}

}
