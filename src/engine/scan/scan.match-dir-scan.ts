import path from 'path';
import Logger from '../../utils/logger';
import {Folder} from '../folder/folder.model';
import {Store} from '../store/store';
import {Track} from '../track/track.model';
import {MergeChanges} from './scan.changes';
import {MatchDir} from './scan.match-dir';
import {ScanDir} from './scan.scan-dir';

const log = Logger('IO.Scan.Matcher');

export class ScanMatcher {

	constructor(public store: Store) {
	}

	private cloneScanDir(dir: ScanDir, parent: MatchDir | undefined, level: number): MatchDir {
		const result: MatchDir = {
			rootID: dir.rootID,
			parent,
			level,
			name: dir.name,
			stat: dir.stat,
			folder: undefined,
			files: dir.files.map(file => {
				return {name: file.name, type: file.type, stat: file.stat, rootID: dir.rootID};
			}),
			directories: []
		};
		result.directories = dir.directories.map(sub => this.cloneScanDir(sub, result, level + 1));
		return result;
	}

	private async matchDirR(dir: MatchDir, changes: MergeChanges): Promise<void> {
		log.debug('Comparing:', dir.name);
		const tracks = await this.store.trackStore.search({path: dir.name});
		tracks.items.forEach(track => {
			const filename = path.join(track.path, track.name);
			const file = dir.files.find(f => f.name === filename);
			if (file) {
				file.track = track;
			} else {
				changes.removedTracks.push(track);
			}
		});
		if (dir.folder) {
			const folders = await this.store.folderStore.search({parentID: dir.folder.id});
			folders.items = folders.items.sort((a, b) => a.path.localeCompare(b.path));
			for (const subFolder of folders.items) {
				const subDir = dir.directories.find(sd => sd.name === subFolder.path);
				if (!subDir) {
					changes.removedFolders.push(subFolder);
				} else {
					subDir.folder = subFolder;
					await this.matchDirR(subDir, changes);
				}
			}
		}
	}

	async match(dir: ScanDir, changes: MergeChanges): Promise<MatchDir> {
		log.info('Matching:', dir.name);
		const result: MatchDir = this.cloneScanDir(dir, undefined, 0);
		result.folder = await this.store.folderStore.searchOne({path: dir.name});
		await this.matchDirR(result, changes);
		const removedFolders: Array<Folder> = changes.removedFolders;
		const removedTracks: Array<Track> = changes.removedTracks;
		for (const sub of changes.removedFolders) {
			const folderList = await this.store.folderStore.search({inPath: sub.path});
			for (const folder of folderList.items) {
				if (!removedFolders.find(f => f.id === folder.id)) {
					removedFolders.push(folder);
				}
			}
			const trackList = await this.store.trackStore.search({inPath: sub.path});
			for (const track of trackList.items) {
				if (!removedTracks.find(t => t.id === track.id)) {
					removedTracks.push(track);
				}
			}
		}
		changes.removedTracks = removedTracks;
		changes.removedFolders = removedFolders;
		return result;
	}

}
