import tmp from 'tmp';
import {testService} from '../base/base.service.spec';
import {Store} from '../store/store';
import {buildMockRoot, MockRoot, removeMockRoot, writeMockRoot} from '../store/store.mock';
import {WaveformServiceTest} from '../waveform/waveform.service.spec';
import {WorkerService} from '../worker/worker.service';
import {IoService} from './io.service';

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
			const workerService = new WorkerService(store, audioModule, imageModuleTest.imageModule, waveFormServiceTest.waveformService);
			ioService = new IoService(store.rootStore, workerService, async () => {
				// nope
			});
			await writeMockRoot(mockRoot);
		},
		() => {
			it('should', async () => {
				// TODO TEST
			});
		},
		async () => {
			await removeMockRoot(mockRoot);
			dir.removeCallback();
			await waveFormServiceTest.cleanup();
		}
	);

});
