import path from 'path';
import {logger} from '../../../utils/logger';
import {Folder} from '../../folder/folder.model';
import {Store} from '../../store/store';
import {Track} from '../../track/track.model';
import {ScanDir} from '../scan-dir/scan-dir';
import {MatchDir} from './match-dir.types';

const log = logger('IO.MatchDirBuilderScan');

export class MatchDirBuilderScan {

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

	private async matchDirR(dir: MatchDir, searchTracks: Array<Track>, searchFolders: Array<Folder>, removedFolders: Array<Folder>, removedTracks: Array<Track>): Promise<void> {
		log.debug('Matching:', dir.name);
		const tracks = searchTracks.filter(t => t.path === dir.name); // await this.store.trackStore.search({path: dir.name});
		tracks.forEach(track => {
			const filename = path.join(track.path, track.name);
			const file = dir.files.find(f => f.name === filename);
			if (file) {
				file.track = track;
			} else {
				removedTracks.push(track);
			}
		});
		if (dir.folder) {
			const folderId = dir.folder.id;
			const folders = searchFolders.filter(f => f.parentID === folderId) // await this.store.folderStore.search({parentID: dir.folder.id});
				.sort((a, b) => a.path.localeCompare(b.path));
			for (const subFolder of folders) {
				const subDir = dir.directories.find(sd => sd.name === subFolder.path);
				if (!subDir) {
					removedFolders.push(subFolder);
				} else {
					subDir.folder = subFolder;
					await this.matchDirR(subDir, searchTracks, searchFolders, removedFolders, removedTracks);
				}
			}
		}
	}

	async match(dir: ScanDir): Promise<{ rootMatch: MatchDir, removedFolders: Array<Folder>, removedTracks: Array<Track> }> {
		const tracks = await this.store.trackStore.search({inPath: dir.name});
		const folders = await this.store.folderStore.search({inPath: dir.name});
		const rootMatch: MatchDir = this.cloneScanDir(dir, undefined, 0);
		rootMatch.folder = await this.store.folderStore.searchOne({path: dir.name});
		const removedFolders: Array<Folder> = [];
		const removedTracks: Array<Track> = [];
		await this.matchDirR(rootMatch, tracks.items, folders.items, removedFolders, removedTracks);
		for (const sub of removedFolders) {
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
		return {rootMatch, removedTracks, removedFolders};
	}

}
