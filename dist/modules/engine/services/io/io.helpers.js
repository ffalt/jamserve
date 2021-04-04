"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DelayedRequests = void 0;
class DelayedRequests {
    constructor() {
        this.requests = new Map();
    }
    findbyID(id) {
        for (const d of this.requests) {
            if (d[1].request.id === id) {
                return d[1];
            }
        }
        return;
    }
    findByRoot(rootID) {
        return this.requests.get(rootID);
    }
    register(rootID, request) {
        const cmd = { request, timeout: undefined, rootID };
        this.requests.set(rootID, cmd);
        return cmd;
    }
    startTimeOut(delayedCmd, onStart) {
        if (delayedCmd.timeout) {
            clearTimeout(delayedCmd.timeout);
        }
        delayedCmd.timeout = setTimeout(() => {
            this.requests.delete(delayedCmd.rootID);
            onStart(delayedCmd.request);
        }, 10000);
    }
}
exports.DelayedRequests = DelayedRequests;
//# sourceMappingURL=io.helpers.js.map