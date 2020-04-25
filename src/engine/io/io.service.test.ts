import tmp from 'tmp';
import {testService} from '../base/base.service.spec';
import {Store} from '../store/store';
import {buildMockRoot, MockRoot, removeMockRoot, writeMockRoot} from '../store/store.mock';
import {WorkerService} from '../worker/worker.service';
import {IoService} from './io.service';

describe('IOService', () => {
	let store: Store;
	let dir: tmp.DirResult;
	let mockRoot: MockRoot;
	// let ioService: IoService;

	testService({mockData: false},
		async (storeTest, imageModuleTest, audioModuleTest) => {
			store = storeTest;
			dir = tmp.dirSync();
			mockRoot = buildMockRoot(dir.name, 1, 'rootID');
			const workerService = new WorkerService(store, audioModuleTest.audioModule, imageModuleTest.imageModule);
			// ioService =
			new IoService(store.rootStore, workerService, async () => {
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
		}
	);

});
