import {after, before, describe} from 'mocha';
import {initTestFramework} from '../../test/common.spec';
import {Database} from './db.model';
import {TestDBElastic} from './elasticsearch/db-elastic.spec';
import {TestNeDB} from './nedb/db-nedb.spec';

initTestFramework();

export interface TestDB {
	name: string;
	database: Database;

	setup(): Promise<void>;

	cleanup(): Promise<void>;
}

export function testDatabases(setup: (testDB: TestDB) => Promise<void>, cleanup: () => Promise<void>, tests: () => void): void {
	const dbs: Array<TestDB> = [];
	dbs.push(new TestNeDB());
	// dbs.push(new TestElastic());
	for (const testDB of dbs) {
		describe('with ' + testDB.name, () => {
			before(function(done): void {
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
