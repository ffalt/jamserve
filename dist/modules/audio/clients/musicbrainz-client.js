import { WebserviceJSONClient } from '../../../utils/webservice-json-client.js';
import { LookupBrowseTypes, LookupIncludes } from './musicbrainz-client.types.js';
import { capitalize } from '../../../utils/capitalize.js';
export class MusicbrainzClient extends WebserviceJSONClient {
    constructor(options) {
        const defaultOptions = {
            host: 'https://musicbrainz.org',
            basePath: '/ws/2/'
        };
        super(1, 1000, options.userAgent, { ...defaultOptions, ...options });
    }
    formatKey(key) {
        return key.split('-').map((value, index) => {
            if (index === 0) {
                return value;
            }
            return capitalize(value);
        }).join('');
    }
    ;
    beautify(obj) {
        const walk = (o) => {
            if (o === null) {
                return;
            }
            if (o === undefined) {
                return;
            }
            if (Array.isArray(o)) {
                return o.map((element) => walk(element)).filter((sub) => sub !== undefined);
            }
            if (typeof o === 'object') {
                const result = {};
                for (const key of Object.keys(o)) {
                    const value = o[key];
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
    concatSearchQuery(query) {
        return Object.entries(query)
            .filter(([_key, value]) => (value !== undefined && value !== null))
            .map(([key, value]) => `${key}:"${encodeURIComponent(value)}"`)
            .join('%20AND%20');
    }
    reqToUrl(req) {
        const q = Object.entries(req.query)
            .filter(([_key, value]) => (value !== undefined && value !== null))
            .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`);
        q.push(`limit=${req.limit ?? this.options.limit ?? 25}`, `offset=${req.offset ?? 0}`, 'fmt=json');
        return `${this.reqToHost(req)}${req.path}?${q.join('&')}`;
    }
    isRateLimitError(body) {
        return !!(body?.error?.includes('allowable rate limit'));
    }
    async search(parameters) {
        const data = await this.get({
            path: `${this.options.basePath}${parameters.type}/`,
            query: { query: this.concatSearchQuery(parameters.query) },
            retry: 0,
            limit: parameters.limit,
            offset: parameters.offset
        });
        return this.beautify(data);
    }
    async lookup(parameters) {
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
        return this.beautify({ [parameters.type]: data });
    }
    async browse(parameters) {
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
        return this.beautify({ [parameters.type]: data });
    }
    async luceneSearch(parameters) {
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
        return this.beautify({ [parameters.type]: data });
    }
}
//# sourceMappingURL=musicbrainz-client.js.map