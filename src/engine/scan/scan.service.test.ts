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
import {MergeChanges} from './scan.changes';
import {ScanService} from './scan.service';

function logChange(name: string, amount: number): void {
	if (amount > 0) {
		console.log(name, amount);
	}
}

function logChanges(changes: MergeChanges): void {
	const v = moment.utc(changes.end - changes.start).format('HH:mm:ss');
	console.log('Duration:', v);
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

async function validate(mockFolder: MockFolder, store: Store): Promise<void> {
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
		await validate(sub, store);
	}
}

describe('ScanService', () => {
	let store: Store;
	let dir: tmp.DirResult;
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
			mockRoot.id = await store.rootStore.add({id: '', path: mockRoot.path, type: DBObjectType.root, name: mockRoot.name, strategy: RootScanStrategy.auto, created: Date.now()});
		},
		() => {
			it('should scan', async () => {
				const changes = await scanService.scanRoot(mockRoot.id, false);
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
				await validate(mockRoot, store);
			});
			it('should rescan', async () => {
				const changes = await scanService.scanRoot(mockRoot.id, false);
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
				await validate(mockRoot, store);
			});
			it('should remove missing in the root', async () => {
				await removeMockRoot(mockRoot);
				await fse.ensureDir(mockRoot.path);
				const changes = await scanService.scanRoot(mockRoot.id, false);
				await fse.rmdir(mockRoot.path);
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
			});
			it('should scan added in the root', async () => {
				await writeMockRoot(mockRoot);
				const changes = await scanService.scanRoot(mockRoot.id, false);
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
				await validate(mockRoot, store);
			});
			it('should combine/remove artists and albums from different roots', async () => {
				const dir2 = tmp.dirSync();
				const mockRoot2 = buildMockRoot(dir2.name, 2, 'rootID2');
				mockRoot2.id = await store.rootStore.add({id: '', path: mockRoot2.path, type: DBObjectType.root, name: mockRoot2.name, strategy: RootScanStrategy.auto, created: Date.now()});
				await writeMockRoot(mockRoot2);
				let changes = await scanService.scanRoot(mockRoot2.id, false);
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
				await validate(mockRoot2, store);
				await removeMockRoot(mockRoot2);

				await fse.ensureDir(mockRoot2.path);
				changes = await scanService.scanRoot(mockRoot2.id, false);
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
				const changes = await scanService.scanRoot(mockRoot2.id, false);
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
				await validate(mockRoot2, store);
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
				let changes = await scanService.scanRoot(mockRoot2.id, false);
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
				await validate(mockRoot2, store);

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
				changes = await scanService.scanRoot(mockRoot2.id, false);
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
				await validate(mockRoot2, store);

				await removeMockRoot(mockRoot2);
				dir2.removeCallback();
			});
			it('should remove tracks', async () => {
				const tracks = await store.trackStore.search({rootID: mockRoot.id});
				for (const track of tracks.items) {
					const changes = await scanService.deleteTracks(mockRoot.id, [track.id]);
					expect(changes.removedTracks.length).toBe(1); // Removed Tracks count doesnt match');
				}
				const album = await store.albumStore.search({rootID: mockRoot.id});
				expect(album.items.length).toBe(0); // All albums should have been removed');
				const artists = await store.artistStore.search({rootID: mockRoot.id});
				expect(artists.items.length).toBe(0); // All artists should have been removed');
				await writeMockRoot(mockRoot);
				const restorechanges = await scanService.scanRoot(mockRoot.id, false);
				expect(restorechanges.newTracks.length).toBe(tracks.items.length); // Restored Tracks count doesnt match');
			});
			it('should remove folders', async () => {
				const folders = await store.folderStore.search({rootID: mockRoot.id});
				let folder = folders.items.find(f => f.tag.level === 0);
				if (!folder) {
					throw Error('Invalid Test Setup');
				}
				await expect(scanService.deleteFolders(mockRoot.id, [folder.id])).rejects.toThrow('Root folder can not be deleted');
				folder = folders.items.find(f => f.tag.type === FolderType.artist && f.tag.artist === 'artist 1');
				if (!folder) {
					throw Error('Invalid Test Setup');
				}
				const removedFolderCount = await store.folderStore.searchCount({inPath: folder.path});
				const removedAlbumCount = await store.albumStore.searchCount({artist: 'artist 1'});
				const changes = await scanService.deleteFolders(mockRoot.id, [folder.id]);
				expect(changes.newTracks.length).toBe(0); // New Track count doesnt match');
				expect(changes.updateTracks.length).toBe(0); // Update Track count doesnt match');
				expect(changes.removedTracks.length).toBe(10); // Removed Tracks count doesnt match');
				expect(changes.newFolders.length).toBe(0); // New Folder count doesnt match');
				expect(changes.updateFolders.length).toBe(1); // Update Folder count doesnt match');
				expect(changes.removedFolders.length).toBe(removedFolderCount); // Removed Folders count doesnt match');
				expect(changes.newArtists.length).toBe(0); // New Artist count doesnt match');
				expect(changes.updateArtists.length).toBe(0); // Update Artist count doesnt match');
				expect(changes.removedArtists.length).toBe(2); // Removed Artists count doesnt match');
				expect(changes.newAlbums.length).toBe(0); // New Album count doesnt match');
				expect(changes.updateAlbums.length).toBe(0); // Update Album count doesnt match');
				expect(changes.removedAlbums.length).toBe(removedAlbumCount); // Removed Album count doesnt match');
				await writeMockRoot(mockRoot);
				const restorechanges = await scanService.scanRoot(mockRoot.id, false);
				expect(restorechanges.newFolders.length).toBe(removedFolderCount); // Restored Folders count doesnt match');
				expect(restorechanges.newAlbums.length).toBe(removedAlbumCount); // Restored Folders count doesnt match');
			});
			it('should not move folders with invalid parameters', async () => {
				const rootFolder = await store.folderStore.searchOne({rootID: mockRoot.id, level: 0});
				if (!rootFolder) {
					throw Error('Invalid Test Setup');
				}
				await expect(scanService.moveFolders(mockRoot.id, rootFolder.id, [rootFolder.id])).rejects.toThrow('Folder cannot be moved to itself');
				const artistFolder = await store.folderStore.searchOne({rootID: mockRoot.id, types: [FolderType.artist], artist: 'artist 1'});
				if (!artistFolder) {
					throw Error('Invalid Test Setup');
				}
				await expect(scanService.moveFolders(mockRoot.id, rootFolder.id, [artistFolder.id])).rejects.toThrow('Folder is already in Destination');
				await expect(scanService.moveFolders(mockRoot.id, artistFolder.id, [rootFolder.id])).rejects.toThrow('Folder moving failed');
				await expect(scanService.moveFolders(mockRoot.id, artistFolder.id, [artistFolder.id])).rejects.toThrow('Folder cannot be moved to itself');
				const albumFolder = await store.folderStore.searchOne({rootID: mockRoot.id, types: [FolderType.album], artist: 'artist 2', album: 'album 1'});
				if (!albumFolder) {
					throw Error('Invalid Test Setup');
				}
				await expect(scanService.moveFolders(mockRoot.id, artistFolder.id, [albumFolder.id])).rejects.toThrow('Folder name already used in Destination');
			});
			it('should move folders', async () => {
				const rootFolder = await store.folderStore.searchOne({rootID: mockRoot.id, level: 0});
				if (!rootFolder) {
					throw Error('Invalid Test Setup');
				}
				const albumFolder = await store.folderStore.searchOne({rootID: mockRoot.id, types: [FolderType.multialbum], artist: 'artist 1', album: 'album 3', level: 2});
				if (!albumFolder) {
					throw Error('Invalid Test Setup');
				}
				const artistFolder = await store.folderStore.searchOne({rootID: mockRoot.id, types: [FolderType.artist], artist: 'artist 2'});
				if (!artistFolder) {
					throw Error('Invalid Test Setup');
				}
				const oldParentID = albumFolder.parentID;
				let changes = await scanService.moveFolders(mockRoot.id, artistFolder.id, [albumFolder.id]);
				expect(changes.newTracks.length).toBe(0); // New Track count doesnt match');
				expect(changes.updateTracks.length).toBe(0); // Update Track count doesnt match');
				expect(changes.removedTracks.length).toBe(0); // Removed Tracks count doesnt match');
				expect(changes.newFolders.length).toBe(0); // New Folder count doesnt match');
				// 3 = the multialbum, 1 the old parent, 1 the new parent
				expect(changes.updateFolders.length).toBe(3); // Update Folder count doesnt match');
				expect(changes.removedFolders.length).toBe(0); // Removed Folders count doesnt match');
				expect(changes.newArtists.length).toBe(0); // New Artist count doesnt match');
				expect(changes.updateArtists.length).toBe(0); // Update Artist count doesnt match');
				expect(changes.removedArtists.length).toBe(0); // Removed Artists count doesnt match');
				expect(changes.newAlbums.length).toBe(0); // New Album count doesnt match');
				expect(changes.updateAlbums.length).toBe(0); // Update Album count doesnt match');
				expect(changes.removedAlbums.length).toBe(0); // Removed Album count doesnt match');
				// move it back
				changes = await scanService.moveFolders(mockRoot.id, oldParentID, [albumFolder.id]);
				expect(changes.newTracks.length).toBe(0); // New Track count doesnt match');
				expect(changes.updateTracks.length).toBe(0); // Update Track count doesnt match');
				expect(changes.removedTracks.length).toBe(0); // Removed Tracks count doesnt match');
				expect(changes.newFolders.length).toBe(0); // New Folder count doesnt match');
				expect(changes.updateFolders.length).toBe(3); // Update Folder count doesnt match');
				expect(changes.removedFolders.length).toBe(0); // Removed Folders count doesnt match');
				expect(changes.newArtists.length).toBe(0); // New Artist count doesnt match');
				expect(changes.updateArtists.length).toBe(0); // Update Artist count doesnt match');
				expect(changes.removedArtists.length).toBe(0); // Removed Artists count doesnt match');
				expect(changes.newAlbums.length).toBe(0); // New Album count doesnt match');
				expect(changes.updateAlbums.length).toBe(0); // Update Album count doesnt match');
				expect(changes.removedAlbums.length).toBe(0); // Removed Album count doesnt match');
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
				await expect(scanService.moveTracks(mockRoot.id, trackIDs, albumFolder.id)).rejects.toThrow('File is already in folder');
				// fail: file names are used
				await expect(scanService.moveTracks(mockRoot.id, trackIDs, album2Folder.id)).rejects.toThrow('File name is already used in folder');

				let changes = await scanService.moveTracks(mockRoot.id, trackIDs, album3Folder.id);
				expect(changes.newTracks.length).toBe(0); // New Track count doesnt match');
				expect(changes.newFolders.length).toBe(0); // New Folder count doesnt match');
				expect(changes.newArtists.length).toBe(0); // New Artist count doesnt match');
				expect(changes.removedTracks.length).toBe(0); // Removed Tracks count doesnt match');
				expect(changes.removedFolders.length).toBe(0); // Removed Folders count doesnt match');
				expect(changes.removedArtists.length).toBe(0); // Removed Artists count doesnt match');
				expect(changes.updateAlbums.length).toBe(0); // Update Album count doesnt match');
				expect(changes.updateArtists.length).toBe(2); // Update Artist count doesnt match');
				// 3 the source, the dest & artist
				expect(changes.updateFolders.length).toBe(3); // Update Folder count doesnt match');
				expect(changes.updateTracks.length).toBe(trackIDs.length); // Update Track count doesnt match');
				expect(changes.newAlbums.length).toBe(1); // New Album count doesnt match');
				expect(changes.removedAlbums.length).toBe(1); // Removed Album count doesnt match');

				changes = await scanService.moveTracks(mockRoot.id, trackIDs, albumFolder.id);
				expect(changes.newTracks.length).toBe(0); // New Track count doesnt match');
				expect(changes.newFolders.length).toBe(0); // New Folder count doesnt match');
				expect(changes.newArtists.length).toBe(0); // New Artist count doesnt match');
				expect(changes.removedTracks.length).toBe(0); // Removed Tracks count doesnt match');
				expect(changes.removedFolders.length).toBe(0); // Removed Folders count doesnt match');
				expect(changes.removedArtists.length).toBe(0); // Removed Artists count doesnt match');
				expect(changes.updateAlbums.length).toBe(0); // Update Album count doesnt match');
				expect(changes.updateArtists.length).toBe(2); // Update Artist count doesnt match');
				// 3 the source, the dest & artist
				expect(changes.updateFolders.length).toBe(3); // Update Folder count doesnt match');
				expect(changes.updateTracks.length).toBe(trackIDs.length); // Update Track count doesnt match');
				expect(changes.newAlbums.length).toBe(1); // New Album count doesnt match');
				expect(changes.removedAlbums.length).toBe(1); // Removed Album count doesnt match');
				await validate(mockRoot, store);
			});

			describe('renameFolder', function testRenameFolder(): void {
				// this.timeout(40000);
				it('should do handle invalid parameters', async () => {
					const folder = await store.folderStore.random();
					if (!folder) {
						throw Error('Invalid Test Setup');
					}
					await expect(scanService.renameFolder(folder.rootID, folder.id, '')).rejects.toThrow('Invalid Directory Name');
					await expect(scanService.renameFolder(folder.rootID, folder.id, '.')).rejects.toThrow('Invalid Directory Name');
					await expect(scanService.renameFolder(folder.rootID, folder.id, '//..*\.')).rejects.toThrow('Invalid Directory Name');
					await expect(scanService.renameFolder(folder.rootID, folder.id, path.basename(folder.path))).rejects.toThrow('Directory does not exists');
					// await expect(scanService.renameFolder(folder.rootID, folder.id, path.basename(folder.path))).rejects.toThrow('Directory already exists');
				});
				it('should rename and update all folder & track paths', async () => {
					const folderIds = await store.folderStore.searchIDs({rootID: mockRoot.id});
					if (folderIds.length === 0) {
						throw Error('Invalid Test Setup');
					}
					for (const id of folderIds) {
						const folder = await store.folderStore.byId(id);
						expect(folder).toBeTruthy();
						if (!folder) {
							return;
						}
						const name = path.basename(folder.path);
						let changes = await scanService.renameFolder(folder.rootID, folder.id, name + '_renamed');
						const all = await store.folderStore.search({inPath: folder.path});
						for (const f of all.items) {
							expect(await fse.pathExists(f.path)).toBe(true); // path does not exist ' + f.path);
						}
						const tracks = await store.trackStore.search({inPath: folder.path});
						for (const t of tracks.items) {
							expect(await fse.pathExists(t.path + t.name)).toBe(true); // file does not exist ' + t.path + t.name);
						}
						changes = await scanService.renameFolder(folder.rootID, folder.id, name);
					}
				});

			});

			/*
		describe('setFolderImage', () => {
			it('should do handle invalid parameters', async () => {
				const folder = await folderService.folderStore.random();
				should().exist(folder, 'Wrong Test Setup');
				if (!folder) {
					return;
				}
				await expect(folderService.setFolderImage(folder, 'invalid-not-existent')).rejects.toThrow('error');
				await expect(folderService.setFolderImage(folder, '')).rejects.toThrow('error');
			});
			it('should set an image', async () => {
				const folder = await folderService.folderStore.random();
				should().exist(folder, 'Wrong Test Setup');
				if (!folder) {
					return;
				}
				folder.tag.image = undefined;
				const file = tmp.fileSync();
				await folderService.setFolderImage(folder, file.name);
				should().exist(folder.tag.image);
				const image = path.resolve(folder.path, folder.tag.image || 'invalid-not-existent');
				expect(await fse.pathExists(image)).toBe(true, 'folder image file does not exist ' + image);
				file.removeCallback();
				await fse.unlink(image);
				const updatedFolder = await folderService.folderStore.byId(folder.id);
				should().exist(updatedFolder);
				if (!updatedFolder) {
					return;
				}
				expect(updatedFolder.tag.image).toBe(folder.tag.image);
				folder.tag.image = undefined;
				await folderService.folderStore.upsert([folder]);
			});
		});

		describe('downloadFolderImage', () => {
			it('should do handle invalid parameters', async () => {
				const folder = await folderService.folderStore.random();
				should().exist(folder, 'Wrong Test Setup');
				if (!folder) {
					return;
				}
				// await expect(folderService.downloadFolderArtwork(folder, 'invalid', [ArtworkImageType.front])).rejects.toThrow('error');
				// await expect(folderService.downloadFolderArtwork(folder, 'http://invaliddomain.invaliddomain.invaliddomain/invalid', [ArtworkImageType.front])).rejects.toThrow('error');
				const scope = nock('http://invaliddomain.invaliddomain.invaliddomain')
					.get('/invalid.png').reply(404);
				await expect(folderService.downloadFolderArtwork(folder, 'http://invaliddomain.invaliddomain.invaliddomain/invalid.png', [ArtworkImageType.front])).rejects.toThrow('error');
				expect(scope.isDone()).toBe(true, 'no request has been made');
			});
			it('should download an image', async () => {
				const folder = await folderService.folderStore.random();
				should().exist(folder, 'Wrong Test Setup');
				if (!folder) {
					return;
				}
				const image = await mockImage('png');
				const scope = nock('http://invaliddomain.invaliddomain.invaliddomain')
					.get('/image.png').reply(200, image.buffer, {'Content-Type': image.mime});
				const artwork = await folderService.downloadFolderArtwork(folder, 'http://invaliddomain.invaliddomain.invaliddomain/image.png', [ArtworkImageType.front]);
				expect(scope.isDone()).toBe(true, 'no request has been made');
				const filename = path.resolve(folder.path, folder.tag.image || 'invalid-not-existent');
				expect(await fse.pathExists(filename)).toBe(true, 'folder image file does not exist ' + filename);
				await fse.unlink(filename);
				const updatedFolder = await folderService.folderStore.byId(folder.id);
				should().exist(updatedFolder);
				if (!updatedFolder) {
					return;
				}
				expect(updatedFolder.tag.image).toBe(folder.tag.image);
			});
		});
*/
			/*
				it('should deliver local images', async () => {
					const folder = await folderService.folderStore.random();
					should().exist(folder, 'Wrong Test Setup');
					if (!folder) {
						return;
					}
					const image = await mockImage('png');
					const filename = path.resolve(folder.path, 'dummy.png');
					await fse.writeFile(filename, image.buffer);
					await folderService.createArtworkImageFile(folder, [ArtworkImageType.front], filename, 'image/png');
					let res = await folderService.getFolderImage(folder);
					should().exist(res);
					if (res) {
						should().exist(res.file);
						if (res.file) {
							expect(res.file.filename).toBe(filename);
						}
					}
					res = await folderService.getFolderImage(folder, 100);
					should().exist(res);
					if (res) {
						should().exist(res.buffer);
					}
					for (const format of SupportedWriteImageFormat) {
						res = await folderService.getFolderImage(folder, 100, format);
						should().exist(res, 'image format ' + format + ' did not work');
						if (res) {
							expect(!!res.buffer || !!res.file).toBe(true);
							if (res.buffer) {
								const mime = mimeTypes.lookup(format);
								expect(res.buffer.contentType).toBe(mime);
							}
							if (res.file) {
								expect(path.extname(res.file.filename)).toBe('.' + format);
								expect(path.extname(res.file.name)).toBe('.' + format);
							}
						}
					}
					await fse.unlink(filename);
					await imageModuleTest.imageModule.clearImageCacheByID(folder.id);
				});
*/

		},
		async () => {
			await removeMockRoot(mockRoot);
			await waveformServiceTest.cleanup();
			dir.removeCallback();
		}
	);

});
