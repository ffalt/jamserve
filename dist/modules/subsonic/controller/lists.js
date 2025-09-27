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
import { randomItems } from '../../../utils/random.js';
import { AlbumOrderFields, DBObjectType, FolderOrderFields, FolderType, FolderTypesAlbum, ListType } from '../../../types/enums.js';
import { SubsonicRoute } from '../decorators/subsonic-route.js';
import { SubsonicParameters } from '../decorators/subsonic-parameters.js';
import { SubsonicParameterAlbumList, SubsonicParameterSongsByGenre, SubsonicParameterAlbumList2, SubsonicParameterRandomSong, SubsonicParameterMusicFolderID } from '../model/subsonic-rest-parameters.js';
import { SubsonicResponseAlbumList, SubsonicResponseAlbumList2, SubsonicResponseNowPlaying, SubsonicResponseRandomSongs, SubsonicResponseSongsByGenre, SubsonicResponseStarred, SubsonicResponseStarred2 } from '../model/subsonic-rest-data.js';
import { SubsonicController } from '../decorators/subsonic-controller.js';
import { SubsonicContext } from '../decorators/subsonic-context.js';
import { SubsonicApiError, SubsonicFormatter } from '../formatter.js';
import { SubsonicHelper } from '../helper.js';
let SubsonicListsApi = class SubsonicListsApi {
    async getNowPlaying({ engine, orm, user }) {
        const list = await engine.nowPlaying.getNowPlaying();
        const result = [];
        for (const entry of list) {
            const state = await orm.State.findOrCreate((entry.episode?.id ?? entry.track?.id) ?? '', entry.episode?.id ? DBObjectType.episode : DBObjectType.track, user.id);
            result.push(await SubsonicFormatter.packNowPlaying(entry, state));
        }
        return { nowPlaying: { entry: result } };
    }
    async getRandomSongs(query, { orm, user }) {
        const amount = Math.min(query.size ?? 10, 500);
        const filter = {
            genres: query.genre ? [query.genre] : undefined,
            fromYear: query.fromYear,
            toYear: query.toYear,
            rootIDs: query.musicFolderId ? [query.musicFolderId] : undefined
        };
        const randomSongs = {};
        const trackids = await orm.Track.findIDsFilter(filter);
        if (trackids.length > 0) {
            const limit = randomItems(trackids, amount);
            const tracks = await orm.Track.findByIDs(limit);
            randomSongs.song = await SubsonicHelper.prepareTracks(orm, tracks, user);
        }
        return { randomSongs };
    }
    async getAlbumList(query, { orm, user }) {
        const take = query.size ?? 20;
        const skip = query.offset ?? 0;
        let folders = [];
        switch (query.type) {
            case 'random': {
                const data = await orm.Folder.findListFilter(ListType.random, undefined, { folderTypes: FolderTypesAlbum }, undefined, { skip, take }, user);
                folders = data.items;
                break;
            }
            case 'starred': {
                const data = await orm.Folder.findListFilter(ListType.faved, undefined, { folderTypes: FolderTypesAlbum }, undefined, { skip, take }, user);
                folders = data.items;
                break;
            }
            case 'frequent': {
                const data = await orm.Folder.findListFilter(ListType.frequent, undefined, { folderTypes: FolderTypesAlbum }, undefined, { skip, take }, user);
                folders = data.items;
                break;
            }
            case 'recent': {
                const data = await orm.Folder.findListFilter(ListType.recent, undefined, { folderTypes: FolderTypesAlbum }, undefined, { skip, take }, user);
                folders = data.items;
                break;
            }
            case 'highest': {
                const data = await orm.Folder.findListFilter(ListType.highest, undefined, { folderTypes: FolderTypesAlbum }, undefined, { skip, take }, user);
                folders = data.items;
                break;
            }
            case 'newest': {
                folders = await orm.Folder.findFilter({ folderTypes: FolderTypesAlbum }, [{ orderBy: FolderOrderFields.created, orderDesc: true }], { skip, take });
                break;
            }
            case 'alphabeticalByArtist': {
                folders = await orm.Folder.findFilter({ folderTypes: FolderTypesAlbum }, [{ orderBy: FolderOrderFields.artist, orderDesc: false }], { skip, take });
                break;
            }
            case 'alphabeticalByName': {
                folders = await orm.Folder.findFilter({ folderTypes: FolderTypesAlbum }, [{ orderBy: FolderOrderFields.album, orderDesc: false }], { skip, take });
                break;
            }
            case 'byGenre': {
                folders = await orm.Folder.findFilter({ folderTypes: FolderTypesAlbum, genres: query.genre ? [query.genre] : undefined }, [{ orderBy: FolderOrderFields.album, orderDesc: false }], { skip, take });
                break;
            }
            case 'byYear': {
                folders = await orm.Folder.findFilter({
                    folderTypes: FolderTypesAlbum,
                    fromYear: query.fromYear,
                    toYear: query.toYear
                }, [{ orderBy: FolderOrderFields.album, orderDesc: false }], { skip, take });
                break;
            }
            default: {
                return Promise.reject(new SubsonicApiError(SubsonicFormatter.ERRORS.PARAM_INVALID));
            }
        }
        const result = await SubsonicHelper.prepareFolders(orm, folders, user);
        return { albumList: { album: result } };
    }
    async getAlbumList2(query, { orm, user }) {
        const take = Math.min(query.size ?? 20, 500);
        const skip = query.offset ?? 0;
        const rootIDs = query.musicFolderId ? [query.musicFolderId] : undefined;
        let albums = [];
        switch (query.type) {
            case 'random': {
                const data = await orm.Album.findListFilter(ListType.random, undefined, { rootIDs }, undefined, { skip, take }, user);
                albums = data.items;
                break;
            }
            case 'starred': {
                const data = await orm.Album.findListFilter(ListType.faved, undefined, { rootIDs }, undefined, { skip, take }, user);
                albums = data.items;
                break;
            }
            case 'frequent': {
                const data = await orm.Album.findListFilter(ListType.frequent, undefined, { rootIDs }, undefined, { skip, take }, user);
                albums = data.items;
                break;
            }
            case 'recent': {
                const data = await orm.Album.findListFilter(ListType.recent, undefined, { rootIDs }, undefined, { skip, take }, user);
                albums = data.items;
                break;
            }
            case 'highest': {
                const data = await orm.Album.findListFilter(ListType.highest, undefined, { rootIDs }, undefined, { skip, take }, user);
                albums = data.items;
                break;
            }
            case 'byGenre': {
                albums = await orm.Album.findFilter({ genres: query.genre ? [query.genre] : undefined, rootIDs }, [{ orderBy: AlbumOrderFields.name, orderDesc: false }], { skip, take });
                break;
            }
            case 'byYear': {
                albums = await orm.Album.findFilter({ fromYear: query.fromYear, toYear: query.toYear, rootIDs }, [{ orderBy: AlbumOrderFields.name, orderDesc: false }], { skip, take });
                break;
            }
            case 'newest': {
                albums = await orm.Album.findFilter({ rootIDs }, [{ orderBy: AlbumOrderFields.created, orderDesc: true }], { skip, take });
                break;
            }
            case 'alphabeticalByArtist': {
                albums = await orm.Album.findFilter({ rootIDs }, [{ orderBy: AlbumOrderFields.artist, orderDesc: true }], { skip, take });
                break;
            }
            case 'alphabeticalByName': {
                albums = await orm.Album.findFilter({ rootIDs }, [{ orderBy: AlbumOrderFields.name, orderDesc: true }], { skip, take });
                break;
            }
            default: {
                return Promise.reject(new SubsonicApiError(SubsonicFormatter.ERRORS.PARAM_INVALID));
            }
        }
        const result = await SubsonicHelper.prepareAlbums(orm, albums, user);
        return { albumList2: { album: result } };
    }
    async getSongsByGenre(query, { orm, user }) {
        const take = query.count ?? 10;
        const skip = query.offset ?? 0;
        const rootIDs = query.musicFolderId ? [query.musicFolderId] : undefined;
        const genres = query.genre ? [query.genre] : undefined;
        const tracks = await orm.Track.findFilter({ rootIDs, genres }, undefined, { skip, take }, user);
        const songsByGenre = {
            song: await SubsonicHelper.prepareTracks(orm, tracks, user)
        };
        return { songsByGenre };
    }
    async getStarred(query, { orm, user }) {
        const starred = {};
        const rootIDs = query.musicFolderId ? [query.musicFolderId] : undefined;
        const tracks = await orm.Track.findListFilter(ListType.faved, undefined, { rootIDs }, undefined, undefined, user);
        if (tracks.items.length > 0) {
            starred.song = await SubsonicHelper.prepareTracks(orm, tracks.items, user);
        }
        const artists = await orm.Folder.findListFilter(ListType.faved, undefined, { folderTypes: [FolderType.artist], rootIDs }, undefined, undefined, user);
        if (artists.items.length > 0) {
            starred.artist = await SubsonicHelper.prepareFolderArtists(orm, artists.items, user);
        }
        const albums = await orm.Folder.findListFilter(ListType.faved, undefined, { folderTypes: FolderTypesAlbum, rootIDs }, undefined, undefined, user);
        if (albums.items.length > 0) {
            starred.album = await SubsonicHelper.prepareFolders(orm, albums.items, user);
        }
        return { starred };
    }
    async getStarred2(query, { orm, user }) {
        const starred2 = {};
        const rootIDs = query.musicFolderId ? [query.musicFolderId] : undefined;
        const tracks = await orm.Track.findListFilter(ListType.faved, undefined, { rootIDs }, undefined, undefined, user);
        if (tracks.items.length > 0) {
            starred2.song = await SubsonicHelper.prepareTracks(orm, tracks.items, user);
        }
        const artists = await orm.Artist.findListFilter(ListType.faved, undefined, { rootIDs }, undefined, undefined, user);
        if (artists.items.length > 0) {
            starred2.artist = await SubsonicHelper.prepareArtists(orm, artists.items, user);
        }
        const albums = await orm.Album.findListFilter(ListType.faved, undefined, { rootIDs }, undefined, undefined, user);
        if (albums.items.length > 0) {
            starred2.album = await SubsonicHelper.prepareAlbums(orm, albums.items, user);
        }
        return { starred2 };
    }
};
__decorate([
    SubsonicRoute('/getNowPlaying', () => SubsonicResponseNowPlaying, {
        summary: 'Now Playing',
        description: 'Returns what is currently being played by all users.',
        tags: ['Lists']
    }),
    __param(0, SubsonicContext()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SubsonicListsApi.prototype, "getNowPlaying", null);
__decorate([
    SubsonicRoute('/getRandomSongs', () => SubsonicResponseRandomSongs, {
        summary: 'Random Songs',
        description: 'Returns random songs matching the given criteria.',
        tags: ['Lists']
    }),
    __param(0, SubsonicParameters()),
    __param(1, SubsonicContext()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [SubsonicParameterRandomSong, Object]),
    __metadata("design:returntype", Promise)
], SubsonicListsApi.prototype, "getRandomSongs", null);
__decorate([
    SubsonicRoute('/getAlbumList', () => SubsonicResponseAlbumList, {
        summary: 'Album List',
        description: 'Returns a list of random, newest, highest rated etc. albums. Similar to the album lists on the home page of the Subsonic web interface.',
        tags: ['Lists']
    }),
    __param(0, SubsonicParameters()),
    __param(1, SubsonicContext()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [SubsonicParameterAlbumList, Object]),
    __metadata("design:returntype", Promise)
], SubsonicListsApi.prototype, "getAlbumList", null);
__decorate([
    SubsonicRoute('/getAlbumList2', () => SubsonicResponseAlbumList2, {
        summary: 'Album List 2',
        description: 'Similar to getAlbumList, but organizes music according to ID3 tags.',
        tags: ['Lists']
    }),
    __param(0, SubsonicParameters()),
    __param(1, SubsonicContext()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [SubsonicParameterAlbumList2, Object]),
    __metadata("design:returntype", Promise)
], SubsonicListsApi.prototype, "getAlbumList2", null);
__decorate([
    SubsonicRoute('/getSongsByGenre', () => SubsonicResponseSongsByGenre, {
        summary: 'Songs By Genre',
        description: 'Returns songs in a given genre.',
        tags: ['Lists']
    }),
    __param(0, SubsonicParameters()),
    __param(1, SubsonicContext()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [SubsonicParameterSongsByGenre, Object]),
    __metadata("design:returntype", Promise)
], SubsonicListsApi.prototype, "getSongsByGenre", null);
__decorate([
    SubsonicRoute('/getStarred', () => SubsonicResponseStarred, {
        summary: 'Starred',
        description: 'Returns starred songs, albums and artists.',
        tags: ['Lists']
    }),
    __param(0, SubsonicParameters()),
    __param(1, SubsonicContext()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [SubsonicParameterMusicFolderID, Object]),
    __metadata("design:returntype", Promise)
], SubsonicListsApi.prototype, "getStarred", null);
__decorate([
    SubsonicRoute('/getStarred2', () => SubsonicResponseStarred2, {
        summary: 'Starred 2',
        description: 'Similar to getStarred, but organizes music according to ID3 tags.',
        tags: ['Lists']
    }),
    __param(0, SubsonicParameters()),
    __param(1, SubsonicContext()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [SubsonicParameterMusicFolderID, Object]),
    __metadata("design:returntype", Promise)
], SubsonicListsApi.prototype, "getStarred2", null);
SubsonicListsApi = __decorate([
    SubsonicController()
], SubsonicListsApi);
export { SubsonicListsApi };
//# sourceMappingURL=lists.js.map