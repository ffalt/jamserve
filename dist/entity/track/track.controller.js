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
const user_1 = require("../user/user");
const rest_1 = require("../../modules/rest");
const enums_1 = require("../../types/enums");
const base_controller_1 = require("../base/base.controller");
const track_args_1 = require("./track.args");
const typescript_ioc_1 = require("typescript-ioc");
const track_service_1 = require("./track.service");
const tag_model_1 = require("../tag/tag.model");
const base_args_1 = require("../base/base.args");
const admin_1 = require("../admin/admin");
const io_service_1 = require("../../modules/engine/services/io.service");
let TrackController = class TrackController extends base_controller_1.BaseController {
    async id(id, trackArgs, user) {
        return this.transform.track(await this.orm.Track.oneOrFail(id), trackArgs, user);
    }
    async search(page, trackArgs, filter, order, list, user) {
        if (list.list) {
            return await this.orm.Track.findListTransformFilter(list.list, filter, [order], page, user, o => this.transform.track(o, trackArgs, user));
        }
        return await this.orm.Track.searchTransformFilter(filter, [order], page, user, o => this.transform.track(o, trackArgs, user));
    }
    async similar(id, page, trackArgs, user) {
        const track = await this.orm.Track.oneOrFail(id);
        const result = await this.metadata.similarTracks.byTrack(track, page);
        return { ...result, items: await Promise.all(result.items.map(o => this.transform.trackBase(o, trackArgs, user))) };
    }
    async lyrics(id) {
        const track = await this.orm.Track.oneOrFail(id);
        return this.metadata.lyricsByTrack(track);
    }
    async rawTagGet(filter, user) {
        const tracks = await this.orm.Track.findFilter(filter, undefined, user);
        const result = [];
        for (const track of tracks) {
            const raw = await this.trackService.getRawTag(track) || {};
            result.push({ id: track.id, ...raw });
        }
        return result;
    }
    async health(mediaHealthArgs, filter, trackArgs, user) {
        const tracks = await this.orm.Track.findFilter(filter, undefined, user);
        const list = await this.trackService.health(tracks, mediaHealthArgs.healthMedia);
        const result = [];
        for (const item of list) {
            result.push({
                track: await this.transform.trackBase(item.track, trackArgs, user),
                health: item.health
            });
        }
        return result;
    }
    async rename(args) {
        const track = await this.orm.Track.oneOrFail(args.id);
        return await this.ioService.renameTrack(args.id, args.name, track.root.id);
    }
    async move(args) {
        const folder = await this.orm.Folder.oneOrFail(args.folderID);
        return await this.ioService.moveTracks(args.ids, args.folderID, folder.root.id);
    }
    async remove(id) {
        const track = await this.orm.Track.oneOrFail(id);
        return await this.ioService.removeTrack(id, track.root.id);
    }
    async fix(args) {
        const track = await this.orm.Track.oneOrFail(args.id);
        return await this.ioService.fixTrack(args.id, args.fixID, track.root.id);
    }
    async rawTagSet(args) {
        const track = await this.orm.Track.oneOrFail(args.id);
        return await this.ioService.writeRawTag(args.id, args.tag, track.root.id);
    }
};
__decorate([
    typescript_ioc_1.Inject,
    __metadata("design:type", track_service_1.TrackService)
], TrackController.prototype, "trackService", void 0);
__decorate([
    typescript_ioc_1.Inject,
    __metadata("design:type", io_service_1.IoService)
], TrackController.prototype, "ioService", void 0);
__decorate([
    rest_1.Get('/id', () => track_model_1.Track, { description: 'Get a Track by Id', summary: 'Get Track' }),
    __param(0, rest_1.QueryParam('id', { description: 'Track Id', isID: true })),
    __param(1, rest_1.QueryParams()),
    __param(2, rest_1.CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, track_args_1.IncludesTrackArgs,
        user_1.User]),
    __metadata("design:returntype", Promise)
], TrackController.prototype, "id", null);
__decorate([
    rest_1.Get('/search', () => track_model_1.TrackPage, { description: 'Search Tracks' }),
    __param(0, rest_1.QueryParams()),
    __param(1, rest_1.QueryParams()),
    __param(2, rest_1.QueryParams()),
    __param(3, rest_1.QueryParams()),
    __param(4, rest_1.QueryParams()),
    __param(5, rest_1.CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [base_args_1.PageArgs,
        track_args_1.IncludesTrackArgs,
        track_args_1.TrackFilterArgs,
        track_args_1.TrackOrderArgs,
        base_args_1.ListArgs,
        user_1.User]),
    __metadata("design:returntype", Promise)
], TrackController.prototype, "search", null);
__decorate([
    rest_1.Get('/similar', () => track_model_1.TrackPage, { description: 'Get similar Tracks by Track Id (External Service)', summary: 'Get similar Tracks' }),
    __param(0, rest_1.QueryParam('id', { description: 'Track Id', isID: true })),
    __param(1, rest_1.QueryParams()),
    __param(2, rest_1.QueryParams()),
    __param(3, rest_1.CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, base_args_1.PageArgs,
        track_args_1.IncludesTrackArgs,
        user_1.User]),
    __metadata("design:returntype", Promise)
], TrackController.prototype, "similar", null);
__decorate([
    rest_1.Get('/lyrics', () => track_model_1.TrackLyrics, { description: 'Get Lyrics for a Track by Id (External Service or Media File)', summary: 'Get Lyrics' }),
    __param(0, rest_1.QueryParam('id', { description: 'Track Id', isID: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TrackController.prototype, "lyrics", null);
__decorate([
    rest_1.Get('/rawTag/get', () => [tag_model_1.MediaIDTagRaw], { description: 'Get Raw Tag (eg. id3/vorbis)', summary: 'Get Raw Tag' }),
    __param(0, rest_1.QueryParams()),
    __param(1, rest_1.CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [track_args_1.TrackFilterArgs,
        user_1.User]),
    __metadata("design:returntype", Promise)
], TrackController.prototype, "rawTagGet", null);
__decorate([
    rest_1.Get('/health', () => [track_model_1.TrackHealth], { description: 'List of Tracks with Health Issues', roles: [enums_1.UserRole.admin], summary: 'Get Health' }),
    __param(0, rest_1.QueryParams()),
    __param(1, rest_1.QueryParams()),
    __param(2, rest_1.QueryParams()),
    __param(3, rest_1.CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [track_args_1.MediaHealthArgs,
        track_args_1.TrackFilterArgs,
        track_args_1.IncludesTrackArgs,
        user_1.User]),
    __metadata("design:returntype", Promise)
], TrackController.prototype, "health", null);
__decorate([
    rest_1.Post('/rename', () => admin_1.AdminChangeQueueInfo, { description: 'Rename a track', roles: [enums_1.UserRole.admin], summary: 'Rename Track' }),
    __param(0, rest_1.BodyParams()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [track_args_1.TrackRenameArgs]),
    __metadata("design:returntype", Promise)
], TrackController.prototype, "rename", null);
__decorate([
    rest_1.Post('/move', () => admin_1.AdminChangeQueueInfo, { description: 'Move Tracks', roles: [enums_1.UserRole.admin] }),
    __param(0, rest_1.BodyParams()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [track_args_1.TrackMoveArgs]),
    __metadata("design:returntype", Promise)
], TrackController.prototype, "move", null);
__decorate([
    rest_1.Post('/remove', () => admin_1.AdminChangeQueueInfo, { description: 'Remove a Track', roles: [enums_1.UserRole.admin], summary: 'Remove Track' }),
    __param(0, rest_1.BodyParam('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TrackController.prototype, "remove", null);
__decorate([
    rest_1.Post('/fix', () => admin_1.AdminChangeQueueInfo, { description: 'Fix Track by Health Hint Id', roles: [enums_1.UserRole.admin], summary: 'Fix Track' }),
    __param(0, rest_1.BodyParams()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [track_args_1.TrackFixArgs]),
    __metadata("design:returntype", Promise)
], TrackController.prototype, "fix", null);
__decorate([
    rest_1.Post('/rawTag/set', () => admin_1.AdminChangeQueueInfo, { description: 'Write a Raw Rag to a Track by Track Id', roles: [enums_1.UserRole.admin], summary: 'Set Raw Tag' }),
    __param(0, rest_1.BodyParams()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [track_args_1.RawTagUpdateArgs]),
    __metadata("design:returntype", Promise)
], TrackController.prototype, "rawTagSet", null);
TrackController = __decorate([
    rest_1.Controller('/track', { tags: ['Track'], roles: [enums_1.UserRole.stream] })
], TrackController);
exports.TrackController = TrackController;
//# sourceMappingURL=track.controller.js.map