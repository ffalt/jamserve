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
exports.EpisodeTransformService = void 0;
const typescript_ioc_1 = require("typescript-ioc");
const base_transform_1 = require("../base/base.transform");
const enums_1 = require("../../types/enums");
const episode_service_1 = require("./episode.service");
const audio_module_1 = require("../../modules/audio/audio.module");
let EpisodeTransformService = class EpisodeTransformService extends base_transform_1.BaseTransformService {
    async episodeBase(orm, o, episodeArgs, user) {
        var _a, _b;
        const chapters = o.chaptersJSON ? JSON.parse(o.chaptersJSON) : undefined;
        const enclosures = o.enclosuresJSON ? JSON.parse(o.enclosuresJSON) : undefined;
        const podcast = await o.podcast.getOrFail();
        const tag = await o.tag.get();
        return {
            id: o.id,
            name: o.name,
            objType: enums_1.JamObjectType.episode,
            date: o.date.valueOf(),
            summary: o.summary,
            author: o.author,
            error: o.error,
            chapters,
            url: enclosures ? enclosures[0].url : undefined,
            link: o.link,
            guid: o.guid,
            podcastID: podcast.id,
            podcastName: podcast.name,
            status: this.episodeService.isDownloading(o.id) ? enums_1.PodcastStatus.downloading : o.status,
            created: o.createdAt.valueOf(),
            duration: (_b = (_a = tag === null || tag === void 0 ? void 0 : tag.mediaDuration) !== null && _a !== void 0 ? _a : o.duration) !== null && _b !== void 0 ? _b : 0,
            tag: episodeArgs.episodeIncTag ? await this.mediaTag(orm, tag) : undefined,
            media: episodeArgs.episodeIncMedia ? await this.trackMedia(tag, o.fileSize) : undefined,
            tagRaw: episodeArgs.episodeIncRawTag && o.path ? await this.audioModule.readRawTag(o.path) : undefined,
            state: episodeArgs.episodeIncState ? await this.state(orm, o.id, enums_1.DBObjectType.episode, user.id) : undefined
        };
    }
    episodeStatus(o) {
        return this.episodeService.isDownloading(o.id) ? { status: enums_1.PodcastStatus.downloading } : { status: o.status, error: o.error };
    }
};
__decorate([
    typescript_ioc_1.Inject,
    __metadata("design:type", episode_service_1.EpisodeService)
], EpisodeTransformService.prototype, "episodeService", void 0);
__decorate([
    typescript_ioc_1.Inject,
    __metadata("design:type", audio_module_1.AudioModule)
], EpisodeTransformService.prototype, "audioModule", void 0);
EpisodeTransformService = __decorate([
    typescript_ioc_1.InRequestScope
], EpisodeTransformService);
exports.EpisodeTransformService = EpisodeTransformService;
//# sourceMappingURL=episode.transform.js.map