/* tslint:disable:max-classes-per-file */
import {Jam} from '../../model/jam-rest-data';
import {TrackHealthID} from '../../model/jam-types';
import {Subsonic} from '../../model/subsonic-rest-data';
import Logger from '../../utils/logger';
import {RootStatus} from '../root/root.model';
import {RootStore} from '../root/root.store';
import {logChanges, MergeChanges} from '../scan/scan.changes';
import {ScanService} from '../scan/scan.service';

const log = Logger('IO');

export enum ScanRequestMode {
	refreshRoot,
	refreshTracks,
	removeRoot,
	refreshFolders,
	removeTracks,
	deleteFolders,
	moveFolders,
	moveTracks,
	renameTrack,
	renameFolder,
	writeRawTags,
	fixTrack
}

export abstract class ScanRequest {
	protected constructor(public id: string, public rootID: string, public mode: ScanRequestMode) {

	}

	abstract execute(): Promise<MergeChanges>;

	async run(): Promise<MergeChanges> {
		try {
			const changes = await this.execute();
			logChanges(changes);
			return changes;
		} catch (e) {
			console.log(e.stack);
			log.error('Scanning Error', this.rootID, e.toString());
			if (['EACCES', 'ENOENT'].includes((e as any).code)) {
				return Promise.reject(Error('Directory not found/no access/error in filesystem'));
			}
			return Promise.reject(e);
		}
	}
}

export class ScanRequestMoveTracks extends ScanRequest {

	constructor(public id: string, public rootID: string, public trackIDs: Array<string>, public newParentID: string, public scanService: ScanService) {
		super(id, rootID, ScanRequestMode.moveTracks);
	}

	async execute(): Promise<MergeChanges> {
		return this.scanService.moveTracks(this.rootID, this.trackIDs, this.newParentID);
	}

}

export class ScanRequestRenameTrack extends ScanRequest {

	constructor(public id: string, public rootID: string, public trackID: string, public newName: string, public scanService: ScanService) {
		super(id, rootID, ScanRequestMode.renameTrack);
	}

	async execute(): Promise<MergeChanges> {
		return this.scanService.renameTrack(this.rootID, this.trackID, this.newName);
	}

}

export class ScanRequestFixTrack extends ScanRequest {

	constructor(public id: string, public rootID: string, public trackID: string, public fixID: TrackHealthID, public scanService: ScanService) {
		super(id, rootID, ScanRequestMode.fixTrack);
	}

	async execute(): Promise<MergeChanges> {
		return this.scanService.fixTrack(this.rootID, this.trackID, this.fixID);
	}

}

export class ScanRequestRenameFolder extends ScanRequest {

	constructor(public id: string, public rootID: string, public folderID: string, public newName: string, public scanService: ScanService) {
		super(id, rootID, ScanRequestMode.renameFolder);
	}

	async execute(): Promise<MergeChanges> {
		return this.scanService.renameFolder(this.rootID, this.folderID, this.newName);
	}

}

export class ScanRequestWriteRawTags extends ScanRequest {
	tags: Array<{ trackID: string, tag: Jam.RawTag }> = [];

	constructor(public id: string, public rootID: string, public trackID: string, public tag: Jam.RawTag, public scanService: ScanService) {
		super(id, rootID, ScanRequestMode.writeRawTags);
		this.tags.push({trackID, tag});
	}

	async execute(): Promise<MergeChanges> {
		return this.scanService.writeTrackTags(this.rootID, this.tags);
	}

}

export class ScanRequestRefreshRoot extends ScanRequest {

	constructor(public id: string, public rootID: string, public forceMetaRefresh: boolean, public scanService: ScanService) {
		super(id, rootID, ScanRequestMode.refreshRoot);
	}

	async execute(): Promise<MergeChanges> {
		return this.scanService.scanRoot(this.rootID, this.forceMetaRefresh);
	}

}

export class ScanRequestRefreshFolders extends ScanRequest {

	constructor(public id: string, public rootID: string, public scanService: ScanService, public folderIDs: Array<string>) {
		super(id, rootID, ScanRequestMode.refreshFolders);
	}

	async execute(): Promise<MergeChanges> {
		return this.scanService.refreshFolders(this.rootID, this.folderIDs);
	}

}

export class ScanRequestMoveFolders extends ScanRequest {

	constructor(public id: string, public rootID: string, public scanService: ScanService, public newParentID: string, public folderIDs: Array<string>) {
		super(id, rootID, ScanRequestMode.moveFolders);
	}

