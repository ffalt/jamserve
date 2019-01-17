import {TestElastic} from './elasticsearch/db-elastic.spec';
import {TestNeDB} from './nedb/db-nedb.spec';
import {Database} from './db.model';
import {configureLogger} from '../utils/logger';
import {after, before, describe} from 'mocha';
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import nock from 'nock';

nock.disableNetConnect();
nock.enableNetConnect('localhost:9200');

before(() => {
	chai.should();
	chai.use(chaiAsPromised);
});

configureLogger('warn');

export interface TestDB {
	name: string;
	database: Database;

	setup(): Promise<void>;

	cleanup(): Promise<void>;
}

export function testDatabases(setup: (testDB: TestDB) => Promise<void>, cleanup: () => Promise<void>, tests: () => void) {
	const dbs: Array<TestDB> = [];
	dbs.push(new TestNeDB());
	// dbs.push(new TestElastic());
	for (const testDB of dbs) {
		describe('with ' + testDB.name, () => {
			before(function(done) {
				this.timeout(40000);
				testDB.setup().then(() => {
					setup(testDB).then(() => {
						done();
					}).catch(e => {
						throw e;
					});
				}).catch(e => {
					throw e;
				});
			});

			after(async () => {
				await cleanup();
				await testDB.cleanup();
			});

			tests();
		});
	}
}
