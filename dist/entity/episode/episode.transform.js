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
import { BaseTransformService } from '../base/base.transform';
import { DBObjectType, JamObjectType, PodcastStatus } from '../../types/enums';
import { EpisodeService } from './episode.service';
import { AudioModule } from '../../modules/audio/audio.module';
let EpisodeTransformService = class EpisodeTransformService extends BaseTransformService {
    async episodeBase(orm, o, episodeArgs, user) {
        const chapters = o.chaptersJSON ? JSON.parse(o.chaptersJSON) : undefined;
        const enclosures = o.enclosuresJSON ? JSON.parse(o.enclosuresJSON) : undefined;
        const podcast = await o.podcast.getOrFail();
        const tag = await o.tag.get();
        return {
            id: o.id,
            name: o.name,
            objType: JamObjectType.episode,
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
            status: this.episodeService.isDownloading(o.id) ? PodcastStatus.downloading : o.status,
            created: o.createdAt.valueOf(),
            duration: tag?.mediaDuration ?? o.duration ?? 0,
            tag: episodeArgs.episodeIncTag ? await this.mediaTag(orm, tag) : undefined,
            media: episodeArgs.episodeIncMedia ? await this.trackMedia(tag, o.fileSize) : undefined,
            tagRaw: episodeArgs.episodeIncRawTag && o.path ? await this.audioModule.readRawTag(o.path) : undefined,
            state: episodeArgs.episodeIncState ? await this.state(orm, o.id, DBObjectType.episode, user.id) : undefined
        };
    }
    episodeStatus(o) {
        return this.episodeService.isDownloading(o.id) ? { status: PodcastStatus.downloading } : { status: o.status, error: o.error };
    }
};
__decorate([
    Inject,
    __metadata("design:type", EpisodeService)
], EpisodeTransformService.prototype, "episodeService", void 0);
__decorate([
    Inject,
    __metadata("design:type", AudioModule)
], EpisodeTransformService.prototype, "audioModule", void 0);
EpisodeTransformService = __decorate([
    InRequestScope
], EpisodeTransformService);
export { EpisodeTransformService };
//# sourceMappingURL=episode.transform.js.map