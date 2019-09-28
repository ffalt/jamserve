import fse from 'fs-extra';
import moment from 'moment';
import path from 'path';
import tmp from 'tmp';

import {DBObjectType} from '../../db/db.types';
import {AlbumType, FolderType, RootScanStrategy} from '../../model/jam-types';
import {ensureTrailingPathSeparator} from '../../utils/fs-utils';
import {Genres} from '../../utils/genres';
import {randomItem} from '../../utils/random';
import {testService} from '../base/base.service.spec';
import {Store} from '../store/store';
import {buildMockRoot, MockFolder, MockRoot, removeMockFolder, removeMockRoot, writeMockFolder, writeMockRoot} from '../store/store.mock';
import {WaveformServiceTest} from '../waveform/waveform.service.spec';
import {Changes} from './changes/changes';
import {WorkerService} from './worker.service';

function logChange(name: string, amount: number): void {
	if (amount > 0) {
		console.log(name, amount);
	}
}

function logChanges(changes: Changes): void {
	const v = moment.utc(changes.end - changes.start).format('HH:mm:ss');
	logChange('Added Tracks', changes.newTracks.length);
	logChange('Updated Tracks', changes.updateTracks.length);
	logChange('Removed Tracks', changes.removedTracks.length);
	logChange('Added Folders', changes.newFolders.length);
	logChange('Updated Folders', changes.updateFolders.length);
	logChange('Removed Folders', changes.removedFolders.length);
	logChange('Added Artists', changes.newArtists.length);
	if (changes.newArtists.length) {
		console.log(changes.newArtists.map(a => JSON.stringify(a)).join('\n'));
	}
	logChange('Updated Artists', changes.updateArtists.length);
	if (changes.updateArtists.length) {
		console.log(changes.updateArtists.map(a => JSON.stringify(a)).join('\n'));
	}
	logChange('Removed Artists', changes.removedArtists.length);
	if (changes.removedArtists.length) {
		console.log(changes.removedArtists.map(a => JSON.stringify(a)).join('\n'));
	}
	logChange('Added Albums', changes.newAlbums.length);
	if (changes.newAlbums.length) {
		console.log(changes.newAlbums.map(a => JSON.stringify(a)).join('\n'));
	}
	logChange('Updated Albums', changes.updateAlbums.length);
	logChange('Removed Albums', changes.removedAlbums.length);
}

export async function validateMock(mockFolder: MockFolder, store: Store): Promise<void> {
	const folder = await store.folderStore.searchOne({path: ensureTrailingPathSeparator(mockFolder.path)});
	expect(folder).toBeTruthy();
	if (!folder) {
		return;
	}
	if (mockFolder.expected.folderType !== undefined) {
		expect(folder.tag.type).toBe(mockFolder.expected.folderType); // , 'Folder type unexpected: ' + mockFolder.path);
	}
	if (mockFolder.expected.albumType !== undefined) {
		expect(folder.tag.albumType).toBe(mockFolder.expected.albumType); // , 'Album type unexpected: ' + mockFolder.path);
	}
	for (const sub of mockFolder.folders) {
		await validateMock(sub, store);
	}
}

