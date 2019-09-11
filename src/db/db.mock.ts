import {initTestFramework} from '../engine/base/common.spec';
import {Database} from './db.model';
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
