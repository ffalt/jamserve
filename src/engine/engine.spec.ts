import {TestDBElastic} from '../db/elasticsearch/db-elastic.spec';
import {TestNeDB} from '../db/nedb/db-nedb.spec';
import {initTestFramework} from './base/common.spec';
import {TestEngine} from './engine.mock';

initTestFramework();

export class TestEngines {
	engines: Array<TestEngine> = [];

	constructor() {
		if ((global as any)._testDatabases_.includes('nedb')) {
			this.engines.push(new TestEngine('nedb engine', 'nedb', new TestNeDB()));
		}
		if ((global as any)._testDatabases_.includes('elastic')) {
			this.engines.push(new TestEngine('elastic engine', 'elasticsearch', new TestDBElastic()));
		}
	}
}


export function testEngines(opts: {}, setup: (testEngine: TestEngine) => Promise<void>, tests: (testEngine: TestEngine) => void, cleanup?: () => Promise<void>): void {
	const engines = new TestEngines();
	for (const testEngine of engines.engines) {
		describe('with ' + testEngine.name, () => {
			beforeAll(async () => {
				await testEngine.setup();
				await testEngine.engine.start();
				await setup(testEngine);
			});
			afterAll(async () => {
				if (cleanup) {
					await cleanup();
				}
				await testEngine.engine.stop();
				await testEngine.cleanup();
			});
			tests(testEngine);
		});
	}

}
