var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { BookmarkOrderFields } from '../../types/enums.js';
import { ArgsType, Field, ID, InputType, Int } from 'type-graphql';
import { OrderByParameters, PaginatedFilterParameters } from '../base/base.parameters.js';
import { examples } from '../../modules/engine/rest/example.consts.js';
import { ObjectParametersType } from '../../modules/rest/decorators/object-parameters-type.js';
import { ObjectField } from '../../modules/rest/decorators/object-field.js';
let IncludesBookmarkChildrenParameters = class IncludesBookmarkChildrenParameters {
};
__decorate([
    ObjectField({ nullable: true, description: 'include track on bookmarks(s)', defaultValue: false, example: false }),
    __metadata("design:type", Boolean)
], IncludesBookmarkChildrenParameters.prototype, "bookmarkIncTrack", void 0);
IncludesBookmarkChildrenParameters = __decorate([
    ObjectParametersType()
], IncludesBookmarkChildrenParameters);
export { IncludesBookmarkChildrenParameters };
let BookmarkCreateParameters = class BookmarkCreateParameters {
};
__decorate([
    ObjectField({ description: 'a track or episode id', isID: true }),
    __metadata("design:type", String)
], BookmarkCreateParameters.prototype, "mediaID", void 0);
__decorate([
    ObjectField({ description: 'the position of the bookmark (in ms)', min: 0, example: 5555 }),
    __metadata("design:type", Number)
], BookmarkCreateParameters.prototype, "position", void 0);
__decorate([
    ObjectField({ description: 'a comment', example: 'Awesome!' }),
    __metadata("design:type", String)
], BookmarkCreateParameters.prototype, "comment", void 0);
BookmarkCreateParameters = __decorate([
    ObjectParametersType()
], BookmarkCreateParameters);
export { BookmarkCreateParameters };
let BookmarkFilterParameters = class BookmarkFilterParameters {
};
__decorate([
    Field(() => String, { nullable: true }),
    ObjectField({ nullable: true, description: 'filter by Search Query', example: 'awesome position' }),
    __metadata("design:type", String)
], BookmarkFilterParameters.prototype, "query", void 0);
__decorate([
    Field(() => String, { nullable: true }),
    ObjectField({ nullable: true, description: 'filter by Comment', example: 'This Awesome Position!' }),
    __metadata("design:type", String)
], BookmarkFilterParameters.prototype, "comment", void 0);
__decorate([
    Field(() => [ID], { nullable: true }),
    ObjectField(() => [String], { nullable: true, description: 'filter by Bookmark Ids', isID: true }),
    __metadata("design:type", Array)
], BookmarkFilterParameters.prototype, "ids", void 0);
__decorate([
    Field(() => [ID], { nullable: true }),
    ObjectField(() => [String], { nullable: true, description: 'filter by Track Ids', isID: true }),
    __metadata("design:type", Array)
], BookmarkFilterParameters.prototype, "trackIDs", void 0);
__decorate([
    Field(() => [ID], { nullable: true }),
    ObjectField(() => [String], { nullable: true, description: 'filter by Episode Ids', isID: true }),
    __metadata("design:type", Array)
], BookmarkFilterParameters.prototype, "episodeIDs", void 0);
__decorate([
    Field(() => Int, { nullable: true }),
    ObjectField({ nullable: true, description: 'filter by Creation timestamp', min: 0, example: examples.timestamp }),
    __metadata("design:type", Number)
], BookmarkFilterParameters.prototype, "since", void 0);
__decorate([
    Field(() => [ID], { nullable: true }),
    ObjectField(() => [String], { nullable: true, description: 'filter by User Ids', isID: true }),
    __metadata("design:type", Array)
], BookmarkFilterParameters.prototype, "userIDs", void 0);
BookmarkFilterParameters = __decorate([
    InputType(),
    ObjectParametersType()
], BookmarkFilterParameters);
export { BookmarkFilterParameters };
let BookmarkFilterParametersQL = class BookmarkFilterParametersQL extends BookmarkFilterParameters {
};
BookmarkFilterParametersQL = __decorate([
    InputType()
], BookmarkFilterParametersQL);
export { BookmarkFilterParametersQL };
let BookmarkOrderParameters = class BookmarkOrderParameters extends OrderByParameters {
};
__decorate([
    Field(() => BookmarkOrderFields, { nullable: true }),
    ObjectField(() => BookmarkOrderFields, { nullable: true, description: 'order by field' }),
    __metadata("design:type", String)
], BookmarkOrderParameters.prototype, "orderBy", void 0);
BookmarkOrderParameters = __decorate([
    InputType(),
    ObjectParametersType()
], BookmarkOrderParameters);
export { BookmarkOrderParameters };
let BookmarkOrderParametersQL = class BookmarkOrderParametersQL extends BookmarkOrderParameters {
};
BookmarkOrderParametersQL = __decorate([
    InputType()
], BookmarkOrderParametersQL);
export { BookmarkOrderParametersQL };
let BookmarksPageParametersQL = class BookmarksPageParametersQL extends PaginatedFilterParameters(BookmarkFilterParametersQL, BookmarkOrderParametersQL) {
};
BookmarksPageParametersQL = __decorate([
    ArgsType()
], BookmarksPageParametersQL);
export { BookmarksPageParametersQL };
let BookmarksParameters = class BookmarksParameters extends BookmarksPageParametersQL {
};
BookmarksParameters = __decorate([
    ArgsType()
], BookmarksParameters);
export { BookmarksParameters };
//# sourceMappingURL=bookmark.parameters.js.map