import {after, before, beforeEach, describe, it} from 'mocha';
import {TestDBs} from '../../db/db.mock';
import {Store} from '../../engine/store/store';
import {StoreTest} from '../../engine/store/store.test';
import {ImageModuleTest} from '../../engine/image/image.module.test';
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import nock from 'nock';
nock.disableNetConnect();

before(() => {
	chai.should();
	chai.use(chaiAsPromised);
});

export function testService(init: (testStore: StoreTest, testImageModule: ImageModuleTest) => void, tests: () => void) {
	const testDBs = new TestDBs();
	for (const testDB of testDBs.dbs) {
		describe(testDB.name, () => {
			let imageModuleTest: ImageModuleTest;
			let storeTest: StoreTest;

			before(function(done) {
				this.timeout(40000);
				testDB.setup().then(() => {
					const store = new Store(testDB.database);
					storeTest = new StoreTest(store);
					imageModuleTest = new ImageModuleTest();
					imageModuleTest.setup().then(() => {
						storeTest.setup().then(() => {
							init(storeTest, imageModuleTest);
							done();
						});
					});
				}).catch(e => {
					throw e;
				});
			});

			after(async () => {
				await imageModuleTest.cleanup();
				await storeTest.cleanup();
				await testDB.cleanup();
			});

			beforeEach(function() {
			});

			tests();
		});
	}
}
