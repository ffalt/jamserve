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
import { Root as GQLRoot, Arg, Args, Ctx, FieldResolver, ID, Query, Resolver } from 'type-graphql';
import { Bookmark, BookmarkPageQL, BookmarkQL } from './bookmark.js';
import { TrackQL } from '../track/track.js';
import { EpisodeQL } from '../episode/episode.js';
import { BookmarksParameters } from './bookmark.parameters.js';
let BookmarkResolver = class BookmarkResolver {
    async bookmark(id, { orm, user }) {
        return await orm.Bookmark.oneOrFail(user.roleAdmin ? { where: { id: id } } : { where: { id: id, user: user.id } });
    }
    async bookmarks({ filter, page, order }, { orm, user }) {
        return await orm.Bookmark.searchFilter(filter, order, page, user);
    }
    async track(bookmark) {
        return bookmark.track.get();
    }
    async episode(bookmark) {
        return bookmark.episode.get();
    }
};
__decorate([
    Query(() => BookmarkQL, { description: 'Get a Bookmark by Id' }),
    __param(0, Arg('id', () => ID)),
    __param(1, Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], BookmarkResolver.prototype, "bookmark", null);
__decorate([
    Query(() => BookmarkPageQL, { description: 'Search Bookmarks' }),
    __param(0, Args()),
    __param(1, Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [BookmarksParameters, Object]),
    __metadata("design:returntype", Promise)
], BookmarkResolver.prototype, "bookmarks", null);
__decorate([
    FieldResolver(() => TrackQL, { nullable: true }),
    __param(0, GQLRoot()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Bookmark]),
    __metadata("design:returntype", Promise)
], BookmarkResolver.prototype, "track", null);
__decorate([
    FieldResolver(() => EpisodeQL, { nullable: true }),
    __param(0, GQLRoot()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Bookmark]),
    __metadata("design:returntype", Promise)
], BookmarkResolver.prototype, "episode", null);
BookmarkResolver = __decorate([
    Resolver(BookmarkQL)
], BookmarkResolver);
export { BookmarkResolver };
//# sourceMappingURL=bookmark.resolver.js.map