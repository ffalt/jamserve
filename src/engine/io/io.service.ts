import Logger from '../../utils/logger';
import {Subsonic} from '../../model/subsonic-rest-data';
import {Root, RootStatus} from '../../objects/root/root.model';
import {Track} from '../../objects/track/track.model';
import {IndexService} from '../index/index.service';
import {GenreService} from '../genre/genre.service';
import {logChanges, ScanService} from '../scan/scan.service';
import {RootStore} from '../../objects/root/root.store';
import {StatsService} from '../stats/stats.service';

const log = Logger('IO');

export enum ScanRequestMode {
	refresh,
	remove
}

export interface ScanRequest {
	root: Root;
	mode: ScanRequestMode;
}

export class IoService {
	public scanning = false;
	private scanningCount: undefined | number;
	private rootstatus: { [id: string]: RootStatus } = {};
	private queue: Array<ScanRequest> = [];

	constructor(private rootStore: RootStore, private scanService: ScanService, private indexService: IndexService, private genreService: GenreService, private statsService: StatsService) {
	}

	getScanStatus(): Subsonic.ScanStatus {
		return {scanning: this.scanning, count: this.scanningCount};
	}

	getRootStatus(id: string): RootStatus {
		return this.rootstatus[id];
	}

	private async cmdScanRoot(root: Root): Promise<void> {
		log.info('Scanning Root', root.path);
		this.rootstatus[root.id] = {lastScan: Date.now(), scanning: true};
		try {
			const changes = await this.scanService.run(root.path, root.id);
			logChanges(changes);
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

	private async cmdRemoveRoot(root: Root): Promise<void> {
		log.info('Removing Root', root.path);
		this.rootstatus[root.id] = {lastScan: Date.now(), scanning: true};
		try {
			const changes = await this.scanService.removeRoot(root.id);
			logChanges(changes);
			this.rootstatus[root.id] = {lastScan: Date.now()};
		} catch (e) {
			log.error('Removing Error', root.path, e.toString());
			if (['EACCES', 'ENOENT'].indexOf((<any>e).code) >= 0) {
				this.rootstatus[root.id] = {lastScan: Date.now(), error: 'Directory not found/no access/error in filesystem'};
			} else {
				this.rootstatus[root.id] = {lastScan: Date.now(), error: e.toString()};
			}
		}
	}

	private async runCmd(cmd: ScanRequest) {
		if (cmd.mode === ScanRequestMode.refresh) {
			await this.cmdScanRoot(cmd.root);
		} else if (cmd.mode === ScanRequestMode.remove) {
			await this.cmdRemoveRoot(cmd.root);
		}
		await this.indexService.buildIndexes();
		await this.genreService.refresh();
		await this.statsService.refresh();
	}

	private addRequest(root: Root, mode: ScanRequestMode) {
		const exists = this.queue.find(c => !!c.root && (c.root.id === root.id && c.mode === mode));
		if (!exists) {
			this.queue.push({root, mode});
		}
	}

	private async next(): Promise<void> {
		const cmd = this.queue.shift();
		if (cmd) {
			await this.runCmd(cmd);
			await this.next();
		}
	}

	private run(): void {
		if (this.scanning) {
			return;
		}
		this.scanning = true;
		log.info('Start Scanning');
		this.next()
			.then(() => {
				this.scanning = false;
				log.info('Stop Scanning');
			})
			.catch(e => {
				this.scanning = false;
				log.info('Stop Scanning');
				log.error(e);
			});

	}

	refresh(): void {
		this.rootStore.all()
			.then((roots) => {
					for (const root of roots) {
						this.addRequest(root, ScanRequestMode.refresh);
					}
					this.run();
				}
			);
	}

	refreshTracks(tracks: Array<Track>): void {
		const rootIDs = [];
		for (const track of tracks) {
			if (rootIDs.indexOf(track.rootID) < 0) {
				rootIDs.push(track.rootID);
			}
		}
		this.rootStore.byIds(rootIDs)
			.then((roots) => {
					for (const root of roots) {
						// TODO: rescan tracks only, not the whole root
						this.addRequest(root, ScanRequestMode.refresh);
					}
					this.run();
				}
			);
	}

	refreshRoot(root: Root): void {
		this.addRequest(root, ScanRequestMode.refresh);
		this.run();
	}

	removeRoot(root: Root): void {
		this.addRequest(root, ScanRequestMode.remove);
		this.run();
	}
}
