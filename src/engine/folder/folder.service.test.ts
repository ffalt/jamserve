import {expect, should} from 'chai';
import {describe, it} from 'mocha';
import {FolderService} from './folder.service';
import path from 'path';
import fse from 'fs-extra';
import {SupportedWriteImageFormat} from '../../utils/filetype';
import mimeTypes from 'mime-types';
import {ArtworkImageType} from '../../model/jam-types';
import {testService} from '../base/base.service.spec';
import {ImageModuleTest, mockImage} from '../../modules/image/image.module.spec';
import {StateService} from '../state/state.service';
import {TrackStore} from '../track/track.store';

describe('FolderService', () => {
	let trackStore: TrackStore;
	let folderService: FolderService;
	let imageModuleTest: ImageModuleTest;
	testService({mockData: true},
		async (store, imageModuleTestPara) => {
			imageModuleTest = imageModuleTestPara;
			trackStore = store.trackStore;
			const stateService = new StateService(store.stateStore);
			folderService = new FolderService(store.folderStore, store.trackStore, stateService, imageModuleTest.imageModule);
		},
		() => {
			describe('getFolderImage', () => {
				it('should return an empty response for not available images', async () => {
					const folder = await folderService.folderStore.random();
					should().exist(folder, 'Wrong Test Setup');
					if (!folder) {
						return;
					}
					folder.tag.artworks = undefined;
					const res = await folderService.getFolderImage(folder);
					should().not.exist(res);
				});
			});

			describe('collectFolderPath', () => {
				it('should do handle invalid parameters', async () => {
					let list = await folderService.collectFolderPath(undefined);
					expect(list.length).to.equal(0);
					list = await folderService.collectFolderPath('invalid');
					expect(list.length).to.equal(0);
				});
				it('should report the right parents', async () => {
					const folders = await folderService.folderStore.all();
					for (const f of folders) {
						const list = await folderService.collectFolderPath(f.id);
						expect(list.length).to.equal(f.tag.level + 1);
						list.forEach((item, index) => {
							expect(f.path.indexOf(item.path)).to.equal(0);
							expect(item.tag.level).to.equal(index);
						});
					}
				});

			});

		});
});
