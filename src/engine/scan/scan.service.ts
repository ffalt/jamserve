import {Store} from '../store/store';
import {AudioModule} from '../../modules/audio/audio.module';
import Logger from '../../utils/logger';
import {WaveformService} from '../waveform/waveform.service';
import {ImageModule} from '../../modules/image/image.module';
import {RootScanStrategy} from '../../model/jam-types';
import path from 'path';
import fse from 'fs-extra';
import {ensureTrailingPathSeparator} from '../../utils/fs-utils';
import {Jam} from '../../model/jam-rest-data';
import {DirScanner, ScanDir} from './scan.scan-dir';
import {MatchDir, ScanMatcher, DBMatcher, debugPrintTree} from './scan.match-dir';
import {emptyChanges, MergeChanges} from './scan.changes';
import {ScanMerger} from './scan.merge';
import {ScanCleaner} from './scan.clean';
import {ScanStorer} from './scan.store';
import {ScanMetaMerger} from './scan.merge-meta';
import {Root} from '../../objects/root/root.model';

const log = Logger('Scan.Service');

export class ScanService {
	private settings: Jam.AdminSettingsLibrary = {
		scanAtStart: true,
		audioBookGenreNames: []
	};

	constructor(private store: Store, private audioModule: AudioModule, private imageModule: ImageModule, private waveformService: WaveformService) {
	}

	public setSettings(settings: Jam.AdminSettingsLibrary) {
		this.settings = settings;
	}

	private async start(rootID: string): Promise<{ changes: MergeChanges, root: Root }> {
		const root = await this.store.rootStore.byId(rootID);
		if (!root) {
			return Promise.reject(Error(`Root ${rootID} not found`));
		}
		return {root, changes: emptyChanges()};
	}

	private async finish(changes: MergeChanges, rootID: string, forceMetaRefresh: boolean): Promise<MergeChanges> {
		const metaMerger = new ScanMetaMerger(this.store);
		await metaMerger.mergeMeta(forceMetaRefresh, rootID, changes);

		const scanStorer = new ScanStorer(this.store);
		await scanStorer.storeChanges(changes);

		const scanCleaner = new ScanCleaner(this.store, this.imageModule, this.waveformService);
		await scanCleaner.clean(changes);

		changes.end = Date.now();
		return changes;
	}

	async scanRoot(rootID: string, forceMetaRefresh: boolean): Promise<MergeChanges> {
		const {root, changes} = await this.start(rootID);

		const dirScanner = new DirScanner();
		const scan: ScanDir = await dirScanner.scan(root.path, rootID);

		const scanMatcher = new ScanMatcher(this.store);
		const matchRoot: MatchDir = await scanMatcher.match(scan, changes);

		const scanMerger = new ScanMerger(this.audioModule, this.store, this.settings, root.strategy || RootScanStrategy.auto);
		await scanMerger.merge(matchRoot, forceMetaRefresh, rootID, () => true, changes);

		return await this.finish(changes, rootID, forceMetaRefresh);
	}

	async removeRoot(rootID: string): Promise<MergeChanges> {
		const {root, changes} = await this.start(rootID);

		log.info('Removing Root', root.path);
		changes.removedTracks = await this.store.trackStore.search({rootID});
		changes.removedFolders = await this.store.folderStore.search({rootID});

		return await this.finish(changes, rootID, false);
	}

	async refreshTracks(rootID: string, trackIDs: Array<string>): Promise<MergeChanges> {
		const {root, changes} = await this.start(rootID);

		log.info('Refresh Tracks in Root', root.path);
		const tracks = await this.store.trackStore.byIds(trackIDs);
		const folderIDs: Array<string> = [];
		for (const track of tracks) {
			if (folderIDs.indexOf(track.parentID) < 0) {
				folderIDs.push(track.parentID);
			}
		}
		const dbMatcher = new DBMatcher(this.store);
		const {rootMatch, changedDirs} = await dbMatcher.match(folderIDs, trackIDs);

		const scanMerger = new ScanMerger(this.audioModule, this.store, this.settings, root.strategy || RootScanStrategy.auto);
		await scanMerger.merge(rootMatch, false, rootID, (dir) => changedDirs.indexOf(dir) >= 0, changes);

		return await this.finish(changes, rootID, false);
	}

