"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DebouncePromises = void 0;
class DebouncePromises {
    constructor() {
        this.pendingPromises = new Map();
    }
    getPendingArray(id) {
        return this.pendingPromises.get(id) || [];
    }
    async append(id) {
        return new Promise((resolve, reject) => {
            const run = (err, result) => {
                if (err) {
                    reject(err);
                }
                else if (!result) {
                    reject(new Error('Invalid Promise Result'));
                }
                else {
                    resolve(result);
                }
            };
            this.pendingPromises.set(id, this.getPendingArray(id).concat([run]));
        });
    }
    setPending(id) {
        this.pendingPromises.set(id, []);
    }
    isPending(id) {
        return !!this.pendingPromises.get(id);
    }
    resolve(id, result) {
        const pending = this.getPendingArray(id);
        this.pendingPromises.delete(id);
        for (const cb of pending) {
            cb(null, result);
        }
    }
    reject(id, error) {
        const pending = this.getPendingArray(id);
        this.pendingPromises.delete(id);
        for (const cb of pending) {
            cb(error);
        }
    }
}
exports.DebouncePromises = DebouncePromises;
//# sourceMappingURL=debounce-promises.js.map