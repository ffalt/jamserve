import {Store} from '../store';
import {AudioService} from '../audio/audio.service';
import Logger from '../../utils/logger';
import {ScanDir, scanDir} from './components/scan';
import {MatchDir, matchDir} from './components/match';
import {MergeChanges, Merger} from './components/merge';
import {MetaMerge} from './components/meta';
import {clearID3, scanForRemoved} from './components/clean';
import {Subsonic} from '../../model/subsonic-rest-data-1.16.0';
import {WaveformService} from '../waveform/waveform.service';
import {ImageService} from '../image/image.service';
import {Root, RootStatus} from '../../objects/root/root.model';
import {Folder} from '../../objects/folder/folder.model';
import {Track} from '../../objects/track/track.model';
import {RootStore} from '../../objects/root/root.store';
import {FolderStore} from '../../objects/folder/folder.store';
import {TrackStore} from '../../objects/track/track.store';

const log = Logger('IO');

/*
 	Processing:

 	* read folders and ile stats into tree
 	* merge tree into db
 	* merge Album and Artist meta data
 	* clean db

 */

/**
 * Handles file access/reading/writing
 */

export class IoService {
	public scanning = false;
	private scanningCount: undefined | number;
	private rootstatus: { [id: string]: RootStatus } = {};

	constructor(private store: Store, private audioService: AudioService, private imageService: ImageService, private waveformService: WaveformService) {
	}

	private async scanDir(dir: string, parent: Folder | undefined, level: number, rootID: string, changes: MergeChanges): Promise<Folder | undefined> {
		const scan: ScanDir = await scanDir(dir);
		const match: MatchDir = await matchDir(scan, this.store, rootID);
		if (parent) {
			match.parent = {name: parent.path, folder: parent, level, rootID: rootID, files: [], directories: [match], removedFolders: [], removedTracks: [], stat: {mtime: 0, ctime: 0}};
		}
		const merger = new Merger(rootID, this.store, this.audioService, (count: number) => {
			this.scanningCount = count;
		});
		await await merger.merge(match, changes);
		return match.folder;
	}

	getScanStatus(): Subsonic.ScanStatus {
		return {scanning: this.scanning, count: this.scanningCount};
	}

	getRootStatus(id: string): RootStatus {
		return this.rootstatus[id];
	}

	private startScanning(): MergeChanges {
		this.scanningCount = 0;
		this.scanning = true;
		return {
			newTracks: [],
			unchangedTracks: [],
			unchangedFolders: [],
			removedTracks: [],
			updateTracks: [],
			newFolders: [],
			removedFolders: [],
			updateFolders: []
		};
	}

	private async stopScanning(changes: MergeChanges): Promise<void> {
		this.scanning = false;
		this.scanningCount = undefined;
		await this.cleanScanStore(changes);
	}

	async cleanStore(): Promise<void> {
		const changes: MergeChanges = {
			newTracks: [],
			unchangedTracks: [],
			removedTracks: [],
			updateTracks: [],
			newFolders: [],
			unchangedFolders: [],
			removedFolders: [],
			updateFolders: []
		};
		await this.cleanScanStore(changes);
	}

	private async cleanScanStore(changes: MergeChanges): Promise<void> {
		const {removeTracks, removeFolders} = await scanForRemoved(this.store, changes);
		const trackIDs = await this.store.cleanStore(removeTracks, removeFolders);
		await this.imageService.clearImageCacheByIDs(trackIDs);
		await this.waveformService.clearWaveformCacheByIDs(trackIDs);
		await clearID3(this.store, this.imageService, removeTracks);
		const meta = new MetaMerge(this.store, this.imageService);
		await meta.sync(changes);
		log.info('New Tracks', changes.newTracks.length);
		log.info('New Folders', changes.newFolders.length);
		log.info('Update Tracks', changes.updateTracks.length);
		log.info('Update Folders', changes.updateFolders.length);
		log.info('Remove Tracks', changes.removedTracks.length);
		log.info('Remove Folders', changes.removedFolders.length);
	}

	async rescanFolder(folder: Folder): Promise<void> {
		if (this.scanning) {
			return;
		}
		const changes = this.startScanning();
		log.info('Start Scanning Folder', folder.path);
		if (!folder.parentID || folder.parentID.length === 0) {
			await this.scanDir(folder.path, undefined, 0, folder.rootID, changes);
		} else {
			const parent = await this.store.folderStore.byId(folder.parentID);
			if (parent) {
				await this.scanDir(folder.path, parent, parent.tag.level, folder.rootID, changes);
			}
			// TODO update all parent folder tags until root
		}
		await this.stopScanning(changes);
		log.info('Stop Scanning Folder', folder.path);
	}

	private async scanRoot(root: Root, changes: MergeChanges): Promise<void> {
		log.info('Scanning Root', root.path);
		this.rootstatus[root.id] = {lastScan: Date.now(), scanning: true};
		try {
			await this.scanDir(root.path, undefined, 0, root.id, changes);
			this.rootstatus[root.id] = {lastScan: Date.now()};
		} catch (e) {
			log.error('Scanning Error', root.path, e.toString());
			if (['EACCES', 'ENOENT'].indexOf((<any>e).code) >= 0) {
				this.rootstatus[root.id] = {lastScan: Date.now(), error: 'Directory not found/no access/error in filesystem'};
			} else {
				this.rootstatus[root.id] = {lastScan: Date.now(), error: e.toString()};
			}
		}
	}

	async rescanRoot(root: Root): Promise<void> {
		if (this.scanning) {
			return;
		}
		log.info('Start Scanning Root', root.name);
		const changes = this.startScanning();
		await this.scanRoot(root, changes);
		log.info('Stop Scanning Root', root.name);
		await this.stopScanning(changes);
	}

	async refresh(): Promise<void> {
		if (this.scanning) {
			return;
		}
		log.info('Start Scanning');
		const changes = this.startScanning();
		const roots = await this.store.rootStore.all();
		for (const root of roots) {
			await this.scanRoot(root, changes);
		}
		log.info('Stop Scanning');
		await this.stopScanning(changes);
	}

	async rescanTracks(tracks: Array<Track>): Promise<void> {
		// TODO: rescan tracks only, not the whole thing
		await this.refresh();
	}

	async applyFolderMove(folder: Folder, newPath: string): Promise<void> {
		const folders = await this.store.folderStore.search({inPath: folder.path});
		for (const f of folders) {
			f.path = f.path.replace(folder.path, newPath);
			await this.store.folderStore.replace(f);
		}
		const tracks = await this.store.trackStore.search({inPath: folder.path});
		for (const t of tracks) {
			t.path = t.path.replace(folder.path, newPath);
			await this.store.trackStore.replace(t);
		}
		const root = await this.store.rootStore.byId(folder.rootID);
		if (root) {
			await this.rescanRoot(root);
		}
	}

}