	async deleteTracks(rootID: string, trackIDs: Array<string>): Promise<MergeChanges> {
		const {root, changes} = await this.start(rootID);

		changes.removedTracks = await this.store.trackStore.byIds(trackIDs);
		const trashPath = path.join(root.path, '.trash');
		for (const track of changes.removedTracks) {
			await fse.move(path.join(track.path, track.name), path.join(trashPath, Date.now() + '_' + track.name));
		}

		const folderIDs = [];
		for (const track of changes.removedTracks) {
			if (folderIDs.indexOf(track.parentID) < 0) {
				folderIDs.push(track.parentID);
			}
		}

		const dbMatcher = new DBMatcher(this.store);
		const {rootMatch, changedDirs} = await dbMatcher.match(folderIDs, []);

		const scanMerger = new ScanMerger(this.audioModule, this.store, this.settings, root.strategy || RootScanStrategy.auto);
		await scanMerger.merge(rootMatch, false, rootID, (dir) => changedDirs.indexOf(dir) >= 0, changes);

		return await this.finish(changes, rootID, false);
	}

	async deleteFolders(rootID: string, folderIDs: Array<string>): Promise<MergeChanges> {
		const {root, changes} = await this.start(rootID);
		const folders = await this.store.folderStore.byIds(folderIDs);
		for (const folder of folders) {
			if (folder.tag.level === 0) {
				return Promise.reject(Error('Root folder can not be deleted'));
			}
		}
		const inPaths = folders.map(f => f.path);
		changes.removedFolders = await this.store.folderStore.search({inPaths});
		const trashPath = path.join(root.path, '.trash');
		for (const folder of folders) {
			await fse.move(folder.path, path.join(trashPath, Date.now() + '_' + path.basename(folder.path)));
		}
		changes.removedTracks = await this.store.trackStore.search({inPaths});
		const parentIDs = [];
		for (const folder of folders) {
			if (folder.parentID && parentIDs.indexOf(folder.parentID) < 0) {
				parentIDs.push(folder.parentID);
			}
		}
		const dbMatcher = new DBMatcher(this.store);
		const {rootMatch, changedDirs} = await dbMatcher.match(parentIDs, []);

		const scanMerger = new ScanMerger(this.audioModule, this.store, this.settings, root.strategy || RootScanStrategy.auto);
		await scanMerger.merge(rootMatch, false, rootID, (dir) => changedDirs.indexOf(dir) >= 0, changes);

		return await this.finish(changes, rootID, false);
	}

	async refreshFolders(rootID: string, folderIDs: Array<string>): Promise<MergeChanges> {
		const {root, changes} = await this.start(rootID);

		const dbMatcher = new DBMatcher(this.store);
		const {rootMatch, changedDirs} = await dbMatcher.match(folderIDs, []);

		const scanMerger = new ScanMerger(this.audioModule, this.store, this.settings, root.strategy || RootScanStrategy.auto);
		await scanMerger.merge(rootMatch, false, rootID, (dir) => changedDirs.indexOf(dir) >= 0, changes);

		return await this.finish(changes, rootID, false);
	}

