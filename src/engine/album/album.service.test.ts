import fse from 'fs-extra';
import path from 'path';
import {DBObjectType} from '../../db/db.types';
import {AlbumType, ArtworkImageType, FolderTypesAlbum} from '../../model/jam-types';
import {mockImage} from '../../modules/image/image.module.spec';
import {testService} from '../base/base.service.spec';
import {FolderService} from '../folder/folder.service';
import {StateService} from '../state/state.service';
import {TrackStore} from '../track/track.store';
import {AlbumService} from './album.service';

describe('AlbumService', () => {
	let albumService: AlbumService;
	let folderService: FolderService;
	let trackStore: TrackStore;
	testService({mockData: true},
		async (store, imageModuleTest) => {
			trackStore = store.trackStore;
			const stateService = new StateService(store.stateStore);
			folderService = new FolderService(store.folderStore, store.trackStore, stateService, imageModuleTest.imageModule);
			albumService = new AlbumService(store.albumStore, store.trackStore, folderService, stateService);
		},
		() => {
			describe('getAlbumFolder', () => {
				it('should return nothing on invalid albums', async () => {
					let folder = await albumService.getAlbumFolder({
						id: 'invalid', type: DBObjectType.album,
						name: 'invalid', albumType: AlbumType.album, artistID: 'invalid',
						created: 0, duration: 0, slug: 'invalid',
						folderIDs: [], rootIDs: [], trackIDs: []
					});
					expect(folder).toBeUndefined();
					folder = await albumService.getAlbumFolder({
						id: 'invalid', type: DBObjectType.album,
						name: 'invalid', albumType: AlbumType.album, artistID: 'invalid',
						created: 0, duration: 0, slug: 'invalid',
						folderIDs: ['invalid', 'invalid'], rootIDs: [], trackIDs: []
					});
					expect(folder).toBeUndefined();
				});
				it('should return the album folder', async () => {
					const albums = await albumService.albumStore.all();
					if (albums.length === 0) {
						throw new Error('Invalid Test Setup');
					}
					for (const album of albums) {
						const folder = await albumService.getAlbumFolder(album);
						expect(folder).toBeTruthy();
						if (folder) {
							expect(FolderTypesAlbum).toContain(folder.tag.type);
						}
					}
				});
			});
			describe('getAlbumImage', () => {
				it('should return an album image', async () => {
					const album = await albumService.albumStore.random();
					if (!album) {
						throw new Error('Invalid Test Setup');
					}
					const folder = await albumService.getAlbumFolder(album);
					expect(folder).toBeTruthy();
					if (folder) {
						const name = 'dummy.png';
						const image = await mockImage('png');
						const filename = path.resolve(folder.path, name);
						await fse.writeFile(filename, image.buffer);
						folder.tag.artworks = [{
							id: 'dummyID',
							image: {format: 'png', height: 123, width: 123},
							name,
							types: [ArtworkImageType.front],
							stat: {
								created: 123,
								modified: 123,
								size: 123
							}
						}];
						await folderService.folderStore.replace(folder);
						const img = await albumService.getAlbumImage(album);
						expect(img).toBeTruthy();
						if (img) {
							expect(img.file).toBeTruthy();
							if (img.file) {
								expect(img.file.filename).toBe(filename);
							}
						}
						await fse.unlink(filename);
					}
				});
			});
		});
});