	async execute(): Promise<MergeChanges> {
		return this.scanService.moveFolders(this.rootID, this.newParentID, this.folderIDs);
	}
}

export class ScanRequestRemoveRoot extends ScanRequest {

	constructor(public id: string, public rootID: string, public scanService: ScanService) {
		super(id, rootID, ScanRequestMode.removeRoot);
	}

	async execute(): Promise<MergeChanges> {
		return this.scanService.removeRoot(this.rootID);
	}
}

export class ScanRequestRefreshTracks extends ScanRequest {

	constructor(public id: string, public rootID: string, public scanService: ScanService, public trackIDs: Array<string>) {
		super(id, rootID, ScanRequestMode.refreshTracks);
	}

	async execute(): Promise<MergeChanges> {
		return this.scanService.refreshTracks(this.rootID, this.trackIDs);
	}
}

export class ScanRequestRemoveTracks extends ScanRequest {

	constructor(public id: string, public rootID: string, public scanService: ScanService, public trackIDs: Array<string>) {
		super(id, rootID, ScanRequestMode.removeTracks);
	}

	async execute(): Promise<MergeChanges> {
		return this.scanService.deleteTracks(this.rootID, this.trackIDs);
	}
}

export class ScanRequestDeleteFolders extends ScanRequest {

	constructor(public id: string, public rootID: string, public scanService: ScanService, public folderIDs: Array<string>) {
		super(id, rootID, ScanRequestMode.deleteFolders);
	}

	async execute(): Promise<MergeChanges> {
		return this.scanService.deleteFolders(this.rootID, this.folderIDs);
	}
}

export class IoService {
	public scanning = false;
	private scanningCount: undefined | number;
	private rootstatus: { [id: string]: RootStatus } = {};
	private current: ScanRequest | undefined;
	private queue: Array<ScanRequest> = [];
	// private delayedTrackRefresh: { [rootID: string]: { request: ScanRequestRefreshTracks, timeout?: NodeJS.Timeout } } = {};
	private delayedTrackTagWrite: { [rootID: string]: { request: ScanRequestWriteRawTags, timeout?: NodeJS.Timeout } } = {};
	private nextID: number = Date.now();
	private afterScanTimeout: NodeJS.Timeout | undefined;
	private history: Array<{
		id: string;
		error?: string;
		date: number;
	}> = [];

	constructor(private rootStore: RootStore, private scanService: ScanService, private onRefresh: () => Promise<void>) {
	}

	getScanID(): string {
		this.nextID += 1;
		return this.nextID.toString();
	}

	getScanStatus(): Subsonic.ScanStatus {
		return {scanning: this.scanning, count: this.scanningCount};
	}

	getScanActionStatus(id: string): Jam.AdminChangeQueueInfo {
		if (this.current && this.current.id === id) {
			return {id};
		}
		const cmd = this.queue.find(c => c.id === id);
		if (cmd) {
			const pos = this.queue.indexOf(cmd);
			return {id, pos: pos >= 0 ? pos : undefined};
		}
		const done = this.history.find(c => c.id === id);
		if (done) {
			return {id, error: done.error, done: done.date};
		}
		const k = Object.keys(this.delayedTrackTagWrite).find(key => this.delayedTrackTagWrite[key].request.id === id);
		if (k) {
			return {id};
		}
		return {id, error: 'ID not found', done: Date.now()};
	}

	getRootStatus(id: string): RootStatus {
		let status = this.rootstatus[id];
		if (!status) {
			status = {lastScan: Date.now()};
		}
		if (!status.scanning) {
			const cmd = this.queue.find(c => c.rootID === id);
			status.scanning = !!cmd;
		}
		return status;
	}

	private async runRequest(cmd: ScanRequest): Promise<void> {
		this.clearAfterRefresh();
		this.rootstatus[cmd.rootID] = {lastScan: Date.now(), scanning: true};
		try {
			this.current = cmd;
			await cmd.run();
			this.rootstatus[cmd.rootID] = {lastScan: Date.now()};
			this.history.push({id: cmd.id, date: Date.now()});
			this.current = undefined;
		} catch (e) {
			this.current = undefined;
			this.rootstatus[cmd.rootID] = {lastScan: Date.now(), error: e.toString()};
			this.history.push({id: cmd.id, error: e.toString(), date: Date.now()});
		}
		if (this.queue.length === 0) {
			this.runAfterRefresh();
		}
	}

