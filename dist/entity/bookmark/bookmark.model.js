var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { TrackBase } from '../track/track.model.js';
import { examples } from '../../modules/engine/rest/example.consts.js';
import { EpisodeBase } from '../episode/episode.model.js';
import { Page } from '../base/base.model.js';
import { ResultType } from '../../modules/rest/decorators/result-type.js';
import { ObjectField } from '../../modules/rest/decorators/object-field.js';
let BookmarkBase = class BookmarkBase {
};
__decorate([
    ObjectField({ description: 'ID', isID: true }),
    __metadata("design:type", String)
], BookmarkBase.prototype, "id", void 0);
__decorate([
    ObjectField({ description: 'Track Id', isID: true }),
    __metadata("design:type", String)
], BookmarkBase.prototype, "trackID", void 0);
__decorate([
    ObjectField({ description: 'Episode Id', isID: true }),
    __metadata("design:type", String)
], BookmarkBase.prototype, "episodeID", void 0);
__decorate([
    ObjectField({ description: 'Position in Audio', isID: true }),
    __metadata("design:type", Number)
], BookmarkBase.prototype, "position", void 0);
__decorate([
    ObjectField({ description: 'Comment', example: 'awesome!' }),
    __metadata("design:type", String)
], BookmarkBase.prototype, "comment", void 0);
__decorate([
    ObjectField({ description: 'Created Timestamp', min: 0, example: examples.timestamp }),
    __metadata("design:type", Number)
], BookmarkBase.prototype, "created", void 0);
__decorate([
    ObjectField({ description: 'Changed Timestamp', min: 0, example: examples.timestamp }),
    __metadata("design:type", Number)
], BookmarkBase.prototype, "changed", void 0);
BookmarkBase = __decorate([
    ResultType({ description: 'Bookmark Base' })
], BookmarkBase);
export { BookmarkBase };
let Bookmark = class Bookmark extends BookmarkBase {
};
__decorate([
    ObjectField(() => TrackBase, { nullable: true, description: 'The bookmarked Track' }),
    __metadata("design:type", TrackBase)
], Bookmark.prototype, "track", void 0);
__decorate([
    ObjectField(() => EpisodeBase, { nullable: true, description: 'The bookmarked Episode' }),
    __metadata("design:type", EpisodeBase)
], Bookmark.prototype, "episode", void 0);
Bookmark = __decorate([
    ResultType({ description: 'Bookmark' })
], Bookmark);
export { Bookmark };
let BookmarkPage = class BookmarkPage extends Page {
};
__decorate([
    ObjectField(() => Bookmark, { description: 'List of Bookmark' }),
    __metadata("design:type", Array)
], BookmarkPage.prototype, "items", void 0);
BookmarkPage = __decorate([
    ResultType({ description: 'Bookmark Page' })
], BookmarkPage);
export { BookmarkPage };
//# sourceMappingURL=bookmark.model.js.map