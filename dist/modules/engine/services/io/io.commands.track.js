"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IoCommandsTrack = void 0;
const io_types_1 = require("./io.types");
const io_helpers_1 = require("./io.helpers");
class IoCommandsTrack {
    constructor(owner) {
        this.owner = owner;
        this.delayedTrackTagWrite = new io_helpers_1.DelayedRequests();
        this.delayedTrackFix = new io_helpers_1.DelayedRequests();
    }
    async remove(id, rootID) {
        const oldRequest = this.owner.findRequest(rootID, io_types_1.WorkerRequestMode.removeTracks);
        if (oldRequest) {
            if (!oldRequest.parameters.trackIDs.includes(id)) {
                oldRequest.parameters.trackIDs.push(id);
            }
            return this.owner.getRequestInfo(oldRequest);
        }
        return this.owner.newRequest(io_types_1.WorkerRequestMode.removeTracks, p => this.owner.workerService.track.remove(p), { rootID, trackIDs: [id] });
    }
    async move(trackIDs, newParentID, rootID) {
        const oldRequest = this.owner.find(c => ((!!c.parameters.rootID) && (c.parameters.rootID === rootID) &&
            (c.mode === io_types_1.WorkerRequestMode.moveTracks) && c.parameters.newParentID === newParentID));
        if (oldRequest) {
            for (const id of trackIDs) {
                if (!oldRequest.parameters.trackIDs.includes(id)) {
                    oldRequest.parameters.trackIDs.push(id);
                }
            }
            return this.owner.getRequestInfo(oldRequest);
        }
        return this.owner.newRequest(io_types_1.WorkerRequestMode.moveTracks, p => this.owner.workerService.track.move(p), { rootID, trackIDs, newParentID });
    }
    async rename(trackID, newName, rootID) {
        return this.owner.newRequest(io_types_1.WorkerRequestMode.renameTrack, p => this.owner.workerService.track.rename(p), { rootID, trackID, newName });
    }
    async writeTags(trackID, tag, rootID) {
        const oldRequest = this.owner.findRequest(rootID, io_types_1.WorkerRequestMode.writeTrackTags);
        if (oldRequest) {
            oldRequest.parameters.tags.push({ trackID, tag });
            return this.owner.getRequestInfo(oldRequest);
        }
        let delayedCmd = this.delayedTrackTagWrite.findByRoot(rootID);
        if (!delayedCmd) {
            delayedCmd = this.delayedTrackTagWrite.register(rootID, new io_types_1.IoRequest(this.owner.generateRequestID(), io_types_1.WorkerRequestMode.writeTrackTags, p => this.owner.workerService.track.writeTags(p), { rootID, tags: [{ trackID, tag }] }));
        }
        else {
            delayedCmd.request.parameters.tags.push({ trackID, tag });
        }
        this.delayedTrackTagWrite.startTimeOut(delayedCmd, (request) => this.owner.addRequest(request));
        return this.owner.getRequestInfo(delayedCmd.request);
    }
    async fix(trackID, fixID, rootID) {
        const oldRequest = this.owner.findRequest(rootID, io_types_1.WorkerRequestMode.fixTrack);
        if (oldRequest) {
            oldRequest.parameters.fixes.push({ trackID, fixID });
            return this.owner.getRequestInfo(oldRequest);
        }
        let delayedCmd = this.delayedTrackFix.findByRoot(rootID);
        if (!delayedCmd) {
            delayedCmd = this.delayedTrackFix.register(rootID, new io_types_1.IoRequest(this.owner.generateRequestID(), io_types_1.WorkerRequestMode.fixTrack, p => this.owner.workerService.track.fix(p), { rootID, fixes: [{ trackID, fixID }] }));
        }
        else {
            delayedCmd.request.parameters.fixes.push({ trackID, fixID });
        }
        this.delayedTrackFix.startTimeOut(delayedCmd, (request) => this.owner.addRequest(request));
        return this.owner.getRequestInfo(delayedCmd.request);
    }
}
exports.IoCommandsTrack = IoCommandsTrack;
//# sourceMappingURL=io.commands.track.js.map