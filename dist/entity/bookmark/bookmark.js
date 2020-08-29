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
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookmarkPageQL = exports.BookmarkQL = exports.Bookmark = void 0;
const user_1 = require("../user/user");
const track_1 = require("../track/track");
const episode_1 = require("../episode/episode");
const type_graphql_1 = require("type-graphql");
const orm_1 = require("../../modules/orm");
const base_1 = require("../base/base");
let Bookmark = class Bookmark extends base_1.Base {
    constructor() {
        super(...arguments);
        this.track = new orm_1.Reference(this);
        this.episode = new orm_1.Reference(this);
        this.user = new orm_1.Reference(this);
    }
};
__decorate([
    type_graphql_1.Field(() => type_graphql_1.Float),
    orm_1.Property(() => orm_1.ORM_INT),
    __metadata("design:type", Number)
], Bookmark.prototype, "position", void 0);
__decorate([
    type_graphql_1.Field(() => track_1.TrackQL, { nullable: true }),
    orm_1.ManyToOne(() => track_1.Track, track => track.bookmarks, { nullable: true }),
    __metadata("design:type", orm_1.Reference)
], Bookmark.prototype, "track", void 0);
__decorate([
    type_graphql_1.Field(() => episode_1.EpisodeQL, { nullable: true }),
    orm_1.ManyToOne(() => episode_1.Episode, episode => episode.bookmarks, { nullable: true }),
    __metadata("design:type", orm_1.Reference)
], Bookmark.prototype, "episode", void 0);
__decorate([
    orm_1.ManyToOne(() => user_1.User, user => user.bookmarks),
    __metadata("design:type", orm_1.Reference)
], Bookmark.prototype, "user", void 0);
__decorate([
    type_graphql_1.Field(() => String, { nullable: true }),
    orm_1.Property(() => String, { nullable: true }),
    __metadata("design:type", String)
], Bookmark.prototype, "comment", void 0);
Bookmark = __decorate([
    type_graphql_1.ObjectType(),
    orm_1.Entity()
], Bookmark);
exports.Bookmark = Bookmark;
let BookmarkQL = class BookmarkQL extends Bookmark {
};
BookmarkQL = __decorate([
    type_graphql_1.ObjectType()
], BookmarkQL);
exports.BookmarkQL = BookmarkQL;
let BookmarkPageQL = class BookmarkPageQL extends base_1.PaginatedResponse(Bookmark, BookmarkQL) {
};
BookmarkPageQL = __decorate([
    type_graphql_1.ObjectType()
], BookmarkPageQL);
exports.BookmarkPageQL = BookmarkPageQL;
//# sourceMappingURL=bookmark.js.map