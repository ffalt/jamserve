import { IoService } from '../io.service.js';
import { AdminChangeQueueInfo, IoRequest, WorkerRequestMode } from './io.types.js';
import { WorkerRequestFixTrack, WorkerRequestMoveTracks, WorkerRequestRemoveTracks, WorkerRequestRenameTrack, WorkerRequestWriteTrackTags } from '../worker/worker.types.js';
import { RawTag } from '../../../audio/rawTag.js';
import { TrackHealthID } from '../../../../types/enums.js';
import { DelayedRequests } from './io.helpers.js';

export class IoCommandsTrack {
	delayedTrackTagWrite = new DelayedRequests<WorkerRequestWriteTrackTags>();
	delayedTrackFix = new DelayedRequests<WorkerRequestFixTrack>();

	constructor(private owner: IoService) {
	}

	async remove(id: string, rootID: string): Promise<AdminChangeQueueInfo> {
		const oldRequest = this.owner.findRequest(rootID, WorkerRequestMode.removeTracks);
		if (oldRequest) {
			if (!(oldRequest.parameters as WorkerRequestRemoveTracks).trackIDs.includes(id)) {
				(oldRequest.parameters as WorkerRequestRemoveTracks).trackIDs.push(id);
			}
			return this.owner.getRequestInfo(oldRequest);
		}
		return this.owner.newRequest<WorkerRequestRemoveTracks>(
			WorkerRequestMode.removeTracks, p => this.owner.workerService.track.remove(p), { rootID, trackIDs: [id] }
		);
	}

	async move(trackIDs: Array<string>, newParentID: string, rootID: string): Promise<AdminChangeQueueInfo> {
		const oldRequest = this.owner.find(c => (
			(!!c.parameters.rootID) && (c.parameters.rootID === rootID) &&
			(c.mode === WorkerRequestMode.moveTracks) && (c.parameters as WorkerRequestMoveTracks).newParentID === newParentID)
		);
		if (oldRequest) {
			for (const id of trackIDs) {
				if (!(oldRequest.parameters as WorkerRequestMoveTracks).trackIDs.includes(id)) {
					(oldRequest.parameters as WorkerRequestMoveTracks).trackIDs.push(id);
				}
			}
			return this.owner.getRequestInfo(oldRequest);
		}
		return this.owner.newRequest<WorkerRequestMoveTracks>(
			WorkerRequestMode.moveTracks, p => this.owner.workerService.track.move(p), { rootID, trackIDs, newParentID }
		);
	}

	async rename(trackID: string, newName: string, rootID: string): Promise<AdminChangeQueueInfo> {
		return this.owner.newRequest<WorkerRequestRenameTrack>(
			WorkerRequestMode.renameTrack, p => this.owner.workerService.track.rename(p), { rootID, trackID, newName }
		);
	}

	async writeTags(trackID: string, tag: RawTag, rootID: string): Promise<AdminChangeQueueInfo> {
		const oldRequest = this.owner.findRequest(rootID, WorkerRequestMode.writeTrackTags);
		if (oldRequest) {
			(oldRequest.parameters as WorkerRequestWriteTrackTags).tags.push({ trackID, tag });
			return this.owner.getRequestInfo(oldRequest);
		}
		let delayedCmd = this.delayedTrackTagWrite.findByRoot(rootID);
		if (!delayedCmd) {
			delayedCmd = this.delayedTrackTagWrite.register(rootID,
				new IoRequest<WorkerRequestWriteTrackTags>(this.owner.generateRequestID(),
					WorkerRequestMode.writeTrackTags, p => this.owner.workerService.track.writeTags(p), { rootID, tags: [{ trackID, tag }] })
			);
		} else {
			delayedCmd.request.parameters.tags.push({ trackID, tag });
		}
		this.delayedTrackTagWrite.startTimeOut(delayedCmd, request => this.owner.addRequest(request));
		return this.owner.getRequestInfo(delayedCmd.request);
	}

	async fix(trackID: string, fixID: TrackHealthID, rootID: string): Promise<AdminChangeQueueInfo> {
		const oldRequest = this.owner.findRequest(rootID, WorkerRequestMode.fixTrack);
		if (oldRequest) {
			(oldRequest.parameters as WorkerRequestFixTrack).fixes.push({ trackID, fixID });
			return this.owner.getRequestInfo(oldRequest);
		}
		let delayedCmd = this.delayedTrackFix.findByRoot(rootID);
		if (!delayedCmd) {
			delayedCmd = this.delayedTrackFix.register(rootID,
				new IoRequest<WorkerRequestFixTrack>(this.owner.generateRequestID(),
					WorkerRequestMode.fixTrack, p => this.owner.workerService.track.fix(p), { rootID, fixes: [{ trackID, fixID }] })
			);
		} else {
			delayedCmd.request.parameters.fixes.push({ trackID, fixID });
		}
		this.delayedTrackFix.startTimeOut(delayedCmd, request => this.owner.addRequest(request));
		return this.owner.getRequestInfo(delayedCmd.request);
	}
}
