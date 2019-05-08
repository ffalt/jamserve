import {after, before, beforeEach, describe, it} from 'mocha';
import {ThirdPartyConfig} from '../../config/thirdparty.config';
import {testDatabases} from '../../db/db.mock';
import {Store} from '../store/store';
import {StoreMock} from '../store/store.mock';
import {AudioModule} from '../../modules/audio/audio.module';
import {ImageModuleTest} from '../../modules/image/image.module.spec';

export function testService(opts: { mockData: boolean }, setup: (store: Store, testImageModule: ImageModuleTest, audioModule: AudioModule) => Promise<void>, tests: () => void, cleanup?: () => Promise<void>): void {
	let imageModuleTest: ImageModuleTest;
	let storeTest: StoreMock;
	testDatabases(async (testDB) => {
		const store = new Store(testDB.database);
		imageModuleTest = new ImageModuleTest();
		await imageModuleTest.setup();
		const audioModule = new AudioModule(ThirdPartyConfig, imageModuleTest.imageModule);
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
