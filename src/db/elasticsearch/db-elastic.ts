import elasticsearch from 'elasticsearch';
import {DBObjectType} from '../db.types';
import {ESSequence} from './es-sequence';
import Logger from '../../utils/logger';
import {mapping} from './mapping';
import {wait} from '../../utils/wait';
import {DBObject} from '../../objects/base/base.model';
import {Database, DatabaseIndex, DatabaseQuery} from '../db.model';
import {ElasticsearchConfig} from './config-elastic';

const log = Logger('DB.elastic');

export class DBIndexElastic<T extends DBObject> implements DatabaseIndex<T> {
	protected _index: string;
	protected _type: string;
	protected _map: any;
	public type: DBObjectType;
	public db: DBElastic;

	constructor(type: DBObjectType, db: DBElastic) {
		this.type = type;
		if (type === undefined) {
			this._index = db.indexName('*'); // 'all';
			this._type = '';
		} else {
			this._type = DBObjectType[type];
			this._index = db.indexName(DBObjectType[type]);
		}
		this._map = mapping[this._type];
		this.db = db;
	}

	private hit2Obj(hit: any): T {
		hit._source.id = hit._source.id.toString();
		hit._source.type = DBObjectType[hit._type];
		return <T>hit._source;
	}

	private filterProperties(o: T): any {
		const result: any = Object.assign({}, o);
		result.type = undefined;
		return result;
	}

	private getPropertyMapping(key: string): any {
		const parts = key.split('.');
		let o = this._map;
		for (const p of parts) {
			o = o.properties[p];
		}
		return o;
	}

	private translateElasticQuery(query: DatabaseQuery) {
		if (query.all) {
			return {match_all: {}};
		}
		let must: Array<any> = [];
		if (query.term) {
			const o = query.term;
			must = must.concat(
				Object.keys(o).map(key => {
					const term: any = {};
					const prop = this.getPropertyMapping(key);
					if (!prop) {
						console.log('Unknown prop', this._type, key);
					}
					if (prop && prop.type === 'text') {
						term[key + '.keyword'] = o[key];
					} else {
						term[key] = o[key];
					}
					return {'term': term};
				})
			);
		}
		if (query.terms) {
			const o = query.terms;
			must = must.concat(
				Object.keys(o).map(key => {
					const term: any = {};
					const prop = this.getPropertyMapping(key);
					if (!prop) {
						console.log('Unknown prop', this._type, key);
					}
					if (prop && prop.type === 'text') {
						term[key + '.keyword'] = o[key];
					} else {
						term[key] = o[key];
					}
					return {'terms': term};
				})
			);
		}
		if (query.match) {
			const o = query.match;
			must = must.concat(
				Object.keys(o).map(key => {
					const term: any = {};
					term[key] = o[key];
					return {'match_phrase_prefix': term};
				})
			);
		}
		if (query.startsWith) {
			const o = query.startsWith;
			must = must.concat(
				Object.keys(o).map(key => {
					const term: any = {};
					term[key] = o[key];
					return {'prefix': term};
				})
			);
		}
		if (query.startsWiths) {
			const o = query.startsWiths;
			Object.keys(o).forEach(key => {
				o[key].forEach(s => {
					const term: any = {};
					term[key] = s;
					must.push({'prefix': term});
				});
			});
		}
		if (query.range) {
			const o = query.range;
			must = must.concat(
				Object.keys(o).map(key => {
					const vals = o[key];
					const term: any = {};
					term[key] = {'gte': vals.gte, 'lte': vals.lte};
					return {'range': term};
				})
			);
		}
		if (query.notNull) {
			const o = query.notNull;
			must = must.concat(o.map(key => {
				return {'exists': {'field': key}};
			}));
		}
		return {
			bool: {
				must: must
			}
		};
	}

	private async scroll(response: elasticsearch.SearchResponse<T>, onHits: (hits: Array<any>) => Promise<void>): Promise<void> {
		let count = 0;
		const client = this.db.client;

		async function getMoreUntilDone(res: elasticsearch.SearchResponse<T>) {
			count += res.hits.hits.length;
			await onHits(res.hits.hits);
			if (res.hits.total !== count && res._scroll_id) {
				// now we can call scroll over and over
				const next = await client.scroll<T>({scrollId: res._scroll_id, scroll: '30s'});
				await getMoreUntilDone(next);
			}
		}

		await getMoreUntilDone(response);
	}

