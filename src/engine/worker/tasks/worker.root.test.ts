import {testService} from '../../base/base.service.spec';
import {mockRoot} from '../../root/root.mock';
import {Store} from '../../store/store';
import {WorkerService} from '../worker.service';

describe('RootWorker', () => {
	let store: Store;
	let workerService: WorkerService;

	testService({mockData: false},
		async (storeTest, imageModuleTest, audioModuleTest) => {
			store = storeTest;
			workerService = new WorkerService(store, audioModuleTest.audioModule, imageModuleTest.imageModule);
		},
		() => {

			it('should create a root', async () => {
				const root = mockRoot();
				root.path = '/invalid/test/path/';
				root.id = await workerService.rootWorker.addRoot(root);
				const result = await store.rootStore.searchOne({path: '/invalid/test/path/'});
				expect(result).toBeTruthy();
			});
			it('should not allow already scanned path or parts of path in a new root', async () => {
				const root = mockRoot();
				root.path = '/invalid/test/path/';
				await expect(workerService.rootWorker.addRoot(root)).rejects.toThrow('Root path already used');
				root.path = '/invalid/test/';
				await expect(workerService.rootWorker.addRoot(root)).rejects.toThrow('Root path already used');
				root.path = '/invalid/test/path/other';
				await expect(workerService.rootWorker.addRoot(root)).rejects.toThrow('Root path already used');
			});
			it('should not allow already scanned path or parts of path in a updated root', async () => {
				const root = mockRoot();
				root.path = '/invalid/test/isOK/';
				root.id = await workerService.rootWorker.addRoot(root);
				await expect(workerService.rootWorker.update(root, root.name, '/invalid/test/path/', root.strategy)).rejects.toThrow('Root path already used');
			});
			it('should update a root', async () => {
				let result = await store.rootStore.searchOne({path: '/invalid/test/path/'});
				expect(result).toBeTruthy();
				if (result) {
					await workerService.rootWorker.update(result, result.name, '/invalid/something/different/', result.strategy);
					result = await store.rootStore.searchOne({path: '/invalid/something/different/'});
				}
				expect(result).toBeTruthy();
			});
			it('should remove a root', async () => {
				const root = mockRoot();
				root.path = '/invalid/test/toremove/';
				root.id = await workerService.rootWorker.addRoot(root);
				await workerService.rootWorker.remove(root);
				const result = await store.rootStore.searchOne({path: root.path});
				expect(result).toBeUndefined();
			});
		},
		async () => {
		}
	);

});
