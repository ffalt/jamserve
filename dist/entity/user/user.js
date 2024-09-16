var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { PlayQueueQL } from '../playqueue/playqueue.js';
import { Field, Int, ObjectType } from 'type-graphql';
import { Collection, Entity, OneToMany, OneToOne, ORM_INT, Property, Reference } from '../../modules/orm/index.js';
import { Base, Index, IndexGroup, PaginatedResponse } from '../base/base.js';
import { BookmarkOrderFields, SessionOrderFields, UserRole } from '../../types/enums.js';
import { UserStatsQL } from '../stats/stats.js';
let User = class User extends Base {
    constructor() {
        super(...arguments);
        this.sessions = new Collection(this);
        this.playQueue = new Reference(this);
        this.bookmarks = new Collection(this);
        this.playlists = new Collection(this);
        this.states = new Collection(this);
    }
};
__decorate([
    Field(() => String),
    Property(() => String),
    __metadata("design:type", String)
], User.prototype, "name", void 0);
__decorate([
    Property(() => String),
    __metadata("design:type", String)
], User.prototype, "hash", void 0);
__decorate([
    Field(() => String),
    Property(() => String),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    Field(() => Int, { nullable: true }),
    Property(() => ORM_INT, { nullable: true }),
    __metadata("design:type", Number)
], User.prototype, "maxBitRate", void 0);
__decorate([
    Property(() => Boolean),
    __metadata("design:type", Boolean)
], User.prototype, "roleAdmin", void 0);
__decorate([
    Property(() => Boolean),
    __metadata("design:type", Boolean)
], User.prototype, "roleStream", void 0);
__decorate([
    Property(() => Boolean),
    __metadata("design:type", Boolean)
], User.prototype, "roleUpload", void 0);
__decorate([
    Property(() => Boolean),
    __metadata("design:type", Boolean)
], User.prototype, "rolePodcast", void 0);
__decorate([
    OneToMany(() => 'Session', session => session.user, { order: [{ orderBy: SessionOrderFields.expires }] }),
    __metadata("design:type", Collection)
], User.prototype, "sessions", void 0);
__decorate([
    Field(() => PlayQueueQL, { nullable: true }),
    OneToOne(() => 'PlayQueue', playQueue => playQueue.user, { nullable: true }),
    __metadata("design:type", Reference)
], User.prototype, "playQueue", void 0);
__decorate([
    OneToMany(() => 'Bookmark', bookmark => bookmark.user, { order: [{ orderBy: BookmarkOrderFields.media }, { orderBy: BookmarkOrderFields.position }] }),
    __metadata("design:type", Collection)
], User.prototype, "bookmarks", void 0);
__decorate([
    OneToMany(() => 'Playlist', playlist => playlist.user),
    __metadata("design:type", Collection)
], User.prototype, "playlists", void 0);
__decorate([
    OneToMany(() => 'State', state => state.user),
    __metadata("design:type", Collection)
], User.prototype, "states", void 0);
User = __decorate([
    ObjectType(),
    Entity()
], User);
export { User };
let UserFavoritesQL = class UserFavoritesQL {
};
UserFavoritesQL = __decorate([
    ObjectType()
], UserFavoritesQL);
export { UserFavoritesQL };
let UserQL = class UserQL extends User {
};
__decorate([
    Field(() => [UserRole]),
    __metadata("design:type", Array)
], UserQL.prototype, "roles", void 0);
__decorate([
    Field(() => UserFavoritesQL),
    __metadata("design:type", UserFavoritesQL)
], UserQL.prototype, "favorites", void 0);
__decorate([
    Field(() => UserStatsQL),
    __metadata("design:type", UserStatsQL)
], UserQL.prototype, "stats", void 0);
UserQL = __decorate([
    ObjectType()
], UserQL);
export { UserQL };
let UserPageQL = class UserPageQL extends PaginatedResponse(User, UserQL) {
};
UserPageQL = __decorate([
    ObjectType()
], UserPageQL);
export { UserPageQL };
let UserIndexGroupQL = class UserIndexGroupQL extends IndexGroup(User, UserQL) {
};
UserIndexGroupQL = __decorate([
    ObjectType()
], UserIndexGroupQL);
export { UserIndexGroupQL };
let UserIndexQL = class UserIndexQL extends Index(UserIndexGroupQL) {
};
UserIndexQL = __decorate([
    ObjectType()
], UserIndexQL);
export { UserIndexQL };
//# sourceMappingURL=user.js.map