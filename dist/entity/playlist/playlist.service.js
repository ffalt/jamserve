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
exports.PlaylistService = void 0;
const typescript_ioc_1 = require("typescript-ioc");
const orm_service_1 = require("../../modules/engine/services/orm.service");
const enums_1 = require("../../types/enums");
const express_error_1 = require("../../modules/rest/builder/express-error");
let PlaylistService = class PlaylistService {
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
    async create(args, user) {
        const playlist = this.orm.Playlist.create({
            name: args.name,
            comment: args.comment,
            isPublic: args.isPublic,
            user,
            changed: Date.now(),
            duration: 0
        });
        const ids = args.mediaIDs || [];
        let position = 1;
        let duration = 0;
        for (const id of ids) {
            const media = await this.orm.findInStreamTypes(id);
            if (!media) {
                return Promise.reject(express_error_1.NotFoundError());
            }
            duration += this.getDuration(media);
            const entry = this.orm.PlaylistEntry.create({
                position, playlist,
                track: media.objType === enums_1.DBObjectType.track ? media.obj : undefined,
                episode: media.objType === enums_1.DBObjectType.episode ? media.obj : undefined
            });
            this.orm.PlaylistEntry.persistLater(entry);
            position++;
        }
        playlist.duration = duration;
        this.orm.Playlist.persistLater(playlist);
        await this.orm.orm.em.flush();
        return playlist;
    }
    async update(args, playlist) {
        const ids = args.mediaIDs || [];
        const mediaList = [];
        for (const id of ids) {
            const media = await this.orm.findInStreamTypes(id);
            if (!media) {
                return Promise.reject(express_error_1.NotFoundError());
            }
            mediaList.push(media);
        }
        playlist.name = (args.name !== undefined) ? args.name : playlist.name;
        playlist.isPublic = (args.isPublic !== undefined) ? args.isPublic : playlist.isPublic;
        playlist.comment = (args.comment !== undefined) ? args.comment : playlist.comment;
        await this.orm.Playlist.populate(playlist, 'entries');
        const oldEntries = playlist.entries.getItems().sort((a, b) => b.position - a.position);
        let duration = 0;
        let position = 1;
        for (const media of mediaList) {
            let entry = oldEntries.pop();
            if (!entry) {
                entry = this.orm.PlaylistEntry.create({ playlist, position });
            }
            entry.position = position;
            entry.track = media.objType === enums_1.DBObjectType.track ? media.obj : undefined;
            entry.episode = media.objType === enums_1.DBObjectType.episode ? media.obj : undefined;
            duration += this.getDuration(media);
            position++;
            this.orm.PlaylistEntry.persistLater(entry);
        }
        playlist.duration = duration;
        for (const o of oldEntries) {
            this.orm.PlaylistEntry.removeLater(o);
        }
        this.orm.PlaylistEntry.persistLater(playlist);
        await this.orm.orm.em.flush();
    }
    async remove(playlist) {
        await this.orm.Playlist.removeAndFlush(playlist);
    }
};
__decorate([
    typescript_ioc_1.Inject,
    __metadata("design:type", orm_service_1.OrmService)
], PlaylistService.prototype, "orm", void 0);
PlaylistService = __decorate([
    typescript_ioc_1.Singleton
], PlaylistService);
exports.PlaylistService = PlaylistService;
//# sourceMappingURL=playlist.service.js.map