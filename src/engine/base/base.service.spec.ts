import {ThirdPartyConfig} from '../../config/thirdparty.config';
import {testDatabases} from '../../db/db.mock';
import {AudioModule} from '../../modules/audio/audio.module';
import {MockAudioModule} from '../../modules/audio/audio.module.mock';
import {ImageModuleTest} from '../../modules/image/image.module.spec';
import {Store} from '../store/store';
import {StoreMock} from '../store/store.mock';

export function testService(opts: { mockData: boolean }, setup: (store: Store, testImageModule: ImageModuleTest, audioModule: AudioModule) => Promise<void>, tests: () => void, cleanup?: () => Promise<void>): void {
	let imageModuleTest: ImageModuleTest;
	let storeTest: StoreMock;
	testDatabases(async testDB => {
		const store = new Store(testDB.database);
		imageModuleTest = new ImageModuleTest();
		await imageModuleTest.setup();
		const audioModule = new MockAudioModule(ThirdPartyConfig, imageModuleTest.imageModule);
		if (opts.mockData) {
			storeTest = new StoreMock(store);
			await storeTest.setup(imageModuleTest.imageModule, audioModule);
		}
		await setup(store, imageModuleTest, audioModule);
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
