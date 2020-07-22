import {ArtworkImageType, RootScanStrategy, TrackHealthID} from '../../../types/enums';
import {Changes} from '../worker/changes';
import {WorkerService} from './worker.service';
import {RawTag} from '../../audio/rawTag';
import {Orm, OrmService} from './orm.service';
import {AdminChangeQueueInfo, IoRequest, RootStatus, WorkerRequestMode} from './io.types';
import {
	WorkerRequestCreateArtwork,
	WorkerRequestCreateFolder,
	WorkerRequestCreateRoot,
	WorkerRequestDeleteFolders,
	WorkerRequestDownloadArtwork,
	WorkerRequestFixTrack,
	WorkerRequestMoveFolders,
	WorkerRequestMoveTracks,
	WorkerRequestParameters,
	WorkerRequestRefreshRoot,
	WorkerRequestRemoveArtwork,
	WorkerRequestRemoveRoot,
	WorkerRequestRemoveTracks,
	WorkerRequestRenameArtwork,
	WorkerRequestRenameFolder,
	WorkerRequestRenameTrack,
	WorkerRequestReplaceArtwork,
	WorkerRequestUpdateRoot,
	WorkerRequestWriteTrackTags
} from './worker.types';
import {Inject, InRequestScope} from 'typescript-ioc';
import {logger} from '../../../utils/logger';

const log = logger('IO');

@InRequestScope
export class IoService {
	@Inject
	public orm!: OrmService;
	@Inject
	public workerService!: WorkerService;
	public scanning = false;
	private afterRefreshListeners: Array<() => Promise<void>> = [];
	private rootstatus = new Map<string, RootStatus>();
	private current: IoRequest<WorkerRequestParameters> | undefined;
	private queue: Array<IoRequest<WorkerRequestParameters>> = [];
	private delayedTrackTagWrite = new Map<string, { request: IoRequest<WorkerRequestWriteTrackTags>; timeout?: NodeJS.Timeout | number }>();
	private delayedTrackFix = new Map<string, { request: IoRequest<WorkerRequestFixTrack>; timeout?: NodeJS.Timeout }>();
	private nextID: number = Date.now();
	private afterScanTimeout: NodeJS.Timeout | undefined | number;
	private history: Array<{ id: string; error?: string; date: number }> = [];

	private generateRequestID(): string {
		this.nextID += 1;
		return this.nextID.toString();
	}