	async getNewId(): Promise<string> {
		return await this.db.getNewId();
	}

	async add(body: T): Promise<string> {
		if (!body.id || body.id.length === 0) {
			body.id = await this.getNewId();
		}
		await this.db.client.index({
			index: this._index,
			type: this._type,
			body: this.filterProperties(body),
			id: body.id,
			refresh: <elasticsearch.Refresh>this.db.indexRefresh
		});
		return body.id;
	}

	async bulk(bodies: Array<T>): Promise<void> {
		for (const body of bodies) {
			await await this.add(body);
		}
	}

	async replace(id: string, body: T): Promise<void> {
		await this.db.client.index({
			index: this._index,
			type: this._type,
			body: this.filterProperties(body),
			id,
			refresh: <elasticsearch.Refresh>this.db.indexRefresh
		});
	}

	async upsert(id: string, body: T): Promise<void> {
		if (!id || id.length === 0) {
			await this.add(body);
			return;
		}
		await this.db.client.index({
			index: this._index,
			type: this._type,
			body: this.filterProperties(body),
			id,
			refresh: <elasticsearch.Refresh>this.db.indexRefresh
		});
	}

	async removeByQuery(query: DatabaseQuery): Promise<number> {
		const response = await this.db.client.deleteByQuery({
			index: this._index,
			type: this._type,
			body: {
				query: this.translateElasticQuery(query)
			},
			refresh: <elasticsearch.Refresh>this.db.indexRefresh
		});
		return response.deleted;
	}

	async remove(id: string | Array<string>): Promise<void> {
		if (id.length === 0) {
			return Promise.resolve();
		}
		if (Array.isArray(id)) {
			await this.db.client.deleteByQuery({
				index: this._index,
				type: this._type,
				body: {
					query: {
						'terms': {
							'_id': id
						}
					}
				},
				refresh: <elasticsearch.Refresh>this.db.indexRefresh
			});
		} else {
			await this.db.client.delete({
				index: this._index,
				type: this._type,
				id: <string>id,
				refresh: <elasticsearch.Refresh>this.db.indexRefresh
			});
		}
	}

	async byId(id: string): Promise<T | undefined> {
		if (this.type === undefined) {
			return await this.queryOne({term: {id: id}});
		} else {
			try {
				const response = await this.db.client.get({
					index: this._index,
					type: this._type,
					id: id
				});
				if (!response.found) {
					return;
				} else {
					return this.hit2Obj(response);
				}
			} catch (e) {
				if (e.statusCode !== 404) {
					Promise.reject(e);
				}
			}
		}
	}

	async byIds(ids: Array<string>): Promise<Array<T>> {
		if (ids.length === 0) {
			return [];
		}
		const response = await this.db.client.mget({
			index: this._index,
			type: this._type,
			body: {'ids': ids}
		});
		if (!response.docs) {
			return [];
		}
		return response.docs.filter((doc) => {
			return doc.found;
		}).map((doc) => {
			return this.hit2Obj(doc);
		});
	}

	async query(query: DatabaseQuery): Promise<Array<T>> {
		let list: Array<T> = [];
		const response = await this.db.client.search<T>({
			index: this._index,
			type: this._type,
			scroll: '30s',
			size: 100,
			body: {
				query: this.translateElasticQuery(query)
			}
		});
		await this.scroll(response, async (hits) => {
			list = list.concat(hits.map(this.hit2Obj));
		});
		return list;
	}

	async queryOne(query: DatabaseQuery): Promise<T | undefined> {
		const response = await this.db.client.search({
			index: this._index,
			type: this._type,
			size: 1,
			body: {
				query: this.translateElasticQuery(query)
			}
		});
		if (response.hits.total > 0) {
			return this.hit2Obj(response.hits.hits[0]);
		}
		return;
	}

	async iterate(query: DatabaseQuery, onItem: (items: Array<T>) => Promise<void>): Promise<void> {
		const response = await this.db.client.search<T>({
			index: this._index,
			type: this._type,
			scroll: '30s',
			size: 100,
			body: {
				query: this.translateElasticQuery(query)
			}
		});
		await this.scroll(response, async (hits) => {
			await onItem(hits.map(this.hit2Obj));
		});
	}

