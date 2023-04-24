import { Store } from 'express-session';
export class ExpressSessionStore extends Store {
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
                .catch(e => callback(e, 0));
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
    static expired(data) {
        return (data.cookie.expires || 0).valueOf() < Date.now();
    }
    async _get(sid) {
        const result = this.cache.get(sid);
        if (result) {
            if (ExpressSessionStore.expired(result)) {
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
//# sourceMappingURL=session-store.js.map