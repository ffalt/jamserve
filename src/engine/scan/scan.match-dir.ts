import {ScanDir} from './scan.scan-dir';
import {Folder, FolderTag} from '../../objects/folder/folder.model';
import {Track} from '../../objects/track/track.model';
import path from 'path';
import {Store} from '../store/store';
import Logger from '../../utils/logger';
import {MetaStat} from './scan.metastats';
import {FileTyp, FolderTypesAlbum} from '../../model/jam-types';
import {MergeChanges} from './scan.changes';
import fse from 'fs-extra';

const log = Logger('Scan.MatchDir');

export interface MatchDir {
	name: string;
	rootID: string;
	stat: {
		ctime: number,
		mtime: number,
	};
	directories: Array<MatchDir>;
	files: Array<MatchFile>;
	level: number;
	tag?: FolderTag;
	parent?: MatchDir;
	folder?: Folder;
	metaStat?: MetaStat;
}

export interface MatchFile {
	name: string;
	type: FileTyp;
	stat: {
		ctime: number,
		mtime: number,
		size: number
	};
	rootID: string;
	track?: Track;
}

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
		tracks.forEach(track => {
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
			for (const subFolder of folders) {
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
			for (const folder of folderList) {
				if (!removedFolders.find(f => f.id === folder.id)) {
					removedFolders.push(folder);
				}
			}
			const trackList = await this.store.trackStore.search({inPath: sub.path});
			for (const track of trackList) {
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

export class DBMatcher {

	constructor(public store: Store) {
	}

	private async buildMatchFileFromDB(track: Track): Promise<MatchFile> {
		const match: MatchFile = {
			rootID: track.rootID,
			track,
			name: path.join(track.path, track.name),
			type: FileTyp.AUDIO,
			stat: {
				ctime: track.stat.created,
				mtime: track.stat.modified,
				size: track.stat.size
			}
		};
		return match;
	}

	private async buildMatchDirDBData(folder: Folder): Promise<MatchDir> {
		const match: MatchDir = {
			name: folder.path,
			level: folder.tag.level,
			rootID: folder.rootID,
			tag: folder.tag,
			stat: {ctime: folder.stat.created, mtime: folder.stat.modified},
			parent: undefined,
			folder: folder,
			files: [],
			directories: [],
			metaStat: undefined
		};
		const tracks = await this.store.trackStore.search({parentID: folder.id});
		for (const t of tracks) {
			match.files.push(await this.buildMatchFileFromDB(t));
		}
		if (folder.tag.artworks) {
			for (const art of folder.tag.artworks) {
				const matchFile: MatchFile = {
					rootID: folder.rootID,
					name: path.join(folder.path, art.name),
					type: FileTyp.IMAGE,
					stat: {
						ctime: art.stat.created,
						mtime: art.stat.modified,
						size: art.stat.size
					}
				};
				match.files.push(matchFile);
			}
		}
		return match;
	}

	private async buildMatchDirParentsFromDBData(match: MatchDir, loadedMatches: Array<MatchDir>): Promise<MatchDir | undefined> {
		const folder = match.folder;
		if (!folder || !folder.parentID) {
			return undefined;
		}
		let parentMatch = loadedMatches.find(m => !!m.folder && m.folder.id === folder.parentID);
		if (parentMatch) {
			if (parentMatch.directories.indexOf(match) < 0) {
				parentMatch.directories.push(match);
			}
			match.parent = parentMatch;
			return parentMatch;
		}
		const parent = await this.store.folderStore.byId(folder.parentID);
		if (!parent) {
			return undefined;
		}
		parentMatch = await this.buildMatchDirDBData(parent);
		parentMatch.directories.push(match);
		if (match.level > 1) {
			const folders = await this.store.folderStore.search({parentID: parent.id});
			for (const f of folders) {
				if (f.id !== folder.id) {
					let c = loadedMatches.find(m => !!m.folder && m.folder.id === f.id);
					if (!c) {
						c = await this.buildMatchDirDBData(f);
						loadedMatches.push(c);
					}
					c.parent = parentMatch;
					parentMatch.directories.push(c);
				}
			}
		}
		loadedMatches.push(parentMatch);
		parentMatch.parent = await this.buildMatchDirParentsFromDBData(parentMatch, loadedMatches);
		return parentMatch;
	}

	private async loadChildsFromDBData(match: MatchDir, loadedMatches: Array<MatchDir>): Promise<void> {
		const folder = match.folder;
		if (!folder) {
			return;
		}
		if (!match.directories || match.directories.length === 0) {
			const folders = await this.store.folderStore.search({parentID: folder.id});
			for (const f of folders) {
				const c = await this.buildMatchDirDBData(f);
				c.parent = match;
				loadedMatches.push(match);
				match.directories.push(c);
				await this.loadChildsFromDBData(c, loadedMatches);
			}
		}
	}

	async match(folderIDs: Array<string>, changedTrackIDs: Array<string>): Promise<{ rootMatch: MatchDir; changedDirs: Array<MatchDir> }> {
		const folders = await this.store.folderStore.byIds(folderIDs);
		const loadedMatches: Array<MatchDir> = [];
		const changedDirs: Array<MatchDir> = [];
		const changedFiles: Array<MatchFile> = [];
		for (const folder of folders) {
			let match = loadedMatches.find(m => !!m.folder && m.folder.id === folder.id);
			if (!match) {
				match = await this.buildMatchDirDBData(folder);
				loadedMatches.push(match);
			}
			match.parent = await this.buildMatchDirParentsFromDBData(match, loadedMatches);
			await this.loadChildsFromDBData(match, loadedMatches);
			for (const file of match.files) {
				if (file.track && changedTrackIDs.indexOf(file.track.id) >= 0) {
					changedFiles.push(file);
				}
			}
			loadedMatches.push(match);
			if (changedDirs.indexOf(match) < 0) {
				changedDirs.push(match);
			}
			let p = match.parent;
			while (p) {
				if (p.level > 0 && changedDirs.indexOf(p) < 0) {
					changedDirs.push(p);
				}
				p = p.parent;
			}
		}
		for (const file of changedFiles) {
			const stat = await fse.stat(file.name);
			file.stat = {
				ctime: stat.ctime.valueOf(),
				mtime: stat.mtime.valueOf(),
				size: stat.size
			};
		}
		for (const dir of changedDirs) {
			const stat = await fse.stat(dir.name);
			dir.stat = {
				ctime: stat.ctime.valueOf(),
				mtime: stat.mtime.valueOf()
			};
		}
		const rootMatch = loadedMatches.find(m => m.level === 0);
		if (!rootMatch) {
			return Promise.reject(Error(`Root Match not found`));
		}
		return {rootMatch, changedDirs};
	}
}

export function debugPrintTree(match: MatchDir, level: number = 0) {
	const prefix = ' '.repeat(level);
	if (match.folder) {
		console.log(prefix + '📁 ' + path.basename(match.name), '[' + match.folder.tag.type + ']', FolderTypesAlbum.indexOf(match.folder.tag.type) >= 0 ? '[' + match.folder.tag.albumType + ']' : '');
	} else {
		console.log(prefix + '📁 ' + path.basename(match.name), '[new]');
	}
	// console.log(prefix + JSON.stringify(match.tag));
	for (const sub of match.directories) {
		debugPrintTree(sub, level + 1);
	}
	// if (wFiles) {
	// 	for (const f of match.files) {
	// 		if (f.type === FileTyp.AUDIO) {
	// 			console.log(prefix + ' 🎧 ' + path.basename(f.name), f.track ? '' : '[new]');
	// 		}
	// 	}
	// }
}
