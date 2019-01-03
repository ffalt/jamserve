import {after, before, beforeEach, describe, it} from 'mocha';
import {testDatabases} from '../../db/db.mock';
import {Store} from '../../engine/store/store';
import {StoreMock} from '../../engine/store/store.mock';
import {ImageModuleTest} from '../../modules/image/image.module.spec';
import {AudioModule} from '../../modules/audio/audio.module';
import {ThirdPartyConfig} from '../../config/thirdparty.config';

export function testService(opts: { mockData: boolean }, setup: (store: Store, testImageModule: ImageModuleTest, audioModule: AudioModule) => Promise<void>, tests: () => void, cleanup?: () => Promise<void>) {
	let imageModuleTest: ImageModuleTest;
	let storeTest: StoreMock;
	testDatabases(async (testDB) => {
		const store = new Store(testDB.database);
		imageModuleTest = new ImageModuleTest();
		await imageModuleTest.setup();
		const audioModule = new AudioModule(ThirdPartyConfig);
		const oldread = audioModule.read;
		audioModule.read = async (filename: string) => {
			const result = await oldread(filename);
			if (result && result.media) {
				result.media.duration = 1;
			}
			return result;
		};
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
