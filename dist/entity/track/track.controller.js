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
import { Track, TrackHealth, TrackLyrics, TrackPage } from './track.model.js';
import { BodyParam, BodyParams, Controller, Ctx, Get, Post, QueryParam, QueryParams } from '../../modules/rest/index.js';
import { UserRole } from '../../types/enums.js';
import { IncludesTrackArgs, MediaHealthArgs, RawTagUpdateArgs, TrackFilterArgs, TrackFixArgs, TrackMoveArgs, TrackOrderArgs, TrackRenameArgs } from './track.args.js';
import { MediaIDTagRaw } from '../tag/tag.model.js';
import { ListArgs, PageArgs } from '../base/base.args.js';
import { AdminChangeQueueInfo } from '../admin/admin.js';
let TrackController = class TrackController {
    async id(id, trackArgs, { orm, engine, user }) {
        return engine.transform.track(orm, await orm.Track.oneOrFailByID(id), trackArgs, user);
    }
    async search(page, trackArgs, filter, order, list, { orm, engine, user }) {
        if (list.list) {
            return await orm.Track.findListTransformFilter(list.list, list.seed, filter, [order], page, user, o => engine.transform.track(orm, o, trackArgs, user));
        }
        return await orm.Track.searchTransformFilter(filter, [order], page, user, o => engine.transform.track(orm, o, trackArgs, user));
    }
    async similar(id, page, trackArgs, { orm, engine, user }) {
        const track = await orm.Track.oneOrFailByID(id);
        const result = await engine.metadata.similarTracks.byTrack(orm, track, page);
        return { ...result, items: await engine.transform.Track.trackBases(orm, result.items, trackArgs, user) };
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
                track: await engine.transform.Track.trackBase(orm, item.track, trackArgs, user),
                health: item.health
            });
        }
        return result;
    }
    async rename(args, { orm, engine }) {
        const track = await orm.Track.oneOrFailByID(args.id);
        return await engine.io.track.rename(args.id, args.name, track.root.idOrFail());
    }
    async move(args, { orm, engine }) {
        const folder = await orm.Folder.oneOrFailByID(args.folderID);
        return await engine.io.track.move(args.ids, args.folderID, folder.root.idOrFail());
    }
    async remove(id, { orm, engine }) {
        const track = await orm.Track.oneOrFailByID(id);
        return await engine.io.track.remove(id, track.root.idOrFail());
    }
    async fix(args, { orm, engine }) {
        const track = await orm.Track.oneOrFailByID(args.id);
        return await engine.io.track.fix(args.id, args.fixID, track.root.idOrFail());
    }
    async rawTagSet(args, { orm, engine }) {
        const track = await orm.Track.oneOrFailByID(args.id);
        return await engine.io.track.writeTags(args.id, args.tag, track.root.idOrFail());
    }
};
__decorate([
    Get('/id', () => Track, { description: 'Get a Track by Id', summary: 'Get Track' }),
    __param(0, QueryParam('id', { description: 'Track Id', isID: true })),
    __param(1, QueryParams()),
    __param(2, Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, IncludesTrackArgs, Object]),
    __metadata("design:returntype", Promise)
], TrackController.prototype, "id", null);
__decorate([
    Get('/search', () => TrackPage, { description: 'Search Tracks' }),
    __param(0, QueryParams()),
    __param(1, QueryParams()),
    __param(2, QueryParams()),
    __param(3, QueryParams()),
    __param(4, QueryParams()),
    __param(5, Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [PageArgs,
        IncludesTrackArgs,
        TrackFilterArgs,
        TrackOrderArgs,
        ListArgs, Object]),
    __metadata("design:returntype", Promise)
], TrackController.prototype, "search", null);
__decorate([
    Get('/similar', () => TrackPage, { description: 'Get similar Tracks by Track Id (External Service)', summary: 'Get similar Tracks' }),
    __param(0, QueryParam('id', { description: 'Track Id', isID: true })),
    __param(1, QueryParams()),
    __param(2, QueryParams()),
    __param(3, Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, PageArgs,
        IncludesTrackArgs, Object]),
    __metadata("design:returntype", Promise)
], TrackController.prototype, "similar", null);
__decorate([
    Get('/lyrics', () => TrackLyrics, { description: 'Get Lyrics for a Track by Id (External Service or Media File)', summary: 'Get Lyrics' }),
    __param(0, QueryParam('id', { description: 'Track Id', isID: true })),
    __param(1, Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], TrackController.prototype, "lyrics", null);
__decorate([
    Get('/rawTag/get', () => [MediaIDTagRaw], { description: 'Get Raw Tag (eg. id3/vorbis)', summary: 'Get Raw Tag' }),
    __param(0, QueryParams()),
    __param(1, Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [TrackFilterArgs, Object]),
    __metadata("design:returntype", Promise)
], TrackController.prototype, "rawTagGet", null);
__decorate([
    Get('/health', () => [TrackHealth], { description: 'List of Tracks with Health Issues', roles: [UserRole.admin], summary: 'Get Health' }),
    __param(0, QueryParams()),
    __param(1, QueryParams()),
    __param(2, QueryParams()),
    __param(3, Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [MediaHealthArgs,
        TrackFilterArgs,
        IncludesTrackArgs, Object]),
    __metadata("design:returntype", Promise)
], TrackController.prototype, "health", null);
__decorate([
    Post('/rename', () => AdminChangeQueueInfo, { description: 'Rename a track', roles: [UserRole.admin], summary: 'Rename Track' }),
    __param(0, BodyParams()),
    __param(1, Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [TrackRenameArgs, Object]),
    __metadata("design:returntype", Promise)
], TrackController.prototype, "rename", null);
__decorate([
    Post('/move', () => AdminChangeQueueInfo, { description: 'Move Tracks', roles: [UserRole.admin] }),
    __param(0, BodyParams()),
    __param(1, Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [TrackMoveArgs, Object]),
    __metadata("design:returntype", Promise)
], TrackController.prototype, "move", null);
__decorate([
    Post('/remove', () => AdminChangeQueueInfo, { description: 'Remove a Track', roles: [UserRole.admin], summary: 'Remove Track' }),
    __param(0, BodyParam('id')),
    __param(1, Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], TrackController.prototype, "remove", null);
__decorate([
    Post('/fix', () => AdminChangeQueueInfo, { description: 'Fix Track by Health Hint Id', roles: [UserRole.admin], summary: 'Fix Track' }),
    __param(0, BodyParams()),
    __param(1, Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [TrackFixArgs, Object]),
    __metadata("design:returntype", Promise)
], TrackController.prototype, "fix", null);
__decorate([
    Post('/rawTag/set', () => AdminChangeQueueInfo, { description: 'Write a Raw Rag to a Track by Track Id', roles: [UserRole.admin], summary: 'Set Raw Tag' }),
    __param(0, BodyParams()),
    __param(1, Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [RawTagUpdateArgs, Object]),
    __metadata("design:returntype", Promise)
], TrackController.prototype, "rawTagSet", null);
TrackController = __decorate([
    Controller('/track', { tags: ['Track'], roles: [UserRole.stream] })
], TrackController);
export { TrackController };
//# sourceMappingURL=track.controller.js.map