describe('WorkerService', () => {
	let store: Store;
	let dir: tmp.DirResult;
	let mockRoot: MockRoot;
	let workerService: WorkerService;
	const waveformServiceTest = new WaveformServiceTest();

	testService({mockData: false},
		async (storeTest, imageModuleTest, audioModule) => {
			store = storeTest;
			await waveformServiceTest.setup();
			workerService = new WorkerService(store, audioModule, imageModuleTest.imageModule, waveformServiceTest.waveformService);
		},
		() => {
			beforeEach(async () => {
				dir = tmp.dirSync();
				mockRoot = buildMockRoot(dir.name, 1, 'rootID1');
				await writeMockRoot(mockRoot);
				mockRoot.id = await store.rootStore.add({id: '', path: mockRoot.path, type: DBObjectType.root, name: mockRoot.name, strategy: RootScanStrategy.auto, created: Date.now()});
				const changes = await workerService.refreshRoot({rootID: mockRoot.id, forceMetaRefresh: false});
				expect(changes.newTracks.length).toBe(mockRoot.expected.tracks); // , 'New Track count doesnt match');
				expect(changes.newFolders.length).toBe(mockRoot.expected.folders); // , 'New Folder count doesnt match');
				expect(changes.newArtists.length).toBe(mockRoot.expected.artists); // , 'New Artist count doesnt match');
				expect(changes.newAlbums.length).toBe(mockRoot.expected.albums); // , 'New Album count doesnt match');
				expect(changes.updateTracks.length).toBe(0); // , 'Update Track count doesnt match');
				expect(changes.removedTracks.length).toBe(0); // Removed Tracks count doesnt match');
				expect(changes.updateFolders.length).toBe(0); // Update Folder count doesnt match');
				expect(changes.removedFolders.length).toBe(0); // Removed Folders count doesnt match');
				expect(changes.updateArtists.length).toBe(0); // Update Artist count doesnt match');
				expect(changes.removedArtists.length).toBe(0); // Removed Artists count doesnt match');
				expect(changes.updateAlbums.length).toBe(0); // Update Album count doesnt match');
				expect(changes.removedAlbums.length).toBe(0); // Removed Album count doesnt match');
				await validateMock(mockRoot, store);
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

			describe('scan', () => {
				it('should rescan', async () => {
					const changes = await workerService.refreshRoot({rootID: mockRoot.id, forceMetaRefresh: false});
					expect(changes.newTracks.length).toBe(0); // New Track count doesnt match');
					expect(changes.updateTracks.length).toBe(0); // Update Track count doesnt match');
					expect(changes.removedTracks.length).toBe(0); // Removed Tracks count doesnt match');
					expect(changes.newFolders.length).toBe(0); // New Folder count doesnt match');
					expect(changes.updateFolders.length).toBe(0); // Update Folder count doesnt match');
					expect(changes.removedFolders.length).toBe(0); // Removed Folders count doesnt match');
					expect(changes.newArtists.length).toBe(0); // New Artist count doesnt match');
					expect(changes.updateArtists.length).toBe(0); // Update Artist count doesnt match');
					expect(changes.removedArtists.length).toBe(0); // Removed Artists count doesnt match');
					expect(changes.newAlbums.length).toBe(0); // New Album count doesnt match');
					expect(changes.updateAlbums.length).toBe(0); // Update Album count doesnt match');
					expect(changes.removedAlbums.length).toBe(0); // Removed Album count doesnt match');
					await validateMock(mockRoot, store);
				});
				it('should remove missing in the root', async () => {
					await removeMockRoot(mockRoot);
					await fse.ensureDir(mockRoot.path);
					const changes = await workerService.refreshRoot({rootID: mockRoot.id, forceMetaRefresh: false});
					expect(changes.newTracks.length).toBe(0); // New Track count doesnt match');
					expect(changes.updateTracks.length).toBe(0); // Update Track count doesnt match');
					expect(changes.removedTracks.length).toBe(mockRoot.expected.tracks); // Removed Tracks count doesnt match');
					expect(changes.newFolders.length).toBe(0); // New Folder count doesnt match');
					expect(changes.updateFolders.length).toBe(1); // Update Folder count doesnt match');
					expect(changes.removedFolders.length).toBe(mockRoot.expected.folders - 1); // Removed Folders count doesnt match');
					expect(changes.newArtists.length).toBe(0); // New Artist count doesnt match');
					expect(changes.updateArtists.length).toBe(0); // Update Artist count doesnt match');
					expect(changes.removedArtists.length).toBe(mockRoot.expected.artists); // Removed Artists count doesnt match');
					expect(changes.newAlbums.length).toBe(0); // New Album count doesnt match');
					expect(changes.updateAlbums.length).toBe(0); // Update Album count doesnt match');
					expect(changes.removedAlbums.length).toBe(mockRoot.expected.albums); // Removed Album count doesnt match');
					expect(await store.folderStore.count()).toBe(1);
					expect(await store.trackStore.count()).toBe(0);
					expect(await store.albumStore.count()).toBe(0);
					expect(await store.artistStore.count()).toBe(0);
					mockRoot.folders = [];
				});
				it('should scan added in the root', async () => {
					await removeMockRoot(mockRoot);
					await fse.ensureDir(mockRoot.path);
					await workerService.refreshRoot({rootID: mockRoot.id, forceMetaRefresh: false});
					await writeMockRoot(mockRoot);
					const changes = await workerService.refreshRoot({rootID: mockRoot.id, forceMetaRefresh: false});
					expect(changes.newTracks.length).toBe(mockRoot.expected.tracks); // New Track count doesnt match');
					expect(changes.updateFolders.length).toBe(1); // Update Folder count doesnt match');
					expect(changes.newFolders.length).toBe(mockRoot.expected.folders - 1); // New Folder count doesnt match');
					expect(changes.newArtists.length).toBe(mockRoot.expected.artists); // New Artist count doesnt match');
					expect(changes.newAlbums.length).toBe(mockRoot.expected.albums); // New Album count doesnt match');
					expect(changes.updateTracks.length).toBe(0); // Update Track count doesnt match');
					expect(changes.removedTracks.length).toBe(0); // Removed Tracks count doesnt match');
					expect(changes.removedFolders.length).toBe(0); // Removed Folders count doesnt match');
					expect(changes.updateArtists.length).toBe(0); // Update Artist count doesnt match');
					expect(changes.removedArtists.length).toBe(0); // Removed Artists count doesnt match');
					expect(changes.updateAlbums.length).toBe(0); // Update Album count doesnt match');
					expect(changes.removedAlbums.length).toBe(0); // Removed Album count doesnt match');
					await validateMock(mockRoot, store);
				});
				it('should combine/remove artists and albums from different roots', async () => {
					const dir2 = tmp.dirSync();
					const mockRoot2 = buildMockRoot(dir2.name, 2, 'rootID2');
					mockRoot2.id = await store.rootStore.add({id: '', path: mockRoot2.path, type: DBObjectType.root, name: mockRoot2.name, strategy: RootScanStrategy.auto, created: Date.now()});
					await writeMockRoot(mockRoot2);
					let changes = await workerService.refreshRoot({rootID: mockRoot2.id, forceMetaRefresh: false});
					expect(changes.newTracks.length).toBe(mockRoot.expected.tracks); // New Track count doesnt match');
					expect(changes.newFolders.length).toBe(mockRoot.expected.folders); // New Folder count doesnt match');
					expect(changes.newArtists.length).toBe(0); // New Artist count doesnt match');
					expect(changes.newAlbums.length).toBe(0); // New Album count doesnt match');
					expect(changes.updateTracks.length).toBe(0); // Update Track count doesnt match');
					expect(changes.removedTracks.length).toBe(0); // Removed Tracks count doesnt match');
					expect(changes.updateFolders.length).toBe(0); // Update Folder count doesnt match');
					expect(changes.removedFolders.length).toBe(0); // Removed Folders count doesnt match');
					expect(changes.removedArtists.length).toBe(0); // Removed Artists count doesnt match');
					expect(changes.removedAlbums.length).toBe(0); // Removed Album count doesnt match');
					expect(changes.updateAlbums.length).toBe(mockRoot.expected.albums); // Update Album count doesnt match');
					expect(changes.updateArtists.length).toBe(mockRoot.expected.artists); // Update Artist count doesnt match');
					await validateMock(mockRoot2, store);
					await removeMockRoot(mockRoot2);

					await fse.ensureDir(mockRoot2.path);
					changes = await workerService.refreshRoot({rootID: mockRoot2.id, forceMetaRefresh: false});
					await fse.rmdir(mockRoot2.path);
					expect(changes.newTracks.length).toBe(0); // New Track count doesnt match');
					expect(changes.newFolders.length).toBe(0); // New Folder count doesnt match');
					expect(changes.newArtists.length).toBe(0); // New Artist count doesnt match');
					expect(changes.newAlbums.length).toBe(0); // New Album count doesnt match');
					expect(changes.updateTracks.length).toBe(0); // Update Track count doesnt match');
					expect(changes.removedTracks.length).toBe(mockRoot2.expected.tracks); // Removed Tracks count doesnt match');
					expect(changes.updateFolders.length).toBe(1); // Update Folder count doesnt match');
					expect(changes.removedFolders.length).toBe(mockRoot2.expected.folders - 1); // Removed Folders count doesnt match');
					expect(changes.removedArtists.length).toBe(0); // Removed Artists count doesnt match');
					expect(changes.removedAlbums.length).toBe(0); // Removed Album count doesnt match');
					expect(changes.updateAlbums.length).toBe(mockRoot2.expected.albums); // Update Album count doesnt match');
					expect(changes.updateArtists.length).toBe(mockRoot2.expected.artists); // Update Artist count doesnt match');
				});
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
							folderType: FolderType.collection
						}
					};
					mockRoot2.id = await store.rootStore.add({id: '', path: mockRoot2.path, type: DBObjectType.root, name: mockRoot2.name, strategy: RootScanStrategy.auto, created: Date.now()});
					await writeMockRoot(mockRoot2);
					const changes = await workerService.refreshRoot({rootID: mockRoot2.id, forceMetaRefresh: false});
					expect(changes.newTracks.length).toBe(mockRoot2.expected.tracks); // New Track count doesnt match');
					expect(changes.newFolders.length).toBe(mockRoot2.expected.folders); // New Folder count doesnt match');
					expect(changes.newArtists.length).toBe(mockRoot2.expected.artists); // New Artist count doesnt match');
					expect(changes.newAlbums.length).toBe(mockRoot2.expected.albums); // New Album count doesnt match');
					expect(changes.updateTracks.length).toBe(0); // Update Track count doesnt match');
					expect(changes.removedTracks.length).toBe(0); // Removed Tracks count doesnt match');
					expect(changes.updateFolders.length).toBe(0); // Update Folder count doesnt match');
					expect(changes.removedFolders.length).toBe(0); // Removed Folders count doesnt match');
					expect(changes.updateArtists.length).toBe(0); // Update Artist count doesnt match');
					expect(changes.removedArtists.length).toBe(0); // Removed Artists count doesnt match');
					expect(changes.updateAlbums.length).toBe(0); // Update Album count doesnt match');
					expect(changes.removedAlbums.length).toBe(0); // Removed Album count doesnt match');
					await validateMock(mockRoot2, store);
					await removeMockRoot(mockRoot2);
					dir2.removeCallback();
				});
				it('should update/remove artist/albums on changes', async () => {
					const dir2 = tmp.dirSync();
					const rootDir = path.join(dir2.name, 'rootChanges');
					const mockRoot2 = {
						id: 'rootChanges',
						path: rootDir,
						name: 'rootChanges',
						folders: [
							{
								path: path.join(rootDir, 'collection'),
								name: 'collection',
								genre: '',
								folders: [
									{
										path: path.join(rootDir, 'collection', 'album 1'),
										name: 'album 1',
										genre: randomItem(Genres),
										folders: [],
										tracks: [
											{
												path: path.resolve(rootDir, 'collection', 'album 1', '1 - title 1 - artist A.mp3'),
												artist: 'artist A',
												album: 'album 1',
												number: 1,
												genre: randomItem(Genres)
											},
											{
												path: path.resolve(rootDir, 'collection', 'album 1', '2 - title 2 - artist A.mp3'),
												artist: 'artist A',
												album: 'album 1',
												number: 2,
												genre: randomItem(Genres)
											}
										],
										expected: {
											folderType: FolderType.album,
											albumType: AlbumType.album
										}
									},
									{
										path: path.join(rootDir, 'collection', 'album 2'),
										name: 'album 2',
										genre: randomItem(Genres),
										folders: [],
										tracks: [
											{
												path: path.resolve(rootDir, 'collection', 'album 2', '1 - title 1 - artist B.mp3'),
												artist: 'artist B',
												album: 'album 2',
												number: 1,
												genre: randomItem(Genres)
											},
											{
												path: path.resolve(rootDir, 'collection', 'album 2', '2 - title 2 - artist B.mp3'),
												artist: 'artist B',
												album: 'album 2',
												number: 2,
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
									folderType: FolderType.collection
								}
							}
						],
						tracks: [],
						expected: {
							folders: 4,
							tracks: 4,
							artists: 2,
							albums: 2,
							folderType: FolderType.collection
						}
					};
					await writeMockRoot(mockRoot2);
					mockRoot2.id = await store.rootStore.add({id: '', path: mockRoot2.path, type: DBObjectType.root, name: mockRoot2.name, strategy: RootScanStrategy.auto, created: Date.now()});
					let changes = await workerService.refreshRoot({rootID: mockRoot2.id, forceMetaRefresh: false});
					expect(changes.newTracks.length).toBe(mockRoot2.expected.tracks); // New Track count doesnt match');
					expect(changes.newFolders.length).toBe(mockRoot2.expected.folders); // New Folder count doesnt match');
					expect(changes.newArtists.length).toBe(mockRoot2.expected.artists); // New Artist count doesnt match');
					expect(changes.newAlbums.length).toBe(mockRoot2.expected.albums); // New Album count doesnt match');
					expect(changes.updateTracks.length).toBe(0); // Update Track count doesnt match');
					expect(changes.removedTracks.length).toBe(0); // Removed Tracks count doesnt match');
					expect(changes.updateFolders.length).toBe(0); // Update Folder count doesnt match');
					expect(changes.removedFolders.length).toBe(0); // Removed Folders count doesnt match');
					expect(changes.updateArtists.length).toBe(0); // Update Artist count doesnt match');
					expect(changes.removedArtists.length).toBe(0); // Removed Artists count doesnt match');
					expect(changes.updateAlbums.length).toBe(0); // Update Album count doesnt match');
					expect(changes.removedAlbums.length).toBe(0); // Removed Album count doesnt match');
					await validateMock(mockRoot2, store);

					await removeMockFolder(mockRoot2.folders[0].folders[1]);
					// now, update Artist B to Artist A
					mockRoot2.folders[0].folders[1] = {
						path: path.join(rootDir, 'collection', 'album 2'),
						name: 'album 2',
						genre: randomItem(Genres),
						folders: [],
						tracks: [
							{
								path: path.resolve(rootDir, 'collection', 'album 2', '1 - title 1 - artist B.mp3'),
								artist: 'artist A',
								album: 'album 2',
								number: 1,
								genre: randomItem(Genres)
							},
							{
								path: path.resolve(rootDir, 'collection', 'album 2', '2 - title 2 - artist B.mp3'),
								artist: 'artist A',
								album: 'album 2',
								number: 2,
								genre: randomItem(Genres)
							}
						],
						expected: {
							folderType: FolderType.album,
							albumType: AlbumType.album
						}
					};
					mockRoot2.folders[0].expected.folderType = FolderType.artist;
					await writeMockFolder(mockRoot2.folders[0].folders[1]);

					// rescan and expect:
					// (Artist B) and (Album 2 by Artist B) must be removed
					changes = await workerService.refreshRoot({rootID: mockRoot2.id, forceMetaRefresh: false});
					expect(changes.newTracks.length).toBe(0); // New Track count doesnt match');
					expect(changes.newFolders.length).toBe(0); // New Folder count doesnt match');
					expect(changes.newArtists.length).toBe(0); // New Artist count doesnt match');
					expect(changes.removedTracks.length).toBe(0); // Removed Tracks count doesnt match');
					expect(changes.removedFolders.length).toBe(0); // Removed Folders count doesnt match');
					expect(changes.updateAlbums.length).toBe(0); // Update Album count doesnt match');
					// 2 Tracks must be updated
					expect(changes.updateTracks.length).toBe(2); // Update Track count doesnt match');
					// Album Folder & Artist Folder must be updated
					expect(changes.updateFolders.length).toBe(2); // Update Folder count doesnt match');
					// (Album 2 by Artist B) must be removed
					expect(changes.removedAlbums.length).toBe(1); // Removed Album count doesnt match');
					// (Album 2 by Artist A) must be added
					expect(changes.newAlbums.length).toBe(1); // New Album count doesnt match');
					// Artist B must be removed
					expect(changes.removedArtists.length).toBe(1); // Removed Artists count doesnt match');
					// Artist A must be updated
					expect(changes.updateArtists.length).toBe(1); // Update Artist count doesnt match');
					await validateMock(mockRoot2, store);

					await removeMockRoot(mockRoot2);
					dir2.removeCallback();
				});
				it('should remove tracks on scan', async () => {
					const tracks = await store.trackStore.search({rootID: mockRoot.id});
					for (const track of tracks.items) {
						const changes = await workerService.removeTracks({rootID: mockRoot.id, trackIDs: [track.id]});
						expect(changes.removedTracks.length).toBe(1); // Removed Tracks count doesnt match');
					}
					const album = await store.albumStore.search({rootID: mockRoot.id});
					expect(album.items.length).toBe(0); // All albums should have been removed');
					const artists = await store.artistStore.search({rootID: mockRoot.id});
					expect(artists.items.length).toBe(0); // All artists should have been removed');
					await writeMockRoot(mockRoot);
					const restorechanges = await workerService.refreshRoot({rootID: mockRoot.id, forceMetaRefresh: false});
					expect(restorechanges.newTracks.length).toBe(tracks.items.length); // Restored Tracks count doesnt match');
				});
			});
		},
		async () => {
			await waveformServiceTest.cleanup();
		}
	);

});
