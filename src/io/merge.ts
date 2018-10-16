import {Store} from '../store/store';
import {JamServe} from '../model/jamserve';
import {MatchDir, MatchFile} from './match';
import {DBObjectType, FileTyp, FolderType} from '../types';
import path from 'path';
import {Audio} from '../audio/audio';
import {deepCompare} from '../utils/deep-compare';
import Logger from '../utils/logger';
import {fillMatchTags} from './tag';

const log = Logger('IO.merge');

export interface MergeTrackInfo {
	track: JamServe.Track;
	dir: MatchDir;
}

export interface MergeChanges {
	newTracks: Array<MergeTrackInfo>;
	unchangedTracks: Array<MergeTrackInfo>;
	removedTracks: Array<JamServe.Track>;
	updateTracks: Array<MergeTrackInfo>;
	newFolders: Array<JamServe.Folder>;
	unchangedFolders: Array<JamServe.Folder>;
	removedFolders: Array<JamServe.Folder>;
	updateFolders: Array<JamServe.Folder>;
}

export class Merger {
	store: Store;
	audio: Audio;
	scanningCount = 0;
	rootID: string;
	onProgress: (count: number) => void;

	constructor(rootID: string, store: Store, audio: Audio, onProgress: (count: number) => void) {
		this.store = store;
		this.audio = audio;
		this.onProgress = onProgress;
		this.rootID = rootID;
	}

	private static folderHasChanged(dir: MatchDir): boolean {
		return (!dir.folder) ||
			(dir.stat.mtime !== dir.folder.stat.modified) ||
			(dir.stat.ctime !== dir.folder.stat.created) ||
			(!deepCompare(dir.folder.tag, dir.tag));
	}

	private static trackHasChanged(file: MatchFile): boolean {
		return (!file.track) ||
			(file.stat.mtime !== file.track.stat.modified) ||
			(file.stat.ctime !== file.track.stat.created) ||
			(file.stat.size !== file.track.stat.size);
	}

	private async newFolder(dir: MatchDir): Promise<JamServe.Folder> {
		log.info('New Folder', dir.name);
		const folder: JamServe.Folder = {
			id: '',
			rootID: dir.rootID,
			path: dir.name,
			parentID: (dir.parent && dir.parent.folder ? dir.parent.folder.id : undefined),
			stat: {
				created: dir.stat.ctime,
				modified: dir.stat.mtime
			},
			tag: dir.tag || {tracks: 0, level: -1, type: FolderType.unknown},
			type: DBObjectType.folder
		};
		folder.id = await this.store.folder.add(folder);
		dir.folder = folder;
		return folder;
	}

	private async updateFolder(dir: MatchDir): Promise<JamServe.Folder | undefined> {
		const old = dir.folder;
		if (!old) {
			return;
		}
		log.info('Update Folder', dir.name);
		const folder: JamServe.Folder = {
			id: old.id,
			rootID: dir.rootID,
			path: dir.name,
			parentID: (dir.parent && dir.parent.folder ? dir.parent.folder.id : undefined),
			stat: {
				created: dir.stat.ctime,
				modified: dir.stat.mtime
			},
			tag: dir.tag || {tracks: 0, level: dir.level, type: FolderType.unknown},
			type: DBObjectType.folder,
			info: old.info
		};
		await this.store.folder.replace(folder);
		return folder;
	}

	private async buildTrack(file: MatchFile, parent: JamServe.Folder): Promise<JamServe.Track> {
		this.scanningCount++;
		this.onProgress(this.scanningCount);
		const data = await this.audio.read(file.name);
		return {
			id: '',
			rootID: this.rootID,
			albumID: '',
			artistID: '',
			parentID: (parent ? parent.id : ''),
			name: path.basename(file.name),
			path: path.dirname(file.name),
			stat: {
				created: file.stat.ctime,
				modified: file.stat.mtime,
				size: file.stat.size
			},
			media: data.media || {},
			tag: data.tag || {},
			type: DBObjectType.track
		};
	}

	private async newTrack(file: MatchFile, parent: JamServe.Folder): Promise<JamServe.Track> {
		log.info('New Track', file.name);
		const track = await this.buildTrack(file, parent);
		track.id = await this.store.track.add(track);
		return track;
	}

	private async updateTrack(file: MatchFile, parent: JamServe.Folder): Promise<JamServe.Track | undefined> {
		log.info('Update Track', file.name);
		const old = file.track;
		if (!old) {
			return;
		}
		const track = await this.buildTrack(file, parent);
		track.id = old.id;
		track.info = old.info;
		await this.store.track.replace(track);
		return track;
	}

	private async compareFile(file: MatchFile, dir: MatchDir, changes: MergeChanges, parent: JamServe.Folder | undefined): Promise<void> {
		if (file.type !== FileTyp.AUDIO || !parent) {
			return;
		}
		if (!file.track) {
			const track = await this.newTrack(file, parent);
			file.track = track;
			changes.newTracks.push({track, dir});
		} else if (Merger.trackHasChanged(file)) {
			const track = await this.updateTrack(file, parent);
			if (track) {
				file.track = track;
				changes.updateTracks.push({track, dir});
			}
		} else {
			changes.unchangedTracks.push({track: file.track, dir});
		}
	}

	private async compareSubs(dir: MatchDir, changes: MergeChanges): Promise<void> {
		for (const sub of dir.directories) {
			await this.compareFilesR(sub, changes);
		}
		for (const file of dir.files) {
			await this.compareFile(file, dir, changes, dir.folder);
		}
	}

	private async compareFilesR(dir: MatchDir, changes: MergeChanges): Promise<void> {
		log.debug('Compare Directory', dir.name);
		dir.removedFolders.forEach(folder => {
			changes.removedFolders.push(folder);
		});
		dir.removedTracks.forEach(track => {
			changes.removedTracks.push(track);
		});
		if (!dir.folder) {
			const folder = await this.newFolder(dir);
			changes.newFolders.push(folder);
		}
		await this.compareSubs(dir, changes);
	}

	private async compareFoldersR(dir: MatchDir, changes: MergeChanges): Promise<void> {
		if (dir.folder) {
			if (Merger.folderHasChanged(dir)) {
				const data = await this.updateFolder(dir);
				if (data) {
					changes.updateFolders.push(data);
					dir.folder = data;
				}
			} else {
				changes.unchangedFolders.push(dir.folder);
			}
			for (const d of dir.directories) {
				await this.compareFoldersR(d, changes);
			}
		} else {
			return Promise.reject(Error('db entry must exists to compare ' + dir.name));
		}
	}

	async merge(dir: MatchDir, changes: MergeChanges): Promise<void> {
		await this.compareFilesR(dir, changes);
		fillMatchTags(dir);
		await this.compareFoldersR(dir, changes);
	}
}
