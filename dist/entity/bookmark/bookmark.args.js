var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { ObjField, ObjParamsType } from '../../modules/rest/decorators';
import { BookmarkOrderFields } from '../../types/enums';
import { ArgsType, Field, Float, ID, InputType } from 'type-graphql';
import { OrderByArgs, PaginatedFilterArgs } from '../base/base.args';
import { examples } from '../../modules/engine/rest/example.consts';
let IncludesBookmarkChildrenArgs = class IncludesBookmarkChildrenArgs {
};
__decorate([
    ObjField({ nullable: true, description: 'include track on bookmarks(s)', defaultValue: false, example: false }),
    __metadata("design:type", Boolean)
], IncludesBookmarkChildrenArgs.prototype, "bookmarkIncTrack", void 0);
IncludesBookmarkChildrenArgs = __decorate([
    ObjParamsType()
], IncludesBookmarkChildrenArgs);
export { IncludesBookmarkChildrenArgs };
let BookmarkCreateArgs = class BookmarkCreateArgs {
};
__decorate([
    ObjField({ description: 'a track or episode id', isID: true }),
    __metadata("design:type", String)
], BookmarkCreateArgs.prototype, "mediaID", void 0);
__decorate([
    ObjField({ description: 'the position of the bookmark (in ms)', min: 0, example: 5555 }),
    __metadata("design:type", Number)
], BookmarkCreateArgs.prototype, "position", void 0);
__decorate([
    ObjField({ description: 'a comment', example: 'Awesome!' }),
    __metadata("design:type", String)
], BookmarkCreateArgs.prototype, "comment", void 0);
BookmarkCreateArgs = __decorate([
    ObjParamsType()
], BookmarkCreateArgs);
export { BookmarkCreateArgs };
let BookmarkFilterArgs = class BookmarkFilterArgs {
};
__decorate([
    Field(() => String, { nullable: true }),
    ObjField({ nullable: true, description: 'filter by Search Query', example: 'awesome position' }),
    __metadata("design:type", String)
], BookmarkFilterArgs.prototype, "query", void 0);
__decorate([
    Field(() => String, { nullable: true }),
    ObjField({ nullable: true, description: 'filter by Comment', example: 'This Awesome Position!' }),
    __metadata("design:type", String)
], BookmarkFilterArgs.prototype, "comment", void 0);
__decorate([
    Field(() => [ID], { nullable: true }),
    ObjField(() => [String], { nullable: true, description: 'filter by Bookmark Ids', isID: true }),
    __metadata("design:type", Array)
], BookmarkFilterArgs.prototype, "ids", void 0);
__decorate([
    Field(() => [ID], { nullable: true }),
    ObjField(() => [String], { nullable: true, description: 'filter by Track Ids', isID: true }),
    __metadata("design:type", Array)
], BookmarkFilterArgs.prototype, "trackIDs", void 0);
__decorate([
    Field(() => [ID], { nullable: true }),
    ObjField(() => [String], { nullable: true, description: 'filter by Episode Ids', isID: true }),
    __metadata("design:type", Array)
], BookmarkFilterArgs.prototype, "episodeIDs", void 0);
__decorate([
    Field(() => Float, { nullable: true }),
    ObjField({ nullable: true, description: 'filter by Creation timestamp', min: 0, example: examples.timestamp }),
    __metadata("design:type", Number)
], BookmarkFilterArgs.prototype, "since", void 0);
__decorate([
    Field(() => [ID], { nullable: true }),
    ObjField(() => [String], { nullable: true, description: 'filter by User Ids', isID: true }),
    __metadata("design:type", Array)
], BookmarkFilterArgs.prototype, "userIDs", void 0);
BookmarkFilterArgs = __decorate([
    InputType(),
    ObjParamsType()
], BookmarkFilterArgs);
export { BookmarkFilterArgs };
let BookmarkFilterArgsQL = class BookmarkFilterArgsQL extends BookmarkFilterArgs {
};
BookmarkFilterArgsQL = __decorate([
    InputType()
], BookmarkFilterArgsQL);
export { BookmarkFilterArgsQL };
let BookmarkOrderArgs = class BookmarkOrderArgs extends OrderByArgs {
};
__decorate([
    Field(() => BookmarkOrderFields, { nullable: true }),
    ObjField(() => BookmarkOrderFields, { nullable: true, description: 'order by field' }),
    __metadata("design:type", String)
], BookmarkOrderArgs.prototype, "orderBy", void 0);
BookmarkOrderArgs = __decorate([
    InputType(),
    ObjParamsType()
], BookmarkOrderArgs);
export { BookmarkOrderArgs };
let BookmarkOrderArgsQL = class BookmarkOrderArgsQL extends BookmarkOrderArgs {
};
BookmarkOrderArgsQL = __decorate([
    InputType()
], BookmarkOrderArgsQL);
export { BookmarkOrderArgsQL };
let BookmarksPageArgsQL = class BookmarksPageArgsQL extends PaginatedFilterArgs(BookmarkFilterArgsQL, BookmarkOrderArgsQL) {
};
BookmarksPageArgsQL = __decorate([
    ArgsType()
], BookmarksPageArgsQL);
export { BookmarksPageArgsQL };
let BookmarksArgs = class BookmarksArgs extends BookmarksPageArgsQL {
};
BookmarksArgs = __decorate([
    ArgsType()
], BookmarksArgs);
export { BookmarksArgs };
//# sourceMappingURL=bookmark.args.js.map