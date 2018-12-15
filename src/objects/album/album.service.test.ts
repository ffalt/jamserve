import {assert, expect, should, use} from 'chai';
import {after, before, beforeEach, describe, it} from 'mocha';
import {AlbumService} from './album.service';
import {FolderService} from '../folder/folder.service';
import {testService} from '../base/base.service.spec';

describe('AlbumService', () => {
	let albumService: AlbumService;
	let folderService: FolderService;
	testService(
		(storeTest, imageModuleTest) => {
			folderService = new FolderService(storeTest.store.folderStore, storeTest.store.trackStore, imageModuleTest.imageModule);
			albumService = new AlbumService(storeTest.store.albumStore, storeTest.store.trackStore, folderService);
		},
		() => {
			describe('getAlbumImage', () => {
				it('should return an empty response for not available images', async () => {
					const albums = await albumService.albumStore.all();
					// const album = albums[0];
					// console.log(albums);
				});
			});
		}
	);
});
