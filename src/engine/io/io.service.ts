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
	refreshRoot,
	refreshTracks,
	removeRoot
}

export interface ScanRequest {
	root: Root;
	mode: ScanRequestMode;

	run(): Promise<void>;
}

export class ScanRequestRefreshRoot implements ScanRequest {
	mode = ScanRequestMode.refreshRoot;

	constructor(public root: Root, public scanService: ScanService) {

	}

	async run(): Promise<void> {
		log.info('Scanning Root', this.root.path);
		try {
			const changes = await this.scanService.run(this.root.path, this.root.id, this.root.strategy);
			logChanges(changes);
		} catch (e) {
			log.error('Scanning Error', this.root.path, e.toString());
			if (['EACCES', 'ENOENT'].indexOf((<any>e).code) >= 0) {
				return Promise.reject(Error('Directory not found/no access/error in filesystem'));
			} else {
				return Promise.reject(e);
			}
		}
	}

}

export class ScanRequestRemoveRoot implements ScanRequest {
	mode = ScanRequestMode.removeRoot;

	constructor(public root: Root, public scanService: ScanService) {

	}

	async run(): Promise<void> {
		log.info('Removing Root', this.root.path);
		try {
			const changes = await this.scanService.removeRoot(this.root.id);
			logChanges(changes);
		} catch (e) {
			log.error('Removing Error', this.root.path, e.toString());
			if (['EACCES', 'ENOENT'].indexOf((<any>e).code) >= 0) {
				return Promise.reject(Error('Directory not found/no access/error in filesystem'));
			} else {
				return Promise.reject(e);
			}
		}
	}
}

export class ScanRequestRefreshTracks implements ScanRequest {
	mode = ScanRequestMode.refreshTracks;

	constructor(public root: Root, public scanService: ScanService, public trackIDs: Array<string>) {

	}

	async run(): Promise<void> {
		log.info('Refresh Tracks in Root', this.root.path);
		try {
			const changes = await this.scanService.refreshTracks(this.root.id, this.trackIDs, this.root.strategy);
			logChanges(changes);
		} catch (e) {
			log.error('Refresh Tracks Error', this.root.path, e.toString());
			if (['EACCES', 'ENOENT'].indexOf((<any>e).code) >= 0) {
				return Promise.reject(Error('Directory not found/no access/error in filesystem'));
			} else {
				return Promise.reject(e);
			}
		}
	}
}

export class IoService {
	public scanning = false;
	private scanningCount: undefined | number;
	private rootstatus: { [id: string]: RootStatus } = {};
	private queue: Array<ScanRequest> = [];
	private delayedTrackRefresh: { [rootID: string]: { request: ScanRequestRefreshTracks, timeout?: NodeJS.Timeout } } = {};

	constructor(private rootStore: RootStore, private scanService: ScanService, private indexService: IndexService, private genreService: GenreService, private statsService: StatsService) {
	}

	getScanStatus(): Subsonic.ScanStatus {
		return {scanning: this.scanning, count: this.scanningCount};
	}

	getRootStatus(id: string): RootStatus {
		return this.rootstatus[id];
	}

	private async runRequest(cmd: ScanRequest): Promise<void> {
		this.rootstatus[cmd.root.id] = {lastScan: Date.now(), scanning: true};
		try {
			await cmd.run();
			this.rootstatus[cmd.root.id] = {lastScan: Date.now()};
		} catch (e) {
			this.rootstatus[cmd.root.id] = {lastScan: Date.now(), error: e.toString()};
		}
		await this.indexService.buildIndexes();
		await this.genreService.refresh();
		await this.statsService.refresh();
	}

	private findRequest(root: Root, mode: ScanRequestMode): ScanRequest | undefined {
		return this.queue.find(c => !!c.root && (c.root.id === root.id && c.mode === mode));
	}

	private async next(): Promise<void> {
		const cmd = this.queue.shift();
		if (cmd) {
			await this.runRequest(cmd);
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
						if (!this.findRequest(root, ScanRequestMode.refreshRoot)) {
							this.queue.push(new ScanRequestRefreshRoot(root, this.scanService));
						}
					}
					this.run();
				}
			);
	}

	refreshTrack(track: Track): void {
		this.rootStore.byId(track.rootID).then((root) => {
			if (!root) {
				log.error(Error('Track root not found: ' + track.rootID));
				return;
			}
			let delayedCmd = this.delayedTrackRefresh[track.rootID];
			if (delayedCmd) {
				if (delayedCmd.timeout) {
					clearTimeout(delayedCmd.timeout);
				}
				if (delayedCmd.request.trackIDs.indexOf(track.id) < 0) {
					delayedCmd.request.trackIDs.push(track.id);
				}
			} else {
				delayedCmd = {request: new ScanRequestRefreshTracks(root, this.scanService, [track.id]), timeout: undefined};
				this.delayedTrackRefresh[track.rootID] = delayedCmd;
			}
			delayedCmd.timeout = setTimeout(() => {
				delete this.delayedTrackRefresh[track.rootID];
				this.queue.push(delayedCmd.request);
				this.run();
			}, 10000);
		});
	}

	refreshRoot(root: Root): void {
		const oldRequest = this.findRequest(root, ScanRequestMode.refreshRoot);
		if (!oldRequest) {
			this.queue.push(new ScanRequestRefreshRoot(root, this.scanService));
			this.run();
		} else {
			oldRequest.root = root; // in case of scan strategy change
		}
	}

	removeRoot(root: Root): void {
		if (!this.findRequest(root, ScanRequestMode.removeRoot)) {
			this.queue.push(new ScanRequestRemoveRoot(root, this.scanService));
			this.run();
		}
	}
}
