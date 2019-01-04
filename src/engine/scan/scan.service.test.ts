import {assert, expect, should, use} from 'chai';
import {after, before, beforeEach, describe, it} from 'mocha';
import {testService} from '../../objects/base/base.service.spec';
import {Store} from '../store/store';
import tmp, {SynchrounousResult} from 'tmp';
import {buildMockRoot, MockRoot, removeMockRoot, writeMockRoot} from '../store/store.mock';
import moment from 'moment';
import {MergeChanges, ScanService} from './scan.service';
import {WaveformServiceTest} from '../waveform/waveform.service.spec';
import path from 'path';
import {randomItem} from '../../utils/random';
import {Genres} from '../../utils/genres';
import {AlbumType, FolderType} from '../../model/jam-types';

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
			mockRoot = buildMockRoot(dir.name, 1, 'rootID1');
			await waveformServiceTest.setup();
			scanService = new ScanService(store, audioModule, imageModuleTest.imageModule, waveformServiceTest.waveformService);
			await writeMockRoot(mockRoot);
		},
		() => {
			/**
			 it('should scan', async () => {
				const changes = await scanService.run(mockRoot.path, mockRoot.id);
				expect(changes.newTracks.length).to.equal(mockRoot.expected.tracks, 'New Track count doesnt match');
				expect(changes.newFolders.length).to.equal(mockRoot.expected.folders, 'New Folder count doesnt match');
				expect(changes.newArtists.length).to.equal(mockRoot.expected.artists, 'New Artist count doesnt match');
				expect(changes.newAlbums.length).to.equal(mockRoot.expected.albums, 'New Album count doesnt match');
				expect(changes.updateTracks.length).to.equal(0, 'Update Track count doesnt match');
				expect(changes.removedTracks.length).to.equal(0, 'Removed Tracks count doesnt match');
				expect(changes.updateFolders.length).to.equal(0, 'Update Folder count doesnt match');
				expect(changes.removedFolders.length).to.equal(0, 'Removed Folders count doesnt match');
				expect(changes.updateArtists.length).to.equal(0, 'Update Artist count doesnt match');
				expect(changes.removedArtists.length).to.equal(0, 'Removed Artists count doesnt match');
				expect(changes.updateAlbums.length).to.equal(0, 'Update Album count doesnt match');
				expect(changes.removedAlbums.length).to.equal(0, 'Removed Album count doesnt match');

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
				expect(changes.removedTracks.length).to.equal(0, 'Removed Tracks count doesnt match');
				expect(changes.newFolders.length).to.equal(0, 'New Folder count doesnt match');
				expect(changes.updateFolders.length).to.equal(0, 'Update Folder count doesnt match');
				expect(changes.removedFolders.length).to.equal(0, 'Removed Folders count doesnt match');
				expect(changes.newArtists.length).to.equal(0, 'New Artist count doesnt match');
				expect(changes.updateArtists.length).to.equal(0, 'Update Artist count doesnt match');
				expect(changes.removedArtists.length).to.equal(0, 'Removed Artists count doesnt match');
				expect(changes.newAlbums.length).to.equal(0, 'New Album count doesnt match');
				expect(changes.updateAlbums.length).to.equal(0, 'Update Album count doesnt match');
				expect(changes.removedAlbums.length).to.equal(0, 'Removed Album count doesnt match');
				// logChanges(changes);
			});
			 it('should remove missing in the root', async () => {
				await removeMockRoot(mockRoot);
				await fse.ensureDir(mockRoot.path);
				const changes = await scanService.run(mockRoot.path, mockRoot.id);
				await fse.rmdir(mockRoot.path);
				expect(changes.newTracks.length).to.equal(0, 'New Track count doesnt match');
				expect(changes.updateTracks.length).to.equal(0, 'Update Track count doesnt match');
				expect(changes.removedTracks.length).to.equal(mockRoot.expected.tracks, 'Removed Tracks count doesnt match');
				expect(changes.newFolders.length).to.equal(0, 'New Folder count doesnt match');
				expect(changes.updateFolders.length).to.equal(1, 'Update Folder count doesnt match');
				expect(changes.removedFolders.length).to.equal(mockRoot.expected.folders - 1, 'Removed Folders count doesnt match');
				expect(changes.newArtists.length).to.equal(0, 'New Artist count doesnt match');
				expect(changes.updateArtists.length).to.equal(0, 'Update Artist count doesnt match');
				expect(changes.removedArtists.length).to.equal(mockRoot.expected.artists, 'Removed Artists count doesnt match');
				expect(changes.newAlbums.length).to.equal(0, 'New Album count doesnt match');
				expect(changes.updateAlbums.length).to.equal(0, 'Update Album count doesnt match');
				expect(changes.removedAlbums.length).to.equal(mockRoot.expected.albums, 'Removed Album count doesnt match');
				expect(await store.folderStore.count()).to.equal(1);
				expect(await store.trackStore.count()).to.equal(0);
				expect(await store.albumStore.count()).to.equal(0);
				expect(await store.artistStore.count()).to.equal(0);
			});
			 it('should scan added in the root', async () => {
				await writeMockRoot(mockRoot);
				const changes = await scanService.run(mockRoot.path, mockRoot.id);
				expect(changes.newTracks.length).to.equal(mockRoot.expected.tracks, 'New Track count doesnt match');
				expect(changes.updateFolders.length).to.equal(1, 'Update Folder count doesnt match');
				expect(changes.newFolders.length).to.equal(mockRoot.expected.folders - 1, 'New Folder count doesnt match');
				expect(changes.newArtists.length).to.equal(mockRoot.expected.artists, 'New Artist count doesnt match');
				expect(changes.newAlbums.length).to.equal(mockRoot.expected.albums, 'New Album count doesnt match');
				expect(changes.updateTracks.length).to.equal(0, 'Update Track count doesnt match');
				expect(changes.removedTracks.length).to.equal(0, 'Removed Tracks count doesnt match');
				expect(changes.removedFolders.length).to.equal(0, 'Removed Folders count doesnt match');
				expect(changes.updateArtists.length).to.equal(0, 'Update Artist count doesnt match');
				expect(changes.removedArtists.length).to.equal(0, 'Removed Artists count doesnt match');
				expect(changes.updateAlbums.length).to.equal(0, 'Update Album count doesnt match');
				expect(changes.removedAlbums.length).to.equal(0, 'Removed Album count doesnt match');
			});
			 it('should combine/remove artists and albums from different roots', async () => {
				const dir2 = tmp.dirSync();
				const mockRoot2 = buildMockRoot(dir2.name, 2, 'rootID2');
				await writeMockRoot(mockRoot2);
				let changes = await scanService.run(mockRoot2.path, mockRoot2.id);
				await removeMockRoot(mockRoot2);
				expect(changes.newTracks.length).to.equal(mockRoot.expected.tracks, 'New Track count doesnt match');
				expect(changes.newFolders.length).to.equal(mockRoot.expected.folders, 'New Folder count doesnt match');
				expect(changes.newArtists.length).to.equal(0, 'New Artist count doesnt match');
				expect(changes.newAlbums.length).to.equal(0, 'New Album count doesnt match');
				expect(changes.updateTracks.length).to.equal(0, 'Update Track count doesnt match');
				expect(changes.removedTracks.length).to.equal(0, 'Removed Tracks count doesnt match');
				expect(changes.updateFolders.length).to.equal(0, 'Update Folder count doesnt match');
				expect(changes.removedFolders.length).to.equal(0, 'Removed Folders count doesnt match');
				expect(changes.removedArtists.length).to.equal(0, 'Removed Artists count doesnt match');
				expect(changes.removedAlbums.length).to.equal(0, 'Removed Album count doesnt match');
				expect(changes.updateAlbums.length).to.equal(mockRoot.expected.albums, 'Update Album count doesnt match');
				expect(changes.updateArtists.length).to.equal(mockRoot.expected.artists, 'Update Artist count doesnt match');

				await fse.ensureDir(mockRoot2.path);
				changes = await scanService.run(mockRoot2.path, mockRoot2.id);
				await fse.rmdir(mockRoot2.path);
				expect(changes.newTracks.length).to.equal(0, 'New Track count doesnt match');
				expect(changes.newFolders.length).to.equal(0, 'New Folder count doesnt match');
				expect(changes.newArtists.length).to.equal(0, 'New Artist count doesnt match');
				expect(changes.newAlbums.length).to.equal(0, 'New Album count doesnt match');
				expect(changes.updateTracks.length).to.equal(0, 'Update Track count doesnt match');
				expect(changes.removedTracks.length).to.equal(mockRoot.expected.tracks, 'Removed Tracks count doesnt match');
				expect(changes.updateFolders.length).to.equal(1, 'Update Folder count doesnt match');
				expect(changes.removedFolders.length).to.equal(mockRoot.expected.folders - 1, 'Removed Folders count doesnt match');
				expect(changes.removedArtists.length).to.equal(0, 'Removed Artists count doesnt match');
				expect(changes.removedAlbums.length).to.equal(0, 'Removed Album count doesnt match');
				expect(changes.updateAlbums.length).to.equal(mockRoot.expected.albums, 'Update Album count doesnt match');
				expect(changes.updateArtists.length).to.equal(mockRoot.expected.artists, 'Update Artist count doesnt match');
			});

			 it('should combine/remove artists and albums from different roots', async () => {
				const dir2 = tmp.dirSync();
				const mockRoot2 = buildMockRoot(dir2.name, 2, 'rootID2');
				await writeMockRoot(mockRoot2);
				let changes = await scanService.run(mockRoot2.path, mockRoot2.id);
				await removeMockRoot(mockRoot2);
				expect(changes.newTracks.length).to.equal(mockRoot.expected.tracks, 'New Track count doesnt match');
				expect(changes.newFolders.length).to.equal(mockRoot.expected.folders, 'New Folder count doesnt match');
				expect(changes.newArtists.length).to.equal(0, 'New Artist count doesnt match');
				expect(changes.newAlbums.length).to.equal(0, 'New Album count doesnt match');
				expect(changes.updateTracks.length).to.equal(0, 'Update Track count doesnt match');
				expect(changes.removedTracks.length).to.equal(0, 'Removed Tracks count doesnt match');
				expect(changes.updateFolders.length).to.equal(0, 'Update Folder count doesnt match');
				expect(changes.removedFolders.length).to.equal(0, 'Removed Folders count doesnt match');
				expect(changes.removedArtists.length).to.equal(0, 'Removed Artists count doesnt match');
				expect(changes.removedAlbums.length).to.equal(0, 'Removed Album count doesnt match');
				expect(changes.updateAlbums.length).to.equal(mockRoot.expected.albums, 'Update Album count doesnt match');
				expect(changes.updateArtists.length).to.equal(mockRoot.expected.artists, 'Update Artist count doesnt match');

				await fse.ensureDir(mockRoot2.path);
				changes = await scanService.run(mockRoot2.path, mockRoot2.id);
				await fse.rmdir(mockRoot2.path);
				dir2.removeCallback();
				expect(changes.newTracks.length).to.equal(0, 'New Track count doesnt match');
				expect(changes.newFolders.length).to.equal(0, 'New Folder count doesnt match');
				expect(changes.newArtists.length).to.equal(0, 'New Artist count doesnt match');
				expect(changes.newAlbums.length).to.equal(0, 'New Album count doesnt match');
				expect(changes.updateTracks.length).to.equal(0, 'Update Track count doesnt match');
				expect(changes.removedTracks.length).to.equal(mockRoot.expected.tracks, 'Removed Tracks count doesnt match');
				expect(changes.updateFolders.length).to.equal(1, 'Update Folder count doesnt match');
				expect(changes.removedFolders.length).to.equal(mockRoot.expected.folders - 1, 'Removed Folders count doesnt match');
				expect(changes.removedArtists.length).to.equal(0, 'Removed Artists count doesnt match');
				expect(changes.removedAlbums.length).to.equal(0, 'Removed Album count doesnt match');
				expect(changes.updateAlbums.length).to.equal(mockRoot.expected.albums, 'Update Album count doesnt match');
				expect(changes.updateArtists.length).to.equal(mockRoot.expected.artists, 'Update Artist count doesnt match');
			});

			 **/

			it('should combine close enough artist names', async () => {
				const dir2 = tmp.dirSync();
				const rootDir = path.join(dir2.name, 'rootArtistNames');
				const mockRoot2 = {
					id: 'rootArtistNames',
					path: rootDir,
					name: 'rootArtistNames',
					folders: [
						{
							path: path.join(rootDir, 'run dmc'),
							name: 'run dmc',
							genre: '',
							folders: [
								{
									path: path.join(rootDir, 'run dmc', 'album 1'),
									name: 'album 1',
									genre: randomItem(Genres),
									folders: [],
									tracks: [
										{
											path: path.resolve(rootDir, 'run dmc', 'album 1', '1 - title 1 - Run Dmc.mp3'),
											artist: 'Run Dmc',
											album: 'album 1',
											number: 1,
											genre: randomItem(Genres)
										},
										{
											path: path.resolve(rootDir, 'run dmc', 'album 1', '2 - title 2 - Run DMC.mp3'),
											artist: 'Run DMC',
											album: 'album 1',
											number: 2,
											genre: randomItem(Genres)
										},
										{
											path: path.resolve(rootDir, 'run dmc', 'album 1', '3 - title 2 - Run D_M_C_.mp3'),
											artist: 'Run D.M.C.',
											album: 'album 1',
											number: 3,
											genre: randomItem(Genres)
										}
									],
									expected: {
										folderType: FolderType.album,
										albumType: AlbumType.album
									}
								}
							],
							tracks: [],
							expected: {
								folderType: FolderType.artist
							}
						}
					],
					tracks: [],
					expected: {
						folders: 3,
						tracks: 3,
						artists: 1,
						albums: 1,
						folderType: FolderType.multiartist
					}
				};
				await writeMockRoot(mockRoot2);
				const changes = await scanService.run(mockRoot2.path, mockRoot2.id);
				expect(changes.newTracks.length).to.equal(mockRoot2.expected.tracks, 'New Track count doesnt match');
				expect(changes.newFolders.length).to.equal(mockRoot2.expected.folders, 'New Folder count doesnt match');
				expect(changes.newArtists.length).to.equal(mockRoot2.expected.artists, 'New Artist count doesnt match');
				expect(changes.newAlbums.length).to.equal(mockRoot2.expected.albums, 'New Album count doesnt match');
				expect(changes.updateTracks.length).to.equal(0, 'Update Track count doesnt match');
				expect(changes.removedTracks.length).to.equal(0, 'Removed Tracks count doesnt match');
				expect(changes.updateFolders.length).to.equal(0, 'Update Folder count doesnt match');
				expect(changes.removedFolders.length).to.equal(0, 'Removed Folders count doesnt match');
				expect(changes.updateArtists.length).to.equal(0, 'Update Artist count doesnt match');
				expect(changes.removedArtists.length).to.equal(0, 'Removed Artists count doesnt match');
				expect(changes.updateAlbums.length).to.equal(0, 'Update Album count doesnt match');
				expect(changes.removedAlbums.length).to.equal(0, 'Removed Album count doesnt match');
				await removeMockRoot(mockRoot2);
				dir2.removeCallback();
			});
		},
		async () => {
			await removeMockRoot(mockRoot);
			await waveformServiceTest.cleanup();
			dir.removeCallback();
		}
	);

});
