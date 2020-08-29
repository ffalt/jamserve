"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlaylistService = void 0;
const typescript_ioc_1 = require("typescript-ioc");
const enums_1 = require("../../types/enums");
const rest_1 = require("../../modules/rest");
let PlaylistService = class PlaylistService {
    async getDuration(media) {
        switch (media.objType) {
            case enums_1.DBObjectType.episode: {
                const episodeTag = await media.obj.tag.get();
                return ((episodeTag === null || episodeTag === void 0 ? void 0 : episodeTag.mediaDuration) || 0);
            }
            case enums_1.DBObjectType.track: {
                const trackTag = await media.obj.tag.get();
                return ((trackTag === null || trackTag === void 0 ? void 0 : trackTag.mediaDuration) || 0);
            }
        }
        return 0;
    }
    async create(orm, args, user) {
        const playlist = orm.Playlist.create({
            name: args.name,
            comment: args.comment,
            isPublic: args.isPublic,
            changed: Date.now(),
            duration: 0
        });
        await playlist.user.set(user);
        const ids = args.mediaIDs || [];
        let position = 1;
        let duration = 0;
        for (const id of ids) {
            const media = await orm.findInStreamTypes(id);
            if (!media) {
                return Promise.reject(rest_1.NotFoundError());
            }
            duration += await this.getDuration(media);
            const entry = orm.PlaylistEntry.create({ position });
            await entry.playlist.set(playlist);
            await entry.track.set(media.objType === enums_1.DBObjectType.track ? media.obj : undefined);
            await entry.episode.set(media.objType === enums_1.DBObjectType.episode ? media.obj : undefined);
            orm.PlaylistEntry.persistLater(entry);
            position++;
        }
        playlist.duration = duration;
        await orm.Playlist.persistAndFlush(playlist);
        return playlist;
    }
    async update(orm, args, playlist) {
        const ids = args.mediaIDs || [];
        const mediaList = [];
        for (const id of ids) {
            const media = await orm.findInStreamTypes(id);
            if (!media) {
                return Promise.reject(rest_1.NotFoundError());
            }
            mediaList.push(media);
        }
        playlist.name = (args.name !== undefined) ? args.name : playlist.name;
        playlist.isPublic = (args.isPublic !== undefined) ? args.isPublic : playlist.isPublic;
        playlist.comment = (args.comment !== undefined) ? args.comment : playlist.comment;
        const oldEntries = (await playlist.entries.getItems()).sort((a, b) => b.position - a.position);
        let duration = 0;
        let position = 1;
        for (const media of mediaList) {
            let entry = oldEntries.pop();
            if (!entry) {
                entry = orm.PlaylistEntry.create({ position });
            }
            entry.position = position;
            await entry.playlist.set(playlist);
            await entry.track.set(media.objType === enums_1.DBObjectType.track ? media.obj : undefined);
            await entry.episode.set(media.objType === enums_1.DBObjectType.episode ? media.obj : undefined);
            duration += await this.getDuration(media);
            position++;
            orm.PlaylistEntry.persistLater(entry);
        }
        playlist.duration = duration;
        for (const o of oldEntries) {
            orm.PlaylistEntry.removeLater(o);
        }
        orm.Playlist.persistLater(playlist);
        await orm.em.flush();
    }
    async remove(orm, playlist) {
        await orm.Playlist.removeAndFlush(playlist);
    }
};
PlaylistService = __decorate([
    typescript_ioc_1.InRequestScope
], PlaylistService);
exports.PlaylistService = PlaylistService;
//# sourceMappingURL=playlist.service.js.map