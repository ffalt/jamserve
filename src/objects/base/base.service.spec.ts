import {after, before, beforeEach, describe, it} from 'mocha';
import {testDatabases} from '../../db/db.mock';
import {Store} from '../../engine/store/store';
import {StoreMock} from '../../engine/store/store.mock';
import {ImageModuleTest} from '../../engine/image/image.module.spec';

export function testService(setup: (testStore: StoreMock, testImageModule: ImageModuleTest) => void, tests: () => void, cleanup?: () => Promise<void>) {
	let imageModuleTest: ImageModuleTest;
	let storeTest: StoreMock;
	testDatabases(async (testDB) => {
		const store = new Store(testDB.database);
		storeTest = new StoreMock(store);
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