	private runAfterRefresh(): void {
		this.clearAfterRefresh();
		this.afterScanTimeout = setTimeout(() => {
			this.clearAfterRefresh();
			this.onRefresh()
				.catch(e => {
					console.error(e);
				});
		}, 10000);
	}

	private clearAfterRefresh(): void {
		if (this.afterScanTimeout) {
			clearTimeout(this.afterScanTimeout);
		}
		this.afterScanTimeout = undefined;
	}

	private findRequest(rootID: string, mode: ScanRequestMode): ScanRequest | undefined {
		return this.queue.find(c => !!c.rootID && (c.rootID === rootID && c.mode === mode));
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
		log.info('Start Processing');
		this.next()
			.then(() => {
				this.scanning = false;
				log.info('Stop Processing');
			})
			.catch(e => {
				this.scanning = false;
				log.info('Stop Processing');
				log.error(e);
			});

	}

	async refresh(forceMetaRefresh?: boolean): Promise<Array<Jam.AdminChangeQueueInfo>> {
		const rootIDs = await this.rootStore.allIds();
		const result = [];
		for (const rootID of rootIDs) {
			result.push(await this.refreshRoot(rootID, forceMetaRefresh));
		}
		return result;
	}

	private addRequest(req: ScanRequest): Jam.AdminChangeQueueInfo {
		this.queue.push(req);
		this.run();
		return this.getRequestInfo(req);
	}

	private getRequestInfo(req: ScanRequest): Jam.AdminChangeQueueInfo {
		const pos = this.queue.indexOf(req);
		return {id: req.id, pos: pos >= 0 ? pos : undefined};
	}

	/*
		refreshTrack(track: Track): Jam.AdminChangeQueueInfo {
			const oldRequest = <ScanRequestRefreshTracks>this.findRequest(track.rootID, ScanRequestMode.refreshTracks);
			if (oldRequest) {
				if (!oldRequest.trackIDs.includes(track.id)) {
					oldRequest.trackIDs.push(track.id);
				}
				return this.getRequestInfo(oldRequest);
			}
			let delayedCmd = this.delayedTrackRefresh[track.rootID];
			if (delayedCmd) {
				if (delayedCmd.timeout) {
					clearTimeout(delayedCmd.timeout);
				}
				if (!delayedCmd.request.trackIDs.includes(track.id)) {
					delayedCmd.request.trackIDs.push(track.id);
				}
				return this.getRequestInfo(delayedCmd.request);
			} else {
				delayedCmd = {request: new ScanRequestRefreshTracks(this.getScanID(), track.rootID, this.scanService, [track.id]), timeout: undefined};
				this.delayedTrackRefresh[track.rootID] = delayedCmd;
			}
			delayedCmd.timeout = setTimeout(() => {
				delete this.delayedTrackRefresh[track.rootID];
				this.queue.push(delayedCmd.request);
				this.run();
			}, 10000);
			return this.getRequestInfo(delayedCmd.request);
		}
	*/
	refreshRoot(rootID: string, forceMetaRefresh?: boolean): Jam.AdminChangeQueueInfo {
		const oldRequest = this.findRequest(rootID, ScanRequestMode.refreshRoot) as ScanRequestRefreshRoot;
		if (oldRequest) {
			if (forceMetaRefresh) {
				oldRequest.forceMetaRefresh = true;
			}
			return this.getRequestInfo(oldRequest);
		}
		return this.addRequest(new ScanRequestRefreshRoot(this.getScanID(), rootID, forceMetaRefresh === true, this.scanService));
	}

	removeRoot(rootID: string): Jam.AdminChangeQueueInfo {
		const oldRequest = this.findRequest(rootID, ScanRequestMode.removeRoot);
		if (oldRequest) {
			return this.getRequestInfo(oldRequest);
		}
		return this.addRequest(new ScanRequestRemoveRoot(this.getScanID(), rootID, this.scanService));
	}

	moveFolders(folderIDs: Array<string>, newParentID: string, rootID: string): Jam.AdminChangeQueueInfo {
		const oldRequest = this.queue.find(c => !!c.rootID && (c.rootID === rootID && c.mode === ScanRequestMode.moveFolders && (c as ScanRequestMoveFolders).newParentID === newParentID)) as ScanRequestMoveFolders;
		if (oldRequest) {
			for (const id of folderIDs) {
				if (!oldRequest.folderIDs.includes(id)) {
					oldRequest.folderIDs.push(id);
				}
			}
			return this.getRequestInfo(oldRequest);
		}
		return this.addRequest(new ScanRequestMoveFolders(this.getScanID(), rootID, this.scanService, newParentID, folderIDs));
	}

