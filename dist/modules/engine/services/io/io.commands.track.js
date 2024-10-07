import { IoRequest, WorkerRequestMode } from './io.types.js';
import { DelayedRequests } from './io.helpers.js';
export class IoCommandsTrack {
    constructor(owner) {
        this.owner = owner;
        this.delayedTrackTagWrite = new DelayedRequests();
        this.delayedTrackFix = new DelayedRequests();
    }
    async remove(id, rootID) {
        const oldRequest = this.owner.findRequest(rootID, WorkerRequestMode.removeTracks);
        if (oldRequest) {
            if (!oldRequest.parameters.trackIDs.includes(id)) {
                oldRequest.parameters.trackIDs.push(id);
            }
            return this.owner.getRequestInfo(oldRequest);
        }
        return this.owner.newRequest(WorkerRequestMode.removeTracks, p => this.owner.workerService.track.remove(p), { rootID, trackIDs: [id] });
    }
    async move(trackIDs, newParentID, rootID) {
        const oldRequest = this.owner.find(c => ((!!c.parameters.rootID) && (c.parameters.rootID === rootID) &&
            (c.mode === WorkerRequestMode.moveTracks) && c.parameters.newParentID === newParentID));
        if (oldRequest) {
            for (const id of trackIDs) {
                if (!oldRequest.parameters.trackIDs.includes(id)) {
                    oldRequest.parameters.trackIDs.push(id);
                }
            }
            return this.owner.getRequestInfo(oldRequest);
        }
        return this.owner.newRequest(WorkerRequestMode.moveTracks, p => this.owner.workerService.track.move(p), { rootID, trackIDs, newParentID });
    }
    async rename(trackID, newName, rootID) {
        return this.owner.newRequest(WorkerRequestMode.renameTrack, p => this.owner.workerService.track.rename(p), { rootID, trackID, newName });
    }
    async writeTags(trackID, tag, rootID) {
        const oldRequest = this.owner.findRequest(rootID, WorkerRequestMode.writeTrackTags);
        if (oldRequest) {
            oldRequest.parameters.tags.push({ trackID, tag });
            return this.owner.getRequestInfo(oldRequest);
        }
        let delayedCmd = this.delayedTrackTagWrite.findByRoot(rootID);
        if (!delayedCmd) {
            delayedCmd = this.delayedTrackTagWrite.register(rootID, new IoRequest(this.owner.generateRequestID(), WorkerRequestMode.writeTrackTags, p => this.owner.workerService.track.writeTags(p), { rootID, tags: [{ trackID, tag }] }));
        }
        else {
            delayedCmd.request.parameters.tags.push({ trackID, tag });
        }
        this.delayedTrackTagWrite.startTimeOut(delayedCmd, request => this.owner.addRequest(request));
        return this.owner.getRequestInfo(delayedCmd.request);
    }
    async fix(trackID, fixID, rootID) {
        const oldRequest = this.owner.findRequest(rootID, WorkerRequestMode.fixTrack);
        if (oldRequest) {
            oldRequest.parameters.fixes.push({ trackID, fixID });
            return this.owner.getRequestInfo(oldRequest);
        }
        let delayedCmd = this.delayedTrackFix.findByRoot(rootID);
        if (!delayedCmd) {
            delayedCmd = this.delayedTrackFix.register(rootID, new IoRequest(this.owner.generateRequestID(), WorkerRequestMode.fixTrack, p => this.owner.workerService.track.fix(p), { rootID, fixes: [{ trackID, fixID }] }));
        }
        else {
            delayedCmd.request.parameters.fixes.push({ trackID, fixID });
        }
        this.delayedTrackFix.startTimeOut(delayedCmd, request => this.owner.addRequest(request));
        return this.owner.getRequestInfo(delayedCmd.request);
    }
}
//# sourceMappingURL=io.commands.track.js.map