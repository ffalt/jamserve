import fse from 'fs-extra';
import {DBObjectType} from '../../db/db.types';
import {AlbumType, ArtworkImageType, FolderTypesAlbum} from '../../model/jam-types';
import {testService} from '../base/base.service.spec';
import {mockFolderArtwork} from '../folder/folder.mock';
import {FolderService} from '../folder/folder.service';
import {StateService} from '../state/state.service';
import {TrackService} from '../track/track.service';
import {AlbumService} from './album.service';

describe('AlbumService', () => {
	let albumService: AlbumService;
	let folderService: FolderService;
	let trackService: TrackService;
	testService({mockData: true},
		async (store, imageModuleTest, audioModuleTest) => {
			const stateService = new StateService(store.stateStore);
			folderService = new FolderService(store.folderStore, store.trackStore, stateService, imageModuleTest.imageModule);
			trackService = new TrackService(store.trackStore, folderService, audioModuleTest.audioModule, imageModuleTest.imageModule, stateService);
			albumService = new AlbumService(store.albumStore, trackService, folderService, stateService);
		},
		() => {
			describe('getAlbumFolder', () => {
				it('should return nothing on invalid albums', async () => {
					let folder = await albumService.getAlbumFolder({
						id: 'invalid', type: DBObjectType.album,
						name: 'invalid', albumType: AlbumType.album, artistID: 'invalid',
						created: 0, duration: 0, slug: 'invalid', genres: [],
						folderIDs: [], rootIDs: [], trackIDs: []
					});
					expect(folder).toBeUndefined();
					folder = await albumService.getAlbumFolder({
						id: 'invalid', type: DBObjectType.album,
						name: 'invalid', albumType: AlbumType.album, artistID: 'invalid',
						created: 0, duration: 0, slug: 'invalid', genres: [],
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
						expect(folder).toBeDefined();
						if (folder && !album.seriesID) {
							expect(FolderTypesAlbum).toContain(folder.tag.type);
						}
					}
				});
			});
			describe('getImage', () => {
				it('should return an album image', async () => {
					const album = await albumService.albumStore.random();
					if (!album) {
						throw new Error('Invalid Test Setup');
					}
					const folder = await albumService.getAlbumFolder(album);
					expect(folder).toBeDefined();
					if (folder) {
						const filename = await mockFolderArtwork(folder, ArtworkImageType.front);
						await folderService.folderStore.replace(folder);
						const img = await albumService.getImage(album);
						expect(img).toBeDefined();
						if (img) {
							expect(img.file).toBeDefined();
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
