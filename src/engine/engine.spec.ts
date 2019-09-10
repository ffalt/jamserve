import {initTestFramework} from './base/common.spec';
import {TestEngine, TestEngines} from './engine.mock';

initTestFramework();

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
