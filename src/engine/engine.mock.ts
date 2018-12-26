import {Engine} from './engine';
import {BaseConfig, Config, extendConfig} from '../config';
import {mockElasticDBConfig, TestElastic} from '../db/elasticsearch/db-elastic.spec';
import {Store} from './store/store';
import tmp, {SynchrounousResult} from 'tmp';
import {TestNeDB} from '../db/nedb/db-nedb.spec';

export interface TestEngine {
	name: string;
	engine: Engine | undefined;

	setup(): Promise<void>;

	cleanup(): Promise<void>;
}


function mockupConfig(testPath: string, useDB: string): Config {
	const mockBaseConfig: BaseConfig = {
		log: {level: 'warn'},
		server: {
			listen: '0.0.0.0',
			port: 4041,
			session: {
				allowedCookieDomains: ['http://localhost:4041'],
				secret: '23409hj35bnkj34b5k345bhjk34534534',
				cookie: {
					name: 'jam-test.sid',
					secure: false,
					maxAge: {value: 5, unit: 'minute'}
				}
			},
			jwt: {
				secret: 'fksdjf4rk3j4b3k3bj45hv3j45hv3j4534534',
				maxAge: {value: 5, unit: 'minute'}
			}
		},
		paths: {
			data: testPath,
			frontend: '../dist/jamberry'
		},
		database: {
			use: useDB,
			options: {
				elasticsearch: mockElasticDBConfig(),
				nedb: {}
			}
		}
	};
	return extendConfig(<Config>mockBaseConfig);
}

export class TestEngineElastic implements TestEngine {
	name = 'elastic engine';
	testDB = new TestElastic();
	dir: SynchrounousResult;
	engine: Engine | undefined;

	constructor() {
		this.dir = tmp.dirSync();
	}

	async setup() {
		const config = mockupConfig(this.dir.name, 'elasticsearch');
		const store = new Store(this.testDB.database);
		this.engine = new Engine(config, store);
	}

	async cleanup() {
		this.dir.removeCallback();
	}

}

export class TestEngineNeDB implements TestEngine {
	name = 'nedb engine';
	testDB = new TestNeDB();
	dir: SynchrounousResult;
	engine: Engine | undefined;

	constructor() {
		this.dir = tmp.dirSync();
	}

	async setup() {
		const config = mockupConfig(this.dir.name, 'nedb');
		const store = new Store(this.testDB.database);
		this.engine = new Engine(config, store);
	}

	async cleanup() {
		this.dir.removeCallback();
	}

}

export class TestEngines {
	engines: Array<TestEngine> = [];

	constructor() {
		this.engines.push(new TestEngineElastic());
		this.engines.push(new TestEngineNeDB());
	}

}
