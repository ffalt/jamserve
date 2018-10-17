import {Store} from '../../store/store';
import {ScanDir, ScanFile} from './scan';
import {JamServe} from '../../model/jamserve';
import path from 'path';
import Logger from '../../utils/logger';

const log = Logger('IO.match');

export interface MatchDir extends ScanDir {
	level: number;
	rootID: string;
	tag?: JamServe.FolderTag;
	parent?: MatchDir;
	folder?: JamServe.Folder;
	files: Array<MatchFile>;
	directories: Array<MatchDir>;
	removedTracks: Array<JamServe.Track>;
	removedFolders: Array<JamServe.Folder>;
}

export interface MatchFile extends ScanFile {
	track?: JamServe.Track;
}

export async function matchDir(dir: ScanDir, store: Store, rootID: string): Promise<MatchDir> {
	const result: MatchDir = clone(dir, undefined, 0, rootID);
	result.folder = await store.folder.searchOne({path: dir.name});
	await matchDirR(result, store);
	return result;
}

function clone(dir: ScanDir, parent: MatchDir | undefined, level: number, rootID: string): MatchDir {
	const result: MatchDir = {
		rootID,
		parent,
		level,
		name: dir.name,
		stat: dir.stat,
		folder: undefined,
		files: dir.files.map(file => {
			return {name: file.name, type: file.type, stat: file.stat};
		}),
		directories: [],
		removedTracks: [],
		removedFolders: []
	};
	result.directories = dir.directories.map(sub => clone(sub, result, level + 1, rootID));
	return result;
}

async function matchDirR(dir: MatchDir, store: Store): Promise<void> {
	log.debug('Matching Directory', dir.name);
	const tracks = await store.track.search({path: dir.name});
	tracks.forEach(track => {
		const filename = path.join(track.path, track.name);
		const file = dir.files.find(f => f.name === filename);
		if (file) {
			file.track = track;
		} else {
			dir.removedTracks.push(track);
		}
	});
	if (dir.folder) {
		const folders = await store.folder.search({parentID: dir.folder.id});
		for (const subFolder of folders) {
			const subDir = dir.directories.find(sd => sd.name === subFolder.path);
			if (!subDir) {
				dir.removedFolders.push(subFolder);
			} else {
				subDir.folder = subFolder;
				await matchDirR(subDir, store);
			}
		}
	}
}
