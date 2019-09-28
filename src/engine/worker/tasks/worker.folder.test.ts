import fse from 'fs-extra';
import path from 'path';
import tmp from 'tmp';
import {DBObjectType} from '../../../db/db.types';
import {FolderType, RootScanStrategy} from '../../../model/jam-types';
import {testService} from '../../base/base.service.spec';
import {Store} from '../../store/store';
import {buildMockRoot, MockRoot, removeMockRoot, writeMockRoot} from '../../store/store.mock';
import {WaveformServiceTest} from '../../waveform/waveform.service.spec';
import {WorkerService} from '../worker.service';

describe('FolderWorker', () => {
	let store: Store;
	let workerService: WorkerService;
	const waveformServiceTest = new WaveformServiceTest();
	let dir: tmp.DirResult;
	let mockRoot: MockRoot;

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

			describe('renameFolder', () => {
				it('should handle invalid parameters', async () => {
					const folder = await store.folderStore.random();
					if (!folder) {
						throw Error('Invalid Test Setup');
					}
					await expect(workerService.renameFolder({rootID: folder.rootID, folderID: folder.id, newName: ''})).rejects.toThrow('Invalid Directory Name');
					await expect(workerService.renameFolder({rootID: folder.rootID, folderID: folder.id, newName: '.'})).rejects.toThrow('Invalid Directory Name');
					await expect(workerService.renameFolder({rootID: folder.rootID, folderID: folder.id, newName: '//..*\.'})).rejects.toThrow('Invalid Directory Name');
					await expect(workerService.renameFolder({rootID: folder.rootID, folderID: folder.id, newName: path.basename(folder.path)})).rejects.toThrow('Directory already exists');
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
						let changes = await workerService.renameFolder({rootID: folder.rootID, folderID: folder.id, newName: name + '_renamed'});
						const all = await store.folderStore.search({inPath: folder.path});
						for (const f of all.items) {
							expect(await fse.pathExists(f.path)).toBe(true); // path does not exist ' + f.path);
						}
						const tracks = await store.trackStore.search({inPath: folder.path});
						for (const t of tracks.items) {
							expect(await fse.pathExists(t.path + t.name)).toBe(true); // file does not exist ' + t.path + t.name);
						}
						changes = await workerService.renameFolder({rootID: folder.rootID, folderID: folder.id, newName: name});
					}
				});

			});

			it('should remove folders', async () => {
				const folders = await store.folderStore.search({rootID: mockRoot.id});
				let folder = folders.items.find(f => f.tag.level === 0);
				if (!folder) {
					throw Error('Invalid Test Setup');
				}
				await expect(workerService.deleteFolders({rootID: mockRoot.id, folderIDs: [folder.id]})).rejects.toThrow('Root folder can not be deleted');
				folder = folders.items.find(f => f.tag.type === FolderType.artist && f.tag.artist === 'artist 1');
				if (!folder) {
					throw Error('Invalid Test Setup');
				}
				const removedFolderCount = await store.folderStore.searchCount({inPath: folder.path});
				const removedAlbumCount = await store.albumStore.searchCount({artist: 'artist 1'});
				const changes = await workerService.deleteFolders({rootID: mockRoot.id, folderIDs: [folder.id]});
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
				const restorechanges = await workerService.refreshRoot({rootID: mockRoot.id, forceMetaRefresh: false});
				expect(restorechanges.newFolders.length).toBe(removedFolderCount); // Restored Folders count doesnt match');
				expect(restorechanges.newAlbums.length).toBe(removedAlbumCount); // Restored Folders count doesnt match');
			});
			it('should not move folders with invalid parameters', async () => {
				const rootFolder = await store.folderStore.searchOne({rootID: mockRoot.id, level: 0});
				if (!rootFolder) {
					throw Error('Invalid Test Setup');
				}
				await expect(workerService.moveFolders({rootID: mockRoot.id, newParentID: rootFolder.id, folderIDs: [rootFolder.id]})).rejects.toThrow('Folder cannot be moved to itself');
				const artistFolder = await store.folderStore.searchOne({rootID: mockRoot.id, types: [FolderType.artist], artist: 'artist 1'});
				if (!artistFolder) {
					throw Error('Invalid Test Setup');
				}
				await expect(workerService.moveFolders({rootID: mockRoot.id, newParentID: rootFolder.id, folderIDs: [artistFolder.id]})).rejects.toThrow('Folder is already in Destination');
				await expect(workerService.moveFolders({rootID: mockRoot.id, newParentID: artistFolder.id, folderIDs: [rootFolder.id]})).rejects.toThrow('Folder moving failed');
				await expect(workerService.moveFolders({rootID: mockRoot.id, newParentID: artistFolder.id, folderIDs: [artistFolder.id]})).rejects.toThrow('Folder cannot be moved to itself');
				const albumFolder = await store.folderStore.searchOne({rootID: mockRoot.id, types: [FolderType.album], artist: 'artist 2', album: 'album 1'});
				if (!albumFolder) {
					throw Error('Invalid Test Setup');
				}
				await expect(workerService.moveFolders({rootID: mockRoot.id, newParentID: artistFolder.id, folderIDs: [albumFolder.id]})).rejects.toThrow('Folder name already used in Destination');
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
				let changes = await workerService.moveFolders({rootID: mockRoot.id, newParentID: artistFolder.id, folderIDs: [albumFolder.id]});
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
				changes = await workerService.moveFolders({rootID: mockRoot.id, newParentID: oldParentID as string, folderIDs: [albumFolder.id]});
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

			/*
			describe('setFolderImage', () => {
				it('should handle invalid parameters', async () => {
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
				it('should handle invalid parameters', async () => {
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
			await waveformServiceTest.cleanup();
		}
	);

});
