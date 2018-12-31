import {after, before, beforeEach, describe, it} from 'mocha';
import {testDatabases} from '../../db/db.mock';
import {Store} from '../../engine/store/store';
import {StoreMock} from '../../engine/store/store.mock';
import {ImageModuleTest} from '../../modules/image/image.module.spec';

export function testService(opts: { mockData: boolean }, setup: (store: Store, testImageModule: ImageModuleTest) => void, tests: () => void, cleanup?: () => Promise<void>) {
	let imageModuleTest: ImageModuleTest;
	let storeTest: StoreMock;
	testDatabases(async (testDB) => {
		const store = new Store(testDB.database);
		imageModuleTest = new ImageModuleTest();
		await imageModuleTest.setup();
		if (opts.mockData) {
			storeTest = new StoreMock(store);
			await storeTest.setup();
		}
		setup(store, imageModuleTest);
	}, async () => {
		await imageModuleTest.cleanup();
		if (opts.mockData) {
			await storeTest.cleanup();
		}
		if (cleanup) {
			await cleanup();
		}
	}, () => {
		tests();
	});
}
