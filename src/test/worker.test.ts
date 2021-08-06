import {EngineService} from '../modules/engine/services/engine.service';
import path from 'path';
import tmp from 'tmp';
import fse from 'fs-extra';
import {WorkerService} from '../modules/engine/services/worker.service';
import {ensureTrailingPathSeparator} from '../utils/fs-utils';
import {AlbumType, ArtworkImageType, DBObjectType, FolderType, RootScanStrategy} from '../types/enums';
import {randomString} from '../utils/random';
import {bindMockConfig, DBConfigs} from './mock/mock.config';
import {waitEngineStart} from './mock/mock.engine';
import {Folder} from '../entity/folder/folder';
import {mockNock, mockNockURL} from './mock/mock.nock';
import {Artwork} from '../entity/artwork/artwork';
import {Container} from 'typescript-ioc';
import {jest} from '@jest/globals';

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
	WorkerRequestUpdateRoot,
	WorkerRequestWriteTrackTags
} from '../modules/engine/services/worker/worker.types';
import {Track} from '../entity/track/track';
import {mockImage, writeMockImage} from './mock/mock.image';
import {buildMockRoot, buildSeriesMockRoot, extendSpecMockRoot, MockRoot, MockSpecRoot, validateMock, writeAndStoreMock, writeMockRoot} from './mock/mock.root';
import {writeMockFolder} from './mock/mock.folder';
import {initTest} from './init';
import {expectChanges, validateMockRoot} from './mock/mock.changes';
import {Orm} from '../modules/engine/services/orm.service';
import {v4} from 'uuid';
import nock from 'nock';
import {StateHelper} from '../entity/state/state.helper';

const UNKNOWN_UUID = v4();

initTest();

