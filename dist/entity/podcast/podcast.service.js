var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import fse from 'fs-extra';
import path from 'path';
import { ImageModule } from '../../modules/image/image.module';
import { DebouncePromises } from '../../utils/debounce-promises';
import { pathDeleteIfExists } from '../../utils/fs-utils';
import { logger } from '../../utils/logger';
import { Inject, InRequestScope } from 'typescript-ioc';
import { PodcastStatus } from '../../types/enums';
import { ConfigService } from '../../modules/engine/services/config.service';
import { Feed } from './podcast-feed';
import { AudioModule } from '../../modules/audio/audio.module';
import { EpisodeService } from '../episode/episode.service';
import { paginate } from '../base/base.utils';
const log = logger('PodcastService');
let PodcastService = class PodcastService {
    constructor() {
        this.podcastRefreshDebounce = new DebouncePromises();
        this.podcastsPath = this.configService.getDataPath(['podcasts']);
    }
    isDownloading(podcastId) {
        return this.podcastRefreshDebounce.isPending(podcastId);
    }
    async create(orm, url) {
        const podcast = orm.Podcast.create({
            lastCheck: new Date(),
            url,
            name: url,
            categories: [],
            status: PodcastStatus.new
        });
        await orm.Podcast.persistAndFlush(podcast);
        return podcast;
    }
    async remove(orm, podcast) {
        const p = path.resolve(this.podcastsPath, podcast.id);
        await this.episodeService.removeEpisodes(orm, podcast.id);
        await orm.Podcast.removeAndFlush(podcast);
        await pathDeleteIfExists(p);
        await this.imageModule.clearImageCacheByIDs([podcast.id]);
    }
    async mergeEpisodes(orm, podcast, episodes) {
        if ((!episodes) || (!episodes.length)) {
            return [];
        }
        const newEpisodes = [];
        const oldEpisodes = await podcast.episodes.getItems();
        for (const epi of episodes) {
            let episode = oldEpisodes.find(e => e.guid === epi.guid);
            if (!episode) {
                episode = orm.Episode.create({
                    ...epi,
                    chapters: undefined,
                    enclosures: undefined,
                    status: PodcastStatus.new
                });
                newEpisodes.push(episode);
            }
            await episode.podcast.set(podcast);
            episode.duration = epi.duration !== undefined ? epi.duration * 1000 : undefined;
            episode.chaptersJSON = epi.chapters && epi.chapters.length > 0 ? JSON.stringify(epi.chapters) : undefined;
            episode.enclosuresJSON = epi.enclosures && epi.enclosures.length > 0 ? JSON.stringify(epi.enclosures) : undefined;
            episode.date = epi.date ? epi.date : episode.date;
            episode.summary = epi.summary;
            episode.name = epi.name || episode.name;
            episode.guid = epi.guid || epi.link;
            episode.author = epi.author;
            orm.Episode.persistLater(episode);
        }
        await orm.em.flush();
        return newEpisodes;
    }
    async updatePodcast(orm, podcast, tag, episodes) {
        podcast.name = tag.title || podcast.name;
        podcast.author = tag.author;
        podcast.description = tag.description;
        podcast.title = tag.title;
        podcast.link = tag.link;
        podcast.generator = tag.generator;
        podcast.language = tag.language;
        podcast.categories = tag.categories || [];
        if (podcast.image) {
            const imageFile = path.resolve(this.podcastsPath, podcast.id, podcast.image);
            if (!(await fse.pathExists(imageFile))) {
                podcast.image = undefined;
            }
        }
        if (!podcast.image && tag.image) {
            log.info('Try downloading Podcast image');
            const podcastPath = path.resolve(this.podcastsPath, podcast.id);
            await fse.ensureDir(podcastPath);
            try {
                podcast.image = await this.imageModule.storeImage(podcastPath, 'cover', tag.image);
            }
            catch (e) {
                podcast.image = undefined;
                log.info('Downloading Podcast image failed', e);
            }
        }
        const newEpisodes = await this.mergeEpisodes(orm, podcast, episodes);
        log.info(`${podcast.url}: New Episodes: ${newEpisodes.length}`);
    }
    async refresh(orm, podcast) {
        if (this.podcastRefreshDebounce.isPending(podcast.id)) {
            return this.podcastRefreshDebounce.append(podcast.id);
        }
        this.podcastRefreshDebounce.setPending(podcast.id);
        try {
            log.debug('Refreshing Podcast', podcast.url);
            const feed = new Feed();
            try {
                const result = await feed.get(podcast);
                if (result) {
                    await this.updatePodcast(orm, podcast, result.tag, result.episodes);
                    podcast.status = PodcastStatus.completed;
                }
                else {
                    podcast.status = PodcastStatus.error;
                    podcast.errorMessage = 'No Podcast Feed Data';
                }
            }
            catch (e) {
                log.info('Refreshing Podcast failed', e);
                podcast.status = PodcastStatus.error;
                podcast.errorMessage = (e || '').toString();
            }
            podcast.lastCheck = new Date();
            await orm.Podcast.persistAndFlush(podcast);
            this.podcastRefreshDebounce.resolve(podcast.id, undefined);
        }
        catch (e) {
            this.podcastRefreshDebounce.resolve(podcast.id, undefined);
            return Promise.reject(e);
        }
    }
    async refreshPodcasts(orm) {
        log.info('Refreshing');
        const podcasts = await orm.Podcast.all();
        for (const podcast of podcasts) {
            await this.refresh(orm, podcast);
        }
        log.info('Refreshed');
    }
    async getImage(orm, podcast, size, format) {
        if (podcast.image) {
            return this.imageModule.get(podcast.id, path.join(this.podcastsPath, podcast.id, podcast.image), size, format);
        }
        return;
    }
    async getEpisodeImage(orm, episode, size, format) {
        const result = await this.episodeService.getImage(episode, size, format);
        if (!result) {
            return this.getImage(orm, await episode.podcast.getOrFail(), size, format);
        }
        return result;
    }
    async discoverTags(page) {
        const list = await this.audioModule.gpodder.tags(1000);
        return paginate(list, page);
    }
    async discoverByTag(tag, page) {
        const list = await this.audioModule.gpodder.byTag(tag, 100);
        return paginate(list, page);
    }
    async discover(name) {
        return this.audioModule.gpodder.search(name);
    }
    async discoverTop(page) {
        const list = await this.audioModule.gpodder.top(300);
        return paginate(list, page);
    }
};
__decorate([
    Inject,
    __metadata("design:type", ImageModule)
], PodcastService.prototype, "imageModule", void 0);
__decorate([
    Inject,
    __metadata("design:type", AudioModule)
], PodcastService.prototype, "audioModule", void 0);
__decorate([
    Inject,
    __metadata("design:type", ConfigService)
], PodcastService.prototype, "configService", void 0);
__decorate([
    Inject,
    __metadata("design:type", EpisodeService)
], PodcastService.prototype, "episodeService", void 0);
PodcastService = __decorate([
    InRequestScope,
    __metadata("design:paramtypes", [])
], PodcastService);
export { PodcastService };
//# sourceMappingURL=podcast.service.js.map