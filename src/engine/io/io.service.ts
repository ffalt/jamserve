import {Jam} from '../../model/jam-rest-data';
import {ArtworkImageType, RootScanStrategy, TrackHealthID} from '../../model/jam-types';
import {Subsonic} from '../../model/subsonic-rest-data';
import {logger} from '../../utils/logger';
import {RootStatus} from '../root/root.model';
import {RootStore} from '../root/root.store';
import {Changes} from '../worker/changes/changes';
import {logChanges} from '../worker/changes/changes.logger';
import {
	WorkerRequestCreateArtwork,
	WorkerRequestCreateFolder,
	WorkerRequestCreateRoot,
	WorkerRequestDeleteArtwork,
	WorkerRequestDeleteFolders,
	WorkerRequestDownloadArtwork,
	WorkerRequestFixTrack,
	WorkerRequestMoveFolders,
	WorkerRequestMoveTracks,
	WorkerRequestParameters,
	WorkerRequestRefreshRoot,
	WorkerRequestRemoveRoot,
	WorkerRequestRemoveTracks,
	WorkerRequestRenameArtwork,
	WorkerRequestRenameFolder,
	WorkerRequestRenameTrack,
	WorkerRequestUpdateArtwork,
	WorkerRequestUpdateRoot,
	WorkerRequestWriteTrackTags,
	WorkerService
} from '../worker/worker.service';

const log = logger('IO');

export enum WorkerRequestMode {
	refreshRoot,
	removeRoot,
	updateRoot,
	createRoot,

	fixTrack,
	moveTracks,
	removeTracks,
	renameTrack,
	writeTrackTags,

	createFolder,
	deleteFolders,
	moveFolders,
	renameFolder,

	deleteArtwork,
	downloadArtwork,
	updateArtwork,
	createArtwork,
	renameArtwork
}

class WorkerRequest<T extends WorkerRequestParameters> {

	constructor(
		public id: string, public mode: WorkerRequestMode,
		public execute: (parameters: T) => Promise<Changes>, public parameters: T
	) {
	}

	async run(): Promise<Changes> {
		try {
			return await this.execute(this.parameters);
		} catch (e) {
			console.error(e.stack);
			// log.error('Scanning Error', this.rootID, e.toString());
			if (['EACCES', 'ENOENT'].includes(e.code)) {
				return Promise.reject(Error('Directory not found/no access/error in filesystem'));
			}
			return Promise.reject(e);
		}
	}
}

export class IoService {
	public scanning = false;
	private scanningCount: undefined | number;
	private rootstatus = new Map<string, RootStatus>();
	private current: WorkerRequest<WorkerRequestParameters> | undefined;
	private queue: Array<WorkerRequest<WorkerRequestParameters>> = [];
	private delayedTrackTagWrite = new Map<string, { request: WorkerRequest<WorkerRequestWriteTrackTags>, timeout?: NodeJS.Timeout }>();
	private delayedTrackFix = new Map<string, { request: WorkerRequest<WorkerRequestFixTrack>, timeout?: NodeJS.Timeout }>();
	private nextID: number = Date.now();
	private afterScanTimeout: NodeJS.Timeout | undefined;
	private history: Array<{ id: string; error?: string; date: number; }> = [];

	constructor(private rootStore: RootStore, private workerService: WorkerService, private onRefresh: () => Promise<void>) {
	}

	private generateRequestID(): string {
		this.nextID += 1;
		return this.nextID.toString();
	}

