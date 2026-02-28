import { Store } from 'express-session';
export class ExpressSessionStore extends Store {
    constructor(sessionService) {
        super();
        this.sessionService = sessionService;
        this.cache = new Map();
        this.accessOrder = [];
        this.maxCacheSize = 1000;
        this.get = (sid, callback) => {
            this._get(sid)
                .then(data => {
                callback(undefined, data);
            })
                .catch(callback);
        };
        this.set = (sid, data, callback) => {
            this.evictLRU();
            this.cache.set(sid, data);
            this.markAccessed(sid);
            void this.sessionService.set(sid, data)
                .then(callback)
                .catch(callback);
        };
        this.destroy = (sid, callback) => {
            this.cache.delete(sid);
            const index = this.accessOrder.indexOf(sid);
            if (index !== -1) {
                this.accessOrder.splice(index, 1);
            }
            void this.sessionService.remove(sid)
                .then(callback)
                .catch(callback);
        };
        this.all = callback => {
            this.sessionService.all()
                .then(data => {
                const result = Object.fromEntries(data.map(item => [item.sessionID, item]));
                callback(undefined, result);
            })
                .catch((error) => {
                callback(error);
            });
        };
        this.length = callback => {
            this.sessionService.count()
                .then(data => {
                callback(undefined, data);
            })
                .catch((error) => {
                callback(error, 0);
            });
        };
        this.clear = callback => {
            this.cache.clear();
            this.accessOrder.length = 0;
            void this.sessionService.clear()
                .then(callback)
                .catch(callback);
        };
        this.sessionService.registerNotify(this);
    }
    async clearCache() {
        this.cache.clear();
        this.accessOrder.length = 0;
    }
    markAccessed(sid) {
        const index = this.accessOrder.indexOf(sid);
        if (index !== -1) {
            this.accessOrder.splice(index, 1);
        }
        this.accessOrder.push(sid);
    }
    evictLRU() {
        if (this.cache.size >= this.maxCacheSize && this.accessOrder.length > 0) {
            const lruSid = this.accessOrder.shift();
            if (lruSid) {
                this.cache.delete(lruSid);
            }
        }
    }
    static expired(data) {
        const expires = data.cookie.expires;
        if (!expires)
            return false;
        return expires.valueOf() < Date.now();
    }
    async _get(sid) {
        const result = this.cache.get(sid);
        if (result) {
            if (ExpressSessionStore.expired(result)) {
                await this.sessionService.remove(sid);
                return;
            }
            this.markAccessed(sid);
            return result;
        }
        const session = await this.sessionService.get(sid);
        if (session) {
            this.evictLRU();
            this.cache.set(sid, session);
            this.markAccessed(sid);
            return session;
        }
        return;
    }
}
//# sourceMappingURL=session-store.js.map