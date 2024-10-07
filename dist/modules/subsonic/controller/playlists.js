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
import { DBObjectType } from '../../../types/enums.js';
import { SubsonicRoute } from '../decorators/SubsonicRoute.js';
import { SubsonicParams } from '../decorators/SubsonicParams.js';
import { SubsonicParameterID, SubsonicParameterPlaylistCreate, SubsonicParameterPlaylists, SubsonicParameterPlaylistUpdate } from '../model/subsonic-rest-params.js';
import { SubsonicOKResponse, SubsonicResponsePlaylist, SubsonicResponsePlaylists, SubsonicResponsePlaylistWithSongs } from '../model/subsonic-rest-data.js';
import { SubsonicController } from '../decorators/SubsonicController.js';
import { SubsonicCtx } from '../decorators/SubsonicContext.js';
import { SubsonicFormatter } from '../formatter.js';
import { SubsonicHelper } from '../helper.js';
let SubsonicPlaylistsApi = class SubsonicPlaylistsApi {
    async createPlaylist(query, ctx) {
        let playlist;
        if (!query.playlistId && !query.name) {
            return Promise.reject(SubsonicFormatter.ERRORS.PARAM_MISSING);
        }
        if (query.playlistId) {
            const playlistId = query.playlistId;
            const updateQuery = {
                playlistId,
                name: query.name,
                songIdToAdd: query.songId
            };
            await this.updatePlaylist(updateQuery, ctx);
            playlist = await ctx.orm.Playlist.findOneOrFailByID(playlistId);
        }
        else if (query.name) {
            const mediaIDs = query.songId !== undefined ? (Array.isArray(query.songId) ? query.songId : [query.songId]) : [];
            playlist = await ctx.engine.playlist.create(ctx.orm, { name: query.name, isPublic: false, mediaIDs }, ctx.user);
        }
        if (!playlist) {
            return Promise.reject(SubsonicFormatter.ERRORS.NOT_FOUND);
        }
        const entries = await playlist.entries.getItems();
        const tracks = [];
        for (const entry of entries) {
            const track = await entry.track.get();
            if (track) {
                tracks.push(track);
            }
        }
        const states = (await SubsonicHelper.loadStates(ctx.orm, tracks.map(t => t.id), DBObjectType.track, ctx.user.id));
        states[playlist.id] = await ctx.orm.State.findOrCreate(playlist.id, DBObjectType.playlist, ctx.user.id);
        return { playlist: await SubsonicFormatter.packPlaylistWithSongs(playlist, tracks, states) };
    }
    async updatePlaylist(query, { orm, engine, user }) {
        const playlist = await orm.Playlist.findOneOrFailByID(query.playlistId);
        if (user.id !== playlist.user.id()) {
            return Promise.reject(SubsonicFormatter.ERRORS.UNAUTH);
        }
        const entries = await playlist.entries.getItems();
        let trackIDs = entries.map(e => e.track.id());
        const removeTracks = query.songIndexToRemove !== undefined ? (Array.isArray(query.songIndexToRemove) ? query.songIndexToRemove : [query.songIndexToRemove]) : [];
        trackIDs = trackIDs.filter((_id, index) => !removeTracks.includes(index));
        if (query.songIdToAdd) {
            const songAdd = (Array.isArray(query.songIdToAdd) ? query.songIdToAdd : [query.songIdToAdd]);
            trackIDs = trackIDs.concat(songAdd);
        }
        const mediaIDs = trackIDs.filter(t => t !== undefined);
        await engine.playlist.update(orm, {
            name: query.name || playlist.name,
            comment: query.comment || playlist.comment,
            isPublic: query.public !== undefined ? query.public : playlist.isPublic,
            mediaIDs
        }, playlist);
        return {};
    }
    async deletePlaylist(query, { orm, engine, user }) {
        const playlist = await orm.Playlist.findOneOrFailByID(query.id);
        if (user.id !== playlist.user.id()) {
            return Promise.reject(SubsonicFormatter.ERRORS.UNAUTH);
        }
        await engine.playlist.remove(orm, playlist);
        return {};
    }
    async getPlaylists(query, { orm, engine, user }) {
        let userID = user.id;
        if ((query.username) && (query.username !== user.name)) {
            if (!user.roleAdmin) {
                return Promise.reject(SubsonicFormatter.ERRORS.UNAUTH);
            }
            const u = await engine.user.findByName(orm, query.username);
            if (!u) {
                return Promise.reject(SubsonicFormatter.ERRORS.NOT_FOUND);
            }
            userID = u.id;
        }
        const list = await orm.Playlist.findFilter({ userIDs: [userID], isPublic: user.id !== userID });
        const playlist = [];
        for (const plist of list) {
            playlist.push(await SubsonicHelper.preparePlaylist(orm, plist, user));
        }
        return { playlists: { playlist } };
    }
    async getPlaylist(query, { orm, user }) {
        const playlist = await orm.Playlist.findOneOrFailByID(query.id);
        if (playlist.user.id() !== user.id) {
            return Promise.reject(SubsonicFormatter.ERRORS.UNAUTH);
        }
        const result = await SubsonicHelper.preparePlaylist(orm, playlist, user);
        return { playlist: result };
    }
};
__decorate([
    SubsonicRoute('/createPlaylist', () => SubsonicResponsePlaylistWithSongs, {
        summary: 'Create Playlists',
        description: 'Creates (or updates) a playlist.',
        tags: ['Playlists']
    }),
    __param(0, SubsonicParams()),
    __param(1, SubsonicCtx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [SubsonicParameterPlaylistCreate, Object]),
    __metadata("design:returntype", Promise)
], SubsonicPlaylistsApi.prototype, "createPlaylist", null);
__decorate([
    SubsonicRoute('/updatePlaylist', () => SubsonicOKResponse, {
        summary: 'Update Playlists',
        description: 'Updates a playlist. Only the owner of a playlist is allowed to update it.',
        tags: ['Playlists']
    }),
    __param(0, SubsonicParams()),
    __param(1, SubsonicCtx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [SubsonicParameterPlaylistUpdate, Object]),
    __metadata("design:returntype", Promise)
], SubsonicPlaylistsApi.prototype, "updatePlaylist", null);
__decorate([
    SubsonicRoute('/deletePlaylist', () => SubsonicOKResponse, {
        summary: 'Delete Playlists',
        description: 'Deletes a saved playlist.',
        tags: ['Playlists']
    }),
    __param(0, SubsonicParams()),
    __param(1, SubsonicCtx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [SubsonicParameterID, Object]),
    __metadata("design:returntype", Promise)
], SubsonicPlaylistsApi.prototype, "deletePlaylist", null);
__decorate([
    SubsonicRoute('/getPlaylists', () => SubsonicResponsePlaylists, {
        summary: 'Get Playlists',
        description: 'Returns all playlists a user is allowed to play.',
        tags: ['Playlists']
    }),
    __param(0, SubsonicParams()),
    __param(1, SubsonicCtx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [SubsonicParameterPlaylists, Object]),
    __metadata("design:returntype", Promise)
], SubsonicPlaylistsApi.prototype, "getPlaylists", null);
__decorate([
    SubsonicRoute('/getPlaylist', () => SubsonicResponsePlaylist, {
        summary: 'Get Playlist',
        description: 'Returns a listing of files in a saved playlist.',
        tags: ['Playlists']
    }),
    __param(0, SubsonicParams()),
    __param(1, SubsonicCtx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [SubsonicParameterID, Object]),
    __metadata("design:returntype", Promise)
], SubsonicPlaylistsApi.prototype, "getPlaylist", null);
SubsonicPlaylistsApi = __decorate([
    SubsonicController()
], SubsonicPlaylistsApi);
export { SubsonicPlaylistsApi };
//# sourceMappingURL=playlists.js.map