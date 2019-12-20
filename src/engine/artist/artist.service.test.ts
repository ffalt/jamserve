import fse from 'fs-extra';
import {DBObjectType} from '../../db/db.types';
import {AlbumType, ArtworkImageType, FolderType} from '../../model/jam-types';
import {testService} from '../base/base.service.spec';
import {mockFolderArtwork} from '../folder/folder.mock';
import {FolderService} from '../folder/folder.service';
import {StateService} from '../state/state.service';
import {ArtistService} from './artist.service';

describe('ArtistService', () => {
	let artistService: ArtistService;
	let folderService: FolderService;
	testService({mockData: true},
		async (store, imageModuleTest) => {
			const stateService = new StateService(store.stateStore);
			folderService = new FolderService(store.folderStore, store.trackStore, stateService, imageModuleTest.imageModule);
			artistService = new ArtistService(store.artistStore, store.trackStore, folderService, stateService);
		},
		() => {
			describe('.getArtistFolder', () => {
				it('should return nothing on invalid albums', async () => {
					let folder = await artistService.getArtistFolder({
						id: 'invalid', type: DBObjectType.artist,
						name: 'invalid', albumTypes: [AlbumType.album],
						created: 0, slug: 'invalid', albumIDs: [], seriesIDs: [],
						folderIDs: [], rootIDs: [], trackIDs: []
					});
					expect(folder).toBeUndefined();
					folder = await artistService.getArtistFolder({
						id: 'invalid', type: DBObjectType.artist,
						name: 'invalid', albumTypes: [AlbumType.album],
						created: 0, slug: 'invalid', albumIDs: [], seriesIDs: [],
						folderIDs: ['invalid', 'invalid'], rootIDs: [], trackIDs: []
					});
					expect(folder).toBeUndefined();
				});
				it('should return the artist folder', async () => {
					const artists = await artistService.artistStore.all();
					expect(artists.length > 0).toBe(true); // 'Invalid Test Setup');
					for (const artist of artists) {
						if (artistService.canHaveArtistImage(artist)) {
							const folder = await artistService.getArtistFolder(artist);
							if (!folder) {
								console.error(artist);
							}
							expect(folder).toBeDefined();
							if (folder) {
								expect(folder.tag.type).toBe(FolderType.artist); // folder.path + ' is not an artist folder');
							}
						}
					}
				});
			});
			describe('.getArtistImage', () => {
				it('should return an artist image', async () => {
					const artists = await artistService.artistStore.all();
					expect(artists.length > 0).toBe(true); //  'Invalid Test Setup');
					for (const artist of artists) {
						if (artistService.canHaveArtistImage(artist)) {
							const folder = await artistService.getArtistFolder(artist);
							expect(folder).toBeDefined();
							if (folder) {
								const filename = await mockFolderArtwork(folder, ArtworkImageType.artist);
								await folderService.folderStore.replace(folder);
								const img = await artistService.getImage(artist);
								expect(img).toBeDefined();
								if (img) {
									expect(img.file || img.buffer).toBeDefined(); // 'Image response not valid');
									if (img.file) {
										expect(img.file.filename).toBe(filename);
									}
								}
								await fse.unlink(filename);
							}
						}
					}
				});
			});
		});
});
