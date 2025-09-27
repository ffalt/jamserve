export class DelayedRequests {
    constructor() {
        this.requests = new Map();
    }
    findbyID(id) {
        for (const req of this.requests.values()) {
            if (req.request.id === id) {
                return req;
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
//# sourceMappingURL=io.helpers.js.map