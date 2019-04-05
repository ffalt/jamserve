import {expect, should} from 'chai';
import {after, before, beforeEach, describe, it} from 'mocha';
import {testService} from '../../objects/base/base.service.spec';
import {Store} from '../store/store';
import tmp from 'tmp';
import {buildMockRoot, MockFolder, MockRoot, removeMockFolder, removeMockRoot, writeMockFolder, writeMockRoot} from '../store/store.mock';
import moment from 'moment';
import {ScanService} from './scan.service';
import {WaveformServiceTest} from '../waveform/waveform.service.spec';
import path from 'path';
import {randomItem} from '../../utils/random';
import {Genres} from '../../utils/genres';
import {AlbumType, FolderType, RootScanStrategy} from '../../model/jam-types';
import {ensureTrailingPathSeparator} from '../../utils/fs-utils';
import fse from 'fs-extra';
import {MergeChanges} from './scan.changes';
import {DBObjectType} from '../../db/db.types';

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


async function validate(mockFolder: MockFolder, store: Store) {
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
				await validate(mockRoot, store);
			});
			it('should rescan', async () => {
				const changes = await scanService.scanRoot(mockRoot.id, false);
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
				await validate(mockRoot, store);
			});
			it('should remove missing in the root', async () => {
				await removeMockRoot(mockRoot);
				await fse.ensureDir(mockRoot.path);
				const changes = await scanService.scanRoot(mockRoot.id, false);
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
				const changes = await scanService.scanRoot(mockRoot.id, false);
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
				await validate(mockRoot, store);
			});
			it('should combine/remove artists and albums from different roots', async () => {
				const dir2 = tmp.dirSync();
				const mockRoot2 = buildMockRoot(dir2.name, 2, 'rootID2');
				mockRoot2.id = await store.rootStore.add({id: '', path: mockRoot2.path, type: DBObjectType.root, name: mockRoot2.name, strategy: RootScanStrategy.auto, created: Date.now()});
				await writeMockRoot(mockRoot2);
				let changes = await scanService.scanRoot(mockRoot2.id, false);
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
				await validate(mockRoot2, store);
				await removeMockRoot(mockRoot2);

				await fse.ensureDir(mockRoot2.path);
				changes = await scanService.scanRoot(mockRoot2.id, false);
				await fse.rmdir(mockRoot2.path);
				expect(changes.newTracks.length).to.equal(0, 'New Track count doesnt match');
				expect(changes.newFolders.length).to.equal(0, 'New Folder count doesnt match');
				expect(changes.newArtists.length).to.equal(0, 'New Artist count doesnt match');
				expect(changes.newAlbums.length).to.equal(0, 'New Album count doesnt match');
				expect(changes.updateTracks.length).to.equal(0, 'Update Track count doesnt match');
				expect(changes.removedTracks.length).to.equal(mockRoot2.expected.tracks, 'Removed Tracks count doesnt match');
				expect(changes.updateFolders.length).to.equal(1, 'Update Folder count doesnt match');
				expect(changes.removedFolders.length).to.equal(mockRoot2.expected.folders - 1, 'Removed Folders count doesnt match');
				expect(changes.removedArtists.length).to.equal(0, 'Removed Artists count doesnt match');
				expect(changes.removedAlbums.length).to.equal(0, 'Removed Album count doesnt match');
				expect(changes.updateAlbums.length).to.equal(mockRoot2.expected.albums, 'Update Album count doesnt match');
				expect(changes.updateArtists.length).to.equal(mockRoot2.expected.artists, 'Update Artist count doesnt match');
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
				expect(changes.newTracks.length).to.equal(0, 'New Track count doesnt match');
				expect(changes.newFolders.length).to.equal(0, 'New Folder count doesnt match');
				expect(changes.newArtists.length).to.equal(0, 'New Artist count doesnt match');
				expect(changes.removedTracks.length).to.equal(0, 'Removed Tracks count doesnt match');
				expect(changes.removedFolders.length).to.equal(0, 'Removed Folders count doesnt match');
				expect(changes.updateAlbums.length).to.equal(0, 'Update Album count doesnt match');
				// 2 Tracks must be updated
				expect(changes.updateTracks.length).to.equal(2, 'Update Track count doesnt match');
				// Album Folder & Artist Folder must be updated
				expect(changes.updateFolders.length).to.equal(2, 'Update Folder count doesnt match');
				// (Album 2 by Artist B) must be removed
				expect(changes.removedAlbums.length).to.equal(1, 'Removed Album count doesnt match');
				// (Album 2 by Artist A) must be added
				expect(changes.newAlbums.length).to.equal(1, 'New Album count doesnt match');
				// Artist B must be removed
				expect(changes.removedArtists.length).to.equal(1, 'Removed Artists count doesnt match');
				// Artist A must be updated
				expect(changes.updateArtists.length).to.equal(1, 'Update Artist count doesnt match');
				await validate(mockRoot2, store);

				await removeMockRoot(mockRoot2);
				dir2.removeCallback();
			});
			it('should remove tracks', async () => {
				const tracks = await store.trackStore.search({rootID: mockRoot.id});
				for (const track of tracks) {
					const changes = await scanService.deleteTracks(mockRoot.id, [track.id]);
					expect(changes.removedTracks.length).to.equal(1, 'Removed Tracks count doesnt match');
				}
				const album = await store.albumStore.search({rootID: mockRoot.id});
				expect(album.length).to.equal(0, 'All albums should have been removed');
				const artists = await store.artistStore.search({rootID: mockRoot.id});
				expect(artists.length).to.equal(0, 'All artists should have been removed');
				await writeMockRoot(mockRoot);
				const restorechanges = await scanService.scanRoot(mockRoot.id, false);
				expect(restorechanges.newTracks.length).to.equal(tracks.length, 'Restored Tracks count doesnt match');
			});
			it('should remove folders', async () => {
				const folders = await store.folderStore.search({rootID: mockRoot.id});
				let folder = folders.find(f => f.tag.level === 0);
				if (!folder) {
					throw Error('Invalid Test Setup');
				}
				await scanService.deleteFolders(mockRoot.id, [folder.id]).should.eventually.be.rejectedWith(Error);
				folder = folders.find(f => f.tag.type === FolderType.artist && f.tag.artist === 'artist 1');
				if (!folder) {
					throw Error('Invalid Test Setup');
				}
				const removedFolderCount = await store.folderStore.searchCount({inPath: folder.path});
				const removedAlbumCount = await store.albumStore.searchCount({artist: 'artist 1'});
				const changes = await scanService.deleteFolders(mockRoot.id, [folder.id]);
				expect(changes.newTracks.length).to.equal(0, 'New Track count doesnt match');
				expect(changes.updateTracks.length).to.equal(0, 'Update Track count doesnt match');
				expect(changes.removedTracks.length).to.equal(10, 'Removed Tracks count doesnt match');
				expect(changes.newFolders.length).to.equal(0, 'New Folder count doesnt match');
				expect(changes.updateFolders.length).to.equal(1, 'Update Folder count doesnt match');
				expect(changes.removedFolders.length).to.equal(removedFolderCount, 'Removed Folders count doesnt match');
				expect(changes.newArtists.length).to.equal(0, 'New Artist count doesnt match');
				expect(changes.updateArtists.length).to.equal(0, 'Update Artist count doesnt match');
				expect(changes.removedArtists.length).to.equal(2, 'Removed Artists count doesnt match');
				expect(changes.newAlbums.length).to.equal(0, 'New Album count doesnt match');
				expect(changes.updateAlbums.length).to.equal(0, 'Update Album count doesnt match');
				expect(changes.removedAlbums.length).to.equal(removedAlbumCount, 'Removed Album count doesnt match');
				await writeMockRoot(mockRoot);
				const restorechanges = await scanService.scanRoot(mockRoot.id, false);
				expect(restorechanges.newFolders.length).to.equal(removedFolderCount, 'Restored Folders count doesnt match');
				expect(restorechanges.newAlbums.length).to.equal(removedAlbumCount, 'Restored Folders count doesnt match');
			});
			it('should not move folders with invalid parameters', async () => {
				const rootFolder = await store.folderStore.searchOne({rootID: mockRoot.id, level: 0});
				if (!rootFolder) {
					throw Error('Invalid Test Setup');
				}
				await scanService.moveFolders(mockRoot.id, rootFolder.id, [rootFolder.id]).should.eventually.be.rejectedWith(Error);
				const artistFolder = await store.folderStore.searchOne({rootID: mockRoot.id, types: [FolderType.artist], artist: 'artist 1'});
				if (!artistFolder) {
					throw Error('Invalid Test Setup');
				}
				await scanService.moveFolders(mockRoot.id, rootFolder.id, [artistFolder.id]).should.eventually.be.rejectedWith(Error);
				await scanService.moveFolders(mockRoot.id, artistFolder.id, [rootFolder.id]).should.eventually.be.rejectedWith(Error);
				await scanService.moveFolders(mockRoot.id, artistFolder.id, [artistFolder.id]).should.eventually.be.rejectedWith(Error);
				await scanService.moveFolders(mockRoot.id, artistFolder.id, [artistFolder.id]).should.eventually.be.rejectedWith(Error);
				const albumFolder = await store.folderStore.searchOne({rootID: mockRoot.id, types: [FolderType.album], artist: 'artist 2', album: 'album 1'});
				if (!albumFolder) {
					throw Error('Invalid Test Setup');
				}
				await scanService.moveFolders(mockRoot.id, artistFolder.id, [albumFolder.id]).should.eventually.be.rejectedWith(Error);
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
				expect(changes.newTracks.length).to.equal(0, 'New Track count doesnt match');
				expect(changes.updateTracks.length).to.equal(0, 'Update Track count doesnt match');
				expect(changes.removedTracks.length).to.equal(0, 'Removed Tracks count doesnt match');
				expect(changes.newFolders.length).to.equal(0, 'New Folder count doesnt match');
				// 3 = the multialbum, 1 the old parent, 1 the new parent
				expect(changes.updateFolders.length).to.equal(3, 'Update Folder count doesnt match');
				expect(changes.removedFolders.length).to.equal(0, 'Removed Folders count doesnt match');
				expect(changes.newArtists.length).to.equal(0, 'New Artist count doesnt match');
				expect(changes.updateArtists.length).to.equal(0, 'Update Artist count doesnt match');
				expect(changes.removedArtists.length).to.equal(0, 'Removed Artists count doesnt match');
				expect(changes.newAlbums.length).to.equal(0, 'New Album count doesnt match');
				expect(changes.updateAlbums.length).to.equal(0, 'Update Album count doesnt match');
				expect(changes.removedAlbums.length).to.equal(0, 'Removed Album count doesnt match');
				// move it back
				changes = await scanService.moveFolders(mockRoot.id, oldParentID, [albumFolder.id]);
				expect(changes.newTracks.length).to.equal(0, 'New Track count doesnt match');
				expect(changes.updateTracks.length).to.equal(0, 'Update Track count doesnt match');
				expect(changes.removedTracks.length).to.equal(0, 'Removed Tracks count doesnt match');
				expect(changes.newFolders.length).to.equal(0, 'New Folder count doesnt match');
				expect(changes.updateFolders.length).to.equal(3, 'Update Folder count doesnt match');
				expect(changes.removedFolders.length).to.equal(0, 'Removed Folders count doesnt match');
				expect(changes.newArtists.length).to.equal(0, 'New Artist count doesnt match');
				expect(changes.updateArtists.length).to.equal(0, 'Update Artist count doesnt match');
				expect(changes.removedArtists.length).to.equal(0, 'Removed Artists count doesnt match');
				expect(changes.newAlbums.length).to.equal(0, 'New Album count doesnt match');
				expect(changes.updateAlbums.length).to.equal(0, 'Update Album count doesnt match');
				expect(changes.removedAlbums.length).to.equal(0, 'Removed Album count doesnt match');
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
				await scanService.moveTracks(mockRoot.id, trackIDs, albumFolder.id).should.eventually.be.rejectedWith(Error);
				// fail: file names are used
				await scanService.moveTracks(mockRoot.id, trackIDs, album2Folder.id).should.eventually.be.rejectedWith(Error);

				let changes = await scanService.moveTracks(mockRoot.id, trackIDs, album3Folder.id);
				expect(changes.newTracks.length).to.equal(0, 'New Track count doesnt match');
				expect(changes.newFolders.length).to.equal(0, 'New Folder count doesnt match');
				expect(changes.newArtists.length).to.equal(0, 'New Artist count doesnt match');
				expect(changes.removedTracks.length).to.equal(0, 'Removed Tracks count doesnt match');
				expect(changes.removedFolders.length).to.equal(0, 'Removed Folders count doesnt match');
				expect(changes.removedArtists.length).to.equal(0, 'Removed Artists count doesnt match');
				expect(changes.updateAlbums.length).to.equal(0, 'Update Album count doesnt match');
				expect(changes.updateArtists.length).to.equal(2, 'Update Artist count doesnt match');
				// 3 the source, the dest & artist
				expect(changes.updateFolders.length).to.equal(3, 'Update Folder count doesnt match');
				expect(changes.updateTracks.length).to.equal(trackIDs.length, 'Update Track count doesnt match');
				expect(changes.newAlbums.length).to.equal(1, 'New Album count doesnt match');
				expect(changes.removedAlbums.length).to.equal(1, 'Removed Album count doesnt match');

				changes = await scanService.moveTracks(mockRoot.id, trackIDs, albumFolder.id);
				expect(changes.newTracks.length).to.equal(0, 'New Track count doesnt match');
				expect(changes.newFolders.length).to.equal(0, 'New Folder count doesnt match');
				expect(changes.newArtists.length).to.equal(0, 'New Artist count doesnt match');
				expect(changes.removedTracks.length).to.equal(0, 'Removed Tracks count doesnt match');
				expect(changes.removedFolders.length).to.equal(0, 'Removed Folders count doesnt match');
				expect(changes.removedArtists.length).to.equal(0, 'Removed Artists count doesnt match');
				expect(changes.updateAlbums.length).to.equal(0, 'Update Album count doesnt match');
				expect(changes.updateArtists.length).to.equal(2, 'Update Artist count doesnt match');
				// 3 the source, the dest & artist
				expect(changes.updateFolders.length).to.equal(3, 'Update Folder count doesnt match');
				expect(changes.updateTracks.length).to.equal(trackIDs.length, 'Update Track count doesnt match');
				expect(changes.newAlbums.length).to.equal(1, 'New Album count doesnt match');
				expect(changes.removedAlbums.length).to.equal(1, 'Removed Album count doesnt match');
				await validate(mockRoot, store);
			});

			describe('renameFolder', function() {
				this.timeout(40000);
				it('should do handle invalid parameters', async () => {
					const folder = await store.folderStore.random();
					should().exist(folder, 'Wrong Test Setup');
					if (!folder) {
						return;
					}
					await scanService.renameFolder(folder.rootID, folder.id, '').should.eventually.be.rejectedWith(Error);
					await scanService.renameFolder(folder.rootID, folder.id, '.').should.eventually.be.rejectedWith(Error);
					await scanService.renameFolder(folder.rootID, folder.id, '//..*\.').should.eventually.be.rejectedWith(Error);
					await scanService.renameFolder(folder.rootID, folder.id, path.basename(folder.path)).should.eventually.be.rejectedWith(Error);
				});
				it('should rename and update all folder & track paths', async () => {
					const folderIds = await store.folderStore.searchIDs({rootID: mockRoot.id});
					for (const id of folderIds) {
						const folder = await store.folderStore.byId(id);
						should().exist(folder);
						if (!folder) {
							return;
						}
						const name = path.basename(folder.path);
						let changes = await scanService.renameFolder(folder.rootID, folder.id, name + '_renamed');
						const all = await store.folderStore.search({inPath: folder.path});
						for (const f of all) {
							expect(await fse.pathExists(f.path)).to.equal(true, 'path does not exist ' + f.path);
						}
						const tracks = await store.trackStore.search({inPath: folder.path});
						for (const t of tracks) {
							expect(await fse.pathExists(t.path + t.name)).to.equal(true, 'file does not exist ' + t.path + t.name);
						}
						changes = await scanService.renameFolder(folder.rootID, folder.id, name);
					}
				});

			});
		},
		async () => {
			await removeMockRoot(mockRoot);
			await waveformServiceTest.cleanup();
			dir.removeCallback();
		}
	);

});
