import {EngineService} from '../modules/engine/services/engine.service';
import path from 'path';
import tmp from 'tmp';
import fse from 'fs-extra';
import {WorkerService} from '../modules/engine/services/worker.service';
import {ensureTrailingPathSeparator} from '../utils/fs-utils';
import 'jest-expect-message';
import {AlbumType, ArtworkImageType, FolderType, RootScanStrategy} from '../types/enums';
import {randomItem, randomString} from '../utils/random';
import {Genres} from '../utils/genres';
import {bindMockConfig} from './mock/mock.config';
import {waitEngineStart} from './mock/mock.engine';
import {Folder} from '../entity/folder/folder';
import {mockNock, mockNockURL} from './mock/mock.nock';
import {Artwork} from '../entity/artwork/artwork';
import {
	WorkerRequestCreateArtwork,
	WorkerRequestDownloadArtwork,
	WorkerRequestMoveArtworks,
	WorkerRequestMoveTracks,
	WorkerRequestRefreshFolders,
	WorkerRequestRefreshTracks,
	WorkerRequestRemoveArtwork,
	WorkerRequestRemoveTracks,
	WorkerRequestRenameArtwork,
	WorkerRequestRenameTrack,
	WorkerRequestReplaceArtwork,
	WorkerRequestUpdateRoot
} from '../modules/engine/services/worker.types';
import {Track} from '../entity/track/track';
import {mockImage, writeMockImage} from './mock/mock.image';
import {buildMockRoot, buildSeriesMockRoot, extendSpecMockRoot, MockRoot, MockSpecRoot, validateMock, writeAndStoreMock, writeMockRoot} from './mock/mock.root';
import {writeMockFolder} from './mock/mock.folder';
import {initTest} from './init';
import {expectChanges, validateMockRoot} from './mock/mock.changes';

initTest();

