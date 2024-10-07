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
import { SubsonicRoute } from '../decorators/SubsonicRoute.js';
import { SubsonicParams } from '../decorators/SubsonicParams.js';
import { SubsonicParameterBookmark, SubsonicParameterID, SubsonicParameterPlayQueue } from '../model/subsonic-rest-params.js';
import { SubsonicOKResponse, SubsonicResponseBookmarks, SubsonicResponsePlayQueue } from '../model/subsonic-rest-data.js';
import { SubsonicController } from '../decorators/SubsonicController.js';
import { SubsonicCtx } from '../decorators/SubsonicContext.js';
import { SubsonicFormatter } from '../formatter.js';
import { SubsonicHelper } from '../helper.js';
let SubsonicBookmarkApi = class SubsonicBookmarkApi {
    async createBookmark(query, { engine, orm, user }) {
        const track = await orm.Track.findOneOrFailByID(query.id);
        await engine.bookmark.create(orm, track.id, user, query.position, query.comment);
    }
    async getBookmarks({ orm, user }) {
        const bookmarklist = await orm.Bookmark.findFilter({ userIDs: [user.id] });
        const bookmarks = {};
        bookmarks.bookmark = await SubsonicHelper.prepareBookmarks(orm, bookmarklist, user);
        return { bookmarks };
    }
    async deleteBookmark(query, { engine, orm, user }) {
        if (query.id) {
            await engine.bookmark.removeByDest(orm, query.id, user.id);
        }
        return {};
    }
    async getPlayQueue({ engine, orm, user }) {
        const playqueue = await engine.playQueue.get(orm, user);
        if (!playqueue) {
            return {};
        }
        const entries = await playqueue.entries.getItems();
        const tracks = [];
        for (const entry of entries) {
            const track = await entry.track.get();
            if (track) {
                tracks.push(track);
            }
        }
        const childs = await SubsonicHelper.prepareTracks(orm, tracks, user);
        return { playQueue: SubsonicFormatter.packPlayQueue(playqueue, user, childs) };
    }
    async savePlayQueue(query, { engine, orm, user, client }) {
        const mediaIDs = query.id ? (Array.isArray(query.id) ? query.id : [query.id]) : [];
        await engine.playQueue.set(orm, {
            mediaIDs,
            currentID: query.current,
            position: query.position
        }, user, client || 'unknown');
        return {};
    }
};
__decorate([
    SubsonicRoute('/createBookmark', () => SubsonicOKResponse, {
        summary: 'Create Bookmarks',
        description: 'Creates or updates a bookmark (a position within a media file). Bookmarks are personal and not visible to other users.',
        tags: ['Bookmarks']
    }),
    __param(0, SubsonicParams()),
    __param(1, SubsonicCtx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [SubsonicParameterBookmark, Object]),
    __metadata("design:returntype", Promise)
], SubsonicBookmarkApi.prototype, "createBookmark", null);
__decorate([
    SubsonicRoute('/getBookmarks', () => SubsonicResponseBookmarks, {
        summary: 'Get Bookmarks',
        description: 'Returns all bookmarks for this user. A bookmark is a position within a certain media file.',
        tags: ['Bookmarks']
    }),
    __param(0, SubsonicCtx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SubsonicBookmarkApi.prototype, "getBookmarks", null);
__decorate([
    SubsonicRoute('/deleteBookmark', () => SubsonicOKResponse, { summary: 'Delete Bookmarks', description: 'Deletes the bookmark for a given media file.', tags: ['Bookmarks'] }),
    __param(0, SubsonicParams()),
    __param(1, SubsonicCtx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [SubsonicParameterID, Object]),
    __metadata("design:returntype", Promise)
], SubsonicBookmarkApi.prototype, "deleteBookmark", null);
__decorate([
    SubsonicRoute('/getPlayQueue', () => SubsonicResponsePlayQueue, { summary: 'Get Play Queue', description: 'Returns the state of the play queue for this user (as set by savePlayQueue).', tags: ['PlayQueue'] }),
    __param(0, SubsonicCtx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SubsonicBookmarkApi.prototype, "getPlayQueue", null);
__decorate([
    SubsonicRoute('/savePlayQueue', () => SubsonicOKResponse, { summary: 'Save Play Queue', description: 'Returns the state of the play queue for this user (as set by savePlayQueue).', tags: ['PlayQueue'] }),
    __param(0, SubsonicParams()),
    __param(1, SubsonicCtx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [SubsonicParameterPlayQueue, Object]),
    __metadata("design:returntype", Promise)
], SubsonicBookmarkApi.prototype, "savePlayQueue", null);
SubsonicBookmarkApi = __decorate([
    SubsonicController()
], SubsonicBookmarkApi);
export { SubsonicBookmarkApi };
//# sourceMappingURL=bookmarks.js.map