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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PodcastService = void 0;
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const image_module_1 = require("../../modules/image/image.module");
const debounce_promises_1 = require("../../utils/debounce-promises");
const fs_utils_1 = require("../../utils/fs-utils");
const logger_1 = require("../../utils/logger");
const typescript_ioc_1 = require("typescript-ioc");
const orm_service_1 = require("../../modules/engine/services/orm.service");
const enums_1 = require("../../types/enums");
const config_service_1 = require("../../modules/engine/services/config.service");
const podcast_feed_1 = require("./podcast-feed");
const audio_module_1 = require("../../modules/audio/audio.module");
const episode_service_1 = require("../episode/episode.service");
const log = logger_1.logger('PodcastService');
let PodcastService = class PodcastService {
    constructor() {
        this.podcastRefreshDebounce = new debounce_promises_1.DebouncePromises();
        this.podcastsPath = this.configService.getDataPath(['podcasts']);
    }
    isDownloading(podcastId) {
        return this.podcastRefreshDebounce.isPending(podcastId);
    }
    async create(url) {
        const podcast = this.orm.Podcast.create({
            lastCheck: 0,
            url,
            name: url,
            categories: [],
            status: enums_1.PodcastStatus.new
        });
        await this.orm.orm.em.persistAndFlush(podcast);
        return podcast;
    }
    async remove(podcast) {
        const p = path_1.default.resolve(this.podcastsPath, podcast.id);
        await this.episodeService.removeEpisodes(podcast.id);
        await this.orm.Podcast.removeLater(podcast);
        await this.orm.orm.em.flush();
        await fs_utils_1.pathDeleteIfExists(p);
        await this.imageModule.clearImageCacheByIDs([podcast.id]);
    }
    async mergeEpisodes(podcast, episodes) {
        if ((!episodes) || (!episodes.length)) {
            return [];
        }
        const newEpisodes = [];
        const oldEpisodes = podcast.episodes.getItems();
        for (const epi of episodes) {
            let episode = oldEpisodes.find(e => e.guid === epi.guid);
            if (!episode) {
                episode = this.orm.Episode.create({
                    ...epi,
                    chapters: undefined,
                    enclosures: undefined,
                    status: enums_1.PodcastStatus.new,
                    podcast
                });
                newEpisodes.push(episode);
            }
            episode.podcast = podcast;
            episode.duration = epi.duration !== undefined ? epi.duration * 1000 : undefined;
            episode.chaptersJSON = epi.chapters && epi.chapters.length > 0 ? JSON.stringify(epi.chapters) : undefined;
            episode.enclosuresJSON = epi.enclosures && epi.enclosures.length > 0 ? JSON.stringify(epi.enclosures) : undefined;
            episode.date = epi.date ? epi.date.valueOf() : episode.date;
            episode.summary = epi.summary;
            episode.name = epi.name || episode.name;
            episode.guid = epi.guid || epi.link;
            episode.author = epi.author;
            this.orm.orm.em.persistLater(episode);
        }
        await this.orm.orm.em.flush();
        return newEpisodes;
    }
    async updatePodcast(podcast, tag, episodes) {
        podcast.name = tag.title || podcast.name;
        podcast.author = tag.author;
        podcast.description = tag.description;
        podcast.title = tag.title;
        podcast.link = tag.link;
        podcast.generator = tag.generator;
        podcast.language = tag.language;
        podcast.categories = tag.categories || [];
        if (podcast.image) {
            const imageFile = path_1.default.resolve(this.podcastsPath, podcast.id, podcast.image);
            if (!(await fs_extra_1.default.pathExists(imageFile))) {
                podcast.image = undefined;
            }
        }
        if (!podcast.image && tag.image) {
            log.info('Try downloading Podcast image');
            const podcastPath = path_1.default.resolve(this.podcastsPath, podcast.id);
            await fs_extra_1.default.ensureDir(podcastPath);
            try {
                podcast.image = await this.imageModule.storeImage(podcastPath, 'cover', tag.image);
            }
            catch (e) {
                podcast.image = undefined;
                log.info('Downloading Podcast image failed', e);
            }
        }
        const newEpisodes = await this.mergeEpisodes(podcast, episodes);
        log.info(`${podcast.url}: New Episodes: ${newEpisodes.length}`);
    }
    async refresh(podcast) {
        if (this.podcastRefreshDebounce.isPending(podcast.id)) {
            return this.podcastRefreshDebounce.append(podcast.id);
        }
        this.podcastRefreshDebounce.setPending(podcast.id);
        try {
            log.debug('Refreshing Podcast', podcast.url);
            const feed = new podcast_feed_1.Feed();
            try {
                const result = await feed.get(podcast);
                if (result) {
                    await this.updatePodcast(podcast, result.tag, result.episodes);
                    podcast.status = enums_1.PodcastStatus.completed;
                }
                else {
                    podcast.status = enums_1.PodcastStatus.error;
                    podcast.errorMessage = 'No Podcast Feed Data';
                }
            }
            catch (e) {
                log.info('Refreshing Podcast failed', e);
                podcast.status = enums_1.PodcastStatus.error;
                podcast.errorMessage = (e || '').toString();
            }
            podcast.lastCheck = Date.now();
            await this.orm.orm.em.persistAndFlush(podcast);
            this.podcastRefreshDebounce.resolve(podcast.id, undefined);
        }
        catch (e) {
            this.podcastRefreshDebounce.resolve(podcast.id, undefined);
            return Promise.reject(e);
        }
    }
    async refreshPodcasts() {
        log.info('Refreshing');
        const podcasts = await this.orm.Podcast.all();
        for (const podcast of podcasts) {
            await this.refresh(podcast);
        }
        log.info('Refreshed');
    }
    async getImage(podcast, size, format) {
        if (podcast.image) {
            return this.imageModule.get(podcast.id, path_1.default.join(this.podcastsPath, podcast.id, podcast.image), size, format);
        }
    }
    async getEpisodeImage(episode, size, format) {
        const result = await this.episodeService.getImage(episode, size, format);
        if (!result) {
            return this.getImage(episode.podcast, size, format);
        }
        return result;
    }
};
__decorate([
    typescript_ioc_1.Inject,
    __metadata("design:type", image_module_1.ImageModule)
], PodcastService.prototype, "imageModule", void 0);
__decorate([
    typescript_ioc_1.Inject,
    __metadata("design:type", audio_module_1.AudioModule)
], PodcastService.prototype, "audioModule", void 0);
__decorate([
    typescript_ioc_1.Inject,
    __metadata("design:type", config_service_1.ConfigService)
], PodcastService.prototype, "configService", void 0);
__decorate([
    typescript_ioc_1.Inject,
    __metadata("design:type", episode_service_1.EpisodeService)
], PodcastService.prototype, "episodeService", void 0);
__decorate([
    typescript_ioc_1.Inject,
    __metadata("design:type", orm_service_1.OrmService)
], PodcastService.prototype, "orm", void 0);
PodcastService = __decorate([
    typescript_ioc_1.Singleton,
    __metadata("design:paramtypes", [])
], PodcastService);
exports.PodcastService = PodcastService;
//# sourceMappingURL=podcast.service.js.map