	private async runRequest(cmd: WorkerRequest<WorkerRequestParameters>): Promise<void> {
		this.clearAfterRefresh();
		this.rootstatus.set(cmd.parameters.rootID, {lastScan: Date.now(), scanning: true});
		try {
			this.current = cmd;
			const changes = await cmd.run();
			logChanges(changes);
			this.rootstatus.set(cmd.parameters.rootID, {lastScan: Date.now()});
			this.history.push({id: cmd.id, date: Date.now()});
			this.current = undefined;
		} catch (e) {
			this.current = undefined;
			let msg = e.toString();
			if (msg.startsWith('Error:')) {
				msg = msg.slice(6).trim();
			}
			this.rootstatus.set(cmd.parameters.rootID, {lastScan: Date.now(), error: msg});
			this.history.push({id: cmd.id, error: msg, date: Date.now()});
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

	private findRequest(rootID: string, mode: WorkerRequestMode): WorkerRequest<WorkerRequestParameters> | undefined {
		return this.queue.find(c => !!c.parameters.rootID && (c.parameters.rootID === rootID && c.mode === mode));
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

	private addRequest(req: WorkerRequest<any>): Jam.AdminChangeQueueInfo {
		this.queue.push(req);
		this.run();
		return this.getRequestInfo(req);
	}

	private getRequestInfo(req: WorkerRequest<any>): Jam.AdminChangeQueueInfo {
		const pos = this.queue.indexOf(req);
		return {id: req.id, pos: pos >= 0 ? pos : undefined};
	}

	private newRequest<T extends WorkerRequestParameters>(mode: WorkerRequestMode, execute: (parameters: T) => Promise<Changes>, parameters: T): Jam.AdminChangeQueueInfo {
		return this.addRequest(new WorkerRequest<T>(this.generateRequestID(), mode, execute, parameters));
	}

	getScanStatus(): Subsonic.ScanStatus {
		return {scanning: this.scanning, count: this.scanningCount};
	}

	getAdminChangeQueueInfoStatus(id: string): Jam.AdminChangeQueueInfo {
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
		for (const d of this.delayedTrackTagWrite) {
			if (d[1].request.id === id) {
				return {id};
			}
		}
		for (const d of this.delayedTrackFix) {
			if (d[1].request.id === id) {
				return {id};
			}
		}
		return {id, error: 'ID not found', done: Date.now()};
	}

	getRootStatus(id: string): RootStatus {
		let status = this.rootstatus.get(id);
		if (!status) {
			status = {lastScan: Date.now()};
		}
		if (!status.scanning) {
			const cmd = this.queue.find(c => c.parameters.rootID === id);
			status.scanning = !!cmd;
		}
		return status;
	}

	async refresh(forceMetaRefresh?: boolean): Promise<Array<Jam.AdminChangeQueueInfo>> {
		const rootIDs = await this.rootStore.allIds();
		const result: Array<Jam.AdminChangeQueueInfo> = [];
		for (const rootID of rootIDs) {
			result.push(await this.refreshRoot(rootID, forceMetaRefresh));
		}
		return result;
	}

	async refreshRoot(rootID: string, forceMetaRefresh?: boolean): Promise<Jam.AdminChangeQueueInfo> {
		const oldRequest = this.findRequest(rootID, WorkerRequestMode.refreshRoot);
		if (oldRequest) {
			if (forceMetaRefresh) {
				(oldRequest.parameters as WorkerRequestRefreshRoot).forceMetaRefresh = true;
			}
			return this.getRequestInfo(oldRequest);
		}
		return this.newRequest<WorkerRequestRefreshRoot>(
			WorkerRequestMode.refreshRoot, p => this.workerService.refreshRoot(p), {rootID, forceMetaRefresh: !!forceMetaRefresh}
		);
	}

	async removeRoot(rootID: string): Promise<Jam.AdminChangeQueueInfo> {
		const oldRequest = this.findRequest(rootID, WorkerRequestMode.removeRoot);
		if (oldRequest) {
			return this.getRequestInfo(oldRequest);
		}
		return this.newRequest<WorkerRequestRemoveRoot>(
			WorkerRequestMode.removeRoot, p => this.workerService.removeRoot(p), {rootID}
		);
	}

	async moveFolders(folderIDs: Array<string>, newParentID: string, rootID: string): Promise<Jam.AdminChangeQueueInfo> {
		const oldRequest = this.queue.find(c =>
			(!!c.parameters.rootID) && (c.parameters.rootID === rootID) &&
			(c.mode === WorkerRequestMode.moveFolders) && ((c.parameters as WorkerRequestMoveFolders).newParentID === newParentID)
		);
		if (oldRequest) {
			for (const id of folderIDs) {
				if (!(oldRequest.parameters as WorkerRequestMoveFolders).folderIDs.includes(id)) {
					(oldRequest.parameters as WorkerRequestMoveFolders).folderIDs.push(id);
				}
			}
			return this.getRequestInfo(oldRequest);
		}
		return this.newRequest<WorkerRequestMoveFolders>(
			WorkerRequestMode.moveFolders, p => this.workerService.moveFolders(p), {rootID, newParentID, folderIDs}
		);
	}

	async deleteFolder(id: string, rootID: string): Promise<Jam.AdminChangeQueueInfo> {
		const oldRequest = this.findRequest(rootID, WorkerRequestMode.deleteFolders);
		if (oldRequest) {
			if (!(oldRequest.parameters as WorkerRequestDeleteFolders).folderIDs.includes(id)) {
				(oldRequest.parameters as WorkerRequestDeleteFolders).folderIDs.push(id);
			}
			return this.getRequestInfo(oldRequest);
		}
		return this.newRequest<WorkerRequestDeleteFolders>(
			WorkerRequestMode.deleteFolders, p => this.workerService.deleteFolders(p), {rootID, folderIDs: [id]}
		);
	}

	async renameArtwork(folderID: string, artworkID: string, newname: string, rootID: string): Promise<Jam.AdminChangeQueueInfo> {
		return this.newRequest<WorkerRequestRenameArtwork>(
			WorkerRequestMode.renameArtwork, p => this.workerService.renameArtwork(p), {rootID, folderID, artworkID, name: newname}
		);
	}

	async updateArtwork(folderID: string, artworkID: string, artworkFilename: string, artworkMimeType: string, rootID: string): Promise<Jam.AdminChangeQueueInfo> {
		return this.newRequest<WorkerRequestUpdateArtwork>(
			WorkerRequestMode.updateArtwork, p => this.workerService.updateArtwork(p), {rootID, folderID, artworkID, artworkFilename, artworkMimeType}
		);
	}

	async createArtwork(folderID: string, artworkFilename: string, artworkMimeType: string, types: Array<ArtworkImageType>, rootID: string): Promise<Jam.AdminChangeQueueInfo> {
		return this.newRequest<WorkerRequestCreateArtwork>(
			WorkerRequestMode.createArtwork, p => this.workerService.createArtwork(p), {rootID, folderID, artworkFilename, artworkMimeType, types}
		);
	}

	async downloadArtwork(folderID: string, artworkURL: string, types: Array<ArtworkImageType>, rootID: string): Promise<Jam.AdminChangeQueueInfo> {
		return this.newRequest<WorkerRequestDownloadArtwork>(
			WorkerRequestMode.downloadArtwork, p => this.workerService.downloadArtwork(p), {rootID, folderID, artworkURL, types}
		);
	}

	async deleteArtwork(folderID: string, artworkID: string, rootID: string): Promise<Jam.AdminChangeQueueInfo> {
		return this.newRequest<WorkerRequestDeleteArtwork>(
			WorkerRequestMode.deleteArtwork, p => this.workerService.deleteArtwork(p), {rootID, folderID, artworkID}
		);
	}

	async removeTrack(id: string, rootID: string): Promise<Jam.AdminChangeQueueInfo> {
		const oldRequest = this.findRequest(rootID, WorkerRequestMode.removeTracks);
		if (oldRequest) {
			if (!(oldRequest.parameters as WorkerRequestRemoveTracks).trackIDs.includes(id)) {
				(oldRequest.parameters as WorkerRequestRemoveTracks).trackIDs.push(id);
			}
			return this.getRequestInfo(oldRequest);
		}
		return this.newRequest<WorkerRequestRemoveTracks>(
			WorkerRequestMode.removeTracks, p => this.workerService.removeTracks(p), {rootID, trackIDs: [id]}
		);
	}

	async moveTracks(trackIDs: Array<string>, newParentID: string, rootID: string): Promise<Jam.AdminChangeQueueInfo> {
		const oldRequest = this.queue.find(c => (
			(!!c.parameters.rootID) && (c.parameters.rootID === rootID) &&
			(c.mode === WorkerRequestMode.moveTracks) && (c.parameters as WorkerRequestMoveTracks).newParentID === newParentID)
		);
		if (oldRequest) {
			for (const id of trackIDs) {
				if (!(oldRequest.parameters as WorkerRequestMoveTracks).trackIDs.includes(id)) {
					(oldRequest.parameters as WorkerRequestMoveTracks).trackIDs.push(id);
				}
			}
			return this.getRequestInfo(oldRequest);
		}
		return this.newRequest<WorkerRequestMoveTracks>(
			WorkerRequestMode.moveTracks, p => this.workerService.moveTracks(p), {rootID, trackIDs, newParentID}
		);
	}

	async renameTrack(trackID: string, newName: string, rootID: string): Promise<Jam.AdminChangeQueueInfo> {
		return this.newRequest<WorkerRequestRenameTrack>(
			WorkerRequestMode.renameTrack, p => this.workerService.renameTrack(p), {rootID, trackID, newName}
		);
	}

	async writeRawTag(trackID: string, tag: Jam.RawTag, rootID: string): Promise<Jam.AdminChangeQueueInfo> {
		const oldRequest = this.findRequest(rootID, WorkerRequestMode.writeTrackTags);
		if (oldRequest) {
			(oldRequest.parameters as WorkerRequestWriteTrackTags).tags.push({trackID, tag});
			return this.getRequestInfo(oldRequest);
		}
		let delayedCmd = this.delayedTrackTagWrite.get(rootID);
		if (delayedCmd) {
			if (delayedCmd.timeout) {
				clearTimeout(delayedCmd.timeout);
			}
			(delayedCmd.request.parameters).tags.push({trackID, tag});
		} else {
			delayedCmd = {
				request:
					new WorkerRequest<WorkerRequestWriteTrackTags>(this.generateRequestID(),
						WorkerRequestMode.writeTrackTags, p => this.workerService.writeTrackTags(p), {rootID, tags: [{trackID, tag}]}),
				timeout: undefined
			};
			this.delayedTrackTagWrite.set(rootID, delayedCmd);
		}
		delayedCmd.timeout = setTimeout(() => {
			this.delayedTrackTagWrite.delete(rootID);
			if (delayedCmd) {
				this.addRequest(delayedCmd.request);
			}
		}, 10000);
		return this.getRequestInfo(delayedCmd.request);
	}

	async fixTrack(trackID: string, fixID: TrackHealthID, rootID: string): Promise<Jam.AdminChangeQueueInfo> {
		const oldRequest = this.findRequest(rootID, WorkerRequestMode.fixTrack);
		if (oldRequest) {
			(oldRequest.parameters as WorkerRequestFixTrack).fixes.push({trackID, fixID});
			return this.getRequestInfo(oldRequest);
		}
		let delayedCmd = this.delayedTrackFix.get(rootID);
		if (delayedCmd) {
			if (delayedCmd.timeout) {
				clearTimeout(delayedCmd.timeout);
			}
			(delayedCmd.request.parameters).fixes.push({trackID, fixID});
		} else {
			delayedCmd = {
				request:
					new WorkerRequest<WorkerRequestFixTrack>(this.generateRequestID(),
						WorkerRequestMode.fixTrack, p => this.workerService.fixTracks(p), {rootID, fixes: [{trackID, fixID}]}),
				timeout: undefined
			};
			this.delayedTrackFix.set(rootID, delayedCmd);
		}
		delayedCmd.timeout = setTimeout(() => {
			this.delayedTrackFix.delete(rootID);
			if (delayedCmd) {
				this.addRequest(delayedCmd.request);
			}
		}, 10000);
		return this.getRequestInfo(delayedCmd.request);
	}

	async renameFolder(folderID: string, newName: string, rootID: string): Promise<Jam.AdminChangeQueueInfo> {
		return this.newRequest<WorkerRequestRenameFolder>(
			WorkerRequestMode.renameFolder, p => this.workerService.renameFolder(p), {rootID, folderID, newName}
		);
	}

	async newFolder(parentID: string, name: string, rootID: string): Promise<Jam.AdminChangeQueueInfo> {
		return this.newRequest<WorkerRequestCreateFolder>(
			WorkerRequestMode.createFolder, p => this.workerService.createFolder(p), {rootID, parentID, name}
		);
	}

	async updateRoot(rootID: string, name: string, path: string, strategy: RootScanStrategy): Promise<Jam.AdminChangeQueueInfo> {
		return this.newRequest<WorkerRequestUpdateRoot>(
			WorkerRequestMode.updateRoot, p => this.workerService.updateRoot(p), {rootID, name, path, strategy}
		);
	}

	async createRoot(name: string, path: string, strategy: RootScanStrategy): Promise<Jam.AdminChangeQueueInfo> {
		return this.newRequest<WorkerRequestCreateRoot>(
			WorkerRequestMode.createRoot, p => this.workerService.createRoot(p), {rootID: '', name, path, strategy}
		);
	}
}
