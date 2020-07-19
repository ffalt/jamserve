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
exports.PodcastIndex = exports.PodcastIndexGroup = exports.PodcastIndexEntry = exports.PodcastUpdateStatus = exports.PodcastPage = exports.Podcast = exports.PodcastBase = void 0;
const decorators_1 = require("../../modules/rest/decorators");
const example_consts_1 = require("../../modules/engine/rest/example.consts");
const enums_1 = require("../../types/enums");
const base_model_1 = require("../base/base.model");
const episode_model_1 = require("../episode/episode.model");
let PodcastBase = class PodcastBase extends base_model_1.Base {
};
__decorate([
    decorators_1.ObjField({ description: 'Podcast Feed URL', example: 'https://podcast.example.com/feed.xml' }),
    __metadata("design:type", String)
], PodcastBase.prototype, "url", void 0);
__decorate([
    decorators_1.ObjField(() => enums_1.PodcastStatus, { description: 'Podcast Status', example: enums_1.PodcastStatus.downloading }),
    __metadata("design:type", String)
], PodcastBase.prototype, "status", void 0);
__decorate([
    decorators_1.ObjField({ nullable: true, description: 'Last Check Timestamp', example: example_consts_1.examples.timestamp }),
    __metadata("design:type", Number)
], PodcastBase.prototype, "lastCheck", void 0);
__decorate([
    decorators_1.ObjField({ nullable: true, description: 'Podcast Download Error (if any)', example: 'URL not found' }),
    __metadata("design:type", String)
], PodcastBase.prototype, "error", void 0);
__decorate([
    decorators_1.ObjField({ nullable: true, description: 'Podcast Summary', example: 'Best Podcast ever!' }),
    __metadata("design:type", String)
], PodcastBase.prototype, "description", void 0);
__decorate([
    decorators_1.ObjField(() => [String], { nullable: true, description: 'List of Episode Ids', isID: true }),
    __metadata("design:type", Array)
], PodcastBase.prototype, "episodeIDs", void 0);
__decorate([
    decorators_1.ObjField({ nullable: true, description: 'Number of Episode', min: 0, example: 5 }),
    __metadata("design:type", Number)
], PodcastBase.prototype, "episodeCount", void 0);
PodcastBase = __decorate([
    decorators_1.ResultType({ description: 'Podcast Base' })
], PodcastBase);
exports.PodcastBase = PodcastBase;
let Podcast = class Podcast extends PodcastBase {
};
__decorate([
    decorators_1.ObjField(() => [episode_model_1.EpisodeBase], { nullable: true, description: 'List of Episodes' }),
    __metadata("design:type", Array)
], Podcast.prototype, "episodes", void 0);
Podcast = __decorate([
    decorators_1.ResultType({ description: 'Podcast' })
], Podcast);
exports.Podcast = Podcast;
let PodcastPage = class PodcastPage extends base_model_1.Page {
};
__decorate([
    decorators_1.ObjField(() => Podcast, { description: 'List of Podcasts' }),
    __metadata("design:type", Array)
], PodcastPage.prototype, "items", void 0);
PodcastPage = __decorate([
    decorators_1.ResultType({ description: 'Podcast Page' })
], PodcastPage);
exports.PodcastPage = PodcastPage;
let PodcastUpdateStatus = class PodcastUpdateStatus {
};
__decorate([
    decorators_1.ObjField(() => enums_1.PodcastStatus, { description: 'Podcast Status', example: enums_1.PodcastStatus.downloading }),
    __metadata("design:type", String)
], PodcastUpdateStatus.prototype, "status", void 0);
__decorate([
    decorators_1.ObjField({ nullable: true, description: 'Feed Download Error (if any)', example: 'Not a feed' }),
    __metadata("design:type", String)
], PodcastUpdateStatus.prototype, "error", void 0);
__decorate([
    decorators_1.ObjField({ nullable: true, description: 'Last Check Timestamp', example: example_consts_1.examples.timestamp }),
    __metadata("design:type", Number)
], PodcastUpdateStatus.prototype, "lastCheck", void 0);
PodcastUpdateStatus = __decorate([
    decorators_1.ResultType({ description: 'Podcast Status Data' })
], PodcastUpdateStatus);
exports.PodcastUpdateStatus = PodcastUpdateStatus;
let PodcastIndexEntry = class PodcastIndexEntry {
};
__decorate([
    decorators_1.ObjField({ description: 'ID', isID: true }),
    __metadata("design:type", String)
], PodcastIndexEntry.prototype, "id", void 0);
__decorate([
    decorators_1.ObjField({ description: 'Name', example: 'Mars Volta' }),
    __metadata("design:type", String)
], PodcastIndexEntry.prototype, "name", void 0);
__decorate([
    decorators_1.ObjField({ description: 'Episode Count', min: 0, example: 55 }),
    __metadata("design:type", Number)
], PodcastIndexEntry.prototype, "episodeCount", void 0);
PodcastIndexEntry = __decorate([
    decorators_1.ResultType({ description: 'Podcast Index Entry' })
], PodcastIndexEntry);
exports.PodcastIndexEntry = PodcastIndexEntry;
let PodcastIndexGroup = class PodcastIndexGroup {
};
__decorate([
    decorators_1.ObjField({ description: 'Podcast Group Name', example: 'P' }),
    __metadata("design:type", String)
], PodcastIndexGroup.prototype, "name", void 0);
__decorate([
    decorators_1.ObjField(() => [PodcastIndexEntry]),
    __metadata("design:type", Array)
], PodcastIndexGroup.prototype, "items", void 0);
PodcastIndexGroup = __decorate([
    decorators_1.ResultType({ description: 'Podcast Index Group' })
], PodcastIndexGroup);
exports.PodcastIndexGroup = PodcastIndexGroup;
let PodcastIndex = class PodcastIndex {
};
__decorate([
    decorators_1.ObjField({ description: 'Last Change Timestamp' }),
    __metadata("design:type", Number)
], PodcastIndex.prototype, "lastModified", void 0);
__decorate([
    decorators_1.ObjField(() => [PodcastIndexGroup], { description: 'Podcast Index Groups' }),
    __metadata("design:type", Array)
], PodcastIndex.prototype, "groups", void 0);
PodcastIndex = __decorate([
    decorators_1.ResultType({ description: 'Podcast Index' })
], PodcastIndex);
exports.PodcastIndex = PodcastIndex;
//# sourceMappingURL=podcast.model.js.map