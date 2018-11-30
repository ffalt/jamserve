import {TestElastic} from './elasticsearch/db-elastic.test';
import {TestNeDB} from './nedb/db-nedb.test';
import {Database} from './db.model';
import {configureLogger} from '../utils/logger';
configureLogger('debug');

export interface TestDB {
	name: string;
	database: Database;

	setup(): Promise<void>;

	cleanup(): Promise<void>;
}

export class TestDBs {
	dbs: Array<TestDB> = [];

	constructor() {
		this.dbs.push(new TestElastic());
		this.dbs.push(new TestNeDB());
	}

}