	/*
		refreshFolders(folderIDs: Array<string>, rootID: string): Jam.AdminChangeQueueInfo {
			const oldRequest = <ScanRequestRefreshFolders>this.findRequest(rootID, ScanRequestMode.refreshFolders);
			if (oldRequest) {
				for (const id of folderIDs) {
					if (!oldRequest.folderIDs.includes(id)) {
						oldRequest.folderIDs.push(id);
					}
				}
				return this.getRequestInfo(oldRequest);
			} else {
				return this.addRequest(new ScanRequestRefreshFolders(this.getScanID(), rootID, this.scanService, folderIDs));
			}
		}
	*/
	deleteFolder(id: string, rootID: string): Jam.AdminChangeQueueInfo {
		const oldRequest = this.findRequest(rootID, ScanRequestMode.refreshFolders) as ScanRequestDeleteFolders;
		if (oldRequest) {
			if (!oldRequest.folderIDs.includes(id)) {
				oldRequest.folderIDs.push(id);
			}
			return this.getRequestInfo(oldRequest);
		}
		return this.addRequest(new ScanRequestDeleteFolders(this.getScanID(), rootID, this.scanService, [id]));
	}

	removeTrack(id: string, rootID: string): Jam.AdminChangeQueueInfo {
		const oldRequest = this.findRequest(rootID, ScanRequestMode.removeTracks) as ScanRequestRemoveTracks;
		if (oldRequest) {
			if (!oldRequest.trackIDs.includes(id)) {
				oldRequest.trackIDs.push(id);
			}
			return this.getRequestInfo(oldRequest);
		}
		return this.addRequest(new ScanRequestRemoveTracks(this.getScanID(), rootID, this.scanService, [id]));
	}

	moveTracks(trackIDs: Array<string>, newParentID: string, rootID: string): Jam.AdminChangeQueueInfo {
		const oldRequest = this.queue.find(c => !!c.rootID && (c.rootID === rootID && c.mode === ScanRequestMode.moveTracks && (c as ScanRequestMoveTracks).newParentID === newParentID)) as ScanRequestMoveTracks;
		if (oldRequest) {
			for (const id of trackIDs) {
				if (!oldRequest.trackIDs.includes(id)) {
					oldRequest.trackIDs.push(id);
				}
			}
			return this.getRequestInfo(oldRequest);
		}
		return this.addRequest(new ScanRequestMoveTracks(this.getScanID(), rootID, trackIDs, newParentID, this.scanService));
	}

	renameTrack(trackID: string, name: string, rootID: string): Jam.AdminChangeQueueInfo {
		return this.addRequest(new ScanRequestRenameTrack(this.getScanID(), rootID, trackID, name, this.scanService));
	}

	writeRawTag(trackID: string, tag: Jam.RawTag, rootID: string): Jam.AdminChangeQueueInfo {
		const oldRequest = this.findRequest(rootID, ScanRequestMode.writeRawTags) as ScanRequestWriteRawTags;
		if (oldRequest) {
			oldRequest.tags.push({trackID, tag});
			return this.getRequestInfo(oldRequest);
		}
		let delayedCmd = this.delayedTrackTagWrite[rootID];
		if (delayedCmd) {
			if (delayedCmd.timeout) {
				clearTimeout(delayedCmd.timeout);
			}
			delayedCmd.request.tags.push({trackID, tag});
		} else {
			delayedCmd = {request: new ScanRequestWriteRawTags(this.getScanID(), rootID, trackID, tag, this.scanService), timeout: undefined};
			this.delayedTrackTagWrite[rootID] = delayedCmd;
		}
		delayedCmd.timeout = setTimeout(() => {
			delete this.delayedTrackTagWrite[rootID];
			this.queue.push(delayedCmd.request);
			this.run();
		}, 10000);
		return this.getRequestInfo(delayedCmd.request);
	}

	public fixTrack(trackID: string, fixID: TrackHealthID, rootID: string): Jam.AdminChangeQueueInfo {
		return this.addRequest(new ScanRequestFixTrack(this.getScanID(), rootID, trackID, fixID, this.scanService));
	}

	public renameFolder(folderID: string, name: string, rootID: string): Jam.AdminChangeQueueInfo {
		return this.addRequest(new ScanRequestRenameFolder(this.getScanID(), rootID, folderID, name, this.scanService));
	}

}