	async moveFolders(rootID: string, newParentID: any, folderIDs: any): Promise<MergeChanges> {
		const {root, changes} = await this.start(rootID);
		if (folderIDs.indexOf(newParentID) >= 0) {
			return Promise.reject(Error('Folder cannot be moved to itself'));
		}
		const newParent = await this.store.folderStore.byId(newParentID);
		if (!newParent) {
			return Promise.reject(Error('Destination Folder not found'));
		}
		const folders = await this.store.folderStore.byIds(folderIDs);
		const updateFolderIDs = folderIDs.slice(0);
		const updateTrackIDs: Array<string> = [];
		if (updateFolderIDs.indexOf(newParent.id) < 0) {
			updateFolderIDs.push(newParent.id);
		}
		const usedPathAfterMove: Array<string> = [];
		for (const folder of folders) {
			if (folder.parentID === newParentID) {
				return Promise.reject(Error('Folder is already in Destination'));
			}
			const dest = path.join(newParent.path, path.basename(folder.path));
			const exists = await fse.pathExists(dest);
			if (exists) {
				return Promise.reject(Error('Folder name already used in Destination'));
			}
			if (usedPathAfterMove.indexOf(dest) >= 0) {
				return Promise.reject(Error('Folder name will be already used in Destination after previous folder is moved'));
			}
			usedPathAfterMove.push(dest);
		}
		for (const folder of folders) {
			const dest = ensureTrailingPathSeparator(path.join(newParent.path, path.basename(folder.path)));
			await fse.move(folder.path, dest);
			if (updateFolderIDs.indexOf(folder.id) < 0) {
				updateFolderIDs.push(folder.id);
			}
			if (updateFolderIDs.indexOf(folder.parentID) < 0) {
				updateFolderIDs.push(folder.parentID);
			}
			const tracks = await this.store.trackStore.search({inPath: folder.path});
			for (const track of tracks) {
				track.path = track.path.replace(folder.path, dest);
				track.rootID = newParent.rootID;
				if (updateTrackIDs.indexOf(track.id) < 0) {
					updateTrackIDs.push(track.id);
				}
			}
			await this.store.trackStore.replaceMany(tracks);
			let subfolders = await this.store.folderStore.search({inPath: folder.path});
			subfolders = subfolders.filter(sub => sub.id !== folder.id);
			for (const sub of subfolders) {
				sub.path = sub.path.replace(folder.path, dest);
				sub.rootID = newParent.rootID;
				if (updateFolderIDs.indexOf(sub.id) < 0) {
					updateFolderIDs.push(sub.id);
				}
			}
			folder.path = ensureTrailingPathSeparator(dest);
			folder.rootID = rootID;
			folder.parentID = newParent.id;
			subfolders.push(folder);
			await this.store.folderStore.replaceMany(subfolders);
		}

		const dbMatcher = new DBMatcher(this.store);
		const {rootMatch, changedDirs} = await dbMatcher.match(updateFolderIDs, updateTrackIDs);

		const scanMerger = new ScanMerger(this.audioModule, this.store, this.settings, root.strategy || RootScanStrategy.auto);
		await scanMerger.merge(rootMatch, false, rootID, (dir) => {
			return changedDirs.indexOf(dir) >= 0;
		}, changes);

		return await this.finish(changes, rootID, false);
	}

	async moveTracks(rootID: string, trackIDs: Array<string>, newParentID: string): Promise<MergeChanges> {
		const {root, changes} = await this.start(rootID);
		const tracks = await this.store.trackStore.byIds(trackIDs);
		const newParent = await this.store.folderStore.byId(newParentID);
		if (!newParent) {
			return Promise.reject(Error('Destination Folder not found'));
		}
		const updateFolderIDs: Array<string> = [newParent.id];
		const updateTrackIDs: Array<string> = [];
		for (const track of tracks) {
			updateTrackIDs.push(track.id);
			if (updateFolderIDs.indexOf(track.parentID) < 0) {
				updateFolderIDs.push(track.parentID);
			}
			await fse.move(path.join(track.path, track.name), path.join(newParent.path, track.name));
			track.path = ensureTrailingPathSeparator(newParent.path);
			track.rootID = newParent.rootID;
			track.parentID = newParent.id;
		}
		await this.store.trackStore.replaceMany(tracks);
		const dbMatcher = new DBMatcher(this.store);

		const {rootMatch, changedDirs} = await dbMatcher.match(updateFolderIDs, updateTrackIDs);

		const scanMerger = new ScanMerger(this.audioModule, this.store, this.settings, root.strategy || RootScanStrategy.auto);
		await scanMerger.merge(rootMatch, false, rootID, (dir) => changedDirs.indexOf(dir) >= 0, changes);

		return await this.finish(changes, rootID, false);
	}
}
