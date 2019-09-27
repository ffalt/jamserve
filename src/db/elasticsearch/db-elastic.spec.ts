import {ElasticLocal} from '../../../dev/lib/elastic-local';
import {TestDB} from '../db.spec';
import {DBElastic} from './db-elastic';
import {ElasticsearchConfig} from './db-elastic.types';

export function mockElasticDBConfig(): ElasticsearchConfig {
	return {
		host: 'http://localhost:9500',
		indexPrefix: `jamtest`,
		indexRefresh: 'true' // important for the tests! otherwise, async index changes are not immediately applied and therefor invisible in a following tests
	};
}

export class TestDBElastic implements TestDB {
	database: DBElastic;
	name = 'elastic';
	elasticInstance: any;

	constructor() {
		this.database = new DBElastic(mockElasticDBConfig());
	}

	async setupElastic(): Promise<void> {
		this.elasticInstance = new ElasticLocal('7.3.2', 9500, './local/.elastic/');
		await this.elasticInstance.start();
	}

	async setup(): Promise<void> {
		await this.setupElastic();
		await this.database.open();
		await this.database.drop();
		await this.database.check();
	}

	async cleanup(): Promise<void> {
		await this.database.drop();
		await this.database.close();
		await this.elasticInstance.stop();
	}
}
