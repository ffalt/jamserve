var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { examples } from '../../modules/engine/rest/example.consts.js';
import { PodcastStatus } from '../../types/enums.js';
import { Base, Page } from '../base/base.model.js';
import { EpisodeBase } from '../episode/episode.model.js';
import { ResultType } from '../../modules/rest/decorators/ResultType.js';
import { ObjField } from '../../modules/rest/decorators/ObjField.js';
let PodcastBase = class PodcastBase extends Base {
};
__decorate([
    ObjField({ description: 'Podcast Feed URL', example: 'https://podcast.example.com/feed.xml' }),
    __metadata("design:type", String)
], PodcastBase.prototype, "url", void 0);
__decorate([
    ObjField(() => PodcastStatus, { description: 'Podcast Status', example: PodcastStatus.downloading }),
    __metadata("design:type", String)
], PodcastBase.prototype, "status", void 0);
__decorate([
    ObjField({ nullable: true, description: 'Last Check Timestamp', example: examples.timestamp }),
    __metadata("design:type", Number)
], PodcastBase.prototype, "lastCheck", void 0);
__decorate([
    ObjField({ nullable: true, description: 'Podcast Download Error (if any)', example: 'URL not found' }),
    __metadata("design:type", String)
], PodcastBase.prototype, "error", void 0);
__decorate([
    ObjField({ nullable: true, description: 'Podcast Summary', example: 'Best Podcast ever!' }),
    __metadata("design:type", String)
], PodcastBase.prototype, "description", void 0);
__decorate([
    ObjField(() => [String], { nullable: true, description: 'List of Episode Ids', isID: true }),
    __metadata("design:type", Array)
], PodcastBase.prototype, "episodeIDs", void 0);
__decorate([
    ObjField({ nullable: true, description: 'Number of Episode', min: 0, example: 5 }),
    __metadata("design:type", Number)
], PodcastBase.prototype, "episodeCount", void 0);
PodcastBase = __decorate([
    ResultType({ description: 'Podcast Base' })
], PodcastBase);
export { PodcastBase };
let Podcast = class Podcast extends PodcastBase {
};
__decorate([
    ObjField(() => [EpisodeBase], { nullable: true, description: 'List of Episodes' }),
    __metadata("design:type", Array)
], Podcast.prototype, "episodes", void 0);
Podcast = __decorate([
    ResultType({ description: 'Podcast' })
], Podcast);
export { Podcast };
let PodcastPage = class PodcastPage extends Page {
};
__decorate([
    ObjField(() => Podcast, { description: 'List of Podcasts' }),
    __metadata("design:type", Array)
], PodcastPage.prototype, "items", void 0);
PodcastPage = __decorate([
    ResultType({ description: 'Podcast Page' })
], PodcastPage);
export { PodcastPage };
let PodcastUpdateStatus = class PodcastUpdateStatus {
};
__decorate([
    ObjField(() => PodcastStatus, { description: 'Podcast Status', example: PodcastStatus.downloading }),
    __metadata("design:type", String)
], PodcastUpdateStatus.prototype, "status", void 0);
__decorate([
    ObjField({ nullable: true, description: 'Feed Download Error (if any)', example: 'Not a feed' }),
    __metadata("design:type", String)
], PodcastUpdateStatus.prototype, "error", void 0);
__decorate([
    ObjField({ nullable: true, description: 'Last Check Timestamp', example: examples.timestamp }),
    __metadata("design:type", Number)
], PodcastUpdateStatus.prototype, "lastCheck", void 0);
PodcastUpdateStatus = __decorate([
    ResultType({ description: 'Podcast Status Data' })
], PodcastUpdateStatus);
export { PodcastUpdateStatus };
let PodcastIndexEntry = class PodcastIndexEntry {
};
__decorate([
    ObjField({ description: 'ID', isID: true }),
    __metadata("design:type", String)
], PodcastIndexEntry.prototype, "id", void 0);
__decorate([
    ObjField({ description: 'Name', example: 'Mars Volta' }),
    __metadata("design:type", String)
], PodcastIndexEntry.prototype, "name", void 0);
__decorate([
    ObjField({ description: 'Episode Count', min: 0, example: 55 }),
    __metadata("design:type", Number)
], PodcastIndexEntry.prototype, "episodeCount", void 0);
PodcastIndexEntry = __decorate([
    ResultType({ description: 'Podcast Index Entry' })
], PodcastIndexEntry);
export { PodcastIndexEntry };
let PodcastIndexGroup = class PodcastIndexGroup {
};
__decorate([
    ObjField({ description: 'Podcast Group Name', example: 'P' }),
    __metadata("design:type", String)
], PodcastIndexGroup.prototype, "name", void 0);
__decorate([
    ObjField(() => [PodcastIndexEntry]),
    __metadata("design:type", Array)
], PodcastIndexGroup.prototype, "items", void 0);
PodcastIndexGroup = __decorate([
    ResultType({ description: 'Podcast Index Group' })
], PodcastIndexGroup);
export { PodcastIndexGroup };
let PodcastIndex = class PodcastIndex {
};
__decorate([
    ObjField({ description: 'Last Change Timestamp' }),
    __metadata("design:type", Number)
], PodcastIndex.prototype, "lastModified", void 0);
__decorate([
    ObjField(() => [PodcastIndexGroup], { description: 'Podcast Index Groups' }),
    __metadata("design:type", Array)
], PodcastIndex.prototype, "groups", void 0);
PodcastIndex = __decorate([
    ResultType({ description: 'Podcast Index' })
], PodcastIndex);
export { PodcastIndex };
let PodcastDiscover = class PodcastDiscover {
};
__decorate([
    ObjField(),
    __metadata("design:type", String)
], PodcastDiscover.prototype, "url", void 0);
__decorate([
    ObjField(),
    __metadata("design:type", String)
], PodcastDiscover.prototype, "title", void 0);
__decorate([
    ObjField(),
    __metadata("design:type", String)
], PodcastDiscover.prototype, "author", void 0);
__decorate([
    ObjField(),
    __metadata("design:type", String)
], PodcastDiscover.prototype, "description", void 0);
__decorate([
    ObjField(),
    __metadata("design:type", Number)
], PodcastDiscover.prototype, "subscribers", void 0);
__decorate([
    ObjField(),
    __metadata("design:type", Number)
], PodcastDiscover.prototype, "subscribers_last_week", void 0);
__decorate([
    ObjField(),
    __metadata("design:type", String)
], PodcastDiscover.prototype, "logo_url", void 0);
__decorate([
    ObjField(),
    __metadata("design:type", String)
], PodcastDiscover.prototype, "scaled_logo_url", void 0);
__decorate([
    ObjField(),
    __metadata("design:type", String)
], PodcastDiscover.prototype, "website", void 0);
__decorate([
    ObjField(),
    __metadata("design:type", String)
], PodcastDiscover.prototype, "mygpo_link", void 0);
PodcastDiscover = __decorate([
    ResultType({ description: 'Podcast Discover Result' })
], PodcastDiscover);
export { PodcastDiscover };
let PodcastDiscoverPage = class PodcastDiscoverPage extends Page {
};
__decorate([
    ObjField(() => PodcastDiscover, { description: 'List of Podcasts' }),
    __metadata("design:type", Array)
], PodcastDiscoverPage.prototype, "items", void 0);
PodcastDiscoverPage = __decorate([
    ResultType({ description: 'Podcast Discover Page' })
], PodcastDiscoverPage);
export { PodcastDiscoverPage };
let PodcastDiscoverTag = class PodcastDiscoverTag {
};
__decorate([
    ObjField(),
    __metadata("design:type", String)
], PodcastDiscoverTag.prototype, "title", void 0);
__decorate([
    ObjField(),
    __metadata("design:type", String)
], PodcastDiscoverTag.prototype, "tag", void 0);
__decorate([
    ObjField(),
    __metadata("design:type", Number)
], PodcastDiscoverTag.prototype, "usage", void 0);
PodcastDiscoverTag = __decorate([
    ResultType({ description: 'Podcast Discover Tag' })
], PodcastDiscoverTag);
export { PodcastDiscoverTag };
let PodcastDiscoverTagPage = class PodcastDiscoverTagPage extends Page {
};
__decorate([
    ObjField(() => PodcastDiscoverTag, { description: 'List of Podcast Tags' }),
    __metadata("design:type", Array)
], PodcastDiscoverTagPage.prototype, "items", void 0);
PodcastDiscoverTagPage = __decorate([
    ResultType({ description: 'Podcast Discover Tags Page' })
], PodcastDiscoverTagPage);
export { PodcastDiscoverTagPage };
//# sourceMappingURL=podcast.model.js.map