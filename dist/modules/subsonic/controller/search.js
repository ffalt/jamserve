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
import { paginate } from '../../../entity/base/base.utils.js';
import { DBObjectType, FolderType } from '../../../types/enums.js';
import { SubsonicRoute } from '../decorators/SubsonicRoute.js';
import { SubsonicParams } from '../decorators/SubsonicParams.js';
import { SubsonicParameterSearch, SubsonicParameterSearch2 } from '../model/subsonic-rest-params.js';
import { SubsonicResponseSearchResult, SubsonicResponseSearchResult2, SubsonicResponseSearchResult3 } from '../model/subsonic-rest-data.js';
import { SubsonicController } from '../decorators/SubsonicController.js';
import { SubsonicCtx } from '../decorators/SubsonicContext.js';
import { SubsonicFormatter } from '../formatter.js';
import { SubsonicHelper } from '../helper.js';
let SubsonicSearchApi = class SubsonicSearchApi {
    async search(query, { orm, user }) {
        if (query.any) {
            query.artist = query.any;
            query.album = query.any;
            query.title = query.any;
        }
        let list = await orm.Track.findIDsFilter({
            artist: query.artist,
            album: query.album,
            name: query.title,
            since: query.newerThan
        });
        const searchResult = { offset: query.offset || 0, totalHits: list.length };
        list = paginate(list, { take: query.count || 20, skip: query.offset || 0 }).items;
        const tracks = await orm.Track.findByIDs(list);
        searchResult.match = await SubsonicHelper.prepareTracks(orm, tracks, user);
        return { searchResult };
    }
    async search2(query, { orm, user }) {
        const searchResult2 = {};
        const rootIDs = query.musicFolderId ? [query.musicFolderId] : undefined;
        const q = (query.query || '').replace(/\*/g, '');
        const trackList = await orm.Track.findFilter({ query: q, rootIDs }, undefined, { take: query.songCount || 20, skip: query.songOffset || 0 });
        searchResult2.song = await SubsonicHelper.prepareTracks(orm, trackList, user);
        const artistFolderList = await orm.Folder.findFilter({ query: q, rootIDs, folderTypes: [FolderType.artist] }, undefined, { take: query.artistCount || 20, skip: query.artistOffset || 0 });
        const albumFolderList = await orm.Folder.findFilter({ query: q, rootIDs, folderTypes: [FolderType.album] }, undefined, { take: query.artistCount || 20, skip: query.artistOffset || 0 });
        const ids = (albumFolderList.map(f => f.id)).concat(artistFolderList.map(f => f.id));
        const states = await SubsonicHelper.loadStates(orm, ids, DBObjectType.folder, user.id);
        searchResult2.artist = [];
        searchResult2.album = [];
        for (const folder of artistFolderList) {
            searchResult2.artist.push(await SubsonicFormatter.packFolderArtist(folder, states[folder.id]));
        }
        for (const folder of albumFolderList) {
            searchResult2.album.push(await SubsonicFormatter.packFolder(folder, states[folder.id]));
        }
        return { searchResult2 };
    }
    async search3(query, { orm, user }) {
        const searchResult3 = {};
        const tracklist = await orm.Track.findIDsFilter({ query: query.query });
        if (tracklist.length > 0) {
            const limit = paginate(tracklist, { take: query.songCount || 20, skip: query.songOffset || 0 });
            const tracks = await orm.Track.findByIDs(limit.items);
            searchResult3.song = await SubsonicHelper.prepareTracks(orm, tracks, user);
        }
        const albumlist = await orm.Album.findIDsFilter({ query: query.query });
        if (albumlist.length > 0) {
            const limit = paginate(albumlist, { take: query.albumCount || 20, skip: query.albumOffset || 0 });
            const albums = await orm.Album.findByIDs(limit.items);
            searchResult3.album = await SubsonicHelper.prepareAlbums(orm, albums, user);
        }
        const artistlist = await orm.Artist.findIDsFilter({ query: query.query });
        if (artistlist.length > 0) {
            const limit = paginate(artistlist, { take: query.artistCount || 20, skip: query.artistOffset || 0 });
            const artists = await orm.Artist.findByIDs(limit.items);
            searchResult3.artist = await SubsonicHelper.prepareArtists(orm, artists, user);
        }
        return { searchResult3 };
    }
};
__decorate([
    SubsonicRoute('/search', () => SubsonicResponseSearchResult, {
        summary: 'Search',
        description: 'Returns a listing of files matching the given search criteria.',
        tags: ['Search']
    }),
    __param(0, SubsonicParams()),
    __param(1, SubsonicCtx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [SubsonicParameterSearch, Object]),
    __metadata("design:returntype", Promise)
], SubsonicSearchApi.prototype, "search", null);
__decorate([
    SubsonicRoute('/search2', () => SubsonicResponseSearchResult2, {
        summary: 'Search 2',
        description: 'Returns albums, artists and songs matching the given search criteria.',
        tags: ['Search']
    }),
    __param(0, SubsonicParams()),
    __param(1, SubsonicCtx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [SubsonicParameterSearch2, Object]),
    __metadata("design:returntype", Promise)
], SubsonicSearchApi.prototype, "search2", null);
__decorate([
    SubsonicRoute('/search3', () => SubsonicResponseSearchResult3, {
        summary: 'Search 3',
        description: 'Similar to search2, but organizes music according to ID3 tags.',
        tags: ['Search']
    }),
    __param(0, SubsonicParams()),
    __param(1, SubsonicCtx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [SubsonicParameterSearch2, Object]),
    __metadata("design:returntype", Promise)
], SubsonicSearchApi.prototype, "search3", null);
SubsonicSearchApi = __decorate([
    SubsonicController()
], SubsonicSearchApi);
export { SubsonicSearchApi };
//# sourceMappingURL=search.js.map