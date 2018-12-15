import {after, before, beforeEach, describe, it} from 'mocha';
import {testDatabases} from '../../db/db.mock';
import {Store} from '../../engine/store/store';
import {StoreTest} from '../../engine/store/store.test';
import {ImageModuleTest} from '../../engine/image/image.module.spec';

export function testService(setup: (testStore: StoreTest, testImageModule: ImageModuleTest) => void, tests: () => void, cleanup?: () => Promise<void>) {
	let imageModuleTest: ImageModuleTest;
	let storeTest: StoreTest;
	testDatabases(async (testDB) => {
		const store = new Store(testDB.database);
		storeTest = new StoreTest(store);
		imageModuleTest = new ImageModuleTest();
		await imageModuleTest.setup();
		await storeTest.setup();
		setup(storeTest, imageModuleTest);
	}, async () => {
		await imageModuleTest.cleanup();
		await storeTest.cleanup();
		if (cleanup) {
			await cleanup();
		}
	}, () => {
		tests();
	});
}
