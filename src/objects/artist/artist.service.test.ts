import {assert, expect, should, use} from 'chai';
import {after, before, beforeEach, describe, it} from 'mocha';
import {FolderService} from '../folder/folder.service';
import {ArtistService} from './artist.service';
import {testService} from '../base/base.service.spec';
import {FolderType} from '../../types';

describe('ArtistService', () => {
	let artistService: ArtistService;
	let folderService: FolderService;
	testService(
		(storeTest, imageModuleTest) => {
			folderService = new FolderService(storeTest.store.folderStore, storeTest.store.trackStore, imageModuleTest.imageModule);
			artistService = new ArtistService(storeTest.store.artistStore, storeTest.store.trackStore, folderService);
		},
		() => {
			describe('getArtistFolder', () => {
				it('should return the right folder', async () => {
					const artists = await artistService.artistStore.all();
					for (const artist of artists) {
						const folder = await artistService.getArtistFolder(artist);
						should().exist(folder);
						if (folder) {
							expect(folder.tag.type).to.be.equal(FolderType.artist);
						}
					}
				});
			});
		}
	);
});
