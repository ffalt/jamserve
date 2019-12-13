import fse from 'fs-extra';
import path from 'path';
import tmp from 'tmp';
import {DBObjectType} from '../../db/db.types';
import {AlbumType, FolderType, RootScanStrategy} from '../../model/jam-types';
import {writeMP3Track} from '../../modules/audio/audio.mock';
import {AudioModule} from '../../modules/audio/audio.module';
import {ImageModule} from '../../modules/image/image.module';
import {Root} from '../root/root.model';
import {WorkerService} from '../worker/worker.service';
import {Store} from './store';

export interface MockSpecTrack {
	name: string;
	number: number;
	genre: string;
	artist: string;
	albumArtist?: string;
	album: string;
	group?: string;
	groupNr?: string;
}

export interface MockSpecFolder {
	name: string;
	genre?: string;
	folders: Array<MockSpecFolder>;
	tracks: Array<MockSpecTrack>;
	expected: {
		folderType?: FolderType;
		albumType?: AlbumType;
	};
}

export interface MockSpecRoot extends MockSpecFolder {
	id: string;
	albums?: Array<MockSpecAlbum>;
	expected: {
		folders: number;
		tracks: number;
		artists: number;
		series: number;
		albums: number;
		folderType?: FolderType;
	};
}

export interface MockTrack extends MockSpecTrack {
	path: string;
}

export interface MockSpecAlbum {
	artist: string;
	name: string;
	albumType: AlbumType;
}

export interface MockFolder extends MockSpecFolder {
	path: string;
	folders: Array<MockFolder>;
	tracks: Array<MockTrack>;
}

export interface MockRoot extends MockSpecRoot {
	path: string;
	folders: Array<MockFolder>;
	tracks: Array<MockTrack>;
}

export function extendSpecMockTrack(dir: string, track: MockSpecTrack): MockTrack {
	return {...track, path: path.join(dir, track.name)};
}

export function extendSpecMockFolder(dir: string, folder: MockSpecFolder): MockFolder {
	const folderPath = path.join(dir, folder.name);
	return {
		...folder,
		path: folderPath,
		folders: folder.folders.map(f => extendSpecMockFolder(folderPath, f)),
		tracks: folder.tracks.map(t => extendSpecMockTrack(folderPath, t))
	};
}

export function extendSpecMockRoot(dir: string, root: MockSpecRoot): MockRoot {
	return {
		...root,
		path: dir,
		folders: root.folders.map(f => extendSpecMockFolder(dir, f)),
		tracks: root.tracks.map(t => extendSpecMockTrack(dir, t))
	};
}

