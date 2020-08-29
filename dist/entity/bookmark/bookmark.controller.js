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
exports.BookmarkController = void 0;
const bookmark_model_1 = require("./bookmark.model");
const rest_1 = require("../../modules/rest");
const enums_1 = require("../../types/enums");
const track_args_1 = require("../track/track.args");
const bookmark_args_1 = require("./bookmark.args");
const episode_args_1 = require("../episode/episode.args");
const base_args_1 = require("../base/base.args");
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
    rest_1.Get('/id', () => bookmark_model_1.Bookmark, { description: 'Get a Bookmark by Id', summary: 'Get Bookmark' }),
    __param(0, rest_1.QueryParam('id', { description: 'Bookmark Id', isID: true })),
    __param(1, rest_1.QueryParams()),
    __param(2, rest_1.QueryParams()),
    __param(3, rest_1.QueryParams()),
    __param(4, rest_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, bookmark_args_1.IncludesBookmarkChildrenArgs,
        track_args_1.IncludesTrackArgs,
        episode_args_1.IncludesEpisodeArgs, Object]),
    __metadata("design:returntype", Promise)
], BookmarkController.prototype, "id", null);
__decorate([
    rest_1.Get('/search', () => bookmark_model_1.BookmarkPage, { description: 'Search Bookmarks' }),
    __param(0, rest_1.QueryParams()),
    __param(1, rest_1.QueryParams()),
    __param(2, rest_1.QueryParams()),
    __param(3, rest_1.QueryParams()),
    __param(4, rest_1.QueryParams()),
    __param(5, rest_1.QueryParams()),
    __param(6, rest_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [base_args_1.PageArgs,
        bookmark_args_1.IncludesBookmarkChildrenArgs,
        track_args_1.IncludesTrackArgs,
        episode_args_1.IncludesEpisodeArgs,
        bookmark_args_1.BookmarkFilterArgs,
        bookmark_args_1.BookmarkOrderArgs, Object]),
    __metadata("design:returntype", Promise)
], BookmarkController.prototype, "search", null);
__decorate([
    rest_1.Post('/create', () => bookmark_model_1.Bookmark, { description: 'Create a Bookmark', summary: 'Create Bookmark' }),
    __param(0, rest_1.BodyParams()),
    __param(1, rest_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [bookmark_args_1.BookmarkCreateArgs, Object]),
    __metadata("design:returntype", Promise)
], BookmarkController.prototype, "create", null);
__decorate([
    rest_1.Post('/remove', { description: 'Remove a Bookmark by Id', summary: 'Remove Bookmark' }),
    __param(0, rest_1.BodyParam('id', { description: 'Bookmark Id', isID: true })),
    __param(1, rest_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], BookmarkController.prototype, "remove", null);
__decorate([
    rest_1.Post('/removeByMedia', { description: 'Remove Bookmarks by Media Id [Track/Episode]', summary: 'Remove Bookmarks' }),
    __param(0, rest_1.BodyParam('id', { description: 'Track or Episode Id', isID: true })),
    __param(1, rest_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], BookmarkController.prototype, "removeByMedia", null);
BookmarkController = __decorate([
    rest_1.Controller('/bookmark', { tags: ['Bookmark'], roles: [enums_1.UserRole.stream] })
], BookmarkController);
exports.BookmarkController = BookmarkController;
//# sourceMappingURL=bookmark.controller.js.map