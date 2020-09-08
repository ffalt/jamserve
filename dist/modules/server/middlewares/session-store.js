"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpressSessionStore = void 0;
const express_session_1 = require("express-session");
class ExpressSessionStore extends express_session_1.Store {
    constructor(sessionService) {
        super();
        this.sessionService = sessionService;
        this.cache = new Map();
        this.get = (sid, callback) => {
            this._get(sid)
                .then(data => callback(null, data))
                .catch(callback);
        };
        this.set = (sid, data, callback) => {
            this.cache.set(sid, data);
            this.sessionService.set(sid, data)
                .then(callback)
                .catch(callback);
        };
        this.destroy = (sid, callback) => {
            this.sessionService.remove(sid)
                .then(callback)
                .catch(callback);
        };
        this.all = callback => {
            this.sessionService.all()
                .then(data => {
                const result = {};
                for (const item of data) {
                    result[item.sessionID] = item;
                }
                callback(null, result);
            })
                .catch(e => callback(e, undefined));
        };
        this.length = callback => {
            this.sessionService.count()
                .then(data => callback(null, data))
                .catch(e => callback(e, undefined));
        };
        this.clear = callback => {
            this.cache.clear();
            this.sessionService.clear()
                .then(callback)
                .catch(callback);
        };
        this.sessionService.registerNotify(this);
    }
    async clearCache() {
        this.cache.clear();
    }
    expired(data) {
        return (data.cookie.expires || 0) < Date.now();
    }
    async _get(sid) {
        const result = this.cache.get(sid);
        if (result) {
            if (this.expired(result)) {
                await this.sessionService.remove(sid);
                return;
            }
            return result;
        }
        const session = await this.sessionService.get(sid);
        if (session) {
            this.cache.set(sid, session);
            return session;
        }
        return;
    }
}
exports.ExpressSessionStore = ExpressSessionStore;
//# sourceMappingURL=session-store.js.map