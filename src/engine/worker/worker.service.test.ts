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
import {buildMockRoot, buildSeriesMockRoot, extendSpecMockRoot, MockFolder, MockRoot, MockSpecRoot, removeMockFolder, removeMockRoot, writeMockFolder, writeMockRoot} from '../store/store.mock';
import {Changes} from './changes/changes';
import {WorkerService} from './worker.service';

function logChange(name: string, amount: number): void {
	if (amount > 0) {
		console.log(name, amount);
	}
}

function logChanges(changes: Changes): void {
	const v = moment.utc(changes.end - changes.start).format('HH:mm:ss');
	console.log('Duration', v);
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
	logChange('Added Series', changes.newSeries.length);
	logChange('Updated Series', changes.updateSeries.length);
	logChange('Removed Series', changes.removedSeries.length);

}

export async function validateMock(mockFolder: MockFolder, store: Store): Promise<void> {
	const folder = await store.folderStore.searchOne({path: ensureTrailingPathSeparator(mockFolder.path)});
	expect(folder).toBeDefined();
	if (!folder) {
		return;
	}
	if (mockFolder.expected.folderType !== undefined) {
		expect(folder.tag.type, 'Folder type unexpected: ' + mockFolder.path).toBe(mockFolder.expected.folderType);
	}
	if (mockFolder.expected.albumType !== undefined) {
		expect(folder.tag.albumType, 'Album type unexpected: ' + mockFolder.path).toBe(mockFolder.expected.albumType);
	}
	for (const sub of mockFolder.folders) {
		await validateMock(sub, store);
	}
}

async function prepareMockRoot(mockRoot: MockRoot, workerService: WorkerService, store: Store): Promise<void> {
	await writeMockRoot(mockRoot);
	const changes = await workerService.refreshRoot({rootID: mockRoot.id, forceMetaRefresh: false});
	expect(changes.newTracks.length, 'New Track count doesnt match').toBe(mockRoot.expected.tracks);
	expect(changes.newFolders.length, 'New Folder count doesnt match').toBe(mockRoot.expected.folders);
	expect(changes.newArtists.length, 'New Artist count doesnt match').toBe(mockRoot.expected.artists);
	expect(changes.newAlbums.length, 'New Album count doesnt match').toBe(mockRoot.expected.albums);
	expect(changes.newSeries.length, 'New Series count doesnt match').toBe(mockRoot.expected.series);
	expect(changes.updateTracks.length, 'Update Track count doesnt match').toBe(0);
	expect(changes.removedTracks.length, 'Removed Tracks count doesnt match').toBe(0);
	expect(changes.updateFolders.length, 'Update Folder count doesnt match').toBe(0);
	expect(changes.removedFolders.length, 'Removed Folders count doesnt match').toBe(0);
	expect(changes.updateArtists.length, 'Update Artist count doesnt match').toBe(0);
	expect(changes.removedArtists.length, 'Removed Artists count doesnt match').toBe(0);
	expect(changes.updateAlbums.length, 'Update Album count doesnt match').toBe(0);
	expect(changes.removedAlbums.length, 'Removed Album count doesnt match').toBe(0);
	if (mockRoot.albums) {
		expect(changes.newAlbums.length, 'Album count doesnt match').toBe(mockRoot.albums.length);
		for (const album of mockRoot.albums) {
			const b = changes.newAlbums.find(a => a.name === album.name && a.artist === album.artist);
			expect(b, `Album not found ${album.name} - ${album.artist}`).toBeDefined();
			if (b) {
				expect(b.albumType, `Album Type doesnt match ${album.name} - ${album.artist}`).toBe(album.albumType);
			}
		}
	}
	await validateMock(mockRoot, store);
}

async function tearDownMockRoot(mockRoot: MockRoot, workerService: WorkerService, store: Store): Promise<void> {
	try {
		await removeMockRoot(mockRoot);
	} catch (e) {
		console.error(e);
	}
	await store.reset();
	await store.check();
}

