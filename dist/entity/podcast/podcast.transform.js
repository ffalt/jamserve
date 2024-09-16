var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Inject, InRequestScope } from 'typescript-ioc';
import { BaseTransformService } from '../base/base.transform.js';
import { DBObjectType, PodcastStatus } from '../../types/enums.js';
import { PodcastService } from './podcast.service.js';
let PodcastTransformService = class PodcastTransformService extends BaseTransformService {
    async podcastBase(orm, o, podcastArgs, user) {
        return {
            id: o.id,
            name: o.name,
            created: o.createdAt.valueOf(),
            url: o.url,
            status: this.podcastService.isDownloading(o.id) ? PodcastStatus.downloading : o.status,
            lastCheck: o.lastCheck ? o.lastCheck.valueOf() : undefined,
            error: o.errorMessage,
            description: o.description,
            episodeIDs: podcastArgs.podcastIncEpisodeIDs ? await o.episodes.getIDs() : undefined,
            episodeCount: podcastArgs.podcastIncEpisodeCount ? await o.episodes.count() : undefined,
            state: podcastArgs.podcastIncState ? await this.state(orm, o.id, DBObjectType.podcast, user.id) : undefined
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
        return this.podcastService.isDownloading(o.id) ? { status: PodcastStatus.downloading } : { status: o.status, error: o.errorMessage, lastCheck: o.lastCheck ? o.lastCheck.valueOf() : undefined };
    }
};
__decorate([
    Inject,
    __metadata("design:type", PodcastService)
], PodcastTransformService.prototype, "podcastService", void 0);
PodcastTransformService = __decorate([
    InRequestScope
], PodcastTransformService);
export { PodcastTransformService };
//# sourceMappingURL=podcast.transform.js.map