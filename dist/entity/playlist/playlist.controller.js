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
import { IncludesTrackParameters } from '../track/track.parameters.js';
import { IncludesPlaylistParameters, PlaylistFilterParameters, PlaylistMutateParameters, PlaylistOrderParameters } from './playlist.parameters.js';
import { IncludesEpisodeParameters } from '../episode/episode.parameters.js';
import { ListParameters, PageParameters } from '../base/base.parameters.js';
import { PlaylistEntryOrderParameters } from '../playlistentry/playlist-entry.parameters.js';
import { Controller } from '../../modules/rest/decorators/controller.js';
import { Get } from '../../modules/rest/decorators/get.js';
import { QueryParameter } from '../../modules/rest/decorators/query-parameter.js';
import { QueryParameters } from '../../modules/rest/decorators/query-parameters.js';
import { RestContext } from '../../modules/rest/decorators/rest-context.js';
import { notFoundError } from '../../modules/deco/express/express-error.js';
import { Post } from '../../modules/rest/decorators/post.js';
import { BodyParameters } from '../../modules/rest/decorators/body-parameters.js';
import { BodyParameter } from '../../modules/rest/decorators/body-parameter.js';
let PlaylistController = class PlaylistController {
    async id(id, playlistParameters, trackParameters, episodeParameters, { orm, engine, user }) {
        const list = await orm.Playlist.oneOrFail({ where: { id } });
        if (!list.isPublic && user.id !== list.user.id()) {
            throw notFoundError();
        }
        return engine.transform.playlist(orm, list, playlistParameters, trackParameters, episodeParameters, user);
    }
    async index(filter, { orm, engine, user }) {
        const result = await orm.Playlist.indexFilter(filter, user);
        return engine.transform.Playlist.playlistIndex(orm, result);
    }
    async search(page, playlistParameters, trackParameters, episodeParameters, filter, order, list, { orm, engine, user }) {
        if (list.list) {
            return await orm.Playlist.findListTransformFilter(list.list, list.seed, filter, [order], page, user, o => engine.transform.playlist(orm, o, playlistParameters, trackParameters, episodeParameters, user));
        }
        return await orm.Playlist.searchTransformFilter(filter, [order], page, user, o => engine.transform.playlist(orm, o, playlistParameters, trackParameters, episodeParameters, user));
    }
    async entries(page, trackParameters, episodeParameters, filter, order, { orm, engine, user }) {
        const playlistIDs = await orm.Playlist.findIDsFilter(filter, user);
        return await orm.PlaylistEntry.searchTransformFilter({ playlistIDs }, [order], page, user, o => engine.transform.playlistEntry(orm, o, trackParameters, episodeParameters, user));
    }
    async create(parameters, { orm, engine, user }) {
        const playlist = await engine.playlist.create(orm, parameters, user);
        return engine.transform.playlist(orm, playlist, {}, {}, {}, user);
    }
    async update(id, parameters, { orm, engine, user }) {
        const playlist = await orm.Playlist.oneOrFail({ where: { id, user: user.id } });
        await engine.playlist.update(orm, parameters, playlist);
        return engine.transform.playlist(orm, playlist, {}, {}, {}, user);
    }
    async remove(id, { orm, engine, user }) {
        const playlist = await orm.Playlist.oneOrFail({ where: { id, user: user.id } });
        await engine.playlist.remove(orm, playlist);
    }
};
__decorate([
    Get('/id', () => Playlist, { description: 'Get a Playlist by Id', summary: 'Get Playlist' }),
    __param(0, QueryParameter('id', { description: 'Playlist Id', isID: true })),
    __param(1, QueryParameters()),
    __param(2, QueryParameters()),
    __param(3, QueryParameters()),
    __param(4, RestContext()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, IncludesPlaylistParameters,
        IncludesTrackParameters,
        IncludesEpisodeParameters, Object]),
    __metadata("design:returntype", Promise)
], PlaylistController.prototype, "id", null);
__decorate([
    Get('/index', () => PlaylistIndex, { description: 'Get the Navigation Index for Playlists', summary: 'Get Index' }),
    __param(0, QueryParameters()),
    __param(1, RestContext()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [PlaylistFilterParameters, Object]),
    __metadata("design:returntype", Promise)
], PlaylistController.prototype, "index", null);
__decorate([
    Get('/search', () => PlaylistPage, { description: 'Search Playlists' }),
    __param(0, QueryParameters()),
    __param(1, QueryParameters()),
    __param(2, QueryParameters()),
    __param(3, QueryParameters()),
    __param(4, QueryParameters()),
    __param(5, QueryParameters()),
    __param(6, QueryParameters()),
    __param(7, RestContext()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [PageParameters,
        IncludesPlaylistParameters,
        IncludesTrackParameters,
        IncludesEpisodeParameters,
        PlaylistFilterParameters,
        PlaylistOrderParameters,
        ListParameters, Object]),
    __metadata("design:returntype", Promise)
], PlaylistController.prototype, "search", null);
__decorate([
    Get('/entries', () => PlaylistEntryPage, { description: 'Get Media Entries [Track/Episode] of Playlists', summary: 'Get Entries' }),
    __param(0, QueryParameters()),
    __param(1, QueryParameters()),
    __param(2, QueryParameters()),
    __param(3, QueryParameters()),
    __param(4, QueryParameters()),
    __param(5, RestContext()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [PageParameters,
        IncludesTrackParameters,
        IncludesEpisodeParameters,
        PlaylistFilterParameters,
        PlaylistEntryOrderParameters, Object]),
    __metadata("design:returntype", Promise)
], PlaylistController.prototype, "entries", null);
__decorate([
    Post('/create', () => Playlist, { description: 'Create a Playlist', summary: 'Create Playlist' }),
    __param(0, BodyParameters()),
    __param(1, RestContext()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [PlaylistMutateParameters, Object]),
    __metadata("design:returntype", Promise)
], PlaylistController.prototype, "create", null);
__decorate([
    Post('/update', () => Playlist, { description: 'Update a Playlist', summary: 'Update Playlist' }),
    __param(0, BodyParameter('id', { description: 'Playlist Id', isID: true })),
    __param(1, BodyParameters()),
    __param(2, RestContext()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, PlaylistMutateParameters, Object]),
    __metadata("design:returntype", Promise)
], PlaylistController.prototype, "update", null);
__decorate([
    Post('/remove', { description: 'Remove a Playlist', summary: 'Remove Playlist' }),
    __param(0, BodyParameter('id', { description: 'Playlist Id', isID: true })),
    __param(1, RestContext()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PlaylistController.prototype, "remove", null);
PlaylistController = __decorate([
    Controller('/playlist', { tags: ['Playlist'], roles: [UserRole.stream] })
], PlaylistController);
export { PlaylistController };
//# sourceMappingURL=playlist.controller.js.map