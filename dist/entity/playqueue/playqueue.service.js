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
exports.PlayQueueService = void 0;
const typescript_ioc_1 = require("typescript-ioc");
const orm_service_1 = require("../../modules/engine/services/orm.service");
const enums_1 = require("../../types/enums");
const express_error_1 = require("../../modules/rest/builder/express-error");
let PlayQueueService = class PlayQueueService {
    getDuration(media) {
        var _a, _b;
        switch (media.objType) {
            case enums_1.DBObjectType.episode:
                return (((_a = media.obj.tag) === null || _a === void 0 ? void 0 : _a.mediaDuration) || 0);
            case enums_1.DBObjectType.track:
                return (((_b = media.obj.tag) === null || _b === void 0 ? void 0 : _b.mediaDuration) || 0);
        }
        return 0;
    }
    async get(user) {
        let queue = await this.orm.PlayQueue.findOne({ user: user.id });
        if (!queue) {
            queue = this.orm.PlayQueue.create({ user });
        }
        return queue;
    }
    async set(args, user, client) {
        let queue = await this.orm.PlayQueue.findOne({ user: user.id });
        if (!queue) {
            queue = this.orm.PlayQueue.create({ user });
        }
        queue.changedBy = client;
        const ids = args.mediaIDs || [];
        const mediaList = [];
        for (const id of ids) {
            const media = await this.orm.findInStreamTypes(id);
            if (!media) {
                return Promise.reject(express_error_1.NotFoundError());
            }
            mediaList.push(media);
        }
        const oldEntries = queue.entries.getItems().sort((a, b) => b.position - a.position);
        let duration = 0;
        let position = 1;
        for (const media of mediaList) {
            let entry = oldEntries.pop();
            if (!entry) {
                entry = this.orm.PlayQueueEntry.create({ playlist: queue, position });
            }
            entry.position = position;
            entry.track = media.objType === enums_1.DBObjectType.track ? media.obj : undefined;
            entry.episode = media.objType === enums_1.DBObjectType.episode ? media.obj : undefined;
            duration += this.getDuration(media);
            position++;
            this.orm.PlayQueueEntry.persistLater(entry);
        }
        queue.duration = duration;
        for (const o of oldEntries) {
            this.orm.PlayQueueEntry.removeLater(o);
        }
        this.orm.PlayQueue.persistLater(queue);
        await this.orm.orm.em.flush();
    }
    async clear(user) {
        await this.orm.PlayQueue.remove({ user: user.id });
    }
};
__decorate([
    typescript_ioc_1.Inject,
    __metadata("design:type", orm_service_1.OrmService)
], PlayQueueService.prototype, "orm", void 0);
PlayQueueService = __decorate([
    typescript_ioc_1.Singleton
], PlayQueueService);
exports.PlayQueueService = PlayQueueService;
//# sourceMappingURL=playqueue.service.js.map