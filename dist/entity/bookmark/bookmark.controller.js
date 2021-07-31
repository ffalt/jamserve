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
import { Bookmark, BookmarkPage } from './bookmark.model';
import { BodyParam, BodyParams, Controller, Ctx, Get, Post, QueryParam, QueryParams } from '../../modules/rest';
import { UserRole } from '../../types/enums';
import { IncludesTrackArgs } from '../track/track.args';
import { BookmarkCreateArgs, BookmarkFilterArgs, BookmarkOrderArgs, IncludesBookmarkChildrenArgs } from './bookmark.args';
import { IncludesEpisodeArgs } from '../episode/episode.args';
import { PageArgs } from '../base/base.args';
let BookmarkController = class BookmarkController {
    async id(id, bookmarkChildrenArgs, trackArgs, episodeArgs, { orm, engine, user }) {
        return engine.transform.bookmark(orm, await orm.Bookmark.oneOrFail(user.roleAdmin ? { where: { id } } : { where: { id, user: user.id } }), bookmarkChildrenArgs, trackArgs, episodeArgs, user);
    }
    async search(page, bookmarkChildrenArgs, trackArgs, episodeArgs, filter, order, { orm, engine, user }) {
        return await orm.Bookmark.searchTransformFilter(filter, [order], page, user, o => engine.transform.bookmark(orm, o, bookmarkChildrenArgs, trackArgs, episodeArgs, user));
    }
    async create(createArgs, { orm, engine, user }) {
        return await engine.transform.bookmark(orm, await engine.bookmark.create(orm, createArgs.mediaID, user, createArgs.position, createArgs.comment), {}, {}, {}, user);
    }
    async remove(id, { orm, engine, user }) {
        await engine.bookmark.remove(orm, id, user.id);
    }
    async removeByMedia(id, { orm, engine, user }) {
        await engine.bookmark.removeByDest(orm, id, user.id);
    }
};
__decorate([
    Get('/id', () => Bookmark, { description: 'Get a Bookmark by Id', summary: 'Get Bookmark' }),
    __param(0, QueryParam('id', { description: 'Bookmark Id', isID: true })),
    __param(1, QueryParams()),
    __param(2, QueryParams()),
    __param(3, QueryParams()),
    __param(4, Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, IncludesBookmarkChildrenArgs,
        IncludesTrackArgs,
        IncludesEpisodeArgs, Object]),
    __metadata("design:returntype", Promise)
], BookmarkController.prototype, "id", null);
__decorate([
    Get('/search', () => BookmarkPage, { description: 'Search Bookmarks' }),
    __param(0, QueryParams()),
    __param(1, QueryParams()),
    __param(2, QueryParams()),
    __param(3, QueryParams()),
    __param(4, QueryParams()),
    __param(5, QueryParams()),
    __param(6, Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [PageArgs,
        IncludesBookmarkChildrenArgs,
        IncludesTrackArgs,
        IncludesEpisodeArgs,
        BookmarkFilterArgs,
        BookmarkOrderArgs, Object]),
    __metadata("design:returntype", Promise)
], BookmarkController.prototype, "search", null);
__decorate([
    Post('/create', () => Bookmark, { description: 'Create a Bookmark', summary: 'Create Bookmark' }),
    __param(0, BodyParams()),
    __param(1, Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [BookmarkCreateArgs, Object]),
    __metadata("design:returntype", Promise)
], BookmarkController.prototype, "create", null);
__decorate([
    Post('/remove', { description: 'Remove a Bookmark by Id', summary: 'Remove Bookmark' }),
    __param(0, BodyParam('id', { description: 'Bookmark Id', isID: true })),
    __param(1, Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], BookmarkController.prototype, "remove", null);
__decorate([
    Post('/removeByMedia', { description: 'Remove Bookmarks by Media Id [Track/Episode]', summary: 'Remove Bookmarks' }),
    __param(0, BodyParam('id', { description: 'Track or Episode Id', isID: true })),
    __param(1, Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], BookmarkController.prototype, "removeByMedia", null);
BookmarkController = __decorate([
    Controller('/bookmark', { tags: ['Bookmark'], roles: [UserRole.stream] })
], BookmarkController);
export { BookmarkController };
//# sourceMappingURL=bookmark.controller.js.map