describe('WorkerService', () => {
	let engine: EngineService;
	let workerService: WorkerService;
	let dir: tmp.DirResult;
	let mockRoot: MockRoot;

	beforeEach(async () => {
		dir = tmp.dirSync();
		bindMockConfig(dir.name);

		engine = new EngineService();
		workerService = engine.ioService.workerService;
		await engine.start();
		await waitEngineStart(engine);
	});

	afterEach(async () => {
		await engine.stop();
		await fse.remove(dir.name);
		// dir.removeCallback();
	});

	describe('scan with mock data', () => {

		describe('scan with RootScanStrategy.auto', () => {

			beforeEach(async () => {
				const mediaPath = ensureTrailingPathSeparator(path.join(dir.name, 'audio'));
				await fse.mkdir(mediaPath);
				mockRoot = buildMockRoot(mediaPath, 1, RootScanStrategy.auto);
				const changes = await writeAndStoreMock(mockRoot, workerService);
				await validateMockRoot(mockRoot, changes, workerService);
			});

			afterEach(async () => {
				const mediaPath = ensureTrailingPathSeparator(path.join(dir.name, 'audio'));
				await fse.remove(mediaPath);
			});

			it('should rescan', async () => {
				//Arrange

				//Act
				const changes = await workerService.refreshRoot({rootID: mockRoot.id});

				//Assert
				expectChanges(changes, {});
				await validateMock(mockRoot, workerService);
			});
			it('should remove missing in the root', async () => {
				//Arrange
				await fse.remove(mockRoot.path);
				await fse.ensureDir(mockRoot.path);

				//Act
				const changes = await workerService.refreshRoot({rootID: mockRoot.id});

				//Assert
				expectChanges(changes, {
					tracksRemoved: mockRoot.expected.tracks,
					foldersUpdate: 1,
					foldersRemoved: mockRoot.expected.folders - 1,
					artistsRemoved: mockRoot.expected.artists.length,
					albumsRemoved: mockRoot.expected.albums,
					seriesRemoved: mockRoot.expected.series,
					artworksRemoved: mockRoot.expected.artworks
				});
				expect(await engine.orm.Folder.count()).toBe(1);
				expect(await engine.orm.Track.count()).toBe(0);
				expect(await engine.orm.Album.count()).toBe(0);
				expect(await engine.orm.Artist.count()).toBe(0);
				expect(await engine.orm.Series.count()).toBe(0);
				expect(await engine.orm.Artwork.count()).toBe(0);
				expect(await engine.orm.Bookmark.count()).toBe(0);
				expect(await engine.orm.State.count()).toBe(0);
			});
			it('should scan added in the root', async () => {
				//Arrange
				await fse.remove(mockRoot.path);
				await fse.ensureDir(mockRoot.path);
				await workerService.refreshRoot({rootID: mockRoot.id});
				await writeMockRoot(mockRoot);

				//Act
				const changes = await workerService.refreshRoot({rootID: mockRoot.id});

				//Assert
				expectChanges(changes, {
					tracksNew: mockRoot.expected.tracks,
					foldersUpdate: 1,
					foldersNew: mockRoot.expected.folders - 1,
					artistsNew: mockRoot.expected.artists.length,
					artworksNew: mockRoot.expected.artworks,
					albumsNew: mockRoot.expected.albums,
					seriesNew: mockRoot.expected.series
				});
				await validateMock(mockRoot, workerService);
			});
			it('should combine/remove artists and albums from different roots', async () => {
				const dir2 = tmp.dirSync();
				const mockRoot2 = buildMockRoot(dir2.name, 2, RootScanStrategy.auto);
				let changes = await writeAndStoreMock(mockRoot2, workerService);
				expectChanges(changes, {
					tracksNew: mockRoot2.expected.tracks,
					foldersNew: mockRoot2.expected.folders,
					artworksNew: mockRoot2.expected.artworks,
					seriesUpdate: mockRoot2.expected.series,
					albumsUpdate: mockRoot2.expected.albums,
					artistsUpdate: mockRoot2.expected.artists.length
				});
				await validateMock(mockRoot2, workerService);
				await fse.remove(mockRoot2.path);
				// dir2.removeCallback();

				await fse.ensureDir(mockRoot2.path);
				changes = await workerService.refreshRoot({rootID: mockRoot2.id});
				await fse.remove(mockRoot2.path);
				expectChanges(changes, {
					tracksRemoved: mockRoot2.expected.tracks,
					foldersUpdate: 1,
					foldersRemoved: mockRoot2.expected.folders - 1,
					artworksRemoved: mockRoot2.expected.artworks,
					seriesUpdate: mockRoot2.expected.series,
					albumsUpdate: mockRoot2.expected.albums,
					artistsUpdate: mockRoot2.expected.artists.length
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
							images: [],
							folders: [
								{
									name: 'album 1',
									genre: randomItem(Genres),
									folders: [],
									images: [],
									tracks: [
										{
											name: '1 - title 1 - Run Dmc.mp3',
											artist: 'Run Dmc',
											album: 'album 1',
											number: 1,
											total: 3,
											genre: randomItem(Genres)
										},
										{
											name: '2 - title 2 - Run DMC.mp3',
											artist: 'Run DMC',
											album: 'album 1',
											number: 2,
											total: 3,
											genre: randomItem(Genres)
										},
										{
											name: '3 - title 2 - Run D_M_C_.mp3',
											artist: 'Run D.M.C.',
											album: 'album 1',
											number: 3,
											total: 3,
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
					images: [],
					expected: {
						folders: 3,
						tracks: 3,
						series: 0,
						artworks: 0,
						artists: ['Run Dmc'],
						albums: 1,
						folderType: FolderType.collection
					}
				};
				const mockRoot2 = extendSpecMockRoot(rootDir, mockRootSpec2, RootScanStrategy.auto);
				const changes = await writeAndStoreMock(mockRoot2, workerService);
				expectChanges(changes, {
					tracksNew: mockRoot2.expected.tracks,
					foldersNew: mockRoot2.expected.folders,
					artistsNew: mockRoot2.expected.artists.length,
					albumsNew: mockRoot2.expected.albums
				});
				await validateMock(mockRoot2, workerService);
				await fse.remove(mockRoot2.path);
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
									images: [],
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
									images: [],
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
							images: [],
							tracks: [],
							expected: {
								folderType: FolderType.collection
							}
						}
					],
					tracks: [],
					images: [],
					expected: {
						folders: 4,
						tracks: 4,
						artists: ['artist A', 'artist B'],
						artworks: 0,
						series: 0,
						albums: 2,
						folderType: FolderType.collection
					}
				};
				const mockRoot2 = extendSpecMockRoot(rootDir, mockRootSpec2, RootScanStrategy.auto);
				let changes = await writeAndStoreMock(mockRoot2, workerService);
				expectChanges(changes, {
					tracksNew: mockRoot2.expected.tracks,
					foldersNew: mockRoot2.expected.folders,
					artistsNew: mockRoot2.expected.artists.length,
					albumsNew: mockRoot2.expected.albums
				});
				await validateMock(mockRoot2, workerService);

				await fse.remove(mockRoot2.folders[0].folders[1].path);

				// now, update Artist B to Artist A
				mockRoot2.folders[0].folders[1] = {
					path: path.join(rootDir, 'collection', 'album 2'),
					name: 'album 2',
					genre: randomItem(Genres),
					folders: [],
					images: [],
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
				changes = await workerService.refreshRoot({rootID: mockRoot2.id});
				expectChanges(changes, {
					tracksUpdate: 2, // 2 Tracks must be updated
					foldersUpdate: 3, // Root & Album Folder & Artist Folder must be updated
					albumsRemoved: 1, // (Album 2 by Artist B) must be removed
					albumsNew: 1, // (Album 2 by Artist A) must be added
					artistsRemoved: 1, 	// Artist B must be removed
					artistsUpdate: 1 // Artist A must be updated
				});
				await validateMock(mockRoot2, workerService);
				await fse.remove(mockRoot2.path);
				dir2.removeCallback();
			});
			it('should remove tracks on scan', async () => {
				const tracks = await engine.orm.Track.findFilter({rootIDs: [mockRoot.id]});
				for (const track of tracks) {
					const changes = await workerService.removeTracks({rootID: mockRoot.id, trackIDs: [track.id]});
					expect(changes.tracks.removed.size, 'Removed Tracks count doesnt match').toBe(1);
				}
				const album = await engine.orm.Album.findFilter({rootIDs: [mockRoot.id]});
				expect(album.length, 'All albums should have been removed').toBe(0);
				const artists = await engine.orm.Artist.findFilter({rootIDs: [mockRoot.id]});
				expect(artists.length, 'All artists should have been removed').toBe(0);
				await writeMockRoot(mockRoot);
				const restoreChanges = await workerService.refreshRoot({rootID: mockRoot.id});
				expect(restoreChanges.tracks.added.size, 'Restored Tracks count doesnt match').toBe(tracks.length);
			});
		});

		describe('scan with RootScanStrategy.audiobook', () => {
			beforeEach(async () => {
				const mediaPath = ensureTrailingPathSeparator(path.join(dir.name, 'audio'));
				await fse.mkdir(mediaPath);
				mockRoot = buildSeriesMockRoot(dir.name, 2, RootScanStrategy.audiobook);
				const changes = await writeAndStoreMock(mockRoot, workerService);
				await validateMockRoot(mockRoot, changes, workerService);
			});

			afterEach(async () => {
				const mediaPath = ensureTrailingPathSeparator(path.join(dir.name, 'audio'));
				await fse.remove(mediaPath);
			});

			it('should rescan', async () => {
				const changes = await workerService.refreshRoot({rootID: mockRoot.id});
				expectChanges(changes, {});
				await validateMock(mockRoot, workerService);
			});
		});

	});

	describe('process worker tasks', () => {

		beforeEach(async () => {
			const mediaPath = ensureTrailingPathSeparator(path.join(dir.name, 'audio'));
			await fse.mkdir(mediaPath);
			mockRoot = buildMockRoot(mediaPath, 1, RootScanStrategy.auto);
			const changes = await writeAndStoreMock(mockRoot, workerService);
			await validateMockRoot(mockRoot, changes, workerService);
		});

		afterEach(async () => {
			const mediaPath = ensureTrailingPathSeparator(path.join(dir.name, 'audio'));
			await fse.remove(mediaPath);
		});

		describe('folder tasks', () => {

			describe('create folders', () => {
				it('should handle invalid parameters', async () => {
					const folders = await workerService.orm.Folder.find({root: {id: mockRoot.id}});
					const folder = folders[0];
					if (!folder) {
						throw Error('Invalid Test Setup');
					}
					await expect(workerService.createFolder({rootID: mockRoot.id, parentID: folder.id, name: ''})).rejects.toThrow('Invalid Directory Name');
					await expect(workerService.createFolder({rootID: mockRoot.id, parentID: folder.id, name: '.'})).rejects.toThrow('Invalid Directory Name');
					await expect(workerService.createFolder({rootID: mockRoot.id, parentID: folder.id, name: '//..*.'})).rejects.toThrow('Invalid Directory Name');
					await expect(workerService.createFolder({rootID: mockRoot.id, parentID: 'invalid', name: 'valid'})).rejects.toThrow('Destination Folder not found');
					const child = folders.find(f => !!f.parent);
					if (!child || !child.parent) {
						throw Error('Invalid Test Setup');
					}
					await expect(workerService.createFolder({rootID: mockRoot.id, parentID: child.parent.id, name: path.basename(child.path)})).rejects.toThrow('Folder name already used in Destination');
				});

				it('should create a folder', async () => {
					const parent = await workerService.orm.Folder.findOneOrFail({root: {id: mockRoot.id}});
					const changes = await workerService.createFolder({rootID: mockRoot.id, parentID: parent.id, name: randomString(10)});
					expectChanges(changes, {
						foldersUpdate: 1,
						foldersNew: 1
					});
				});
			});

			describe('rename folders', () => {
				let folder!: Folder;

				beforeEach(async () => {
					folder = await workerService.orm.Folder.findOneOrFail({root: {id: mockRoot.id}});
				});

				it('should handle invalid parameters', async () => {
					await expect(workerService.renameFolder({rootID: mockRoot.id, folderID: folder.id, newName: ''})).rejects.toThrow('Invalid Directory Name');
					await expect(workerService.renameFolder({rootID: mockRoot.id, folderID: folder.id, newName: '.'})).rejects.toThrow('Invalid Directory Name');
					await expect(workerService.renameFolder({rootID: mockRoot.id, folderID: folder.id, newName: '//..*.'})).rejects.toThrow('Invalid Directory Name');
					await expect(workerService.renameFolder({rootID: mockRoot.id, folderID: folder.id, newName: path.basename(folder.path)})).rejects.toThrow('Folder name already used in Destination');
					await expect(workerService.renameFolder({rootID: mockRoot.id, folderID: 'invalid', newName: 'valid'})).rejects.toThrow('Folder not found');
				});

				it('should handle fs errors', async () => {
					const mockFn = jest.spyOn(fse, 'rename');
					mockFn.mockImplementation(() => Promise.reject(Error('Some fs error')));
					await expect(workerService.renameFolder({rootID: mockRoot.id, folderID: folder.id, newName: 'valid'})).rejects.toThrow('Folder renaming failed');
					expect(mockFn).toHaveBeenCalled();
					mockFn.mockRestore();
				});

				it('should rename and update all folder & track paths', async () => {
					const folderIds = await workerService.orm.Folder.findIDs({root: {id: mockRoot.id}});
					if (folderIds.length === 0) {
						throw Error('Invalid Test Setup');
					}

					async function testRename(folder: Folder, newName: string): Promise<Folder | undefined> {
						const trackCount = await workerService.orm.Track.countFilter({childOfID: folder.id});
						const folderCount = await workerService.orm.Folder.countFilter({childOfID: folder.id});
						await workerService.renameFolder({rootID: mockRoot.id, folderID: folder.id, newName});
						const updatedFolder = await workerService.orm.Folder.oneOrFail(folder.id);
						const all = await workerService.orm.Folder.findFilter({childOfID: updatedFolder.id});
						expect(folderCount, `Folder count does not match: ${updatedFolder.path}`).toBe(all.length);
						for (const f of all) {
							expect(await fse.pathExists(f.path), `Folder does not exists: ${f.path}`).toBe(true);
						}
						const tracks = await workerService.orm.Track.findFilter({childOfID: updatedFolder.id});
						expect(trackCount, `Track count does not match: ${updatedFolder.path}`).toBe(tracks.length);
						for (const track of tracks) {
							expect(await fse.pathExists(path.join(track.path, track.fileName)),
								`Track does not exists: ${path.join(track.path, track.fileName)}`).toBe(true);
						}
						return updatedFolder;
					}

					for (const id of folderIds) {
						const folder = await workerService.orm.Folder.oneOrFail(id);
						const name = path.basename(folder.path);
						const updatedFolder = await testRename(folder, name + '_renamed');
						if (updatedFolder) {
							await testRename(updatedFolder, name);
						}
					}
				});
			});

			describe('remove folders', () => {
				let rootFolder!: Folder;
				let artistFolder!: Folder;

				beforeEach(async () => {
					rootFolder = await workerService.orm.Folder.oneOrFailFilter({rootIDs: [mockRoot.id], level: 0});
					artistFolder = await workerService.orm.Folder.oneOrFailFilter({rootIDs: [mockRoot.id], artist: 'artist 1', folderTypes: [FolderType.artist]});
				});

				it('should not remove root folders', async () => {
					await expect(workerService.deleteFolders({rootID: mockRoot.id, folderIDs: [rootFolder.id]})).rejects.toThrow('Root folder can not be deleted');
				});

				it('should handle fs errors', async () => {
					const mockFn = jest.spyOn(fse, 'move'); // mock move, since we don't delete, but move to trash folder
					mockFn.mockImplementation(() => Promise.reject(Error('Some fs error')));
					await expect(workerService.deleteFolders({rootID: mockRoot.id, folderIDs: [artistFolder.id]})).rejects.toThrow('Folder removing failed');
					expect(mockFn).toHaveBeenCalled();
					mockFn.mockRestore();
				});

				it('should remove folders', async () => {
					const folderCount = (await workerService.orm.Folder.countFilter({childOfID: artistFolder.id})) + 1;
					const artworkCount = await workerService.orm.Artwork.countFilter({childOfID: artistFolder.id});
					const trackCount = await workerService.orm.Track.countFilter({childOfID: artistFolder.id});
					const albumCount = await workerService.orm.Album.countFilter({artist: 'artist 1'});
					const changes = await workerService.deleteFolders({rootID: mockRoot.id, folderIDs: [artistFolder.id]});
					expectChanges(changes, {
						tracksRemoved: trackCount,
						foldersUpdate: 1,
						foldersRemoved: folderCount,
						artistsRemoved: 2,	// ['artist 1', 'artist 1 with another artist']
						albumsRemoved: albumCount,
						artworksRemoved: artworkCount
					});
					// restore the folder and rescan
					const mockFolder = mockRoot.folders.find(f => f.name === 'artist 1');
					await writeMockFolder(mockFolder!);
					const restorechanges = await workerService.refreshRoot({rootID: mockRoot.id});
					expectChanges(restorechanges, {
						tracksNew: trackCount,
						foldersNew: folderCount,
						foldersUpdate: 1,
						artistsNew: 2,
						albumsNew: albumCount,
						artworksNew: artworkCount
					});
				});
			});

			describe('move folders', () => {
				let rootFolder!: Folder;
				let artistFolder!: Folder;
				let albumFolder!: Folder;
				let album2Folder!: Folder;

				beforeEach(async () => {
					rootFolder = await workerService.orm.Folder.oneOrFailFilter({rootIDs: [mockRoot.id], level: 0});
					albumFolder = await workerService.orm.Folder.oneOrFailFilter({rootIDs: [mockRoot.id], album: 'album 3', level: 2, artist: 'artist 1'});
					album2Folder = await workerService.orm.Folder.oneOrFailFilter({rootIDs: [mockRoot.id], folderTypes: [FolderType.album], artist: 'artist 2', album: 'album 1'});
					artistFolder = await workerService.orm.Folder.oneOrFailFilter({rootIDs: [mockRoot.id], folderTypes: [FolderType.artist], artist: 'artist 2'});
				});

				it('should not move folders with invalid parameters', async () => {
					await expect(workerService.moveFolders({rootID: mockRoot.id, newParentID: rootFolder.id, folderIDs: [rootFolder.id]})).rejects.toThrow('Folder cannot be moved to itself');
					await expect(workerService.moveFolders({rootID: mockRoot.id, newParentID: rootFolder.id, folderIDs: [artistFolder.id]})).rejects.toThrow('Folder name already used in Destination');
					await expect(workerService.moveFolders({rootID: mockRoot.id, newParentID: artistFolder.id, folderIDs: [rootFolder.id]})).rejects.toThrow('Root folder can not be moved');
					await expect(workerService.moveFolders({rootID: mockRoot.id, newParentID: artistFolder.id, folderIDs: [artistFolder.id]})).rejects.toThrow('Folder cannot be moved to itself');
					await expect(workerService.moveFolders({rootID: mockRoot.id, newParentID: artistFolder.id, folderIDs: [album2Folder.id]})).rejects.toThrow('Folder name already used in Destination');
					await expect(workerService.moveFolders({rootID: mockRoot.id, newParentID: 'invalid', folderIDs: [albumFolder.id]})).rejects.toThrow('Destination Folder not found');
					await expect(workerService.moveFolders({rootID: mockRoot.id, newParentID: artistFolder.id, folderIDs: ['invalid']})).rejects.toThrow('Source Folder not found');
				});

				it('should handle fs errors', async () => {
					const mockFn = jest.spyOn(fse, 'move');
					mockFn.mockImplementation(() => Promise.reject(Error('Some fs error')));
					await expect(workerService.moveFolders({rootID: mockRoot.id, newParentID: artistFolder.id, folderIDs: [albumFolder.id]})).rejects.toThrow('Folder moving failed');
					expect(mockFn).toHaveBeenCalled();
					mockFn.mockRestore();
				});

				it('should move folders', async () => {
					const trackCount = await workerService.orm.Track.countFilter({childOfID: albumFolder.id});
					const artworkCount = await workerService.orm.Artwork.countFilter({childOfID: albumFolder.id});
					const oldParentID = albumFolder.parent?.id;
					if (!oldParentID) {
						throw Error('Invalid Test Setup');
					}
					let changes = await workerService.moveFolders({rootID: mockRoot.id, newParentID: artistFolder.id, folderIDs: [albumFolder.id]});
					expectChanges(changes, {
						foldersUpdate: 5, // 3 = the multialbum with 2 childs, 1 = the old parent, 1 = the new parent
						artistsUpdate: 1,
						albumsUpdate: 1,
						artworksUpdate: artworkCount,
						tracksUpdate: trackCount
					});
					// move it back
					changes = await workerService.moveFolders({rootID: mockRoot.id, newParentID: oldParentID as string, folderIDs: [albumFolder.id]});
					expectChanges(changes, {
						foldersUpdate: 5,
						albumsUpdate: 1,
						artistsUpdate: 1,
						artworksUpdate: artworkCount,
						tracksUpdate: trackCount
					});
				});
			});

			describe('refresh folders', () => {
				let rootFolder!: Folder;
				let opts: WorkerRequestRefreshFolders;

				beforeEach(async () => {
					rootFolder = await workerService.orm.Folder.oneOrFailFilter({rootIDs: [mockRoot.id], level: 0});
					opts = {rootID: mockRoot.id, folderIDs: [rootFolder.id]};
				});

				it('should not refresh folders with invalid parameters', async () => {
					await expect(workerService.refreshFolders({...opts, folderIDs: ['invalid']})).rejects.toThrow('Folder not found');
					await expect(workerService.refreshFolders({...opts, rootID: 'invalid'})).rejects.toThrow('Root not found');
				});
				it('should  refresh a folder', async () => {
					const changes = await workerService.refreshFolders(opts);
					expectChanges(changes, {foldersUpdate: 1});
				});
			});

		});

		describe('root tasks', () => {

			describe('create roots', () => {
				let opts: WorkerRequestUpdateRoot;

				beforeEach(async () => {
					opts = {name: 'dummy', strategy: RootScanStrategy.auto, rootID: '', path: ''};
				});

				it('should handle invalid parameters', async () => {
					await expect(workerService.createRoot({...opts, path: ''})).rejects.toThrow('Root Directory invalid');
					await expect(workerService.createRoot({...opts, path: ' '})).rejects.toThrow('Root Directory invalid');
					await expect(workerService.createRoot({...opts, path: '*'})).rejects.toThrow('Root Directory invalid');
					await expect(workerService.createRoot({...opts, path: '.'})).rejects.toThrow('Root Directory must be absolute');
					await expect(workerService.createRoot({...opts, path: '..'})).rejects.toThrow('Root Directory must be absolute');
					await expect(workerService.createRoot({...opts, path: './data/'})).rejects.toThrow('Root Directory must be absolute');
					await expect(workerService.createRoot({...opts, path: mockRoot.path})).rejects.toThrow('Root path already used');
				});

				it('should create a root', async () => {
					const mediaPath = ensureTrailingPathSeparator(path.join(dir.name, 'audio2'));
					await fse.mkdir(mediaPath);
					const changes = await workerService.createRoot({...opts, path: mediaPath});
					expectChanges(changes, {});
				});

				it('should create a root with inaccessible path', async () => {
					const changes = await workerService.createRoot({...opts, path: '/invalid/test/path/'});
					expectChanges(changes, {});
				});

				it('should not allow already scanned path or parts of path in a new root', async () => {
					const changes = await workerService.createRoot({...opts, path: '/invalid/test/path/'});
					expectChanges(changes, {});
					await expect(workerService.createRoot({...opts, path: '/invalid/test/path/'})).rejects.toThrow('Root path already used');
					await expect(workerService.createRoot({...opts, path: '/invalid/test/'})).rejects.toThrow('Root path already used');
					await expect(workerService.createRoot({...opts, path: '/invalid/test/path/other'})).rejects.toThrow('Root path already used');
				});
			});

			describe('remove roots', () => {
				it('should handle invalid parameters', async () => {
					await expect(workerService.removeRoot({rootID: ''})).rejects.toThrow('Root not found');
					await expect(workerService.removeRoot({rootID: 'invalid'})).rejects.toThrow('Root not found');
				});

				it('should remove a root', async () => {
					const changes = await workerService.removeRoot({rootID: mockRoot.id});
					expectChanges(changes, {
						tracksRemoved: mockRoot.expected.tracks,
						artistsRemoved: mockRoot.expected.artists.length,
						albumsRemoved: mockRoot.expected.albums,
						foldersRemoved: mockRoot.expected.folders,
						artworksRemoved: mockRoot.expected.artworks,
						seriesRemoved: mockRoot.expected.series
					});
				});
			});

			describe('update roots', () => {
				let mediaPath: string;
				let opts: WorkerRequestUpdateRoot;

				beforeEach(async () => {
					mediaPath = ensureTrailingPathSeparator(path.join(dir.name, 'audio2'));
					opts = {rootID: mockRoot.id, name: mockRoot.name, path: mediaPath, strategy: mockRoot.strategy};
				});

				it('should handle invalid parameters', async () => {
					await expect(workerService.updateRoot({...opts, rootID: 'invalid'})).rejects.toThrow('Root not found');
					await expect(workerService.updateRoot({...opts, path: ''})).rejects.toThrow('Root Directory invalid');
				});

				it('should update a root name only', async () => {
					const changes = await workerService.updateRoot({...opts, name: 'something', path: mockRoot.path});
					expectChanges(changes, {});
				});

				it('should update a root path', async () => {
					await fse.mkdir(mediaPath);
					const changes = await workerService.updateRoot({...opts});
					expectChanges(changes, {
						foldersNew: 1,
						tracksRemoved: mockRoot.expected.tracks,
						artistsRemoved: mockRoot.expected.artists.length,
						albumsRemoved: mockRoot.expected.albums,
						foldersRemoved: mockRoot.expected.folders,
						artworksRemoved: mockRoot.expected.artworks,
						seriesRemoved: mockRoot.expected.series
					});
				});
			});

		});

		describe('artwork tasks', () => {

			describe('move artworks', () => {
				let folder!: Folder;
				let artwork!: Artwork;
				let opts: WorkerRequestMoveArtworks;

				beforeEach(async () => {
					artwork = await workerService.orm.Artwork.oneOrFailFilter({name: 'front.png'});
					folder = await workerService.orm.Folder.oneOrFailFilter({rootIDs: [mockRoot.id], folderTypes: [FolderType.album], artist: 'artist 1', album: 'album 1'});
					opts = {rootID: mockRoot.id, artworkIDs: [artwork.id], newParentID: folder.id};
				});

				it('should handle invalid parameters', async () => {
					await expect(workerService.moveArtworks({...opts, newParentID: artwork.folder.id})).rejects.toThrow('File name is already used in folder');
					await expect(workerService.moveArtworks({...opts, rootID: 'invalid'})).rejects.toThrow('Root not found');
					await expect(workerService.moveArtworks({...opts, artworkIDs: ['invalid']})).rejects.toThrow('Artwork not found');
					await expect(workerService.moveArtworks({...opts, newParentID: 'invalid'})).rejects.toThrow('Destination Folder not found');
				});

				it('should move artworks', async () => {
					const oldFolderID = artwork.folder.id;
					let changes = await workerService.moveArtworks({rootID: mockRoot.id, artworkIDs: [artwork.id], newParentID: folder.id});
					expectChanges(changes, {
						foldersUpdate: 2,
						artworksUpdate: 1
					});
					changes = await workerService.moveArtworks({rootID: mockRoot.id, artworkIDs: [artwork.id], newParentID: oldFolderID});
					expectChanges(changes, {
						foldersUpdate: 2,
						artworksUpdate: 1
					});
				});

			});

			describe('rename artworks', () => {
				let artwork!: Artwork;
				let opts: WorkerRequestRenameArtwork;

				beforeEach(async () => {
					artwork = await workerService.orm.Artwork.oneOrFailFilter({name: 'front.png'});
					opts = {rootID: mockRoot.id, artworkID: artwork.id, newName: ''};
				});

				it('should handle invalid parameters', async () => {
					const artwork = await workerService.orm.Artwork.oneOrFailFilter({name: 'front.png'});
					const ext = path.extname(artwork.name);
					await expect(workerService.renameArtwork({...opts, newName: ''})).rejects.toThrow('Invalid Name');
					await expect(workerService.renameArtwork({...opts, newName: '.'})).rejects.toThrow(/Changing File extension not supported/);
					await expect(workerService.renameArtwork({...opts, newName: '/'})).rejects.toThrow('Invalid Name');
					await expect(workerService.renameArtwork({...opts, newName: '\\'})).rejects.toThrow('Invalid Name');
					await expect(workerService.renameArtwork({...opts, newName: '*' + ext})).rejects.toThrow('Invalid Name');
					await expect(workerService.renameArtwork({...opts, newName: '//..*.'})).rejects.toThrow('Invalid Name');
					await expect(workerService.renameArtwork({...opts, newName: 'none.invalid'})).rejects.toThrow(/Changing File extension not supported/);
					await expect(workerService.renameArtwork({...opts, newName: artwork.name})).rejects.toThrow('File name already used in Destination');
					await expect(workerService.renameArtwork({...opts, artworkID: 'invalid', newName: 'valid' + ext})).rejects.toThrow('Artwork not found');
				});

				it('should handle fs errors', async () => {
					const ext = path.extname(artwork.name);
					const mockFn = jest.spyOn(fse, 'rename');
					mockFn.mockImplementation(() => Promise.reject(Error('Some fs error')));
					await expect(workerService.renameArtwork({...opts, newName: 'valid' + ext})).rejects.toThrow('File renaming failed');
					expect(mockFn).toHaveBeenCalled();
					mockFn.mockRestore();
				});

				it('should rename an artwork', async () => {
					const ext = path.extname(artwork.name);
					const changes = await workerService.renameArtwork({...opts, newName: 'valid' + ext});
					expectChanges(changes, {foldersUpdate: 1, artworksUpdate: 1});
				});
			});

			describe('remove artworks', () => {
				let artwork!: Artwork;
				let opts: WorkerRequestRemoveArtwork;

				beforeEach(async () => {
					artwork = await workerService.orm.Artwork.oneOrFailFilter({name: 'front.png'});
					opts = {rootID: mockRoot.id, artworkID: artwork.id};
				});

				it('should handle invalid parameters', async () => {
					await expect(workerService.removeArtwork({...opts, rootID: 'invalid'})).rejects.toThrow('Root not found');
					await expect(workerService.removeArtwork({...opts, artworkID: 'invalid'})).rejects.toThrow('Artwork not found');
				});

				it('should handle fs errors', async () => {
					const mockFn = jest.spyOn(fse, 'move');
					mockFn.mockImplementation(() => Promise.reject(Error('Some fs error')));
					await expect(workerService.removeArtwork(opts)).rejects.toThrow('Moving to Trash failed');
					expect(mockFn).toHaveBeenCalled();
					mockFn.mockRestore();
				});

				it('should remove an artwork', async () => {
					const changes = await workerService.removeArtwork(opts);
					expectChanges(changes, {
						foldersUpdate: 1,
						artworksRemoved: 1
					});
				});
			});

			describe('download artworks', () => {
				let folder: Folder;
				let opts: WorkerRequestDownloadArtwork;

				beforeEach(async () => {
					folder = await workerService.orm.Folder.oneOrFailFilter({rootIDs: [mockRoot.id], folderTypes: [FolderType.album], artist: 'artist 1', album: 'album 1'});
					opts = {rootID: mockRoot.id, folderID: folder.id, types: [ArtworkImageType.front], artworkURL: ''};
				});

				it('should handle invalid parameters', async () => {
					await expect(workerService.downloadArtwork({...opts, artworkURL: ''})).rejects.toThrow('Invalid Image URL');
					await expect(workerService.downloadArtwork({...opts, artworkURL: mockNockURL('invalid')})).rejects.toThrow('Invalid Image URL');
					await expect(workerService.downloadArtwork({...opts, folderID: 'invalid', artworkURL: mockNockURL('nonexisting.png')})).rejects.toThrow('Folder not found');
				});

				it('should handle 404s', async () => {
					const scope = mockNock()
						.get('/nonexisting.png').reply(404);
					await expect(workerService.downloadArtwork({...opts, artworkURL: mockNockURL('nonexisting.png')})).rejects.toThrow('Not Found');
					expect(scope.isDone(), 'No request has been made').toBe(true);
				});

				it('should download', async () => {
					const image = await mockImage('png');
					const scope = mockNock()
						.get('/image.png').reply(200, image.buffer, {'Content-Type': image.mime});
					const changes = await workerService.downloadArtwork({...opts, artworkURL: mockNockURL('image.png')});
					expect(scope.isDone(), 'No request has been made').toBe(true);
					expectChanges(changes, {foldersUpdate: 1, artworksNew: 1});
				});
			});

			describe('create artworks', () => {
				let folder: Folder;
				let opts: WorkerRequestCreateArtwork;
				let importFile: string;

				beforeEach(async () => {
					folder = await workerService.orm.Folder.oneOrFailFilter({rootIDs: [mockRoot.id], folderTypes: [FolderType.album], artist: 'artist 1', album: 'album 1'});
					importFile = path.resolve(mockRoot.path, 'import');
					await writeMockImage(importFile, 'png');
					opts = {rootID: mockRoot.id, folderID: folder.id, types: [ArtworkImageType.front], artworkFilename: importFile};
				});

				it('should handle invalid parameters', async () => {
					await expect(workerService.createArtwork({...opts, artworkFilename: ''})).rejects.toThrow('Invalid Artwork File Name');
					await expect(workerService.createArtwork({...opts, rootID: 'invalid'})).rejects.toThrow('Root not found');
					await expect(workerService.createArtwork({...opts, folderID: 'invalid'})).rejects.toThrow('Folder not found');
				});

				it('should handle fs errors', async () => {
					const mockFn = jest.spyOn(fse, 'copy');
					mockFn.mockImplementation(() => Promise.reject(Error('Some fs error')));
					await expect(workerService.createArtwork(opts)).rejects.toThrow('Importing artwork failed');
					expect(mockFn).toHaveBeenCalled();
					mockFn.mockRestore();
				});

				it('should handle image errors', async () => {
					const invalidImageFile = path.resolve(mockRoot.path, 'invalid');
					await fse.writeFile(invalidImageFile, 'INVALID');
					await expect(workerService.createArtwork({...opts, artworkFilename: invalidImageFile})).rejects.toThrow('Image Format invalid/not known');
				});

				it('should create an artwork', async () => {
					const changes = await workerService.createArtwork(opts);
					expectChanges(changes, {foldersUpdate: 1, artworksNew: 1});
					expect(changes.artworks.added.list[0].name).toBe('front.png');
				});

				it('should create & auto name an artwork', async () => {
					const changes = await workerService.createArtwork({...opts, types: []});
					expectChanges(changes, {foldersUpdate: 1, artworksNew: 1});
					expect(changes.artworks.added.list[0].name).toBe('cover.png');
				});

				it('should create & auto unique name an artwork', async () => {
					let changes = await workerService.createArtwork({...opts, types: []});
					expectChanges(changes, {foldersUpdate: 1, artworksNew: 1});
					expect(changes.artworks.added.list[0].name).toBe('cover.png');
					changes = await workerService.createArtwork({...opts, types: []});
					expectChanges(changes, {foldersUpdate: 1, artworksNew: 1});
					expect(changes.artworks.added.list[0].name).toBe('cover-2.png');
				});
			});

			describe('replace artworks', () => {
				let artwork: Artwork;
				let opts: WorkerRequestReplaceArtwork;
				let importFile: string;

				beforeEach(async () => {
					artwork = await workerService.orm.Artwork.oneOrFailFilter({name: 'front.png'});
					importFile = path.resolve(mockRoot.path, 'import');
					await writeMockImage(importFile, 'jpeg');
					opts = {rootID: mockRoot.id, artworkID: artwork.id, artworkFilename: importFile};
				});

				it('should handle invalid parameters', async () => {
					await expect(workerService.replaceArtwork({...opts, artworkFilename: ''})).rejects.toThrow('Invalid Artwork File Name');
					await expect(workerService.replaceArtwork({...opts, rootID: 'invalid'})).rejects.toThrow('Root not found');
					await expect(workerService.replaceArtwork({...opts, artworkID: 'invalid'})).rejects.toThrow('Artwork not found');
				});

				it('should handle fs errors', async () => {
					const mockFn = jest.spyOn(fse, 'copy');
					mockFn.mockImplementation(() => Promise.reject(Error('Some fs error')));
					await expect(workerService.replaceArtwork(opts)).rejects.toThrow('Importing artwork failed');
					expect(mockFn).toHaveBeenCalled();
					mockFn.mockRestore();
				});

				it('should handle image errors', async () => {
					const invalidImageFile = path.resolve(mockRoot.path, 'invalid');
					await fse.writeFile(invalidImageFile, 'INVALID');
					await expect(workerService.replaceArtwork({...opts, artworkFilename: invalidImageFile})).rejects.toThrow('Image Format invalid/not known');
				});

				it('should replace an artwork', async () => {
					const changes = await workerService.replaceArtwork(opts);
					expectChanges(changes, {artworksUpdate: 1});
					expect(changes.artworks.updated.list[0].name).toBe('front.jpeg');
				});
			});

		});

		describe('track tasks', () => {

			describe('move tracks', () => {
				let albumFolder!: Folder;
				let album2Folder!: Folder;
				let album3Folder!: Folder;
				let trackIDs!: Array<string>;
				let opts: WorkerRequestMoveTracks;

				beforeEach(async () => {
					albumFolder = await workerService.orm.Folder.oneOrFailFilter({rootIDs: [mockRoot.id], folderTypes: [FolderType.album], artist: 'artist 1', album: 'album 1'});
					album2Folder = await workerService.orm.Folder.oneOrFailFilter({rootIDs: [mockRoot.id], folderTypes: [FolderType.album], artist: 'artist 1', album: 'album 2'});
					album3Folder = await workerService.orm.Folder.oneOrFailFilter({rootIDs: [mockRoot.id], folderTypes: [FolderType.album], artist: 'artist 2', album: 'album 1'});
					trackIDs = await workerService.orm.Track.findIDsFilter({childOfID: albumFolder.id});
					opts = {rootID: mockRoot.id, trackIDs, newParentID: album3Folder.id};
				});

				it('should handle invalid parameters', async () => {
					await expect(workerService.moveTracks({...opts, newParentID: albumFolder.id})).rejects.toThrow('File name is already used in folder');
					await expect(workerService.moveTracks({...opts, newParentID: album2Folder.id})).rejects.toThrow('File name is already used in folder');
					await expect(workerService.moveTracks({...opts, newParentID: 'invalid'})).rejects.toThrow('Destination Folder not found');
					await expect(workerService.moveTracks({...opts, trackIDs: ['invalid'], newParentID: albumFolder.id})).rejects.toThrow('Track not found');
				});

				it('should move tracks', async () => {
					let changes = await workerService.moveTracks({...opts, newParentID: album3Folder.id});
					expectChanges(changes, {
						artistsUpdate: 1,
						foldersUpdate: 2,
						tracksUpdate: trackIDs.length,
						albumsUpdate: 1
					});

					changes = await workerService.moveTracks({...opts, newParentID: albumFolder.id});
					expectChanges(changes, {
						artistsUpdate: 1,
						foldersUpdate: 2,
						tracksUpdate: trackIDs.length,
						albumsUpdate: 1
					});
				});

			});

			describe('rename tracks', () => {
				let track!: Track;
				let opts: WorkerRequestRenameTrack;

				beforeEach(async () => {
					track = await workerService.orm.Track.findOneOrFail({fileName: {$eq: '2 - title 2 - artist 1.mp3'}});
					const ext = path.extname(track.fileName);
					opts = {rootID: mockRoot.id, trackID: track.id, newName: 'valid' + ext};
				});

				it('should handle invalid parameters', async () => {
					const ext = path.extname(track.fileName);
					await expect(workerService.renameTrack({...opts, newName: ''})).rejects.toThrow('Invalid Name');
					await expect(workerService.renameTrack({...opts, newName: '.'})).rejects.toThrow(/Changing File extension not supported/);
					await expect(workerService.renameTrack({...opts, newName: '/'})).rejects.toThrow('Invalid Name');
					await expect(workerService.renameTrack({...opts, newName: '\\'})).rejects.toThrow('Invalid Name');
					await expect(workerService.renameTrack({...opts, newName: '*' + ext})).rejects.toThrow('Invalid Name');
					await expect(workerService.renameTrack({...opts, newName: '//..*.'})).rejects.toThrow('Invalid Name');
					await expect(workerService.renameTrack({...opts, newName: 'none.invalid'})).rejects.toThrow(/Changing File extension not supported/);
					await expect(workerService.renameTrack({...opts, newName: track.fileName})).rejects.toThrow('File name already used in Destination');
					await expect(workerService.renameTrack({...opts, trackID: 'invalid'})).rejects.toThrow('Track not found');
				});

				it('should handle fs errors', async () => {
					const mockFn = jest.spyOn(fse, 'rename');
					mockFn.mockImplementation(() => Promise.reject(Error('Some fs error')));
					await expect(workerService.renameTrack(opts)).rejects.toThrow('File renaming failed');
					expect(mockFn).toHaveBeenCalled();
					mockFn.mockRestore();
				});

				it('should rename a track', async () => {
					const changes = await workerService.renameTrack(opts);
					expectChanges(changes, {
						foldersUpdate: 1,
						tracksUpdate: 1,
						albumsUpdate: 1,
						artistsUpdate: 1
					});
				});
			});

			describe('remove tracks', () => {
				let track!: Track;
				let opts: WorkerRequestRemoveTracks;

				beforeEach(async () => {
					track = await workerService.orm.Track.findOneOrFail({fileName: {$eq: '2 - title 2 - artist 1.mp3'}});
					opts = {rootID: mockRoot.id, trackIDs: [track.id]};
				});

				it('should handle invalid parameters', async () => {
					await expect(workerService.removeTracks({...opts, rootID: 'invalid'})).rejects.toThrow('Root not found');
					await expect(workerService.removeTracks({...opts, trackIDs: ['invalid']})).rejects.toThrow('Track not found');
				});

				it('should handle fs errors', async () => {
					const mockFn = jest.spyOn(fse, 'move');
					mockFn.mockImplementation(() => Promise.reject(Error('Some fs error')));
					await expect(workerService.removeTracks(opts)).rejects.toThrow('Moving to Trash failed');
					expect(mockFn).toHaveBeenCalled();
					mockFn.mockRestore();
				});

				it('should remove a track', async () => {
					const changes = await workerService.removeTracks({rootID: mockRoot.id, trackIDs: [track.id]});
					expectChanges(changes, {
						foldersUpdate: 1,
						tracksRemoved: 1,
						albumsUpdate: 1,
						artistsUpdate: 1
					});
				});
			});

			describe('update tracks', () => {
				let track: Track;
				let opts: WorkerRequestRefreshTracks;

				beforeEach(async () => {
					track = await workerService.orm.Track.findOneOrFail({fileName: {$eq: '2 - title 2 - artist 1.mp3'}});
					opts = {rootID: mockRoot.id, trackIDs: [track.id]};
				});

				it('should not refresh tracks with invalid parameters', async () => {
					await expect(workerService.refreshTracks({...opts, trackIDs: ['invalid']})).rejects.toThrow('Track not found');
					await expect(workerService.refreshTracks({...opts, rootID: 'invalid'})).rejects.toThrow('Root not found');
				});

				it('should refresh a track', async () => {
					const changes = await workerService.refreshTracks(opts);
					expectChanges(changes, {foldersUpdate: 1, tracksUpdate: 1, artistsUpdate: 1, albumsUpdate: 1});
				});
			});

		});
	});
});