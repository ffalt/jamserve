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
exports.BookmarkPage = exports.Bookmark = exports.BookmarkBase = void 0;
const track_model_1 = require("../track/track.model");
const decorators_1 = require("../../modules/rest/decorators");
const example_consts_1 = require("../../modules/engine/rest/example.consts");
const episode_model_1 = require("../episode/episode.model");
const base_model_1 = require("../base/base.model");
let BookmarkBase = class BookmarkBase {
};
__decorate([
    decorators_1.ObjField({ description: 'ID', isID: true }),
    __metadata("design:type", String)
], BookmarkBase.prototype, "id", void 0);
__decorate([
    decorators_1.ObjField({ description: 'Track Id', isID: true }),
    __metadata("design:type", String)
], BookmarkBase.prototype, "trackID", void 0);
__decorate([
    decorators_1.ObjField({ description: 'Episode Id', isID: true }),
    __metadata("design:type", String)
], BookmarkBase.prototype, "episodeID", void 0);
__decorate([
    decorators_1.ObjField({ description: 'Position in Audio', isID: true }),
    __metadata("design:type", Number)
], BookmarkBase.prototype, "position", void 0);
__decorate([
    decorators_1.ObjField({ description: 'Comment', example: 'awesome!' }),
    __metadata("design:type", String)
], BookmarkBase.prototype, "comment", void 0);
__decorate([
    decorators_1.ObjField({ description: 'Created Timestamp', min: 0, example: example_consts_1.examples.timestamp }),
    __metadata("design:type", Number)
], BookmarkBase.prototype, "created", void 0);
__decorate([
    decorators_1.ObjField({ description: 'Changed Timestamp', min: 0, example: example_consts_1.examples.timestamp }),
    __metadata("design:type", Number)
], BookmarkBase.prototype, "changed", void 0);
BookmarkBase = __decorate([
    decorators_1.ResultType({ description: 'Bookmark Base' })
], BookmarkBase);
exports.BookmarkBase = BookmarkBase;
let Bookmark = class Bookmark extends BookmarkBase {
};
__decorate([
    decorators_1.ObjField(() => track_model_1.TrackBase, { nullable: true, description: 'The bookmarked Track' }),
    __metadata("design:type", track_model_1.TrackBase)
], Bookmark.prototype, "track", void 0);
__decorate([
    decorators_1.ObjField(() => episode_model_1.EpisodeBase, { nullable: true, description: 'The bookmarked Episode' }),
    __metadata("design:type", episode_model_1.EpisodeBase)
], Bookmark.prototype, "episode", void 0);
Bookmark = __decorate([
    decorators_1.ResultType({ description: 'Bookmark' })
], Bookmark);
exports.Bookmark = Bookmark;
let BookmarkPage = class BookmarkPage extends base_model_1.Page {
};
__decorate([
    decorators_1.ObjField(() => Bookmark, { description: 'List of Bookmark' }),
    __metadata("design:type", Array)
], BookmarkPage.prototype, "items", void 0);
BookmarkPage = __decorate([
    decorators_1.ResultType({ description: 'Bookmark Page' })
], BookmarkPage);
exports.BookmarkPage = BookmarkPage;
//# sourceMappingURL=bookmark.model.js.map