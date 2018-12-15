import {assert, expect, should, use} from 'chai';
import {after, before, beforeEach, describe, it} from 'mocha';
import {FolderService} from '../folder/folder.service';
import {ArtistService} from './artist.service';
import {testService} from '../base/base.service.spec';

describe('ArtistService', () => {
	let artistService: ArtistService;
	let folderService: FolderService;
	testService(
		(storeTest, imageModuleTest) => {
			folderService = new FolderService(storeTest.store.folderStore, storeTest.store.trackStore, imageModuleTest.imageModule);
			artistService = new ArtistService(storeTest.store.artistStore, storeTest.store.trackStore, folderService);
		},
		() => {
			describe('getArtistImage', () => {
				it('should return an empty response for not available images', async () => {
					const artists = await artistService.artistStore.all();
					// const artist = artists[0];
					// console.log(artists);
				});
			});
		}
	);
});
