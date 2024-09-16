import path from 'path';
import fse from 'fs-extra';
import {AlbumType, DBObjectType, FolderType, PodcastStatus, RootScanStrategy} from '../../types/enums.js';
import {WorkerService} from '../../modules/engine/services/worker.service.js';
import {ensureTrailingPathSeparator} from '../../utils/fs-utils.js';
import {extendSpecMockFolder, MockFolder, MockSpecFolder, writeMockFolder} from './mock.folder';
import {extendSpecMockTrack, MockTrack} from './mock.track';
import {Changes} from '../../modules/engine/worker/changes.js';
import {Orm} from '../../modules/engine/services/orm.service.js';
import {StateHelper} from '../../entity/state/state.helper.js';

export interface MockSpecRoot extends MockSpecFolder {
	id: string;
	albums?: Array<MockSpecAlbum>;
	expected: {
		folders: number;
		tracks: number;
		states: number;
		artists: Array<string>;
		series: number;
		artworks: number;
		albums: number;
		genres: number;
		folderType?: FolderType;
	};
}

export interface MockSpecAlbum {
	artist: string;
	name: string;
	albumType: AlbumType;
}

export interface MockRoot extends MockSpecRoot {
	path: string;
	folders: Array<MockFolder>;
	tracks: Array<MockTrack>;
	strategy: RootScanStrategy;
}

export function extendSpecMockRoot(dir: string, root: MockSpecRoot, strategy: RootScanStrategy): MockRoot {
	return {
		...root,
		strategy,
		path: dir,
		folders: root.folders.map(f => extendSpecMockFolder(dir, f)),
		tracks: root.tracks.map(t => extendSpecMockTrack(dir, t))
	};
}