async function checkChanges(changes: Changes, expected: {
	newTracks?: number;
	updateTracks?: number;
	removedTracks?: number;
	newFolders?: number;
	updateFolders?: number;
	removedFolders?: number;
	newArtists?: number;
	updateArtists?: number;
	removedArtists?: number;
	newAlbums?: number;
	updateAlbums?: number;
	removedAlbums?: number;
	newSeries?: number;
	updateSeries?: number;
	removedSeries?: number;
}): Promise<void> {
	expect(changes.newTracks.length, 'New Track count doesnt match').toBe(expected.newTracks || 0);
	expect(changes.updateTracks.length, 'Update Track count doesnt match').toBe(expected.updateTracks || 0);
	expect(changes.removedTracks.length, 'Removed Tracks count doesnt match').toBe(expected.removedTracks || 0);

	expect(changes.newArtists.length, 'New Artist count doesnt match').toBe(expected.newArtists || 0);
	expect(changes.updateArtists.length, 'Update Artist count doesnt match').toBe(expected.updateArtists || 0);
	expect(changes.removedArtists.length, 'Removed Artists count doesnt match').toBe(expected.removedArtists || 0);

	expect(changes.newAlbums.length, 'New Album count doesnt match').toBe(expected.newAlbums || 0);
	expect(changes.updateAlbums.length, 'Update Album count doesnt match').toBe(expected.updateAlbums || 0);
	expect(changes.removedAlbums.length, 'Removed Album count doesnt match').toBe(expected.removedAlbums || 0);

	expect(changes.newFolders.length, 'New Folder count doesnt match').toBe(expected.newFolders || 0);
	expect(changes.updateFolders.length, 'Update Folder count doesnt match').toBe(expected.updateFolders || 0);
	expect(changes.removedFolders.length, 'Removed Folders count doesnt match').toBe(expected.removedFolders || 0);

	expect(changes.newSeries.length, 'New Series count doesnt match').toBe(expected.newSeries || 0);
	expect(changes.updateSeries.length, 'Update Series count doesnt match').toBe(expected.updateSeries || 0);
	expect(changes.removedSeries.length, 'Removed Series count doesnt match').toBe(expected.removedSeries || 0);
}

