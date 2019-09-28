import {testService} from '../base/base.service.spec';
import {RootService} from './root.service';

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
		},
		async () => {
		}
	);
});
