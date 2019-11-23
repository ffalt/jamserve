import tmp from 'tmp';
import {DBObjectType} from '../../../db/db.types';
import {FolderType, RootScanStrategy} from '../../../model/jam-types';
import {testService} from '../../base/base.service.spec';
import {Store} from '../../store/store';
import {buildMockRoot, MockRoot, removeMockRoot, writeMockRoot} from '../../store/store.mock';
import {WorkerService} from '../worker.service';
import {validateMock} from '../worker.service.test';

describe('TrackWorker', () => {
	let store: Store;
	let workerService: WorkerService;
	let dir: tmp.DirResult;
	let mockRoot: MockRoot;

	testService({mockData: false},
		async (storeTest, imageModuleTest, audioModuleTest) => {
			store = storeTest;
			workerService = new WorkerService(store, audioModuleTest.audioModule, imageModuleTest.imageModule);
		},
		() => {
			beforeEach(async () => {
				dir = tmp.dirSync();
				mockRoot = buildMockRoot(dir.name, 1, 'rootID1');
				await writeMockRoot(mockRoot);
				mockRoot.id = await store.rootStore.add({id: '', path: mockRoot.path, type: DBObjectType.root, name: mockRoot.name, strategy: RootScanStrategy.auto, created: Date.now()});
				await workerService.refreshRoot({rootID: mockRoot.id, forceMetaRefresh: false});
			});
			afterEach(async () => {
				try {
					await removeMockRoot(mockRoot);
					dir.removeCallback();
				} catch (e) {
					console.error(e);
				}
				await store.reset();
				await store.check();
			});
			it('should move tracks', async () => {
				const albumFolder = await store.folderStore.searchOne({rootID: mockRoot.id, types: [FolderType.album], artist: 'artist 1', album: 'album 1'});
				if (!albumFolder) {
					throw Error('Invalid Test Setup');
				}
				const album2Folder = await store.folderStore.searchOne({rootID: mockRoot.id, types: [FolderType.album], artist: 'artist 1', album: 'album 2'});
				if (!album2Folder) {
					throw Error('Invalid Test Setup');
				}
				const album3Folder = await store.folderStore.searchOne({rootID: mockRoot.id, types: [FolderType.album], artist: 'artist 2', album: 'album 1'});
				if (!album3Folder) {
					throw Error('Invalid Test Setup');
				}
				const trackIDs = await store.trackStore.searchIDs({inPath: albumFolder.path});
				// fail: file already in parent
				await expect(workerService.moveTracks({rootID: mockRoot.id, trackIDs, newParentID: albumFolder.id})).rejects.toThrow('File is already in folder');
				// fail: file names are used
				await expect(workerService.moveTracks({rootID: mockRoot.id, trackIDs, newParentID: album2Folder.id})).rejects.toThrow('File name is already used in folder');

				let changes = await workerService.moveTracks({rootID: mockRoot.id, trackIDs, newParentID: album3Folder.id});
				expect(changes.newTracks.length).toBe(0); // New Track count doesnt match');
				expect(changes.newFolders.length).toBe(0); // New Folder count doesnt match');
				expect(changes.newArtists.length).toBe(0); // New Artist count doesnt match');
				expect(changes.removedTracks.length).toBe(0); // Removed Tracks count doesnt match');
				expect(changes.removedFolders.length).toBe(0); // Removed Folders count doesnt match');
				expect(changes.removedArtists.length).toBe(0); // Removed Artists count doesnt match');
				expect(changes.updateAlbums.length).toBe(0); // Update Album count doesnt match');
				expect(changes.updateArtists.length).toBe(2); // Update Artist count doesnt match');
				// 4 = the source, the dest & artist & new artist
				expect(changes.updateFolders.length).toBe(4); // Update Folder count doesnt match');
				expect(changes.updateTracks.length).toBe(trackIDs.length); // Update Track count doesnt match');
				expect(changes.newAlbums.length).toBe(1); // New Album count doesnt match');
				expect(changes.removedAlbums.length).toBe(1); // Removed Album count doesnt match');

				changes = await workerService.moveTracks({rootID: mockRoot.id, trackIDs, newParentID: albumFolder.id});
				expect(changes.newTracks.length).toBe(0); // New Track count doesnt match');
				expect(changes.newFolders.length).toBe(0); // New Folder count doesnt match');
				expect(changes.newArtists.length).toBe(0); // New Artist count doesnt match');
				expect(changes.removedTracks.length).toBe(0); // Removed Tracks count doesnt match');
				expect(changes.removedFolders.length).toBe(0); // Removed Folders count doesnt match');
				expect(changes.removedArtists.length).toBe(0); // Removed Artists count doesnt match');
				expect(changes.updateAlbums.length).toBe(0); // Update Album count doesnt match');
				expect(changes.updateArtists.length).toBe(2); // Update Artist count doesnt match');
				// 3 the source, the dest & artist
				expect(changes.updateFolders.length).toBe(4); // Update Folder count doesnt match');
				expect(changes.updateTracks.length).toBe(trackIDs.length); // Update Track count doesnt match');
				expect(changes.newAlbums.length).toBe(1); // New Album count doesnt match');
				expect(changes.removedAlbums.length).toBe(1); // Removed Album count doesnt match');
				await validateMock(mockRoot, store);
			});

		},
		async () => {
		}
	);

});
