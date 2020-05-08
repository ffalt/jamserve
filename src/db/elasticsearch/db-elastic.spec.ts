import {TestDB} from '../db.spec';
import {DBElastic} from './db-elastic';
import {ElasticsearchConfig} from './db-elastic.types';
import * as __ELASTIC__ from './db-elastic.spec.consts.json';

export function mockElasticDBConfig(): ElasticsearchConfig {
	return {
		host: 'http://localhost:' + __ELASTIC__.LOCAL_TEST_ELASTIC_PORT,
		indexPrefix: `jamtest`,
		indexRefresh: 'true' // important for the tests! otherwise, async index changes are not immediately applied and therefor invisible in a following tests
	};
}

export class TestDBElastic implements TestDB {
	database: DBElastic;
	name = 'elastic';

	constructor() {
		this.database = new DBElastic(mockElasticDBConfig());
	}

	async setup(): Promise<void> {
		await this.database.open();
		await this.database.drop();
		await this.database.check();
	}

	async cleanup(): Promise<void> {
		await this.database.drop();
		await this.database.close();

	}
}
