import fse from 'fs-extra';
import {ArtworkImageType, FolderTypesAlbum} from '../../model/jam-types';
import {testService} from '../base/base.service.spec';
import {mockFolderArtwork} from '../folder/folder.mock';
import {FolderService} from '../folder/folder.service';
import {StateService} from '../state/state.service';
import {TrackService} from './track.service';

describe('TrackService', () => {
	let trackService: TrackService;
	let folderService: FolderService;
	testService({mockData: true},
		async (store, imageModuleTest, audioModuleTest) => {
			const stateService = new StateService(store.stateStore);
			folderService = new FolderService(store.folderStore, store.trackStore, stateService, imageModuleTest.imageModule);
			trackService = new TrackService(store.trackStore, folderService, audioModuleTest.audioModule, imageModuleTest.imageModule, stateService);
		},
		() => {
			it('should return the track folder', async () => {
				const tracks = await trackService.trackStore.all();
				expect(tracks.length > 0, 'Invalid Test Setup').toBe(true);
				for (const track of tracks) {
					const folder = await trackService.getTrackFolder(track);
					expect(folder).toBeDefined();
					if (folder && !track.seriesID) {
						expect(FolderTypesAlbum).toContain(folder.tag.type);
					}
				}
			});
			it('should return a track image', async () => {
				const track = await trackService.trackStore.random();
				expect(track, 'Invalid Test Setup').toBeDefined();
				if (!track) {
					return;
				}
				const folder = await trackService.getTrackFolder(track);
				expect(folder).toBeDefined();
				if (folder) {
					const filename = await mockFolderArtwork(folder, ArtworkImageType.front);
					await folderService.folderStore.replace(folder);
					const img = await trackService.getImage(track);
					expect(img).toBeDefined();
					if (img) {
						expect(img.file, 'Image response not valid').toBeDefined();
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
