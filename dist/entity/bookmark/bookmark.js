var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { User } from '../user/user.js';
import { Track, TrackQL } from '../track/track.js';
import { Episode, EpisodeQL } from '../episode/episode.js';
import { Field, Int, ObjectType } from 'type-graphql';
import { Entity, ManyToOne, ORM_INT, Property, Reference } from '../../modules/orm/index.js';
import { Base, PaginatedResponse } from '../base/base.js';
let Bookmark = class Bookmark extends Base {
    constructor() {
        super(...arguments);
        this.track = new Reference(this);
        this.episode = new Reference(this);
        this.user = new Reference(this);
    }
};
__decorate([
    Field(() => Int),
    Property(() => ORM_INT),
    __metadata("design:type", Number)
], Bookmark.prototype, "position", void 0);
__decorate([
    Field(() => TrackQL, { nullable: true }),
    ManyToOne(() => Track, track => track.bookmarks, { nullable: true }),
    __metadata("design:type", Reference)
], Bookmark.prototype, "track", void 0);
__decorate([
    Field(() => EpisodeQL, { nullable: true }),
    ManyToOne(() => Episode, episode => episode.bookmarks, { nullable: true }),
    __metadata("design:type", Reference)
], Bookmark.prototype, "episode", void 0);
__decorate([
    ManyToOne(() => User, user => user.bookmarks),
    __metadata("design:type", Reference)
], Bookmark.prototype, "user", void 0);
__decorate([
    Field(() => String, { nullable: true }),
    Property(() => String, { nullable: true }),
    __metadata("design:type", String)
], Bookmark.prototype, "comment", void 0);
Bookmark = __decorate([
    ObjectType(),
    Entity()
], Bookmark);
export { Bookmark };
let BookmarkQL = class BookmarkQL extends Bookmark {
};
BookmarkQL = __decorate([
    ObjectType()
], BookmarkQL);
export { BookmarkQL };
let BookmarkPageQL = class BookmarkPageQL extends PaginatedResponse(Bookmark, BookmarkQL) {
};
BookmarkPageQL = __decorate([
    ObjectType()
], BookmarkPageQL);
export { BookmarkPageQL };
//# sourceMappingURL=bookmark.js.map