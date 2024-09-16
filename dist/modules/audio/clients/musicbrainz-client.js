import { WebserviceJSONClient } from '../../../utils/webservice-json-client.js';
import { LookupBrowseTypes, LookupIncludes } from './musicbrainz-client.types.js';
export class MusicbrainzClient extends WebserviceJSONClient {
    constructor(options) {
        const defaultOptions = {
            host: 'https://musicbrainz.org',
            basePath: '/ws/2/'
        };
        super(1, 1000, options.userAgent, { ...defaultOptions, ...options });
    }
    beautify(obj) {
        const formatKey = (key) => {
            return key.split('-').map((value, index) => {
                if (index === 0) {
                    return value;
                }
                return value[0].toUpperCase() + value.slice(1);
            }).join('');
        };
        const walk = (o) => {
            if (o === null) {
                return undefined;
            }
            if (o === undefined) {
                return undefined;
            }
            if (Array.isArray(o)) {
                return o.map(walk).filter((sub) => sub !== undefined);
            }
            if (typeof o === 'object') {
                const result = {};
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
    concatSearchQuery(query) {
        return Object.keys(query)
            .filter(key => (query[key] !== undefined && query[key] !== null))
            .map(key => `${key}:"${encodeURIComponent(query[key])}"`)
            .join('%20AND%20');
    }
    reqToUrl(req) {
        const q = Object.keys(req.query)
            .filter(key => (req.query[key] !== undefined && req.query[key] !== null))
            .map(key => `${key}=${req.query[key]}`);
        q.push(`limit=${req.limit || this.options.limit || 25}`);
        q.push(`offset=${req.offset || 0}`);
        q.push('fmt=json');
        return `${this.reqToHost(req)}${req.path}?${q.join('&')}`;
    }
    isRateLimitError(body) {
        return !!(body?.error && body.error.includes('allowable rate limit'));
    }
    async search(params) {
        const data = await this.get({
            path: `${this.options.basePath}${params.type}/`,
            query: { query: this.concatSearchQuery(params.query || {}) },
            retry: 0,
            limit: params.limit,
            offset: params.offset
        });
        return this.beautify(data);
    }
    async lookup(params) {
        if (!params.id || params.id.length === 0) {
            return Promise.reject(Error(`Invalid lookup id for type ${params.type}`));
        }
        const lookup = LookupIncludes[params.type];
        const inc = params.inc || LookupIncludes[params.type].join('+');
        if (!lookup) {
            return Promise.reject(Error('Invalid Lookup'));
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
        const result = {};
        result[params.type] = data || {};
        return this.beautify(result);
    }
    async browse(params) {
        const invalidKey = Object.keys(params.lookupIds).find(key => !LookupBrowseTypes[params.type] || !LookupBrowseTypes[params.type].includes(key));
        if (invalidKey) {
            return Promise.reject(Error(`Invalid browse lookup key for type ${params.type}: ${invalidKey}`));
        }
        const query = { inc: params.inc, ...params.lookupIds };
        const data = await this.get({
            path: `${this.options.basePath}${params.type}/`,
            query,
            retry: 0,
            limit: params.limit,
            offset: params.offset
        });
        const result = {};
        result[params.type] = data || {};
        return this.beautify(result);
    }
    async luceneSearch(params) {
        if (!params.query || params.query.length === 0) {
            return Promise.reject(Error(`Invalid query for type ${params.type}`));
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
        const result = {};
        result[params.type] = data || {};
        return this.beautify(result);
    }
}
//# sourceMappingURL=musicbrainz-client.js.map