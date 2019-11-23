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

export interface MockTrack {
	path: string;
	number: number;
	genre: string;
	artist: string;
	albumArtist?: string;
	album: string;
}

export interface MockFolder {
	path: string;
	name: string;
	genre?: string;
	folders: Array<MockFolder>;
	tracks: Array<MockTrack>;
	expected: {
		folderType?: FolderType;
		albumType?: AlbumType;
	};
}

export interface MockRoot extends MockFolder {
	id: string;
	path: string;
	name: string;
	folders: Array<MockFolder>;
	expected: {
		folders: number;
		tracks: number;
		artists: number;
		albums: number;
		folderType?: FolderType;
	};
}

export function buildMockRoot(dir: string, nr: number, id: string): MockRoot {
	const rootDir = path.join(dir, `root${nr}`);
	return {
		id,
		path: rootDir,
		name: `root${nr}`,
		folders: [
			{
				path: path.join(rootDir, 'artist 1'),
				name: 'artist 1',
				genre: '',
				folders: [
					{
						path: path.join(rootDir, 'artist 1', 'album 1'),
						name: 'album 1',
						genre: 'Genre 1',
						folders: [],
						tracks: [
							{
								path: path.resolve(rootDir, 'artist 1', 'album 1', '1 - title 1 - artist 1.mp3'),
								artist: 'artist 1',
								album: 'album 1',
								number: 1,
								genre: 'Genre 1'
							},
							{
								path: path.resolve(rootDir, 'artist 1', 'album 1', '2 - title 2 - artist 1.mp3'),
								artist: 'artist 1',
								album: 'album 1',
								number: 2,
								genre: 'Genre 1'
							},
							{
								path: path.resolve(rootDir, 'artist 1', 'album 1', '3 - title 3 - artist 1.mp3'),
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
						path: path.join(rootDir, 'artist 1', 'album 2'),
						name: 'album 2',
						genre: 'Genre 1',
						folders: [],
						tracks: [
							{
								path: path.join(rootDir, 'artist 1', 'album 2', '1 - title 1 - artist 1.mp3'),
								artist: 'artist 1',
								album: 'album 2',
								number: 1,
								genre: 'Genre 1'
							},
							{
								path: path.join(rootDir, 'artist 1', 'album 2', '2 - title 2 - artist 1.mp3'),
								artist: 'artist 1',
								album: 'album 2',
								number: 2,
								genre: 'Genre 1'
							},
							{
								path: path.join(rootDir, 'artist 1', 'album 2', '3 - title 3 - artist 1 with another artist.mp3'),
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
						path: path.join(rootDir, 'artist 1', 'album 3'),
						name: 'album 3',
						genre: 'Genre 3',
						folders: [
							{
								path: path.join(rootDir, 'artist 1', 'album 3', 'cd 1'),
								name: 'cd 1',
								genre: 'Genre 3',
								folders: [],
								tracks: [
									{
										path: path.join(rootDir, 'artist 1', 'album 3', 'cd 1', '1 - cd 1 - title 1 - artist 1.mp3'),
										artist: 'artist 1',
										album: 'album 3',
										number: 1,
										genre: 'Genre 3'
									},
									{
										path: path.join(rootDir, 'artist 1', 'album 3', 'cd 1', '2 - cd 1 - title 2 - artist 1.mp3'),
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
								path: path.join(rootDir, 'artist 1', 'album 3', 'cd 2'),
								name: 'cd 2',
								genre: 'Genre 3',
								folders: [],
								tracks: [
									{
										path: path.join(rootDir, 'artist 1', 'album 3', 'cd 2', '1 - cd 2 - title 1 - artist 1.mp3'),
										artist: 'artist 1',
										album: 'album 3',
										number: 1,
										genre: 'Genre 3'
									},
									{
										path: path.join(rootDir, 'artist 1', 'album 3', 'cd 2', '2 - cd 2 - title 2 - artist 1.mp3'),
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
				path: path.join(rootDir, 'artist 2'),
				name: 'artist 2',
				genre: '',
				folders: [
					{
						path: path.join(rootDir, 'artist 2', 'album 1'),
						name: 'album 1',
						genre: 'Genre 1',
						folders: [],
						tracks: [
							{
								path: path.resolve(rootDir, 'artist 2', 'album 1', '1 - title 1 - artist 2.mp3'),
								artist: 'artist 2',
								album: 'album 1',
								number: 1,
								genre: 'Genre 1'
							},
							{
								path: path.resolve(rootDir, 'artist 2', 'album 1', '2 - title 2 - artist 2.mp3'),
								artist: 'artist 2',
								album: 'album 1',
								number: 2,
								genre: 'Genre 1'
							},
							{
								path: path.resolve(rootDir, 'artist 2', 'album 1', '3 - title 3 - artist 2.mp3'),
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
				path: path.join(rootDir, 'compilation 1'),
				name: 'compilation 1',
				genre: '',
				folders: [],
				tracks: [
					{
						path: path.resolve(rootDir, 'compilation 1', '1 - title 1 - artist c1.mp3'),
						artist: 'artist c1',
						album: 'compilation 1',
						number: 1,
						genre: 'Genre 1'
					},
					{
						path: path.resolve(rootDir, 'compilation 1', '2 - title 2 - artist c2.mp3'),
						artist: 'artist c2',
						album: 'compilation 1',
						number: 2,
						genre: 'Genre 2'
					},
					{
						path: path.resolve(rootDir, 'compilation 1', '3 - title 3 - artist c3.mp3'),
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
			}
		],
		tracks: [],
		expected: {
			folders: 10,
			tracks: 16,
			artists: 7, // ['artist 1', 'artist 1 with another artist', 'artist 2', 'artist c1', 'Various Artists', 'artist c2', 'artist c3']
			albums: 5,
			folderType: FolderType.collection
		}
	};
}

async function writeMockTrack(track: MockTrack): Promise<void> {
	await writeMP3Track(track.path, track.album, track.artist, track.number, track.genre, track.albumArtist);
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
