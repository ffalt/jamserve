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
exports.BookmarkResolver = void 0;
const type_graphql_1 = require("type-graphql");
const bookmark_1 = require("./bookmark");
const track_1 = require("../track/track");
const Root_1 = require("type-graphql/dist/decorators/Root");
const episode_1 = require("../episode/episode");
const bookmark_args_1 = require("./bookmark.args");
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
    type_graphql_1.Query(() => bookmark_1.BookmarkQL, { description: 'Get a Bookmark by Id' }),
    __param(0, type_graphql_1.Arg('id', () => type_graphql_1.ID)), __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], BookmarkResolver.prototype, "bookmark", null);
__decorate([
    type_graphql_1.Query(() => bookmark_1.BookmarkPageQL, { description: 'Search Bookmarks' }),
    __param(0, type_graphql_1.Args()), __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [bookmark_args_1.BookmarksArgs, Object]),
    __metadata("design:returntype", Promise)
], BookmarkResolver.prototype, "bookmarks", null);
__decorate([
    type_graphql_1.FieldResolver(() => track_1.TrackQL, { nullable: true }),
    __param(0, Root_1.Root()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [bookmark_1.Bookmark]),
    __metadata("design:returntype", Promise)
], BookmarkResolver.prototype, "track", null);
__decorate([
    type_graphql_1.FieldResolver(() => episode_1.EpisodeQL, { nullable: true }),
    __param(0, Root_1.Root()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [bookmark_1.Bookmark]),
    __metadata("design:returntype", Promise)
], BookmarkResolver.prototype, "episode", null);
BookmarkResolver = __decorate([
    type_graphql_1.Resolver(bookmark_1.BookmarkQL)
], BookmarkResolver);
exports.BookmarkResolver = BookmarkResolver;
//# sourceMappingURL=bookmark.resolver.js.map