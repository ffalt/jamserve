import {Store} from './store';
import fse from 'fs-extra';
import path from 'path';
import tmp, {SynchrounousResult} from 'tmp';
import {DBObjectType} from '../../model/jam-types';
import {Root} from '../../objects/root/root.model';
import {MergeChanges} from '../io/components/merge';
import {AudioModule} from '../../modules/audio/audio.module';
import {ThirdPartyConfig} from '../../config/thirdparty.config';
import {writeMP3Track} from '../../modules/audio/audio.mock';
import {randomItem} from '../../utils/random';
import {Genres} from '../../utils/genres';
import {Scanner} from '../io/scanner';

interface MockTrack {
	path: string;
	number: number;
	genre: string;
	artist: string;
	album: string;
}

interface MockFolder {
	path: string;
	name: string;
	genre: string;
	folders: Array<MockFolder>;
	tracks: Array<MockTrack>;
}

export interface MockRoot {
	id: string;
	path: string;
	name: string;
	folders: Array<MockFolder>;
}

function buildRandomTrack(dir: string, name: string, number: number, artist: string, album: string, genre: string): MockTrack {
	return {
		path: path.resolve(dir, number + ' ' + name + '.mp3'),
		artist,
		album,
		number,
		genre
	};
}

function buildRandomFolder(dir: string, type: string, nr: number, genre: string): MockFolder {
	return {
		path: path.resolve(dir, type + ' ' + nr),
		name: type + nr,
		genre,
		folders: [],
		tracks: []
	};
}

export function buildMockRoot(dir: string, nr: number, id: string): MockRoot {
	const rootDir = path.resolve(dir, 'root ' + nr);
	const folders: Array<MockFolder> = [];
	const amountArtists = 5; // randomInt(1, 25);
	for (let i = 1; i < amountArtists; i++) {
		const artist = buildRandomFolder(rootDir, 'artist', i, '');
		folders.push(artist);
		const amountAlbums = i; // randomInt(1, 25);
		for (let j = 1; j < amountAlbums; j++) {
			const album = buildRandomFolder(artist.path, 'album', j, randomItem(Genres));
			artist.folders.push(album);
			const amountTracks = i; // randomInt(1, 25);
			for (let k = 1; k < amountTracks; k++) {
				const track = buildRandomTrack(album.path, artist.name + album.name, k, artist.name, album.name, album.genre);
				album.tracks.push(track);
			}
		}
	}
	return {
		id,
		path: rootDir,
		name: 'root' + nr,
		folders
	};
}

async function writeMockTrack(track: MockTrack): Promise<void> {
	await writeMP3Track(track.path, track.album, track.artist, track.number, track.genre);
}

async function writeMockFolder(f: MockFolder): Promise<void> {
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

async function removeMockFolder(f: MockFolder): Promise<void> {
	for (const folder of f.folders) {
		await removeMockFolder(folder);
	}
	for (const track of f.tracks) {
		await fse.unlink(track.path);
	}
	await fse.rmdir(f.path);
}

export async function removeMockRoot(root: MockRoot): Promise<void> {
	for (const folder of root.folders) {
		await removeMockFolder(folder);
	}
	await fse.rmdir(root.path);
}

export class StoreMock {
	// @ts-ignore
	dir: SynchrounousResult;
	// @ts-ignore
	mockRoot: MockRoot;

	constructor(public store: Store) {
	}

	async setup(): Promise<void> {
		this.dir = tmp.dirSync();
		this.mockRoot = buildMockRoot(this.dir.name, 1, 'rootID1');
		await writeMockRoot(this.mockRoot);
		const audioModule = new AudioModule(ThirdPartyConfig);
		const root: Root = {
			id: '',
			type: DBObjectType.root,
			name: this.mockRoot.name,
			path: this.mockRoot.path,
			created: Date.now()
		};
		root.id = await this.store.rootStore.add(root);
		const changes: MergeChanges = {
			newTracks: [],
			unchangedTracks: [],
			unchangedFolders: [],
			removedTracks: [],
			updateTracks: [],
			newFolders: [],
			removedFolders: [],
			updateFolders: []
		};
		const oldread = audioModule.read;
		audioModule.read = async (filename: string) => {
			const result = await oldread(filename);
			if (result && result.media) {
				result.media.duration = 1;
			}
			return result;
		};
		const scanner = new Scanner(this.store, audioModule);
		await scanner.run(this.mockRoot.path, root.id);
		/**
		 const scan: ScanDir = await scanDir(this.mockRoot.path);
		 const match: MatchDir = await matchDir(scan, this.store, root.id);
		 const merger = new Merger(root.id, this.store, audioModule, (count: number) => {
			// this.scanningCount = count;
		});
		 await await merger.merge(match, changes);
		 const meta = new MetaMerge(this.store);
		 await meta.sync(changes);
		 // console.log(this.dir.name, match, changes);
		 **/
	}

	async cleanup() {
		await removeMockRoot(this.mockRoot);
		this.dir.removeCallback();
	}
}
