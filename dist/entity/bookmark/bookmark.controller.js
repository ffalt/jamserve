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
import { Bookmark, BookmarkPage } from './bookmark.model.js';
import { UserRole } from '../../types/enums.js';
import { IncludesTrackParameters } from '../track/track.parameters.js';
import { BookmarkCreateParameters, BookmarkFilterParameters, BookmarkOrderParameters, IncludesBookmarkChildrenParameters } from './bookmark.parameters.js';
import { IncludesEpisodeParameters } from '../episode/episode.parameters.js';
import { PageParameters } from '../base/base.parameters.js';
import { Controller } from '../../modules/rest/decorators/controller.js';
import { Get } from '../../modules/rest/decorators/get.js';
import { QueryParameter } from '../../modules/rest/decorators/query-parameter.js';
import { QueryParameters } from '../../modules/rest/decorators/query-parameters.js';
import { RestContext } from '../../modules/rest/decorators/rest-context.js';
import { Post } from '../../modules/rest/decorators/post.js';
import { BodyParameters } from '../../modules/rest/decorators/body-parameters.js';
import { BodyParameter } from '../../modules/rest/decorators/body-parameter.js';
let BookmarkController = class BookmarkController {
    async id(id, childrenParameters, trackParameters, episodeParameters, { orm, engine, user }) {
        return engine.transform.bookmark(orm, await orm.Bookmark.oneOrFail(user.roleAdmin ? { where: { id } } : { where: { id, user: user.id } }), childrenParameters, trackParameters, episodeParameters, user);
    }
    async search(page, childrenParameters, trackParameters, episodeParameters, filter, order, { orm, engine, user }) {
        return await orm.Bookmark.searchTransformFilter(filter, [order], page, user, o => engine.transform.bookmark(orm, o, childrenParameters, trackParameters, episodeParameters, user));
    }
    async create(parameters, { orm, engine, user }) {
        return await engine.transform.bookmark(orm, await engine.bookmark.create(orm, parameters.mediaID, user, parameters.position, parameters.comment), {}, {}, {}, user);
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
    __param(0, QueryParameter('id', { description: 'Bookmark Id', isID: true })),
    __param(1, QueryParameters()),
    __param(2, QueryParameters()),
    __param(3, QueryParameters()),
    __param(4, RestContext()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, IncludesBookmarkChildrenParameters,
        IncludesTrackParameters,
        IncludesEpisodeParameters, Object]),
    __metadata("design:returntype", Promise)
], BookmarkController.prototype, "id", null);
__decorate([
    Get('/search', () => BookmarkPage, { description: 'Search Bookmarks' }),
    __param(0, QueryParameters()),
    __param(1, QueryParameters()),
    __param(2, QueryParameters()),
    __param(3, QueryParameters()),
    __param(4, QueryParameters()),
    __param(5, QueryParameters()),
    __param(6, RestContext()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [PageParameters,
        IncludesBookmarkChildrenParameters,
        IncludesTrackParameters,
        IncludesEpisodeParameters,
        BookmarkFilterParameters,
        BookmarkOrderParameters, Object]),
    __metadata("design:returntype", Promise)
], BookmarkController.prototype, "search", null);
__decorate([
    Post('/create', () => Bookmark, { description: 'Create a Bookmark', summary: 'Create Bookmark' }),
    __param(0, BodyParameters()),
    __param(1, RestContext()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [BookmarkCreateParameters, Object]),
    __metadata("design:returntype", Promise)
], BookmarkController.prototype, "create", null);
__decorate([
    Post('/remove', { description: 'Remove a Bookmark by Id', summary: 'Remove Bookmark' }),
    __param(0, BodyParameter('id', { description: 'Bookmark Id', isID: true })),
    __param(1, RestContext()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], BookmarkController.prototype, "remove", null);
__decorate([
    Post('/removeByMedia', { description: 'Remove Bookmarks by Media Id [Track/Episode]', summary: 'Remove Bookmarks' }),
    __param(0, BodyParameter('id', { description: 'Track or Episode Id', isID: true })),
    __param(1, RestContext()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], BookmarkController.prototype, "removeByMedia", null);
BookmarkController = __decorate([
    Controller('/bookmark', { tags: ['Bookmark'], roles: [UserRole.stream] })
], BookmarkController);
export { BookmarkController };
//# sourceMappingURL=bookmark.controller.js.map