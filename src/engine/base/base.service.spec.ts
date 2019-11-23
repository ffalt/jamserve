import {testDatabases} from '../../db/db.mock';
import {AudioModuleTest} from '../../modules/audio/audio.module.spec';
import {ImageModuleTest} from '../../modules/image/image.module.spec';
import {Store} from '../store/store';
import {StoreMock} from '../store/store.mock';

export function testService(opts: { mockData: boolean }, setup: (store: Store, testImageModule: ImageModuleTest, testAudioModule: AudioModuleTest) => Promise<void>, tests: () => void, cleanup?: () => Promise<void>): void {
	let imageModuleTest: ImageModuleTest;
	let audioModuleTest: AudioModuleTest;
	let storeTest: StoreMock;
	testDatabases(async testDB => {
		const store = new Store(testDB.database);
		imageModuleTest = new ImageModuleTest();
		await imageModuleTest.setup();
		audioModuleTest = new AudioModuleTest(imageModuleTest.imageModule);
		await audioModuleTest.setup();
		if (opts.mockData) {
			storeTest = new StoreMock(store);
			await storeTest.setup(imageModuleTest.imageModule, audioModuleTest.audioModule);
		}
		await setup(store, imageModuleTest, audioModuleTest);
	}, async () => {
		await imageModuleTest.cleanup();
		await audioModuleTest.cleanup();
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