export function buildMockRoot(dir: string, nr: number, strategy: RootScanStrategy): MockRoot {
	const rootDir = path.join(dir, `root${nr}`);
	const spec: MockSpecRoot = {
		id: '',
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
						images: ['folder.png'],
						tracks: [
							{
								name: '1 - title 1 - artist 1.mp3',
								artist: 'artist 1',
								album: 'album 1',
								number: 1,
								total: 3,
								genre: 'Genre 1'
							},
							{
								name: '2 - title 2 - artist 1.mp3',
								artist: 'artist 1',
								album: 'album 1',
								number: 2,
								total: 3,
								genre: 'Genre 1'
							},
							{
								name: '3 - title 3 - artist 1.mp3',
								artist: 'artist 1',
								album: 'album 1',
								number: 3,
								total: 3,
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
						images: ['album.png'],
						tracks: [
							{
								name: '1 - title 1 - artist 1.mp3',
								artist: 'artist 1',
								album: 'album 2',
								number: 1,
								total: 3,
								genre: 'Genre 1'
							},
							{
								name: '2 - title 2 - artist 1.mp3',
								artist: 'artist 1',
								album: 'album 2',
								number: 2,
								total: 3,
								genre: 'Genre 1'
							},
							{
								name: '3 - title 3 - artist 1 with another artist.mp3',
								artist: 'artist 1 with another artist',
								albumArtist: 'artist 1',
								album: 'album 2',
								number: 3,
								total: 3,
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
						images: ['cover.png'],
						folders: [
							{
								name: 'cd 1',
								genre: 'Genre 3',
								folders: [],
								images: ['cover1.png'],
								tracks: [
									{
										name: '1 - cd 1 - title 1 - artist 1.mp3',
										artist: 'artist 1',
										album: 'album 3',
										number: 1,
										total: 2,
										genre: 'Genre 3'
									},
									{
										name: '2 - cd 1 - title 2 - artist 1.mp3',
										artist: 'artist 1',
										album: 'album 3',
										number: 2,
										total: 2,
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
								images: ['cover2.png'],
								tracks: [
									{
										name: '1 - cd 2 - title 1 - artist 1.mp3',
										artist: 'artist 1',
										album: 'album 3',
										number: 1,
										total: 2,
										genre: 'Genre 3'
									},
									{
										name: '2 - cd 2 - title 2 - artist 1.mp3',
										artist: 'artist 1',
										album: 'album 3',
										number: 2,
										total: 2,
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
				images: [],
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
						images: ['cover.png'],
						tracks: [
							{
								name: '1 - title 1 - artist 2.mp3',
								artist: 'artist 2',
								album: 'album 1',
								number: 1,
								total: 4,
								genre: 'Genre 1'
							},
							{
								name: '2 - title 2 - artist 2.mp3',
								artist: 'artist 2',
								album: 'album 1',
								number: 2,
								total: 4,
								genre: 'Genre 1'
							},
							{
								name: '3 - title 3 - artist 2.mp3',
								artist: 'artist 2',
								album: 'album 1',
								number: 3,
								total: 4,
								genre: 'Genre 2'
							}
						],
						expected: {
							folderType: FolderType.album,
							albumType: AlbumType.album
						}
					}
				],
				images: ['folder.png'],
				tracks: [],
				expected: {
					folderType: FolderType.artist
				}
			},
			{
				name: 'compilation 1',
				genre: '',
				folders: [],
				images: ['front.png'],
				tracks: [
					{
						name: '1 - title 1 - artist c1.mp3',
						artist: 'artist c1',
						album: 'compilation 1',
						number: 1,
						total: 3,
						genre: 'Genre 1'
					},
					{
						name: '2 - title 2 - artist c2.mp3',
						artist: 'artist c2',
						album: 'compilation 1',
						number: 2,
						total: 3,
						genre: 'Genre 2'
					},
					{
						name: '3 - title 3 - artist c3.mp3',
						artist: 'artist c3',
						album: 'compilation 1',
						number: 3,
						total: 3,
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
				images: ['artist.png'],
				folders: [
					{
						name: 'series 1',
						genre: 'Audiobook',
						images: ['front.png', 'back.jpeg'],
						folders: [],
						tracks: [
							{
								name: '1 - title 1 - series 1 album 1 - artist 5.mp3',
								artist: 'artist 5',
								group: 'series 1',
								groupNr: '1',
								album: 'series 1 album 1',
								number: 1,
								total: 3,
								genre: 'Audiobook'
							},
							{
								name: '1 - title 1 - series 1 album 2 - artist 5.mp3',
								artist: 'artist 5',
								group: 'series 1',
								groupNr: '2',
								album: 'series 1 album 2',
								number: 1,
								total: 3,
								genre: 'Audiobook',
								trackImage: true
							},
							{
								name: '3 - title 3 - series 1 album 3 - artist 5.mp3',
								artist: 'artist 5',
								group: 'series 1',
								groupNr: '3',
								album: 'series 1 album 3',
								number: 1,
								total: 3,
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
		images: [],
		tracks: [],
		expected: {
			folders: 12,
			tracks: 19,
			artists: ['artist 1', 'artist 1 with another artist', 'artist 2', 'artist c1', 'Various Artists', 'artist c2', 'artist c3', 'artist 5'],
			albums: 8,
			series: 1,
			genres: 4,
			artworks: 11,
			states: 3,
			folderType: FolderType.collection
		}
	};
	return extendSpecMockRoot(rootDir, spec, strategy);
}

export function buildSeriesMockRoot(dir: string, nr: number, strategy: RootScanStrategy): MockRoot {
	const rootDir = path.join(dir, `root${nr}`);
	const spec: MockSpecRoot = {
		id: '',
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
						images: ['front.png'],
						tracks: [
							{
								name: '1 - title 1 - audiobook series 1.mp3',
								group: 'audiobook series 1',
								artist: 'audiobook series 1',
								album: 'album 1',
								groupNr: 'episode 1',
								number: 1,
								total: 3,
								genre: 'audio series'
							},
							{
								name: '2 - title 2 - audiobook series 1.mp3',
								group: 'audiobook series 1',
								artist: 'audiobook series 1',
								album: 'album 1',
								groupNr: 'episode 1',
								number: 2,
								total: 3,
								genre: 'audio series'
							},
							{
								name: '3 - title 3 - audiobook series 1.mp3',
								group: 'audiobook series 1',
								artist: 'audiobook series 1',
								album: 'album 1',
								groupNr: 'episode 1',
								number: 3,
								total: 3,
								genre: 'audio series'
							}
						],
						expected: {
							folderType: FolderType.album,
							albumType: AlbumType.series
						}
					},
					{
						name: 'album 2',
						genre: 'audio series',
						folders: [],
						images: ['front.png'],
						tracks: [
							{
								name: '1 - title 1 - audiobook series 1.mp3',
								group: 'audiobook series 1',
								artist: 'audiobook series 1',
								album: 'album 2',
								number: 1,
								total: 3,
								groupNr: 'episode 2',
								genre: 'audio series'
							},
							{
								name: '2 - title 2 - audiobook series 1.mp3',
								group: 'audiobook series 1',
								artist: 'audiobook series 1',
								album: 'album 2',
								number: 2,
								total: 3,
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
								total: 3,
								genre: 'audio series'
							}],
						expected: {
							folderType: FolderType.album,
							albumType: AlbumType.series
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
								images: [],
								tracks: [
									{
										name: '1 - cd 1 - title 1 - audiobook series 1.mp3',
										group: 'audiobook series 1',
										artist: 'audiobook series 1',
										album: 'album 3',
										number: 1,
										total: 2,
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
										total: 2,
										genre: 'audio series'
									}
								],
								expected: {
									folderType: FolderType.multialbum,
									albumType: AlbumType.series
								}
							},
							{
								name: 'cd 2',
								genre: 'audio series',
								folders: [],
								images: [],
								tracks: [
									{
										name: '1 - cd 2 - title 1 - audiobook series 1.mp3',
										group: 'audiobook series 1',
										artist: 'audiobook series 1',
										album: 'album 3',
										groupNr: 'episode 3',
										number: 1,
										total: 2,
										genre: 'audio series'
									},
									{
										name: '2 - cd 2 - title 2 - audiobook series 1.mp3',
										group: 'audiobook series 1',
										artist: 'audiobook series 1',
										album: 'album 3',
										groupNr: 'episode 3',
										number: 2,
										total: 2,
										genre: 'audio series'
									}
								],
								expected: {
									folderType: FolderType.multialbum,
									albumType: AlbumType.series
								}
							}
						],
						images: ['front.png'],
						tracks: [],
						expected: {
							folderType: FolderType.multialbum,
							albumType: AlbumType.series
						}
					}
				],
				images: ['front.png'],
				tracks: [],
				expected: {
					folderType: FolderType.artist
				}
			},
			{
				name: 'audiobook series 2',
				genre: 'audio series',
				folders: [],
				images: ['front.png'],
				tracks: [
					{
						name: '1 - title 1 - audiobook series 2.mp3',
						group: 'audiobook series 2',
						artist: 'audiobook series 2',
						album: 'album 1',
						groupNr: 'episode 1',
						number: 1,
						total: 3,
						genre: 'audio series'
					},
					{
						name: '2 - title 2 - audiobook series 2.mp3',
						group: 'audiobook series 2',
						artist: 'audiobook series 2',
						album: 'album 2',
						groupNr: 'episode 2',
						number: 2,
						total: 3,
						genre: 'audio series'
					},
					{
						name: '3 - title 3 - audiobook series 2.mp3',
						group: 'audiobook series 2',
						artist: 'audiobook series 2',
						album: 'album 3',
						groupNr: 'episode 3',
						number: 3,
						total: 3,
						genre: 'audio series'
					}],
				expected: {
					folderType: FolderType.artist
				}
			},
			{
				name: 'audiobook series 3',
				genre: 'audio series',
				images: [],
				folders: [
					{
						name: 'album 4',
						genre: 'audio series',
						folders: [
							{
								name: 'cd 1',
								genre: 'audio series',
								images: [],
								folders: [],
								tracks: [
									{
										name: '1 - cd 1 - title 1 - audiobook series 3.mp3',
										group: 'audiobook series 3',
										artist: 'audiobook series 3',
										album: 'album 4',
										number: 1,
										total: 2,
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
										total: 2,
										genre: 'audio series'
									}
								],
								expected: {
									folderType: FolderType.multialbum,
									albumType: AlbumType.series
								}
							},
							{
								name: 'cd 2',
								genre: 'audio series',
								images: [],
								folders: [],
								tracks: [
									{
										name: '1 - cd 2 - title 1 - audiobook series 3.mp3',
										group: 'audiobook series 3',
										artist: 'audiobook series 3',
										album: 'album 4',
										groupNr: 'episode 4',
										number: 1,
										total: 2,
										genre: 'audio series'
									},
									{
										name: '2 - cd 2 - title 2 - audiobook series 3.mp3',
										group: 'audiobook series 3',
										artist: 'audiobook series 3',
										album: 'album 4',
										groupNr: 'episode 4',
										number: 2,
										total: 2,
										genre: 'audio series'
									}
								],
								expected: {
									folderType: FolderType.multialbum,
									albumType: AlbumType.series
								}
							}
						],
						images: ['front.png'],
						tracks: [],
						expected: {
							folderType: FolderType.multialbum,
							albumType: AlbumType.series
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
						total: 3,
						genre: 'audio series'
					},
					{
						name: '2 - title 2 - audiobook series 3.mp3',
						artist: 'audiobook series 3',
						group: 'audiobook series 3',
						album: 'album 2',
						groupNr: 'episode 2',
						number: 2,
						total: 3,
						genre: 'audio series'
					},
					{
						name: '3 - title 3 - audiobook series 3.mp3',
						artist: 'audiobook series 3',
						group: 'audiobook series 3',
						album: 'album 3',
						groupNr: 'episode 3',
						number: 3,
						total: 3,
						genre: 'audio series'
					}],
				expected: {
					folderType: FolderType.artist
				}
			}
		],
		images: ['folder.png'],
		tracks: [],
		albums: [
			{artist: 'audiobook series 1', name: 'album 1', albumType: AlbumType.series},
			{artist: 'audiobook series 1', name: 'album 2', albumType: AlbumType.series},
			{artist: 'audiobook series 1', name: 'album 3', albumType: AlbumType.series},
			{artist: 'audiobook series 2', name: 'album 1', albumType: AlbumType.series},
			{artist: 'audiobook series 2', name: 'album 2', albumType: AlbumType.series},
			{artist: 'audiobook series 2', name: 'album 3', albumType: AlbumType.series},
			{artist: 'audiobook series 3', name: 'album 1', albumType: AlbumType.series},
			{artist: 'audiobook series 3', name: 'album 2', albumType: AlbumType.series},
			{artist: 'audiobook series 3', name: 'album 3', albumType: AlbumType.series},
			{artist: 'audiobook series 3', name: 'album 4', albumType: AlbumType.series}
		],
		expected: {
			folders: 12,
			tracks: 20,
			series: 3,
			artists: ['audiobook series 1', 'audiobook series 2', 'audiobook series 3'],
			albums: 10,
			genres: 1,
			artworks: 6,
			states: 3,
			folderType: FolderType.collection
		}
	};
	return extendSpecMockRoot(rootDir, spec, strategy);
}

export function buildSoundtrackMockRoot(dir: string, nr: number, strategy: RootScanStrategy): MockRoot {
	const rootDir = path.join(dir, `root${nr}`);
	const spec: MockSpecRoot = {
		id: '',
		name: `root${nr}`,
		folders: [
			{
				name: 'soundtrack OST',
				genre: 'Soundtrack',
				images: ['front.png'],
				folders: [],
				tracks: [{
					name: '1 - title 1 - soundtrack 1.mp3',
					artist: 'soundtrack artist 1',
					album: 'soundtrack 1',
					number: 1,
					total: 3,
					genre: 'soundtrack'
				},
					{
						name: '2 - title 2 - soundtrack 2.mp3',
						artist: 'soundtrack artist 2',
						album: 'soundtrack 1',
						number: 2,
						total: 3,
						genre: 'soundtrack'
					},
					{
						name: '3 - title 3 - soundtrack 3.mp3',
						artist: 'soundtrack artist 3',
						album: 'soundtrack 1',
						number: 3,
						total: 3,
						genre: 'soundtrack'
					}],
				expected: {
					folderType: FolderType.album
				}
			}
		],
		images: ['folder.png'],
		tracks: [],
		albums: [
			{artist: 'Various Artists', name: 'soundtrack 1', albumType: AlbumType.soundtrack}
		],
		expected: {
			folders: 2,
			tracks: 3,
			series: 0,
			artists: ['soundtrack artist 1', 'soundtrack artist 2', 'soundtrack artist 3', 'Various Artists'],
			albums: 1,
			genres: 1,
			artworks: 1,
			states: 3,
			folderType: FolderType.collection
		}
	};
	return extendSpecMockRoot(rootDir, spec, strategy);
}

export async function writeMockRoot(root: MockRoot): Promise<void> {
	await fse.ensureDir(root.path);
	for (const folder of root.folders) {
		await writeMockFolder(folder);
	}
}

export async function validateMock(mockFolder: MockFolder, workerService: WorkerService, orm: Orm): Promise<void> {
	const folder = await orm.Folder.findOne({where: {path: ensureTrailingPathSeparator(mockFolder.path)}});
	expect(folder).toBeDefined();
	if (!folder) {
		return;
	}
	if (mockFolder.expected.folderType !== undefined) {
		expect(folder.folderType).toBe(mockFolder.expected.folderType); // 'Folder type unexpected: ' + mockFolder.path
	}
	if (mockFolder.expected.albumType !== undefined) {
		expect(folder.albumType).toBe(mockFolder.expected.albumType); // 'Album type unexpected: ' + mockFolder.path
	}
	for (const sub of mockFolder.folders) {
		await validateMock(sub, workerService, orm);
	}
}

export async function writeAndStoreExternalMedia(workerService: WorkerService, orm: Orm): Promise<void> {
	const admin = await orm.User.oneOrFail({where: {name: 'admin'}});
	const helper = new StateHelper(orm.em);
	const radio = orm.Radio.create({
		name: 'radio',
		url: 'http://awesome!stream',
		homepage: 'http://awesome!',
		disabled: false
	});
	await orm.Radio.persistAndFlush(radio);
	await helper.fav(radio.id, DBObjectType.radio, admin, false);
	const podcast = orm.Podcast.create({
		name: 'podcast',
		url: 'http://podcast!stream',
		status: PodcastStatus.new,
		categories: []
	});
	await orm.Podcast.persistAndFlush(podcast);
	await helper.fav(podcast.id, DBObjectType.podcast, admin, false);
	const episode = orm.Episode.create({
		name: 'episode',
		date: new Date(),
		status: PodcastStatus.new
	});
	await episode.podcast.set(podcast);
	await orm.Episode.persistAndFlush(episode);
	await helper.fav(episode.id, DBObjectType.episode, admin, false);
}

export async function writeAndStoreMock(mockRoot: MockRoot, workerService: WorkerService, orm: Orm): Promise<Changes> {
	await writeMockRoot(mockRoot);
	const root = orm.Root.create({
		path: mockRoot.path,
		name: mockRoot.name,
		strategy: mockRoot.strategy
	});
	await orm.Root.persistAndFlush(root);
	mockRoot.id = root.id;
	const changes = await workerService.root.refresh({rootID: mockRoot.id});
	const admin = await orm.User.oneOrFail({where: {name: 'admin'}});
	if (changes.tracks.added.size > 0) {
		const helper = new StateHelper(orm.em);
		const track = await orm.Track.oneOrFailByID(changes.tracks.added.ids()[0]);
		const bookmark = orm.Bookmark.create({
			position: 1,
			comment: 'awesome!'
		});
		await bookmark.user.set(admin);
		await bookmark.track.set(track);
		await orm.Bookmark.persistAndFlush(bookmark);
		await helper.fav(track.id, DBObjectType.track, admin, false);
		await helper.rate(track.id, DBObjectType.track, admin, 5);
		await helper.reportPlaying(track.id, DBObjectType.track, admin);

		const playlist = orm.Playlist.create({
			name: 'playlist',
			comment: 'awesome!',
			isPublic: true,
			changed: Date.now(),
			duration: 0
		});
		await playlist.user.set(admin);
		await orm.Playlist.persistAndFlush(playlist);

		const entry = orm.PlaylistEntry.create({position: 1});
		await entry.playlist.set(playlist);
		await entry.track.set(track);
		await orm.PlaylistEntry.persistAndFlush(entry);
		await helper.fav(entry.id, DBObjectType.playlistentry, admin, false);

		await helper.fav(track.folder.idOrFail(), DBObjectType.folder, admin, false);
	}
	return changes;
}
