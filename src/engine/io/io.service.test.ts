import {after, before, beforeEach, describe, it} from 'mocha';
import {testService} from '../base/base.service.spec';
import {Store} from '../store/store';
import tmp from 'tmp';
import {buildMockRoot, MockRoot, removeMockRoot, writeMockRoot} from '../store/store.mock';
import {IoService} from './io.service';
import {ScanService} from '../scan/scan.service';
import {WaveformServiceTest} from '../waveform/waveform.service.spec';

describe('IOService', () => {
	let store: Store;
	let dir: tmp.DirResult;
	const waveFormServiceTest = new WaveformServiceTest();
	let mockRoot: MockRoot;
	let ioService: IoService;

	testService({mockData: false},
		async (storeTest, imageModuleTest, audioModule) => {
			store = storeTest;
			dir = tmp.dirSync();
			await waveFormServiceTest.setup();
			mockRoot = buildMockRoot(dir.name, 1, 'rootID');
			const scanService = new ScanService(store, audioModule, imageModuleTest.imageModule, waveFormServiceTest.waveformService);
			ioService = new IoService(store.rootStore, scanService, async () => {});
			await writeMockRoot(mockRoot);
		},
		() => {
			it('should', async () => {

			});
		},
		async () => {
			await removeMockRoot(mockRoot);
			dir.removeCallback();
			await waveFormServiceTest.cleanup();
		}
	);

});
