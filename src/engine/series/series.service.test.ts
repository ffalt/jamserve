import fse from 'fs-extra';
import {ArtworkImageType} from '../../model/jam-types';
import {testService} from '../base/base.service.spec';
import {mockFolderArtwork} from '../folder/folder.mock';
import {FolderService} from '../folder/folder.service';
import {StateService} from '../state/state.service';
import {SeriesService} from './series.service';

describe('SeriesService', () => {
	let seriesService: SeriesService;
	let folderService: FolderService;
	testService({mockData: true},
		async (store, imageModuleTest, audioModuleTest) => {
			const stateService = new StateService(store.stateStore);
			folderService = new FolderService(store.folderStore, store.trackStore, store.rootStore, stateService, imageModuleTest.imageModule);
			seriesService = new SeriesService(store.seriesStore, store.trackStore, folderService, stateService);
		},
		() => {
			describe('getImage', () => {
				it('should return an album image', async () => {
					const series = await seriesService.seriesStore.random();
					if (!series) {
						throw new Error('Invalid Test Setup');
					}
					const folders = await folderService.folderStore.byIds(series.folderIDs);
					folders.sort((a, b) => a.tag.level - b.tag.level);
					const folder = folders[0];
					const filename = await mockFolderArtwork(folder, ArtworkImageType.front);
					await folderService.folderStore.replace(folder);
					const img = await seriesService.getImage(series);
					expect(img).toBeDefined();
					if (img) {
						expect(img.file, 'Image response not valid').toBeDefined();
						if (img.file) {
							expect(img.file.filename).toBe(filename);
						}
					}
					await fse.unlink(filename);
				});
			});
		});
});
