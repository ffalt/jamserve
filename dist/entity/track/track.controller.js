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
import { UserRole } from '../../types/enums.js';
import { IncludesTrackParameters, MediaHealthParameters, RawTagUpdateParameters, TrackFilterParameters, TrackFixParameters, TrackMoveParameters, TrackOrderParameters, TrackRenameParameters } from './track.parameters.js';
import { MediaIDTagRaw } from '../tag/tag.model.js';
import { ListParameters, PageParameters } from '../base/base.parameters.js';
import { AdminChangeQueueInfo } from '../admin/admin.js';
import { Controller } from '../../modules/rest/decorators/controller.js';
import { Get } from '../../modules/rest/decorators/get.js';
import { QueryParameter } from '../../modules/rest/decorators/query-parameter.js';
import { QueryParameters } from '../../modules/rest/decorators/query-parameters.js';
import { RestContext } from '../../modules/rest/decorators/rest-context.js';
import { Post } from '../../modules/rest/decorators/post.js';
import { BodyParameters } from '../../modules/rest/decorators/body-parameters.js';
import { BodyParameter } from '../../modules/rest/decorators/body-parameter.js';
let TrackController = class TrackController {
    async id(id, trackParameters, { orm, engine, user }) {
        return engine.transform.track(orm, await orm.Track.oneOrFailByID(id), trackParameters, user);
    }
    async search(page, trackParameters, filter, order, list, { orm, engine, user }) {
        if (list.list) {
            return await orm.Track.findListTransformFilter(list.list, list.seed, filter, [order], page, user, o => engine.transform.track(orm, o, trackParameters, user));
        }
        return await orm.Track.searchTransformFilter(filter, [order], page, user, o => engine.transform.track(orm, o, trackParameters, user));
    }
    async similar(id, page, trackParameters, { orm, engine, user }) {
        const track = await orm.Track.oneOrFailByID(id);
        const result = await engine.metadata.similarTracks.byTrack(orm, track, page);
        return { ...result, items: await engine.transform.Track.trackBases(orm, result.items, trackParameters, user) };
    }
    async lyrics(id, { orm, engine }) {
        const track = await orm.Track.oneOrFailByID(id);
        return await engine.metadata.lyricsByTrack(orm, track);
    }
    async rawTagGet(filter, { orm, engine, user }) {
        const tracks = await orm.Track.findFilter(filter, [], {}, user);
        const result = [];
        for (const track of tracks) {
            const raw = await engine.track.getRawTag(track);
            if (raw) {
                result.push({ id: track.id, ...raw });
            }
            else {
                result.push({ id: track.id, version: 0, frames: {} });
            }
        }
        return result;
    }
    async health(healthParameters, filter, trackParameters, { orm, engine, user }) {
        const tracks = await orm.Track.findFilter(filter, [], {}, user);
        const list = await engine.track.health(tracks, healthParameters.healthMedia);
        const result = [];
        for (const item of list) {
            result.push({
                track: await engine.transform.Track.trackBase(orm, item.track, trackParameters, user),
                health: item.health
            });
        }
        return result;
    }
    async rename(parameters, { orm, engine }) {
        const track = await orm.Track.oneOrFailByID(parameters.id);
        return await engine.io.track.rename(parameters.id, parameters.name, track.root.idOrFail());
    }
    async move(parameters, { orm, engine }) {
        const folder = await orm.Folder.oneOrFailByID(parameters.folderID);
        return await engine.io.track.move(parameters.ids, parameters.folderID, folder.root.idOrFail());
    }
    async remove(id, { orm, engine }) {
        const track = await orm.Track.oneOrFailByID(id);
        return await engine.io.track.remove(id, track.root.idOrFail());
    }
    async fix(parameters, { orm, engine }) {
        const track = await orm.Track.oneOrFailByID(parameters.id);
        return await engine.io.track.fix(parameters.id, parameters.fixID, track.root.idOrFail());
    }
    async rawTagSet(parameters, { orm, engine }) {
        const track = await orm.Track.oneOrFailByID(parameters.id);
        return await engine.io.track.writeTags(parameters.id, parameters.tag, track.root.idOrFail());
    }
};
__decorate([
    Get('/id', () => Track, { description: 'Get a Track by Id', summary: 'Get Track' }),
    __param(0, QueryParameter('id', { description: 'Track Id', isID: true })),
    __param(1, QueryParameters()),
    __param(2, RestContext()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, IncludesTrackParameters, Object]),
    __metadata("design:returntype", Promise)
], TrackController.prototype, "id", null);
__decorate([
    Get('/search', () => TrackPage, { description: 'Search Tracks' }),
    __param(0, QueryParameters()),
    __param(1, QueryParameters()),
    __param(2, QueryParameters()),
    __param(3, QueryParameters()),
    __param(4, QueryParameters()),
    __param(5, RestContext()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [PageParameters,
        IncludesTrackParameters,
        TrackFilterParameters,
        TrackOrderParameters,
        ListParameters, Object]),
    __metadata("design:returntype", Promise)
], TrackController.prototype, "search", null);
__decorate([
    Get('/similar', () => TrackPage, { description: 'Get similar Tracks by Track Id (External Service)', summary: 'Get similar Tracks' }),
    __param(0, QueryParameter('id', { description: 'Track Id', isID: true })),
    __param(1, QueryParameters()),
    __param(2, QueryParameters()),
    __param(3, RestContext()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, PageParameters,
        IncludesTrackParameters, Object]),
    __metadata("design:returntype", Promise)
], TrackController.prototype, "similar", null);
__decorate([
    Get('/lyrics', () => TrackLyrics, { description: 'Get Lyrics for a Track by Id (External Service or Media File)', summary: 'Get Lyrics' }),
    __param(0, QueryParameter('id', { description: 'Track Id', isID: true })),
    __param(1, RestContext()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], TrackController.prototype, "lyrics", null);
__decorate([
    Get('/rawTag/get', () => [MediaIDTagRaw], { description: 'Get Raw Tag (eg. id3/vorbis)', summary: 'Get Raw Tag' }),
    __param(0, QueryParameters()),
    __param(1, RestContext()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [TrackFilterParameters, Object]),
    __metadata("design:returntype", Promise)
], TrackController.prototype, "rawTagGet", null);
__decorate([
    Get('/health', () => [TrackHealth], { description: 'List of Tracks with Health Issues', roles: [UserRole.admin], summary: 'Get Health' }),
    __param(0, QueryParameters()),
    __param(1, QueryParameters()),
    __param(2, QueryParameters()),
    __param(3, RestContext()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [MediaHealthParameters,
        TrackFilterParameters,
        IncludesTrackParameters, Object]),
    __metadata("design:returntype", Promise)
], TrackController.prototype, "health", null);
__decorate([
    Post('/rename', () => AdminChangeQueueInfo, { description: 'Rename a track', roles: [UserRole.admin], summary: 'Rename Track' }),
    __param(0, BodyParameters()),
    __param(1, RestContext()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [TrackRenameParameters, Object]),
    __metadata("design:returntype", Promise)
], TrackController.prototype, "rename", null);
__decorate([
    Post('/move', () => AdminChangeQueueInfo, { description: 'Move Tracks', roles: [UserRole.admin] }),
    __param(0, BodyParameters()),
    __param(1, RestContext()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [TrackMoveParameters, Object]),
    __metadata("design:returntype", Promise)
], TrackController.prototype, "move", null);
__decorate([
    Post('/remove', () => AdminChangeQueueInfo, { description: 'Remove a Track', roles: [UserRole.admin], summary: 'Remove Track' }),
    __param(0, BodyParameter('id')),
    __param(1, RestContext()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], TrackController.prototype, "remove", null);
__decorate([
    Post('/fix', () => AdminChangeQueueInfo, { description: 'Fix Track by Health Hint Id', roles: [UserRole.admin], summary: 'Fix Track' }),
    __param(0, BodyParameters()),
    __param(1, RestContext()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [TrackFixParameters, Object]),
    __metadata("design:returntype", Promise)
], TrackController.prototype, "fix", null);
__decorate([
    Post('/rawTag/set', () => AdminChangeQueueInfo, { description: 'Write a Raw Rag to a Track by Track Id', roles: [UserRole.admin], summary: 'Set Raw Tag' }),
    __param(0, BodyParameters()),
    __param(1, RestContext()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [RawTagUpdateParameters, Object]),
    __metadata("design:returntype", Promise)
], TrackController.prototype, "rawTagSet", null);
TrackController = __decorate([
    Controller('/track', { tags: ['Track'], roles: [UserRole.stream] })
], TrackController);
export { TrackController };
//# sourceMappingURL=track.controller.js.map