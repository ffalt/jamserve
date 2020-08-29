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
exports.EpisodeService = void 0;
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const audio_module_1 = require("../../modules/audio/audio.module");
const image_module_1 = require("../../modules/image/image.module");
const download_1 = require("../../utils/download");
const filetype_1 = require("../../utils/filetype");
const fs_utils_1 = require("../../utils/fs-utils");
const logger_1 = require("../../utils/logger");
const typescript_ioc_1 = require("typescript-ioc");
const debounce_promises_1 = require("../../utils/debounce-promises");
const enums_1 = require("../../types/enums");
const config_service_1 = require("../../modules/engine/services/config.service");
const log = logger_1.logger('EpisodeService');
let EpisodeService = class EpisodeService {
    constructor() {
        this.episodeDownloadDebounce = new debounce_promises_1.DebouncePromises();
        this.podcastsPath = this.configService.getDataPath(['podcasts']);
    }
    isDownloading(podcastEpisodeId) {
        return this.episodeDownloadDebounce.isPending(podcastEpisodeId);
    }
    async downloadEpisodeFile(episode) {
        let url = '';
        const enclosures = episode.enclosuresJSON ? JSON.parse(episode.enclosuresJSON) : undefined;
        if (enclosures && enclosures.length > 0) {
            url = enclosures[0].url;
        }
        else {
            throw new Error('No podcast episode url found');
        }
        let suffix = fs_utils_1.fileSuffix(url);
        if (suffix.includes('?')) {
            suffix = suffix.slice(0, suffix.indexOf('?'));
        }
        if (!filetype_1.SupportedAudioFormat.includes(suffix)) {
            throw new Error(`Unsupported Podcast audio format .${suffix}`);
        }
        const podcastID = episode.podcast.idOrFail();
        const p = path_1.default.resolve(this.podcastsPath, podcastID);
        await fs_extra_1.default.ensureDir(p);
        const filename = path_1.default.join(p, `${episode.id}.${suffix}`);
        log.info('retrieving file', url);
        await download_1.downloadFile(url, filename);
        return filename;
    }
    async downloadEpisode(orm, episode) {
        if (this.episodeDownloadDebounce.isPending(episode.id)) {
            return this.episodeDownloadDebounce.append(episode.id);
        }
        this.episodeDownloadDebounce.setPending(episode.id);
        try {
            try {
                const filename = await this.downloadEpisodeFile(episode);
                const stat = await fs_extra_1.default.stat(filename);
                const result = await this.audioModule.read(filename);
                const oldTag = await episode.tag.get();
                if (oldTag) {
                    orm.Tag.removeLater(oldTag);
                }
                const tag = orm.Tag.createByScan(result, filename);
                orm.Tag.persistLater(tag);
                await episode.tag.set(tag);
                episode.status = enums_1.PodcastStatus.completed;
                episode.statCreated = stat.ctime;
                episode.statModified = stat.mtime;
                episode.fileSize = stat.size;
                episode.duration = result.mediaDuration;
                episode.path = filename;
            }
            catch (e) {
                episode.status = enums_1.PodcastStatus.error;
                episode.error = (e || '').toString();
            }
            await orm.Episode.persistAndFlush(episode);
            this.episodeDownloadDebounce.resolve(episode.id, undefined);
        }
        catch (e) {
            this.episodeDownloadDebounce.resolve(episode.id, undefined);
            return Promise.reject(e);
        }
    }
    async removeEpisodes(orm, podcastID) {
        const removeEpisodes = await orm.Episode.find({ where: { podcast: podcastID } });
        await this.imageModule.clearImageCacheByIDs(removeEpisodes.map(it => it.id));
        for (const episode of removeEpisodes) {
            orm.Episode.removeLater(episode);
            if (episode.path) {
                await fs_utils_1.fileDeleteIfExists(episode.path);
            }
        }
    }
    async deleteEpisode(orm, episode) {
        if (!episode.path) {
            return;
        }
        await fs_utils_1.fileDeleteIfExists(episode.path);
        const tag = await episode.tag.get();
        if (tag) {
            orm.Tag.removeLater(tag);
        }
        await episode.tag.set(undefined);
        episode.path = undefined;
        episode.statCreated = undefined;
        episode.statModified = undefined;
        episode.fileSize = undefined;
        episode.status = enums_1.PodcastStatus.deleted;
        await orm.Episode.persistAndFlush(episode);
    }
    async getImage(episode, size, format) {
        if (!episode.path) {
            return;
        }
        const tag = await episode.tag.get();
        if (tag && tag.nrTagImages) {
            const result = await this.imageModule.getExisting(episode.id, size, format);
            if (result) {
                return result;
            }
            try {
                const buffer = await this.audioModule.extractTagImage(episode.path);
                if (buffer) {
                    return await this.imageModule.getBuffer(episode.id, buffer, size, format);
                }
            }
            catch (e) {
                log.error('getImage', 'Extracting image from audio failed: ' + episode.path);
            }
        }
    }
    async countEpisodes(orm, podcastID) {
        return await orm.Episode.count({ where: { podcast: podcastID } });
    }
};
__decorate([
    typescript_ioc_1.Inject,
    __metadata("design:type", audio_module_1.AudioModule)
], EpisodeService.prototype, "audioModule", void 0);
__decorate([
    typescript_ioc_1.Inject,
    __metadata("design:type", image_module_1.ImageModule)
], EpisodeService.prototype, "imageModule", void 0);
__decorate([
    typescript_ioc_1.Inject,
    __metadata("design:type", config_service_1.ConfigService)
], EpisodeService.prototype, "configService", void 0);
EpisodeService = __decorate([
    typescript_ioc_1.InRequestScope,
    __metadata("design:paramtypes", [])
], EpisodeService);
exports.EpisodeService = EpisodeService;
//# sourceMappingURL=episode.service.js.map