	async queryIds(query: DatabaseQuery): Promise<Array<string>> {
		let list: Array<string> = [];
		const response = await this.db.client.search<T>({
			index: this._index,
			type: this._type,
			scroll: '30s',
			body: {
				query: this.translateElasticQuery(query),
				stored_fields: []
			}
		});
		await this.scroll(response, async (hits) => {
			list = list.concat(hits.map(hit => hit._id.toString()));
		});
		return list;
	}

	async aggregate(query: DatabaseQuery, field: string): Promise<number> {
		const response = await this.db.client.search({
			index: this._index,
			type: this._type,
			body: {
				query: this.translateElasticQuery(query),
				aggs: {_count: {cardinality: {field}}}
			}
		});
		return response.aggregations._count.value;
	}

	async count(query: DatabaseQuery): Promise<number> {
		const response = await this.db.client.search({
			index: this._index,
			type: this._type,
			size: 0,
			body: {
				query: this.translateElasticQuery(query),
			}
		});
		return response.hits.total;
	}

	async distinct(query: DatabaseQuery, field: string): Promise<Array<string>> {
		const response = await this.db.client.search({
			index: this._index,
			type: this._type,
			body: {
				query: this.translateElasticQuery(query),
				aggs: {distinct: {terms: {field}}}
			}
		});
		return response.aggregations.distinct.buckets.map((hit: any) => hit.key);
	}

}

export class DBElastic implements Database {
	client: elasticsearch.Client;
	sequence: ESSequence;
	indexPrefix: string;
	indexRefresh: string | undefined;

	constructor(config: ElasticsearchConfig) {
		this.client = new elasticsearch.Client({host: config.host, log: config.log});
		this.sequence = new ESSequence(this.client);
		this.indexPrefix = config.indexPrefix;
		this.indexRefresh = config.indexRefresh;
	}

	async drop(): Promise<void> {
		for (const type of this.getTypes()) {
			await this.resetIndex(type);
		}
	}

	async close(): Promise<void> {
		this.client.close();
	}

	async ping(): Promise<void> {
		try {
			await this.client.ping(<elasticsearch.PingParams>{requestTimeout: 10000});
		} catch (e) {
			log.error('elasticsearch could not be contacted', e);
			return Promise.reject(e);
		}
	}

	async open(): Promise<void> {
		log.debug('Open connection to elasticsearch');
		await this.sequence.init(this.client);
		await this.ping();
		await this.check();
	}

	async getNewId(): Promise<string> {
		const id: number = await this.sequence.get(this.indexName('id'));
		return id.toString();
	}

	indexName(name: string): string {
		return this.indexPrefix + '_' + name;
	}

	private getTypes(): Array<DBObjectType> {
		return Object.keys(DBObjectType)
			.filter(key => !isNaN(Number(key)))
			.map(key => parseInt(key, 10));
	}

	private async resetIndex(type: DBObjectType): Promise<void> {
		const index = this.indexName(DBObjectType[type]);
		const exists = await this.client.indices.exists({index});
		if (exists) {
			await this.client.indices.delete({index});
		}
	}

	async reset(): Promise<void> {
		for (const type of this.getTypes()) {
			await this.resetIndex(type);
		}
	}

	private async createIndex(type: DBObjectType): Promise<void> {
		const name = DBObjectType[type];
		if (!mapping[name]) {
			return Promise.reject(Error('Missing Elasticsearch Mapping for type ' + name));
		}
		const index = this.indexName(name);
		const m: any = {};
		m['_default_'] = {'_default_': {'date_detection': false}};
		m[name] = mapping[name];
		await this.client.indices.create({index, body: {'mappings': m}});
	}

	private async checkIndex(type: DBObjectType): Promise<boolean> {
		const name = DBObjectType[type];
		const index = this.indexName(name);
		const exists = await this.client.indices.exists({index});
		if (!exists) {
			await this.createIndex(type);
			return true;
		}
		return false;
	}

	async check(): Promise<void> {
		let waitAfter = false;
		for (const type of this.getTypes()) {
			waitAfter = await this.checkIndex(type) || waitAfter;
		}
		if (waitAfter) {
			await wait(1000);
		}
	}

	public getDBIndex<T extends DBObject>(type: DBObjectType) {
		return new DBIndexElastic<T>(type, this);
	}
}
