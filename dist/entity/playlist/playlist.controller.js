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
exports.PlaylistController = void 0;
const playlist_model_1 = require("./playlist.model");
const rest_1 = require("../../modules/rest");
const enums_1 = require("../../types/enums");
const base_controller_1 = require("../base/base.controller");
const playlist_entry_model_1 = require("../playlistentry/playlist-entry.model");
const track_args_1 = require("../track/track.args");
const playlist_args_1 = require("./playlist.args");
const episode_args_1 = require("../episode/episode.args");
const base_args_1 = require("../base/base.args");
const typescript_ioc_1 = require("typescript-ioc");
const playlist_service_1 = require("./playlist.service");
const playlist_entry_args_1 = require("../playlistentry/playlist-entry.args");
let PlaylistController = class PlaylistController extends base_controller_1.BaseController {
    async id(id, playlistArgs, trackArgs, episodeArgs, { orm, user }) {
        return this.transform.playlist(orm, await orm.Playlist.oneOrFailFilter({ ids: [id] }, user), playlistArgs, trackArgs, episodeArgs, user);
    }
    async index(filter, { orm, user }) {
        const result = await orm.Playlist.indexFilter(filter, user);
        return this.transform.playlistIndex(orm, result);
    }
    async search(page, playlistArgs, trackArgs, episodeArgs, filter, order, list, { orm, user }) {
        if (list.list) {
            return await orm.Playlist.findListTransformFilter(list.list, filter, [order], page, user, o => this.transform.playlist(orm, o, playlistArgs, trackArgs, episodeArgs, user));
        }
        return await orm.Playlist.searchTransformFilter(filter, [order], page, user, o => this.transform.playlist(orm, o, playlistArgs, trackArgs, episodeArgs, user));
    }
    async entries(page, trackArgs, episodeArgs, filter, order, { orm, user }) {
        const playlistIDs = await orm.Playlist.findIDsFilter(filter, user);
        return await orm.PlaylistEntry.searchTransformFilter({ playlistIDs }, [order], page, user, o => this.transform.playlistEntry(orm, o, trackArgs, episodeArgs, user));
    }
    async create(args, { orm, user }) {
        const playlist = await this.playlistService.create(orm, args, user);
        return this.transform.playlist(orm, playlist, {}, {}, {}, user);
    }
    async update(id, args, { orm, user }) {
        const playlist = await orm.Playlist.oneOrFail({ where: { id, user: user.id } });
        await this.playlistService.update(orm, args, playlist);
        return this.transform.playlist(orm, playlist, {}, {}, {}, user);
    }
    async remove(id, { orm, user }) {
        const playlist = await orm.Playlist.oneOrFail({ where: { id, user: user.id } });
        await this.playlistService.remove(orm, playlist);
    }
};
__decorate([
    typescript_ioc_1.Inject,
    __metadata("design:type", playlist_service_1.PlaylistService)
], PlaylistController.prototype, "playlistService", void 0);
__decorate([
    rest_1.Get('/id', () => playlist_model_1.Playlist, { description: 'Get a Playlist by Id', summary: 'Get Playlist' }),
    __param(0, rest_1.QueryParam('id', { description: 'Playlist Id', isID: true })),
    __param(1, rest_1.QueryParams()),
    __param(2, rest_1.QueryParams()),
    __param(3, rest_1.QueryParams()),
    __param(4, rest_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, playlist_args_1.IncludesPlaylistArgs,
        track_args_1.IncludesTrackArgs,
        episode_args_1.IncludesEpisodeArgs, Object]),
    __metadata("design:returntype", Promise)
], PlaylistController.prototype, "id", null);
__decorate([
    rest_1.Get('/index', () => playlist_model_1.PlaylistIndex, { description: 'Get the Navigation Index for Playlists', summary: 'Get Index' }),
    __param(0, rest_1.QueryParams()),
    __param(1, rest_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [playlist_args_1.PlaylistFilterArgs, Object]),
    __metadata("design:returntype", Promise)
], PlaylistController.prototype, "index", null);
__decorate([
    rest_1.Get('/search', () => playlist_model_1.PlaylistPage, { description: 'Search Playlists' }),
    __param(0, rest_1.QueryParams()),
    __param(1, rest_1.QueryParams()),
    __param(2, rest_1.QueryParams()),
    __param(3, rest_1.QueryParams()),
    __param(4, rest_1.QueryParams()),
    __param(5, rest_1.QueryParams()),
    __param(6, rest_1.QueryParams()),
    __param(7, rest_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [base_args_1.PageArgs,
        playlist_args_1.IncludesPlaylistArgs,
        track_args_1.IncludesTrackArgs,
        episode_args_1.IncludesEpisodeArgs,
        playlist_args_1.PlaylistFilterArgs,
        playlist_args_1.PlaylistOrderArgs,
        base_args_1.ListArgs, Object]),
    __metadata("design:returntype", Promise)
], PlaylistController.prototype, "search", null);
__decorate([
    rest_1.Get('/entries', () => playlist_entry_model_1.PlaylistEntryPage, { description: 'Get Media Entries [Track/Episode] of Playlists', summary: 'Get Entries' }),
    __param(0, rest_1.QueryParams()),
    __param(1, rest_1.QueryParams()),
    __param(2, rest_1.QueryParams()),
    __param(3, rest_1.QueryParams()),
    __param(4, rest_1.QueryParams()),
    __param(5, rest_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [base_args_1.PageArgs,
        track_args_1.IncludesTrackArgs,
        episode_args_1.IncludesEpisodeArgs,
        playlist_args_1.PlaylistFilterArgs,
        playlist_entry_args_1.PlaylistEntryOrderArgs, Object]),
    __metadata("design:returntype", Promise)
], PlaylistController.prototype, "entries", null);
__decorate([
    rest_1.Post('/create', () => playlist_model_1.Playlist, { description: 'Create a Playlist', summary: 'Create Playlist' }),
    __param(0, rest_1.BodyParams()),
    __param(1, rest_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [playlist_args_1.PlaylistMutateArgs, Object]),
    __metadata("design:returntype", Promise)
], PlaylistController.prototype, "create", null);
__decorate([
    rest_1.Post('/update', () => playlist_model_1.Playlist, { description: 'Update a Playlist', summary: 'Update Playlist' }),
    __param(0, rest_1.BodyParam('id', { description: 'Playlist Id', isID: true })),
    __param(1, rest_1.BodyParams()),
    __param(2, rest_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, playlist_args_1.PlaylistMutateArgs, Object]),
    __metadata("design:returntype", Promise)
], PlaylistController.prototype, "update", null);
__decorate([
    rest_1.Post('/remove', { description: 'Remove a Playlist', summary: 'Remove Playlist' }),
    __param(0, rest_1.BodyParam('id', { description: 'Playlist Id', isID: true })),
    __param(1, rest_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PlaylistController.prototype, "remove", null);
PlaylistController = __decorate([
    typescript_ioc_1.InRequestScope,
    rest_1.Controller('/playlist', { tags: ['Playlist'], roles: [enums_1.UserRole.stream] })
], PlaylistController);
exports.PlaylistController = PlaylistController;
//# sourceMappingURL=playlist.controller.js.map