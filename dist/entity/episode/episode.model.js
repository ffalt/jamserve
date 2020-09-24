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
exports.EpisodeUpdateStatus = exports.EpisodePage = exports.Episode = exports.EpisodeBase = exports.EpisodeChapter = void 0;
const decorators_1 = require("../../modules/rest/decorators");
const example_consts_1 = require("../../modules/engine/rest/example.consts");
const enums_1 = require("../../types/enums");
const tag_model_1 = require("../tag/tag.model");
const podcast_model_1 = require("../podcast/podcast.model");
const base_model_1 = require("../base/base.model");
let EpisodeChapter = class EpisodeChapter {
};
__decorate([
    decorators_1.ObjField({ description: 'Chapter Start Time', min: 0, example: 12345 }),
    __metadata("design:type", Number)
], EpisodeChapter.prototype, "start", void 0);
__decorate([
    decorators_1.ObjField({ description: 'Chapter Title', example: 'Topic: Awesomeness' }),
    __metadata("design:type", String)
], EpisodeChapter.prototype, "title", void 0);
EpisodeChapter = __decorate([
    decorators_1.ResultType({ description: 'Episode Chapter' })
], EpisodeChapter);
exports.EpisodeChapter = EpisodeChapter;
let EpisodeBase = class EpisodeBase extends tag_model_1.MediaBase {
};
__decorate([
    decorators_1.ObjField({ description: 'Podcast Id', isID: true }),
    __metadata("design:type", String)
], EpisodeBase.prototype, "podcastID", void 0);
__decorate([
    decorators_1.ObjField({ description: 'Podcast Name', example: 'Awesome Podcast' }),
    __metadata("design:type", String)
], EpisodeBase.prototype, "podcastName", void 0);
__decorate([
    decorators_1.ObjField(() => enums_1.PodcastStatus, { description: 'Episode Status', example: enums_1.PodcastStatus.downloading }),
    __metadata("design:type", String)
], EpisodeBase.prototype, "status", void 0);
__decorate([
    decorators_1.ObjField({ description: 'Published Timestamp', min: 0, example: example_consts_1.examples.timestamp }),
    __metadata("design:type", Number)
], EpisodeBase.prototype, "date", void 0);
__decorate([
    decorators_1.ObjField({ nullable: true, description: 'Episode Summary', example: 'Best Episode ever!' }),
    __metadata("design:type", String)
], EpisodeBase.prototype, "summary", void 0);
__decorate([
    decorators_1.ObjField({ nullable: true, description: 'Episode GUID', example: 'podlove-2018-04-12t11:08:02+00:00-b3bea1e7437bda4' }),
    __metadata("design:type", String)
], EpisodeBase.prototype, "guid", void 0);
__decorate([
    decorators_1.ObjField({ nullable: true, description: 'Episode Author', example: 'Poddy McPodcastface' }),
    __metadata("design:type", String)
], EpisodeBase.prototype, "author", void 0);
__decorate([
    decorators_1.ObjField({ nullable: true, description: 'Episode Link', example: 'https://podcast.example.com/epsiodes/episode001.html' }),
    __metadata("design:type", String)
], EpisodeBase.prototype, "link", void 0);
__decorate([
    decorators_1.ObjField({ nullable: true, description: 'Episode File Link', example: 'https://podcast.example.com/epsiodes/episode001.mp3' }),
    __metadata("design:type", String)
], EpisodeBase.prototype, "url", void 0);
__decorate([
    decorators_1.ObjField({ nullable: true, description: 'Episode Download Error (if any)', example: 'URL not found' }),
    __metadata("design:type", String)
], EpisodeBase.prototype, "error", void 0);
__decorate([
    decorators_1.ObjField(() => EpisodeChapter, { nullable: true, description: 'Episode Chapters' }),
    __metadata("design:type", Array)
], EpisodeBase.prototype, "chapters", void 0);
EpisodeBase = __decorate([
    decorators_1.ResultType({ description: 'Episode' })
], EpisodeBase);
exports.EpisodeBase = EpisodeBase;
let Episode = class Episode extends EpisodeBase {
};
__decorate([
    decorators_1.ObjField(() => podcast_model_1.PodcastBase, { nullable: true, description: 'Podcast', isID: true }),
    __metadata("design:type", podcast_model_1.PodcastBase)
], Episode.prototype, "podcast", void 0);
Episode = __decorate([
    decorators_1.ResultType({ description: 'Episode' })
], Episode);
exports.Episode = Episode;
let EpisodePage = class EpisodePage extends base_model_1.Page {
};
__decorate([
    decorators_1.ObjField(() => Episode, { description: 'List of Episodes' }),
    __metadata("design:type", Array)
], EpisodePage.prototype, "items", void 0);
EpisodePage = __decorate([
    decorators_1.ResultType({ description: 'Episodes Page' })
], EpisodePage);
exports.EpisodePage = EpisodePage;
let EpisodeUpdateStatus = class EpisodeUpdateStatus {
};
__decorate([
    decorators_1.ObjField(() => enums_1.PodcastStatus, { description: 'Episode Status', example: enums_1.PodcastStatus.downloading }),
    __metadata("design:type", String)
], EpisodeUpdateStatus.prototype, "status", void 0);
__decorate([
    decorators_1.ObjField({ nullable: true, description: 'Episode Download Error (if any)', example: 'URL not found' }),
    __metadata("design:type", String)
], EpisodeUpdateStatus.prototype, "error", void 0);
EpisodeUpdateStatus = __decorate([
    decorators_1.ResultType({ description: 'Episode Status Data' })
], EpisodeUpdateStatus);
exports.EpisodeUpdateStatus = EpisodeUpdateStatus;
//# sourceMappingURL=episode.model.js.map