describe('WorkerService', () => {
	let store: Store;
	let dir: tmp.DirResult;
	let mockRoot: MockRoot;
	let workerService: WorkerService;

	testService({mockData: false},
		async (storeTest, imageModuleTest, audioModuleTest) => {
			store = storeTest;
			workerService = new WorkerService(store, audioModuleTest.audioModule, imageModuleTest.imageModule);
		},
		() => {

			describe('RootScanStrategy.auto', () => {
				beforeEach(async () => {
					dir = tmp.dirSync();
					mockRoot = buildMockRoot(dir.name, 1, 'rootID1');
					mockRoot.id = await store.rootStore.add({id: '', path: mockRoot.path, type: DBObjectType.root, name: mockRoot.name, strategy: RootScanStrategy.auto, created: Date.now()});
					await prepareMockRoot(mockRoot, workerService, store);
				});
				afterEach(async () => {
					await tearDownMockRoot(mockRoot, workerService, store);
					dir.removeCallback();
				});
				it('should rescan', async () => {
					const changes = await workerService.refreshRoot({rootID: mockRoot.id, forceMetaRefresh: false});
					await checkChanges(changes, {});
					await validateMock(mockRoot, store);
				});
				it('should remove missing in the root', async () => {
					await removeMockRoot(mockRoot);
					await fse.ensureDir(mockRoot.path);
					const changes = await workerService.refreshRoot({rootID: mockRoot.id, forceMetaRefresh: false});
					await checkChanges(changes, {
						removedTracks: mockRoot.expected.tracks,
						updateFolders: 1,
						removedFolders: mockRoot.expected.folders - 1,
						removedArtists: mockRoot.expected.artists,
						removedAlbums: mockRoot.expected.albums,
						removedSeries: mockRoot.expected.series
					});
					expect(await store.folderStore.count()).toBe(1);
					expect(await store.trackStore.count()).toBe(0);
					expect(await store.albumStore.count()).toBe(0);
					expect(await store.artistStore.count()).toBe(0);
					expect(await store.seriesStore.count()).toBe(0);
					mockRoot.folders = [];
				});
				it('should scan added in the root', async () => {
					await removeMockRoot(mockRoot);
					await fse.ensureDir(mockRoot.path);
					await workerService.refreshRoot({rootID: mockRoot.id, forceMetaRefresh: false});
					await writeMockRoot(mockRoot);
					const changes = await workerService.refreshRoot({rootID: mockRoot.id, forceMetaRefresh: false});
					await checkChanges(changes, {
						newTracks: mockRoot.expected.tracks,
						updateFolders: 1,
						newFolders: mockRoot.expected.folders - 1,
						newArtists: mockRoot.expected.artists,
						newAlbums: mockRoot.expected.albums,
						newSeries: mockRoot.expected.series
					});
					await validateMock(mockRoot, store);
				});
				it('should combine/remove artists and albums from different roots', async () => {
					const dir2 = tmp.dirSync();
					const mockRoot2 = buildMockRoot(dir2.name, 2, 'rootID2');
					mockRoot2.id = await store.rootStore.add({id: '', path: mockRoot2.path, type: DBObjectType.root, name: mockRoot2.name, strategy: RootScanStrategy.auto, created: Date.now()});
					await writeMockRoot(mockRoot2);
					let changes = await workerService.refreshRoot({rootID: mockRoot2.id, forceMetaRefresh: false});
					await checkChanges(changes, {
						newTracks: mockRoot2.expected.tracks,
						newFolders: mockRoot2.expected.folders,
						updateSeries: mockRoot2.expected.series,
						updateAlbums: mockRoot2.expected.albums,
						updateArtists: mockRoot2.expected.artists
					});
					await validateMock(mockRoot2, store);
					await removeMockRoot(mockRoot2);

					await fse.ensureDir(mockRoot2.path);
					changes = await workerService.refreshRoot({rootID: mockRoot2.id, forceMetaRefresh: false});
					await fse.rmdir(mockRoot2.path);
					await checkChanges(changes, {
						removedTracks: mockRoot2.expected.tracks,
						updateFolders: 1,
						removedFolders: mockRoot2.expected.folders - 1,
						updateSeries: mockRoot2.expected.series,
						updateAlbums: mockRoot2.expected.albums,
						updateArtists: mockRoot2.expected.artists
					});
				});
				it('should combine close enough artist names', async () => {
					const dir2 = tmp.dirSync();
					const rootDir = path.join(dir2.name, 'rootArtistNames');
					const mockRootSpec2: MockSpecRoot = {
						id: 'rootArtistNames',
						name: 'rootArtistNames',
						folders: [
							{
								name: 'run dmc',
								genre: '',
								folders: [
									{
										name: 'album 1',
										genre: randomItem(Genres),
										folders: [],
										tracks: [
											{
												name: '1 - title 1 - Run Dmc.mp3',
												artist: 'Run Dmc',
												album: 'album 1',
												number: 1,
												genre: randomItem(Genres)
											},
											{
												name: '2 - title 2 - Run DMC.mp3',
												artist: 'Run DMC',
												album: 'album 1',
												number: 2,
												genre: randomItem(Genres)
											},
											{
												name: '3 - title 2 - Run D_M_C_.mp3',
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
							series: 0,
							artists: 1,
							albums: 1,
							folderType: FolderType.collection
						}
					};
					const mockRoot2 = extendSpecMockRoot(rootDir, mockRootSpec2);
					mockRoot2.id = await store.rootStore.add({id: '', path: mockRoot2.path, type: DBObjectType.root, name: mockRoot2.name, strategy: RootScanStrategy.auto, created: Date.now()});
					await writeMockRoot(mockRoot2);
					const changes = await workerService.refreshRoot({rootID: mockRoot2.id, forceMetaRefresh: false});
					await checkChanges(changes, {
						newTracks: mockRoot2.expected.tracks,
						newFolders: mockRoot2.expected.folders,
						newArtists: mockRoot2.expected.artists,
						newAlbums: mockRoot2.expected.albums
					});
					await validateMock(mockRoot2, store);
					await removeMockRoot(mockRoot2);
					dir2.removeCallback();
				});
				it('should update/remove artist/albums on changes', async () => {
					const dir2 = tmp.dirSync();
					const rootDir = path.join(dir2.name, 'rootChanges');
					const mockRootSpec2: MockSpecRoot = {
						id: 'rootChanges',
						name: 'rootChanges',
						folders: [
							{
								name: 'collection',
								genre: '',
								folders: [
									{
										name: 'album 1',
										genre: randomItem(Genres),
										folders: [],
										tracks: [
											{
												name: '1 - title 1 - artist A.mp3',
												artist: 'artist A',
												album: 'album 1',
												number: 1,
												genre: randomItem(Genres)
											},
											{
												name: '2 - title 2 - artist A.mp3',
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
										name: 'album 2',
										genre: randomItem(Genres),
										folders: [],
										tracks: [
											{
												name: '1 - title 1 - artist B.mp3',
												artist: 'artist B',
												album: 'album 2',
												number: 1,
												genre: randomItem(Genres)
											},
											{
												name: '2 - title 2 - artist B.mp3',
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
							series: 0,
							albums: 2,
							folderType: FolderType.collection
						}
					};
					const mockRoot2 = extendSpecMockRoot(rootDir, mockRootSpec2);
					mockRoot2.id = await store.rootStore.add({id: '', path: mockRoot2.path, type: DBObjectType.root, name: mockRoot2.name, strategy: RootScanStrategy.auto, created: Date.now()});
					await writeMockRoot(mockRoot2);
					let changes = await workerService.refreshRoot({rootID: mockRoot2.id, forceMetaRefresh: false});
					await checkChanges(changes, {
						newTracks: mockRoot2.expected.tracks,
						newFolders: mockRoot2.expected.folders,
						newArtists: mockRoot2.expected.artists,
						newAlbums: mockRoot2.expected.albums
					});
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
								name: '1 - title 1 - artist B.mp3',
								path: path.resolve(rootDir, 'collection', 'album 2', '1 - title 1 - artist B.mp3'),
								artist: 'artist A',
								album: 'album 2',
								number: 1,
								genre: randomItem(Genres)
							},
							{
								name: '2 - title 2 - artist B.mp3',
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
					await checkChanges(changes, {
						updateTracks: 2, // 2 Tracks must be updated
						updateFolders: 3, // Root & Album Folder & Artist Folder must be updated
						removedAlbums: 1, // (Album 2 by Artist B) must be removed
						newAlbums: 1, // (Album 2 by Artist A) must be added
						removedArtists: 1, 	// Artist B must be removed
						updateArtists: 1 // Artist A must be updated
					});
					await validateMock(mockRoot2, store);
					await removeMockRoot(mockRoot2);
					dir2.removeCallback();
				});
				it('should remove tracks on scan', async () => {
					const tracks = await store.trackStore.search({rootID: mockRoot.id});
					for (const track of tracks.items) {
						const changes = await workerService.removeTracks({rootID: mockRoot.id, trackIDs: [track.id]});
						expect(changes.removedTracks.length, 'Removed Tracks count doesnt match').toBe(1);
					}
					const album = await store.albumStore.search({rootID: mockRoot.id});
					expect(album.items.length, 'All albums should have been removed').toBe(0);
					const artists = await store.artistStore.search({rootID: mockRoot.id});
					expect(artists.items.length, 'All artists should have been removed').toBe(0);
					await writeMockRoot(mockRoot);
					const restorechanges = await workerService.refreshRoot({rootID: mockRoot.id, forceMetaRefresh: false});
					expect(restorechanges.newTracks.length, 'Restored Tracks count doesnt match').toBe(tracks.items.length);
				});
			});

			describe('RootScanStrategy.audiobook', () => {
				beforeEach(async () => {
					dir = tmp.dirSync();
					mockRoot = buildSeriesMockRoot(dir.name, 2, 'rootID2');
					mockRoot.id = await store.rootStore.add({id: '', path: mockRoot.path, type: DBObjectType.root, name: mockRoot.name, strategy: RootScanStrategy.audiobook, created: Date.now()});
					await prepareMockRoot(mockRoot, workerService, store);
				});
				afterEach(async () => {
					await tearDownMockRoot(mockRoot, workerService, store);
					dir.removeCallback();
				});
				it('should rescan', async () => {
					const changes = await workerService.refreshRoot({rootID: mockRoot.id, forceMetaRefresh: false});
					await checkChanges(changes, {});
					await validateMock(mockRoot, store);
				});
			});
		});
});
