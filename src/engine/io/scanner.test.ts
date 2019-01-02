import {assert, expect, should, use} from 'chai';
import {after, before, beforeEach, describe, it} from 'mocha';
import {Scanner} from './scanner';
import {testService} from '../../objects/base/base.service.spec';
import {Store} from '../store/store';
import {AudioModule} from '../../modules/audio/audio.module';
import {ThirdPartyConfig} from '../../config/thirdparty.config';
import tmp, {SynchrounousResult} from 'tmp';
import {buildMockRoot, removeMockRoot, writeMockRoot} from '../store/store.mock';

describe('Scanner', () => {
	let store: Store;
	let dir: SynchrounousResult;
	let mockRoot: any;
	const audioModule = new AudioModule(ThirdPartyConfig);
	const oldread = audioModule.read;
	audioModule.read = async (filename: string) => {
		const result = await oldread(filename);
		if (result && result.media) {
			result.media.duration = 1;
		}
		return result;
	};
	testService({mockData: false},
		async (storeTest, imageModuleTest) => {
			store = storeTest;
			dir = tmp.dirSync();
			mockRoot = buildMockRoot(dir.name, 1, 'rootID');
			// console.log(JSON.stringify(mockRoot, null, '\t'));
			await writeMockRoot(mockRoot);
		},
		() => {
			it('should scan', async () => {
				const scanner = new Scanner(store, audioModule);
				await scanner.run(mockRoot.path, mockRoot.id);
			});
		},
		async () => {
			await removeMockRoot(mockRoot);
			dir.removeCallback();
		}
	);

});
