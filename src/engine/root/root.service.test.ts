import {testService} from '../base/base.service.spec';
import {RootService} from './root.service';
import {mockRoot} from './root.mock';

describe('RootService', () => {
	let rootService: RootService;
	testService({mockData: true},
		async (store, imageModuleTest) => {
			rootService = new RootService(store.rootStore);
		},
		() => {
			it('should find roots', async () => {
				const roots = await rootService.rootStore.allIds();
				expect(roots.length > 0).toBe(true); // 'Wrong Test Setup');
			});
			it('should create a root', async () => {
				const root = mockRoot();
				root.path = '/invalid/test/path/';
				root.id = await rootService.create(root);
				const result = await rootService.rootStore.searchOne({path: '/invalid/test/path/'});
				expect(result).toBeTruthy();
			});
			it('should not allow already scanned path or parts of path in a new root', async () => {
				const root = mockRoot();
				root.path = '/invalid/test/path/';
				await expect(rootService.create(root)).rejects.toThrow('Root path already used');
				root.path = '/invalid/test/';
				await expect(rootService.create(root)).rejects.toThrow('Root path already used');
				root.path = '/invalid/test/path/other';
				await expect(rootService.create(root)).rejects.toThrow('Root path already used');
			});
			it('should not allow already scanned path or parts of path in a updated root', async () => {
				const root = mockRoot();
				root.path = '/invalid/test/isOK/';
				root.id = await rootService.create(root);
				root.path = '/invalid/test/path/';
				await expect(rootService.update(root)).rejects.toThrow('Root path already used');
			});
			it('should update a root', async () => {
				let result = await rootService.rootStore.searchOne({path: '/invalid/test/path/'});
				expect(result).toBeTruthy();
				if (result) {
					result.path = '/invalid/something/different/';
					await rootService.update(result);
					result = await rootService.rootStore.searchOne({path: result.path});
				}
				expect(result).toBeTruthy();
			});
			it('should remove a root', async () => {
				const root = mockRoot();
				root.path = '/invalid/test/toremove/';
				root.id = await rootService.create(root);
				await rootService.remove(root);
				const result = await rootService.rootStore.searchOne({path: root.path});
				expect(result).toBeUndefined();
			});
		},
		async () => {
		}
	);
});
