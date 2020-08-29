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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrackController = void 0;
const track_model_1 = require("./track.model");
const rest_1 = require("../../modules/rest");
const enums_1 = require("../../types/enums");
const track_args_1 = require("./track.args");
const tag_model_1 = require("../tag/tag.model");
const base_args_1 = require("../base/base.args");
const admin_1 = require("../admin/admin");
let TrackController = class TrackController {
    async id(id, trackArgs, { orm, engine, user }) {
        return engine.transform.track(orm, await orm.Track.oneOrFailByID(id), trackArgs, user);
    }
    async search(page, trackArgs, filter, order, list, { orm, engine, user }) {
        if (list.list) {
            return await orm.Track.findListTransformFilter(list.list, filter, [order], page, user, o => engine.transform.track(orm, o, trackArgs, user));
        }
        return await orm.Track.searchTransformFilter(filter, [order], page, user, o => engine.transform.track(orm, o, trackArgs, user));
    }
    async similar(id, page, trackArgs, { orm, engine, user }) {
        const track = await orm.Track.oneOrFailByID(id);
        const result = await engine.metadata.similarTracks.byTrack(orm, track, page);
        return { ...result, items: await Promise.all(result.items.map(o => engine.transform.trackBase(orm, o, trackArgs, user))) };
    }
    async lyrics(id, { orm, engine }) {
        const track = await orm.Track.oneOrFailByID(id);
        return engine.metadata.lyricsByTrack(orm, track);
    }
    async rawTagGet(filter, { orm, engine, user }) {
        const tracks = await orm.Track.findFilter(filter, [], {}, user);
        const result = [];
        for (const track of tracks) {
            const raw = await engine.track.getRawTag(track) || {};
            result.push({ id: track.id, ...raw });
        }
        return result;
    }
    async health(mediaHealthArgs, filter, trackArgs, { orm, engine, user }) {
        const tracks = await orm.Track.findFilter(filter, [], {}, user);
        const list = await engine.track.health(tracks, mediaHealthArgs.healthMedia);
        const result = [];
        for (const item of list) {
            result.push({
                track: await engine.transform.trackBase(orm, item.track, trackArgs, user),
                health: item.health
            });
        }
        return result;
    }
    async rename(args, { orm, engine }) {
        const track = await orm.Track.oneOrFailByID(args.id);
        return await engine.io.renameTrack(args.id, args.name, track.root.idOrFail());
    }
    async move(args, { orm, engine }) {
        const folder = await orm.Folder.oneOrFailByID(args.folderID);
        return await engine.io.moveTracks(args.ids, args.folderID, folder.root.idOrFail());
    }
    async remove(id, { orm, engine }) {
        const track = await orm.Track.oneOrFailByID(id);
        return await engine.io.removeTrack(id, track.root.idOrFail());
    }
    async fix(args, { orm, engine }) {
        const track = await orm.Track.oneOrFailByID(args.id);
        return await engine.io.fixTrack(args.id, args.fixID, track.root.idOrFail());
    }
    async rawTagSet(args, { orm, engine }) {
        const track = await orm.Track.oneOrFailByID(args.id);
        return await engine.io.writeRawTag(args.id, args.tag, track.root.idOrFail());
    }
};
__decorate([
    rest_1.Get('/id', () => track_model_1.Track, { description: 'Get a Track by Id', summary: 'Get Track' }),
    __param(0, rest_1.QueryParam('id', { description: 'Track Id', isID: true })),
    __param(1, rest_1.QueryParams()),
    __param(2, rest_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, track_args_1.IncludesTrackArgs, Object]),
    __metadata("design:returntype", Promise)
], TrackController.prototype, "id", null);
__decorate([
    rest_1.Get('/search', () => track_model_1.TrackPage, { description: 'Search Tracks' }),
    __param(0, rest_1.QueryParams()),
    __param(1, rest_1.QueryParams()),
    __param(2, rest_1.QueryParams()),
    __param(3, rest_1.QueryParams()),
    __param(4, rest_1.QueryParams()),
    __param(5, rest_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [base_args_1.PageArgs,
        track_args_1.IncludesTrackArgs,
        track_args_1.TrackFilterArgs,
        track_args_1.TrackOrderArgs,
        base_args_1.ListArgs, Object]),
    __metadata("design:returntype", Promise)
], TrackController.prototype, "search", null);
__decorate([
    rest_1.Get('/similar', () => track_model_1.TrackPage, { description: 'Get similar Tracks by Track Id (External Service)', summary: 'Get similar Tracks' }),
    __param(0, rest_1.QueryParam('id', { description: 'Track Id', isID: true })),
    __param(1, rest_1.QueryParams()),
    __param(2, rest_1.QueryParams()),
    __param(3, rest_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, base_args_1.PageArgs,
        track_args_1.IncludesTrackArgs, Object]),
    __metadata("design:returntype", Promise)
], TrackController.prototype, "similar", null);
__decorate([
    rest_1.Get('/lyrics', () => track_model_1.TrackLyrics, { description: 'Get Lyrics for a Track by Id (External Service or Media File)', summary: 'Get Lyrics' }),
    __param(0, rest_1.QueryParam('id', { description: 'Track Id', isID: true })),
    __param(1, rest_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], TrackController.prototype, "lyrics", null);
__decorate([
    rest_1.Get('/rawTag/get', () => [tag_model_1.MediaIDTagRaw], { description: 'Get Raw Tag (eg. id3/vorbis)', summary: 'Get Raw Tag' }),
    __param(0, rest_1.QueryParams()),
    __param(1, rest_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [track_args_1.TrackFilterArgs, Object]),
    __metadata("design:returntype", Promise)
], TrackController.prototype, "rawTagGet", null);
__decorate([
    rest_1.Get('/health', () => [track_model_1.TrackHealth], { description: 'List of Tracks with Health Issues', roles: [enums_1.UserRole.admin], summary: 'Get Health' }),
    __param(0, rest_1.QueryParams()),
    __param(1, rest_1.QueryParams()),
    __param(2, rest_1.QueryParams()),
    __param(3, rest_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [track_args_1.MediaHealthArgs,
        track_args_1.TrackFilterArgs,
        track_args_1.IncludesTrackArgs, Object]),
    __metadata("design:returntype", Promise)
], TrackController.prototype, "health", null);
__decorate([
    rest_1.Post('/rename', () => admin_1.AdminChangeQueueInfo, { description: 'Rename a track', roles: [enums_1.UserRole.admin], summary: 'Rename Track' }),
    __param(0, rest_1.BodyParams()),
    __param(1, rest_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [track_args_1.TrackRenameArgs, Object]),
    __metadata("design:returntype", Promise)
], TrackController.prototype, "rename", null);
__decorate([
    rest_1.Post('/move', () => admin_1.AdminChangeQueueInfo, { description: 'Move Tracks', roles: [enums_1.UserRole.admin] }),
    __param(0, rest_1.BodyParams()),
    __param(1, rest_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [track_args_1.TrackMoveArgs, Object]),
    __metadata("design:returntype", Promise)
], TrackController.prototype, "move", null);
__decorate([
    rest_1.Post('/remove', () => admin_1.AdminChangeQueueInfo, { description: 'Remove a Track', roles: [enums_1.UserRole.admin], summary: 'Remove Track' }),
    __param(0, rest_1.BodyParam('id')),
    __param(1, rest_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], TrackController.prototype, "remove", null);
__decorate([
    rest_1.Post('/fix', () => admin_1.AdminChangeQueueInfo, { description: 'Fix Track by Health Hint Id', roles: [enums_1.UserRole.admin], summary: 'Fix Track' }),
    __param(0, rest_1.BodyParams()),
    __param(1, rest_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [track_args_1.TrackFixArgs, Object]),
    __metadata("design:returntype", Promise)
], TrackController.prototype, "fix", null);
__decorate([
    rest_1.Post('/rawTag/set', () => admin_1.AdminChangeQueueInfo, { description: 'Write a Raw Rag to a Track by Track Id', roles: [enums_1.UserRole.admin], summary: 'Set Raw Tag' }),
    __param(0, rest_1.BodyParams()),
    __param(1, rest_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [track_args_1.RawTagUpdateArgs, Object]),
    __metadata("design:returntype", Promise)
], TrackController.prototype, "rawTagSet", null);
TrackController = __decorate([
    rest_1.Controller('/track', { tags: ['Track'], roles: [enums_1.UserRole.stream] })
], TrackController);
exports.TrackController = TrackController;
//# sourceMappingURL=track.controller.js.map