	private async runRequest(cmd: IoRequest<WorkerRequestParameters>): Promise<void> {
		this.clearAfterRefresh();
		this.rootstatus.set(cmd.parameters.rootID, {lastScan: Date.now(), scanning: true});
		try {
			this.current = cmd;
			await cmd.run();
			this.rootstatus.set(cmd.parameters.rootID, {lastScan: Date.now()});
			this.history.push({id: cmd.id, date: Date.now()});
			this.current = undefined;
		} catch (e) {
			console.error(e);
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
			for (const listener of this.afterRefreshListeners) {
				listener()
					.catch(e => {
						console.error(e);
					});
			}
		}, 10000);
	}

	private clearAfterRefresh(): void {
		if (this.afterScanTimeout) {
			clearTimeout(this.afterScanTimeout as any);
		}
		this.afterScanTimeout = undefined;
	}

	private findRequest(rootID: string, mode: WorkerRequestMode): IoRequest<WorkerRequestParameters> | undefined {
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
				log.error(e);
			});

	}

	private addRequest(req: IoRequest<any>): AdminChangeQueueInfo {
		this.queue.push(req);
		this.run();
		return this.getRequestInfo(req);
	}

	private getRequestInfo(req: IoRequest<any>): AdminChangeQueueInfo {
		const pos = this.queue.indexOf(req);
		return {id: req.id, pos: pos >= 0 ? pos : undefined};
	}

	private newRequest<T extends WorkerRequestParameters>(mode: WorkerRequestMode, execute: (parameters: T) => Promise<Changes>, parameters: T): AdminChangeQueueInfo {
		return this.addRequest(new IoRequest<T>(this.generateRequestID(), mode, execute, parameters));
	}

	getAdminChangeQueueInfoStatus(id: string): AdminChangeQueueInfo {
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

	async refresh(orm: Orm): Promise<Array<AdminChangeQueueInfo>> {
		const roots = await orm.Root.all();
		const result: Array<AdminChangeQueueInfo> = [];
		for (const root of roots) {
			result.push(await this.refreshRoot(root.id));
		}
		return result;
	}

	async refreshRoot(rootID: string): Promise<AdminChangeQueueInfo> {
		const oldRequest = this.findRequest(rootID, WorkerRequestMode.refreshRoot);
		if (oldRequest) {
			return this.getRequestInfo(oldRequest);
		}
		return this.newRequest<WorkerRequestRefreshRoot>(
			WorkerRequestMode.refreshRoot, p => this.workerService.refreshRoot(p), {rootID}
		);
	}

	async removeRoot(rootID: string): Promise<AdminChangeQueueInfo> {
		const oldRequest = this.findRequest(rootID, WorkerRequestMode.removeRoot);
		if (oldRequest) {
			return this.getRequestInfo(oldRequest);
		}
		return this.newRequest<WorkerRequestRemoveRoot>(
			WorkerRequestMode.removeRoot, p => this.workerService.removeRoot(p), {rootID}
		);
	}

	async moveFolders(folderIDs: Array<string>, newParentID: string, rootID: string): Promise<AdminChangeQueueInfo> {
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

	async deleteFolder(id: string, rootID: string): Promise<AdminChangeQueueInfo> {
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

	async renameArtwork(artworkID: string, newName: string, rootID: string): Promise<AdminChangeQueueInfo> {
		return this.newRequest<WorkerRequestRenameArtwork>(
			WorkerRequestMode.renameArtwork, p => this.workerService.renameArtwork(p), {rootID, artworkID, newName}
		);
	}

	async replaceArtwork(artworkID: string, artworkFilename: string, rootID: string): Promise<AdminChangeQueueInfo> {
		return this.newRequest<WorkerRequestReplaceArtwork>(
			WorkerRequestMode.replaceArtwork, p => this.workerService.replaceArtwork(p), {rootID, artworkID, artworkFilename}
		);
	}

	async createArtwork(folderID: string, artworkFilename: string, types: Array<ArtworkImageType>, rootID: string): Promise<AdminChangeQueueInfo> {
		return this.newRequest<WorkerRequestCreateArtwork>(
			WorkerRequestMode.createArtwork, p => this.workerService.createArtwork(p), {rootID, folderID, artworkFilename, types}
		);
	}

	async downloadArtwork(folderID: string, artworkURL: string, types: Array<ArtworkImageType>, rootID: string): Promise<AdminChangeQueueInfo> {
		return this.newRequest<WorkerRequestDownloadArtwork>(
			WorkerRequestMode.downloadArtwork, p => this.workerService.downloadArtwork(p), {rootID, folderID, artworkURL, types}
		);
	}

	async deleteArtwork(artworkID: string, rootID: string): Promise<AdminChangeQueueInfo> {
		return this.newRequest<WorkerRequestRemoveArtwork>(
			WorkerRequestMode.deleteArtwork, p => this.workerService.removeArtwork(p), {rootID, artworkID}
		);
	}

	async removeTrack(id: string, rootID: string): Promise<AdminChangeQueueInfo> {
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

	async moveTracks(trackIDs: Array<string>, newParentID: string, rootID: string): Promise<AdminChangeQueueInfo> {
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

	async renameTrack(trackID: string, newName: string, rootID: string): Promise<AdminChangeQueueInfo> {
		return this.newRequest<WorkerRequestRenameTrack>(
			WorkerRequestMode.renameTrack, p => this.workerService.renameTrack(p), {rootID, trackID, newName}
		);
	}

	async writeRawTag(trackID: string, tag: RawTag, rootID: string): Promise<AdminChangeQueueInfo> {
		const oldRequest = this.findRequest(rootID, WorkerRequestMode.writeTrackTags);
		if (oldRequest) {
			(oldRequest.parameters as WorkerRequestWriteTrackTags).tags.push({trackID, tag});
			return this.getRequestInfo(oldRequest);
		}
		let delayedCmd = this.delayedTrackTagWrite.get(rootID);
		if (delayedCmd) {
			if (delayedCmd.timeout) {
				clearTimeout(delayedCmd.timeout as any);
			}
			(delayedCmd.request.parameters).tags.push({trackID, tag});
		} else {
			delayedCmd = {
				request:
					new IoRequest<WorkerRequestWriteTrackTags>(this.generateRequestID(),
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

	async fixTrack(trackID: string, fixID: TrackHealthID, rootID: string): Promise<AdminChangeQueueInfo> {
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
					new IoRequest<WorkerRequestFixTrack>(this.generateRequestID(),
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

	async renameFolder(folderID: string, newName: string, rootID: string): Promise<AdminChangeQueueInfo> {
		return this.newRequest<WorkerRequestRenameFolder>(
			WorkerRequestMode.renameFolder, p => this.workerService.renameFolder(p), {rootID, folderID, newName}
		);
	}

	async newFolder(parentID: string, name: string, rootID: string): Promise<AdminChangeQueueInfo> {
		return this.newRequest<WorkerRequestCreateFolder>(
			WorkerRequestMode.createFolder, p => this.workerService.createFolder(p), {rootID, parentID, name}
		);
	}

	async updateRoot(rootID: string, name: string, path: string, strategy: RootScanStrategy): Promise<AdminChangeQueueInfo> {
		return this.newRequest<WorkerRequestUpdateRoot>(
			WorkerRequestMode.updateRoot, p => this.workerService.updateRoot(p), {rootID, name, path, strategy}
		);
	}

	async createRoot(name: string, path: string, strategy: RootScanStrategy): Promise<AdminChangeQueueInfo> {
		return this.newRequest<WorkerRequestCreateRoot>(
			WorkerRequestMode.createRoot, p => this.workerService.createRoot(p), {rootID: '', name, path, strategy}
		);
	}

	registerAfterRefresh(listener: () => Promise<void>): void {
		this.afterRefreshListeners.push(listener);
	}

	removeAfterRefresh(listener: () => Promise<void>): void {
		this.afterRefreshListeners = this.afterRefreshListeners.filter(l => l !== listener);
	}
}