describe('WorkerService', () => {
	for (const db of DBConfigs) {
		describe(db.dialect, () => {
			let engine: EngineService;
			let workerService: WorkerService;
			let dir: tmp.DirResult;
			let mockRoot: MockRoot;
			let orm: Orm;

			beforeEach(async () => {
				nock.cleanAll();
				dir = tmp.dirSync();
				bindMockConfig(dir.name, db);
				engine = Container.get(EngineService);
				workerService = engine.io.workerService;
				await engine.init();
				await engine.orm.drop();
				await engine.start();
				await waitEngineStart(engine);
				orm = engine.orm.fork();
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
						const changes = await writeAndStoreMock(mockRoot, workerService, orm);
						await validateMockRoot(mockRoot, changes, workerService, orm);
					});

					afterEach(async () => {
						const mediaPath = ensureTrailingPathSeparator(path.join(dir.name, 'audio'));
						await fse.remove(mediaPath);
					});

					it('should rescan', async () => {
						//Arrange

						//Act
						const changes = await workerService.root.refresh({rootID: mockRoot.id});

						//Assert
						expectChanges(changes, {});
						await validateMock(mockRoot, workerService, orm);
					});
					it('should remove missing in the root', async () => {
						//Arrange
						await fse.remove(mockRoot.path);
						await fse.ensureDir(mockRoot.path);

						//Act
						const changes = await workerService.root.refresh({rootID: mockRoot.id});

						//Assert
						expectChanges(changes, {
							tracksRemoved: mockRoot.expected.tracks,
							foldersUpdate: 1,
							foldersRemoved: mockRoot.expected.folders - 1,
							artistsRemoved: mockRoot.expected.artists.length,
							albumsRemoved: mockRoot.expected.albums,
							seriesRemoved: mockRoot.expected.series,
							artworksRemoved: mockRoot.expected.artworks,
							genresRemoved: mockRoot.expected.genres
						});
						expect(await orm.Folder.count()).toBe(1);
						expect(await orm.Track.count()).toBe(0);
						expect(await orm.Album.count()).toBe(0);
						expect(await orm.Artist.count()).toBe(0);
						expect(await orm.Series.count()).toBe(0);
						expect(await orm.Artwork.count()).toBe(0);
						expect(await orm.Bookmark.count()).toBe(0);
						expect(await orm.Genre.count()).toBe(0);
						expect(await orm.State.count()).toBe(0);
					});
					it('should scan added in the root', async () => {
						//Arrange
						await fse.remove(mockRoot.path);
						await fse.ensureDir(mockRoot.path);
						await workerService.root.refresh({rootID: mockRoot.id});
						await writeMockRoot(mockRoot);

						//Act
						const changes = await workerService.root.refresh({rootID: mockRoot.id});

						//Assert
						expectChanges(changes, {
							tracksNew: mockRoot.expected.tracks,
							foldersUpdate: 1,
							foldersNew: mockRoot.expected.folders - 1,
							artistsNew: mockRoot.expected.artists.length,
							artworksNew: mockRoot.expected.artworks,
							albumsNew: mockRoot.expected.albums,
							seriesNew: mockRoot.expected.series,
							genresNew: mockRoot.expected.genres
						});
						await validateMock(mockRoot, workerService, orm);
					});
					it('should combine/remove artists and albums from different roots', async () => {
						const dir2 = tmp.dirSync();
						const mockRoot2 = buildMockRoot(dir2.name, 2, RootScanStrategy.auto);
						let changes = await writeAndStoreMock(mockRoot2, workerService, orm);
						expectChanges(changes, {
							tracksNew: mockRoot2.expected.tracks,
							foldersNew: mockRoot2.expected.folders,
							artworksNew: mockRoot2.expected.artworks,
							seriesUpdate: mockRoot2.expected.series,
							albumsUpdate: mockRoot2.expected.albums,
							artistsUpdate: mockRoot2.expected.artists.length
						});
						await validateMock(mockRoot2, workerService, orm);
						await fse.remove(mockRoot2.path);
						// dir2.removeCallback();

						await fse.ensureDir(mockRoot2.path);
						changes = await workerService.root.refresh({rootID: mockRoot2.id});
						await fse.remove(mockRoot2.path);
						expectChanges(changes, {
							tracksRemoved: mockRoot2.expected.tracks,
							foldersUpdate: 1,
							foldersRemoved: mockRoot2.expected.folders - 1,
							artworksRemoved: mockRoot2.expected.artworks,
							seriesUpdate: mockRoot2.expected.series,
							albumsUpdate: mockRoot2.expected.albums,
							genresUpdate: mockRoot2.expected.genres,
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
									genre: 'test',
									images: [],
									folders: [
										{
											name: 'album 1',
											genre: 'test',
											folders: [],
											images: [],
											tracks: [
												{
													name: '1 - title 1 - Run Dmc.mp3',
													artist: 'Run Dmc',
													album: 'album 1',
													number: 1,
													total: 3,
													genre: 'test'
												},
												{
													name: '2 - title 2 - Run DMC.mp3',
													artist: 'Run DMC',
													album: 'album 1',
													number: 2,
													total: 3,
													genre: 'test'
												},
												{
													name: '3 - title 2 - Run D_M_C_.mp3',
													artist: 'Run D.M.C.',
													album: 'album 1',
													number: 3,
													total: 3,
													genre: 'test'
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
								genres: 1,
								states: 0,
								folderType: FolderType.collection
							}
						};
						const mockRoot2 = extendSpecMockRoot(rootDir, mockRootSpec2, RootScanStrategy.auto);
						const changes = await writeAndStoreMock(mockRoot2, workerService, orm);
						expectChanges(changes, {
							tracksNew: mockRoot2.expected.tracks,
							foldersNew: mockRoot2.expected.folders,
							artistsNew: mockRoot2.expected.artists.length,
							albumsNew: mockRoot2.expected.albums,
							genresNew: mockRoot2.expected.genres
						});
						await validateMock(mockRoot2, workerService, orm);
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
									genre: 'test 1',
									folders: [
										{
											name: 'album 1',
											genre: 'test 1',
											folders: [],
											images: [],
											tracks: [
												{
													name: '1 - title 1 - artist A.mp3',
													artist: 'artist A',
													album: 'album 1',
													number: 1,
													genre: 'test 1'
												},
												{
													name: '2 - title 2 - artist A.mp3',
													artist: 'artist A',
													album: 'album 1',
													number: 2,
													genre: 'test 1'
												}
											],
											expected: {
												folderType: FolderType.album,
												albumType: AlbumType.album
											}
										},
										{
											name: 'album 2',
											genre: 'test 2',
											folders: [],
											images: [],
											tracks: [
												{
													name: '1 - title 1 - artist B.mp3',
													artist: 'artist B',
													album: 'album 2',
													number: 1,
													genre: 'test 2'
												},
												{
													name: '2 - title 2 - artist B.mp3',
													artist: 'artist B',
													album: 'album 2',
													number: 2,
													genre: 'test 2'
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
								genres: 2,
								states: 0,
								folderType: FolderType.collection
							}
						};
						const mockRoot2 = extendSpecMockRoot(rootDir, mockRootSpec2, RootScanStrategy.auto);
						let changes = await writeAndStoreMock(mockRoot2, workerService, orm);
						expectChanges(changes, {
							tracksNew: mockRoot2.expected.tracks,
							foldersNew: mockRoot2.expected.folders,
							artistsNew: mockRoot2.expected.artists.length,
							albumsNew: mockRoot2.expected.albums,
							genresNew: mockRoot2.expected.genres
						});
						await validateMock(mockRoot2, workerService, orm);

						await fse.remove(mockRoot2.folders[0].folders[1].path);

						// now, update Artist B to Artist A
						mockRoot2.folders[0].folders[1] = {
							path: path.join(rootDir, 'collection', 'album 2'),
							name: 'album 2',
							genre: 'genre 3',
							folders: [],
							images: [],
							tracks: [
								{
									name: '1 - title 1 - artist B.mp3',
									path: path.resolve(rootDir, 'collection', 'album 2', '1 - title 1 - artist B.mp3'),
									artist: 'artist A',
									album: 'album 2',
									number: 1,
									genre: 'genre 3'
								},
								{
									name: '2 - title 2 - artist B.mp3',
									path: path.resolve(rootDir, 'collection', 'album 2', '2 - title 2 - artist B.mp3'),
									artist: 'artist A',
									album: 'album 2',
									number: 2,
									genre: 'genre 3'
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
						changes = await workerService.root.refresh({rootID: mockRoot2.id});
						expectChanges(changes, {
							tracksUpdate: 2, // 2 Tracks must be updated
							foldersUpdate: 3, // Root & Album Folder & Artist Folder must be updated
							albumsRemoved: 1, // (Album 2 by Artist B) must be removed
							albumsNew: 1, // (Album 2 by Artist A) must be added
							artistsRemoved: 1, 	// Artist B must be removed
							artistsUpdate: 1, // Artist A must be updated
							genresNew: 1, // New Genre
							genresRemoved: 1 // Removed Genre
						});
						await validateMock(mockRoot2, workerService, orm);
						await fse.remove(mockRoot2.path);
						dir2.removeCallback();
					});
					it('should remove tracks and states on scan', async () => {
						const admin = await orm.User.oneOrFail({where: {name: 'admin'}});
						const helper = new StateHelper(orm.em);
						const artists = await orm.Artist.findFilter({rootIDs: [mockRoot.id]});
						for (const artist of artists) {
							await helper.fav(artist.id, DBObjectType.artist, admin, false);
						}
						const albums = await orm.Album.findFilter({rootIDs: [mockRoot.id]});
						for (const album of albums) {
							await helper.fav(album.id, DBObjectType.album, admin, false);
						}
						const series = await orm.Series.findFilter({rootIDs: [mockRoot.id]});
						for (const serie of series) {
							await helper.fav(serie.id, DBObjectType.series, admin, false);
						}
						const folders = await orm.Folder.findFilter({rootIDs: [mockRoot.id]});
						for (const folder of folders) {
							await helper.fav(folder.id, DBObjectType.folder, admin, false);
						}
						const tracks = await orm.Track.findFilter({rootIDs: [mockRoot.id]});
						for (const track of tracks) {
							await helper.fav(track.id, DBObjectType.track, admin, false);
						}
						const trackIDs = tracks.map(t => t.id);
						const playlistEntryIDs = await orm.PlaylistEntry.findIDs({where: {track: trackIDs}});
						const playlistEntries = await orm.PlaylistEntry.findByIDs(playlistEntryIDs);
						for (const playlistEntry of playlistEntries) {
							await helper.fav(playlistEntry.id, DBObjectType.playlistentry, admin, false);
						}

						const checkRemoveStates = async (ids: Array<string>) => {
							for (const id of ids) {
								expect(await orm.State.count({where: {destID: id}})).toBe(0); // 'Removed Fav count doesnt match'
							}
						};

						for (const track of tracks) {

							await fse.remove(path.join(track.path, track.fileName));
							const changes = await workerService.root.refresh({rootID: mockRoot.id});
							// const changes = await workerService.track.remove({rootID: mockRoot.id, trackIDs: [track.id]});
							expect(changes.tracks.removed.size).toBe(1); // 'Removed Tracks count doesnt match'
							await checkRemoveStates(changes.artists.removed.ids());
							await checkRemoveStates(changes.albums.removed.ids());
							await checkRemoveStates(changes.series.removed.ids());
							await checkRemoveStates(changes.folders.removed.ids());
							await checkRemoveStates(changes.tracks.removed.ids());
						}
						const album = await orm.Album.findFilter({rootIDs: [mockRoot.id]});
						expect(album.length).toBe(0); // 'All albums should have been removed'
						const artist = await orm.Artist.findFilter({rootIDs: [mockRoot.id]});
						expect(artist.length).toBe(0); // 'All artists should have been removed'
						const serie = await orm.Series.findFilter({rootIDs: [mockRoot.id]});
						expect(serie.length).toBe(0); // 'All series should have been removed'
						const track = await orm.Track.findFilter({rootIDs: [mockRoot.id]});
						expect(track.length).toBe(0); // 'All tracks should have been removed'

						await fse.remove(mockRoot.path);
						await fse.ensureDir(mockRoot.path);
						const changes = await workerService.root.refresh({rootID: mockRoot.id});
						await checkRemoveStates(changes.folders.removed.ids());

						await writeMockRoot(mockRoot);
						const restoreChanges = await workerService.root.refresh({rootID: mockRoot.id});
						expect(restoreChanges.tracks.added.size).toBe(tracks.length); // 'Restored Tracks count doesnt match'
					});
				});

				describe('scan with RootScanStrategy.audiobook', () => {
					beforeEach(async () => {
						const mediaPath = ensureTrailingPathSeparator(path.join(dir.name, 'audio'));
						await fse.mkdir(mediaPath);
						mockRoot = buildSeriesMockRoot(dir.name, 2, RootScanStrategy.audiobook);
						const changes = await writeAndStoreMock(mockRoot, workerService, orm);
						await validateMockRoot(mockRoot, changes, workerService, orm);
					});

					afterEach(async () => {
						const mediaPath = ensureTrailingPathSeparator(path.join(dir.name, 'audio'));
						await fse.remove(mediaPath);
					});

					it('should rescan', async () => {
						const changes = await workerService.root.refresh({rootID: mockRoot.id});
						expectChanges(changes, {});
						await validateMock(mockRoot, workerService, orm);
					});
				});

			});

			describe('process worker tasks', () => {

				beforeEach(async () => {
					const mediaPath = ensureTrailingPathSeparator(path.join(dir.name, 'audio'));
					await fse.mkdir(mediaPath);
					mockRoot = buildMockRoot(mediaPath, 1, RootScanStrategy.auto);
					const changes = await writeAndStoreMock(mockRoot, workerService, orm);
					await validateMockRoot(mockRoot, changes, workerService, orm);
				});

				afterEach(async () => {
					const mediaPath = ensureTrailingPathSeparator(path.join(dir.name, 'audio'));
					await fse.remove(mediaPath);
				});

				describe('folder tasks', () => {

					describe('create folders', () => {
						it('should handle invalid parameters', async () => {
							const folders = await orm.Folder.find({where: {root: mockRoot.id}});
							const folder = folders[0];
							if (!folder) {
								throw Error('Invalid Test Setup');
							}
							await expect(workerService.folder.create({rootID: mockRoot.id, parentID: folder.id, name: ''})).rejects.toThrow('Invalid Directory Name');
							await expect(workerService.folder.create({rootID: mockRoot.id, parentID: folder.id, name: '.'})).rejects.toThrow('Invalid Directory Name');
							await expect(workerService.folder.create({rootID: mockRoot.id, parentID: folder.id, name: '//..*.'})).rejects.toThrow('Invalid Directory Name');
							await expect(workerService.folder.create({rootID: mockRoot.id, parentID: UNKNOWN_UUID, name: 'valid'})).rejects.toThrow('Destination Folder not found');

							const findWithParent = async (): Promise<Folder | undefined> => {
								for (const f of folders) {
									if (await f.parent.get()) {
										return f;
									}
								}
								return;
							};

							const child = await findWithParent();
							if (!child) {
								throw Error('Invalid Test Setup');
							}
							const parentID = child.parent.idOrFail();
							await expect(workerService.folder.create({rootID: mockRoot.id, parentID, name: path.basename(child.path)})).rejects.toThrow('Folder name already used in Destination');
						});

						it('should create a folder', async () => {
							const parent = await orm.Folder.findOneOrFail({where: {root: mockRoot.id}});
							const changes = await workerService.folder.create({rootID: mockRoot.id, parentID: parent.id, name: randomString(10)});
							expectChanges(changes, {
								foldersUpdate: 1,
								foldersNew: 1
							});
						});

					});

					describe('rename folders', () => {
						let folder!: Folder;

						beforeEach(async () => {
							folder = await orm.Folder.findOneOrFail({where: {root: mockRoot.id}});
						});

						it('should handle invalid parameters', async () => {
							await expect(workerService.folder.rename({rootID: mockRoot.id, folderID: folder.id, newName: ''})).rejects.toThrow('Invalid Directory Name');
							await expect(workerService.folder.rename({rootID: mockRoot.id, folderID: folder.id, newName: '.'})).rejects.toThrow('Invalid Directory Name');
							await expect(workerService.folder.rename({rootID: mockRoot.id, folderID: folder.id, newName: '//..*.'})).rejects.toThrow('Invalid Directory Name');
							await expect(workerService.folder.rename({rootID: mockRoot.id, folderID: folder.id, newName: path.basename(folder.path)})).rejects.toThrow('Folder name already used in Destination');
							await expect(workerService.folder.rename({rootID: mockRoot.id, folderID: UNKNOWN_UUID, newName: 'valid'})).rejects.toThrow('Folder not found');
						});

						it('should handle fs errors', async () => {
							const mockFn = jest.spyOn(fse, 'rename');
							mockFn.mockImplementation(() => Promise.reject(Error('Some fs error')));
							await expect(workerService.folder.rename({rootID: mockRoot.id, folderID: folder.id, newName: 'valid'})).rejects.toThrow('Folder renaming failed');
							expect(mockFn).toHaveBeenCalled();
							mockFn.mockRestore();
						});

						it('should rename and update all folder & track paths', async () => {
							const folderIds = await orm.Folder.findIDs({where: {root: mockRoot.id}});
							if (folderIds.length === 0) {
								throw Error('Invalid Test Setup');
							}

							async function testRename(folder: Folder, newName: string): Promise<Folder | undefined> {
								const trackCount = await orm.Track.countFilter({childOfID: folder.id});
								const folderCount = await orm.Folder.countFilter({childOfID: folder.id});
								await workerService.folder.rename({rootID: mockRoot.id, folderID: folder.id, newName});
								const updatedFolder = await orm.Folder.oneOrFailByID(folder.id);
								const all = await orm.Folder.findFilter({childOfID: updatedFolder.id});
								expect(folderCount).toBe(all.length); //  `Folder count does not match: ${updatedFolder.path}`
								for (const f of all) {
									expect(await fse.pathExists(f.path)).toBe(true); // `Folder does not exists: ${f.path}`
								}
								const tracks = await orm.Track.findFilter({childOfID: updatedFolder.id});
								expect(trackCount).toBe(tracks.length); // `Track count does not match: ${updatedFolder.path}`
								for (const track of tracks) {
									expect(await fse.pathExists(path.join(track.path, track.fileName))).toBe(true); //`Track does not exists: ${path.join(track.path, track.fileName)}`
								}
								return updatedFolder;
							}

							for (const id of folderIds) {
								const folder = await orm.Folder.oneOrFailByID(id);
								if (folder.parent.id()) {
									const name = path.basename(folder.path);
									const updatedFolder = await testRename(folder, name + '_renamed');
									if (updatedFolder) {
										await testRename(updatedFolder, name);
									}
								}
							}
						});
					});

					describe('remove folders', () => {
						let rootFolder!: Folder;
						let artistFolder!: Folder;

						beforeEach(async () => {
							rootFolder = await orm.Folder.oneOrFailFilter({rootIDs: [mockRoot.id], level: 0});
							artistFolder = await orm.Folder.oneOrFailFilter({rootIDs: [mockRoot.id], artist: 'artist 1', folderTypes: [FolderType.artist]});
						});

						it('should not remove root folders', async () => {
							await expect(workerService.folder.remove({rootID: mockRoot.id, folderIDs: [rootFolder.id]})).rejects.toThrow('Root folder can not be deleted');
						});

						it('should handle fs errors', async () => {
							const mockFn = jest.spyOn(fse, 'move'); // mock move, since we don't delete, but move to trash folder
							mockFn.mockImplementation(() => Promise.reject(Error('Some fs error')));
							await expect(workerService.folder.remove({rootID: mockRoot.id, folderIDs: [artistFolder.id]})).rejects.toThrow('Folder removing failed');
							expect(mockFn).toHaveBeenCalled();
							mockFn.mockRestore();
						});

						it('should remove folders', async () => {
							const folderCount = (await orm.Folder.countFilter({childOfID: artistFolder.id})) + 1;
							const artworkCount = await orm.Artwork.countFilter({childOfID: artistFolder.id});
							const trackCount = await orm.Track.countFilter({childOfID: artistFolder.id});
							const albumCount = await orm.Album.countFilter({artist: 'artist 1'});
							const changes = await workerService.folder.remove({rootID: mockRoot.id, folderIDs: [artistFolder.id]});
							expectChanges(changes, {
								tracksRemoved: trackCount,
								foldersUpdate: 1,
								foldersRemoved: folderCount,
								artistsRemoved: 2,	// ['artist 1', 'artist 1 with another artist']
								albumsRemoved: albumCount,
								artworksRemoved: artworkCount,
								genresUpdate: 3
							});
							// restore the folder and rescan
							const mockFolder = mockRoot.folders.find(f => f.name === 'artist 1');
							await writeMockFolder(mockFolder!);
							const restorechanges = await workerService.root.refresh({rootID: mockRoot.id});
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
							rootFolder = await orm.Folder.oneOrFailFilter({rootIDs: [mockRoot.id], level: 0});
							albumFolder = await orm.Folder.oneOrFailFilter({rootIDs: [mockRoot.id], album: 'album 3', level: 2, artist: 'artist 1'});
							album2Folder = await orm.Folder.oneOrFailFilter({rootIDs: [mockRoot.id], folderTypes: [FolderType.album], artist: 'artist 2', album: 'album 1'});
							artistFolder = await orm.Folder.oneOrFailFilter({rootIDs: [mockRoot.id], folderTypes: [FolderType.artist], artist: 'artist 2'});
						});

						it('should not move folders with invalid parameters', async () => {
							await expect(workerService.folder.move({rootID: mockRoot.id, newParentID: rootFolder.id, folderIDs: [rootFolder.id]})).rejects.toThrow('Folder cannot be moved to itself');
							await expect(workerService.folder.move({rootID: mockRoot.id, newParentID: rootFolder.id, folderIDs: [artistFolder.id]})).rejects.toThrow('Folder name already used in Destination');
							await expect(workerService.folder.move({rootID: mockRoot.id, newParentID: artistFolder.id, folderIDs: [rootFolder.id]})).rejects.toThrow('Root folder can not be moved');
							await expect(workerService.folder.move({rootID: mockRoot.id, newParentID: artistFolder.id, folderIDs: [artistFolder.id]})).rejects.toThrow('Folder cannot be moved to itself');
							await expect(workerService.folder.move({rootID: mockRoot.id, newParentID: artistFolder.id, folderIDs: [album2Folder.id]})).rejects.toThrow('Folder name already used in Destination');
							await expect(workerService.folder.move({rootID: mockRoot.id, newParentID: UNKNOWN_UUID, folderIDs: [albumFolder.id]})).rejects.toThrow('Destination Folder not found');
							await expect(workerService.folder.move({rootID: mockRoot.id, newParentID: artistFolder.id, folderIDs: [UNKNOWN_UUID]})).rejects.toThrow('Folder not found');
						});

						it('should handle fs errors', async () => {
							const mockFn = jest.spyOn(fse, 'move');
							mockFn.mockImplementation(() => Promise.reject(Error('Some fs error')));
							await expect(workerService.folder.move({rootID: mockRoot.id, newParentID: artistFolder.id, folderIDs: [albumFolder.id]})).rejects.toThrow('Folder moving failed');
							expect(mockFn).toHaveBeenCalled();
							mockFn.mockRestore();
						});

						it('should move folders', async () => {
							const trackCount = await orm.Track.countFilter({childOfID: albumFolder.id});
							const artworkCount = await orm.Artwork.countFilter({childOfID: albumFolder.id});
							const oldParentID = albumFolder.parent.id();
							if (!oldParentID) {
								throw Error('Invalid Test Setup');
							}
							let changes = await workerService.folder.move({rootID: mockRoot.id, newParentID: artistFolder.id, folderIDs: [albumFolder.id]});
							expectChanges(changes, {
								foldersUpdate: 5, // 3 = the multialbum with 2 childs, 1 = the old parent, 1 = the new parent
								artistsUpdate: 1,
								albumsUpdate: 1,
								genresUpdate: 1,
								artworksUpdate: artworkCount,
								tracksUpdate: trackCount
							});
							// move it back
							changes = await workerService.folder.move({rootID: mockRoot.id, newParentID: oldParentID as string, folderIDs: [albumFolder.id]});
							expectChanges(changes, {
								foldersUpdate: 5,
								albumsUpdate: 1,
								artistsUpdate: 1,
								genresUpdate: 1,
								artworksUpdate: artworkCount,
								tracksUpdate: trackCount
							});
						});
					});

					describe('refresh folders', () => {
						let rootFolder!: Folder;
						let opts: WorkerRequestRefreshFolders;

						beforeEach(async () => {
							rootFolder = await orm.Folder.oneOrFailFilter({rootIDs: [mockRoot.id], level: 0});
							opts = {rootID: mockRoot.id, folderIDs: [rootFolder.id]};
						});

						it('should not refresh folders with invalid parameters', async () => {
							await expect(workerService.folder.refresh({...opts, folderIDs: [UNKNOWN_UUID]})).rejects.toThrow('Folder not found');
							await expect(workerService.folder.refresh({...opts, rootID: UNKNOWN_UUID})).rejects.toThrow('Root not found');
						});
						it('should  refresh a folder', async () => {
							const changes = await workerService.folder.refresh(opts);
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
							await expect(workerService.root.create({...opts, path: ''})).rejects.toThrow('Root Directory invalid');
							await expect(workerService.root.create({...opts, path: ' '})).rejects.toThrow('Root Directory invalid');
							await expect(workerService.root.create({...opts, path: '*'})).rejects.toThrow('Root Directory invalid');
							await expect(workerService.root.create({...opts, path: '.'})).rejects.toThrow('Root Directory must be absolute');
							await expect(workerService.root.create({...opts, path: '..'})).rejects.toThrow('Root Directory must be absolute');
							await expect(workerService.root.create({...opts, path: './data/'})).rejects.toThrow('Root Directory must be absolute');
							await expect(workerService.root.create({...opts, path: mockRoot.path})).rejects.toThrow('Root path already used');
						});

						it('should create a root', async () => {
							const mediaPath = ensureTrailingPathSeparator(path.join(dir.name, 'audio2'));
							await fse.mkdir(mediaPath);
							const changes = await workerService.root.create({...opts, path: mediaPath});
							expectChanges(changes, {});
						});

						it('should create a root with inaccessible path', async () => {
							const changes = await workerService.root.create({...opts, path: '/invalid/test/path/'});
							expectChanges(changes, {});
						});

						it('should not allow already scanned path or parts of path in a new root', async () => {
							const changes = await workerService.root.create({...opts, path: '/invalid/test/path/'});
							expectChanges(changes, {});
							await expect(workerService.root.create({...opts, path: '/invalid/test/path/'})).rejects.toThrow('Root path already used');
							await expect(workerService.root.create({...opts, path: '/invalid/test/'})).rejects.toThrow('Root path already used');
							await expect(workerService.root.create({...opts, path: '/invalid/test/path/other'})).rejects.toThrow('Root path already used');
						});
					});

					describe('remove roots', () => {
						it('should handle invalid parameters', async () => {
							await expect(workerService.root.remove({rootID: ''})).rejects.toThrow('Invalid ID');
							await expect(workerService.root.remove({rootID: UNKNOWN_UUID})).rejects.toThrow('Root not found');
						});

						it('should remove a root', async () => {
							const changes = await workerService.root.remove({rootID: mockRoot.id});
							expectChanges(changes, {
								tracksRemoved: mockRoot.expected.tracks,
								artistsRemoved: mockRoot.expected.artists.length,
								albumsRemoved: mockRoot.expected.albums,
								foldersRemoved: mockRoot.expected.folders,
								artworksRemoved: mockRoot.expected.artworks,
								seriesRemoved: mockRoot.expected.series,
								genresRemoved: mockRoot.expected.genres
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
							await expect(workerService.root.update({...opts, rootID: UNKNOWN_UUID})).rejects.toThrow('Root not found');
							await expect(workerService.root.update({...opts, path: ''})).rejects.toThrow('Root Directory invalid');
						});

						it('should update a root name only', async () => {
							const changes = await workerService.root.update({...opts, name: 'something', path: mockRoot.path});
							expectChanges(changes, {});
						});

						it('should update a root path', async () => {
							await fse.mkdir(mediaPath);
							const changes = await workerService.root.update({...opts});
							expectChanges(changes, {
								foldersNew: 1,
								tracksRemoved: mockRoot.expected.tracks,
								artistsRemoved: mockRoot.expected.artists.length,
								albumsRemoved: mockRoot.expected.albums,
								foldersRemoved: mockRoot.expected.folders,
								artworksRemoved: mockRoot.expected.artworks,
								seriesRemoved: mockRoot.expected.series,
								genresRemoved: mockRoot.expected.genres
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
							artwork = await orm.Artwork.oneOrFailFilter({name: 'front.png'});
							folder = await orm.Folder.oneOrFailFilter({rootIDs: [mockRoot.id], folderTypes: [FolderType.album], artist: 'artist 1', album: 'album 1'});
							opts = {rootID: mockRoot.id, artworkIDs: [artwork.id], newParentID: folder.id};
						});

						it('should handle invalid parameters', async () => {
							await expect(workerService.artwork.move({...opts, newParentID: artwork.folder.idOrFail()})).rejects.toThrow('File name is already used in folder');
							await expect(workerService.artwork.move({...opts, rootID: UNKNOWN_UUID})).rejects.toThrow('Root not found');
							await expect(workerService.artwork.move({...opts, artworkIDs: [UNKNOWN_UUID]})).rejects.toThrow('Artwork not found');
							await expect(workerService.artwork.move({...opts, newParentID: UNKNOWN_UUID})).rejects.toThrow('Destination Folder not found');
						});

						it('should move artworks', async () => {
							const oldFolderID = artwork.folder.idOrFail();
							let changes = await workerService.artwork.move({rootID: mockRoot.id, artworkIDs: [artwork.id], newParentID: folder.id});
							expectChanges(changes, {
								foldersUpdate: 2,
								artworksUpdate: 1
							});
							changes = await workerService.artwork.move({rootID: mockRoot.id, artworkIDs: [artwork.id], newParentID: oldFolderID});
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
							artwork = await orm.Artwork.oneOrFailFilter({name: 'front.png'});
							opts = {rootID: mockRoot.id, artworkID: artwork.id, newName: ''};
						});

						it('should handle invalid parameters', async () => {
							const artwork = await orm.Artwork.oneOrFailFilter({name: 'front.png'});
							const ext = path.extname(artwork.name);
							await expect(workerService.artwork.rename({...opts, newName: ''})).rejects.toThrow('Invalid Name');
							await expect(workerService.artwork.rename({...opts, newName: '.'})).rejects.toThrow(/Changing File extension not supported/);
							await expect(workerService.artwork.rename({...opts, newName: '/'})).rejects.toThrow('Invalid Name');
							await expect(workerService.artwork.rename({...opts, newName: '\\'})).rejects.toThrow('Invalid Name');
							await expect(workerService.artwork.rename({...opts, newName: '*' + ext})).rejects.toThrow('Invalid Name');
							await expect(workerService.artwork.rename({...opts, newName: '//..*.'})).rejects.toThrow('Invalid Name');
							await expect(workerService.artwork.rename({...opts, newName: 'none.invalid'})).rejects.toThrow(/Changing File extension not supported/);
							await expect(workerService.artwork.rename({...opts, newName: artwork.name})).rejects.toThrow('File name already used in Destination');
							await expect(workerService.artwork.rename({...opts, artworkID: UNKNOWN_UUID, newName: 'valid' + ext})).rejects.toThrow('Artwork not found');
						});

						it('should handle fs errors', async () => {
							const ext = path.extname(artwork.name);
							const mockFn = jest.spyOn(fse, 'rename');
							mockFn.mockImplementation(() => Promise.reject(Error('Some fs error')));
							await expect(workerService.artwork.rename({...opts, newName: 'valid' + ext})).rejects.toThrow('File renaming failed');
							expect(mockFn).toHaveBeenCalled();
							mockFn.mockRestore();
						});

						it('should rename an artwork', async () => {
							const ext = path.extname(artwork.name);
							const changes = await workerService.artwork.rename({...opts, newName: 'valid' + ext});
							expectChanges(changes, {foldersUpdate: 1, artworksUpdate: 1});
						});
					});

					describe('remove artworks', () => {
						let artwork!: Artwork;
						let opts: WorkerRequestRemoveArtwork;

						beforeEach(async () => {
							artwork = await orm.Artwork.oneOrFailFilter({name: 'front.png'});
							opts = {rootID: mockRoot.id, artworkID: artwork.id};
						});

						it('should handle invalid parameters', async () => {
							await expect(workerService.artwork.remove({...opts, rootID: UNKNOWN_UUID})).rejects.toThrow('Root not found');
							await expect(workerService.artwork.remove({...opts, artworkID: UNKNOWN_UUID})).rejects.toThrow('Artwork not found');
						});

						it('should handle fs errors', async () => {
							const mockFn = jest.spyOn(fse, 'move');
							mockFn.mockImplementation(() => Promise.reject(Error('Some fs error')));
							await expect(workerService.artwork.remove(opts)).rejects.toThrow('Moving to Trash failed');
							expect(mockFn).toHaveBeenCalled();
							mockFn.mockRestore();
						});

						it('should remove an artwork', async () => {
							const changes = await workerService.artwork.remove(opts);
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
							folder = await orm.Folder.oneOrFailFilter({rootIDs: [mockRoot.id], folderTypes: [FolderType.album], artist: 'artist 1', album: 'album 1'});
							opts = {rootID: mockRoot.id, folderID: folder.id, types: [ArtworkImageType.front], artworkURL: ''};
						});

						it('should handle invalid parameters', async () => {
							await expect(workerService.artwork.download({...opts, artworkURL: ''})).rejects.toThrow('Invalid Image URL');
							await expect(workerService.artwork.download({...opts, artworkURL: mockNockURL('invalid')})).rejects.toThrow('Invalid Image URL');
							await expect(workerService.artwork.download({...opts, folderID: UNKNOWN_UUID, artworkURL: mockNockURL('nonexisting.png')})).rejects.toThrow('Folder not found');
						});

						it('should handle 404s', async () => {
							const scope = mockNock()
								.get('/nonexisting.png').reply(404);
							await expect(workerService.artwork.download({...opts, artworkURL: mockNockURL('nonexisting.png')})).rejects.toThrow('Not Found');
							expect(scope.isDone()).toBe(true); // 'No request has been made'
						});

						it('should download', async () => {
							const image = await mockImage('png');
							const scope = mockNock()
								.get('/image.png').reply(200, image.buffer, {'Content-Type': image.mime});
							const changes = await workerService.artwork.download({...opts, artworkURL: mockNockURL('image.png')});
							expect(scope.isDone()).toBe(true); // 'No request has been made'
							expectChanges(changes, {foldersUpdate: 1, artworksNew: 1});
						});
					});

					describe('create artworks', () => {
						let folder: Folder;
						let opts: WorkerRequestCreateArtwork;
						let importFile: string;

						beforeEach(async () => {
							folder = await orm.Folder.oneOrFailFilter({rootIDs: [mockRoot.id], folderTypes: [FolderType.album], artist: 'artist 1', album: 'album 1'});
							importFile = path.resolve(mockRoot.path, 'import');
							await writeMockImage(importFile, 'png');
							opts = {rootID: mockRoot.id, folderID: folder.id, types: [ArtworkImageType.front], artworkFilename: importFile};
						});

						it('should handle invalid parameters', async () => {
							await expect(workerService.artwork.create({...opts, artworkFilename: ''})).rejects.toThrow('Invalid Artwork File Name');
							await expect(workerService.artwork.create({...opts, rootID: UNKNOWN_UUID})).rejects.toThrow('Root not found');
							await expect(workerService.artwork.create({...opts, folderID: UNKNOWN_UUID})).rejects.toThrow('Folder not found');
						});

						it('should handle fs errors', async () => {
							const mockFn = jest.spyOn(fse, 'copy');
							mockFn.mockImplementation(() => Promise.reject(Error('Some fs error')));
							await expect(workerService.artwork.create(opts)).rejects.toThrow('Importing artwork failed');
							expect(mockFn).toHaveBeenCalled();
							mockFn.mockRestore();
						});

						it('should handle image errors', async () => {
							const invalidImageFile = path.resolve(mockRoot.path, 'invalid');
							await fse.writeFile(invalidImageFile, 'INVALID');
							await expect(workerService.artwork.create({...opts, artworkFilename: invalidImageFile})).rejects.toThrow('Image Format invalid/not known');
						});

						it('should create an artwork', async () => {
							const changes = await workerService.artwork.create(opts);
							expectChanges(changes, {foldersUpdate: 1, artworksNew: 1});
							expect((await orm.Artwork.oneOrFailByID(changes.artworks.added.ids()[0])).name).toBe('front.png');
						});

						it('should create & auto name an artwork', async () => {
							const changes = await workerService.artwork.create({...opts, types: []});
							expectChanges(changes, {foldersUpdate: 1, artworksNew: 1});
							expect((await orm.Artwork.oneOrFailByID(changes.artworks.added.ids()[0])).name).toBe('cover.png');
						});

						it('should create & auto unique name an artwork', async () => {
							let changes = await workerService.artwork.create({...opts, types: []});
							expectChanges(changes, {foldersUpdate: 1, artworksNew: 1});
							expect((await orm.Artwork.oneOrFailByID(changes.artworks.added.ids()[0])).name).toBe('cover.png');
							changes = await workerService.artwork.create({...opts, types: []});
							expectChanges(changes, {foldersUpdate: 1, artworksNew: 1});
							expect((await orm.Artwork.oneOrFailByID(changes.artworks.added.ids()[0])).name).toBe('cover-2.png');
						});
					});

					describe('replace artworks', () => {
						let artwork: Artwork;
						let opts: WorkerRequestReplaceArtwork;
						let importFile: string;

						beforeEach(async () => {
							artwork = await orm.Artwork.oneOrFailFilter({name: 'front.png'});
							importFile = path.resolve(mockRoot.path, 'import');
							await writeMockImage(importFile, 'jpeg');
							opts = {rootID: mockRoot.id, artworkID: artwork.id, artworkFilename: importFile};
						});

						it('should handle invalid parameters', async () => {
							await expect(workerService.artwork.replace({...opts, artworkFilename: ''})).rejects.toThrow('Invalid Artwork File Name');
							await expect(workerService.artwork.replace({...opts, rootID: UNKNOWN_UUID})).rejects.toThrow('Root not found');
							await expect(workerService.artwork.replace({...opts, artworkID: UNKNOWN_UUID})).rejects.toThrow('Artwork not found');
						});

						it('should handle fs errors', async () => {
							const mockFn = jest.spyOn(fse, 'copy');
							mockFn.mockImplementation(() => Promise.reject(Error('Some fs error')));
							await expect(workerService.artwork.replace(opts)).rejects.toThrow('Importing artwork failed');
							expect(mockFn).toHaveBeenCalled();
							mockFn.mockRestore();
						});

						it('should handle image errors', async () => {
							const invalidImageFile = path.resolve(mockRoot.path, 'invalid');
							await fse.writeFile(invalidImageFile, 'INVALID');
							await expect(workerService.artwork.replace({...opts, artworkFilename: invalidImageFile})).rejects.toThrow('Image Format invalid/not known');
						});

						it('should replace an artwork', async () => {
							const changes = await workerService.artwork.replace(opts);
							expectChanges(changes, {artworksUpdate: 1});
							expect((await orm.Artwork.oneOrFailByID(changes.artworks.updated.ids()[0])).name).toBe('front.jpeg');
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
							albumFolder = await orm.Folder.oneOrFailFilter({rootIDs: [mockRoot.id], folderTypes: [FolderType.album], artist: 'artist 1', album: 'album 1'});
							album2Folder = await orm.Folder.oneOrFailFilter({rootIDs: [mockRoot.id], folderTypes: [FolderType.album], artist: 'artist 1', album: 'album 2'});
							album3Folder = await orm.Folder.oneOrFailFilter({rootIDs: [mockRoot.id], folderTypes: [FolderType.album], artist: 'artist 2', album: 'album 1'});
							trackIDs = await orm.Track.findIDsFilter({childOfID: albumFolder.id});
							opts = {rootID: mockRoot.id, trackIDs, newParentID: album3Folder.id};
						});

						it('should handle invalid parameters', async () => {
							await expect(workerService.track.move({...opts, newParentID: albumFolder.id})).rejects.toThrow('File name is already used in folder');
							await expect(workerService.track.move({...opts, newParentID: album2Folder.id})).rejects.toThrow('File name is already used in folder');
							await expect(workerService.track.move({...opts, newParentID: UNKNOWN_UUID})).rejects.toThrow('Destination Folder not found');
							await expect(workerService.track.move({...opts, trackIDs: [UNKNOWN_UUID], newParentID: albumFolder.id})).rejects.toThrow('Track not found');
						});

						it('should move tracks', async () => {
							let changes = await workerService.track.move({...opts, newParentID: album3Folder.id});
							expectChanges(changes, {
								artistsUpdate: 1,
								foldersUpdate: 2,
								tracksUpdate: trackIDs.length,
								albumsUpdate: 1,
								genresUpdate: 1
							});

							changes = await workerService.track.move({...opts, newParentID: albumFolder.id});
							expectChanges(changes, {
								artistsUpdate: 1,
								foldersUpdate: 2,
								tracksUpdate: trackIDs.length,
								albumsUpdate: 1,
								genresUpdate: 1
							});
						});

					});

					describe('rename tracks', () => {
						let track!: Track;
						let opts: WorkerRequestRenameTrack;

						beforeEach(async () => {
							track = await orm.Track.findOneOrFail({where: {fileName: '2 - title 2 - artist 1.mp3'}});
							const ext = path.extname(track.fileName);
							opts = {rootID: mockRoot.id, trackID: track.id, newName: 'valid' + ext};
						});

						it('should handle invalid parameters', async () => {
							const ext = path.extname(track.fileName);
							await expect(workerService.track.rename({...opts, newName: ''})).rejects.toThrow('Invalid Name');
							await expect(workerService.track.rename({...opts, newName: '.'})).rejects.toThrow(/Changing File extension not supported/);
							await expect(workerService.track.rename({...opts, newName: '/'})).rejects.toThrow('Invalid Name');
							await expect(workerService.track.rename({...opts, newName: '\\'})).rejects.toThrow('Invalid Name');
							await expect(workerService.track.rename({...opts, newName: '*' + ext})).rejects.toThrow('Invalid Name');
							await expect(workerService.track.rename({...opts, newName: '//..*.'})).rejects.toThrow('Invalid Name');
							await expect(workerService.track.rename({...opts, newName: 'none.invalid'})).rejects.toThrow(/Changing File extension not supported/);
							await expect(workerService.track.rename({...opts, newName: track.fileName})).rejects.toThrow('File name already used in Destination');
							await expect(workerService.track.rename({...opts, trackID: UNKNOWN_UUID})).rejects.toThrow('Track not found');
						});

						it('should handle fs errors', async () => {
							const mockFn = jest.spyOn(fse, 'rename');
							mockFn.mockImplementation(() => Promise.reject(Error('Some fs error')));
							await expect(workerService.track.rename(opts)).rejects.toThrow('File renaming failed');
							expect(mockFn).toHaveBeenCalled();
							mockFn.mockRestore();
						});

						it('should rename a track', async () => {
							const changes = await workerService.track.rename(opts);
							expectChanges(changes, {
								foldersUpdate: 1,
								tracksUpdate: 1,
								albumsUpdate: 1,
								artistsUpdate: 1,
								genresUpdate: 1
							});
						});
					});

					describe('remove tracks', () => {
						let track!: Track;
						let opts: WorkerRequestRemoveTracks;

						beforeEach(async () => {
							track = await orm.Track.findOneOrFail({where: {fileName: '2 - title 2 - artist 1.mp3'}});
							opts = {rootID: mockRoot.id, trackIDs: [track.id]};
						});

						it('should handle invalid parameters', async () => {
							await expect(workerService.track.remove({...opts, rootID: UNKNOWN_UUID})).rejects.toThrow('Root not found');
							await expect(workerService.track.remove({...opts, trackIDs: [UNKNOWN_UUID]})).rejects.toThrow('Track not found');
						});

						it('should handle fs errors', async () => {
							const mockFn = jest.spyOn(fse, 'move');
							mockFn.mockImplementation(() => Promise.reject(Error('Some fs error')));
							await expect(workerService.track.remove(opts)).rejects.toThrow('Moving to Trash failed');
							expect(mockFn).toHaveBeenCalled();
							mockFn.mockRestore();
						});

						it('should remove a track', async () => {
							const changes = await workerService.track.remove({rootID: mockRoot.id, trackIDs: [track.id]});
							expectChanges(changes, {
								foldersUpdate: 1,
								tracksRemoved: 1,
								albumsUpdate: 1,
								artistsUpdate: 1,
								genresUpdate: 1
							});
						});
					});

					describe('update tracks', () => {
						let track: Track;
						let opts: WorkerRequestRefreshTracks;

						beforeEach(async () => {
							track = await orm.Track.findOneOrFail({where: {fileName: '2 - title 2 - artist 1.mp3'}});
							opts = {rootID: mockRoot.id, trackIDs: [track.id]};
						});

						it('should not refresh tracks with invalid parameters', async () => {
							await expect(workerService.track.refresh({...opts, trackIDs: [UNKNOWN_UUID]})).rejects.toThrow('Track not found');
							await expect(workerService.track.refresh({...opts, rootID: UNKNOWN_UUID})).rejects.toThrow('Root not found');
						});

						it('should refresh a track', async () => {
							const changes = await workerService.track.refresh(opts);
							expectChanges(changes, {foldersUpdate: 1, tracksUpdate: 1, artistsUpdate: 1, albumsUpdate: 1, genresUpdate: 1});
						});

						it('should refresh change an album type after track updates', async () => {
							const album = await orm.Album.oneOrFailFilter({artist: 'artist 1', name: 'album 1'});
							expect(album.albumType).toBe(AlbumType.album);
							const tracks = await album.tracks.getItems();
							const req: WorkerRequestWriteTrackTags = {
								rootID: mockRoot.id,
								tags: []
							};
							for (const track of tracks) {
								const rawTag = await engine.audio.readRawTag(path.join(track.path, track.fileName));
								if (!rawTag) {
									throw new Error('Invalid Test Setup');
								}
								rawTag.frames.TXXX = [
									{id: 'TXXX', value: {id: 'MusicBrainz Album Status', text: 'bootleg'}}
								];
								req.tags.push({trackID: track.id, tag: rawTag});
							}
							const changes = await workerService.track.writeTags(req);
							expectChanges(changes, {foldersUpdate: 3, tracksUpdate: tracks.length, artistsUpdate: 1, albumsUpdate: 1, genresUpdate: 1});
							const updatedAlbum = await orm.Album.oneOrFailFilter({artist: 'artist 1', name: 'album 1'});
							expect(updatedAlbum.albumType).toBe(AlbumType.bootleg);
						});
						it('should refresh change an album artist after track updates', async () => {
							const album = await orm.Album.oneOrFailFilter({artist: 'artist 1', name: 'album 1'});
							expect(album.albumType).toBe(AlbumType.album);
							const tracks = await album.tracks.getItems();
							const req: WorkerRequestWriteTrackTags = {
								rootID: mockRoot.id,
								tags: []
							};
							for (const track of tracks) {
								const rawTag = await engine.audio.readRawTag(path.join(track.path, track.fileName));
								if (!rawTag) {
									throw new Error('Invalid Test Setup');
								}
								rawTag.frames.TPE1 = [
									{id: 'TPE1', value: {text: 'artist 5'}}
								];
								req.tags.push({trackID: track.id, tag: rawTag});
							}
							const changes = await workerService.track.writeTags(req);
							expectChanges(changes, {foldersUpdate: 3, tracksUpdate: tracks.length, artistsUpdate: 2, albumsRemoved: 1, albumsNew: 1, genresUpdate: 1});
							await orm.Album.oneOrFailFilter({artist: 'artist 5', name: 'album 1'});
						});
					});

				});
			});
		});
	}
});
