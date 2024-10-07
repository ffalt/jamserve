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
import { Playlist, PlaylistIndex, PlaylistPage } from './playlist.model.js';
import { UserRole } from '../../types/enums.js';
import { PlaylistEntryPage } from '../playlistentry/playlist-entry.model.js';
import { IncludesTrackArgs } from '../track/track.args.js';
import { IncludesPlaylistArgs, PlaylistFilterArgs, PlaylistMutateArgs, PlaylistOrderArgs } from './playlist.args.js';
import { IncludesEpisodeArgs } from '../episode/episode.args.js';
import { ListArgs, PageArgs } from '../base/base.args.js';
import { PlaylistEntryOrderArgs } from '../playlistentry/playlist-entry.args.js';
import { Controller } from '../../modules/rest/decorators/Controller.js';
import { Get } from '../../modules/rest/decorators/Get.js';
import { QueryParam } from '../../modules/rest/decorators/QueryParam.js';
import { QueryParams } from '../../modules/rest/decorators/QueryParams.js';
import { Ctx } from '../../modules/rest/decorators/Ctx.js';
import { NotFoundError } from '../../modules/deco/express/express-error.js';
import { Post } from '../../modules/rest/decorators/Post.js';
import { BodyParams } from '../../modules/rest/decorators/BodyParams.js';
import { BodyParam } from '../../modules/rest/decorators/BodyParam.js';
let PlaylistController = class PlaylistController {
    async id(id, playlistArgs, trackArgs, episodeArgs, { orm, engine, user }) {
        const list = await orm.Playlist.oneOrFail({ where: { id } });
        if (!list.isPublic && user.id !== list.user.id()) {
            throw NotFoundError();
        }
        return engine.transform.playlist(orm, list, playlistArgs, trackArgs, episodeArgs, user);
    }
    async index(filter, { orm, engine, user }) {
        const result = await orm.Playlist.indexFilter(filter, user);
        return engine.transform.Playlist.playlistIndex(orm, result);
    }
    async search(page, playlistArgs, trackArgs, episodeArgs, filter, order, list, { orm, engine, user }) {
        if (list.list) {
            return await orm.Playlist.findListTransformFilter(list.list, list.seed, filter, [order], page, user, o => engine.transform.playlist(orm, o, playlistArgs, trackArgs, episodeArgs, user));
        }
        return await orm.Playlist.searchTransformFilter(filter, [order], page, user, o => engine.transform.playlist(orm, o, playlistArgs, trackArgs, episodeArgs, user));
    }
    async entries(page, trackArgs, episodeArgs, filter, order, { orm, engine, user }) {
        const playlistIDs = await orm.Playlist.findIDsFilter(filter, user);
        return await orm.PlaylistEntry.searchTransformFilter({ playlistIDs }, [order], page, user, o => engine.transform.playlistEntry(orm, o, trackArgs, episodeArgs, user));
    }
    async create(args, { orm, engine, user }) {
        const playlist = await engine.playlist.create(orm, args, user);
        return engine.transform.playlist(orm, playlist, {}, {}, {}, user);
    }
    async update(id, args, { orm, engine, user }) {
        const playlist = await orm.Playlist.oneOrFail({ where: { id, user: user.id } });
        await engine.playlist.update(orm, args, playlist);
        return engine.transform.playlist(orm, playlist, {}, {}, {}, user);
    }
    async remove(id, { orm, engine, user }) {
        const playlist = await orm.Playlist.oneOrFail({ where: { id, user: user.id } });
        await engine.playlist.remove(orm, playlist);
    }
};
__decorate([
    Get('/id', () => Playlist, { description: 'Get a Playlist by Id', summary: 'Get Playlist' }),
    __param(0, QueryParam('id', { description: 'Playlist Id', isID: true })),
    __param(1, QueryParams()),
    __param(2, QueryParams()),
    __param(3, QueryParams()),
    __param(4, Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, IncludesPlaylistArgs,
        IncludesTrackArgs,
        IncludesEpisodeArgs, Object]),
    __metadata("design:returntype", Promise)
], PlaylistController.prototype, "id", null);
__decorate([
    Get('/index', () => PlaylistIndex, { description: 'Get the Navigation Index for Playlists', summary: 'Get Index' }),
    __param(0, QueryParams()),
    __param(1, Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [PlaylistFilterArgs, Object]),
    __metadata("design:returntype", Promise)
], PlaylistController.prototype, "index", null);
__decorate([
    Get('/search', () => PlaylistPage, { description: 'Search Playlists' }),
    __param(0, QueryParams()),
    __param(1, QueryParams()),
    __param(2, QueryParams()),
    __param(3, QueryParams()),
    __param(4, QueryParams()),
    __param(5, QueryParams()),
    __param(6, QueryParams()),
    __param(7, Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [PageArgs,
        IncludesPlaylistArgs,
        IncludesTrackArgs,
        IncludesEpisodeArgs,
        PlaylistFilterArgs,
        PlaylistOrderArgs,
        ListArgs, Object]),
    __metadata("design:returntype", Promise)
], PlaylistController.prototype, "search", null);
__decorate([
    Get('/entries', () => PlaylistEntryPage, { description: 'Get Media Entries [Track/Episode] of Playlists', summary: 'Get Entries' }),
    __param(0, QueryParams()),
    __param(1, QueryParams()),
    __param(2, QueryParams()),
    __param(3, QueryParams()),
    __param(4, QueryParams()),
    __param(5, Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [PageArgs,
        IncludesTrackArgs,
        IncludesEpisodeArgs,
        PlaylistFilterArgs,
        PlaylistEntryOrderArgs, Object]),
    __metadata("design:returntype", Promise)
], PlaylistController.prototype, "entries", null);
__decorate([
    Post('/create', () => Playlist, { description: 'Create a Playlist', summary: 'Create Playlist' }),
    __param(0, BodyParams()),
    __param(1, Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [PlaylistMutateArgs, Object]),
    __metadata("design:returntype", Promise)
], PlaylistController.prototype, "create", null);
__decorate([
    Post('/update', () => Playlist, { description: 'Update a Playlist', summary: 'Update Playlist' }),
    __param(0, BodyParam('id', { description: 'Playlist Id', isID: true })),
    __param(1, BodyParams()),
    __param(2, Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, PlaylistMutateArgs, Object]),
    __metadata("design:returntype", Promise)
], PlaylistController.prototype, "update", null);
__decorate([
    Post('/remove', { description: 'Remove a Playlist', summary: 'Remove Playlist' }),
    __param(0, BodyParam('id', { description: 'Playlist Id', isID: true })),
    __param(1, Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PlaylistController.prototype, "remove", null);
PlaylistController = __decorate([
    Controller('/playlist', { tags: ['Playlist'], roles: [UserRole.stream] })
], PlaylistController);
export { PlaylistController };
//# sourceMappingURL=playlist.controller.js.map