export function buildMockRoot(dir: string, nr: number, id: string): MockRoot {
	const rootDir = path.join(dir, `root${nr}`);
	const spec: MockSpecRoot = {
		id,
		name: `root${nr}`,
		folders: [
			{
				name: 'artist 1',
				genre: '',
				folders: [
					{
						name: 'album 1',
						genre: 'Genre 1',
						folders: [],
						tracks: [
							{
								name: '1 - title 1 - artist 1.mp3',
								artist: 'artist 1',
								album: 'album 1',
								number: 1,
								genre: 'Genre 1'
							},
							{
								name: '2 - title 2 - artist 1.mp3',
								artist: 'artist 1',
								album: 'album 1',
								number: 2,
								genre: 'Genre 1'
							},
							{
								name: '3 - title 3 - artist 1.mp3',
								artist: 'artist 1',
								album: 'album 1',
								number: 3,
								genre: 'Genre 1'
							}
						],
						expected: {
							folderType: FolderType.album,
							albumType: AlbumType.album
						}
					},
					{
						name: 'album 2',
						genre: 'Genre 1',
						folders: [],
						tracks: [
							{
								name: '1 - title 1 - artist 1.mp3',
								artist: 'artist 1',
								album: 'album 2',
								number: 1,
								genre: 'Genre 1'
							},
							{
								name: '2 - title 2 - artist 1.mp3',
								artist: 'artist 1',
								album: 'album 2',
								number: 2,
								genre: 'Genre 1'
							},
							{
								name: '3 - title 3 - artist 1 with another artist.mp3',
								artist: 'artist 1 with another artist',
								albumArtist: 'artist 1',
								album: 'album 2',
								number: 3,
								genre: 'Genre 2'
							}],
						expected: {
							folderType: FolderType.album,
							albumType: AlbumType.album
						}
					},
					{
						name: 'album 3',
						genre: 'Genre 3',
						folders: [
							{
								name: 'cd 1',
								genre: 'Genre 3',
								folders: [],
								tracks: [
									{
										name: '1 - cd 1 - title 1 - artist 1.mp3',
										artist: 'artist 1',
										album: 'album 3',
										number: 1,
										genre: 'Genre 3'
									},
									{
										name: '2 - cd 1 - title 2 - artist 1.mp3',
										artist: 'artist 1',
										album: 'album 3',
										number: 2,
										genre: 'Genre 3'
									}
								],
								expected: {
									folderType: FolderType.multialbum,
									albumType: AlbumType.album
								}
							},
							{
								name: 'cd 2',
								genre: 'Genre 3',
								folders: [],
								tracks: [
									{
										name: '1 - cd 2 - title 1 - artist 1.mp3',
										artist: 'artist 1',
										album: 'album 3',
										number: 1,
										genre: 'Genre 3'
									},
									{
										name: '2 - cd 2 - title 2 - artist 1.mp3',
										artist: 'artist 1',
										album: 'album 3',
										number: 2,
										genre: 'Genre 3'
									}
								],
								expected: {
									folderType: FolderType.multialbum,
									albumType: AlbumType.album
								}
							}
						],
						tracks: [],
						expected: {
							folderType: FolderType.multialbum,
							albumType: AlbumType.album
						}
					}
				],
				tracks: [],
				expected: {
					folderType: FolderType.artist
				}
			},
			{
				name: 'artist 2',
				genre: '',
				folders: [
					{
						name: 'album 1',
						genre: 'Genre 1',
						folders: [],
						tracks: [
							{
								name: '1 - title 1 - artist 2.mp3',
								artist: 'artist 2',
								album: 'album 1',
								number: 1,
								genre: 'Genre 1'
							},
							{
								name: '2 - title 2 - artist 2.mp3',
								artist: 'artist 2',
								album: 'album 1',
								number: 2,
								genre: 'Genre 1'
							},
							{
								name: '3 - title 3 - artist 2.mp3',
								artist: 'artist 2',
								album: 'album 1',
								number: 3,
								genre: 'Genre 2'
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
			},
			{
				name: 'compilation 1',
				genre: '',
				folders: [],
				tracks: [
					{
						name: '1 - title 1 - artist c1.mp3',
						artist: 'artist c1',
						album: 'compilation 1',
						number: 1,
						genre: 'Genre 1'
					},
					{
						name: '2 - title 2 - artist c2.mp3',
						artist: 'artist c2',
						album: 'compilation 1',
						number: 2,
						genre: 'Genre 2'
					},
					{
						name: '3 - title 3 - artist c3.mp3',
						artist: 'artist c3',
						album: 'compilation 1',
						number: 3,
						genre: 'Genre 3'
					}
				],
				expected: {
					folderType: FolderType.album,
					albumType: AlbumType.compilation
				}
			},
			{
				name: 'artist 5',
				genre: '',
				folders: [
					{
						name: 'series 1',
						genre: 'Audiobook',
						folders: [],
						tracks: [
							{
								name: '1 - title 1 - series 1 album 1 - artist 5.mp3',
								artist: 'artist 5',
								group: 'series 1',
								groupNr: '1',
								album: 'series 1 album 1',
								number: 1,
								genre: 'Audiobook'
							},
							{
								name: '1 - title 1 - series 1 album 2 - artist 5.mp3',
								artist: 'artist 5',
								group: 'series 1',
								groupNr: '2',
								album: 'series 1 album 2',
								number: 1,
								genre: 'Audiobook'
							},
							{
								name: '3 - title 3 - series 1 album 3 - artist 5.mp3',
								artist: 'artist 5',
								group: 'series 1',
								groupNr: '3',
								album: 'series 1 album 3',
								number: 1,
								genre: 'Audiobook'
							}
						],
						expected: {
							folderType: FolderType.collection
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
			folders: 12,
			tracks: 19,
			artists: 8, // ['artist 1', 'artist 1 with another artist', 'artist 2', 'artist c1', 'Various Artists', 'artist c2', 'artist c3', 'artist 5']
			albums: 8,
			series: 1,
			folderType: FolderType.collection
		}
	};
	return extendSpecMockRoot(rootDir, spec);
}

export function buildSeriesMockRoot(dir: string, nr: number, id: string): MockRoot {
	const rootDir = path.join(dir, `root${nr}`);
	const spec: MockSpecRoot = {
		id,
		name: `root${nr}`,
		folders: [
			{
				name: 'audiobook series 1',
				genre: '',
				folders: [
					{
						name: 'album 1',
						genre: 'audio series',
						folders: [],
						tracks: [
							{
								name: '1 - title 1 - audiobook series 1.mp3',
								group: 'audiobook series 1',
								artist: 'audiobook series 1',
								album: 'album 1',
								groupNr: 'episode 1',
								number: 1,
								genre: 'audio series'
							},
							{
								name: '2 - title 2 - audiobook series 1.mp3',
								group: 'audiobook series 1',
								artist: 'audiobook series 1',
								album: 'album 1',
								groupNr: 'episode 1',
								number: 2,
								genre: 'audio series'
							},
							{
								name: '3 - title 3 - audiobook series 1.mp3',
								group: 'audiobook series 1',
								artist: 'audiobook series 1',
								album: 'album 1',
								groupNr: 'episode 1',
								number: 3,
								genre: 'audio series'
							}
						],
						expected: {
							folderType: FolderType.album,
							albumType: AlbumType.audiobook
						}
					},
					{
						name: 'album 2',
						genre: 'audio series',
						folders: [],
						tracks: [
							{
								name: '1 - title 1 - audiobook series 1.mp3',
								group: 'audiobook series 1',
								artist: 'audiobook series 1',
								album: 'album 2',
								number: 1,
								groupNr: 'episode 2',
								genre: 'audio series'
							},
							{
								name: '2 - title 2 - audiobook series 1.mp3',
								group: 'audiobook series 1',
								artist: 'audiobook series 1',
								album: 'album 2',
								number: 2,
								groupNr: 'episode 2',
								genre: 'audio series'
							},
							{
								name: '3 - title 3 - audiobook series 1.mp3',
								group: 'audiobook series 1',
								artist: 'audiobook series 1',
								albumArtist: 'audiobook series 1',
								album: 'album 2',
								groupNr: 'episode 2',
								number: 3,
								genre: 'audio series'
							}],
						expected: {
							folderType: FolderType.album,
							albumType: AlbumType.audiobook
						}
					},
					{
						name: 'album 3',
						genre: 'audio series',
						folders: [
							{
								name: 'cd 1',
								genre: 'audio series',
								folders: [],
								tracks: [
									{
										name: '1 - cd 1 - title 1 - audiobook series 1.mp3',
										group: 'audiobook series 1',
										artist: 'audiobook series 1',
										album: 'album 3',
										number: 1,
										groupNr: 'episode 3',
										genre: 'audio series'
									},
									{
										name: '2 - cd 1 - title 2 - audiobook series 1.mp3',
										group: 'audiobook series 1',
										artist: 'audiobook series 1',
										album: 'album 3',
										groupNr: 'episode 3',
										number: 2,
										genre: 'audio series'
									}
								],
								expected: {
									folderType: FolderType.multialbum,
									albumType: AlbumType.audiobook
								}
							},
							{
								name: 'cd 2',
								genre: 'audio series',
								folders: [],
								tracks: [
									{
										name: '1 - cd 2 - title 1 - audiobook series 1.mp3',
										group: 'audiobook series 1',
										artist: 'audiobook series 1',
										album: 'album 3',
										groupNr: 'episode 3',
										number: 1,
										genre: 'audio series'
									},
									{
										name: '2 - cd 2 - title 2 - audiobook series 1.mp3',
										group: 'audiobook series 1',
										artist: 'audiobook series 1',
										album: 'album 3',
										groupNr: 'episode 3',
										number: 2,
										genre: 'audio series'
									}
								],
								expected: {
									folderType: FolderType.multialbum,
									albumType: AlbumType.audiobook
								}
							}
						],
						tracks: [],
						expected: {
							folderType: FolderType.multialbum,
							albumType: AlbumType.audiobook
						}
					}
				],
				tracks: [],
				expected: {
					folderType: FolderType.artist
				}
			},
			{
				name: 'audiobook series 2',
				genre: 'audio series',
				folders: [],
				tracks: [
					{
						name: '1 - title 1 - audiobook series 2.mp3',
						group: 'audiobook series 2',
						artist: 'audiobook series 2',
						album: 'album 1',
						groupNr: 'episode 1',
						number: 1,
						genre: 'audio series'
					},
					{
						name: '2 - title 2 - audiobook series 2.mp3',
						group: 'audiobook series 2',
						artist: 'audiobook series 2',
						album: 'album 2',
						groupNr: 'episode 2',
						number: 2,
						genre: 'audio series'
					},
					{
						name: '3 - title 3 - audiobook series 2.mp3',
						group: 'audiobook series 2',
						artist: 'audiobook series 2',
						album: 'album 3',
						groupNr: 'episode 3',
						number: 3,
						genre: 'audio series'
					}],
				expected: {
					folderType: FolderType.artist
				}
			},
			{
				name: 'audiobook series 3',
				genre: 'audio series',
				folders: [
					{
						name: 'album 4',
						genre: 'audio series',
						folders: [
							{
								name: 'cd 1',
								genre: 'audio series',
								folders: [],
								tracks: [
									{
										name: '1 - cd 1 - title 1 - audiobook series 3.mp3',
										group: 'audiobook series 3',
										artist: 'audiobook series 3',
										album: 'album 4',
										number: 1,
										groupNr: 'episode 4',
										genre: 'audio series'
									},
									{
										name: '2 - cd 1 - title 2 - audiobook series 3.mp3',
										group: 'audiobook series 3',
										artist: 'audiobook series 3',
										album: 'album 4',
										groupNr: 'episode 4',
										number: 2,
										genre: 'audio series'
									}
								],
								expected: {
									folderType: FolderType.multialbum,
									albumType: AlbumType.audiobook
								}
							},
							{
								name: 'cd 2',
								genre: 'audio series',
								folders: [],
								tracks: [
									{
										name: '1 - cd 2 - title 1 - audiobook series 3.mp3',
										group: 'audiobook series 3',
										artist: 'audiobook series 3',
										album: 'album 4',
										groupNr: 'episode 4',
										number: 1,
										genre: 'audio series'
									},
									{
										name: '2 - cd 2 - title 2 - audiobook series 3.mp3',
										group: 'audiobook series 3',
										artist: 'audiobook series 3',
										album: 'album 4',
										groupNr: 'episode 4',
										number: 2,
										genre: 'audio series'
									}
								],
								expected: {
									folderType: FolderType.multialbum,
									albumType: AlbumType.audiobook
								}
							}
						],
						tracks: [],
						expected: {
							folderType: FolderType.multialbum,
							albumType: AlbumType.audiobook
						}
					}
				],
				tracks: [
					{
						name: '1 - title 1 - audiobook series 3.mp3',
						artist: 'audiobook series 3',
						group: 'audiobook series 3',
						album: 'album 1',
						groupNr: 'episode 1',
						number: 1,
						genre: 'audio series'
					},
					{
						name: '2 - title 2 - audiobook series 3.mp3',
						artist: 'audiobook series 3',
						group: 'audiobook series 3',
						album: 'album 2',
						groupNr: 'episode 2',
						number: 2,
						genre: 'audio series'
					},
					{
						name: '3 - title 3 - audiobook series 3.mp3',
						artist: 'audiobook series 3',
						group: 'audiobook series 3',
						album: 'album 3',
						groupNr: 'episode 3',
						number: 3,
						genre: 'audio series'
					}],
				expected: {
					folderType: FolderType.artist
				}
			}
		],
		tracks: [],
		albums: [
			{artist: 'audiobook series 1', name: 'album 1', albumType: AlbumType.audiobook},
			{artist: 'audiobook series 1', name: 'album 2', albumType: AlbumType.audiobook},
			{artist: 'audiobook series 1', name: 'album 3', albumType: AlbumType.audiobook},
			{artist: 'audiobook series 2', name: 'album 1', albumType: AlbumType.audiobook},
			{artist: 'audiobook series 2', name: 'album 2', albumType: AlbumType.audiobook},
			{artist: 'audiobook series 2', name: 'album 3', albumType: AlbumType.audiobook},
			{artist: 'audiobook series 3', name: 'album 1', albumType: AlbumType.audiobook},
			{artist: 'audiobook series 3', name: 'album 2', albumType: AlbumType.audiobook},
			{artist: 'audiobook series 3', name: 'album 3', albumType: AlbumType.audiobook},
			{artist: 'audiobook series 3', name: 'album 4', albumType: AlbumType.audiobook}
		],
		expected: {
			folders: 12,
			tracks: 20,
			series: 3,
			artists: 3,
			albums: 10,
			folderType: FolderType.collection
		}
	};
	return extendSpecMockRoot(rootDir, spec);
}

async function writeMockTrack(track: MockTrack): Promise<void> {
	await writeMP3Track(track.path, track.album, track.artist, track.number, track.genre, track.albumArtist, track.group, track.groupNr);
}

export async function writeMockFolder(f: MockFolder): Promise<void> {
	await fse.ensureDir(f.path);
	for (const folder of f.folders) {
		await writeMockFolder(folder);
	}
	for (const track of f.tracks) {
		await writeMockTrack(track);
	}
}

export async function writeMockRoot(root: MockRoot): Promise<void> {
	await fse.ensureDir(root.path);
	for (const folder of root.folders) {
		await writeMockFolder(folder);
	}
}

export async function removeMockFolder(f: MockFolder): Promise<void> {
	for (const folder of f.folders) {
		await removeMockFolder(folder);
	}
	for (const track of f.tracks) {
		try {
			await fse.unlink(track.path);
		} catch (e) {
			// ignore not existing files (may be deleted by test
		}
	}
	await fse.rmdir(f.path);
}

export async function removeMockRoot(root: MockRoot): Promise<void> {
	const exists = await fse.pathExists(path.join(root.path, '.trash'));
	if (exists) {
		await fse.remove(path.join(root.path, '.trash'));
	}
	for (const folder of root.folders) {
		await removeMockFolder(folder);
	}
	await fse.rmdir(root.path);
}

export class StoreMock {
	dir!: tmp.DirResult;
	mockRoot!: MockRoot;

	constructor(public store: Store) {
	}

	async setup(imageModule: ImageModule, audioModule: AudioModule): Promise<void> {
		this.dir = tmp.dirSync();
		this.mockRoot = buildMockRoot(this.dir.name, 1, 'rootID1');
		await writeMockRoot(this.mockRoot);
		const root: Root = {
			id: this.mockRoot.id,
			type: DBObjectType.root,
			name: this.mockRoot.name,
			path: this.mockRoot.path,
			created: Date.now(),
			strategy: RootScanStrategy.auto
		};
		await this.store.rootStore.add(root);
		const workerService = new WorkerService(this.store, audioModule, imageModule);
		await workerService.refreshRoot({rootID: root.id, forceMetaRefresh: false});
	}

	async cleanup(): Promise<void> {
		await removeMockRoot(this.mockRoot);
		this.dir.removeCallback();
	}
}
