import {assert, expect, should, use} from 'chai';
import {after, before, beforeEach, describe, it} from 'mocha';
import {FolderService} from '../folder/folder.service';
import {ArtistService} from './artist.service';
import {testService} from '../base/base.service.spec';
import {FolderType} from '../../model/jam-types';
import {mockImage} from '../../modules/image/image.module.spec';
import path from 'path';
import fse from 'fs-extra';
import {StateService} from '../state/state.service';

describe('ArtistService', () => {
	let artistService: ArtistService;
	let folderService: FolderService;
	testService({mockData: true},
		(store, imageModuleTest) => {
			const stateService = new StateService(store.stateStore);
			folderService = new FolderService(store.folderStore, store.trackStore, stateService, imageModuleTest.imageModule);
			artistService = new ArtistService(store.artistStore, store.trackStore, folderService, stateService);
		},
		() => {
			it('should return the artist folder', async () => {
				const artists = await artistService.artistStore.all();
				expect(artists.length > 0).to.be.equal(true, 'Wrong Test Setup');
				for (const artist of artists) {
					const folder = await artistService.getArtistFolder(artist);
					should().exist(folder);
					if (folder) {
						expect(folder.tag.type).to.be.equal(FolderType.artist);
					}
				}
			});
			it('should return an album image', async () => {
				const artist = await artistService.artistStore.random();
				should().exist(artist, 'Wrong Test Setup');
				if (!artist) {
					return;
				}
				const folder = await artistService.getArtistFolder(artist);
				should().exist(folder);
				if (folder) {
					folder.tag.image = 'dummy.png';
					const image = await mockImage('png');
					const filename = path.resolve(folder.path, folder.tag.image);
					await fse.writeFile(filename, image.buffer);
					await folderService.folderStore.replace(folder);
					const img = await artistService.getArtistImage(artist);
					should().exist(img, 'Image not found');
					if (img) {
						should().exist(img.file, 'Image response not valid');
						if (img.file) {
							expect(img.file.filename).to.be.equal(filename);
						}
					}
				}
			});
		}
	);
});
