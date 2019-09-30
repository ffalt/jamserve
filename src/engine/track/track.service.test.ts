import fse from 'fs-extra';
import path from 'path';
import {ArtworkImageType, FolderTypesAlbum} from '../../model/jam-types';
import {mockImage} from '../../modules/image/image.module.spec';
import {testService} from '../base/base.service.spec';
import {FolderService} from '../folder/folder.service';
import {StateService} from '../state/state.service';
import {TrackService} from './track.service';

describe('TrackService', () => {
	let trackService: TrackService;
	let folderService: FolderService;
	testService({mockData: true},
		async (store, imageModuleTest, audioModule) => {
			const stateService = new StateService(store.stateStore);
			folderService = new FolderService(store.folderStore, store.trackStore, stateService, imageModuleTest.imageModule);
			trackService = new TrackService(store.trackStore, folderService, audioModule, imageModuleTest.imageModule, stateService);
		},
		() => {
			it('should return the track folder', async () => {
				const tracks = await trackService.trackStore.all();
				expect(tracks.length > 0).toBe(true); // , 'Invalid Test Setup');
				for (const track of tracks) {
					const folder = await trackService.getTrackFolder(track);
					expect(folder).toBeTruthy();
					if (folder) {
						expect(FolderTypesAlbum).toContain(folder.tag.type);
					}
				}
			});
			it('should return a track image', async () => {
				const track = await trackService.trackStore.random();
				expect(track).toBeTruthy(); // 'Invalid Test Setup');
				if (!track) {
					return;
				}
				const folder = await trackService.getTrackFolder(track);
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
					const img = await trackService.getTrackImage(track);
					expect(img).toBeTruthy();
					if (img) {
						expect(img.file).toBeTruthy(); // 'Image response not valid');
						if (img.file) {
							expect(img.file.filename).toBe(filename);
						}
					}
					await fse.unlink(filename);
				}
			});
		},
		async () => {
			// nope
		}
	);
});
