import { AlbumType, FolderType } from '../../types/enums.js';
import path from 'node:path';
import fse from 'fs-extra';
import { writeImage } from './mock.image.js';
import { extendSpecMockTrack, MockSpecTrack, MockTrack, writeMockTrack } from './mock.track.js';

export interface MockSpecFolder {
	name: string;
	genre?: string;
	folders?: Array<MockSpecFolder>;
	tracks: Array<MockSpecTrack>;
	images: Array<string>;
	expected: {
		folderType?: FolderType;
		albumType?: AlbumType;
	};
}

export interface MockFolder extends MockSpecFolder {
	path: string;
	folders: Array<MockFolder>;
	tracks: Array<MockTrack>;
}

export function extendSpecMockFolder(dir: string, folder: MockSpecFolder): MockFolder {
	const folderPath = path.join(dir, folder.name);
	return {
		...folder,
		path: folderPath,
		folders: (folder.folders || []).map(f => extendSpecMockFolder(folderPath, f)),
		tracks: folder.tracks.map(t => extendSpecMockTrack(folderPath, t))
	};
}

export async function writeMockFolder(f: MockFolder): Promise<void> {
	await fse.ensureDir(f.path);
	for (const folder of f.folders) {
		await writeMockFolder(folder);
	}
	for (const track of f.tracks) {
		await writeMockTrack(track);
	}
	for (const image of f.images) {
		await writeImage(path.join(f.path, image));
	}
}
