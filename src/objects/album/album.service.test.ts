import {assert, expect, should, use} from 'chai';
import {after, before, beforeEach, describe, it} from 'mocha';
import {AlbumService} from './album.service';
import {FolderService} from '../folder/folder.service';
import {testService} from '../base/base.service.spec';
import {TrackStore} from '../track/track.store';
import {FolderTypesAlbum} from '../../types';

describe('AlbumService', () => {
	let albumService: AlbumService;
	let folderService: FolderService;
	let trackStore: TrackStore;
	testService(
		(storeTest, imageModuleTest) => {
			trackStore = storeTest.store.trackStore;
			folderService = new FolderService(storeTest.store.folderStore, storeTest.store.trackStore, imageModuleTest.imageModule);
			albumService = new AlbumService(storeTest.store.albumStore, storeTest.store.trackStore, folderService);
		},
		() => {
			describe('getAlbumFolder', () => {
				it('should return the right folder', async () => {
					const albums = await albumService.albumStore.all();
					for (const album of albums) {
						const folder = await albumService.getAlbumFolder(album);
						should().exist(folder);
						if (folder) {
							expect(folder.tag.type).to.be.oneOf(FolderTypesAlbum);
						}
					}
				});
			});
		}
	);
});
