import elasticsearch from 'elasticsearch';
import {DBObject} from '../../engine/base/base.model';
import {logger} from '../../utils/logger';
import {wait} from '../../utils/wait';
import {Database} from '../db.model';
import {DBObjectType} from '../db.types';
import {DBIndexElastic} from './db-elastic.index';
import {mapping} from './db-elastic.mapping';
import {DbElasticSequence} from './db-elastic.sequence';
import {ElasticsearchConfig} from './db-elastic.types';

const log = logger('DB.elastic');

export class DBElastic implements Database {
	client: elasticsearch.Client;
	sequence: DbElasticSequence;
	indexPrefix: string;
	indexRefresh: string | undefined;

	constructor(config: ElasticsearchConfig) {
		this.client = new elasticsearch.Client({host: config.host, log: config.log});
		this.sequence = new DbElasticSequence(this.client);
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
			await this.client.ping({requestTimeout: 10000});
		} catch (e) {
			log.error('elasticsearch could not be contacted', e);
			return Promise.reject(e);
		}
	}

	async open(): Promise<void> {
		log.debug('Open connection to elasticsearch');
		await this.ping();
		await this.sequence.init(this.client);
		await this.check();
	}

	async getNewId(): Promise<string> {
		const id: number = await this.sequence.get(this.indexName('id'));
		return id.toString();
	}

	indexName(name: string): string {
		return `${this.indexPrefix}_${name}`;
	}

	private getTypes(): Array<DBObjectType> {
		return Object.keys(DBObjectType)
			.filter(key => !isNaN(Number(key)))
			.map(Number);
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
			return Promise.reject(Error(`Missing Elasticsearch Mapping for type ${name}`));
		}
		const index = this.indexName(name);
		const m: any = {};
		m._default_ = {_default_: {date_detection: false}};
		m[name] = mapping[name];
		await this.client.indices.create({index, body: {mappings: m}});
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

	public getDBIndex<T extends DBObject>(type: DBObjectType): DBIndexElastic<T> {
		return new DBIndexElastic<T>(type, this);
	}
}
