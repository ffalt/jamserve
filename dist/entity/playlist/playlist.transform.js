"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlaylistTransformService = void 0;
const typescript_ioc_1 = require("typescript-ioc");
const base_transform_1 = require("../base/base.transform");
const enums_1 = require("../../types/enums");
let PlaylistTransformService = class PlaylistTransformService extends base_transform_1.BaseTransformService {
    async playlistBase(orm, o, playlistArgs, user) {
        const u = await o.user.getOrFail();
        const entries = playlistArgs.playlistIncEntriesIDs || playlistArgs.playlistIncEntries ? await o.entries.getItems() : [];
        return {
            id: o.id,
            name: o.name,
            changed: o.updatedAt.valueOf(),
            duration: o.duration,
            created: o.createdAt.valueOf(),
            isPublic: o.isPublic,
            comment: o.comment,
            userID: u.id,
            userName: u.name,
            entriesCount: await o.entries.count(),
            entriesIDs: playlistArgs.playlistIncEntriesIDs ? entries.map(t => (t.track.id()) || (t.episode.id())) : undefined,
            state: playlistArgs.playlistIncState ? await this.state(orm, o.id, enums_1.DBObjectType.playlist, user.id) : undefined
        };
    }
    async playlistIndex(orm, result) {
        return this.index(result, async (item) => {
            return {
                id: item.id,
                name: item.name,
                entryCount: await item.entries.count()
            };
        });
    }
};
PlaylistTransformService = __decorate([
    typescript_ioc_1.InRequestScope
], PlaylistTransformService);
exports.PlaylistTransformService = PlaylistTransformService;
//# sourceMappingURL=playlist.transform.js.map