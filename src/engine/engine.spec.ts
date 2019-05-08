import {after, before, describe, it} from 'mocha';
import {initTestFramework} from '../../test/common.spec';
import {TestEngine, TestEngines} from './engine.mock';

initTestFramework();

export function testEngines(opts: {}, setup: (testEngine: TestEngine) => Promise<void>, tests: (testEngine: TestEngine) => void, cleanup?: () => Promise<void>): void {
	const engines = new TestEngines();

	for (const testEngine of engines.engines) {
		describe('with ' + testEngine.name, () => {
			before(function(done): void {
				this.timeout(40000);
				testEngine.setup().then(async () => {
					await testEngine.engine.start();
					await setup(testEngine);
					done();
				}).catch(e => {
					throw e;
				});
			});

			after(async () => {
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
