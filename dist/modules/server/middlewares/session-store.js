"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpressSessionStore = void 0;
const express_session_1 = require("express-session");
const session_service_1 = require("../../../entity/settings/session.service");
const typescript_ioc_1 = require("typescript-ioc");
class ExpressSessionStore extends express_session_1.Store {
    constructor() {
        super();
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
    }
}
__decorate([
    typescript_ioc_1.Inject,
    __metadata("design:type", session_service_1.SessionService)
], ExpressSessionStore.prototype, "sessionService", void 0);
exports.ExpressSessionStore = ExpressSessionStore;
//# sourceMappingURL=session-store.js.map