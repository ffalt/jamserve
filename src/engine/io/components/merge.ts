import {Store} from '../../store/store';
import {MatchDir, MatchFile} from './match';
import {DBObjectType, FileTyp, FolderType} from '../../../model/jam-types';
import path from 'path';
import {AudioModule} from '../../../modules/audio/audio.module';
import {deepCompare} from '../../../utils/deep-compare';
import Logger from '../../../utils/logger';
import {fillMatchTags} from './tag';
import {Track} from '../../../objects/track/track.model';
import {Folder} from '../../../objects/folder/folder.model';
import {ensureTrailingPathSeparator} from '../../../utils/fs-utils';

const log = Logger('IO.merge');

export interface MergeTrackInfo {
	track: Track;
	dir: MatchDir;
}

export interface MergeChanges {
	newTracks: Array<MergeTrackInfo>;
	unchangedTracks: Array<MergeTrackInfo>;
	removedTracks: Array<Track>;
	updateTracks: Array<MergeTrackInfo>;
	newFolders: Array<Folder>;
	unchangedFolders: Array<Folder>;
	removedFolders: Array<Folder>;
	updateFolders: Array<Folder>;
}

export class Merger {
	scanningCount = 0;

	constructor(private rootID: string, private store: Store, private audio: AudioModule, private onProgress: (count: number) => void) {
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

	private async newFolder(dir: MatchDir): Promise<Folder> {
		log.info('New Folder', dir.name);
		const folder: Folder = {
			id: '',
			rootID: dir.rootID,
			path: ensureTrailingPathSeparator(dir.name),
			parentID: (dir.parent && dir.parent.folder ? dir.parent.folder.id : undefined),
			stat: {
				created: dir.stat.ctime,
				modified: dir.stat.mtime
			},
			tag: dir.tag || {tracks: 0, level: -1, type: FolderType.unknown},
			type: DBObjectType.folder
		};
		folder.id = await this.store.folderStore.add(folder);
		dir.folder = folder;
		return folder;
	}

	private async updateFolder(dir: MatchDir): Promise<Folder | undefined> {
		const old = dir.folder;
		if (!old) {
			return;
		}
		log.info('Update Folder', dir.name);
		const folder: Folder = {
			id: old.id,
			rootID: dir.rootID,
			path: ensureTrailingPathSeparator(dir.name),
			parentID: (dir.parent && dir.parent.folder ? dir.parent.folder.id : undefined),
			stat: {
				created: dir.stat.ctime,
				modified: dir.stat.mtime
			},
			tag: dir.tag || {tracks: 0, level: dir.level, type: FolderType.unknown},
			type: DBObjectType.folder,
			info: old.info
		};
		await this.store.folderStore.replace(folder);
		return folder;
	}

	private async buildTrack(file: MatchFile, parent: Folder): Promise<Track> {
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
			path: ensureTrailingPathSeparator(path.dirname(file.name)),
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

	private async newTrack(file: MatchFile, parent: Folder): Promise<Track> {
		log.info('New Track', file.name);
		const track = await this.buildTrack(file, parent);
		track.id = await this.store.trackStore.add(track);
		return track;
	}

	private async updateTrack(file: MatchFile, parent: Folder): Promise<Track | undefined> {
		log.info('Update Track', file.name);
		const old = file.track;
		if (!old) {
			return;
		}
		const track = await this.buildTrack(file, parent);
		track.id = old.id;
		track.info = old.info;
		await this.store.trackStore.replace(track);
		return track;
	}

	private async compareFile(file: MatchFile, dir: MatchDir, changes: MergeChanges, parent: Folder | undefined): Promise<void> {
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
