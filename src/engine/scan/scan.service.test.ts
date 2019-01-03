import {assert, expect, should, use} from 'chai';
import {after, before, beforeEach, describe, it} from 'mocha';
import {testService} from '../../objects/base/base.service.spec';
import {Store} from '../store/store';
import tmp, {SynchrounousResult} from 'tmp';
import {buildMockRoot, MockFolder, MockRoot, removeMockRoot, writeMockRoot} from '../store/store.mock';
import moment from 'moment';
import {ensureTrailingPathSeparator} from '../../utils/fs-utils';
import {MergeChanges, ScanService} from './scan.service';
import {WaveformServiceTest} from '../waveform/waveform.service.spec';

function logChange(name: string, amount: number) {
	if (amount > 0) {
		console.log(name, amount);
	}
}

function logChanges(changes: MergeChanges) {
	const v = moment.utc(changes.end - changes.start).format('HH:mm:ss');
	console.log('Duration:', v);
	logChange('Added Tracks', changes.newTracks.length);
	logChange('Updated Tracks', changes.updateTracks.length);
	logChange('Removed Tracks', changes.removedTracks.length);
	logChange('Added Folders', changes.newFolders.length);
	logChange('Updated Folders', changes.updateFolders.length);
	logChange('Removed Folders', changes.removedFolders.length);
	logChange('Added Artists', changes.newArtists.length);
	logChange('Updated Artists', changes.updateArtists.length);
	logChange('Removed Artists', changes.removedArtists.length);
	logChange('Added Albums', changes.newAlbums.length);
	logChange('Updated Albums', changes.updateAlbums.length);
	logChange('Removed Albums', changes.removedAlbums.length);
}


describe('ScanService', () => {
	let store: Store;
	let dir: SynchrounousResult;
	let mockRoot: MockRoot;
	let scanService: ScanService;
	const waveformServiceTest = new WaveformServiceTest();

	testService({mockData: false},
		async (storeTest, imageModuleTest, audioModule) => {
			store = storeTest;
			dir = tmp.dirSync();
			mockRoot = buildMockRoot(dir.name, 1, 'rootID');
			await waveformServiceTest.setup();
			scanService = new ScanService(store, audioModule, imageModuleTest.imageModule, waveformServiceTest.waveformService);
			await writeMockRoot(mockRoot);
		},
		() => {
			it('should scan', async () => {
				const changes = await scanService.run(mockRoot.path, mockRoot.id);
				expect(changes.newTracks.length).to.equal(mockRoot.expected.tracks, 'New Track count doesnt match');
				expect(changes.newFolders.length).to.equal(mockRoot.expected.folders, 'New Folder count doesnt match');
				expect(changes.newArtists.length).to.equal(mockRoot.expected.artists, 'New Artist count doesnt match');
				expect(changes.newAlbums.length).to.equal(mockRoot.expected.albums, 'New Album count doesnt match');

				async function validate(mockFolder: MockFolder) {
					const folder = await store.folderStore.searchOne({path: ensureTrailingPathSeparator(mockFolder.path)});
					should().exist(folder);
					if (!folder) {
						return;
					}
					if (mockFolder.expected.folderType !== undefined) {
						expect(folder.tag.type).to.equal(mockFolder.expected.folderType, 'Folder type unexpected: ' + mockFolder.path);
					}
					if (mockFolder.expected.albumType !== undefined) {
						expect(folder.tag.albumType).to.equal(mockFolder.expected.albumType, 'Album type unexpected: ' + mockFolder.path);
					}
					for (const sub of mockFolder.folders) {
						await validate(sub);
					}
				}

				await validate(mockRoot);

				// logChanges(changes);
			});
			it('should rescan', async () => {
				const changes = await scanService.run(mockRoot.path, mockRoot.id);
				expect(changes.newTracks.length).to.equal(0, 'New Track count doesnt match');
				expect(changes.updateTracks.length).to.equal(0, 'Update Track count doesnt match');
				expect(changes.newFolders.length).to.equal(0, 'New Folder count doesnt match');
				expect(changes.updateFolders.length).to.equal(0, 'Update Folder count doesnt match');
				expect(changes.newArtists.length).to.equal(0, 'New Artist count doesnt match');
				expect(changes.updateArtists.length).to.equal(0, 'Update Artist count doesnt match');
				expect(changes.newAlbums.length).to.equal(0, 'New Album count doesnt match');
				expect(changes.updateAlbums.length).to.equal(0, 'Update Album count doesnt match');
				// logChanges(changes);
			});
		},
		async () => {
			await waveformServiceTest.cleanup();
			await removeMockRoot(mockRoot);
			dir.removeCallback();
		}
	);

});
