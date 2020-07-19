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
exports.BookmarksArgs = exports.BookmarkOrderArgsQL = exports.BookmarkOrderArgs = exports.BookmarkFilterArgsQL = exports.BookmarkFilterArgs = exports.BookmarkCreateArgs = exports.IncludesBookmarkChildrenArgs = void 0;
const decorators_1 = require("../../modules/rest/decorators");
const enums_1 = require("../../types/enums");
const type_graphql_1 = require("type-graphql");
const base_args_1 = require("../base/base.args");
const example_consts_1 = require("../../modules/engine/rest/example.consts");
let IncludesBookmarkChildrenArgs = class IncludesBookmarkChildrenArgs {
};
__decorate([
    decorators_1.ObjField({ nullable: true, description: 'include track on bookmarks(s)', defaultValue: false, example: false }),
    __metadata("design:type", Boolean)
], IncludesBookmarkChildrenArgs.prototype, "bookmarkIncTrack", void 0);
IncludesBookmarkChildrenArgs = __decorate([
    decorators_1.ObjParamsType()
], IncludesBookmarkChildrenArgs);
exports.IncludesBookmarkChildrenArgs = IncludesBookmarkChildrenArgs;
let BookmarkCreateArgs = class BookmarkCreateArgs {
};
__decorate([
    decorators_1.ObjField({ description: 'a track or episode id', isID: true }),
    __metadata("design:type", String)
], BookmarkCreateArgs.prototype, "mediaID", void 0);
__decorate([
    decorators_1.ObjField({ description: 'the position of the bookmark (in ms)', min: 0, example: 5555 }),
    __metadata("design:type", Number)
], BookmarkCreateArgs.prototype, "position", void 0);
__decorate([
    decorators_1.ObjField({ description: 'a comment', example: 'Awesome!' }),
    __metadata("design:type", String)
], BookmarkCreateArgs.prototype, "comment", void 0);
BookmarkCreateArgs = __decorate([
    decorators_1.ObjParamsType()
], BookmarkCreateArgs);
exports.BookmarkCreateArgs = BookmarkCreateArgs;
let BookmarkFilterArgs = class BookmarkFilterArgs {
};
__decorate([
    type_graphql_1.Field(() => String, { nullable: true }),
    decorators_1.ObjField({ nullable: true, description: 'filter by Search Query', example: 'awesome position' }),
    __metadata("design:type", String)
], BookmarkFilterArgs.prototype, "query", void 0);
__decorate([
    type_graphql_1.Field(() => String, { nullable: true }),
    decorators_1.ObjField({ nullable: true, description: 'filter by Comment', example: 'This Awesome Position!' }),
    __metadata("design:type", String)
], BookmarkFilterArgs.prototype, "comment", void 0);
__decorate([
    type_graphql_1.Field(() => [type_graphql_1.ID], { nullable: true }),
    decorators_1.ObjField(() => [String], { nullable: true, description: 'filter by Bookmark Ids', isID: true }),
    __metadata("design:type", Array)
], BookmarkFilterArgs.prototype, "ids", void 0);
__decorate([
    type_graphql_1.Field(() => [type_graphql_1.ID], { nullable: true }),
    decorators_1.ObjField(() => [String], { nullable: true, description: 'filter by Track Ids', isID: true }),
    __metadata("design:type", Array)
], BookmarkFilterArgs.prototype, "trackIDs", void 0);
__decorate([
    type_graphql_1.Field(() => [type_graphql_1.ID], { nullable: true }),
    decorators_1.ObjField(() => [String], { nullable: true, description: 'filter by Episode Ids', isID: true }),
    __metadata("design:type", Array)
], BookmarkFilterArgs.prototype, "episodeIDs", void 0);
__decorate([
    type_graphql_1.Field(() => type_graphql_1.Int, { nullable: true }),
    decorators_1.ObjField({ nullable: true, description: 'filter by Creation timestamp', min: 0, example: example_consts_1.examples.timestamp }),
    __metadata("design:type", Number)
], BookmarkFilterArgs.prototype, "since", void 0);
BookmarkFilterArgs = __decorate([
    type_graphql_1.InputType(),
    decorators_1.ObjParamsType()
], BookmarkFilterArgs);
exports.BookmarkFilterArgs = BookmarkFilterArgs;
let BookmarkFilterArgsQL = class BookmarkFilterArgsQL extends BookmarkFilterArgs {
};
BookmarkFilterArgsQL = __decorate([
    type_graphql_1.InputType()
], BookmarkFilterArgsQL);
exports.BookmarkFilterArgsQL = BookmarkFilterArgsQL;
let BookmarkOrderArgs = class BookmarkOrderArgs extends base_args_1.OrderByArgs {
};
__decorate([
    type_graphql_1.Field(() => enums_1.BookmarkOrderFields, { nullable: true }),
    decorators_1.ObjField(() => enums_1.BookmarkOrderFields, { nullable: true, description: 'order by field' }),
    __metadata("design:type", String)
], BookmarkOrderArgs.prototype, "orderBy", void 0);
BookmarkOrderArgs = __decorate([
    type_graphql_1.InputType(),
    decorators_1.ObjParamsType()
], BookmarkOrderArgs);
exports.BookmarkOrderArgs = BookmarkOrderArgs;
let BookmarkOrderArgsQL = class BookmarkOrderArgsQL extends BookmarkOrderArgs {
};
BookmarkOrderArgsQL = __decorate([
    type_graphql_1.InputType()
], BookmarkOrderArgsQL);
exports.BookmarkOrderArgsQL = BookmarkOrderArgsQL;
let BookmarksArgs = class BookmarksArgs extends base_args_1.PaginatedArgs(BookmarkFilterArgsQL, BookmarkOrderArgsQL) {
};
BookmarksArgs = __decorate([
    type_graphql_1.ArgsType()
], BookmarksArgs);
exports.BookmarksArgs = BookmarksArgs;
//# sourceMappingURL=bookmark.args.js.map