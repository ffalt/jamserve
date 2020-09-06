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
exports.UserIndexQL = exports.UserIndexGroupQL = exports.UserPageQL = exports.UserQL = exports.UserFavoritesQL = exports.User = void 0;
const session_1 = require("../session/session");
const bookmark_1 = require("../bookmark/bookmark");
const playqueue_1 = require("../playqueue/playqueue");
const type_graphql_1 = require("type-graphql");
const state_1 = require("../state/state");
const orm_1 = require("../../modules/orm");
const base_1 = require("../base/base");
const enums_1 = require("../../types/enums");
const playlist_1 = require("../playlist/playlist");
const stats_1 = require("../stats/stats");
let User = class User extends base_1.Base {
    constructor() {
        super(...arguments);
        this.sessions = new orm_1.Collection(this);
        this.playQueue = new orm_1.Reference(this);
        this.bookmarks = new orm_1.Collection(this);
        this.playlists = new orm_1.Collection(this);
        this.states = new orm_1.Collection(this);
    }
};
__decorate([
    type_graphql_1.Field(() => String),
    orm_1.Property(() => String),
    __metadata("design:type", String)
], User.prototype, "name", void 0);
__decorate([
    orm_1.Property(() => String),
    __metadata("design:type", String)
], User.prototype, "salt", void 0);
__decorate([
    orm_1.Property(() => String),
    __metadata("design:type", String)
], User.prototype, "hash", void 0);
__decorate([
    type_graphql_1.Field(() => String),
    orm_1.Property(() => String),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    type_graphql_1.Field(() => type_graphql_1.Int, { nullable: true }),
    orm_1.Property(() => orm_1.ORM_INT, { nullable: true }),
    __metadata("design:type", Number)
], User.prototype, "maxBitRate", void 0);
__decorate([
    orm_1.Property(() => Boolean),
    __metadata("design:type", Boolean)
], User.prototype, "roleAdmin", void 0);
__decorate([
    orm_1.Property(() => Boolean),
    __metadata("design:type", Boolean)
], User.prototype, "roleStream", void 0);
__decorate([
    orm_1.Property(() => Boolean),
    __metadata("design:type", Boolean)
], User.prototype, "roleUpload", void 0);
__decorate([
    orm_1.Property(() => Boolean),
    __metadata("design:type", Boolean)
], User.prototype, "rolePodcast", void 0);
__decorate([
    orm_1.OneToMany(() => session_1.Session, session => session.user, { order: [{ orderBy: enums_1.SessionOrderFields.expires }] }),
    __metadata("design:type", orm_1.Collection)
], User.prototype, "sessions", void 0);
__decorate([
    type_graphql_1.Field(() => playqueue_1.PlayQueueQL, { nullable: true }),
    orm_1.OneToOne(() => playqueue_1.PlayQueue, playQueue => playQueue.user, { nullable: true }),
    __metadata("design:type", orm_1.Reference)
], User.prototype, "playQueue", void 0);
__decorate([
    orm_1.OneToMany(() => bookmark_1.Bookmark, bookmark => bookmark.user, { order: [{ orderBy: enums_1.BookmarkOrderFields.media }, { orderBy: enums_1.BookmarkOrderFields.position }] }),
    __metadata("design:type", orm_1.Collection)
], User.prototype, "bookmarks", void 0);
__decorate([
    orm_1.OneToMany(() => playlist_1.Playlist, playlist => playlist.user),
    __metadata("design:type", orm_1.Collection)
], User.prototype, "playlists", void 0);
__decorate([
    orm_1.OneToMany(() => state_1.State, state => state.user),
    __metadata("design:type", orm_1.Collection)
], User.prototype, "states", void 0);
User = __decorate([
    type_graphql_1.ObjectType(),
    orm_1.Entity()
], User);
exports.User = User;
let UserFavoritesQL = class UserFavoritesQL {
};
UserFavoritesQL = __decorate([
    type_graphql_1.ObjectType()
], UserFavoritesQL);
exports.UserFavoritesQL = UserFavoritesQL;
let UserQL = class UserQL extends User {
};
__decorate([
    type_graphql_1.Field(() => [enums_1.UserRole]),
    __metadata("design:type", Array)
], UserQL.prototype, "roles", void 0);
__decorate([
    type_graphql_1.Field(() => UserFavoritesQL),
    __metadata("design:type", UserFavoritesQL)
], UserQL.prototype, "favorites", void 0);
__decorate([
    type_graphql_1.Field(() => stats_1.UserStatsQL),
    __metadata("design:type", stats_1.UserStatsQL)
], UserQL.prototype, "stats", void 0);
UserQL = __decorate([
    type_graphql_1.ObjectType()
], UserQL);
exports.UserQL = UserQL;
let UserPageQL = class UserPageQL extends base_1.PaginatedResponse(User, UserQL) {
};
UserPageQL = __decorate([
    type_graphql_1.ObjectType()
], UserPageQL);
exports.UserPageQL = UserPageQL;
let UserIndexGroupQL = class UserIndexGroupQL extends base_1.IndexGroup(User, UserQL) {
};
UserIndexGroupQL = __decorate([
    type_graphql_1.ObjectType()
], UserIndexGroupQL);
exports.UserIndexGroupQL = UserIndexGroupQL;
let UserIndexQL = class UserIndexQL extends base_1.Index(UserIndexGroupQL) {
};
UserIndexQL = __decorate([
    type_graphql_1.ObjectType()
], UserIndexQL);
exports.UserIndexQL = UserIndexQL;
//# sourceMappingURL=user.js.map