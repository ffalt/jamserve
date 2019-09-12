import {initTestFramework} from '../engine/base/common.spec';
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
	if ((global as any)._testDatabases_.includes('nedb')) {
		dbs.push(new TestNeDB());
	}
	if ((global as any)._testDatabases_.includes('elastic')) {
		dbs.push(new TestDBElastic());
	}
	for (const testDB of dbs) {
		describe('with ' + testDB.name, () => {
			beforeAll(async () => {
				await testDB.setup();
				await setup(testDB);
			});
			afterAll(async () => {
				await cleanup();
				await testDB.cleanup();
			});
			tests();
		});
	}
}
