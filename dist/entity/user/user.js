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
exports.UserIndexQL = exports.UserIndexGroupQL = exports.UserPageQL = exports.UserQL = exports.User = void 0;
const session_1 = require("../session/session");
const bookmark_1 = require("../bookmark/bookmark");
const playqueue_1 = require("../playqueue/playqueue");
const type_graphql_1 = require("type-graphql");
const state_1 = require("../state/state");
const mikro_orm_1 = require("mikro-orm");
const base_1 = require("../base/base");
const enums_1 = require("../../types/enums");
let User = class User extends base_1.Base {
    constructor() {
        super(...arguments);
        this.sessions = new mikro_orm_1.Collection(this);
        this.bookmarks = new mikro_orm_1.Collection(this);
        this.states = new mikro_orm_1.Collection(this);
    }
};
__decorate([
    type_graphql_1.Field(() => String),
    mikro_orm_1.Property(),
    __metadata("design:type", String)
], User.prototype, "name", void 0);
__decorate([
    mikro_orm_1.Property(),
    __metadata("design:type", String)
], User.prototype, "salt", void 0);
__decorate([
    mikro_orm_1.Property(),
    __metadata("design:type", String)
], User.prototype, "hash", void 0);
__decorate([
    type_graphql_1.Field(() => String),
    mikro_orm_1.Property(),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    type_graphql_1.Field(() => type_graphql_1.Int, { nullable: true }),
    mikro_orm_1.Property(),
    __metadata("design:type", Number)
], User.prototype, "maxBitRate", void 0);
__decorate([
    mikro_orm_1.Property(),
    __metadata("design:type", Boolean)
], User.prototype, "roleAdmin", void 0);
__decorate([
    mikro_orm_1.Property(),
    __metadata("design:type", Boolean)
], User.prototype, "roleStream", void 0);
__decorate([
    mikro_orm_1.Property(),
    __metadata("design:type", Boolean)
], User.prototype, "roleUpload", void 0);
__decorate([
    mikro_orm_1.Property(),
    __metadata("design:type", Boolean)
], User.prototype, "rolePodcast", void 0);
__decorate([
    type_graphql_1.Field(() => [session_1.SessionQL]),
    mikro_orm_1.OneToMany(() => session_1.Session, session => session.user, { orderBy: { expires: mikro_orm_1.QueryOrder.ASC } }),
    __metadata("design:type", mikro_orm_1.Collection)
], User.prototype, "sessions", void 0);
__decorate([
    type_graphql_1.Field(() => [bookmark_1.BookmarkQL]),
    mikro_orm_1.OneToMany(() => bookmark_1.Bookmark, bookmark => bookmark.user, {
        orderBy: {
            track: { path: mikro_orm_1.QueryOrder.ASC, tag: { disc: mikro_orm_1.QueryOrder.ASC, trackNr: mikro_orm_1.QueryOrder.ASC } },
            episode: { path: mikro_orm_1.QueryOrder.ASC, tag: { disc: mikro_orm_1.QueryOrder.ASC, trackNr: mikro_orm_1.QueryOrder.ASC } },
            position: mikro_orm_1.QueryOrder.ASC
        }
    }),
    __metadata("design:type", mikro_orm_1.Collection)
], User.prototype, "bookmarks", void 0);
__decorate([
    type_graphql_1.Field(() => playqueue_1.PlayQueueQL, { nullable: true }),
    mikro_orm_1.OneToOne(() => playqueue_1.PlayQueue),
    __metadata("design:type", playqueue_1.PlayQueue)
], User.prototype, "playQueue", void 0);
__decorate([
    mikro_orm_1.OneToMany(() => state_1.State, state => state.user, { cascade: [mikro_orm_1.Cascade.REMOVE], orderBy: { destType: mikro_orm_1.QueryOrder.ASC } }),
    __metadata("design:type", mikro_orm_1.Collection)
], User.prototype, "states", void 0);
User = __decorate([
    type_graphql_1.ObjectType(),
    mikro_orm_1.Entity()
], User);
exports.User = User;
let UserQL = class UserQL extends User {
};
__decorate([
    type_graphql_1.Field(() => [enums_1.UserRole]),
    __metadata("design:type", Array)
], UserQL.prototype, "roles", void 0);
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