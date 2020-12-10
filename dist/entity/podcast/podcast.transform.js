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
exports.PodcastTransformService = void 0;
const typescript_ioc_1 = require("typescript-ioc");
const base_transform_1 = require("../base/base.transform");
const enums_1 = require("../../types/enums");
const podcast_service_1 = require("./podcast.service");
let PodcastTransformService = class PodcastTransformService extends base_transform_1.BaseTransformService {
    async podcastBase(orm, o, podcastArgs, user) {
        return {
            id: o.id,
            name: o.name,
            created: o.createdAt.valueOf(),
            url: o.url,
            status: this.podcastService.isDownloading(o.id) ? enums_1.PodcastStatus.downloading : o.status,
            lastCheck: o.lastCheck ? o.lastCheck.valueOf() : undefined,
            error: o.errorMessage,
            description: o.description,
            episodeIDs: podcastArgs.podcastIncEpisodeIDs ? (await o.episodes.getItems()).map(t => t.id) : undefined,
            episodeCount: podcastArgs.podcastIncEpisodeCount ? await o.episodes.count() : undefined,
            state: podcastArgs.podcastIncState ? await this.state(orm, o.id, enums_1.DBObjectType.podcast, user.id) : undefined
        };
    }
    async podcastIndex(orm, result) {
        return this.index(result, async (item) => {
            return {
                id: item.id,
                name: item.name,
                episodeCount: await item.episodes.count()
            };
        });
    }
    podcastStatus(o) {
        return this.podcastService.isDownloading(o.id) ? { status: enums_1.PodcastStatus.downloading } : { status: o.status, error: o.errorMessage, lastCheck: o.lastCheck ? o.lastCheck.valueOf() : undefined };
    }
};
__decorate([
    typescript_ioc_1.Inject,
    __metadata("design:type", podcast_service_1.PodcastService)
], PodcastTransformService.prototype, "podcastService", void 0);
PodcastTransformService = __decorate([
    typescript_ioc_1.InRequestScope
], PodcastTransformService);
exports.PodcastTransformService = PodcastTransformService;
//# sourceMappingURL=podcast.transform.js.map