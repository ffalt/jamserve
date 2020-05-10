import {ImageModuleTest} from '../../modules/image/image.module.spec';
import {testService} from '../base/base.service.spec';
import {StateService} from '../state/state.service';
import {FolderService} from './folder.service';

describe('FolderService', () => {
	// let trackStore: TrackStore;
	let folderService: FolderService;
	let imageModuleTest: ImageModuleTest;
	testService({mockData: true},
		async (store, imageModuleTestPara) => {
			imageModuleTest = imageModuleTestPara;
			// trackStore = store.trackStore;
			const stateService = new StateService(store.stateStore);
			folderService = new FolderService(store.folderStore, store.trackStore, store.rootStore, stateService, imageModuleTest.imageModule);
		},
		() => {
			describe('.getFolderImage', () => {
				it('should return an empty response for not available images', async () => {
					const folder = await folderService.folderStore.random();
					if (!folder) {
						throw new Error('Invalid Test Setup');
					}
					folder.tag.artworks = undefined;
					const res = await folderService.getImage(folder);
					expect(res).toBeUndefined();
				});
			});
			describe('.collectFolderPath', () => {
				it('should handle invalid parameters', async () => {
					let list = await folderService.collectFolderPath(undefined);
					expect(list.length).toBe(0);
					list = await folderService.collectFolderPath('invalid');
					expect(list.length).toBe(0);
				});
				it('should report the right parents', async () => {
					const folders = await folderService.folderStore.all();
					for (const f of folders) {
						const list = await folderService.collectFolderPath(f.id);
						expect(list.length).toBe(f.tag.level + 1);
						list.forEach((item, index) => {
							expect(f.path.indexOf(item.path)).toBe(0);
							expect(item.tag.level).toBe(index);
						});
					}
				});
			});
		});
});
